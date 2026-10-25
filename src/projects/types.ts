import type { Bilingual } from "../career/assessment";

export const DOCUMENT_TYPES = [
  "business_plan",
  "budget",
  "pitch",
  "proposal",
  "marketing_plan",
  "operations_plan",
  "contract",
  "registration_checklist",
  "weekly_report",
  "funding_application",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_LABELS: Record<DocumentType, Bilingual> = {
  business_plan: { en: "Business plan", fr: "Plan d'affaires" },
  budget: { en: "Budget and cash flow", fr: "Budget et trésorerie" },
  pitch: { en: "One-page pitch", fr: "Pitch d'une page" },
  proposal: { en: "Project proposal", fr: "Proposition de projet" },
  marketing_plan: { en: "Marketing plan", fr: "Plan marketing" },
  operations_plan: { en: "Operations plan", fr: "Plan des opérations" },
  contract: { en: "Agreement template", fr: "Modèle de contrat" },
  registration_checklist: { en: "Registration checklist", fr: "Liste pour l'enregistrement légal" },
  weekly_report: { en: "Weekly progress report", fr: "Rapport d'avancement hebdomadaire" },
  funding_application: { en: "Funding application", fr: "Demande de financement" },
};

export type TaskStatus = "todo" | "doing" | "done";

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  howTo: string[];
  deliverable: string;
  estimatedDays: number;
  priority: "high" | "medium" | "low";
  documentType: DocumentType | "none";
}

export interface ProjectPhase {
  id: string;
  title: string;
  goal: string;
  tasks: ProjectTask[];
}

export interface ProjectPlan {
  title: string;
  summary: string;
  successCriteria: string[];
  phases: ProjectPhase[];
  currency: string;
  budget: { item: string; category: string; estimate: number; note: string }[];
  risks: { risk: string; likelihood: "low" | "medium" | "high"; mitigation: string }[];
  documents: { type: DocumentType; title: string; purpose: string }[];
}

export interface ProjectDetails {
  idea: string;
  location: string;
  budget: string;
  timeline: string;
  experience: string;
  team: string;
}

export interface ProjectChatMessage {
  role: "user" | "assistant";
  text: string;
  at: string;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  language: "english" | "french";
  country: string;
  details: ProjectDetails;
  plan: ProjectPlan;
  taskStatus: Record<string, TaskStatus>;
  documents: Partial<Record<DocumentType, { markdown: string; generatedAt: string }>>;
  chat: ProjectChatMessage[];
}

export function projectProgress(project: Project) {
  const tasks = project.plan.phases.flatMap((p) => p.tasks);
  const done = tasks.filter((t) => project.taskStatus[t.id] === "done").length;
  return { done, total: tasks.length, percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

/** The first unfinished task, in plan order, preferring one already in progress. */
export function nextTask(project: Project): ProjectTask | null {
  const tasks = project.plan.phases.flatMap((p) => p.tasks);
  return (
    tasks.find((t) => project.taskStatus[t.id] === "doing") ||
    tasks.find((t) => project.taskStatus[t.id] !== "done") ||
    null
  );
}
