import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, Plus, Send, Trash2, Wallet } from "lucide-react";
import type { Lang } from "../career/assessment";
import { useAccount } from "../lib/account";
import { apiJson, formatUsd } from "../marketplace/api";
import {
  MIN_CHAPTERS, MIN_FREE_CHAPTERS, MIN_PRICE, TUTOR_SHARE, type TutorCourse, type TutorProfile, type TutorType,
} from "../marketplace/types";
import { AccountForm } from "./AccountForm";
import { SkillPicker } from "./SkillPicker";
import { Markdown, Modal, Spinner } from "./ui";

interface Me {
  profile: TutorProfile | null;
  courses: TutorCourse[];
  balance: { unpaid: number; total: number; sales: number; currency: string } | null;
  payouts?: { id: string; amountUsd: number; status: string; createdAt: string; reference?: string; mode: string }[];
}

const TYPE_LABELS: Record<TutorType, { en: string; fr: string }> = {
  individual: { en: "Independent trainer", fr: "Formateur indépendant" },
  school: { en: "School", fr: "École" },
  institute: { en: "Training institute", fr: "Institut de formation" },
  university: { en: "University", fr: "Université" },
};

const STATUS_LABELS: Record<string, { en: string; fr: string; tone: string }> = {
  draft: { en: "Draft", fr: "Brouillon", tone: "bg-ink-800 text-mist" },
  pending_review: { en: "In review", fr: "En vérification", tone: "bg-ascent-soft text-ascent-text" },
  approved: { en: "Published", fr: "Publié", tone: "bg-path-soft text-path-text" },
  rejected: { en: "Changes needed", fr: "À corriger", tone: "bg-danger-soft text-danger-text" },
};

