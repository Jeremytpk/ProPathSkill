import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, signOut as fbSignOut, sendPasswordResetEmail, type User,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, onSnapshot, collection, deleteDoc, query, orderBy,
} from "firebase/firestore";
import { db, firebaseApp } from "./firebase";
import { apiUrl } from "./api";
import type { CareerReport } from "../types";
import type { Project } from "../projects/types";
import type { LearningPlan } from "../career/learningPlan";

/** Everything ProPath tracks for a person, saved automatically. */
export interface ProgressState {
  report: CareerReport | null;
  activeTrackId?: string;
  /** Roadmap actions the person ticked, keyed `${trackId}:${horizon}:${index}`. */
  roadmapChecks: Record<string, boolean>;
  courses: Record<string, CourseProgress>;
  /** Learning plans built from the person's own goals. */
  learningPlans: LearningPlan[];
  /** First steps ticked in learning plans, keyed `${planId}:${index}`. */
  planChecks: Record<string, boolean>;
  events: {
    assessmentCompletedAt?: string;
    trackExploredAt?: string;
    applicationSubmittedAt?: string;
    projectCreatedAt?: string;
  };
  updatedAt?: string;
}

export interface CourseProgress {
  title?: string;
  startedAt: string;
  lastChapter: number;
  /** Chapter index -> chosen option of the submitted quiz answer. */
  answers: Record<string, number>;
  passed: number[];
  totalChapters: number;
  completedAt?: string;
  /** Copy of a generated course, which exists nowhere else. */
  course?: any;
}

const EMPTY: ProgressState = { report: null, roadmapChecks: {}, courses: {}, learningPlans: [], planChecks: {}, events: {} };
const LOCAL_KEY = "propath_progress_v2";

function readLocal(): ProgressState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // Storage can be unavailable (private mode); progress then lives in memory and Firestore.
  }
  return EMPTY;
}

function writeLocal(state: ProgressState) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or privacy-mode errors.
  }
}

/** Firestore rejects `undefined`; strip it before writing. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export type PlanName = "free" | "basic" | "pro";

export interface Access {
  plan: PlanName;
  expiresAt: string | null;
}

const PLAN_RANK: Record<PlanName, number> = { free: 0, basic: 1, pro: 2 };

export type CheckoutRequest =
  | { kind: "subscription"; plan: "basic" | "pro"; months: number; country: string }
  | { kind: "exam"; courseId: string; country: string }
  | { kind: "tutor_chapter"; courseId: string; chapterIndex: number; country: string }
  | { kind: "tutor_course"; courseId: string; country: string };

interface AccountContextValue {
  ready: boolean;
  user: User | null;
  /** True when progress is saved to the cloud; false means this device only. */
  cloudSync: boolean;
  isGuest: boolean;
  access: Access;
  hasPlan: (minimum: "basic" | "pro") => boolean;
  /** Purchased items, e.g. "exam_<courseId>". */
  entitlements: Set<string>;
  progress: ProgressState;
  updateProgress: (update: (prev: ProgressState) => ProgressState) => void;
  projects: Project[];
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Starts a payment and sends the browser to the payment page. */
  checkout: (request: CheckoutRequest) => Promise<void>;
  /** fetch() with the user's ID token attached. */
  authedFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
}

