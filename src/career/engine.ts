import {
  AssessmentAnswers, Bilingual, EDUCATION_OPTIONS, INTEREST_ITEMS, INTEREST_MAX, Lang, RIASEC_INFO, RIASEC_TYPES,
  RiasecType, SETTING_OPTIONS, SKILLS, SKILL_MAX, SkillKey, tr,
} from "./assessment";
import { OCCUPATIONS, Occupation } from "./occupations";
import type { CareerTrack } from "../types";

export interface CareerProfile {
  /** 0–100 per interest type. */
  riasec: Record<RiasecType, number>;
  /** Three strongest interest types, strongest first, e.g. "RIE". */
  code: string;
  /** 0–100 per self-rated skill. */
  skills: Record<SkillKey, number>;
  topSkills: SkillKey[];
  /** True when interests are too even to separate; matches are then less certain. */
  undifferentiated: boolean;
}

export interface CareerMatch {
  occupationId: string;
  /** 0–100. */
  percent: number;
  interestFit: number;
  skillFit: number;
  reasons: Bilingual[];
  notes: Bilingual[];
}

const CODE_WEIGHTS = [1, 0.7, 0.45];
const OTHER_WEIGHT = 0.1;

function occupationVector(code: string): number[] {
  return RIASEC_TYPES.map((t) => {
    const pos = code.indexOf(t);
    return pos >= 0 && pos < CODE_WEIGHTS.length ? CODE_WEIGHTS[pos] : OTHER_WEIGHT;
  });
}

function pearson(a: number[], b: number[]): number | null {
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  if (da < 1e-9 || db < 1e-9) return null;
  return num / Math.sqrt(da * db);
}

export function computeProfile(answers: AssessmentAnswers): CareerProfile {
  const totals: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const item of INTEREST_ITEMS) {
    counts[item.type]++;
    totals[item.type] += answers.interests[item.id] ?? 0;
  }
  const riasec = Object.fromEntries(
    RIASEC_TYPES.map((t) => [t, Math.round((totals[t] / (counts[t] * INTEREST_MAX)) * 100)])
  ) as Record<RiasecType, number>;

  const ranked = [...RIASEC_TYPES].sort((a, b) => riasec[b] - riasec[a]);
  const spread = riasec[ranked[0]] - riasec[ranked[5]];

  const skills = Object.fromEntries(
    SKILLS.map((s) => [s.key, Math.round(((answers.skills[s.key] ?? 0) / SKILL_MAX) * 100)])
  ) as Record<SkillKey, number>;
  const topSkills = SKILLS.map((s) => s.key)
    .filter((k) => skills[k] >= 67)
    .sort((a, b) => skills[b] - skills[a])
    .slice(0, 3);

  return { riasec, code: ranked.slice(0, 3).join(""), skills, topSkills, undifferentiated: spread < 15 };
}

function listJoin(items: string[], lang: Lang): string {
  if (items.length <= 1) return items.join("");
  const and = lang === "french" ? " et " : " and ";
  return items.slice(0, -1).join(", ") + and + items[items.length - 1];
}

function both(make: (lang: Lang) => string): Bilingual {
  return { en: make("english"), fr: make("french") };
}

