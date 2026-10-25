import React, { lazy, Suspense, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { useSystemTheme } from "../lib/theme";
import { ArrowLeft, ArrowRight, BookOpen, Briefcase, Check, CheckCircle2, ExternalLink, Plus, Target, Trash2 } from "lucide-react";
import { Lang, tr } from "../career/assessment";
import type { LearningPlan, PlanSkill } from "../career/learningPlan";
import { getSkill, skillCourseId } from "../career/skills";
import { useAccount } from "../lib/account";
import { useAccountGate } from "./AccountForm";
import { ProgressBar, Spinner } from "./ui";
import { TutorCourseView } from "./TutorCourseView";
import { formatUsd } from "../marketplace/api";
import type { TutorCourse } from "../marketplace/types";

const AICourseWorkspace = lazy(() => import("./AICourseWorkspace").then((m) => ({ default: m.AICourseWorkspace })));

interface Props {
  language: Lang;
  country: string;
  /** Opens Project Manager with this goal as the project idea. */
  onBuildProject: (idea: string) => void;
}

const HOURS = [2, 5, 10, 20];

export function GoalsPage({ language, country, onBuildProject }: Props) {
  const fr = language === "french";
  const { progress } = useAccount();
  const plans = progress.learningPlans;
  const [view, setView] = useState<{ kind: "list" } | { kind: "new" } | { kind: "plan"; id: string }>(
    plans.length === 0 ? { kind: "new" } : { kind: "list" }
  );
  const plan = view.kind === "plan" ? plans.find((p) => p.id === view.id) : undefined;

  return (
    <div className="flex flex-col gap-6">
      {view.kind !== "list" && plans.length > 0 && (
        <button type="button" onClick={() => setView({ kind: "list" })} className="self-start inline-flex items-center gap-2 text-sm text-mist hover:text-chalk min-h-[44px]">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {fr ? "Tous mes objectifs" : "All my goals"}
        </button>
      )}
      {view.kind === "new" ? (
        <GoalForm language={language} country={country} onCreated={(id) => setView({ kind: "plan", id })} />
      ) : plan ? (
        <PlanView plan={plan} language={language} onBuildProject={onBuildProject} onDeleted={() => setView({ kind: "list" })} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <p className="pp-eyebrow">{fr ? "Plans d'apprentissage" : "Learning plans"}</p>
              <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Mes objectifs" : "My goals"}</h1>
            </div>
            <button type="button" className="pp-btn pp-btn-primary" onClick={() => setView({ kind: "new" })}>
              <Plus className="w-4 h-4" aria-hidden="true" /> {fr ? "Nouvel objectif" : "New goal"}
            </button>
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {plans.map((p) => {
              const prog = planProgress(p, progress.courses, language);
              return (
                <button key={p.id} type="button" onClick={() => setView({ kind: "plan", id: p.id })} className="pp-card p-5 flex flex-col gap-3 text-left hover:!border-ink-600">
                  <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                  <ProgressBar percent={prog.percent} label={fr ? "Avancement" : "Progress"} />
                  <p className="text-sm text-mist">
                    <span className="font-mono text-chalk">{prog.done}/{prog.total}</span> {fr ? "compétences acquises" : "skills learned"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function skillProgress(skillId: string, courses: ReturnType<typeof useAccount>["progress"]["courses"], lang: Lang) {
  const skill = getSkill(skillId);
  if (!skill) return null;
  const c = courses[skillCourseId(skill, lang)];
  return c ? { started: true, done: Boolean(c.completedAt), percent: (c.passed.length / Math.max(1, c.totalChapters)) * 100 } : { started: false, done: false, percent: 0 };
}

function planProgress(plan: LearningPlan, courses: ReturnType<typeof useAccount>["progress"]["courses"], lang: Lang) {
  const total = plan.skills.length;
  const done = plan.skills.filter((k) => skillProgress(k.skillId, courses, lang)?.done).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

function GoalForm({ language, country, onCreated }: { language: Lang; country: string; onCreated: (id: string) => void }) {
  const fr = language === "french";
  const { authedFetch, updateProgress, progress } = useAccount();
  const { guard, modal } = useAccountGate(language);
  const [goal, setGoal] = useState("");
  const [hours, setHours] = useState(5);
  const [experience, setExperience] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await authedFetch("/api/learning-plan", {
        method: "POST",
        body: JSON.stringify({
          goal: goal.trim(),
          hoursPerWeek: hours,
          experience: experience.trim(),
          language,
          country: country || "DR Congo",
          selfRated: progress.report?.profile.skills,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { plan } = await res.json();
      const full: LearningPlan = {
        ...plan,
        id: `plan_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        language,
        country: country || "DR Congo",
        goal: goal.trim(),
      };
      updateProgress((p) => ({ ...p, learningPlans: [full, ...p.learningPlans] }));
      onCreated(full.id);
    } catch {
      setError(fr ? "Le plan n'a pas pu être créé. Réessayez dans un instant." : "The plan couldn't be created. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="max-w-2xl flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        guard(create);
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="pp-eyebrow flex items-center gap-2"><Target className="w-3.5 h-3.5" aria-hidden="true" />{fr ? "Gratuit" : "Free"}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Quel est votre objectif ?" : "What's your goal?"}</h1>
        <p className="text-mist">
          {fr
            ? "Un métier, un projet, une entreprise à lancer : décrivez-le. ProPath vous dit quelles compétences apprendre, dans quel ordre, avec un cours pour chacune."
            : "A job, a project, a business to start: describe it. ProPath tells you which skills to learn, in what order, with a course for each."}
        </p>
      </div>
      <div>
        <label className="pp-label" htmlFor="goal-text">{fr ? "Votre objectif" : "Your goal"}</label>
        <textarea
          id="goal-text"
          rows={5}
          required
          minLength={10}
          className="pp-input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={fr ? "Ex. : ouvrir une petite ferme avicole à Kinshasa et vendre des œufs aux boutiques du quartier" : "E.g. start a small poultry farm in Kinshasa and sell eggs to shops in my area"}
        />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="pp-label">{fr ? "Temps disponible par semaine" : "Time you have each week"}</legend>
        <div className="flex flex-wrap gap-2">
          {HOURS.map((h) => (
            <label key={h} className={`min-h-[44px] px-4 rounded-full border flex items-center text-sm font-semibold cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${hours === h ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-mist hover:bg-ink-800"}`}>
              <input type="radio" name="hours" className="sr-only" checked={hours === h} onChange={() => setHours(h)} />
              {h} h
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="pp-label" htmlFor="goal-exp">{fr ? "Ce que vous savez déjà faire (facultatif)" : "What you can already do (optional)"}</label>
        <textarea id="goal-exp" rows={3} className="pp-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
      </div>
      {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
      <button type="submit" className="pp-btn pp-btn-primary" disabled={busy || goal.trim().length < 10}>
        {busy ? <Spinner /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
        {busy ? (fr ? "Création de votre plan (environ 30 secondes)…" : "Building your plan (about 30 seconds)…") : (fr ? "Créer mon plan d'apprentissage" : "Build my learning plan")}
      </button>
      {modal}
    </form>
  );
}

const PRIORITY_LABEL: Record<PlanSkill["priority"], { en: string; fr: string; tone: string }> = {
  essential: { en: "Essential", fr: "Essentiel", tone: "bg-path-soft text-path-text" },
  important: { en: "Important", fr: "Important", tone: "bg-ascent-soft text-ascent-text" },
  useful: { en: "Useful", fr: "Utile", tone: "bg-ink-800 text-mist" },
};

function PlanView({ plan, language, onBuildProject, onDeleted }: { plan: LearningPlan; language: Lang; onBuildProject: (idea: string) => void; onDeleted: () => void }) {
  const theme = useSystemTheme();
  const fr = language === "french";
  const { progress, updateProgress, authedFetch, hasPlan } = useAccount();
  const { guard, modal } = useAccountGate(language);
  const [openCourse, setOpenCourse] = useState<{ courseId: string; data?: any } | null>(null);
  const [tutorCourse, setTutorCourse] = useState<string | null>(null);
  const [market, setMarket] = useState<TutorCourse[]>([]);
  useEffect(() => {
    fetch(apiUrl(`/api/market/courses?language=${language}`)).then((r) => r.json()).then((d) => setMarket(d.courses || [])).catch(() => setMarket([]));
  }, [language]);
  const [preparing, setPreparing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prog = planProgress(plan, progress.courses, language);

  const startSkill = (skillId: string) =>
    guard(async () => {
      const skill = getSkill(skillId);
      if (!skill) return;
      const courseId = skillCourseId(skill, language);
      // Already started: open the saved copy straight away.
      if (skill.courseId || progress.courses[courseId]) {
        setOpenCourse({ courseId });
        return;
      }
      setPreparing(skillId);
      setError(null);
      try {
        const res = await authedFetch("/api/skill-course", { method: "POST", body: JSON.stringify({ skillId, language }) });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        setOpenCourse({ courseId: data.courseId, data: data.course });
      } catch {
        setError(fr ? "Le cours n'a pas pu être préparé. Réessayez dans un instant." : "The course couldn't be prepared. Please try again in a moment.");
      } finally {
        setPreparing(null);
      }
    });

  const toggleStep = (i: number) =>
    updateProgress((p) => ({ ...p, planChecks: { ...p.planChecks, [`${plan.id}:${i}`]: !p.planChecks[`${plan.id}:${i}`] } }));

  const remove = () => {
    if (!window.confirm(fr ? "Supprimer ce plan ?" : "Delete this plan?")) return;
    updateProgress((p) => ({ ...p, learningPlans: p.learningPlans.filter((x) => x.id !== plan.id) }));
    onDeleted();
  };

  if (tutorCourse) return <TutorCourseView courseId={tutorCourse} language={language} onBack={() => setTutorCourse(null)} />;

  if (openCourse) {
    return (
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>}>
        <AICourseWorkspace courseId={openCourse.courseId} initialCourseData={openCourse.data} onClose={() => setOpenCourse(null)} language={language} theme={theme} />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="pp-eyebrow">
          {fr ? `Environ ${plan.estimatedWeeks} semaines` : `About ${plan.estimatedWeeks} weeks`} · {plan.skills.length} {fr ? "compétences" : "skills"}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{plan.title}</h1>
        <p className="text-mist text-[17px] leading-relaxed max-w-3xl">{plan.summary}</p>
        <div className="flex items-center gap-3 max-w-md">
          <div className="flex-1"><ProgressBar percent={prog.percent} label={fr ? "Avancement du plan" : "Plan progress"} /></div>
          <span className="font-mono text-sm">{prog.done}/{prog.total}</span>
        </div>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="skills-h">
        <h2 id="skills-h" className="font-display text-xl font-semibold">{fr ? "Les compétences à apprendre, dans l'ordre" : "Skills to learn, in order"}</h2>
        {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
        <ol className="flex flex-col gap-3">
          {plan.skills.map((k, i) => {
            const skill = getSkill(k.skillId);
            if (!skill) return null;
            const sp = skillProgress(k.skillId, progress.courses, language)!;
            const pr = PRIORITY_LABEL[k.priority];
            return (
              <li key={k.skillId} className="pp-card p-4 sm:p-5 flex flex-wrap gap-4 items-start">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-semibold shrink-0 ${sp.done ? "bg-path text-on-path" : "border-2 border-ink-600 text-mist"}`}>
                  {sp.done ? <Check className="w-4 h-4" aria-label={fr ? "Acquise" : "Learned"} /> : i + 1}
                </span>
                <div className="flex-[999_1_260px] min-w-0 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-semibold text-chalk">{tr(skill.label, language)}</h3>
                    <span className={`pp-chip ${pr.tone}`}>{fr ? pr.fr : pr.en}</span>
                  </div>
                  <p className="text-[15px] text-body">{k.why}</p>
                  {sp.started && !sp.done && <div className="max-w-xs mt-1"><ProgressBar percent={sp.percent} label={fr ? "Progression du cours" : "Course progress"} /></div>}
                  {market.filter((c) => c.skills.includes(k.skillId)).slice(0, 3).map((c) => (
                    <button key={c.id} type="button" onClick={() => setTutorCourse(c.id)} className="self-start text-left text-sm text-ascent-text hover:underline min-h-[32px]">
                      {fr ? "Aussi enseigné par " : "Also taught by "}{c.tutorName} : {c.title}
                      <span className="text-dim"> · {c.pricing.mode === "per_chapter" ? `${formatUsd(c.pricing.chapterPrice, language)}/${fr ? "chap." : "ch."}` : formatUsd(c.pricing.coursePrice, language)}{c.format !== "online" && c.city ? ` · ${c.city}` : ""}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={`pp-btn ${sp.done ? "pp-btn-secondary" : "pp-btn-primary"} flex-[1_1_160px]`}
                  onClick={() => startSkill(k.skillId)}
                  disabled={preparing !== null}
                >
                  {preparing === k.skillId ? <Spinner /> : sp.done ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <BookOpen className="w-4 h-4" aria-hidden="true" />}
                  {preparing === k.skillId
                    ? (fr ? "Préparation…" : "Preparing…")
                    : sp.done ? (fr ? "Revoir" : "Review") : sp.started ? (fr ? "Continuer" : "Continue") : (fr ? "Commencer le cours" : "Start course")}
                </button>
              </li>
            );
          })}
        </ol>
        {preparing && (
          <p className="text-sm text-mist" role="status">
            {fr
              ? "Première ouverture de ce cours : ProPath AI le rédige (environ une minute). Ensuite, il s'ouvre instantanément pour tout le monde."
              : "First time this course is opened: ProPath AI is writing it (about a minute). After that, it opens instantly for everyone."}
          </p>
        )}
      </section>

      {plan.firstSteps.length > 0 && (
        <section className="pp-card p-5 sm:p-6 flex flex-col gap-3" aria-labelledby="steps-h">
          <h2 id="steps-h" className="font-display text-lg font-semibold">{fr ? "Vos premières actions" : "Your first actions"}</h2>
          {plan.firstSteps.map((step, i) => {
            const done = Boolean(progress.planChecks[`${plan.id}:${i}`]);
            return (
              <label key={i} className="flex gap-3 items-start p-3 rounded-xl border border-ink-700 cursor-pointer hover:bg-ink-800">
                <input type="checkbox" checked={done} onChange={() => toggleStep(i)} className="w-5 h-5 mt-0.5 accent-path shrink-0" />
                <span className={`text-[15px] leading-snug ${done ? "text-dim line-through" : "text-body"}`}>{step}</span>
              </label>
            );
          })}
        </section>
      )}

      {plan.otherSkills.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg font-semibold">{fr ? "Également utile" : "Also useful"}</h2>
          <ul className="flex flex-wrap gap-2">
            {plan.otherSkills.map((o) => (
              <li key={o}>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(o)}`} target="_blank" rel="noopener noreferrer" className="min-h-[40px] px-3 rounded-full border border-ink-700 text-sm text-mist hover:text-chalk inline-flex items-center gap-1.5">
                  {o} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.kind !== "job" && (
        <section className="pp-card p-5 sm:p-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-start max-w-2xl">
            <Briefcase className="w-6 h-6 text-ascent shrink-0 mt-1" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-lg font-semibold">{fr ? "Construire ce projet étape par étape" : "Build this project step by step"}</h2>
              <p className="text-mist text-[15px]">
                {fr
                  ? "Avec ProPath Pro, le Gestionnaire de projet transforme cet objectif en tâches, rédige vos documents et vous guide jusqu'au lancement."
                  : "With ProPath Pro, Project Manager turns this goal into tasks, drafts your documents and guides you to launch."}
              </p>
            </div>
          </div>
          <button type="button" className="pp-btn pp-btn-ai" onClick={() => onBuildProject(plan.goal)}>
            {hasPlan("pro") ? (fr ? "Créer le projet" : "Create the project") : (fr ? "Découvrir Pro" : "See Pro")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </section>
      )}

      <button type="button" className="self-start inline-flex items-center gap-2 text-sm text-dim hover:text-danger-text min-h-[44px]" onClick={remove}>
        <Trash2 className="w-4 h-4" aria-hidden="true" /> {fr ? "Supprimer ce plan" : "Delete this plan"}
      </button>
      {modal}
    </div>
  );
}
