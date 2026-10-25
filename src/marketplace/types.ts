/** Tutor marketplace: tutors, schools and institutes publish courses that learners buy chapter by chapter or whole. */

export type TutorType = "individual" | "school" | "institute" | "university";
export type TutorStatus = "pending" | "approved" | "rejected" | "suspended";

export interface TutorProfile {
  uid: string;
  email: string;
  type: TutorType;
  displayName: string;
  bio: string;
  city: string;
  country: string;
  phone: string;
  /** Where earnings are paid. */
  payout: { operator: string; prefix: string; number: string; holderName: string };
  skills: string[];
  status: TutorStatus;
  reviewNote?: string;
  createdAt: string;
  approvedAt?: string;
}

export type CourseStatus = "draft" | "pending_review" | "approved" | "rejected";
export type CourseFormat = "online" | "in_person" | "hybrid";

export interface TutorCoursePricing {
  /** "per_chapter": each paid chapter is bought separately. "full_course": one price unlocks everything. */
  mode: "per_chapter" | "full_course";
  /** USD, minimum $1. */
  chapterPrice: number;
  coursePrice: number;
  currency: "USD";
}

export interface TutorChapterMeta {
  index: number;
  title: string;
  summary: string;
  free: boolean;
}

/** Public course information. Chapter content is stored separately and served only to those with access. */
export interface TutorCourse {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorType: TutorType;
  title: string;
  description: string;
  skills: string[];
  level: "beginner" | "intermediate" | "advanced";
  language: "english" | "french";
  format: CourseFormat;
  city: string;
  country: string;
  pricing: TutorCoursePricing;
  freeChapters: number;
  chapters: TutorChapterMeta[];
  status: CourseStatus;
  reviewNote?: string;
  learners: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TutorChapterContent {
  title: string;
  summary: string;
  body: string;
  videoUrl: string;
}

export const MIN_PRICE = 1;
export const MAX_PRICE = 500;
export const MIN_FREE_CHAPTERS = 2;
export const MIN_CHAPTERS = 3;
export const TUTOR_SHARE = 0.8;

export const tutorCourseProgressId = (courseId: string) => `tc_${courseId}`;
export const fullEntitlement = (courseId: string) => `tc_${courseId}_full`;
export const chapterEntitlement = (courseId: string, index: number) => `tc_${courseId}_ch_${index}`;
