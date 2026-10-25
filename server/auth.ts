import type { Request, Response, NextFunction } from "express";
import { initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import firebaseConfig from "../firebase-applet-config.json";

/**
 * Server-side identity and plan access.
 *
 * Verifying ID tokens only needs the project ID. Reading plans and recording payments
 * needs service account credentials: set FIREBASE_SERVICE_ACCOUNT to the JSON key,
 * or GOOGLE_APPLICATION_CREDENTIALS to its path.
 */

let adminApp: App;
export let adminDb: Firestore | null = null;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    adminApp = initializeApp({ credential: cert(JSON.parse(serviceAccount)), projectId: firebaseConfig.projectId });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    adminApp = initializeApp({ credential: applicationDefault(), projectId: firebaseConfig.projectId });
  } else {
    adminApp = initializeApp({ projectId: firebaseConfig.projectId });
  }
  if (serviceAccount || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    adminDb = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
  } else {
    console.log("No Firebase service account configured. Membership checks are unavailable.");
  }
} catch (err) {
  console.error("Failed to initialise Firebase Admin:", err);
}

export interface RequestUser {
  uid: string;
  email?: string;
  anonymous: boolean;
}

export async function getRequestUser(req: Request): Promise<RequestUser | null> {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !adminApp) return null;
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      anonymous: decoded.firebase?.sign_in_provider === "anonymous",
    };
  } catch {
    return null;
  }
}

export type PlanName = "free" | "basic" | "pro";

export interface Access {
  plan: PlanName;
  expiresAt: string | null;
}

const devPlan = process.env.NODE_ENV !== "production" ? (process.env.PROPATH_DEV_PLAN as PlanName | undefined) : undefined;

/** The user's current plan, from their subscription record (written only by the server). */
export async function getAccess(uid: string): Promise<Access> {
  if (devPlan === "basic" || devPlan === "pro") return { plan: devPlan, expiresAt: null };
  if (!adminDb) return { plan: "free", expiresAt: null };
  const snap = await adminDb.collection("users").doc(uid).get();
  const sub = snap.get("subscription") as { plan?: PlanName; expiresAtMs?: number; expiresAt?: string } | undefined;
  const active = Boolean(sub?.expiresAtMs && sub.expiresAtMs > Date.now() && (sub.plan === "basic" || sub.plan === "pro"));
  return active ? { plan: sub!.plan!, expiresAt: sub!.expiresAt ?? null } : { plan: "free", expiresAt: null };
}

declare module "express-serve-static-core" {
  interface Request {
    user?: RequestUser | null;
  }
}

/** Attaches `req.user` when a valid ID token is present; never blocks. */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  req.user = await getRequestUser(req);
  next();
}

/** A real (non-anonymous) account, so purchases can't be lost with the device. */
export async function requireAccount(req: Request, res: Response, next: NextFunction) {
  const user = req.user ?? (await getRequestUser(req));
  if (!user) return res.status(401).json({ error: "sign_in_required" });
  if (user.anonymous) return res.status(403).json({ error: "account_required" });
  req.user = user;
  next();
}

const PLAN_RANK: Record<PlanName, number> = { free: 0, basic: 1, pro: 2 };

export function requirePlan(minimum: "basic" | "pro") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ?? (await getRequestUser(req));
    if (!user) return res.status(401).json({ error: "sign_in_required" });
    const access = await getAccess(user.uid);
    if (PLAN_RANK[access.plan] < PLAN_RANK[minimum]) return res.status(403).json({ error: "plan_required", plan: minimum });
    req.user = user;
    next();
  };
}

/** Admin accounts: emails listed in PROPATH_ADMIN_EMAILS (comma-separated). */
export function isAdminEmail(email?: string) {
  const admins = (process.env.PROPATH_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return Boolean(email && admins.includes(email.toLowerCase()));
}

/** Admins sign in with an admin account, or (as a backup) send the PROPATH_ADMIN_KEY header. */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.PROPATH_ADMIN_KEY;
  if (expected && req.headers["x-admin-key"] === expected) return next();
  const user = req.user ?? (await getRequestUser(req));
  if (user && !user.anonymous && isAdminEmail(user.email)) return next();
  return res.status(401).json({ error: "admin_required" });
}

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Fixed-window limiter keyed by user ID, or by IP for signed-out callers. */
export function rateLimit(name: string, limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const who = req.user?.uid || req.ip || "unknown";
    const key = `${name}:${who}`;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= limit) {
      res.setHeader("Retry-After", Math.ceil((bucket.resetAt - now) / 1000));
      return res.status(429).json({ error: "too_many_requests" });
    }
    bucket.count++;
    next();
  };
}
