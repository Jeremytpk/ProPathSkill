import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { attachUser } from "./server/auth";
import { billingRouter } from "./server/billing";
import { careerRouter } from "./server/career";
import { coursesRouter } from "./server/courses";
import { projectsRouter } from "./server/projects";
import { learningRouter } from "./server/learning";
import { tutorsRouter } from "./server/tutors";
import { payoutsRouter } from "./server/payouts";

const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

const PORT = Number(process.env.PORT) || 3000;

app.use("/api", attachUser);
app.use(careerRouter);
app.use(coursesRouter);
app.use(projectsRouter);
app.use(learningRouter);
app.use(tutorsRouter);
app.use(payoutsRouter);
app.use(billingRouter);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProPath server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
