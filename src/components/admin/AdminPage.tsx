import React, { lazy, Suspense, useEffect, useState } from "react";
import { Building2, CreditCard, GraduationCap, LayoutDashboard, ShieldCheck, Users, Wallet } from "lucide-react";
import { useAccount } from "../../lib/account";
import { useSystemTheme } from "../../lib/theme";
import { Spinner } from "../ui";
import { CoursesSection, PaymentsSection, PayoutsSection, TutorsSection } from "./sections";
import { ADMIN_KEY_STORAGE, storedAdminKey, useAdminApi, type AdminCall } from "./useAdminApi";

const AdminPortal = lazy(() => import("../AdminPortal").then((m) => ({ default: m.AdminPortal })));

type Tab = "overview" | "tutors" | "courses" | "payouts" | "payments" | "partners";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tutors", label: "Tutors", icon: Users },
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "payments", label: "Payments & plans", icon: CreditCard },
  { id: "partners", label: "Partners", icon: Building2 },
];

/** ProPath admin: visible to admin accounts, or with the backup admin key. */
export function AdminPage({ onExit }: { onExit: () => void }) {
  const { ready } = useAccount();
  const call = useAdminApi();
  const theme = useSystemTheme();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  const check = () =>
    call("/api/admin/pricing")
      .then(() => setAllowed(true))
      .catch(() => setAllowed(false));

  useEffect(() => {
    if (ready) check();
  }, [ready]);

  if (allowed === null) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;
  if (!allowed) return <AdminKeyGate onUnlocked={check} />;

  return (
    <div className="flex flex-wrap gap-8 items-start">
      <nav aria-label="Admin" className="flex-[1_1_200px] max-w-[240px] md:sticky md:top-24 flex md:flex-col gap-1 overflow-x-auto">
        <p className="pp-eyebrow px-3 pb-2 hidden md:block">ProPath Admin</p>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`min-h-[44px] px-3 rounded-xl flex items-center gap-3 text-sm font-medium whitespace-nowrap ${tab === t.id ? "bg-ink-800 text-chalk" : "text-mist hover:text-chalk hover:bg-ink-800"}`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />{t.label}
            </button>
          );
        })}
      </nav>
      <main className="flex-[999_1_560px] min-w-0">
        {tab === "overview" && <Overview call={call} onOpen={setTab} />}
        {tab === "tutors" && <TutorsSection call={call} />}
        {tab === "courses" && <CoursesSection call={call} />}
        {tab === "payouts" && <PayoutsSection call={call} />}
        {tab === "payments" && <PaymentsSection call={call} />}
        {tab === "partners" && (
          <Suspense fallback={<Spinner className="w-8 h-8" />}>
            <AdminPortal onBack={onExit} theme={theme} />
          </Suspense>
        )}
      </main>
    </div>
  );
}

function AdminKeyGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [key, setKey] = useState(storedAdminKey());
  const [error, setError] = useState(false);
  return (
    <form
      className="max-w-md mx-auto pp-card p-6 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          sessionStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
        } catch {
          // ignore
        }
        setError(true);
        onUnlocked();
      }}
    >
      <ShieldCheck className="w-8 h-8 text-path" aria-hidden="true" />
      <h1 className="font-display text-2xl font-semibold">Admin access</h1>
      <p className="text-sm text-mist">Sign in with an admin account, or enter the admin key.</p>
      <div>
        <label className="pp-label" htmlFor="admin-key">Admin key</label>
        <input id="admin-key" type="password" className="pp-input" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
      </div>
      {error && storedAdminKey() && <p className="text-sm text-danger-text" role="alert">That key wasn't accepted.</p>}
      <button type="submit" className="pp-btn pp-btn-primary" disabled={!key.trim()}>Continue</button>
    </form>
  );
}

function Overview({ call, onOpen }: { call: AdminCall; onOpen: (t: Tab) => void }) {
  const [stats, setStats] = useState<{ tutors: number; courses: number; unpaid: number; payments: number } | null>(null);
  useEffect(() => {
    Promise.all([
      call("/api/admin/tutors?status=pending"),
      call("/api/admin/tutor-courses?status=pending_review"),
      call("/api/admin/payouts"),
      call("/api/admin/payments"),
    ])
      .then(([t, c, p, pay]) =>
        setStats({
          tutors: t.tutors.length,
          courses: c.courses.length,
          unpaid: Math.round(p.balances.reduce((s: number, b: any) => s + b.unpaid, 0) * 100) / 100,
          payments: pay.payments.filter((x: any) => x.status === "accepted" && x.provider !== "test").length,
        })
      )
      .catch(() => setStats({ tutors: 0, courses: 0, unpaid: 0, payments: 0 }));
  }, []);

  const cards: { label: string; value: string; hint: string; tab: Tab; urgent: boolean }[] = stats
    ? [
        { label: "Tutor applications", value: String(stats.tutors), hint: "waiting for approval", tab: "tutors", urgent: stats.tutors > 0 },
        { label: "Courses to review", value: String(stats.courses), hint: "before publishing", tab: "courses", urgent: stats.courses > 0 },
        { label: "Owed to tutors", value: `$${stats.unpaid}`, hint: "unpaid earnings", tab: "payouts", urgent: stats.unpaid > 0 },
        { label: "Paid purchases", value: String(stats.payments), hint: "in the last 100 payments", tab: "payments", urgent: false },
      ]
    : [];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-semibold">Overview</h2>
      {!stats ? (
        <Spinner className="w-8 h-8" />
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {cards.map((c) => (
            <button key={c.label} type="button" onClick={() => onOpen(c.tab)} className={`pp-card p-5 flex flex-col gap-1 text-left hover:!border-ink-600 ${c.urgent ? "!border-path" : ""}`}>
              <span className="text-sm text-mist">{c.label}</span>
              <span className="font-display text-3xl font-bold">{c.value}</span>
              <span className="text-xs text-dim">{c.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
