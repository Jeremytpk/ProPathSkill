import { Router } from "express";
import { z } from "zod";
import { chat, generateJSON, logAIError, LANGUAGE_NAME } from "./ai";
import { adminDb, rateLimit, requireAccount } from "./auth";
import { getSkill, skillCourseId } from "../src/career/skills";
import { tr } from "../src/career/assessment";
import { getFallbackCourseContent } from "./fallbackCourse";

export const coursesRouter = Router();

const DIAGRAMS = ["funnel", "seo", "aida", "roas", "process_flow"] as const;

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  aiTutorPersona: z.string().describe("Always 'ProPath Tutor' in English or 'Tuteur ProPath' in French."),
  chapters: z.array(z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string().describe("Two to four paragraphs, 200–300 words, separated by blank lines."),
      keyPoints: z.array(z.string()),
      example: z.object({ scenario: z.string(), execution: z.string(), result: z.string() }),
      diagramType: z.enum(DIAGRAMS),
    })),
    quiz: z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number().int(),
      explanation: z.string(),
    }),
  })),
});

/** Writes a full course with ProPath AI. Throws if the AI is unavailable. */
async function generateCourse(title: string, industry: string, isFrench: boolean) {
  const course = await generateJSON(courseSchema, {
    effort: "medium",
    system: `You write practical vocational courses for ProPath Learning School. Learners are mostly young people and career changers in French-speaking Africa, often learning on a phone.
Write in ${isFrench ? "French" : "English"}. Teach the trade or subject itself, with steps, tools, safety points and realistic local examples. Plain words, short sentences, no hype.
Case-study results must be plausible for a small local business or worker; never invent statistics about real companies.`,
    prompt: `Create a course titled "${title}"${industry ? ` in the field "${industry}"` : ""}.
Exactly 3 chapters. Each chapter has 2 sections and a 4-option quiz that tests that chapter's content, with correctIndex pointing at the right option.
For each section, choose the diagramType that best illustrates it; use "process_flow" unless another type clearly fits.`,
  });
  course.chapters.forEach((ch, i) => {
    ch.id = `chap_${i + 1}`;
    ch.quiz.correctIndex = Math.min(Math.max(0, ch.quiz.correctIndex), ch.quiz.options.length - 1);
  });
  course.aiTutorPersona = isFrench ? "Tuteur ProPath" : "ProPath Tutor";
  return course;
}

coursesRouter.post("/api/generate-course-content", requireAccount, rateLimit("course", 6, 60 * 60 * 1000), async (req, res) => {
  const title = String(req.body?.title || "").slice(0, 200);
  const industry = String(req.body?.industry || "").slice(0, 200);
  const isFrench = req.body?.language === "french";
  if (!title) return res.status(400).json({ error: "title_required" });

  try {
    return res.json(await generateCourse(title, industry, isFrench));
  } catch (err) {
    logAIError("course generation", err);
    return res.json(getFallbackCourseContent(title, industry, isFrench));
  }
});

/** One shared course per skill and language, written once by ProPath AI and reused by every learner. */
const skillCourseJobs = new Map<string, Promise<any>>();

coursesRouter.post("/api/skill-course", requireAccount, rateLimit("skill_course", 30, 60 * 60 * 1000), async (req, res) => {
  const skill = getSkill(String(req.body?.skillId || ""));
  const lang = req.body?.language === "french" ? "french" : "english";
  if (!skill) return res.status(400).json({ error: "unknown_skill" });
  if (skill.courseId) return res.json({ courseId: skill.courseId, builtIn: true });

  const courseId = skillCourseId(skill, lang);
  const ref = adminDb?.collection("skill_courses").doc(courseId);
  try {
    const cached = ref ? await ref.get() : null;
    if (cached?.exists) return res.json({ courseId, course: cached.get("course") });

    // If several learners ask at once, write the course only once.
    let job = skillCourseJobs.get(courseId);
    if (!job) {
      const fr = lang === "french";
      job = generateCourse(tr(skill.label, lang), skill.group === "foundation" ? "" : skill.group, fr)
        .then(async (course) => {
          const full = { id: courseId, skillId: skill.id, language: lang, ...course };
          await ref?.set({ course: full, createdAt: new Date().toISOString() });
          return full;
        })
        .finally(() => skillCourseJobs.delete(courseId));
      skillCourseJobs.set(courseId, job);
    }
    return res.json({ courseId, course: await job });
  } catch (err) {
    logAIError("skill course", err);
    return res.status(503).json({ error: "ai_unavailable" });
  }
});

const tutorFallback = (isFrench: boolean) =>
  isFrench
    ? "Je ne peux pas répondre pour le moment. Relisez les points clés de la section, puis reposez votre question dans un instant."
    : "I can't answer right now. Review the key points in this section, then ask again in a moment.";

coursesRouter.post("/api/ask-tutor", requireAccount, rateLimit("tutor", 60, 60 * 60 * 1000), async (req, res) => {
  const isFrench = req.body?.language === "french";
  const question = String(req.body?.question || "").slice(0, 2000);
  if (!question.trim()) return res.status(400).json({ error: "question_required" });

  const ctx = req.body?.courseContext || {};
  const lesson = String(ctx.currentChapterContent || "").slice(0, 12000);
  const history = Array.isArray(req.body?.chatHistory) ? req.body.chatHistory.slice(-8) : [];

  try {
    const reply = await chat({
      effort: "low",
      maxTokens: 2000,
      system: `You are the ProPath Tutor for the course "${String(ctx.courseTitle || "this course").slice(0, 200)}".
Answer the learner's questions about the course: explain simply, give a local, practical example when it helps, and check understanding with a short question when useful.
Keep answers under 200 words unless the learner asks for more. Write in ${LANGUAGE_NAME(isFrench ? "french" : "english")}.
If asked who or what you are, say you are the ProPath Tutor. If a question is off-topic, answer briefly and bring the learner back to the lesson.

Current chapter: ${String(ctx.currentChapterTitle || "").slice(0, 200)}
Lesson content:
${lesson}`,
      history: history
        .filter((m: any) => typeof m?.text === "string")
        .map((m: any) => ({ role: m.sender === "user" ? "user" : "assistant", text: m.text.slice(0, 4000) })),
      message: question,
    });
    return res.json({ response: reply });
  } catch (err) {
    logAIError("tutor", err);
    return res.json({ response: tutorFallback(isFrench) });
  }
});
