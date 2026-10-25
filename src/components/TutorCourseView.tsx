import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lock, MapPin, PlayCircle, Unlock, Users } from "lucide-react";
import { Lang, tr } from "../career/assessment";
import { getSkill } from "../career/skills";
import { useAccount } from "../lib/account";
import { storedCountryCode } from "../lib/country";
import { apiJson, formatUsd } from "../marketplace/api";
import { tutorCourseProgressId, type TutorChapterContent, type TutorCourse } from "../marketplace/types";
import { useAccountGate } from "./AccountForm";
import { useCheckout } from "./Plans";
import { Markdown, ProgressBar, Spinner } from "./ui";

/** YouTube links become an embedded player; other links open in a new tab. */
function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const FORMAT: Record<TutorCourse["format"], { en: string; fr: string }> = {
  online: { en: "Online", fr: "En ligne" },
  in_person: { en: "In person", fr: "En présentiel" },
  hybrid: { en: "Online and in person", fr: "En ligne et en présentiel" },
};

export function TutorCourseView({ courseId, language, onBack }: { courseId: string; language: Lang; onBack: () => void }) {
  const fr = language === "french";
  const { authedFetch, progress, updateProgress, ready, isGuest } = useAccount();
  const { guard, modal } = useAccountGate(language);
  const { start, busy, error: payError, accountModal } = useCheckout(language);
  const [data, setData] = useState<{ course: TutorCourse; access: boolean[] } | null>(null);
  const [error, setError] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const [chapter, setChapter] = useState<TutorChapterContent | null>(null);
  const [loadingChapter, setLoadingChapter] = useState(false);

  const progressId = tutorCourseProgressId(courseId);
  const saved = progress.courses[progressId];

  useEffect(() => {
    if (!ready) return;
    apiJson(authedFetch, `/api/market/courses/${courseId}`).then(setData).catch(() => setError(true));
  }, [courseId, ready, isGuest]);

  const openChapter = (i: number) =>
    guard(async () => {
      setReading(i);
      setChapter(null);
      setLoadingChapter(true);
      try {
        const { chapter } = await apiJson<{ chapter: TutorChapterContent }>(authedFetch, `/api/market/courses/${courseId}/chapters/${i}`);
        setChapter(chapter);
        if (data) {
          updateProgress((p) => ({
            ...p,
            courses: {
              ...p.courses,
              [progressId]: {
                title: data.course.title,
                startedAt: p.courses[progressId]?.startedAt || new Date().toISOString(),
                lastChapter: i,
                answers: p.courses[progressId]?.answers || {},
                passed: p.courses[progressId]?.passed || [],
                totalChapters: data.course.chapters.length,
                completedAt: p.courses[progressId]?.completedAt,
              },
            },
          }));
        }
      } catch {
        setReading(null);
      } finally {
        setLoadingChapter(false);
      }
      window.scrollTo({ top: 0 });
    });

  const markDone = (i: number) => {
    if (!data) return;
    updateProgress((p) => {
      const prev = p.courses[progressId];
      const passed = Array.from(new Set([...(prev?.passed || []), i])).sort((a, b) => a - b);
      const complete = passed.length === data.course.chapters.length;
      return {
        ...p,
        courses: {
          ...p.courses,
          [progressId]: {
            title: data.course.title,
            startedAt: prev?.startedAt || new Date().toISOString(),
            lastChapter: i,
            answers: prev?.answers || {},
            passed,
            totalChapters: data.course.chapters.length,
            completedAt: complete ? prev?.completedAt || new Date().toISOString() : undefined,
          },
        },
      };
    });
  };

  if (error) return <p className="text-danger-text" role="alert">{fr ? "Ce cours n'est pas disponible." : "This course isn't available."}</p>;
  if (!data) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;
  const { course, access } = data;
  const remainingPaid = course.chapters.filter((c, i) => !c.free && !access[i]).length;
  const fullPrice = course.pricing.mode === "full_course" ? course.pricing.coursePrice : course.pricing.chapterPrice * remainingPaid;
  const done = new Set(saved?.passed || []);
  const country = storedCountryCode();

  if (reading !== null) {
    const meta = course.chapters[reading];
    const yt = chapter?.videoUrl ? youtubeId(chapter.videoUrl) : null;
    const next = reading + 1 < course.chapters.length ? reading + 1 : null;
    return (
      <article className="max-w-3xl mx-auto flex flex-col gap-5">
        <button type="button" onClick={() => setReading(null)} className="self-start inline-flex items-center gap-2 text-sm text-mist hover:text-chalk min-h-[44px]">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {course.title}
        </button>
        <p className="pp-eyebrow">{fr ? "Chapitre" : "Chapter"} {reading + 1} / {course.chapters.length}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{meta.title}</h1>
        {loadingChapter || !chapter ? (
          <Spinner className="w-8 h-8" />
        ) : (
          <>
            {yt ? (
              <div className="aspect-video rounded-2xl overflow-hidden bg-ink-950">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${yt}`}
                  title={meta.title}
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : chapter.videoUrl ? (
              <a href={chapter.videoUrl} target="_blank" rel="noopener noreferrer" className="pp-btn pp-btn-secondary self-start"><PlayCircle className="w-4 h-4" aria-hidden="true" />{fr ? "Voir la vidéo" : "Watch the video"}</a>
            ) : null}
            <Markdown>{chapter.body}</Markdown>
            <div className="flex flex-wrap gap-3 border-t border-ink-700 pt-5">
              {done.has(reading) ? (
                <span className="inline-flex items-center gap-2 text-path-text font-medium min-h-[44px]"><CheckCircle2 className="w-5 h-5" aria-hidden="true" />{fr ? "Chapitre terminé" : "Chapter completed"}</span>
              ) : (
                <button type="button" className="pp-btn pp-btn-primary" onClick={() => markDone(reading)}><Check className="w-4 h-4" aria-hidden="true" />{fr ? "J'ai terminé ce chapitre" : "I've finished this chapter"}</button>
              )}
              {next !== null && (
                access[next]
                  ? <button type="button" className="pp-btn pp-btn-secondary" onClick={() => openChapter(next)}>{fr ? "Chapitre suivant" : "Next chapter"} <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                  : <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setReading(null)}><Lock className="w-4 h-4" aria-hidden="true" />{fr ? "Débloquer la suite" : "Unlock the next chapters"}</button>
              )}
            </div>
          </>
        )}
        {modal}
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="self-start inline-flex items-center gap-2 text-sm text-mist hover:text-chalk min-h-[44px]">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {fr ? "Retour" : "Back"}
      </button>
      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex-[999_1_420px] flex flex-col gap-3">
          <p className="pp-eyebrow">{course.tutorName}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-body text-[16px] leading-relaxed max-w-3xl whitespace-pre-line">{course.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-mist">
            <span className="pp-chip bg-ink-800">{fr ? FORMAT[course.format].fr : FORMAT[course.format].en}</span>
            {course.format !== "online" && course.city && <span className="pp-chip bg-ink-800"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{course.city}</span>}
            <span className="pp-chip bg-ink-800">{course.language === "french" ? "Français" : "English"}</span>
            <span className="pp-chip bg-ink-800"><Users className="w-3.5 h-3.5" aria-hidden="true" />{course.learners} {fr ? "apprenants" : "learners"}</span>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label={fr ? "Compétences" : "Skills"}>
            {course.skills.map((k) => getSkill(k) && <li key={k} className="pp-chip bg-path-soft text-path-text">{tr(getSkill(k)!.label, language)}</li>)}
          </ul>
        </div>
        <aside className="flex-[1_1_300px] pp-card p-5 flex flex-col gap-3">
          <p className="text-sm text-mist">
            {fr ? `${course.freeChapters} premiers chapitres gratuits` : `First ${course.freeChapters} chapters free`}
          </p>
          {saved && <ProgressBar percent={(done.size / course.chapters.length) * 100} label={fr ? "Progression" : "Progress"} />}
          {remainingPaid > 0 ? (
            <>
              <p className="font-display text-2xl font-bold">
                {course.pricing.mode === "per_chapter"
                  ? <>{formatUsd(course.pricing.chapterPrice, language)}<span className="text-base font-normal text-mist"> / {fr ? "chapitre" : "chapter"}</span></>
                  : formatUsd(course.pricing.coursePrice, language)}
              </p>
              <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => start({ kind: "tutor_course", courseId, country })}>
                {busy ? <Spinner /> : <Unlock className="w-4 h-4" aria-hidden="true" />}
                {course.pricing.mode === "per_chapter"
                  ? (fr ? `Tout débloquer : ${formatUsd(fullPrice, language)}` : `Unlock everything: ${formatUsd(fullPrice, language)}`)
                  : (fr ? "Débloquer le cours" : "Unlock the course")}
              </button>
              <p className="text-xs text-dim">{fr ? "Mobile money ou carte. Accès définitif." : "Mobile money or card. Lifetime access."}</p>
            </>
          ) : (
            <p className="text-path-text font-medium flex items-center gap-2"><CheckCircle2 className="w-5 h-5" aria-hidden="true" />{fr ? "Tout le cours est débloqué" : "The whole course is unlocked"}</p>
          )}
          {payError && <p className="text-sm text-danger-text" role="alert">{payError}</p>}
        </aside>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="tc-chapters-h">
        <h2 id="tc-chapters-h" className="font-display text-xl font-semibold">{fr ? "Chapitres" : "Chapters"}</h2>
        <ol className="flex flex-col gap-2">
          {course.chapters.map((c, i) => (
            <li key={i} className="pp-card p-4 flex flex-wrap items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 ${done.has(i) ? "bg-path text-on-path" : "border-2 border-ink-600 text-mist"}`}>
                {done.has(i) ? <Check className="w-4 h-4" aria-label={fr ? "Terminé" : "Done"} /> : i + 1}
              </span>
              <div className="flex-[999_1_220px] min-w-0">
                <p className="font-medium text-chalk">{c.title}</p>
                {c.summary && <p className="text-sm text-mist">{c.summary}</p>}
              </div>
              {access[i] ? (
                <button type="button" className="pp-btn pp-btn-secondary flex-[1_1_140px]" onClick={() => openChapter(i)}>
                  {c.free && <span className="pp-chip bg-path-soft text-path-text !py-0.5">{fr ? "Gratuit" : "Free"}</span>}
                  {fr ? "Lire" : "Read"}
                </button>
              ) : course.pricing.mode === "per_chapter" ? (
                <button type="button" className="pp-btn pp-btn-secondary flex-[1_1_140px]" disabled={busy} onClick={() => start({ kind: "tutor_chapter", courseId, chapterIndex: i, country })}>
                  <Lock className="w-4 h-4" aria-hidden="true" />{formatUsd(course.pricing.chapterPrice, language)}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm text-dim flex-[1_1_140px] justify-center"><Lock className="w-4 h-4" aria-hidden="true" />{fr ? "Cours payant" : "Paid course"}</span>
              )}
            </li>
          ))}
        </ol>
      </section>
      {course.format !== "online" && (
        <p className="text-sm text-mist">
          {fr ? `Les séances en présentiel ont lieu à ${course.city}. La réservation des séances arrive bientôt.` : `In-person classes take place in ${course.city}. Class booking is coming soon.`}
        </p>
      )}
      {modal}
      {accountModal}
    </div>
  );
}
