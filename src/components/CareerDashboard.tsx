import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSystemTheme } from "../lib/theme";
import {
  ArrowRight, BookOpen, Briefcase, Target, Check, CheckCircle2, ExternalLink, GraduationCap, Info, RotateCcw, Award, Send,
} from "lucide-react";
import { Lang, RIASEC_INFO, RIASEC_TYPES, SKILLS, tr } from "../career/assessment";
import { getOccupation } from "../career/engine";
import type { CareerReport, CareerTrack, MentorGoal } from "../types";
import { useAccount } from "../lib/account";
import { computeJourney } from "../lib/journey";
import { getPrograms, submitTeamApplication } from "../lib/firebase";
import { MentorshipGoals } from "./MentorshipGoals";
import { Meter, Modal, ProgressBar, Spinner } from "./ui";
import { useAccountGate } from "./AccountForm";

const AICourseWorkspace = lazy(() => import("./AICourseWorkspace").then((m) => ({ default: m.AICourseWorkspace })));

interface Props {
  report: CareerReport;
  language: Lang;
  country: string;
  onRetake: () => void;
  onOpenProjects: () => void;
  onOpenGoals: () => void;
}

const HORIZONS = ["short", "medium", "long"] as const;

function formatMoney(amount: number, currency?: string, lang: Lang = "english") {
  try {
    return new Intl.NumberFormat(lang === "french" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency || ""}`.trim();
  }
}

function courseIdFromLink(link: string) {
  return link.startsWith("propathskill://course/") ? link.slice("propathskill://course/".length) : null;
}

export function CareerDashboard({ report, language, country, onRetake, onOpenProjects, onOpenGoals }: Props) {
  const theme = useSystemTheme();
  const fr = language === "french";
  const { progress, updateProgress, projects, access } = useAccount();
  const tracks = report.recommendedTracks;
  const activeTrack = tracks.find((t) => t.id === progress.activeTrackId) || tracks[0];
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const { guard, modal: accountModal } = useAccountGate(language);

  const journey = computeJourney(progress, projects.length);
  const journeyDone = journey.filter((s) => s.done).length;

  const selectTrack = (track: CareerTrack) => {
    updateProgress((p) => ({
      ...p,
      activeTrackId: track.id,
      events: { ...p.events, trackExploredAt: p.events.trackExploredAt || new Date().toISOString() },
    }));
    document.getElementById("track-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const checkKey = (h: string, i: number) => `${activeTrack.id}:${h}:${i}`;
  const toggleCheck = (key: string) =>
    updateProgress((p) => ({ ...p, roadmapChecks: { ...p.roadmapChecks, [key]: !p.roadmapChecks[key] } }));

  const horizonItems = (h: (typeof HORIZONS)[number]) =>
    h === "short" ? activeTrack.shortTermTimeline : h === "medium" ? activeTrack.mediumTermTimeline : activeTrack.longTermTimeline;

  const roadmapTotal = HORIZONS.reduce((s, h) => s + horizonItems(h).length, 0);
  const roadmapDone = HORIZONS.reduce(
    (s, h) => s + horizonItems(h).filter((_, i) => progress.roadmapChecks[checkKey(h, i)]).length, 0
  );

  const nextStep = useMemo(() => {
    for (const h of HORIZONS) {
      const items = horizonItems(h);
      const idx = items.findIndex((_, i) => !progress.roadmapChecks[checkKey(h, i)]);
      if (idx >= 0) return { text: items[idx], key: checkKey(h, idx) };
    }
    return null;
  }, [activeTrack, progress.roadmapChecks]);

  const proPathCourse = activeTrack.educationalResources.find((r) => r.link.startsWith("propathskill://"));
  const proPathCourseId = proPathCourse ? courseIdFromLink(proPathCourse.link) : null;
  const courseState = proPathCourseId ? progress.courses[proPathCourseId] : undefined;

  const updateGoals = (goals: MentorGoal[]) =>
    updateProgress((p) => (p.report ? { ...p, report: { ...p.report, mentorGoals: goals } } : p));

  const rankedTypes = [...RIASEC_TYPES].sort((a, b) => report.profile.riasec[b] - report.profile.riasec[a]);

  if (openCourse) {
    return (
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>}>
        <AICourseWorkspace courseId={openCourse} onClose={() => setOpenCourse(null)} language={language} theme={theme} />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome + next step */}
      <div className="flex flex-wrap gap-6 items-stretch">
        <div className="flex-[999_1_480px] flex flex-col justify-center gap-3">
          <p className="pp-eyebrow">{fr ? "Votre profil ProPath" : "Your ProPath profile"} · {report.profile.code}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {fr ? `Votre meilleure piste : ${tracks[0].title}` : `Your strongest match: ${tracks[0].title}`}
          </h1>
          {report.summary && <p className="text-[17px] text-mist leading-relaxed max-w-2xl">{report.summary}</p>}
        </div>
        <div className="flex-[1_1_320px] pp-card p-6 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wider text-path-text uppercase">{fr ? "Votre prochaine étape" : "Your next step"}</p>
          {courseState && !courseState.completedAt && proPathCourseId ? (
            <>
              <p className="font-display text-lg font-semibold leading-snug">
                {fr ? "Continuer votre cours" : "Continue your course"}: {courseState.title || proPathCourse?.name}
              </p>
              <ProgressBar percent={(courseState.passed.length / Math.max(1, courseState.totalChapters)) * 100} label={fr ? "Progression du cours" : "Course progress"} />
              <button type="button" className="pp-btn pp-btn-primary self-start" onClick={() => guard(() => setOpenCourse(proPathCourseId))}>
                {fr ? "Reprendre" : "Resume"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          ) : nextStep ? (
            <>
              <p className="font-display text-lg font-semibold leading-snug">{nextStep.text}</p>
              <button type="button" className="pp-btn pp-btn-secondary self-start" onClick={() => toggleCheck(nextStep.key)}>
                <Check className="w-4 h-4" aria-hidden="true" /> {fr ? "C'est fait" : "Mark as done"}
              </button>
            </>
          ) : (
            <p className="font-display text-lg font-semibold">{fr ? "Feuille de route terminée. Bravo !" : "Roadmap complete. Well done!"}</p>
          )}
        </div>
      </div>

      {/* Journey */}
      <section className="pp-card p-5 sm:p-6 flex flex-col gap-4" aria-labelledby="journey-h">
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <h2 id="journey-h" className="font-display text-xl font-semibold">{fr ? "Votre parcours" : "Your journey"}</h2>
          <span className="text-sm text-mist">
            <span className="font-mono text-chalk">{journeyDone}/{journey.length}</span> · {fr ? "suivi automatiquement" : "tracked automatically"}
          </span>
        </div>
        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {journey.map((step, i) => (
            <li key={step.id} className={`rounded-xl border p-3 flex flex-col gap-2 ${step.done ? "border-path bg-path-soft" : "border-ink-700"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${step.done ? "bg-path text-on-path" : "border-2 border-ink-600 text-mist"}`}>
                {step.done ? <Check className="w-4 h-4" aria-label={fr ? "Fait" : "Done"} /> : i + 1}
              </span>
              <span className={`text-sm leading-snug ${step.done ? "text-chalk" : "text-mist"}`}>{tr(step.label, language)}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Strengths */}
      <section className="flex flex-wrap gap-4" aria-labelledby="strengths-h">
        <div className="flex-[999_1_420px] pp-card p-5 sm:p-6 flex flex-col gap-4">
          <h2 id="strengths-h" className="font-display text-xl font-semibold">{fr ? "Ce qui vous motive" : "What drives you"}</h2>
          {report.profile.undifferentiated && (
            <p className="text-sm text-gold-text bg-gold-soft rounded-xl p-3 flex gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              {fr
                ? "Vos intérêts sont assez équilibrés, donc vos résultats sont moins tranchés. Essayez quelques activités puis refaites l'évaluation."
                : "Your interests are quite even, so these results are less clear-cut. Try a few activities, then retake the assessment."}
            </p>
          )}
          <div className="flex flex-col gap-4">
            {rankedTypes.map((t) => (
              <Meter key={t} label={tr(RIASEC_INFO[t].name, language)} value={report.profile.riasec[t]} />
            ))}
          </div>
        </div>
        <div className="flex-[1_1_300px] pp-card p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">{fr ? "Vos points forts" : "What you're good at"}</h2>
          {report.profile.topSkills.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {report.profile.topSkills.map((k) => (
                <li key={k} className="flex items-center gap-3 text-body">
                  <CheckCircle2 className="w-5 h-5 text-path shrink-0" aria-hidden="true" />
                  {tr(SKILLS.find((s) => s.key === k)!.label, language)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-mist text-sm">{fr ? "Aucune compétence notée « bien » pour l'instant. Les cours ProPath sont faits pour ça." : "No skills rated \"good\" yet. That's what ProPath courses are for."}</p>
          )}
          <div className="border-t border-ink-700 pt-4">
            <p className="text-sm text-mist">{tr(RIASEC_INFO[rankedTypes[0]].strength, language)}</p>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="flex flex-col gap-4" aria-labelledby="matches-h">
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <h2 id="matches-h" className="font-display text-xl font-semibold">{fr ? "Vos pistes de carrière" : "Your career matches"}</h2>
          <button type="button" onClick={onRetake} className="text-sm text-mist hover:text-chalk inline-flex items-center gap-1.5 min-h-[44px]">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> {fr ? "Refaire l'évaluation" : "Retake assessment"}
          </button>
        </div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {tracks.map((track, i) => {
            const active = track.id === activeTrack.id;
            return (
              <article key={track.id} className={`pp-card p-5 flex flex-col gap-3 ${active ? "!border-path" : ""}`}>
                <div className="flex justify-between items-center gap-2">
                  <span className={`pp-chip ${i === 0 ? "bg-path-soft text-path-text" : "bg-ink-800 text-mist"}`}>
                    {i === 0 ? (fr ? "Meilleure piste" : "Best match") : (fr ? "Bonne piste" : "Good match")}
                  </span>
                  <span className={`font-mono text-2xl ${i === 0 ? "text-path-text" : "text-chalk"}`}>{track.matchPercent ?? Math.round(track.matchScore * 10)}%</span>
                </div>
                <h3 className="font-display text-lg font-semibold">{track.title}</h3>
                <ul className="flex flex-col gap-1.5 text-sm text-mist">
                  {(track.matchReasons || []).slice(0, 3).map((r) => (
                    <li key={r} className="flex gap-2"><Check className="w-4 h-4 text-path shrink-0 mt-0.5" aria-hidden="true" />{r}</li>
                  ))}
                  {(track.matchNotes || []).map((n) => (
                    <li key={n} className="flex gap-2 text-gold-text"><Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />{n}</li>
                  ))}
                </ul>
                <button type="button" className={`pp-btn mt-auto ${active ? "pp-btn-primary" : "pp-btn-secondary"}`} onClick={() => selectTrack(track)} aria-pressed={active}>
                  {active ? (fr ? "Piste sélectionnée" : "Selected") : (fr ? "Voir cette piste" : "Explore this path")}
                </button>
              </article>
            );
          })}
        </div>
        <p className="text-xs text-dim">
          {fr
            ? "Le pourcentage combine vos intérêts (60 %), vos compétences (30 %) et le cadre de travail (10 %), ajusté selon la formation nécessaire."
            : "The percentage combines your interests (60%), skills (30%) and preferred setting (10%), adjusted for the training each path needs."}
        </p>
      </section>

      {/* Track detail */}
      <section id="track-detail" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="detail-h">
        <div className="pp-card p-5 sm:p-7 flex flex-col gap-3">
          <p className="pp-eyebrow">{activeTrack.demandLevel}</p>
          <h2 id="detail-h" className="font-display text-2xl font-semibold">{activeTrack.title}</h2>
          <p className="text-body leading-relaxed max-w-3xl">{activeTrack.description}</p>
          {(() => {
            const occ = activeTrack.occupationId ? getOccupation(activeTrack.occupationId) : undefined;
            return occ ? <p className="text-sm text-mist"><span className="text-chalk font-medium">{fr ? "Comment commencer : " : "How people start: "}</span>{tr(occ.entry, language)}</p> : null;
          })()}
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Roadmap */}
          <div className="flex-[999_1_520px] min-w-0 pp-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-wrap justify-between items-baseline gap-2">
              <h3 className="font-display text-lg font-semibold">{fr ? "Feuille de route" : "Roadmap"}</h3>
              <span className="font-mono text-sm">{roadmapDone}/{roadmapTotal}</span>
            </div>
            <ProgressBar percent={(roadmapDone / Math.max(1, roadmapTotal)) * 100} label={fr ? "Progression de la feuille de route" : "Roadmap progress"} />
            {HORIZONS.map((h) => (
              <div key={h} className="flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-wider uppercase text-dim">
                  {h === "short" ? (fr ? "0 à 6 mois" : "Months 0–6") : h === "medium" ? (fr ? "6 à 18 mois" : "Months 6–18") : (fr ? "Après 18 mois" : "18 months and beyond")}
                </p>
                {horizonItems(h).map((item, i) => {
                  const key = checkKey(h, i);
                  const done = Boolean(progress.roadmapChecks[key]);
                  return (
                    <label key={key} className={`flex gap-3 items-start p-3 rounded-xl border cursor-pointer ${done ? "border-ink-700 bg-ink-900" : "border-ink-700 hover:bg-ink-800"}`}>
                      <input type="checkbox" checked={done} onChange={() => toggleCheck(key)} className="w-5 h-5 mt-0.5 accent-path shrink-0" />
                      <span className={`text-[15px] leading-snug ${done ? "text-dim line-through" : "text-body"}`}>{item}</span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Learn */}
          <div className="flex-[1_1_320px] flex flex-col gap-4">
            <div className="pp-card p-5 sm:p-6 flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-path" aria-hidden="true" /> {fr ? "Apprendre" : "Learn"}
              </h3>
              {proPathCourseId && (
                <div className="rounded-xl border border-path bg-path-soft p-4 flex flex-col gap-3">
                  <p className="font-medium text-chalk">{proPathCourse!.name}</p>
                  {courseState && (
                    <ProgressBar percent={(courseState.passed.length / Math.max(1, courseState.totalChapters)) * 100} tone={courseState.completedAt ? "gold" : "path"} label={fr ? "Progression du cours" : "Course progress"} />
                  )}
                  <button type="button" className="pp-btn pp-btn-primary" onClick={() => guard(() => setOpenCourse(proPathCourseId))}>
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    {courseState?.completedAt ? (fr ? "Revoir le cours" : "Review course") : courseState ? (fr ? "Continuer le cours" : "Continue course") : (fr ? "Commencer le cours" : "Start course")}
                  </button>
                </div>
              )}
              <ul className="flex flex-col gap-2">
                {activeTrack.educationalResources.filter((r) => !r.link.startsWith("propathskill://")).map((r) => (
                  <li key={r.link + r.name}>
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 items-start p-3 rounded-xl border border-ink-700 hover:bg-ink-800">
                      <ExternalLink className="w-4 h-4 text-ascent-text shrink-0 mt-1" aria-hidden="true" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] text-chalk">{r.name}</span>
                        <span className="text-xs text-dim">{r.platform} · {r.duration} · {fr ? "gratuit" : "free"}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {activeTrack.certificationRoadmap.length > 0 && (
              <div className="pp-card p-5 sm:p-6 flex flex-col gap-3">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" aria-hidden="true" /> {fr ? "Certifications utiles" : "Useful certifications"}
                </h3>
                <ul className="flex flex-col gap-3">
                  {activeTrack.certificationRoadmap.map((c) => (
                    <li key={c.name} className="flex flex-col gap-0.5">
                      <span className="text-[15px] text-chalk">{c.name}</span>
                      <span className="text-xs text-dim">{c.provider} · {c.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {activeTrack.salaryTimeline.length > 0 && (
            <div className="flex-[1_1_320px] pp-card p-5 sm:p-6 flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold">{fr ? "Revenus possibles" : "Possible earnings"}</h3>
              <ul className="flex flex-col gap-3">
                {activeTrack.salaryTimeline.map((m) => (
                  <li key={m.year} className="flex justify-between gap-4 border-b border-ink-700 pb-3 last:border-0">
                    <span className="flex flex-col">
                      <span className="text-sm text-dim">{fr ? `Année ${m.year}` : `Year ${m.year}`}</span>
                      <span className="text-body">{m.role}</span>
                    </span>
                    <span className="font-mono text-chalk text-right">
                      {formatMoney(m.salary, activeTrack.salaryCurrency, language)}
                      <span className="block text-xs text-dim">/ {activeTrack.salaryPeriod === "year" ? (fr ? "an" : "year") : (fr ? "mois" : "month")}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-dim flex gap-2">
                <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
                {fr
                  ? `Estimations indicatives pour ${country}. Les revenus réels varient selon la ville, l'expérience et l'employeur : vérifiez auprès de professionnels du métier.`
                  : `Rough estimates for ${country}. Real earnings vary by city, experience and employer, so check with people working in this field.`}
              </p>
            </div>
          )}
          <div className="flex-[1_1_320px] pp-card p-5 sm:p-6 flex flex-col gap-4">
            <h3 className="font-display text-lg font-semibold">{fr ? "Compétences à développer" : "Skills to build"}</h3>
            {activeTrack.skillsPredicted.map((s) => (
              <Meter
                key={s.name}
                label={s.name}
                value={s.current}
                sub={fr ? `Objectif pour ce métier : ${s.predicted}` : `Target for this work: ${s.predicted}`}
              />
            ))}
          </div>
        </div>
      </section>

      <PartnerPrograms track={activeTrack} language={language} country={country} />

      {/* Goal-based learning plan */}
      <section className="pp-card p-5 sm:p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-start max-w-2xl">
          <Target className="w-6 h-6 text-path shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-lg font-semibold">{fr ? "Vous avez un objectif précis ?" : "Have a specific goal in mind?"}</h2>
            <p className="text-mist text-[15px]">
              {fr
                ? "Décrivez-le : ProPath vous dit quelles compétences apprendre et vous donne un cours pour chacune. Gratuit."
                : "Describe it and ProPath tells you which skills to learn, with a course for each. Free."}
            </p>
          </div>
        </div>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={onOpenGoals}>
          {fr ? "Créer un plan d'apprentissage" : "Build a learning plan"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      {/* Project manager teaser */}
      <section className="pp-card p-5 sm:p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-start max-w-2xl">
          <Briefcase className="w-6 h-6 text-ascent shrink-0 mt-1" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-lg font-semibold">{fr ? "Vous voulez lancer votre propre projet ?" : "Want to start your own project?"}</h2>
            <p className="text-mist text-[15px]">
              {fr
                ? "Le Gestionnaire de projet ProPath transforme votre idée en plan étape par étape, rédige vos documents et vous guide jusqu'au lancement."
                : "ProPath Project Manager turns your idea into a step-by-step plan, drafts your documents and guides you to launch."}
            </p>
          </div>
        </div>
        <button type="button" className="pp-btn pp-btn-ai" onClick={onOpenProjects}>
          {fr ? "Ouvrir le Gestionnaire de projet" : "Open Project Manager"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      <MentorshipGoals goals={report.mentorGoals} onChange={updateGoals} selectedLanguage={language} />
      {accountModal}

      {access.plan === "free" ? (
        <p className="text-sm text-dim text-center">
          {fr
            ? "Votre progression est enregistrée sur cet appareil. Avec ProPath Basic, elle est sauvegardée et vous suit sur tous vos appareils."
            : "Your progress is saved on this device. With ProPath Basic, it's backed up and follows you on every device."}
        </p>
      ) : null}
    </div>
  );
}

function PartnerPrograms({ track, language, country }: { track: CareerTrack; language: Lang; country: string }) {
  const fr = language === "french";
  const { user, updateProgress } = useAccount();
  const [programs, setPrograms] = useState<any[] | null>(null);
  const [applying, setApplying] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    getPrograms().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email || "" }));
  }, [user?.email]);

  const matching = (programs || []).filter((p) => {
    const inCountry = !country || !p.country || p.country.toLowerCase() === country.toLowerCase();
    const id = String(p.trackId || "").toLowerCase();
    const fits = id === "general" || id === track.id.toLowerCase() || id === track.title.toLowerCase();
    return inCountry && fits;
  });

  if (programs === null || matching.length === 0) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus("sending");
    try {
      await submitTeamApplication({
        userName: form.name.trim(),
        userEmail: form.email.trim(),
        partnerId: applying.partnerId,
        partnerName: applying.partnerName,
        programId: applying.id,
        programTitle: applying.title,
        trackTitle: track.title,
        status: "Pending",
        notes: form.notes,
      });
      updateProgress((p) => ({ ...p, events: { ...p.events, applicationSubmittedAt: new Date().toISOString() } }));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby="programs-h">
      <h2 id="programs-h" className="font-display text-xl font-semibold">{fr ? "Programmes de nos partenaires" : "Partner programmes"}</h2>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {matching.slice(0, 6).map((p) => (
          <article key={p.id} className="pp-card p-5 flex flex-col gap-2">
            <p className="text-xs text-dim">{p.partnerName}</p>
            <h3 className="font-display font-semibold">{p.title}</h3>
            <p className="text-sm text-mist line-clamp-3">{p.description}</p>
            <p className="text-xs text-dim">{[p.duration, p.cost, p.level].filter(Boolean).join(" · ")}</p>
            <button type="button" className="pp-btn pp-btn-secondary mt-2" onClick={() => { setApplying(p); setStatus("idle"); }}>
              <Send className="w-4 h-4" aria-hidden="true" /> {fr ? "Postuler" : "Apply"}
            </button>
          </article>
        ))}
      </div>

      <Modal open={Boolean(applying)} onClose={() => setApplying(null)} title={applying ? `${fr ? "Postuler" : "Apply"}: ${applying.title}` : ""}>
        {status === "sent" ? (
          <div className="flex flex-col gap-4">
            <p className="text-body">{fr ? "Votre candidature a été envoyée. Le partenaire vous contactera par e-mail." : "Your application was sent. The partner will contact you by email."}</p>
            <button type="button" className="pp-btn pp-btn-primary" onClick={() => setApplying(null)}>{fr ? "Fermer" : "Close"}</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="pp-label" htmlFor="apply-name">{fr ? "Nom complet" : "Full name"}</label>
              <input id="apply-name" className="pp-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
            </div>
            <div>
              <label className="pp-label" htmlFor="apply-email">Email</label>
              <input id="apply-email" type="email" className="pp-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </div>
            <div>
              <label className="pp-label" htmlFor="apply-notes">{fr ? "Pourquoi ce programme ? (facultatif)" : "Why this programme? (optional)"}</label>
              <textarea id="apply-notes" rows={4} className="pp-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            {status === "error" && <p className="text-sm text-danger-text">{fr ? "L'envoi a échoué. Réessayez." : "Sending failed. Please try again."}</p>}
            <button type="submit" className="pp-btn pp-btn-primary" disabled={status === "sending"}>
              {status === "sending" ? <Spinner /> : <Send className="w-4 h-4" aria-hidden="true" />}
              {fr ? "Envoyer ma candidature" : "Send application"}
            </button>
          </form>
        )}
      </Modal>
    </section>
  );
}
