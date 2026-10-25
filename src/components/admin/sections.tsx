import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getSkill } from "../../career/skills";
import type { TutorCourse, TutorProfile } from "../../marketplace/types";
import { Markdown, Modal, Spinner } from "../ui";
import type { AdminCall } from "./useAdminApi";

/** Loads data when a section opens, with a refresh button and a status line. */
function useSection<T>(call: AdminCall, load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const refresh = async () => {
    setBusy(true);
    try {
      setData(await load());
    } catch (err: any) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);
  const act = async (fn: () => Promise<void>, done?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
      if (done) setMessage({ ok: true, text: done });
      setData(await load());
    } catch (err: any) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };
  return { data, busy, message, refresh, act };
}

function Header({ title, description, busy, onRefresh, message }: {
  title: string;
  description?: string;
  busy: boolean;
  onRefresh: () => void;
  message: { ok: boolean; text: string } | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          {description && <p className="text-sm text-mist max-w-2xl">{description}</p>}
        </div>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={onRefresh} disabled={busy} aria-label="Refresh">
          {busy ? <Spinner className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />} Refresh
        </button>
      </div>
      {message && <p className={`text-sm rounded-xl px-3 py-2 ${message.ok ? "bg-path-soft text-path-text" : "bg-danger-soft text-danger-text"}`} role="status">{message.text}</p>}
    </div>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => <p className="pp-card p-6 text-center text-mist">{children}</p>;

// Tutors -------------------------------------------------------------------

export function TutorsSection({ call }: { call: AdminCall }) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "suspended">("pending");
  const s = useSection(call, () => call<{ tutors: TutorProfile[] }>(`/api/admin/tutors?status=${status}`).then((d) => d.tutors));
  const [notes, setNotes] = useState<Record<string, string>>({});
  useEffect(() => {
    s.refresh();
  }, [status]);

  const decide = (uid: string, next: string, label: string) =>
    s.act(() => call(`/api/admin/tutors/${uid}`, { method: "POST", body: JSON.stringify({ status: next, note: notes[uid] || "" }) }), label);

  return (
    <div className="flex flex-col gap-5">
      <Header title="Tutors" description="Approve trainers, schools and institutes before they can publish courses." busy={s.busy} onRefresh={s.refresh} message={s.message} />
      <FilterTabs<typeof status> value={status} onChange={setStatus} options={[["pending", "Waiting"], ["approved", "Approved"], ["rejected", "Rejected"], ["suspended", "Suspended"]]} />
      {s.data && s.data.length === 0 && <Empty>No tutors here.</Empty>}
      {s.data?.map((t) => (
        <article key={t.uid} className="pp-card p-5 flex flex-col gap-3">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold">{t.displayName}</h3>
              <p className="text-sm text-mist">{t.type} · {t.city}, {t.country} · {t.email} · {t.phone}</p>
            </div>
            <p className="text-sm text-mist">Payout: {t.payout.operator} +{t.payout.prefix} {t.payout.number} ({t.payout.holderName})</p>
          </div>
          <p className="text-[15px] text-body whitespace-pre-line">{t.bio}</p>
          <p className="text-sm text-mist">Teaches: {t.skills.map((k) => getSkill(k)?.label.en || k).join(", ")}</p>
          <label className="sr-only" htmlFor={`tn-${t.uid}`}>Note to tutor</label>
          <input id={`tn-${t.uid}`} className="pp-input" placeholder="Note to the tutor (shown if rejected or suspended)" value={notes[t.uid] || ""} onChange={(e) => setNotes({ ...notes, [t.uid]: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            {status !== "approved" && <button type="button" className="pp-btn pp-btn-primary" disabled={s.busy} onClick={() => decide(t.uid, "approved", `${t.displayName} approved.`)}>Approve</button>}
            {status === "pending" && <button type="button" className="pp-btn pp-btn-secondary" disabled={s.busy} onClick={() => decide(t.uid, "rejected", `${t.displayName} rejected.`)}>Reject</button>}
            {status === "approved" && <button type="button" className="pp-btn pp-btn-secondary" disabled={s.busy} onClick={() => decide(t.uid, "suspended", `${t.displayName} suspended; their courses are unpublished.`)}>Suspend</button>}
          </div>
        </article>
      ))}
    </div>
  );
}

function FilterTabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="tab" aria-selected={value === v} onClick={() => onChange(v)}
          className={`min-h-[40px] px-4 rounded-full border text-sm font-semibold ${value === v ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-mist hover:bg-ink-800"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

// Courses ------------------------------------------------------------------

export function CoursesSection({ call }: { call: AdminCall }) {
  const [status, setStatus] = useState<"pending_review" | "approved" | "rejected">("pending_review");
  const s = useSection(call, () => call<{ courses: TutorCourse[] }>(`/api/admin/tutor-courses?status=${status}`).then((d) => d.courses));
  const [review, setReview] = useState<{ course: TutorCourse; content: any[] } | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => {
    s.refresh();
  }, [status]);

  const open = async (id: string) => {
    setNote("");
    setReview(await call(`/api/admin/tutor-courses/${id}`));
  };
  const decide = (next: "approved" | "rejected") =>
    s.act(async () => {
      await call(`/api/admin/tutor-courses/${review!.course.id}`, { method: "POST", body: JSON.stringify({ status: next, note }) });
      setReview(null);
    }, next === "approved" ? "Course published." : "Course sent back to the tutor.");

  return (
    <div className="flex flex-col gap-5">
      <Header title="Courses" description="Read every chapter before a tutor's course goes live." busy={s.busy} onRefresh={s.refresh} message={s.message} />
      <FilterTabs<typeof status> value={status} onChange={setStatus} options={[["pending_review", "To review"], ["approved", "Published"], ["rejected", "Sent back"]]} />
      {s.data && s.data.length === 0 && <Empty>No courses here.</Empty>}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {s.data?.map((c) => (
          <article key={c.id} className="pp-card p-5 flex flex-col gap-2">
            <p className="text-xs text-dim">{c.tutorName}</p>
            <h3 className="font-display font-semibold">{c.title}</h3>
            <p className="text-sm text-mist">
              {c.chapters.length} chapters · {c.freeChapters} free · {c.pricing.mode === "per_chapter" ? `$${c.pricing.chapterPrice} per chapter` : `$${c.pricing.coursePrice} for the course`} · {c.learners} learners
            </p>
            <button type="button" className="pp-btn pp-btn-secondary mt-auto" onClick={() => open(c.id)}>{status === "pending_review" ? "Review" : "Open"}</button>
          </article>
        ))}
      </div>
      <Modal open={Boolean(review)} onClose={() => setReview(null)} title={review?.course.title || ""} wide>
        {review && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-mist">
              {review.course.tutorName} · {review.course.language} · {review.course.format}{review.course.city ? ` · ${review.course.city}` : ""} · {review.course.skills.map((k) => getSkill(k)?.label.en || k).join(", ")}
            </p>
            <p className="text-body whitespace-pre-line">{review.course.description}</p>
            {review.content.map((c, i) => (
              <details key={i} className="rounded-xl border border-ink-700 p-3" open={i === 0}>
                <summary className="cursor-pointer font-semibold">{i + 1}. {c.title} <span className="text-dim font-normal">({i < review.course.freeChapters ? "free" : "paid"})</span></summary>
                {c.videoUrl && <p className="text-sm text-ascent-text mt-2 break-all">Video: {c.videoUrl}</p>}
                <div className="mt-3"><Markdown>{c.body || ""}</Markdown></div>
              </details>
            ))}
            <label className="pp-label" htmlFor="review-note">Note to the tutor (required to send back)</label>
            <textarea id="review-note" rows={3} className="pp-input" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {review.course.status !== "approved" && <button type="button" className="pp-btn pp-btn-primary" disabled={s.busy} onClick={() => decide("approved")}>Publish</button>}
              <button type="button" className="pp-btn pp-btn-secondary" disabled={s.busy || !note.trim()} onClick={() => decide("rejected")}>
                {review.course.status === "approved" ? "Unpublish with note" : "Send back with note"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Payouts ------------------------------------------------------------------

export function PayoutsSection({ call }: { call: AdminCall }) {
  const s = useSection(call, () => call("/api/admin/payouts"));
  const [refs, setRefs] = useState<Record<string, string>>({});
  const pay = (tutorId: string, mode: "manual" | "cinetpay") =>
    s.act(() => call("/api/admin/payouts", { method: "POST", body: JSON.stringify({ tutorId, mode, reference: refs[tutorId] || "" }) }), mode === "manual" ? "Payout recorded." : "Transfer sent to CinetPay.");
  const setStatus = (id: string, status: "paid" | "failed") =>
    s.act(() => call(`/api/admin/payouts/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }));
  const d = s.data;

  return (
    <div className="flex flex-col gap-5">
      <Header
        title="Tutor payouts"
        description={d?.automatic
          ? "Tutors receive 80% of each sale. Pay by CinetPay transfer, or pay yourself and record the reference."
          : "Tutors receive 80% of each sale. Send the mobile money yourself, then record the transaction reference here."}
        busy={s.busy}
        onRefresh={s.refresh}
        message={s.message}
      />
      {d && d.balances.length === 0 && <Empty>No unpaid earnings.</Empty>}
      {d?.balances.map((b: any) => (
        <article key={b.tutorId} className="pp-card p-5 flex flex-col gap-3">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold">{b.displayName}</h3>
              <p className="text-sm text-mist">{b.payout?.operator} +{b.payout?.prefix} {b.payout?.number} · {b.payout?.holderName}</p>
            </div>
            <p className="font-display text-2xl font-bold">${b.unpaid}<span className="text-sm font-normal text-mist"> · {b.sales} sales</span></p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] items-end">
            <div>
              <label className="pp-label" htmlFor={`ref-${b.tutorId}`}>Mobile money transaction reference</label>
              <input id={`ref-${b.tutorId}`} className="pp-input" value={refs[b.tutorId] || ""} onChange={(e) => setRefs({ ...refs, [b.tutorId]: e.target.value })} />
            </div>
            <button type="button" className="pp-btn pp-btn-secondary" disabled={s.busy || !refs[b.tutorId]} onClick={() => pay(b.tutorId, "manual")}>Record payment</button>
            {d.automatic && <button type="button" className="pp-btn pp-btn-primary" disabled={s.busy} onClick={() => pay(b.tutorId, "cinetpay")}>Pay via CinetPay</button>}
          </div>
        </article>
      ))}
      {d && d.history.length > 0 && (
        <div className="pp-card p-5 flex flex-col gap-3">
          <h3 className="font-display font-semibold">History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-dim"><th className="py-2 pr-3 font-medium">Date</th><th className="py-2 pr-3 font-medium">Tutor</th><th className="py-2 pr-3 font-medium">Amount</th><th className="py-2 pr-3 font-medium">How</th><th className="py-2 font-medium">Status</th></tr></thead>
              <tbody>
                {d.history.map((p: any) => (
                  <tr key={p.id} className="border-t border-ink-700">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">{p.tutorName}</td>
                    <td className="py-2 pr-3 font-mono whitespace-nowrap">${p.amountUsd}{p.transferAmount ? ` (${p.transferAmount} ${p.transferCurrency})` : ""}</td>
                    <td className="py-2 pr-3">{p.mode === "manual" ? "Manual" : "CinetPay"}{p.reference ? ` · ${p.reference}` : ""}</td>
                    <td className="py-2">
                      <StatusPill status={p.status} />
                      {p.status === "processing" && (
                        <span className="inline-flex gap-3 ml-3">
                          <button type="button" className="underline text-path-text" onClick={() => setStatus(p.id, "paid")}>Mark paid</button>
                          <button type="button" className="underline text-danger-text" onClick={() => setStatus(p.id, "failed")}>Mark failed</button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "paid" || status === "accepted" ? "bg-path-soft text-path-text"
    : status === "failed" || status === "refused" ? "bg-danger-soft text-danger-text"
    : "bg-ink-800 text-mist";
  return <span className={`pp-chip ${tone}`}>{status}</span>;
}

// Payments, plans and prices ------------------------------------------------

const COUNTRY_CODES = ["DEFAULT", "CD", "CI", "SN", "FR", "CA", "US"];

export function PaymentsSection({ call }: { call: AdminCall }) {
  const s = useSection(call, async () => {
    const [pricing, payments] = await Promise.all([call("/api/admin/pricing"), call("/api/admin/payments")]);
    return { pricing, payments: payments.payments as any[] };
  });
  const [country, setCountry] = useState("CD");
  const [form, setForm] = useState({ currency: "USD", basic: 2, pro: 5, exam: 2 });
  const [grant, setGrant] = useState({ email: "", plan: "basic", months: "1" });

  useEffect(() => {
    if (!s.data) return;
    const key = country === "DEFAULT" ? "default" : country;
    setForm({ ...s.data.pricing.defaults, ...(s.data.pricing.countries.default || {}), ...(s.data.pricing.countries[key] || {}) });
  }, [country, s.data]);

  const num = (k: "basic" | "pro" | "exam") => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: Number(e.target.value) });
  const accepted = (s.data?.payments || []).filter((p) => p.status === "accepted" && p.provider !== "test");
  const revenue = accepted.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.currency]: (acc[p.currency] || 0) + p.amount }), {});

  return (
    <div className="flex flex-col gap-5">
      <Header title="Payments and plans" busy={s.busy} onRefresh={s.refresh} message={s.message} />

      <section className="pp-card p-5 flex flex-col gap-3">
        <h3 className="font-display font-semibold">Recent payments</h3>
        <p className="text-sm text-mist">
          Revenue in the last 100 payments: {Object.entries(revenue).map(([c, v]) => `${Math.round(v * 100) / 100} ${c}`).join(" · ") || "none yet"}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-dim"><th className="py-2 pr-3 font-medium">Date</th><th className="py-2 pr-3 font-medium">Item</th><th className="py-2 pr-3 font-medium text-right">Amount</th><th className="py-2 pr-3 font-medium">Reference</th><th className="py-2 font-medium">Status</th></tr></thead>
            <tbody>
              {(s.data?.payments || []).length === 0 && <tr><td colSpan={5} className="py-4 text-mist">No payments yet.</td></tr>}
              {(s.data?.payments || []).map((p) => (
                <tr key={p.id} className="border-t border-ink-700">
                  <td className="py-2 pr-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-3">{p.description}{p.provider === "test" ? " (test)" : ""}</td>
                  <td className="py-2 pr-3 text-right font-mono whitespace-nowrap">{p.amount} {p.currency}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{p.id}</td>
                  <td className="py-2"><StatusPill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form
        className="pp-card p-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          s.act(() => call("/api/admin/pricing", { method: "POST", body: JSON.stringify({ country, pricing: form }) }), `Prices saved for ${country === "DEFAULT" ? "all other countries" : country}.`);
        }}
      >
        <h3 className="font-display font-semibold">Prices by country</h3>
        <FilterTabs value={country} onChange={setCountry} options={COUNTRY_CODES.map((c) => [c, c === "DEFAULT" ? "Default" : c] as [string, string])} />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div>
            <label className="pp-label" htmlFor="pr-cur">Currency</label>
            <input id="pr-cur" className="pp-input" maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="pp-label" htmlFor="pr-basic">Basic / month</label>
            <input id="pr-basic" type="number" min={0} step="0.01" className="pp-input" value={form.basic} onChange={num("basic")} />
          </div>
          <div>
            <label className="pp-label" htmlFor="pr-pro">Pro / month</label>
            <input id="pr-pro" type="number" min={0} step="0.01" className="pp-input" value={form.pro} onChange={num("pro")} />
          </div>
          <div>
            <label className="pp-label" htmlFor="pr-exam">AI course exam</label>
            <input id="pr-exam" type="number" min={0} step="0.01" className="pp-input" value={form.exam} onChange={num("exam")} />
          </div>
        </div>
        <button type="submit" className="pp-btn pp-btn-primary self-start" disabled={s.busy}>Save prices</button>
      </form>

      <form
        className="pp-card p-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          s.act(
            () => call("/api/admin/subscription", { method: "POST", body: JSON.stringify({ email: grant.email.trim(), plan: grant.plan, months: Number(grant.months) }) }),
            grant.plan === "free" ? `Plan removed for ${grant.email}.` : `${grant.plan} granted to ${grant.email} for ${grant.months} month(s).`
          );
        }}
      >
        <h3 className="font-display font-semibold">Give a plan for free</h3>
        <p className="text-sm text-mist">For scholarships, partners or support cases. The person must already have a ProPath account.</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_150px_110px_auto] items-end">
          <div>
            <label className="pp-label" htmlFor="gr-email">Account email</label>
            <input id="gr-email" type="email" required className="pp-input" value={grant.email} onChange={(e) => setGrant({ ...grant, email: e.target.value })} />
          </div>
          <div>
            <label className="pp-label" htmlFor="gr-plan">Plan</label>
            <select id="gr-plan" className="pp-input" value={grant.plan} onChange={(e) => setGrant({ ...grant, plan: e.target.value })}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="free">Remove plan</option>
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="gr-months">Months</label>
            <input id="gr-months" type="number" min={1} className="pp-input" value={grant.months} onChange={(e) => setGrant({ ...grant, months: e.target.value })} />
          </div>
          <button type="submit" className="pp-btn pp-btn-secondary" disabled={s.busy}>Apply</button>
        </div>
      </form>
    </div>
  );
}
