import { Router, type Request, type Response, type NextFunction } from "express";
import { randomBytes } from "crypto";
import { z } from "zod";
import { adminDb, getRequestUser, requireAccount, requireAdminKey } from "./auth";
import { SKILL_IDS } from "../src/career/skills";
import {
  chapterEntitlement, fullEntitlement, MAX_PRICE, MIN_CHAPTERS, MIN_FREE_CHAPTERS, MIN_PRICE,
  type TutorChapterContent, type TutorCourse, type TutorProfile,
} from "../src/marketplace/types";

/**
 * Tutor marketplace. Everything here is read and written by the server only;
 * paid chapter content never reaches a browser without access.
 */
export const tutorsRouter = Router();

const now = () => new Date().toISOString();

function db() {
  if (!adminDb) throw Object.assign(new Error("Marketplace is not configured (missing Firebase service account)."), { status: 503 });
  return adminDb;
}

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response) =>
  fn(req, res).catch((err) => {
    console.error("[tutors]", err.message);
    res.status(err.status || 500).json({ error: err.status ? err.message : "server_error" });
  });

async function requireApprovedTutor(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user || user.anonymous) return res.status(401).json({ error: "sign_in_required" });
  if (!adminDb) return res.status(503).json({ error: "marketplace_not_configured" });
  const snap = await adminDb.collection("tutors").doc(user.uid).get();
  if (!snap.exists || snap.get("status") !== "approved") return res.status(403).json({ error: "tutor_not_approved" });
  (req as any).tutor = snap.data() as TutorProfile;
  next();
}

// Tutor: application and profile ------------------------------------------

const applicationSchema = z.object({
  type: z.enum(["individual", "school", "institute", "university"]),
  displayName: z.string().min(2).max(120),
  bio: z.string().min(20).max(2000),
  city: z.string().min(2).max(80),
  country: z.string().min(2).max(60),
  phone: z.string().min(6).max(30),
  payout: z.object({
    operator: z.string().min(2).max(40),
    prefix: z.string().regex(/^\d{1,4}$/),
    number: z.string().regex(/^\d{6,15}$/),
    holderName: z.string().min(2).max(120),
  }),
  skills: z.array(z.enum(SKILL_IDS)).min(1).max(15),
});

tutorsRouter.get("/api/tutor/me", requireAccount, handle(async (req, res) => {
  const uid = req.user!.uid;
  const profile = await db().collection("tutors").doc(uid).get();
  if (!profile.exists) return res.json({ profile: null, courses: [], balance: null });
  const [courses, earnings, payouts] = await Promise.all([
    db().collection("tutor_courses").where("tutorId", "==", uid).get(),
    db().collection("tutor_earnings").where("tutorId", "==", uid).get(),
    db().collection("payouts").where("tutorId", "==", uid).get(),
  ]);
  const unpaid = earnings.docs.filter((d) => !d.get("payoutId")).reduce((s, d) => s + (d.get("tutorShare") || 0), 0);
  const total = earnings.docs.reduce((s, d) => s + (d.get("tutorShare") || 0), 0);
  res.json({
    profile: profile.data(),
    courses: courses.docs.map((d) => d.data()).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")),
    balance: { unpaid: round2(unpaid), total: round2(total), sales: earnings.size, currency: "USD" },
    payouts: payouts.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
  });
}));

tutorsRouter.post("/api/tutor/apply", requireAccount, handle(async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_application", issues: parsed.error.issues.map((i) => i.path.join(".")) });
  const ref = db().collection("tutors").doc(req.user!.uid);
  const existing = await ref.get();
  const status = existing.get("status");
  if (status === "suspended") return res.status(403).json({ error: "suspended" });
  // An approved tutor can edit their profile; anything else goes (back) to review.
  await ref.set({
    ...parsed.data,
    uid: req.user!.uid,
    email: req.user!.email || "",
    status: status === "approved" ? "approved" : "pending",
    createdAt: existing.get("createdAt") || now(),
    updatedAt: now(),
  }, { merge: true });
  res.json({ ok: true, status: status === "approved" ? "approved" : "pending" });
}));

// Tutor: courses ------------------------------------------------------------

const courseSchema = z.object({
  id: z.string().regex(/^[a-z0-9]{6,32}$/).optional(),
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(3000),
  skills: z.array(z.enum(SKILL_IDS)).min(1).max(8),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.enum(["english", "french"]),
  format: z.enum(["online", "in_person", "hybrid"]),
  city: z.string().max(80).optional().default(""),
  pricing: z.object({
    mode: z.enum(["per_chapter", "full_course"]),
    chapterPrice: z.number().min(MIN_PRICE).max(MAX_PRICE),
    coursePrice: z.number().min(MIN_PRICE).max(MAX_PRICE * 10),
  }),
  freeChapters: z.number().int().min(MIN_FREE_CHAPTERS).max(20),
  chapters: z.array(z.object({
    title: z.string().max(160),
    summary: z.string().max(400).optional().default(""),
    body: z.string().max(60000),
    videoUrl: z.string().url().max(500).or(z.literal("")).optional().default(""),
  })).min(1).max(40),
});

