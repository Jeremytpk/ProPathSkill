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
  description: string;
  demandLevel: "Exponential" | "High Growth" | "Emerging";
  salaryTimeline: SalaryMilestone[];
  skillsPredicted: SkillGrowth[];
  certificationRoadmap: Certification[];
  educationalResources: EducationResource[];
  shortTermTimeline: string[];
  mediumTermTimeline: string[];
  longTermTimeline: string[];
}

export interface AssessmentAnswers {
  answers: Record<string, string>; // questionId -> optionId
  selectedSectors: string[]; // sector IDs
}

export interface CareerReport {
  id: string;
  createdAt: string;
  answers: AssessmentAnswers;
  recommendedTracks: CareerTrack[];
  mentorGoals: MentorGoal[];
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
