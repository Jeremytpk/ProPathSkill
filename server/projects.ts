import { Router } from "express";
import { z } from "zod";
import { chat, generateJSON, logAIError, LANGUAGE_NAME } from "./ai";
import { rateLimit, requirePlan } from "./auth";
import { DOCUMENT_TYPES } from "../src/projects/types";

export const projectsRouter = Router();

const planSchema = z.object({
  title: z.string(),
  summary: z.string().describe("3–4 sentences: what the project is, for whom, and what success looks like."),
  successCriteria: z.array(z.string()).describe("3–5 measurable signs the project is working."),
  phases: z.array(z.object({
    title: z.string(),
    goal: z.string(),
    tasks: z.array(z.object({
      title: z.string().describe("Starts with a verb. Small enough to finish in 1–10 days."),
      description: z.string(),
      howTo: z.array(z.string()).describe("3–6 concrete steps to complete the task."),
      deliverable: z.string().describe("What exists when the task is done."),
      estimatedDays: z.number().int(),
      priority: z.enum(["high", "medium", "low"]),
      documentType: z.enum([...DOCUMENT_TYPES, "none"]),
    })),
  })),
  currency: z.string(),
  budget: z.array(z.object({
    item: z.string(),
    category: z.enum(["equipment", "materials", "premises", "legal", "marketing", "staff", "working_capital", "other"]),
    estimate: z.number().int(),
    note: z.string(),
  })),
  risks: z.array(z.object({
    risk: z.string(),
    likelihood: z.enum(["low", "medium", "high"]),
    mitigation: z.string(),
  })),
  documents: z.array(z.object({
    type: z.enum(DOCUMENT_TYPES),
    title: z.string(),
    purpose: z.string(),
  })),
});

const detailsSchema = z.object({
  idea: z.string().min(10).max(3000),
  location: z.string().max(200).optional().default(""),
  budget: z.string().max(200).optional().default(""),
  timeline: z.string().max(200).optional().default(""),
  experience: z.string().max(1000).optional().default(""),
  team: z.string().max(500).optional().default(""),
  language: z.enum(["english", "french"]).optional().default("english"),
  country: z.string().max(60).optional().default("DR Congo"),
});

const PM_ROLE = `You are ProPath Project Manager, a practical project manager and small-business coach for members of ProPath, a career platform used mostly in French-speaking Africa.
You help people turn an idea into a working project: clear phases, small tasks, real numbers, the documents they need, and what to do next.
Be concrete and local: real-world steps, realistic costs and timelines for the person's country, and the registrations, permits or tax steps that usually apply there. When you are not sure a specific office, form or fee exists, say what to ask and where, instead of inventing it.
Plain words, short sentences, no hype. Never promise funding, income or approvals.`;

projectsRouter.post("/api/project/plan", requirePlan("pro"), rateLimit("project_plan", 10, 24 * 3600 * 1000), async (req, res) => {
  const parsed = detailsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_project" });
  const d = parsed.data;
  try {
    const plan = await generateJSON(planSchema, {
      effort: "high",
      maxTokens: 24000,
      system: `${PM_ROLE}\nWrite everything in ${LANGUAGE_NAME(d.language)}.`,
      prompt: `Build a step-by-step project plan.

Idea: ${d.idea}
Country: ${d.country}
Location: ${d.location || "not given"}
Available budget: ${d.budget || "not given"}
Target timeline: ${d.timeline || "not given"}
Relevant experience: ${d.experience || "not given"}
Team: ${d.team || "working alone"}

Plan 3–5 phases from validating the idea to launch and first results, with 3–6 tasks each.
Include in the budget only what this project really needs, in the local currency people use for such purchases, as conservative estimates.
List the 3–6 documents this project will actually need, and set documentType on the tasks that produce them.`,
    });
    const phases = plan.phases.map((p, pi) => ({
      ...p,
      id: `p${pi + 1}`,
      tasks: p.tasks.map((t, ti) => ({ ...t, id: `p${pi + 1}t${ti + 1}` })),
    }));
    return res.json({ plan: { ...plan, phases } });
  } catch (err) {
    logAIError("project plan", err);
    return res.status(503).json({ error: "ai_unavailable" });
  }
});

const projectContextSchema = z.object({
  title: z.string().max(300),
  summary: z.string().max(3000),
  country: z.string().max(60).optional(),
  currency: z.string().max(10).optional(),
  phases: z.array(z.object({
    title: z.string().max(300),
    tasks: z.array(z.object({
      id: z.string().max(20),
      title: z.string().max(300),
      status: z.enum(["todo", "doing", "done"]),
    })).max(40),
  })).max(10),
  budgetTotal: z.number().optional(),
});

