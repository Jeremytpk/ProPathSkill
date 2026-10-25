import { Router } from "express";
import { z } from "zod";
import {
  AssessmentAnswers, EDUCATION_OPTIONS, FIELD_OPTIONS, GOAL_OPTIONS, INTEREST_ITEMS, Lang, RIASEC_INFO, RIASEC_TYPES,
  RiasecType, SETTING_OPTIONS, SITUATION_OPTIONS, SKILLS, SkillKey, TRAINING_OPTIONS, tr,
} from "../src/career/assessment";
import { buildBaseTrack, CareerProfile, computeProfile, getOccupation, pickMatches, rankOccupations } from "../src/career/engine";
import type { CareerTrack, EducationResource } from "../src/types";
import { generateJSON, logAIError, LANGUAGE_NAME } from "./ai";
import { rateLimit } from "./auth";

export const careerRouter = Router();

const answersSchema = z.object({
  interests: z.record(z.string(), z.number().min(0).max(2)),
  skills: z.record(z.string(), z.number().min(0).max(3)),
  context: z.object({
    education: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    situation: z.enum(["student", "looking", "employed", "self_employed"]),
    goal: z.enum(["job", "business", "both"]),
    maxTrainingMonths: z.number().min(1).max(120),
    settings: z.array(z.enum(["field", "workshop", "office", "people", "remote"])),
    fields: z.array(z.string()),
  }),
});

const PLATFORMS = ["Coursera", "edX", "Khan Academy", "freeCodeCamp", "Alison", "YouTube", "OpenClassrooms"] as const;

/** Search URLs on platforms that stay stable, so we never show an invented course link. */
function searchUrl(platform: (typeof PLATFORMS)[number], query: string) {
  const q = encodeURIComponent(query);
  switch (platform) {
    case "Coursera": return `https://www.coursera.org/search?query=${q}`;
    case "edX": return `https://www.edx.org/search?q=${q}`;
    case "Khan Academy": return `https://www.khanacademy.org/search?page_search_query=${q}`;
    case "freeCodeCamp": return `https://www.freecodecamp.org/news/search/?query=${q}`;
    case "Alison": return `https://alison.com/courses?query=${q}`;
    case "YouTube": return `https://www.youtube.com/results?search_query=${q}`;
    case "OpenClassrooms": return `https://openclassrooms.com/fr/search?query=${q}`;
  }
}

