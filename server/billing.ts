import { Router, type Request, type Response } from "express";
import { randomBytes } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, configStatus, ensureUserRecord, getAccess, isAdminUser, isLocalDev, requireAccount, requireAdmin, rateLimit } from "./auth";
import { chapterAccess } from "./tutors";
import { chapterEntitlement, fullEntitlement, TUTOR_SHARE, type TutorCourse } from "../src/marketplace/types";

/**
 * Plans, prices and payments.
 *
 * Payments go through CinetPay (mobile money and cards across francophone Africa).
 * Access is granted only after the server confirms the transaction with CinetPay,
 * never from what the browser or the notification says.
 */

export const billingRouter = Router();

export type Plan = "basic" | "pro";

export interface CountryPricing {
  currency: string;
  /** Monthly subscription prices. */
  basic: number;
  pro: number;
  /** Price of one ProPath AI course exam and certificate. */
  exam: number;
}

export const DEFAULT_PRICING: CountryPricing = { currency: "USD", basic: 2, pro: 5, exam: 2 };
const ALLOWED_MONTHS = [1, 3, 6, 12];

let pricingCache: { at: number; value: Record<string, CountryPricing> } | null = null;

export async function getPricingTable(): Promise<Record<string, CountryPricing>> {
  if (pricingCache && Date.now() - pricingCache.at < 60_000) return pricingCache.value;
  let value: Record<string, CountryPricing> = {};
  if (adminDb) {
    const snap = await adminDb.collection("config").doc("pricing").get();
    value = (snap.get("countries") as Record<string, CountryPricing>) || {};
  }
  pricingCache = { at: Date.now(), value };
  return value;
}

export async function getPricing(countryCode: string): Promise<CountryPricing> {
  const table = await getPricingTable();
  return { ...DEFAULT_PRICING, ...(table.default || {}), ...(table[countryCode?.toUpperCase()] || {}) };
}

// CinetPay ------------------------------------------------------------------

const CINETPAY_URL = "https://api-checkout.cinetpay.com/v2/payment";
const cinetpayConfigured = () => Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID);
/** Simulated payments for local development, never in production. */
const testMode = () => !cinetpayConfigured() && isLocalDev();