function describeProject(p: z.infer<typeof projectContextSchema>) {
  const lines = p.phases.map((ph) =>
    `${ph.title}\n${ph.tasks.map((t) => `  [${t.status}] ${t.id}: ${t.title}`).join("\n")}`
  );
  return `Project: ${p.title}
Country: ${p.country || "not given"}
Summary: ${p.summary}
${p.budgetTotal ? `Planned budget: ${p.budgetTotal} ${p.currency || ""}\n` : ""}Plan and status:
${lines.join("\n")}`;
}

projectsRouter.post("/api/project/assist", requirePlan("pro"), rateLimit("project_assist", 80, 24 * 3600 * 1000), async (req, res) => {
  const project = projectContextSchema.safeParse(req.body?.project);
  const question = String(req.body?.question || "").slice(0, 3000);
  if (!project.success || !question.trim()) return res.status(400).json({ error: "invalid_request" });
  const language = req.body?.language === "french" ? "french" : "english";
  const focus = typeof req.body?.focusTaskId === "string" ? req.body.focusTaskId.slice(0, 20) : "";
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];

  try {
    const reply = await chat({
      effort: "medium",
      maxTokens: 6000,
      system: `${PM_ROLE}
Write in ${LANGUAGE_NAME(language)}, formatted in Markdown (short headings, numbered steps, checklists).
Use the project state below. When the person asks what to do next, pick the most important unfinished task and give the exact next steps for today and this week.
${focus ? `The person is asking about task ${focus}.` : ""}

${describeProject(project.data)}`,
      history: history
        .filter((m: any) => typeof m?.text === "string" && (m.role === "user" || m.role === "assistant"))
        .map((m: any) => ({ role: m.role, text: m.text.slice(0, 6000) })),
      message: question,
    });
    return res.json({ reply });
  } catch (err) {
    logAIError("project assist", err);
    return res.status(503).json({ error: "ai_unavailable" });
  }
});

const DOCUMENT_BRIEFS: Record<(typeof DOCUMENT_TYPES)[number], string> = {
  business_plan: "a concise business plan: summary, problem and customers, offer, market and competitors, marketing and sales, operations, team, financial plan (startup costs, monthly costs, pricing, break-even), risks, milestones",
  budget: "a startup and first-6-months budget: tables for startup costs, monthly running costs, expected monthly revenue, and a simple cash-flow table, with a short explanation of assumptions",
  pitch: "a one-page pitch for partners or funders: problem, solution, why now, customers, traction or proof, business model, the ask, contact",
  proposal: "a project proposal for a funder, NGO or client: background, objectives, activities, timeline, budget summary, expected results, monitoring",
  marketing_plan: "a practical marketing plan: target customers, message, channels (WhatsApp, Facebook, radio, word of mouth, flyers), first 90 days calendar, budget, how to measure",
  operations_plan: "an operations plan: daily and weekly routines, suppliers, equipment, quality and safety checks, roles, record keeping",
  contract: "a simple service or partnership agreement template with clear clauses, to be reviewed by a qualified lawyer before signing",
  registration_checklist: "a checklist for legally registering and operating this business in the person's country: steps, where to go, documents to bring, and what to ask about fees and timelines",
  weekly_report: "a weekly progress report based on the task statuses: done, in progress, blockers, next week's priorities",
  funding_application: "a funding or grant application draft: project summary, need, beneficiaries, activities, budget, sustainability, and the applicant's capacity",
};

projectsRouter.post("/api/project/document", requirePlan("pro"), rateLimit("project_doc", 30, 24 * 3600 * 1000), async (req, res) => {
  const project = projectContextSchema.safeParse(req.body?.project);
  const type = req.body?.type as (typeof DOCUMENT_TYPES)[number];
  if (!project.success || !DOCUMENT_TYPES.includes(type)) return res.status(400).json({ error: "invalid_request" });
  const language = req.body?.language === "french" ? "french" : "english";
  const notes = String(req.body?.notes || "").slice(0, 3000);

  try {
    const markdown = await chat({
      effort: "medium",
      maxTokens: 16000,
      system: `${PM_ROLE}
You write ready-to-use project documents in ${LANGUAGE_NAME(language)}, formatted in Markdown with headings and tables where useful.
Use the project facts given. Where a fact is missing, leave a clearly marked placeholder in square brackets, like [Your phone number] or [Monthly rent], rather than inventing it.
Output only the document.`,
      history: [],
      message: `Write ${DOCUMENT_BRIEFS[type]}.

${describeProject(project.data)}
${notes ? `\nExtra information from the person:\n${notes}` : ""}`,
    });
    return res.json({ markdown });
  } catch (err) {
    logAIError("project document", err);
    return res.status(503).json({ error: "ai_unavailable" });
  }
});