const enrichmentSchema = z.object({
  summary: z.string().describe("2–3 sentences, second person, about the person's strengths and what kind of work suits them."),
  tracks: z.array(z.object({
    occupationId: z.string(),
    description: z.string().describe("2–3 sentences on what the work looks like day to day in this country."),
    demandLevel: z.string().describe("Short label for local demand, e.g. 'High demand in cities'. Say 'Uncertain' if you don't know."),
    salaryCurrency: z.string().describe("ISO currency code wages are usually quoted in locally."),
    salaryPeriod: z.enum(["month", "year"]),
    salaryTimeline: z.array(z.object({ year: z.number().int(), role: z.string(), salary: z.number().int() }))
      .describe("Exactly 3 points: years 1, 3 and 5. Conservative typical earnings."),
    certifications: z.array(z.object({
      name: z.string(),
      provider: z.string(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
      time: z.string(),
    })),
    resources: z.array(z.object({
      name: z.string().describe("What to learn, e.g. 'Solar PV system design basics'."),
      platform: z.enum(PLATFORMS),
      searchQuery: z.string().describe("Search terms that find good free material on that platform."),
      duration: z.string(),
      type: z.string(),
    })),
    shortTermTimeline: z.array(z.string()).describe("3 concrete actions for months 0–6."),
    mediumTermTimeline: z.array(z.string()).describe("3 actions for months 6–18."),
    longTermTimeline: z.array(z.string()).describe("3 actions for 18 months and beyond."),
  })),
});

function describeProfile(profile: CareerProfile, answers: AssessmentAnswers) {
  const interests = RIASEC_TYPES
    .map((t) => `${tr(RIASEC_INFO[t].name, "english")} (${t}): ${profile.riasec[t]}/100`)
    .join("\n");
  const skills = SKILLS.map((s) => `${s.label.en}: ${profile.skills[s.key]}/100`).join("\n");
  const c = answers.context;
  const label = <T,>(opts: { value: T; label: { en: string } }[], v: T) => opts.find((o) => o.value === v)?.label.en ?? String(v);
  return `Interest profile (Holland/RIASEC, from 36 rated activities):
${interests}
Holland code: ${profile.code}${profile.undifferentiated ? " (interests are fairly even, so treat matches as less certain)" : ""}

Self-rated skills:
${skills}

Context:
- Education: ${label(EDUCATION_OPTIONS, c.education)}
- Situation: ${label(SITUATION_OPTIONS, c.situation)}
- Goal: ${label(GOAL_OPTIONS, c.goal)}
- Can train for: ${label(TRAINING_OPTIONS, c.maxTrainingMonths)}
- Preferred settings: ${c.settings.map((s) => label(SETTING_OPTIONS, s)).join(", ") || "no preference"}
- Fields of interest: ${c.fields.map((f) => label(FIELD_OPTIONS, f as any)).join(", ") || "open"}`;
}

function fallbackSummary(profile: CareerProfile, lang: Lang) {
  const [a, b] = profile.code.split("") as RiasecType[];
  const strengths = profile.topSkills
    .map((k) => tr(SKILLS.find((s) => s.key === k)!.short, lang))
    .join(", ");
  if (lang === "french") {
    return `Votre profil dominant est « ${RIASEC_INFO[a].name.fr} », suivi de « ${RIASEC_INFO[b].name.fr} ». ${RIASEC_INFO[a].strength.fr}${strengths ? ` Vous vous estimez fort(e) en : ${strengths}.` : ""}`;
  }
  return `Your strongest side is "${RIASEC_INFO[a].name.en}", followed by "${RIASEC_INFO[b].name.en}". ${RIASEC_INFO[a].strength.en}${strengths ? ` You rate yourself strong at: ${strengths}.` : ""}`;
}

careerRouter.post("/api/career/report", rateLimit("career", 10, 60 * 60 * 1000), async (req, res) => {
  const parsed = answersSchema.safeParse(req.body?.answers);
  if (!parsed.success) return res.status(400).json({ error: "invalid_answers" });
  const answers = parsed.data as AssessmentAnswers;
  const lang: Lang = req.body?.language === "french" ? "french" : "english";
  const country = typeof req.body?.country === "string" && req.body.country ? req.body.country.slice(0, 60) : "DR Congo";

  const answeredInterests = INTEREST_ITEMS.filter((i) => answers.interests[i.id] !== undefined).length;
  if (answeredInterests < INTEREST_ITEMS.length * 0.8) return res.status(400).json({ error: "incomplete_assessment" });

  const profile = computeProfile(answers);
  const matches = pickMatches(rankOccupations(answers, profile), 3);
  const baseTracks = matches.map((m) => buildBaseTrack(m, profile, lang));

  try {
    const occupationsText = matches.map((m) => {
      const occ = getOccupation(m.occupationId)!;
      return `- occupationId: ${occ.id}
  Title: ${occ.title.en}
  What it is: ${occ.summary.en}
  Usual entry route: ${occ.entry.en}
  Calculated match: ${m.percent}% (interest fit ${m.interestFit}%, skill fit ${m.skillFit}%)
  Why it matched: ${m.reasons.map((r) => r.en).join(" ")}
  Barriers: ${m.notes.map((n) => n.en).join(" ") || "none"}`;
    }).join("\n");

    const enrichment = await generateJSON(enrichmentSchema, {
      effort: "medium",
      system: `You are ProPath's career adviser. ProPath helps young people and career changers, mostly in French-speaking Africa, find realistic work that fits their strengths.
ProPath has already scored this person's interests and skills and matched them to occupations. Those matches are final: do not re-rank them, question them or add others. Your job is to make each match actionable for someone living in ${country}.

Rules:
- Write everything in ${LANGUAGE_NAME(lang)}, in plain words a secondary-school leaver understands. No hype, no jargon.
- Base every action on the person's real situation: education, how long they can train, and whether they want a job or their own business.
- Name a training institution, programme or certification only when you are confident it exists in ${country} or is internationally recognised. Otherwise describe the kind of place to look for (for example "a vocational training centre").
- Salaries: give conservative, typical earnings for this work in ${country}, in the currency wages are usually quoted in there. These will be shown as estimates. If informal or self-employed work is the norm, estimate typical monthly earnings.
- Learning resources: pick free material only, from the allowed platforms. Prefer French-language material when writing in French.
- Return one entry in "tracks" for every occupationId given, in the same order.`,
      prompt: `${describeProfile(profile, answers)}

Country: ${country}

Matched occupations:
${occupationsText}`,
    });

    const tracks: CareerTrack[] = baseTracks.map((base) => {
      const ai = enrichment.tracks.find((t) => t.occupationId === base.occupationId);
      if (!ai) return base;
      const external: EducationResource[] = ai.resources.slice(0, 4).map((r) => ({
        name: r.name,
        platform: r.platform,
        duration: r.duration,
        type: r.type,
        link: searchUrl(r.platform, r.searchQuery),
      }));
      return {
        ...base,
        description: ai.description || base.description,
        demandLevel: ai.demandLevel || base.demandLevel,
        salaryTimeline: ai.salaryTimeline.slice(0, 5),
        salaryCurrency: ai.salaryCurrency,
        salaryPeriod: ai.salaryPeriod,
        salaryIsEstimate: true,
        certificationRoadmap: ai.certifications.slice(0, 4).map((c) => ({ ...c, type: "Certification" })),
        educationalResources: external.length
          ? [...base.educationalResources.filter((r) => r.link.startsWith("propathskill://")), ...external]
          : base.educationalResources,
        shortTermTimeline: ai.shortTermTimeline.length ? ai.shortTermTimeline : base.shortTermTimeline,
        mediumTermTimeline: ai.mediumTermTimeline.length ? ai.mediumTermTimeline : base.mediumTermTimeline,
        longTermTimeline: ai.longTermTimeline.length ? ai.longTermTimeline : base.longTermTimeline,
      };
    });

    return res.json({ profile, tracks, summary: enrichment.summary, enriched: true });
  } catch (err) {
    logAIError("career report", err);
    return res.json({ profile, tracks: baseTracks, summary: fallbackSummary(profile, lang), enriched: false });
  }
});