const round2 = (n: number) => Math.round(n * 100) / 100;

tutorsRouter.get("/api/tutor/courses/:id", requireApprovedTutor, handle(async (req, res) => {
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists || snap.get("tutorId") !== req.user!.uid) return res.status(404).json({ error: "not_found" });
  const content = await ref.collection("content").get();
  const chapters = content.docs.sort((a, b) => Number(a.id) - Number(b.id)).map((d) => d.data());
  res.json({ course: snap.data(), content: chapters });
}));

tutorsRouter.post("/api/tutor/courses", requireApprovedTutor, handle(async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_course", issues: parsed.error.issues.map((i) => i.path.join(".")) });
  const d = parsed.data;
  const tutor = (req as any).tutor as TutorProfile;
  const id = d.id || randomBytes(6).toString("hex");
  const ref = db().collection("tutor_courses").doc(id);
  const existing = await ref.get();
  if (existing.exists && existing.get("tutorId") !== tutor.uid) return res.status(404).json({ error: "not_found" });

  const freeChapters = Math.min(d.freeChapters, d.chapters.length);
  const course: TutorCourse = {
    id,
    tutorId: tutor.uid,
    tutorName: tutor.displayName,
    tutorType: tutor.type,
    title: d.title,
    description: d.description,
    skills: d.skills,
    level: d.level,
    language: d.language,
    format: d.format,
    city: d.city || tutor.city,
    country: tutor.country,
    pricing: { mode: d.pricing.mode, chapterPrice: round2(d.pricing.chapterPrice), coursePrice: round2(d.pricing.coursePrice), currency: "USD" },
    freeChapters,
    chapters: d.chapters.map((c, index) => ({ index, title: c.title, summary: c.summary, free: index < freeChapters })),
    // Any edit to a published course sends it back to review.
    status: "draft",
    learners: existing.get("learners") || 0,
    ...(existing.get("publishedAt") ? { publishedAt: existing.get("publishedAt") } : {}),
    createdAt: existing.get("createdAt") || now(),
    updatedAt: now(),
  };
  const batch = db().batch();
  batch.set(ref, course);
  const old = await ref.collection("content").get();
  old.docs.forEach((doc) => Number(doc.id) >= d.chapters.length && batch.delete(doc.ref));
  d.chapters.forEach((c, index) => {
    const content: TutorChapterContent = { title: c.title, summary: c.summary, body: c.body, videoUrl: c.videoUrl };
    batch.set(ref.collection("content").doc(String(index)), content);
  });
  await batch.commit();
  res.json({ course });
}));

tutorsRouter.post("/api/tutor/courses/:id/submit", requireApprovedTutor, handle(async (req, res) => {
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists || snap.get("tutorId") !== req.user!.uid) return res.status(404).json({ error: "not_found" });
  const course = snap.data() as TutorCourse;
  const content = await ref.collection("content").get();
  const empty = content.docs.filter((d) => String(d.get("body") || "").trim().length < 100).map((d) => Number(d.id));
  const problems: string[] = [];
  if (course.chapters.length < MIN_CHAPTERS) problems.push("min_chapters");
  if (course.freeChapters < MIN_FREE_CHAPTERS) problems.push("min_free_chapters");
  if (course.chapters.length <= course.freeChapters) problems.push("no_paid_chapters");
  if (empty.length) problems.push("short_chapters");
  if (course.chapters.some((c) => c.title.trim().length < 2)) problems.push("missing_titles");
  if (problems.length) return res.status(400).json({ error: "not_ready", problems, shortChapters: empty });
  await ref.update({ status: "pending_review", updatedAt: now(), reviewNote: "" });
  res.json({ ok: true });
}));

tutorsRouter.delete("/api/tutor/courses/:id", requireApprovedTutor, handle(async (req, res) => {
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists || snap.get("tutorId") !== req.user!.uid) return res.status(404).json({ error: "not_found" });
  if ((snap.get("learners") || 0) > 0) return res.status(409).json({ error: "has_learners" });
  const content = await ref.collection("content").get();
  const batch = db().batch();
  content.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(ref);
  await batch.commit();
  res.json({ ok: true });
}));

// Learners: catalogue and chapter access ------------------------------------

/** Which chapters a user may read. */
export async function chapterAccess(course: TutorCourse, uid: string | null): Promise<boolean[]> {
  const base = course.chapters.map((c) => c.free);
  if (!uid) return base;
  if (uid === course.tutorId) return course.chapters.map(() => true);
  const ents = await db().collection("users").doc(uid).collection("entitlements").where("courseId", "==", course.id).get();
  const ids = new Set(ents.docs.map((d) => d.id));
  if (ids.has(fullEntitlement(course.id))) return course.chapters.map(() => true);
  return course.chapters.map((c) => c.free || ids.has(chapterEntitlement(course.id, c.index)));
}