export function TeachPage({ language }: { language: Lang }) {
  const fr = language === "french";
  const { isGuest, authedFetch, ready } = useAccount();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const load = () =>
    apiJson<Me>(authedFetch, "/api/tutor/me")
      .then((d) => { setMe(d); setError(null); })
      .catch(() => setError(fr ? "Impossible de charger votre espace formateur." : "Couldn't load your tutor space."));

  useEffect(() => {
    if (ready && !isGuest) load();
  }, [ready, isGuest]);

  if (!ready) return <Spinner className="w-8 h-8 mx-auto" />;

  if (isGuest) {
    return (
      <div className="flex flex-wrap gap-8">
        <Intro language={language} />
        <div className="flex-[1_1_340px] pp-card p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold">{fr ? "Étape 1 : créez votre compte" : "Step 1: create your account"}</h2>
          <AccountForm language={language} />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-danger-text" role="alert">{error}</p>;
  if (!me) return <Spinner className="w-8 h-8 mx-auto" />;

  if (editing) {
    return <CourseEditor courseId={editing === "new" ? null : editing} profile={me.profile!} language={language} onDone={() => { setEditing(null); load(); }} />;
  }

  if (!me.profile || editingProfile || me.profile.status === "rejected") {
    return (
      <div className="flex flex-wrap gap-8">
        <Intro language={language} />
        <div className="flex-[1_1_420px] flex flex-col gap-4">
          {me.profile?.status === "rejected" && (
            <p className="text-sm bg-danger-soft text-danger-text rounded-xl p-3">
              {fr ? "Votre demande n'a pas été acceptée. " : "Your application wasn't accepted. "}{me.profile.reviewNote}
            </p>
          )}
          <ApplicationForm language={language} initial={me.profile} onSaved={() => { setEditingProfile(false); load(); }} />
        </div>
      </div>
    );
  }

  if (me.profile.status === "pending") {
    return (
      <div className="max-w-xl pp-card p-6 flex flex-col gap-3">
        <p className="pp-eyebrow">{fr ? "Demande envoyée" : "Application sent"}</p>
        <h1 className="font-display text-2xl font-bold">{fr ? "Votre demande est en cours de vérification" : "Your application is being reviewed"}</h1>
        <p className="text-body">
          {fr
            ? "L'équipe ProPath vérifie chaque formateur avant publication. Vous pourrez créer vos cours dès votre validation."
            : "The ProPath team reviews every tutor before they publish. You can create courses as soon as you're approved."}
        </p>
        <button type="button" className="pp-btn pp-btn-secondary self-start" onClick={() => setEditingProfile(true)}>{fr ? "Modifier ma demande" : "Edit my application"}</button>
      </div>
    );
  }

  if (me.profile.status === "suspended") {
    return <p className="text-danger-text">{fr ? "Votre compte formateur est suspendu. Contactez ProPath." : "Your tutor account is suspended. Please contact ProPath."}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-2">
          <p className="pp-eyebrow">{tr2(TYPE_LABELS[me.profile.type], fr)}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">{me.profile.displayName}</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setEditingProfile(true)}>{fr ? "Mon profil" : "My profile"}</button>
          <button type="button" className="pp-btn pp-btn-primary" onClick={() => setEditing("new")}><Plus className="w-4 h-4" aria-hidden="true" />{fr ? "Nouveau cours" : "New course"}</button>
        </div>
      </div>

      {me.balance && (
        <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]" aria-label={fr ? "Revenus" : "Earnings"}>
          <Stat label={fr ? "À verser" : "To be paid"} value={formatUsd(me.balance.unpaid, language)} highlight />
          <Stat label={fr ? "Total gagné" : "Total earned"} value={formatUsd(me.balance.total, language)} />
          <Stat label={fr ? "Ventes" : "Sales"} value={String(me.balance.sales)} />
        </section>
      )}
      <p className="text-sm text-dim -mt-4 flex gap-2 items-center">
        <Wallet className="w-4 h-4" aria-hidden="true" />
        {fr
          ? `Vous recevez ${TUTOR_SHARE * 100} % de chaque vente, versés par mobile money sur le ${me.profile.payout.operator} +${me.profile.payout.prefix} ${me.profile.payout.number}.`
          : `You receive ${TUTOR_SHARE * 100}% of every sale, paid by mobile money to ${me.profile.payout.operator} +${me.profile.payout.prefix} ${me.profile.payout.number}.`}
      </p>

      <section className="flex flex-col gap-4" aria-labelledby="my-courses-h">
        <h2 id="my-courses-h" className="font-display text-xl font-semibold">{fr ? "Mes cours" : "My courses"}</h2>
        {me.courses.length === 0 ? (
          <p className="text-mist">{fr ? "Aucun cours pour l'instant." : "No courses yet."}</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {me.courses.map((c) => {
              const st = STATUS_LABELS[c.status];
              return (
                <article key={c.id} className="pp-card p-5 flex flex-col gap-3">
                  <span className={`pp-chip self-start ${st.tone}`}>{fr ? st.fr : st.en}</span>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-sm text-mist">
                    {c.chapters.length} {fr ? "chapitres" : "chapters"} · {c.learners} {fr ? "apprenants" : "learners"}
                  </p>
                  {c.status === "rejected" && c.reviewNote && <p className="text-sm text-danger-text">{c.reviewNote}</p>}
                  <button type="button" className="pp-btn pp-btn-secondary mt-auto" onClick={() => setEditing(c.id)}>{fr ? "Modifier" : "Edit"}</button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {me.payouts && me.payouts.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold">{fr ? "Versements" : "Payouts"}</h2>
          <ul className="flex flex-col gap-2">
            {me.payouts.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 p-3 rounded-xl border border-ink-700 text-sm">
                <span>{new Date(p.createdAt).toLocaleDateString(fr ? "fr-FR" : "en-US")} · {p.reference || p.id}</span>
                <span className="font-mono">{formatUsd(p.amountUsd, language)} · {p.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

const tr2 = (l: { en: string; fr: string }, fr: boolean) => (fr ? l.fr : l.en);

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`pp-card p-5 flex flex-col gap-1 ${highlight ? "!border-path" : ""}`}>
      <span className="text-sm text-mist">{label}</span>
      <span className="font-display text-2xl font-bold">{value}</span>
    </div>
  );
}

function Intro({ language }: { language: Lang }) {
  const fr = language === "french";
  const points = fr
    ? ["Publiez vos cours en ligne ou en présentiel", "Les 2 premiers chapitres sont gratuits, vous fixez le prix des autres (minimum 1 $)", "Vous recevez 80 % de chaque vente par mobile money", "Vos cours apparaissent dans les plans d'apprentissage des élèves qui en ont besoin"]
    : ["Publish online or in-person courses", "The first 2 chapters are free; you set the price of the rest (minimum $1)", "You receive 80% of every sale by mobile money", "Your courses appear in the learning plans of students who need them"];
  return (
    <div className="flex-[999_1_380px] flex flex-col gap-4">
      <p className="pp-eyebrow">{fr ? "Formateurs, écoles, instituts, universités" : "Trainers, schools, institutes, universities"}</p>
      <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Enseignez sur ProPath" : "Teach on ProPath"}</h1>
      <ul className="flex flex-col gap-3">
        {points.map((p) => <li key={p} className="text-body text-[16px] flex gap-3"><span className="text-path" aria-hidden="true">✓</span>{p}</li>)}
      </ul>
    </div>
  );
}

function ApplicationForm({ language, initial, onSaved }: { language: Lang; initial: TutorProfile | null; onSaved: () => void }) {
  const fr = language === "french";
  const { authedFetch } = useAccount();
  const [f, setF] = useState({
    type: initial?.type || ("individual" as TutorType),
    displayName: initial?.displayName || "",
    bio: initial?.bio || "",
    city: initial?.city || "",
    country: initial?.country || "RD Congo",
    phone: initial?.phone || "",
    operator: initial?.payout.operator || "M-Pesa",
    prefix: initial?.payout.prefix || "243",
    number: initial?.payout.number || "",
    holderName: initial?.payout.holderName || "",
    skills: initial?.skills || [],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiJson(authedFetch, "/api/tutor/apply", {
        method: "POST",
        body: JSON.stringify({
          type: f.type, displayName: f.displayName.trim(), bio: f.bio.trim(), city: f.city.trim(), country: f.country.trim(), phone: f.phone.trim(),
          payout: { operator: f.operator, prefix: f.prefix.replace(/\D/g, ""), number: f.number.replace(/\D/g, ""), holderName: f.holderName.trim() },
          skills: f.skills,
        }),
      });
      onSaved();
    } catch (err: any) {
      setError(err.message === "invalid_application"
        ? (fr ? "Vérifiez les champs : présentation d'au moins 20 caractères, numéro mobile money en chiffres, au moins une compétence." : "Check the fields: a bio of at least 20 characters, a mobile money number in digits, at least one skill.")
        : (fr ? "L'envoi a échoué. Réessayez." : "Sending failed. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="pp-card p-5 sm:p-6 flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold">{initial ? (fr ? "Votre profil formateur" : "Your tutor profile") : (fr ? "Demande pour devenir formateur" : "Apply to become a tutor")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="pp-label" htmlFor="t-type">{fr ? "Vous êtes" : "You are"}</label>
          <select id="t-type" className="pp-input" value={f.type} onChange={set("type")}>
            {(Object.keys(TYPE_LABELS) as TutorType[]).map((t) => <option key={t} value={t}>{tr2(TYPE_LABELS[t], fr)}</option>)}
          </select>
        </div>
        <div>
          <label className="pp-label" htmlFor="t-name">{fr ? "Nom affiché" : "Display name"}</label>
          <input id="t-name" className="pp-input" required value={f.displayName} onChange={set("displayName")} />
        </div>
      </div>
      <div>
        <label className="pp-label" htmlFor="t-bio">{fr ? "Présentation et expérience" : "About you and your experience"}</label>
        <textarea id="t-bio" rows={4} className="pp-input" required minLength={20} value={f.bio} onChange={set("bio")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="pp-label" htmlFor="t-city">{fr ? "Ville" : "City"}</label>
          <input id="t-city" className="pp-input" required value={f.city} onChange={set("city")} />
        </div>
        <div>
          <label className="pp-label" htmlFor="t-country">{fr ? "Pays" : "Country"}</label>
          <input id="t-country" className="pp-input" required value={f.country} onChange={set("country")} />
        </div>
        <div>
          <label className="pp-label" htmlFor="t-phone">{fr ? "Téléphone" : "Phone"}</label>
          <input id="t-phone" type="tel" className="pp-input" required value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </div>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-[15px] font-medium mb-2">{fr ? "Compte mobile money pour vos revenus" : "Mobile money account for your earnings"}</legend>
        <div className="grid gap-4 grid-cols-[1fr_90px_1.4fr]">
          <div>
            <label className="pp-label" htmlFor="t-op">{fr ? "Opérateur" : "Operator"}</label>
            <select id="t-op" className="pp-input" value={f.operator} onChange={set("operator")}>
              {["M-Pesa", "Orange Money", "Airtel Money", "Wave", "MTN Mobile Money", "Moov Money"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="t-prefix">{fr ? "Indicatif" : "Code"}</label>
            <input id="t-prefix" className="pp-input" inputMode="numeric" value={f.prefix} onChange={set("prefix")} />
          </div>
          <div>
            <label className="pp-label" htmlFor="t-number">{fr ? "Numéro" : "Number"}</label>
            <input id="t-number" className="pp-input" inputMode="numeric" required value={f.number} onChange={set("number")} />
          </div>
        </div>
        <div>
          <label className="pp-label" htmlFor="t-holder">{fr ? "Nom du titulaire du compte" : "Account holder's name"}</label>
          <input id="t-holder" className="pp-input" required value={f.holderName} onChange={set("holderName")} />
        </div>
      </fieldset>
      <div>
        <p className="pp-label">{fr ? "Ce que vous enseignez" : "What you teach"}</p>
        <SkillPicker id="t-skills" value={f.skills} onChange={(skills) => setF({ ...f, skills })} language={language} max={15} />
      </div>
      {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
      <button type="submit" className="pp-btn pp-btn-primary" disabled={busy || f.skills.length === 0}>
        {busy ? <Spinner /> : <Send className="w-4 h-4" aria-hidden="true" />}
        {initial ? (fr ? "Enregistrer" : "Save") : (fr ? "Envoyer ma demande" : "Send my application")}
      </button>
    </form>
  );
}

interface ChapterDraft { title: string; summary: string; body: string; videoUrl: string }

function CourseEditor({ courseId, profile, language, onDone }: { courseId: string | null; profile: TutorProfile; language: Lang; onDone: () => void }) {
  const fr = language === "french";
  const { authedFetch } = useAccount();
  const [loading, setLoading] = useState(Boolean(courseId));
  const [id, setId] = useState<string | null>(courseId);
  const [status, setStatus] = useState<string>("draft");
  const [reviewNote, setReviewNote] = useState("");
  const [meta, setMeta] = useState({
    title: "", description: "", skills: [] as string[], level: "beginner", language, format: "online", city: profile.city,
    mode: "per_chapter", chapterPrice: 1, coursePrice: 5, freeChapters: MIN_FREE_CHAPTERS,
  });
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    Array.from({ length: MIN_CHAPTERS }, () => ({ title: "", summary: "", body: "", videoUrl: "" }))
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [preview, setPreview] = useState<number | null>(null);

  useEffect(() => {
    if (!courseId) return;
    apiJson<{ course: TutorCourse; content: ChapterDraft[] }>(authedFetch, `/api/tutor/courses/${courseId}`)
      .then(({ course, content }) => {
        setMeta({
          title: course.title, description: course.description, skills: course.skills, level: course.level, language: course.language,
          format: course.format, city: course.city, mode: course.pricing.mode, chapterPrice: course.pricing.chapterPrice,
          coursePrice: course.pricing.coursePrice, freeChapters: course.freeChapters,
        });
        setChapters(content.map((c) => ({ title: c.title, summary: c.summary || "", body: c.body, videoUrl: c.videoUrl || "" })));
        setStatus(course.status);
        setReviewNote(course.reviewNote || "");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const updateChapter = (i: number, patch: Partial<ChapterDraft>) => setChapters(chapters.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...chapters];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setChapters(next);
  };

  const save = async (): Promise<string | null> => {
    const course = await apiJson<{ course: TutorCourse }>(authedFetch, "/api/tutor/courses", {
      method: "POST",
      body: JSON.stringify({
        ...(id ? { id } : {}),
        title: meta.title.trim(), description: meta.description.trim(), skills: meta.skills, level: meta.level, language: meta.language,
        format: meta.format, city: meta.city.trim(),
        pricing: { mode: meta.mode, chapterPrice: Number(meta.chapterPrice), coursePrice: Number(meta.coursePrice) },
        freeChapters: Number(meta.freeChapters),
        chapters: chapters.map((c) => ({ title: c.title.trim(), summary: c.summary.trim(), body: c.body, videoUrl: c.videoUrl.trim() })),
      }),
    });
    setId(course.course.id);
    setStatus(course.course.status);
    return course.course.id;
  };

  const run = async (submit: boolean) => {
    setBusy(true);
    setMessage(null);
    try {
      const savedId = await save();
      if (submit && savedId) {
        await apiJson(authedFetch, `/api/tutor/courses/${savedId}/submit`, { method: "POST" });
        setStatus("pending_review");
        setMessage({ ok: true, text: fr ? "Envoyé pour vérification. Vous serez notifié dès la publication." : "Sent for review. It goes live once approved." });
      } else {
        setMessage({ ok: true, text: fr ? "Brouillon enregistré." : "Draft saved." });
      }
    } catch (err: any) {
      const problems: string[] = err?.data?.problems || [];
      const text = err.message === "invalid_course"
        ? (fr ? "Vérifiez : titre (5 caractères min.), description (20 min.), au moins une compétence, prix d'au moins 1 $." : "Check: a title (5+ characters), a description (20+), at least one skill, prices of at least $1.")
        : problems.length
          ? (fr ? "Pas encore prêt : " : "Not ready yet: ") + problems.map((p) => ({
              min_chapters: fr ? `au moins ${MIN_CHAPTERS} chapitres` : `at least ${MIN_CHAPTERS} chapters`,
              min_free_chapters: fr ? `au moins ${MIN_FREE_CHAPTERS} chapitres gratuits` : `at least ${MIN_FREE_CHAPTERS} free chapters`,
              no_paid_chapters: fr ? "au moins un chapitre payant" : "at least one paid chapter",
              missing_titles: fr ? "un titre pour chaque chapitre" : "a title for every chapter",
              short_chapters: fr ? `chapitres trop courts : ${(err.data.shortChapters || []).map((n: number) => n + 1).join(", ")}` : `chapters too short: ${(err.data.shortChapters || []).map((n: number) => n + 1).join(", ")}`,
            } as Record<string, string>)[p] || p).join(" ; ")
          : (fr ? "L'enregistrement a échoué. Réessayez." : "Saving failed. Please try again.");
      setMessage({ ok: false, text });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!id || !window.confirm(fr ? "Supprimer ce cours ?" : "Delete this course?")) return;
    try {
      await apiJson(authedFetch, `/api/tutor/courses/${id}`, { method: "DELETE" });
      onDone();
    } catch (err: any) {
      setMessage({ ok: false, text: err.message === "has_learners" ? (fr ? "Ce cours a des apprenants et ne peut pas être supprimé." : "This course has learners and can't be deleted.") : (fr ? "Suppression impossible." : "Couldn't delete.") });
    }
  };

  if (loading) return <Spinner className="w-8 h-8 mx-auto" />;
  const st = STATUS_LABELS[status];
  const paidCount = Math.max(0, chapters.length - Number(meta.freeChapters));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <button type="button" onClick={onDone} className="self-start inline-flex items-center gap-2 text-sm text-mist hover:text-chalk min-h-[44px]">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {fr ? "Retour à mon espace" : "Back to my space"}
      </button>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">{id ? (fr ? "Modifier le cours" : "Edit course") : (fr ? "Nouveau cours" : "New course")}</h1>
        <span className={`pp-chip ${st.tone}`}>{fr ? st.fr : st.en}</span>
      </div>
      {status === "approved" && <p className="text-sm text-gold-text bg-gold-soft rounded-xl p-3">{fr ? "Toute modification renvoie le cours en vérification. Les élèves qui l'ont acheté gardent leur accès." : "Any change sends the course back to review. Learners who bought it keep their access."}</p>}
      {status === "rejected" && reviewNote && <p className="text-sm bg-danger-soft text-danger-text rounded-xl p-3">{reviewNote}</p>}

      <section className="pp-card p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <label className="pp-label" htmlFor="c-title">{fr ? "Titre du cours" : "Course title"}</label>
          <input id="c-title" className="pp-input" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
        </div>
        <div>
          <label className="pp-label" htmlFor="c-desc">{fr ? "Description : ce que l'élève saura faire" : "Description: what learners will be able to do"}</label>
          <textarea id="c-desc" rows={4} className="pp-input" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div>
            <label className="pp-label" htmlFor="c-level">{fr ? "Niveau" : "Level"}</label>
            <select id="c-level" className="pp-input" value={meta.level} onChange={(e) => setMeta({ ...meta, level: e.target.value })}>
              <option value="beginner">{fr ? "Débutant" : "Beginner"}</option>
              <option value="intermediate">{fr ? "Intermédiaire" : "Intermediate"}</option>
              <option value="advanced">{fr ? "Avancé" : "Advanced"}</option>
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="c-lang">{fr ? "Langue" : "Language"}</label>
            <select id="c-lang" className="pp-input" value={meta.language} onChange={(e) => setMeta({ ...meta, language: e.target.value as Lang })}>
              <option value="french">Français</option>
              <option value="english">English</option>
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="c-format">{fr ? "Format" : "Format"}</label>
            <select id="c-format" className="pp-input" value={meta.format} onChange={(e) => setMeta({ ...meta, format: e.target.value })}>
              <option value="online">{fr ? "En ligne" : "Online"}</option>
              <option value="in_person">{fr ? "En présentiel" : "In person"}</option>
              <option value="hybrid">{fr ? "Mixte" : "Hybrid"}</option>
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="c-city">{fr ? "Ville" : "City"}</label>
            <input id="c-city" className="pp-input" value={meta.city} onChange={(e) => setMeta({ ...meta, city: e.target.value })} />
          </div>
        </div>
        <div>
          <p className="pp-label">{fr ? "Compétences enseignées" : "Skills taught"}</p>
          <SkillPicker id="c-skills" value={meta.skills} onChange={(skills) => setMeta({ ...meta, skills })} language={language} max={8} />
        </div>
      </section>

      <section className="pp-card p-5 sm:p-6 flex flex-col gap-4" aria-labelledby="pricing-h">
        <h2 id="pricing-h" className="font-display text-lg font-semibold">{fr ? "Prix" : "Pricing"}</h2>
        <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
          {(["per_chapter", "full_course"] as const).map((m) => (
            <label key={m} className={`min-h-[52px] px-4 py-3 rounded-xl border flex items-center gap-3 cursor-pointer ${meta.mode === m ? "border-path bg-path-soft" : "border-ink-600"}`}>
              <input type="radio" checked={meta.mode === m} onChange={() => setMeta({ ...meta, mode: m })} className="w-[18px] h-[18px] accent-path" />
              {m === "per_chapter" ? (fr ? "Prix par chapitre" : "Price per chapter") : (fr ? "Prix du cours complet" : "Price for the whole course")}
            </label>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          {meta.mode === "per_chapter" ? (
            <div>
              <label className="pp-label" htmlFor="c-chprice">{fr ? "Prix d'un chapitre (USD)" : "Price per chapter (USD)"}</label>
              <input id="c-chprice" type="number" min={MIN_PRICE} step="0.5" className="pp-input" value={meta.chapterPrice} onChange={(e) => setMeta({ ...meta, chapterPrice: Number(e.target.value) })} />
            </div>
          ) : (
            <div>
              <label className="pp-label" htmlFor="c-price">{fr ? "Prix du cours (USD)" : "Course price (USD)"}</label>
              <input id="c-price" type="number" min={MIN_PRICE} step="0.5" className="pp-input" value={meta.coursePrice} onChange={(e) => setMeta({ ...meta, coursePrice: Number(e.target.value) })} />
            </div>
          )}
          <div>
            <label className="pp-label" htmlFor="c-free">{fr ? "Chapitres gratuits" : "Free chapters"}</label>
            <input id="c-free" type="number" min={MIN_FREE_CHAPTERS} max={Math.max(MIN_FREE_CHAPTERS, chapters.length - 1)} className="pp-input" value={meta.freeChapters} onChange={(e) => setMeta({ ...meta, freeChapters: Number(e.target.value) })} />
          </div>
        </div>
        <p className="text-sm text-mist">
          {fr ? "Minimum 1 $. " : "Minimum $1. "}
          {meta.mode === "per_chapter"
            ? (fr ? `Cours complet pour l'élève : ${formatUsd(paidCount * Number(meta.chapterPrice || 0), language)} (${paidCount} chapitres payants). ` : `Whole course for a learner: ${formatUsd(paidCount * Number(meta.chapterPrice || 0), language)} (${paidCount} paid chapters). `)
            : ""}
          {fr ? `Vous recevez ${TUTOR_SHARE * 100} % de chaque vente.` : `You receive ${TUTOR_SHARE * 100}% of each sale.`}
        </p>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="chapters-h">
        <h2 id="chapters-h" className="font-display text-lg font-semibold">{fr ? "Chapitres" : "Chapters"}</h2>
        {chapters.map((c, i) => (
          <div key={i} className="pp-card p-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm">
                {fr ? "Chapitre" : "Chapter"} {i + 1} · <span className={i < Number(meta.freeChapters) ? "text-path-text" : "text-gold-text"}>{i < Number(meta.freeChapters) ? (fr ? "gratuit" : "free") : (fr ? "payant" : "paid")}</span>
              </span>
              <div className="flex gap-1">
                <IconBtn label={fr ? "Monter" : "Move up"} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></IconBtn>
                <IconBtn label={fr ? "Descendre" : "Move down"} disabled={i === chapters.length - 1} onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></IconBtn>
                <IconBtn label={fr ? "Aperçu" : "Preview"} onClick={() => setPreview(i)}><Eye className="w-4 h-4" /></IconBtn>
                <IconBtn label={fr ? "Supprimer" : "Delete"} disabled={chapters.length <= 1} onClick={() => setChapters(chapters.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
              </div>
            </div>
            <div>
              <label className="pp-label" htmlFor={`ch-t-${i}`}>{fr ? "Titre" : "Title"}</label>
              <input id={`ch-t-${i}`} className="pp-input" value={c.title} onChange={(e) => updateChapter(i, { title: e.target.value })} />
            </div>
            <div>
              <label className="pp-label" htmlFor={`ch-s-${i}`}>{fr ? "Résumé (une phrase)" : "Summary (one sentence)"}</label>
              <input id={`ch-s-${i}`} className="pp-input" value={c.summary} onChange={(e) => updateChapter(i, { summary: e.target.value })} />
            </div>
            <div>
              <label className="pp-label" htmlFor={`ch-b-${i}`}>{fr ? "Contenu (Markdown : # titre, - liste, **gras**)" : "Content (Markdown: # heading, - list, **bold**)"}</label>
              <textarea id={`ch-b-${i}`} rows={10} className="pp-input font-mono text-sm" value={c.body} onChange={(e) => updateChapter(i, { body: e.target.value })} />
            </div>
            <div>
              <label className="pp-label" htmlFor={`ch-v-${i}`}>{fr ? "Lien vidéo (YouTube, facultatif)" : "Video link (YouTube, optional)"}</label>
              <input id={`ch-v-${i}`} type="url" className="pp-input" value={c.videoUrl} onChange={(e) => updateChapter(i, { videoUrl: e.target.value })} />
            </div>
          </div>
        ))}
        <button type="button" className="pp-btn pp-btn-secondary self-start" onClick={() => setChapters([...chapters, { title: "", summary: "", body: "", videoUrl: "" }])}>
          <Plus className="w-4 h-4" aria-hidden="true" /> {fr ? "Ajouter un chapitre" : "Add a chapter"}
        </button>
      </section>

      {message && <p className={`text-sm ${message.ok ? "text-path-text" : "text-danger-text"}`} role="status">{message.text}</p>}
      <div className="flex flex-wrap gap-3 sticky bottom-0 py-4 bg-ink-900 border-t border-ink-800">
        <button type="button" className="pp-btn pp-btn-secondary" disabled={busy} onClick={() => run(false)}>{busy && <Spinner />}{fr ? "Enregistrer le brouillon" : "Save draft"}</button>
        <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => run(true)}><Send className="w-4 h-4" aria-hidden="true" />{fr ? "Envoyer pour publication" : "Submit for publishing"}</button>
        {id && <button type="button" className="pp-btn text-dim hover:text-danger-text ml-auto" onClick={remove}><Trash2 className="w-4 h-4" aria-hidden="true" />{fr ? "Supprimer" : "Delete"}</button>}
      </div>

      <Modal open={preview !== null} onClose={() => setPreview(null)} title={preview !== null ? chapters[preview]?.title || "" : ""} wide>
        {preview !== null && <Markdown>{chapters[preview]?.body || ""}</Markdown>}
      </Modal>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="w-10 h-10 rounded-lg flex items-center justify-center text-mist hover:bg-ink-800 hover:text-chalk disabled:opacity-30">
      {children}
    </button>
  );
}
