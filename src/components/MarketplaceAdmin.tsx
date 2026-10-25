import React, { useState } from "react";
import { getSkill } from "../career/skills";
import type { TutorCourse, TutorProfile } from "../marketplace/types";
import { Markdown, Modal, Spinner } from "./ui";

const KEY_STORAGE = "propath_admin_key";

/** Tutor approval, course review and tutor payouts. Uses the admin key entered above. */
export function MarketplaceAdmin() {
  const [tutors, setTutors] = useState<TutorProfile[] | null>(null);
  const [courses, setCourses] = useState<TutorCourse[] | null>(null);
  const [payouts, setPayouts] = useState<any | null>(null);
  const [review, setReview] = useState<{ course: TutorCourse; content: any[] } | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [refs, setRefs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const key = () => {
    try {
      return sessionStorage.getItem(KEY_STORAGE) || "";
    } catch {
      return "";
    }
  };

  const call = async (path: string, init: RequestInit = {}) => {
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", "x-admin-key": key() } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  };

  const run = async (fn: () => Promise<void>, done?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
      if (done) setMessage({ ok: true, text: done });
    } catch (err: any) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const load = () =>
    run(async () => {
      const [t, c, p] = await Promise.all([
        call("/api/admin/tutors?status=pending"),
        call("/api/admin/tutor-courses?status=pending_review"),
        call("/api/admin/payouts"),
      ]);
      setTutors(t.tutors);
      setCourses(c.courses);
      setPayouts(p);
    });

  const decideTutor = (uid: string, status: string) =>
    run(async () => {
      await call(`/api/admin/tutors/${uid}`, { method: "POST", body: JSON.stringify({ status, note: notes[uid] || "" }) });
      setTutors((list) => (list || []).filter((t) => t.uid !== uid));
    }, status === "approved" ? "Tutor approved." : "Tutor updated.");

  const openReview = (id: string) => run(async () => setReview(await call(`/api/admin/tutor-courses/${id}`)));

  const decideCourse = (id: string, status: "approved" | "rejected") =>
    run(async () => {
      await call(`/api/admin/tutor-courses/${id}`, { method: "POST", body: JSON.stringify({ status, note: notes[id] || "" }) });
      setCourses((list) => (list || []).filter((c) => c.id !== id));
      setReview(null);
    }, status === "approved" ? "Course published." : "Course sent back to the tutor.");

  const pay = (tutorId: string, mode: "manual" | "cinetpay") =>
    run(async () => {
      await call("/api/admin/payouts", { method: "POST", body: JSON.stringify({ tutorId, mode, reference: refs[tutorId] || "" }) });
      setPayouts(await call("/api/admin/payouts"));
    }, mode === "manual" ? "Payout recorded." : "Transfer sent to CinetPay.");

  const setPayoutStatus = (id: string, status: "paid" | "failed") =>
    run(async () => {
      await call(`/api/admin/payouts/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
      setPayouts(await call("/api/admin/payouts"));
    });

  return (
    <section className="pp-card p-5 sm:p-6 flex flex-col gap-6 mb-8" aria-labelledby="market-admin-h">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="market-admin-h" className="font-display text-xl font-semibold">Tutors, courses and payouts</h2>
          <p className="text-sm text-mist">Uses the admin key entered above.</p>
        </div>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={load} disabled={busy}>{busy && <Spinner />}Load</button>
      </div>
      {message && <p className={`text-sm ${message.ok ? "text-path-text" : "text-danger-text"}`} role="status">{message.text}</p>}

      {tutors && (
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-semibold">Tutor applications ({tutors.length})</h3>
          {tutors.length === 0 && <p className="text-sm text-mist">No pending applications.</p>}
          {tutors.map((t) => (
            <article key={t.uid} className="rounded-xl border border-ink-700 p-4 flex flex-col gap-2">
              <p className="font-semibold text-chalk">{t.displayName} <span className="text-mist font-normal">· {t.type} · {t.city}, {t.country}</span></p>
              <p className="text-sm text-mist">{t.email} · {t.phone} · payout: {t.payout.operator} +{t.payout.prefix} {t.payout.number} ({t.payout.holderName})</p>
              <p className="text-sm text-body whitespace-pre-line">{t.bio}</p>
              <p className="text-sm text-mist">Teaches: {t.skills.map((k) => getSkill(k)?.label.en || k).join(", ")}</p>
              <label className="sr-only" htmlFor={`tn-${t.uid}`}>Note to tutor</label>
              <input id={`tn-${t.uid}`} className="pp-input" placeholder="Note to the tutor (shown if rejected)" value={notes[t.uid] || ""} onChange={(e) => setNotes({ ...notes, [t.uid]: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => decideTutor(t.uid, "approved")}>Approve</button>
                <button type="button" className="pp-btn pp-btn-secondary" disabled={busy} onClick={() => decideTutor(t.uid, "rejected")}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {courses && (
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-semibold">Courses waiting for review ({courses.length})</h3>
          {courses.length === 0 && <p className="text-sm text-mist">Nothing to review.</p>}
          {courses.map((c) => (
            <article key={c.id} className="rounded-xl border border-ink-700 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-chalk">{c.title}</p>
                <p className="text-sm text-mist">{c.tutorName} · {c.chapters.length} chapters · {c.freeChapters} free · {c.pricing.mode === "per_chapter" ? `$${c.pricing.chapterPrice}/chapter` : `$${c.pricing.coursePrice} course`}</p>
              </div>
              <button type="button" className="pp-btn pp-btn-secondary" onClick={() => openReview(c.id)} disabled={busy}>Review</button>
            </article>
          ))}
        </div>
      )}

      {payouts && (
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-semibold">Tutor payouts</h3>
          <p className="text-sm text-mist">
            {payouts.automatic
              ? "Automatic CinetPay transfers are configured."
              : "Automatic transfers are off (set CINETPAY_TRANSFER_PASSWORD and CINETPAY_PAYOUT_CURRENCY). Pay by mobile money yourself and record the reference."}
          </p>
          {payouts.balances.length === 0 && <p className="text-sm text-mist">No unpaid earnings.</p>}
          {payouts.balances.map((b: any) => (
            <article key={b.tutorId} className="rounded-xl border border-ink-700 p-4 flex flex-col gap-2">
              <p className="font-semibold text-chalk">{b.displayName} <span className="font-mono">· ${b.unpaid}</span> <span className="text-mist font-normal">({b.sales} sales)</span></p>
              <p className="text-sm text-mist">{b.payout?.operator} +{b.payout?.prefix} {b.payout?.number} · {b.payout?.holderName}</p>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] items-end">
                <div>
                  <label className="pp-label" htmlFor={`ref-${b.tutorId}`}>Mobile money reference (manual payout)</label>
                  <input id={`ref-${b.tutorId}`} className="pp-input" value={refs[b.tutorId] || ""} onChange={(e) => setRefs({ ...refs, [b.tutorId]: e.target.value })} />
                </div>
                <button type="button" className="pp-btn pp-btn-secondary" disabled={busy || !refs[b.tutorId]} onClick={() => pay(b.tutorId, "manual")}>Record payment</button>
                {payouts.automatic && <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => pay(b.tutorId, "cinetpay")}>Pay via CinetPay</button>}
              </div>
            </article>
          ))}
          {payouts.history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dim"><th className="py-2 pr-3 font-medium">Date</th><th className="py-2 pr-3 font-medium">Tutor</th><th className="py-2 pr-3 font-medium">Amount</th><th className="py-2 pr-3 font-medium">Mode</th><th className="py-2 font-medium">Status</th></tr>
                </thead>
                <tbody>
                  {payouts.history.map((p: any) => (
                    <tr key={p.id} className="border-t border-ink-700">
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-3">{p.tutorName}</td>
                      <td className="py-2 pr-3 font-mono whitespace-nowrap">${p.amountUsd}{p.transferAmount ? ` (${p.transferAmount} ${p.transferCurrency})` : ""}</td>
                      <td className="py-2 pr-3">{p.mode}{p.reference ? ` · ${p.reference}` : ""}</td>
                      <td className="py-2">
                        {p.status}
                        {p.status === "processing" && (
                          <span className="inline-flex gap-1 ml-2">
                            <button type="button" className="underline text-path-text" onClick={() => setPayoutStatus(p.id, "paid")}>mark paid</button>
                            <button type="button" className="underline text-danger-text" onClick={() => setPayoutStatus(p.id, "failed")}>mark failed</button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal open={Boolean(review)} onClose={() => setReview(null)} title={review?.course.title || ""} wide>
        {review && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-mist">{review.course.tutorName} · {review.course.language} · {review.course.format}{review.course.city ? ` · ${review.course.city}` : ""} · skills: {review.course.skills.map((k) => getSkill(k)?.label.en || k).join(", ")}</p>
            <p className="text-body whitespace-pre-line">{review.course.description}</p>
            {review.content.map((c, i) => (
              <details key={i} className="rounded-xl border border-ink-700 p-3">
                <summary className="cursor-pointer font-semibold">{i + 1}. {c.title} {i < review.course.freeChapters ? "(free)" : "(paid)"}</summary>
                {c.videoUrl && <p className="text-sm text-ascent-text mt-2 break-all">Video: {c.videoUrl}</p>}
                <div className="mt-3"><Markdown>{c.body || ""}</Markdown></div>
              </details>
            ))}
            <label className="pp-label" htmlFor="review-note">Note to the tutor (required if sending back)</label>
            <textarea id="review-note" rows={3} className="pp-input" value={notes[review.course.id] || ""} onChange={(e) => setNotes({ ...notes, [review.course.id]: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => decideCourse(review.course.id, "approved")}>Publish</button>
              <button type="button" className="pp-btn pp-btn-secondary" disabled={busy || !notes[review.course.id]} onClick={() => decideCourse(review.course.id, "rejected")}>Send back with note</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
