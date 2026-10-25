import { createApp } from "../../server/app";
import { runJob } from "../../server/jobs";

/**
 * Runs long ProPath AI requests (up to 15 minutes). The "-background" suffix makes this
 * a Netlify background function: callers get 202 at once while it keeps running.
 */
const app = createApp();

export const handler = async (event: { body: string | null }) => {
  const { jobId } = JSON.parse(event.body || "{}");
  if (typeof jobId === "string" && /^[a-f0-9]{32}$/.test(jobId)) await runJob(app, jobId);
  return { statusCode: 200, body: "" };
};
