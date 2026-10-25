import React, { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { useSystemTheme } from "../lib/theme";
import { ArrowRight, BookOpen, Megaphone, Palette } from "lucide-react";
import type { Bilingual, Lang } from "../career/assessment";
import { tr } from "../career/assessment";
import { useAccount } from "../lib/account";
import { AICourseWorkspace } from "./AICourseWorkspace";
import { DigitalMarketingCourseHub } from "./DigitalMarketingCourseHub";
import { CreativeDesignCourseHub } from "./CreativeDesignCourseHub";
import { ProgressBar } from "./ui";
import { useAccountGate } from "./AccountForm";
import { TutorCourseView } from "./TutorCourseView";
import { formatUsd } from "../marketplace/api";
import type { TutorCourse } from "../marketplace/types";
import { getSkill } from "../career/skills";
import { MapPin } from "lucide-react";

const CATALOG: { id: string; title: Bilingual }[] = [
  { id: "smartgrid_native", title: { en: "Solar and clean energy", fr: "Solaire et énergie propre" } },
  { id: "electrical_native", title: { en: "Electrical installation and automation", fr: "Installations électriques et automatisme" } },
  { id: "automotive_native", title: { en: "Vehicle mechanics and diagnostics", fr: "Mécanique et diagnostic automobile" } },
  { id: "carpentry_native", title: { en: "Carpentry and sustainable building", fr: "Menuiserie et construction durable" } },
  { id: "digital_marketing_native", title: { en: "Digital marketing and social media", fr: "Marketing digital et réseaux sociaux" } },
  { id: "creativedesign_native", title: { en: "Digital and graphic design", fr: "Design numérique et graphique" } },
  { id: "art_native", title: { en: "Fine arts and creative direction", fr: "Beaux-arts et direction artistique" } },
  { id: "ai_systems_native", title: { en: "AI, data and software foundations", fr: "Bases de l'IA, des données et du logiciel" } },
  { id: "fintech_native", title: { en: "Finance, accounting and mobile money", fr: "Finance, comptabilité et mobile money" } },
];

export function CoursesPage({ language, initialTutorCourse }: { language: Lang; initialTutorCourse?: string | null }) {
  const theme = useSystemTheme();
  const fr = language === "french";
  const { progress } = useAccount();
  const [open, setOpen] = useState<string | null>(null);
  const [hub, setHub] = useState<"marketing" | "design" | null>(null);
  const { guard, modal } = useAccountGate(language);
  const [tutorCourse, setTutorCourse] = useState<string | null>(initialTutorCourse || null);
  const [market, setMarket] = useState<TutorCourse[] | null>(null);
  useEffect(() => {
    fetch(apiUrl(`/api/market/courses?language=${language}`)).then((r) => r.json()).then((d) => setMarket(d.courses || [])).catch(() => setMarket([]));
  }, [language]);
  const openCourse = (id: string) => guard(() => setOpen(id));
  const openHub = (h: "marketing" | "design") => guard(() => setHub(h));

  if (tutorCourse) return <TutorCourseView courseId={tutorCourse} language={language} onBack={() => setTutorCourse(null)} />;
  if (open) return <AICourseWorkspace courseId={open} onClose={() => setOpen(null)} language={language} theme={theme} />;
  if (hub === "marketing") return <DigitalMarketingCourseHub onBack={() => setHub(null)} language={language} theme={theme} />;
  if (hub === "design") return <CreativeDesignCourseHub onBack={() => setHub(null)} language={language} theme={theme} />;

  const mine = Object.entries(progress.courses).sort((a, b) => (b[1].startedAt || "").localeCompare(a[1].startedAt || ""));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="pp-eyebrow">ProPath Learning School</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Cours" : "Courses"}</h1>
        <p className="text-mist max-w-2xl">
          {fr
            ? "Des cours pratiques, avec un tuteur ProPath qui répond à vos questions. Votre progression est enregistrée automatiquement."
            : "Practical courses with a ProPath tutor that answers your questions. Your progress saves automatically."}
        </p>
      </div>

      {mine.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="my-courses-h">
          <h2 id="my-courses-h" className="font-display text-xl font-semibold">{fr ? "Mes cours" : "My courses"}</h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {mine.map(([id, c]) => {
              const pct = (c.passed.length / Math.max(1, c.totalChapters)) * 100;
              return (
                <article key={id} className="pp-card p-5 flex flex-col gap-3">
                  <h3 className="font-display font-semibold leading-snug">{c.title || id}</h3>
                  <ProgressBar percent={pct} tone={c.completedAt ? "gold" : "path"} label={fr ? "Progression" : "Progress"} />
                  <p className="text-sm text-mist">
                    <span className="font-mono text-chalk">{c.passed.length}/{c.totalChapters}</span> {fr ? "chapitres validés" : "chapters passed"}
                    {c.completedAt && <span className="text-gold-text"> · {fr ? "Terminé" : "Completed"}</span>}
                  </p>
                  <button type="button" className="pp-btn pp-btn-secondary mt-auto" onClick={() => openCourse(id)}>
                    {c.completedAt ? (fr ? "Revoir" : "Review") : (fr ? "Continuer" : "Continue")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4" aria-labelledby="catalog-h">
        <h2 id="catalog-h" className="font-display text-xl font-semibold">{fr ? "Tous les cours" : "All courses"}</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {CATALOG.filter((c) => !progress.courses[c.id]).map((c) => (
            <button key={c.id} type="button" onClick={() => openCourse(c.id)} className="pp-card p-5 flex items-center gap-4 text-left hover:!border-ink-600 min-h-[72px]">
              <BookOpen className="w-5 h-5 text-path shrink-0" aria-hidden="true" />
              <span className="flex-1 font-medium text-chalk">{tr(c.title, language)}</span>
              <ArrowRight className="w-4 h-4 text-mist" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {market && market.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="tutor-courses-h">
          <h2 id="tutor-courses-h" className="font-display text-xl font-semibold">{fr ? "Cours des formateurs et écoles" : "Courses from tutors and schools"}</h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {market.map((c) => <TutorCourseCard key={c.id} course={c} language={language} onOpen={() => setTutorCourse(c.id)} />)}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4" aria-labelledby="custom-h">
        <h2 id="custom-h" className="font-display text-xl font-semibold">{fr ? "Créer un cours sur mesure" : "Create a custom course"}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => openHub("marketing")} className="pp-card p-5 flex gap-4 text-left hover:!border-ink-600">
            <Megaphone className="w-6 h-6 text-ascent shrink-0" aria-hidden="true" />
            <span className="flex flex-col gap-1">
              <span className="font-display font-semibold">{fr ? "Marketing digital" : "Digital marketing"}</span>
              <span className="text-sm text-mist">{fr ? "Choisissez un sujet, ProPath AI crée le cours." : "Pick a topic and ProPath AI builds the course."}</span>
            </span>
          </button>
          <button type="button" onClick={() => openHub("design")} className="pp-card p-5 flex gap-4 text-left hover:!border-ink-600">
            <Palette className="w-6 h-6 text-ascent shrink-0" aria-hidden="true" />
            <span className="flex flex-col gap-1">
              <span className="font-display font-semibold">{fr ? "Design créatif" : "Creative design"}</span>
              <span className="text-sm text-mist">{fr ? "Choisissez un sujet, ProPath AI crée le cours." : "Pick a topic and ProPath AI builds the course."}</span>
            </span>
          </button>
        </div>
      </section>
      {modal}
    </div>
  );
}

export function TutorCourseCard({ course, language, onOpen }: { course: TutorCourse; language: Lang; onOpen: () => void }) {
  const fr = language === "french";
  return (
    <button type="button" onClick={onOpen} className="pp-card p-5 flex flex-col gap-2 text-left hover:!border-ink-600">
      <span className="text-xs text-dim">{course.tutorName}</span>
      <span className="font-display font-semibold text-chalk leading-snug">{course.title}</span>
      <span className="flex flex-wrap gap-1.5">
        {course.skills.slice(0, 3).map((k) => getSkill(k) && <span key={k} className="pp-chip bg-ink-800 text-mist">{tr(getSkill(k)!.label, language)}</span>)}
      </span>
      <span className="flex flex-wrap items-center gap-3 text-sm text-mist mt-auto pt-2">
        <span className="text-path-text font-medium">{fr ? `${course.freeChapters} chapitres gratuits` : `${course.freeChapters} free chapters`}</span>
        <span>
          {course.pricing.mode === "per_chapter"
            ? `${formatUsd(course.pricing.chapterPrice, language)} / ${fr ? "chapitre" : "chapter"}`
            : formatUsd(course.pricing.coursePrice, language)}
        </span>
        {course.format !== "online" && course.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{course.city}</span>}
      </span>
    </button>
  );
}
