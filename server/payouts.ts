import { Router, type Request, type Response } from "express";
import { randomBytes } from "crypto";
import { adminDb, requireAdminKey } from "./auth";
import type { TutorProfile } from "../src/marketplace/types";

/**
 * Tutor payouts: their 80% share of sales, paid by mobile money.
 * Manual payouts record the reference of a transfer made outside ProPath.
 * Automatic payouts use CinetPay's transfer API.
 */
export const payoutsRouter = Router();

const CINETPAY_CLIENT = "https://client.cinetpay.com/v1";
const now = () => new Date().toISOString();
const round2 = (n: number) => Math.round(n * 100) / 100;

function db() {
  if (!adminDb) throw Object.assign(new Error("Payouts are not configured (missing Firebase service account)."), { status: 503 });
  return adminDb;
}

/**
 * CinetPay transfers are sent in the transfer account's currency. Earnings are in USD, so a
 * non-USD account needs an explicit conversion rate; without one we refuse rather than underpay.
 */
function payoutConversion(): { currency: string; rate: number } | null {
  const currency = (process.env.CINETPAY_PAYOUT_CURRENCY || "").toUpperCase();
  if (!currency) return null;
  if (currency === "USD") return { currency, rate: 1 };
  const rate = Number(process.env.CINETPAY_PAYOUT_USD_RATE);
  return rate > 0 ? { currency, rate } : null;
}

const transferConfigured = () =>
  Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_TRANSFER_PASSWORD && payoutConversion());

async function cinetpayToken(): Promise<string> {
  const res = await fetch(`${CINETPAY_CLIENT}/auth/login?lang=fr`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ apikey: process.env.CINETPAY_API_KEY!, password: process.env.CINETPAY_TRANSFER_PASSWORD! }),
  });
  const data: any = await res.json().catch(() => ({}));
  if (!data?.data?.token) throw new Error(`CinetPay login failed: ${data?.code ?? res.status} ${data?.message ?? ""}`);
  return data.data.token;
}

async function cinetpayPost(path: string, token: string, payload: unknown) {
  const res = await fetch(`${CINETPAY_CLIENT}${path}?token=${encodeURIComponent(token)}&lang=fr`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: JSON.stringify(payload) }),
  });
  return (await res.json().catch(() => ({}))) as any;
}

async function sendTransfer(tutor: TutorProfile, amount: number, payoutId: string, notifyUrl: string) {
  const token = await cinetpayToken();
  const [surname, ...rest] = (tutor.payout.holderName || tutor.displayName).split(" ");
  // The recipient must be a contact before money can be sent; adding an existing contact is harmless.
  await cinetpayPost("/transfer/contact", token, [{
    prefix: tutor.payout.prefix, phone: tutor.payout.number, name: rest.join(" ") || surname, surname, email: tutor.email,
  }]);
  const sent = await cinetpayPost("/transfer/money/send/contact", token, [{
    prefix: tutor.payout.prefix, phone: tutor.payout.number, amount, client_transaction_id: payoutId, notify_url: notifyUrl,
  }]);
  if (String(sent?.code) !== "0") throw new Error(`CinetPay transfer refused: ${sent?.code ?? "?"} ${sent?.message ?? ""}`);
  return sent;
}

/** Unpaid earnings per tutor. */
async function balances() {
  const snap = await db().collection("tutor_earnings").where("payoutId", "==", null).get();
  const byTutor = new Map<string, { amount: number; ids: string[] }>();
  snap.docs.forEach((d) => {
    const t = byTutor.get(d.get("tutorId")) || { amount: 0, ids: [] };
    t.amount += d.get("tutorShare") || 0;
    t.ids.push(d.id);
    byTutor.set(d.get("tutorId"), t);
  });
  return byTutor;
}