/** Website address, where people come back after paying. */
function appUrl(req: Request) {
  return (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
}

/** Server address, where CinetPay sends payment notifications. */
export function serverUrl(req: Request) {
  return (process.env.SERVER_URL || process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
}

/** CinetPay rejects special characters in parameter values. */
const safeText = (s: string) => s.replace(/[#/$_&]/g, " ").slice(0, 120);

/** CinetPay requires amounts in multiples of 5, except in USD. */
function payableAmount(amount: number, currency: string) {
  return currency === "USD" ? Math.round(amount * 100) / 100 : Math.ceil(amount / 5) * 5;
}

async function cinetpayInit(p: {
  transactionId: string; amount: number; currency: string; description: string; notifyUrl: string; returnUrl: string;
  email?: string; name?: string;
}) {
  const res = await fetch(CINETPAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: p.transactionId,
      amount: p.amount,
      currency: p.currency,
      description: safeText(p.description),
      notify_url: p.notifyUrl,
      return_url: p.returnUrl,
      channels: process.env.CINETPAY_CHANNELS || "ALL",
      lang: "fr",
      customer_email: p.email || undefined,
      customer_name: p.name ? safeText(p.name) : undefined,
    }),
  });
  const data: any = await res.json().catch(() => ({}));
  const url = data?.data?.payment_url;
  if (!url) throw new Error(`CinetPay init failed: ${data?.code ?? res.status} ${data?.message ?? ""}`);
  return url as string;
}

async function cinetpayCheck(transactionId: string): Promise<{ status: "accepted" | "refused" | "pending"; amount?: number; currency?: string }> {
  const res = await fetch(`${CINETPAY_URL}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey: process.env.CINETPAY_API_KEY, site_id: process.env.CINETPAY_SITE_ID, transaction_id: transactionId }),
  });
  const data: any = await res.json().catch(() => ({}));
  const status = String(data?.data?.status || "").toUpperCase();
  const result = { amount: Number(data?.data?.amount), currency: data?.data?.currency };
  if (data?.code === "00" && status === "ACCEPTED") return { status: "accepted", ...result };
  if (status === "REFUSED" || data?.code === "627") return { status: "refused", ...result };
  return { status: "pending", ...result };
}

// Payments ------------------------------------------------------------------

export type PaymentKind = "subscription" | "exam" | "tutor_chapter" | "tutor_course";

export interface PaymentRecord {
  uid: string;
  kind: PaymentKind;
  plan?: Plan;
  months?: number;
  courseId?: string;
  chapterIndex?: number;
  tutorId?: string;
  amount: number;
  currency: string;
  description: string;
  status: "pending" | "accepted" | "refused";
  provider: "cinetpay" | "test";
  createdAt: string;
  fulfilledAt?: string;
}

/** Grants what was paid for. Safe to call repeatedly: it runs once per payment. */
async function fulfil(transactionId: string, verified: { amount?: number; currency?: string }) {
  if (!adminDb) throw new Error("Billing is not configured (missing Firebase service account).");
  const db = adminDb;
  const ref = db.collection("payments").doc(transactionId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("Unknown payment");
    const p = snap.data() as PaymentRecord;
    if (p.fulfilledAt) return;
    if (verified.amount !== undefined && !Number.isNaN(verified.amount) && verified.amount < p.amount) {
      tx.update(ref, { status: "refused", note: `Amount mismatch: paid ${verified.amount}` });
      return;
    }
    if (verified.currency && verified.currency !== p.currency) {
      tx.update(ref, { status: "refused", note: `Currency mismatch: ${verified.currency}` });
      return;
    }

    const userRef = db.collection("users").doc(p.uid);
    if (p.kind === "subscription" && p.plan && p.months) {
      const user = await tx.get(userRef);
      const current = user.get("subscription") as { plan?: Plan; expiresAtMs?: number } | undefined;
      const now = Date.now();
      // Paying again extends from the current end date; upgrading to Pro starts now.
      const continuing = current?.expiresAtMs && current.expiresAtMs > now && current.plan === p.plan;
      const start = continuing ? current!.expiresAtMs! : now;
      const expiresAtMs = start + p.months * 30 * 24 * 3600 * 1000;
      tx.set(userRef, {
        subscription: { plan: p.plan, expiresAtMs, expiresAt: new Date(expiresAtMs).toISOString(), updatedAt: new Date().toISOString() },
      }, { merge: true });
    } else if ((p.kind === "tutor_course" || p.kind === "tutor_chapter") && p.courseId && p.tutorId) {
      const entId = p.kind === "tutor_course" ? fullEntitlement(p.courseId) : chapterEntitlement(p.courseId, p.chapterIndex ?? -1);
      // First purchase on this course makes the user one more learner.
      const owned = await tx.get(userRef.collection("entitlements").where("courseId", "==", p.courseId).limit(1));
      tx.set(userRef.collection("entitlements").doc(entId), {
        kind: p.kind, courseId: p.courseId, chapterIndex: p.chapterIndex ?? null, transactionId, grantedAt: new Date().toISOString(),
      });
      const tutorShare = Math.round(p.amount * TUTOR_SHARE * 100) / 100;
      tx.set(db.collection("tutor_earnings").doc(transactionId), {
        tutorId: p.tutorId, courseId: p.courseId, kind: p.kind, chapterIndex: p.chapterIndex ?? null,
        buyerUid: p.uid, gross: p.amount, currency: p.currency, tutorShare,
        platformShare: Math.round((p.amount - tutorShare) * 100) / 100,
        payoutId: null, createdAt: new Date().toISOString(),
      });
      if (owned.empty) tx.update(db.collection("tutor_courses").doc(p.courseId), { learners: FieldValue.increment(1) });
    } else if (p.kind === "exam" && p.courseId) {
      tx.set(userRef.collection("entitlements").doc(`exam_${p.courseId}`), {
        kind: "exam", courseId: p.courseId, transactionId, grantedAt: new Date().toISOString(),
      });
    }
    tx.update(ref, { status: "accepted", fulfilledAt: new Date().toISOString() });
  });
}

async function verifyAndFulfil(transactionId: string): Promise<PaymentRecord["status"]> {
  if (!adminDb) throw new Error("Billing is not configured.");
  const snap = await adminDb.collection("payments").doc(transactionId).get();
  if (!snap.exists) throw new Error("Unknown payment");
  const p = snap.data() as PaymentRecord;
  if (p.fulfilledAt) return "accepted";
  if (p.provider === "test") return p.status;
  const result = await cinetpayCheck(transactionId);
  if (result.status === "accepted") {
    await fulfil(transactionId, result);
    const after = await adminDb.collection("payments").doc(transactionId).get();
    return after.get("status");
  }
  if (result.status === "refused") {
    await snap.ref.update({ status: "refused" });
    return "refused";
  }
  return "pending";
}

const PLAN_NAMES: Record<Plan, string> = { basic: "ProPath Basic", pro: "ProPath Pro" };

billingRouter.get("/api/pricing", async (req, res) => {
  const pricing = await getPricing(String(req.query.country || ""));
  res.json({ pricing, months: ALLOWED_MONTHS, testMode: testMode() });
});

billingRouter.get("/api/access", async (req, res) => {
  if (!req.user) return res.json({ plan: "free", expiresAt: null, signedIn: false });
  res.json({ ...(await getAccess(req.user.uid)), signedIn: true, anonymous: req.user.anonymous });
});

billingRouter.post("/api/pay/checkout", requireAccount, rateLimit("checkout", 20, 3600 * 1000), async (req, res) => {
  if (!adminDb) return res.status(503).json({ error: "billing_not_configured" });
  if (!cinetpayConfigured() && !testMode()) return res.status(503).json({ error: "payments_not_configured" });
  const user = req.user!;
  const kind = req.body?.kind as PaymentKind;
  const country = String(req.body?.country || "");
  const pricing = await getPricing(country);

  let record: Omit<PaymentRecord, "uid" | "createdAt" | "status" | "provider">;
  if (kind === "subscription") {
    const plan = req.body?.plan as Plan;
    const months = Number(req.body?.months);
    if (!["basic", "pro"].includes(plan) || !ALLOWED_MONTHS.includes(months)) return res.status(400).json({ error: "invalid_plan" });
    record = {
      kind, plan, months,
      amount: payableAmount(pricing[plan] * months, pricing.currency),
      currency: pricing.currency,
      description: `${PLAN_NAMES[plan]} ${months} mois`,
    };
  } else if (kind === "exam") {
    const courseId = String(req.body?.courseId || "").replace(/[^\w-]/g, "").slice(0, 80);
    if (!courseId) return res.status(400).json({ error: "invalid_course" });
    const existing = await adminDb.collection("users").doc(user.uid).collection("entitlements").doc(`exam_${courseId}`).get();
    if (existing.exists) return res.status(409).json({ error: "already_owned" });
    record = {
      kind, courseId,
      amount: payableAmount(pricing.exam, pricing.currency),
      currency: pricing.currency,
      description: `Examen et certificat ProPath`,
    };
  } else if (kind === "tutor_chapter" || kind === "tutor_course") {
    const courseId = String(req.body?.courseId || "").replace(/[^\w-]/g, "").slice(0, 80);
    const snap = await adminDb.collection("tutor_courses").doc(courseId).get();
    const course = snap.data() as TutorCourse | undefined;
    if (!course || course.status !== "approved") return res.status(404).json({ error: "course_not_found" });
    if (course.tutorId === user.uid) return res.status(400).json({ error: "own_course" });
    const access = await chapterAccess(course, user.uid);
    if (access.every(Boolean)) return res.status(409).json({ error: "already_owned" });
    if (kind === "tutor_chapter") {
      const chapterIndex = Number(req.body?.chapterIndex);
      if (course.pricing.mode !== "per_chapter" || !course.chapters[chapterIndex] || course.chapters[chapterIndex].free) {
        return res.status(400).json({ error: "invalid_chapter" });
      }
      if (access[chapterIndex]) return res.status(409).json({ error: "already_owned" });
      record = {
        kind, courseId, chapterIndex, tutorId: course.tutorId,
        amount: payableAmount(course.pricing.chapterPrice, "USD"),
        currency: "USD",
        description: `Chapitre ${chapterIndex + 1} ${course.title}`,
      };
    } else {
      // Whole course: the set price, or every remaining paid chapter in per-chapter mode.
      const remaining = course.chapters.filter((c, i) => !c.free && !access[i]).length;
      const price = course.pricing.mode === "full_course" ? course.pricing.coursePrice : course.pricing.chapterPrice * remaining;
      record = {
        kind, courseId, tutorId: course.tutorId,
        amount: payableAmount(price, "USD"),
        currency: "USD",
        description: `Cours complet ${course.title}`,
      };
    }
  } else {
    return res.status(400).json({ error: "invalid_kind" });
  }

  const transactionId = `PP${Date.now().toString(36).toUpperCase()}${randomBytes(4).toString("hex").toUpperCase()}`;
  const payment: PaymentRecord = {
    ...record,
    uid: user.uid,
    status: "pending",
    provider: testMode() ? "test" : "cinetpay",
    createdAt: new Date().toISOString(),
  };
  await adminDb.collection("payments").doc(transactionId).set(payment);

  const base = appUrl(req);
  // Tutor purchases come back to the course they were bought from.
  const reopen = record.kind === "tutor_chapter" || record.kind === "tutor_course" ? `&open=tc:${record.courseId}` : "";
  const returnUrl = `${base}/?payment=${transactionId}${reopen}`;
  if (testMode()) {
    return res.json({ transactionId, paymentUrl: returnUrl, testMode: true, amount: payment.amount, currency: payment.currency });
  }
  try {
    const paymentUrl = await cinetpayInit({
      transactionId,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      notifyUrl: `${serverUrl(req)}/api/pay/notify`,
      returnUrl,
      email: user.email,
    });
    res.json({ transactionId, paymentUrl, amount: payment.amount, currency: payment.currency });
  } catch (err: any) {
    console.error("[billing]", err.message);
    await adminDb.collection("payments").doc(transactionId).update({ status: "refused", note: "init_failed" });
    res.status(502).json({ error: "payment_provider_error" });
  }
});

/** CinetPay calls this after every status change. We re-check with CinetPay before granting anything. */
async function handleNotify(req: Request, res: Response) {
  const transactionId = String(req.body?.cpm_trans_id || req.query?.cpm_trans_id || "");
  if (transactionId) {
    try {
      await verifyAndFulfil(transactionId);
    } catch (err: any) {
      console.error("[billing] notify:", err.message);
    }
  }
  res.status(200).send("OK");
}
billingRouter.post("/api/pay/notify", handleNotify);
billingRouter.get("/api/pay/notify", handleNotify);

/** The app polls this after returning from the payment page. */
billingRouter.get("/api/pay/status/:id", requireAccount, async (req, res) => {
  if (!adminDb) return res.status(503).json({ error: "billing_not_configured" });
  const id = String(req.params.id);
  const snap = await adminDb.collection("payments").doc(id).get();
  if (!snap.exists || snap.get("uid") !== req.user!.uid) return res.status(404).json({ error: "not_found" });
  try {
    const status = await verifyAndFulfil(id);
    res.json({ status, kind: snap.get("kind"), plan: snap.get("plan"), courseId: snap.get("courseId"), testMode: snap.get("provider") === "test" });
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

/** Local development only: complete or fail a simulated payment. */
billingRouter.post("/api/pay/test/:id", requireAccount, async (req, res) => {
  if (!testMode() || !adminDb) return res.status(404).json({ error: "not_found" });
  const ref = adminDb.collection("payments").doc(String(req.params.id));
  const snap = await ref.get();
  if (!snap.exists || snap.get("uid") !== req.user!.uid || snap.get("provider") !== "test") return res.status(404).json({ error: "not_found" });
  if (req.body?.outcome === "refuse") {
    await ref.update({ status: "refused" });
    return res.json({ status: "refused" });
  }
  await fulfil(ref.id, {});
  res.json({ status: "accepted" });
});

// Admin ---------------------------------------------------------------------

/** Which settings the server can see (yes/no only), to diagnose hosting setup. */
billingRouter.get("/api/health", (_req, res) => {
  res.json({ ok: true, ...configStatus() });
});

/** Lets the app show admin tools only to admins. */
billingRouter.get("/api/admin/me", async (req, res) => {
  const user = req.user;
  res.json({ admin: Boolean(user && !user.anonymous && (await isAdminUser(user.uid))) });
});

/** Creates or refreshes the signed-in account's document in `users`. */
billingRouter.post("/api/account/init", requireAccount, async (req, res) => {
  try {
    const role = await ensureUserRecord(req.user!);
    // Without Firebase credentials nothing was saved: say so, so the app saves the record itself.
    if (role === null) return res.status(503).json({ error: "accounts_not_configured" });
    res.json({ ok: true, admin: role === "admin" });
  } catch (err: any) {
    console.error("[account] init:", err.message);
    res.status(500).json({ error: "server_error" });
  }
});

billingRouter.get("/api/admin/pricing", requireAdmin, async (_req, res) => {
  pricingCache = null;
  res.json({ countries: await getPricingTable(), defaults: DEFAULT_PRICING });
});

billingRouter.post("/api/admin/pricing", requireAdmin, async (req, res) => {
  if (!adminDb) return res.status(503).json({ error: "billing_not_configured" });
  const code = String(req.body?.country || "").toUpperCase();
  const p = req.body?.pricing || {};
  const value: CountryPricing = {
    currency: String(p.currency || "USD").toUpperCase().slice(0, 3),
    basic: Number(p.basic),
    pro: Number(p.pro),
    exam: Number(p.exam),
  };
  if (!/^([A-Z]{2}|DEFAULT)$/.test(code) || [value.basic, value.pro, value.exam].some((n) => !(n >= 0))) {
    return res.status(400).json({ error: "invalid_pricing" });
  }
  const key = code === "DEFAULT" ? "default" : code;
  await adminDb.collection("config").doc("pricing").set({ countries: { [key]: value } }, { merge: true });
  pricingCache = null;
  res.json({ ok: true });
});

billingRouter.get("/api/admin/payments", requireAdmin, async (_req, res) => {
  if (!adminDb) return res.status(503).json({ error: "billing_not_configured" });
  const snap = await adminDb.collection("payments").orderBy("createdAt", "desc").limit(100).get();
  res.json({ payments: snap.docs.map((d) => ({ id: d.id, ...d.data() })) });
});

/** Manual grant, e.g. for partners, scholarships or support cases. */
billingRouter.post("/api/admin/subscription", requireAdmin, async (req, res) => {
  if (!adminDb) return res.status(503).json({ error: "billing_not_configured" });
  const email = String(req.body?.email || "").trim().toLowerCase();
  const plan = req.body?.plan as Plan | "free";
  const months = Number(req.body?.months) || 1;
  if (!email || !["basic", "pro", "free"].includes(plan)) return res.status(400).json({ error: "invalid_request" });
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const user = await getAuth().getUserByEmail(email);
    const expiresAtMs = plan === "free" ? 0 : Date.now() + months * 30 * 24 * 3600 * 1000;
    await adminDb.collection("users").doc(user.uid).set({
      subscription: plan === "free"
        ? FieldValue.delete()
        : { plan, expiresAtMs, expiresAt: new Date(expiresAtMs).toISOString(), updatedAt: new Date().toISOString(), grantedBy: "admin" },
    }, { merge: true });
    res.json({ ok: true, uid: user.uid });
  } catch (err: any) {
    const notFound = err?.code === "auth/user-not-found";
    res.status(notFound ? 404 : 500).json({ error: notFound ? "No ProPath account uses this email." : err.message });
  }
});
