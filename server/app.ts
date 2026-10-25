import express from "express";
import { attachUser } from "./auth";
import { billingRouter } from "./billing";
import { careerRouter } from "./career";
import { coursesRouter } from "./courses";
import { enqueueSlowRequests, jobsRouter } from "./jobs";
import { learningRouter } from "./learning";
import { payoutsRouter } from "./payouts";
import { projectsRouter } from "./projects";
import { tutorsRouter } from "./tutors";

/** The ProPath API, shared by the local server and the Netlify functions. */
export function createApp() {
  const app = express();
  app.set("trust proxy", true);

  // Only needed when the website is hosted on a different address than the API.
  const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
  app.use("/api", (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, x-admin-key");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
      res.setHeader("Access-Control-Max-Age", "86400");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  app.use("/api", attachUser);
  app.use(enqueueSlowRequests);
  app.use(jobsRouter);
  app.use(careerRouter);
  app.use(coursesRouter);
  app.use(projectsRouter);
  app.use(learningRouter);
  app.use(tutorsRouter);
  app.use(payoutsRouter);
  app.use(billingRouter);
  return app;
}
