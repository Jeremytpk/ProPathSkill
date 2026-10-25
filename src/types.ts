/**
 * Type definitions for ProPath Career Alignment Platform
 */

export interface ScenarioQuestion {
  id: string;
  text: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    dimension: string; // e.g. "leadership", "analytics", "creativity", "operations"
  }[];
  sectorId?: string;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface SkillGrowth {
  name: string;
  current: number; // 1-100
  predicted: number; // 1-100
}

export interface SalaryMilestone {
  year: number;
  role: string;
  salary: number; // in USD
}

export interface Certification {
  name: string;
  provider: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string; // e.g., "3 months", "6 weeks"
  type: string; // e.g., "Professional Certificate", "Specialization"
}

export interface EducationResource {
  name: string;
  platform: string;
  duration: string;
  link: string;
  type: string;
}

export interface CareerTrack {
  id: string;
  title: string;
  category: string;
  sector: string;
  matchScore: number; // e.g. 9.4
  /** Catalogue occupation this track was matched from. */
  occupationId?: string;
  /** Calculated match, 0–100. */
  matchPercent?: number;
  /** Plain-language reasons for the match, in the report language. */
  matchReasons?: string[];
  /** Things that make this path harder for the person (training length, prerequisites). */
  matchNotes?: string[];
  description: string;
  demandLevel: string;
  salaryTimeline: SalaryMilestone[];
  /** Salaries are AI estimates, not survey data. */
  salaryIsEstimate?: boolean;
  /** Currency code of the salary figures, e.g. "CDF" or "USD". */
  salaryCurrency?: string;
  /** Pay period of the salary figures. */
  salaryPeriod?: "month" | "year";
  skillsPredicted: SkillGrowth[];
  certificationRoadmap: Certification[];
  educationalResources: EducationResource[];
  shortTermTimeline: string[];
  mediumTermTimeline: string[];
  longTermTimeline: string[];
}

export interface CareerReport {
  id: string;
  createdAt: string;
  answers: import("./career/assessment").AssessmentAnswers;
  profile: import("./career/engine").CareerProfile;
  /** Short personalised summary of strengths, in the report language. */
  summary?: string;
  recommendedTracks: CareerTrack[];
  mentorGoals: MentorGoal[];
  country?: string;
  language?: "english" | "french";
  note?: string;
}

export interface MentorGoal {
  id: string;
  text: string;
  completed: boolean;
  category: "Technical" | "Leadership" | "Mentorship" | "Industry Network";
  status?: "Planned" | "In Progress" | "Completed";
  dueDate?: string;
  priority?: "High" | "Medium" | "Low";
  description?: string;
}
