import { Router } from "express";
import { z } from "zod";
import { SKILLS_CATALOG, SKILL_IDS } from "../src/career/skills";
import { SKILLS } from "../src/career/assessment";
import { PRIORITY_ORDER } from "../src/career/learningPlan";
import { generateJSON, logAIError, LANGUAGE_NAME } from "./ai";
import { rateLimit, requireAccount } from "./auth";

export const learningRouter = Router();

const planSchema = z.object({
  title: z.string().describe("Short name for the goal, e.g. 'Open a solar installation workshop'."),
  summary: z.string().describe("2–3 sentences: what the person will be able to do and the path to get there."),
  kind: z.enum(["job", "business", "both"]),
  estimatedWeeks: z.number().int().describe("Realistic weeks of learning at the stated weekly time."),
  skills: z.array(z.object({
    skillId: z.enum(SKILL_IDS),
    why: z.string().describe("One sentence linking this skill to the person's goal."),
    priority: z.enum(["essential", "important", "useful"]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
  })),
  otherSkills: z.array(z.string()).describe("Important skills not in the list, if any. Usually empty."),
  firstSteps: z.array(z.string()).describe("4–6 concrete actions for the first two weeks, besides taking courses."),
});

const requestSchema = z.object({
  goal: z.string().min(10).max(2000),
  hoursPerWeek: z.number().min(1).max(60).optional(),
  experience: z.string().max(1000).optional().default(""),
  language: z.enum(["english", "french"]).optional().default("english"),
  country: z.string().max(60).optional().default("DR Congo"),
  /** Self-rated skills from the assessment, 0–100, if the person took it. */
  selfRated: z.record(z.string(), z.number().min(0).max(100)).optional(),
});

const skillList = SKILLS_CATALOG.map((k) => `- ${k.id}: ${k.label.en}`).join("\n");

learningRouter.post("/api/learning-plan", requireAccount, rateLimit("learning_plan", 15, 24 * 3600 * 1000), async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_request" });
  const d = parsed.data;

  const rated = d.selfRated
    ? SKILLS.map((k) => `${k.label.en}: ${Math.round(d.selfRated![k.key] ?? 0)}/100`).join("\n")
    : "Not provided";

  try {
    const plan = await generateJSON(planSchema, {
      effort: "medium",
      system: `You are ProPath's learning adviser. ProPath helps young people and career changers, mostly in French-speaking Africa, learn the skills they need for a job or their own project.
From the person's goal, choose the skills they need from ProPath's skills list. Each skill you choose has a ProPath course, so pick only skills that truly matter for this goal: usually 4 to 8, ordered from what to learn first to last.
Mark as "essential" only what the goal cannot succeed without. Skip skills the person clearly already has, based on their experience and self-ratings.
Write in ${LANGUAGE_NAME(d.language)}, in plain words. Be realistic about time; never promise income or jobs.

ProPath skills list (id: name):
${skillList}`,
      prompt: `Goal: ${d.goal}
Country: ${d.country}
Time available: ${d.hoursPerWeek ? `${d.hoursPerWeek} hours per week` : "not given"}
Experience: ${d.experience || "not given"}
Self-rated skills:
${rated}`,
    });

    // Keep each skill once, essential first, in the order given.
    const seen = new Set<string>();
    const skills = plan.skills
      .filter((k) => !seen.has(k.skillId) && seen.add(k.skillId))
      .map((k, i) => ({ ...k, i }))
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.i - b.i)
      .map(({ i: _i, ...k }) => k);

    return res.json({ plan: { ...plan, skills, otherSkills: plan.otherSkills.slice(0, 5), firstSteps: plan.firstSteps.slice(0, 6) } });
  } catch (err) {
    logAIError("learning plan", err);
    return res.status(503).json({ error: "ai_unavailable" });
  }
});
