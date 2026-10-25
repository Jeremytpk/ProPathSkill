import { Router, type Express, type NextFunction, type Request, type Response } from "express";
import { randomBytes } from "crypto";
import serverless from "serverless-http";
import { adminDb } from "./auth";

/**
 * Long AI requests as background jobs.
 *
 * Netlify Functions must answer within about 10 seconds, but ProPath AI requests take
 * 15–90 seconds. When jobs are on, these requests are stored, answered at once with a job
 * ID, and run by a background function through the same Express routes. The app then
 * fetches the result (see authedFetch). Locally, jobs run in-process.
 */

const SLOW_ROUTES = new Set([
  "/api/career/report",
  "/api/learning-plan",
  "/api/generate-course-content",
  "/api/skill-course",
  "/api/ask-tutor",
  "/api/project/plan",
  "/api/project/assist",
  "/api/project/document",
]);

const onLambda = () => Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
export const jobsEnabled = () => onLambda() || process.env.PROPATH_ASYNC_JOBS === "true";

/** Background functions get 15 minutes; anything older than this has died. */
const STALE_MS = 16 * 60 * 1000;

export async function enqueueSlowRequests(req: Request, res: Response, next: NextFunction) {
  if (!jobsEnabled() || req.method !== "POST" || !SLOW_ROUTES.has(req.path) || req.headers["x-propath-job"] || !adminDb) {
    return next();
  }
  try {
    const id = randomBytes(16).toString("hex");
    await adminDb.collection("jobs").doc(id).set({
      status: "queued",
      path: req.originalUrl,
      body: JSON.stringify(req.body ?? {}),
      // Kept only until the job runs, then deleted.
      headers: {
        "content-type": "application/json",
        ...(req.headers.authorization ? { authorization: req.headers.authorization } : {}),
        ...(req.headers["x-admin-key"] ? { "x-admin-key": String(req.headers["x-admin-key"]) } : {}),
        // Keeps per-visitor rate limits working inside the worker.
        "x-forwarded-for": req.ip || "",
      },
      uid: req.user?.uid ?? null,
      createdAt: Date.now(),
    });
    await triggerJob(req, id);
    res.status(202).json({ jobId: id });
  } catch (err: any) {
    console.error("[jobs] enqueue:", err.message);
    next();
  }
}

async function triggerJob(req: Request, id: string) {
  if (onLambda()) {
    // Background functions reply 202 at once and keep running for up to 15 minutes.
    const base = `${req.protocol}://${req.get("host")}`;
    const res = await fetch(`${base}/.netlify/functions/ai-worker-background`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });
    if (!res.ok && res.status !== 202) throw new Error(`Could not start background job (${res.status})`);
  } else {
    setImmediate(() => runJob(req.app as Express, id));
  }
}

/** Runs a queued job once and stores the response. */
export async function runJob(app: Express, id: string) {
  if (!adminDb) return;
  const db = adminDb;
  const ref = db.collection("jobs").doc(id);
  const job = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || snap.get("status") !== "queued") return null;
    tx.update(ref, { status: "running", startedAt: Date.now() });
    return snap.data()!;
  });
  if (!job) return;

  try {
    const handler = serverless(app);
    const result: any = await handler(
      {
        httpMethod: "POST",
        path: job.path.split("?")[0],
        headers: { ...job.headers, "x-propath-job": id },
        body: job.body,
        isBase64Encoded: false,
        queryStringParameters: null,
        requestContext: {},
      } as any,
      {} as any
    );
    await ref.update({
      status: "done",
      statusCode: result.statusCode,
      response: result.body,
      headers: null,
      finishedAt: Date.now(),
    });
  } catch (err: any) {
    console.error("[jobs] run:", err.message);
    await ref.update({ status: "failed", headers: null, finishedAt: Date.now() });
  }
}

export const jobsRouter = Router();

/** The app polls this until the job is done, then receives the original response. */
jobsRouter.get("/api/jobs/:id", async (req, res) => {
  if (!adminDb) return res.status(503).json({ error: "jobs_unavailable" });
  const ref = adminDb.collection("jobs").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "not_found" });
  const job = snap.data()!;
  if (job.uid && job.uid !== req.user?.uid) return res.status(404).json({ error: "not_found" });

  const age = Date.now() - (job.startedAt || job.createdAt);
  if ((job.status === "queued" || job.status === "running") && age > STALE_MS) {
    await ref.update({ status: "failed", headers: null });
    return res.json({ status: "failed" });
  }
  if (job.status === "done") {
    await ref.delete();
    return res.json({ status: "done", statusCode: job.statusCode, body: job.response });
  }
  if (job.status === "failed") {
    await ref.delete();
    return res.json({ status: "failed" });
  }
  res.json({ status: job.status });
});
