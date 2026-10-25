/** A free learning plan built from a person's own goal or project. */
export interface LearningPlan {
  id: string;
  createdAt: string;
  language: "english" | "french";
  country: string;
  goal: string;
  title: string;
  summary: string;
  kind: "job" | "business" | "both";
  estimatedWeeks: number;
  skills: PlanSkill[];
  /** Useful skills outside the ProPath skills list, shown with free search links. */
  otherSkills: string[];
  firstSteps: string[];
}

export interface PlanSkill {
  skillId: string;
  why: string;
  priority: "essential" | "important" | "useful";
  level: "beginner" | "intermediate" | "advanced";
}

export const PRIORITY_ORDER: Record<PlanSkill["priority"], number> = { essential: 0, important: 1, useful: 2 };