export function matchOccupation(occ: Occupation, profile: CareerProfile, answers: AssessmentAnswers): CareerMatch {
  const { context } = answers;
  const user = RIASEC_TYPES.map((t) => profile.riasec[t]);
  const r = pearson(user, occupationVector(occ.code));
  const interestFit = r === null ? 0.5 : (r + 1) / 2;

  const skillFit = occ.skills.reduce((s, k) => s + profile.skills[k], 0) / (occ.skills.length * 100);
  const likedSettings = occ.settings.filter((s) => context.settings.includes(s));
  const settingFit = context.settings.length === 0 ? 0.8 : likedSettings.length > 0 ? 1 : 0.5;

  let feasibility = 1;
  const notes: Bilingual[] = [];
  if (occ.trainingMonths > context.maxTrainingMonths) {
    feasibility *= 0.85;
    notes.push(both((l) => l === "french"
      ? `Demande en général environ ${occ.trainingMonths} mois de formation, plus que ce que vous avez prévu.`
      : `Usually takes about ${occ.trainingMonths} months of training, longer than you planned.`));
  }
  if (occ.minEducation > context.education) {
    feasibility *= occ.minEducation - context.education >= 2 ? 0.8 : 0.9;
    const edu = EDUCATION_OPTIONS.find((e) => e.value === occ.minEducation)!.label;
    notes.push(both((l) => l === "french" ? `Demande en général d'abord : ${edu.fr}.` : `Usually needs this first: ${edu.en}.`));
  }

  let bonus = 0;
  if (context.goal !== "job" && occ.selfEmployable) bonus += 0.04;
  if (context.goal === "business" && !occ.selfEmployable) feasibility *= 0.92;
  if (context.fields.includes(occ.field)) bonus += 0.05;

  const score = Math.min(1, (0.6 * interestFit + 0.3 * skillFit + 0.1 * settingFit) * feasibility + bonus);

  const reasons: Bilingual[] = [];
  const userTop = profile.code.split("") as RiasecType[];
  const shared = (occ.code.slice(0, 2).split("") as RiasecType[]).filter((t) => userTop.includes(t));
  if (shared.length > 0 && !profile.undifferentiated) {
    reasons.push(both((l) => {
      const names = shared.map((t) => tr(RIASEC_INFO[t].name, l).toLowerCase());
      return l === "french"
        ? `Correspond à votre profil ${listJoin(names, l)}.`
        : `Fits your ${listJoin(names, l)} side.`;
    }));
  }
  const strongSkills = occ.skills.filter((k) => profile.skills[k] >= 67);
  if (strongSkills.length > 0) {
    reasons.push(both((l) => {
      const labels = strongSkills.map((k) => tr(SKILLS.find((s) => s.key === k)!.short, l));
      return l === "french" ? `Utilise vos points forts : ${listJoin(labels, l)}.` : `Uses what you're good at: ${listJoin(labels, l)}.`;
    }));
  }
  if (likedSettings.length > 0) {
    reasons.push(both((l) => {
      const labels = likedSettings.map((s) => tr(SETTING_OPTIONS.find((o) => o.value === s)!.label, l).toLowerCase());
      return l === "french" ? `Se pratique dans un cadre qui vous plaît : ${listJoin(labels, l)}.` : `Happens in a setting you like: ${listJoin(labels, l)}.`;
    }));
  }
  if (context.goal !== "job" && occ.selfEmployable) {
    reasons.push({ en: "You can start this as your own business.", fr: "Vous pouvez en faire votre propre activité." });
  }
  if (occ.trainingMonths <= 4 && occ.trainingMonths <= context.maxTrainingMonths) {
    reasons.push({ en: "You can start earning after a short training.", fr: "Vous pouvez commencer à gagner de l'argent après une courte formation." });
  }

  return {
    occupationId: occ.id,
    percent: Math.round(score * 100),
    interestFit: Math.round(interestFit * 100),
    skillFit: Math.round(skillFit * 100),
    reasons,
    notes,
  };
}

export function rankOccupations(answers: AssessmentAnswers, profile = computeProfile(answers)): CareerMatch[] {
  return OCCUPATIONS.map((occ) => matchOccupation(occ, profile, answers)).sort((a, b) => b.percent - a.percent);
}

/** Top matches, keeping at most two from the same field so the person sees real alternatives. */
export function pickMatches(ranked: CareerMatch[], count = 3): CareerMatch[] {
  const picked: CareerMatch[] = [];
  const perField = new Map<string, number>();
  for (const m of ranked) {
    const field = getOccupation(m.occupationId)!.field;
    if ((perField.get(field) ?? 0) >= 2) continue;
    picked.push(m);
    perField.set(field, (perField.get(field) ?? 0) + 1);
    if (picked.length === count) break;
  }
  return picked;
}

export function getOccupation(id: string): Occupation | undefined {
  return OCCUPATIONS.find((o) => o.id === id);
}

export function courseLink(courseId: string) {
  return `propathskill://course/${courseId}`;
}