payoutsRouter.get("/api/admin/payouts", requireAdminKey, async (_req, res) => {
  try {
    const bal = await balances();
    const tutors = await Promise.all([...bal.keys()].map((id) => db().collection("tutors").doc(id).get()));
    const history = await db().collection("payouts").orderBy("createdAt", "desc").limit(100).get();
    res.json({
      automatic: transferConfigured(),
      balances: tutors.map((t) => ({
        tutorId: t.id,
        displayName: t.get("displayName"),
        email: t.get("email"),
        payout: t.get("payout"),
        unpaid: round2(bal.get(t.id)!.amount),
        sales: bal.get(t.id)!.ids.length,
        currency: "USD",
      })).sort((a, b) => b.unpaid - a.unpaid),
      history: history.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

payoutsRouter.post("/api/admin/payouts", requireAdminKey, async (req, res) => {
  const tutorId = String(req.body?.tutorId || "");
  const mode = req.body?.mode === "cinetpay" ? "cinetpay" : "manual";
  const reference = String(req.body?.reference || "").slice(0, 120);
  if (mode === "manual" && !reference) return res.status(400).json({ error: "reference_required" });
  if (mode === "cinetpay" && !transferConfigured()) return res.status(503).json({ error: "automatic_payouts_not_configured" });

  try {
    const tutorSnap = await db().collection("tutors").doc(tutorId).get();
    if (!tutorSnap.exists) return res.status(404).json({ error: "not_found" });
    const tutor = tutorSnap.data() as TutorProfile;
    const payoutId = `PO${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString("hex").toUpperCase()}`;

    // Reserve the unpaid earnings for this payout so they can never be paid twice.
    const reserved = await db().runTransaction(async (tx) => {
      const snap = await tx.get(db().collection("tutor_earnings").where("tutorId", "==", tutorId).where("payoutId", "==", null));
      const total = round2(snap.docs.reduce((s, d) => s + (d.get("tutorShare") || 0), 0));
      if (total <= 0) return null;
      snap.docs.forEach((d) => tx.update(d.ref, { payoutId }));
      return { total, ids: snap.docs.map((d) => d.id) };
    });
    if (!reserved) return res.status(400).json({ error: "nothing_to_pay" });

    const base = {
      tutorId, tutorName: tutor.displayName, earnings: reserved.ids, amountUsd: reserved.total,
      method: "mobile_money", operator: tutor.payout.operator, phone: `+${tutor.payout.prefix} ${tutor.payout.number}`,
      mode, createdAt: now(),
    };

    if (mode === "manual") {
      await db().collection("payouts").doc(payoutId).set({ ...base, status: "paid", reference, paidAt: now() });
      return res.json({ ok: true, payoutId, status: "paid" });
    }

    // Automatic: CinetPay needs whole multiples of 5 in the account currency; the rest carries over.
    const conv = payoutConversion()!;
    const converted = reserved.total * conv.rate;
    const amount = Math.floor(converted / 5) * 5;
    if (amount <= 0) {
      await releaseEarnings(payoutId);
      return res.status(400).json({ error: "below_minimum_transfer" });
    }
    const carryUsd = round2((converted - amount) / conv.rate);
    await db().collection("payouts").doc(payoutId).set({
      ...base, status: "processing", transferAmount: amount, transferCurrency: conv.currency, carryOverUsd: carryUsd,
    });
    try {
      const appUrl = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
      await sendTransfer(tutor, amount, payoutId, `${appUrl}/api/payouts/notify`);
      if (carryUsd > 0) {
        await db().collection("tutor_earnings").doc(`${payoutId}_carry`).set({
          tutorId, kind: "carry_over", gross: 0, currency: "USD", tutorShare: carryUsd, platformShare: 0,
          payoutId: null, createdAt: now(),
        });
      }
      return res.json({ ok: true, payoutId, status: "processing", transferAmount: amount, transferCurrency: conv.currency });
    } catch (err: any) {
      await db().collection("payouts").doc(payoutId).update({ status: "failed", error: err.message });
      await releaseEarnings(payoutId);
      return res.status(502).json({ error: err.message });
    }
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

/** Puts a failed payout's earnings back into the tutor's unpaid balance. */
async function releaseEarnings(payoutId: string) {
  const snap = await db().collection("tutor_earnings").where("payoutId", "==", payoutId).get();
  const batch = db().batch();
  snap.docs.forEach((d) => batch.update(d.ref, { payoutId: null }));
  await batch.commit();
}

/** Admin override for a processing transfer, e.g. after checking the CinetPay back office. */
payoutsRouter.post("/api/admin/payouts/:id/status", requireAdminKey, async (req, res) => {
  const status = req.body?.status;
  if (!["paid", "failed"].includes(status)) return res.status(400).json({ error: "invalid_status" });
  try {
    const ref = db().collection("payouts").doc(String(req.params.id));
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "not_found" });
    if (snap.get("status") === status) return res.json({ ok: true });
    await ref.update({ status, ...(status === "paid" ? { paidAt: now() } : {}), reference: String(req.body?.reference || snap.get("reference") || "") });
    if (status === "failed") await releaseEarnings(ref.id);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

/** CinetPay calls this when a transfer's status changes; the status is re-checked with CinetPay. */
async function handleNotify(req: Request, res: Response) {
  const payoutId = String(req.body?.client_transaction_id || req.query?.client_transaction_id || "");
  res.status(200).send("OK");
  if (!payoutId || !adminDb || !transferConfigured()) return;
  try {
    const token = await cinetpayToken();
    const r = await fetch(`${CINETPAY_CLIENT}/transfer/check/money?token=${encodeURIComponent(token)}&client_transaction_id=${encodeURIComponent(payoutId)}&lang=fr`);
    const data: any = await r.json().catch(() => ({}));
    const item = Array.isArray(data?.data) ? data.data[0] : data?.data;
    const state = String(item?.treatment_status || item?.status || "").toUpperCase();
    const ref = adminDb.collection("payouts").doc(payoutId);
    if (state === "VAL") await ref.update({ status: "paid", paidAt: now(), reference: item?.transaction_id || "" });
    else if (state === "REJ") {
      await ref.update({ status: "failed", error: "Rejected by CinetPay" });
      await releaseEarnings(payoutId);
    }
  } catch (err: any) {
    console.error("[payouts] notify:", err.message);
  }
}
payoutsRouter.post("/api/payouts/notify", handleNotify);
payoutsRouter.get("/api/payouts/notify", handleNotify);