/** Live courses, plus once-published courses being re-reviewed (so buyers keep access), plus the tutor's own. */
function visibleTo(course: TutorCourse, uid?: string) {
  return course.status === "approved" || Boolean(course.publishedAt) || course.tutorId === uid;
}

tutorsRouter.get("/api/market/courses", handle(async (req, res) => {
  const snap = await db().collection("tutor_courses").where("status", "==", "approved").limit(200).get();
  let courses = snap.docs.map((d) => d.data() as TutorCourse);
  const skill = String(req.query.skill || "");
  const language = String(req.query.language || "");
  if (skill) courses = courses.filter((c) => c.skills.includes(skill));
  // Courses in the learner's language first, then most popular.
  courses.sort((a, b) => Number(b.language === language) - Number(a.language === language) || b.learners - a.learners);
  res.json({ courses });
}));

tutorsRouter.get("/api/market/courses/:id", handle(async (req, res) => {
  const snap = await db().collection("tutor_courses").doc(String(req.params.id)).get();
  const user = req.user ?? (await getRequestUser(req));
  const course = snap.data() as TutorCourse | undefined;
  if (!course || !visibleTo(course, user?.uid)) return res.status(404).json({ error: "not_found" });
  res.json({ course, access: await chapterAccess(course, user && !user.anonymous ? user.uid : null) });
}));

tutorsRouter.get("/api/market/courses/:id/chapters/:index", handle(async (req, res) => {
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  const user = req.user ?? (await getRequestUser(req));
  const course = snap.data() as TutorCourse | undefined;
  const index = Number(req.params.index);
  if (!course || !visibleTo(course, user?.uid) || !course.chapters[index]) {
    return res.status(404).json({ error: "not_found" });
  }
  // Even free chapters need an account: courses are tied to real learners.
  if (!user || user.anonymous) return res.status(401).json({ error: "sign_in_required" });
  const access = await chapterAccess(course, user.uid);
  if (!access[index]) return res.status(402).json({ error: "payment_required" });
  const content = await ref.collection("content").doc(String(index)).get();
  res.json({ chapter: content.data() });
}));

// Admin: tutor and course review --------------------------------------------

tutorsRouter.get("/api/admin/tutors", requireAdminKey, handle(async (req, res) => {
  const status = String(req.query.status || "pending");
  const snap = await db().collection("tutors").where("status", "==", status).limit(200).get();
  res.json({ tutors: snap.docs.map((d) => d.data()) });
}));

tutorsRouter.post("/api/admin/tutors/:uid", requireAdminKey, handle(async (req, res) => {
  const status = req.body?.status;
  if (!["approved", "rejected", "suspended", "pending"].includes(status)) return res.status(400).json({ error: "invalid_status" });
  const ref = db().collection("tutors").doc(String(req.params.uid));
  if (!(await ref.get()).exists) return res.status(404).json({ error: "not_found" });
  await ref.update({
    status,
    reviewNote: String(req.body?.note || "").slice(0, 1000),
    ...(status === "approved" ? { approvedAt: now() } : {}),
    updatedAt: now(),
  });
  // A suspended tutor's courses come off the catalogue.
  if (status === "suspended") {
    const courses = await db().collection("tutor_courses").where("tutorId", "==", req.params.uid).where("status", "==", "approved").get();
    const batch = db().batch();
    courses.docs.forEach((d) => batch.update(d.ref, { status: "rejected", reviewNote: "Tutor suspended" }));
    await batch.commit();
  }
  res.json({ ok: true });
}));

tutorsRouter.get("/api/admin/tutor-courses", requireAdminKey, handle(async (req, res) => {
  const status = String(req.query.status || "pending_review");
  const snap = await db().collection("tutor_courses").where("status", "==", status).limit(200).get();
  res.json({ courses: snap.docs.map((d) => d.data()) });
}));

tutorsRouter.get("/api/admin/tutor-courses/:id", requireAdminKey, handle(async (req, res) => {
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "not_found" });
  const content = await ref.collection("content").get();
  res.json({ course: snap.data(), content: content.docs.sort((a, b) => Number(a.id) - Number(b.id)).map((d) => d.data()) });
}));

tutorsRouter.post("/api/admin/tutor-courses/:id", requireAdminKey, handle(async (req, res) => {
  const status = req.body?.status;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ error: "invalid_status" });
  const ref = db().collection("tutor_courses").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "not_found" });
  await ref.update({
    status,
    reviewNote: String(req.body?.note || "").slice(0, 1000),
    ...(status === "approved" ? { publishedAt: snap.get("publishedAt") || now() } : {}),
    updatedAt: now(),
  });
  res.json({ ok: true });
}));