/**
 * A complete career track built only from the catalogue and the person's answers.
 * Used when the AI roadmap is unavailable, and as the base the AI enriches.
 */
export function buildBaseTrack(match: CareerMatch, profile: CareerProfile, lang: Lang): CareerTrack {
  const occ = getOccupation(match.occupationId)!;
  const fr = lang === "french";
  const title = tr(occ.title, lang);
  const field = occ.field;

  const query = encodeURIComponent(fr ? `formation ${title}` : `${title} training`);
  const resources = [
    ...(occ.courseId
      ? [{
          name: fr ? `ProPath École - ${title}` : `ProPath Learning School - ${title}`,
          platform: "ProPath Learning School",
          duration: fr ? "À votre rythme" : "Self-paced",
          link: courseLink(occ.courseId),
          type: fr ? "Cours interactif" : "Interactive course",
        }]
      : []),
    {
      name: fr ? `Vidéos pratiques : ${title}` : `Practical videos: ${title}`,
      platform: "YouTube",
      duration: fr ? "Variable" : "Varies",
      link: `https://www.youtube.com/results?search_query=${query}`,
      type: fr ? "Vidéos" : "Videos",
    },
    {
      name: fr ? `Cours gratuits certifiants : ${title}` : `Free certificate courses: ${title}`,
      platform: "Alison",
      duration: fr ? "Variable" : "Varies",
      link: `https://alison.com/courses?query=${encodeURIComponent(occ.title.en)}`,
      type: fr ? "Cours en ligne" : "Online course",
    },
  ];

  return {
    id: occ.id,
    occupationId: occ.id,
    title,
    category: field,
    sector: field,
    matchScore: Math.round(match.percent) / 10,
    matchPercent: match.percent,
    matchReasons: match.reasons.map((r) => tr(r, lang)),
    matchNotes: match.notes.map((n) => tr(n, lang)),
    description: tr(occ.summary, lang),
    demandLevel: fr ? "À confirmer localement" : "Check locally",
    salaryTimeline: [],
    salaryIsEstimate: true,
    skillsPredicted: occ.skills.map((k) => ({
      name: tr(SKILLS.find((s) => s.key === k)!.label, lang),
      current: Math.max(5, profile.skills[k]),
      predicted: 85,
    })),
    certificationRoadmap: [],
    educationalResources: resources,
    shortTermTimeline: [
      tr(occ.entry, lang),
      fr ? `Parlez à deux personnes qui exercent déjà le métier de ${title.toLowerCase()} pour savoir comment elles ont commencé.`
         : `Talk to two people already working as ${title.toLowerCase()} and ask how they started.`,
      occ.courseId
        ? (fr ? "Commencez le cours ProPath associé et terminez le premier chapitre cette semaine." : "Start the matching ProPath course and finish the first chapter this week.")
        : (fr ? "Trouvez un centre de formation ou un maître d'apprentissage près de chez vous." : "Find a training centre or a master craftsperson near you."),
    ],
    mediumTermTimeline: [
      fr ? "Réalisez de petits travaux réels, même gratuits au début, pour prouver vos compétences." : "Do small real jobs, even unpaid at first, to prove your skills.",
      fr ? "Gardez des photos, attestations et références de chaque travail réalisé." : "Keep photos, letters and references from every job you complete.",
      occ.selfEmployable
        ? (fr ? "Fixez vos prix et trouvez vos cinq premiers clients payants." : "Set your prices and win your first five paying customers.")
        : (fr ? "Postulez à des stages et des emplois de débutant." : "Apply for internships and entry-level jobs."),
    ],
    longTermTimeline: [
      fr ? "Obtenez une certification reconnue dans votre métier." : "Earn a recognised certification in your trade.",
      fr ? "Spécialisez-vous dans ce qui est le plus demandé autour de vous." : "Specialise in what is most in demand around you.",
      occ.selfEmployable
        ? (fr ? "Développez votre activité et formez un apprenti." : "Grow your business and train an apprentice.")
        : (fr ? "Visez un poste de responsable d'équipe." : "Aim for a team lead role."),
    ],
  };
}
