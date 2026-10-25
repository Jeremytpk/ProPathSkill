import type { Bilingual } from "../career/assessment";
import type { ProgressState } from "./account";

export interface JourneyStep {
  id: string;
  label: Bilingual;
  done: boolean;
}

/** Milestones are derived from what the person actually did, so they tick themselves. */
export function computeJourney(progress: ProgressState, projectCount: number): JourneyStep[] {
  const courses = Object.values(progress.courses);
  const checks = Object.values(progress.roadmapChecks).filter(Boolean).length;
  return [
    {
      id: "assessment",
      label: { en: "Take the assessment", fr: "Faire l'évaluation" },
      done: Boolean(progress.report),
    },
    {
      id: "explore",
      label: { en: "Explore your top match", fr: "Explorer votre meilleure piste" },
      done: Boolean(progress.events.trackExploredAt),
    },
    {
      id: "course_start",
      label: { en: "Start a ProPath course", fr: "Commencer un cours ProPath" },
      done: courses.some((c) => c.passed.length > 0 || c.lastChapter > 0),
    },
    {
      id: "roadmap",
      label: { en: "Complete 3 roadmap actions", fr: "Réaliser 3 actions de la feuille de route" },
      done: checks >= 3,
    },
    {
      id: "course_done",
      label: { en: "Finish a course", fr: "Terminer un cours" },
      done: courses.some((c) => Boolean(c.completedAt)),
    },
    {
      id: "launch",
      label: { en: "Apply to a programme or start a project", fr: "Postuler à un programme ou lancer un projet" },
      done: Boolean(progress.events.applicationSubmittedAt) || projectCount > 0,
    },
  ];
}