const auth = firebaseApp ? getAuth(firebaseApp) : null;

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cloudSync, setCloudSync] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(readLocal);
  const [access, setAccess] = useState<Access>({ plan: "free", expiresAt: null });
  const [entitlements, setEntitlements] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(progress);
  latest.current = progress;
  const syncingRef = useRef(false);

  // Visitors can explore without an account; courses, purchases and projects need a real one.
  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u && !u.isAnonymous ? u : null);
      setReady(true);
    });
  }, []);

  // Make sure every account has a user record.
  useEffect(() => {
    if (!user || !db) return;
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
      .then((snap) => (snap.exists() ? undefined : setDoc(userRef, { createdAt: new Date().toISOString() })))
      .catch(() => undefined);
  }, [user?.uid]);

  // With a paid plan, load cloud progress and merge in anything recorded on this device.
  // Free users keep progress on this device only.
  const syncing = Boolean(user && access.plan !== "free");
  syncingRef.current = syncing && cloudSync;
  useEffect(() => {
    if (!user || !db || !syncing) {
      setCloudSync(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, "users", user.uid, "data", "progress");
        const snap = await getDoc(ref);
        if (cancelled) return;
        const local = readLocal();
        const cloud = snap.exists() ? ({ ...EMPTY, ...snap.data() } as ProgressState) : null;
        const merged = mergeProgress(cloud, local);
        setProgress(merged);
        writeLocal(merged);
        await setDoc(ref, clean(merged));
        setCloudSync(true);
      } catch (err) {
        console.warn("Cloud progress unavailable; saving on this device only.", err);
        setCloudSync(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, syncing]);

  // Plan and purchases, live. Both are written only by the server after payment.
  useEffect(() => {
    if (!user || !db) {
      setAccess({ plan: "free", expiresAt: null });
      setEntitlements(new Set());
      return;
    }
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const sub = snap.get("subscription") as { plan?: PlanName; expiresAtMs?: number; expiresAt?: string } | undefined;
      const active = Boolean(sub?.expiresAtMs && sub.expiresAtMs > Date.now() && (sub.plan === "basic" || sub.plan === "pro"));
      setAccess(active ? { plan: sub!.plan!, expiresAt: sub!.expiresAt ?? null } : { plan: "free", expiresAt: null });
    }, () => undefined);
    const unsubEnt = onSnapshot(collection(db, "users", user.uid, "entitlements"), (snap) => {
      setEntitlements(new Set(snap.docs.map((d) => d.id)));
    }, () => undefined);
    return () => {
      unsubUser();
      unsubEnt();
    };
  }, [user?.uid]);

  // Projects (Pro), live.
  useEffect(() => {
    if (!user || !db || access.plan !== "pro") {
      setProjects([]);
      return;
    }
    const q = query(collection(db, "users", user.uid, "projects"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) => setProjects(snap.docs.map((d) => d.data() as Project)), () => undefined);
  }, [user?.uid, access.plan]);

  const updateProgress = useCallback((update: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = { ...update(prev), updatedAt: new Date().toISOString() };
      writeLocal(next);
      return next;
    });
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const u = auth?.currentUser;
      if (!u || !db || !syncingRef.current) return;
      setDoc(doc(db, "users", u.uid, "data", "progress"), clean(latest.current)).catch((err) =>
        console.warn("Could not save progress to the cloud:", err)
      );
    }, 800);
  }, []);

  const saveProject = useCallback(async (project: Project) => {
    const u = auth?.currentUser;
    if (!u || !db) throw new Error("not_signed_in");
    await setDoc(doc(db, "users", u.uid, "projects", project.id), clean({ ...project, updatedAt: new Date().toISOString() }));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const u = auth?.currentUser;
    if (!u || !db) return;
    await deleteDoc(doc(db, "users", u.uid, "projects", id));
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("auth_unavailable");
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("auth_unavailable");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const continueWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("auth_unavailable");
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!auth) throw new Error("auth_unavailable");
    await sendPasswordResetEmail(auth, email);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    try {
      localStorage.removeItem(LOCAL_KEY);
    } catch {
      // ignore
    }
    setProgress(EMPTY);
    await fbSignOut(auth);
  }, []);

  const authedFetch = useCallback(async (input: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
    const token = await auth?.currentUser?.getIdToken().catch(() => null);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(apiUrl(input), { ...init, headers });
    return res.status === 202 ? waitForJob(res, headers) : res;
  }, []);

  const checkout = useCallback(async (request: CheckoutRequest) => {
    const res = await authedFetch("/api/pay/checkout", { method: "POST", body: JSON.stringify(request) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `checkout_failed_${res.status}`);
    window.location.href = data.paymentUrl;
  }, [authedFetch]);

  const hasPlan = useCallback((minimum: "basic" | "pro") => PLAN_RANK[access.plan] >= PLAN_RANK[minimum], [access.plan]);

  const value = useMemo<AccountContextValue>(() => ({
    ready, user, cloudSync, isGuest: !user, access, hasPlan, entitlements,
    progress, updateProgress, projects, saveProject, deleteProject,
    signUpWithEmail, signInWithEmail, continueWithGoogle, resetPassword, signOut, checkout, authedFetch,
  }), [ready, user, cloudSync, access, hasPlan, entitlements, progress, updateProgress, projects, saveProject,
    deleteProject, signUpWithEmail, signInWithEmail, continueWithGoogle, resetPassword, signOut, checkout, authedFetch]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

/**
 * Long AI requests run as background jobs on Netlify: the server answers 202 with a job ID.
 * Wait for the job, then hand back its response as if the request had returned it directly.
 */
async function waitForJob(accepted: Response, headers: Headers): Promise<Response> {
  const { jobId } = await accepted.clone().json().catch(() => ({ jobId: null }));
  if (!jobId) return accepted;
  const deadline = Date.now() + 15 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000));
    // Refresh the token on each check: long jobs can outlast it.
    const token = await auth?.currentUser?.getIdToken().catch(() => null);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(apiUrl(`/api/jobs/${jobId}`), { headers }).catch(() => null);
    if (!res || !res.ok) continue;
    const job = await res.json();
    if (job.status === "done") {
      return new Response(job.body, { status: job.statusCode, headers: { "Content-Type": "application/json" } });
    }
    if (job.status === "failed") break;
  }
  return new Response(JSON.stringify({ error: "ai_unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });
}

/** Combines cloud and device progress, keeping the most complete record of each part. */
function mergeProgress(cloud: ProgressState | null, local: ProgressState): ProgressState {
  if (!cloud) return local;
  const newer = (a?: string, b?: string) => ((a || "") >= (b || "") ? a : b);
  const reportFrom =
    (cloud.report?.createdAt || "") >= (local.report?.createdAt || "") ? cloud : local;
  const courses: Record<string, CourseProgress> = { ...local.courses };
  for (const [id, c] of Object.entries(cloud.courses || {})) {
    const l = courses[id];
    courses[id] = !l || c.passed.length >= l.passed.length ? c : l;
  }
  return {
    report: reportFrom.report,
    activeTrackId: reportFrom.activeTrackId,
    roadmapChecks: { ...local.roadmapChecks, ...cloud.roadmapChecks },
    courses,
    learningPlans: [
      ...(cloud.learningPlans || []),
      ...(local.learningPlans || []).filter((p) => !(cloud.learningPlans || []).some((c) => c.id === p.id)),
    ],
    planChecks: { ...local.planChecks, ...cloud.planChecks },
    events: {
      assessmentCompletedAt: newer(cloud.events?.assessmentCompletedAt, local.events?.assessmentCompletedAt),
      trackExploredAt: newer(cloud.events?.trackExploredAt, local.events?.trackExploredAt),
      applicationSubmittedAt: newer(cloud.events?.applicationSubmittedAt, local.events?.applicationSubmittedAt),
      projectCreatedAt: newer(cloud.events?.projectCreatedAt, local.events?.projectCreatedAt),
    },
    updatedAt: newer(cloud.updatedAt, local.updatedAt),
  };
}
