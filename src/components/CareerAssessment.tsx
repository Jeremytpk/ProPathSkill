import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  AssessmentAnswers, AssessmentContext, EDUCATION_OPTIONS, FIELD_OPTIONS, GOAL_OPTIONS, INTEREST_ITEMS, INTEREST_SCALE,
  Lang, SETTING_OPTIONS, SITUATION_OPTIONS, SKILLS, SKILL_SCALE, TRAINING_OPTIONS, tr,
} from "../career/assessment";
import { ProgressBar, Spinner } from "./ui";

const DRAFT_KEY = "propath_assessment_draft";
const PAGE_SIZE = 6;
const INTEREST_PAGES = Math.ceil(INTEREST_ITEMS.length / PAGE_SIZE);
// Pages: interests (6), skills (1), about you (1)
const TOTAL_PAGES = INTEREST_PAGES + 2;

interface Draft {
  page: number;
  interests: Record<string, number>;
  skills: AssessmentAnswers["skills"];
  context: Partial<AssessmentContext>;
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { page: 0, interests: {}, skills: {}, context: { settings: [], fields: [] } };
}

export function clearAssessmentDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

interface Props {
  language: Lang;
  submitting: boolean;
  onSubmit: (answers: AssessmentAnswers) => void;
}

export function CareerAssessment({ language, submitting, onSubmit }: Props) {
  const fr = language === "french";
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const { page } = draft;

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pageItems = useMemo(() => INTEREST_ITEMS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE), [page]);
  const ctx = draft.context;

  const pageComplete =
    page < INTEREST_PAGES
      ? pageItems.every((i) => draft.interests[i.id] !== undefined)
      : page === INTEREST_PAGES
        ? SKILLS.every((s) => draft.skills[s.key] !== undefined)
        : ctx.education !== undefined && ctx.situation !== undefined && ctx.goal !== undefined && ctx.maxTrainingMonths !== undefined;

  const setInterest = (id: string, value: number) => setDraft((d) => ({ ...d, interests: { ...d.interests, [id]: value } }));
  const setSkill = (key: string, value: number) => setDraft((d) => ({ ...d, skills: { ...d.skills, [key]: value } }));
  const setCtx = (patch: Partial<AssessmentContext>) => setDraft((d) => ({ ...d, context: { ...d.context, ...patch } }));
  const toggleIn = <T extends string>(list: T[] | undefined, v: T) => (list?.includes(v) ? list.filter((x) => x !== v) : [...(list || []), v]);
  const go = (p: number) => setDraft((d) => ({ ...d, page: p }));

  const submit = () => {
    onSubmit({
      interests: draft.interests,
      skills: draft.skills,
      context: {
        education: ctx.education!,
        situation: ctx.situation!,
        goal: ctx.goal!,
        maxTrainingMonths: ctx.maxTrainingMonths!,
        settings: ctx.settings || [],
        fields: ctx.fields || [],
      },
    });
  };

  const stepLabel =
    page < INTEREST_PAGES
      ? (fr ? "Ce que vous aimeriez faire" : "What you'd enjoy")
      : page === INTEREST_PAGES
        ? (fr ? "Ce que vous savez faire" : "What you're good at")
        : (fr ? "Votre situation" : "Your situation");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline text-sm">
          <span className="text-mist">{stepLabel}</span>
          <span className="font-mono text-chalk">{page + 1} / {TOTAL_PAGES}</span>
        </div>
        <ProgressBar percent={((page + (pageComplete ? 1 : 0.5)) / TOTAL_PAGES) * 100} label={fr ? "Progression de l'évaluation" : "Assessment progress"} />
      </div>

      {page < INTEREST_PAGES && (
        <section className="flex flex-col gap-4" aria-labelledby="interests-h">
          <div>
            <h1 id="interests-h" className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              {fr ? "Aimeriez-vous faire ceci ?" : "Would you enjoy doing this?"}
            </h1>
            <p className="text-mist mt-2">
              {fr
                ? "Répondez selon votre envie, pas selon ce que vous savez déjà faire. Il n'y a pas de mauvaise réponse."
                : "Answer based on what you'd like, not what you already know how to do. There are no wrong answers."}
            </p>
          </div>
          {pageItems.map((item) => (
            <fieldset key={item.id} className="pp-card p-4 sm:p-5 flex flex-col gap-3">
              <legend className="sr-only">{tr(item.text, language)}</legend>
              <p className="text-[16px] font-medium text-chalk" aria-hidden="true">{tr(item.text, language)}</p>
              <div className="grid grid-cols-3 gap-2">
                {INTEREST_SCALE.map((opt) => {
                  const selected = draft.interests[item.id] === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`min-h-[48px] px-2 rounded-xl border flex items-center justify-center text-center text-sm font-medium cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${
                        selected ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-body hover:bg-ink-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={item.id}
                        className="sr-only"
                        checked={selected}
                        onChange={() => setInterest(item.id, opt.value)}
                      />
                      {tr(opt.label, language)}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </section>
      )}

      {page === INTEREST_PAGES && (
        <section className="flex flex-col gap-4" aria-labelledby="skills-h">
          <div>
            <h1 id="skills-h" className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              {fr ? "À quel point êtes-vous à l'aise avec…" : "How good are you at…"}
            </h1>
            <p className="text-mist mt-2">
              {fr ? "Soyez honnête : cela sert à trouver par où commencer, pas à vous juger." : "Be honest: this shows where to start, not a judgement."}
            </p>
          </div>
          {SKILLS.map((skill) => (
            <fieldset key={skill.key} className="pp-card p-4 sm:p-5 flex flex-col gap-3">
              <legend className="sr-only">{tr(skill.label, language)}</legend>
              <p className="text-[16px] font-medium text-chalk" aria-hidden="true">{tr(skill.label, language)}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SKILL_SCALE.map((opt) => {
                  const selected = draft.skills[skill.key] === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`min-h-[48px] px-2 rounded-xl border flex items-center justify-center text-sm font-medium cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${
                        selected ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-body hover:bg-ink-800"
                      }`}
                    >
                      <input type="radio" name={skill.key} className="sr-only" checked={selected} onChange={() => setSkill(skill.key, opt.value)} />
                      {tr(opt.label, language)}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </section>
      )}

      {page === INTEREST_PAGES + 1 && (
        <section className="flex flex-col gap-5" aria-labelledby="context-h">
          <div>
            <h1 id="context-h" className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              {fr ? "Parlez-nous de vous" : "Tell us about you"}
            </h1>
            <p className="text-mist mt-2">
              {fr ? "Pour vous proposer des pistes réalistes, que vous pouvez commencer maintenant." : "So we suggest paths that are realistic and that you can start now."}
            </p>
          </div>

          <ChoiceGroup legend={fr ? "Votre niveau d'études" : "Your education"} options={EDUCATION_OPTIONS} value={ctx.education} onChange={(v) => setCtx({ education: v })} language={language} columns={1} />
          <ChoiceGroup legend={fr ? "Votre situation actuelle" : "Your situation now"} options={SITUATION_OPTIONS} value={ctx.situation} onChange={(v) => setCtx({ situation: v })} language={language} />
          <ChoiceGroup legend={fr ? "Votre objectif" : "Your goal"} options={GOAL_OPTIONS} value={ctx.goal} onChange={(v) => setCtx({ goal: v })} language={language} />
          <ChoiceGroup legend={fr ? "Combien de temps pouvez-vous consacrer à une formation ?" : "How long can you spend training?"} options={TRAINING_OPTIONS} value={ctx.maxTrainingMonths} onChange={(v) => setCtx({ maxTrainingMonths: v })} language={language} />

          <MultiChoice
            legend={fr ? "Où aimeriez-vous travailler ? (facultatif)" : "Where would you like to work? (optional)"}
            options={SETTING_OPTIONS}
            values={ctx.settings || []}
            onToggle={(v) => setCtx({ settings: toggleIn(ctx.settings, v) })}
            language={language}
          />
          <MultiChoice
            legend={fr ? "Des domaines vous attirent-ils déjà ? (facultatif)" : "Any fields you're already drawn to? (optional)"}
            options={FIELD_OPTIONS}
            values={ctx.fields || []}
            onToggle={(v) => setCtx({ fields: toggleIn(ctx.fields, v) })}
            language={language}
          />
        </section>
      )}

      <div className="flex gap-3 sticky bottom-0 py-4 bg-ink-900 border-t border-ink-800 -mx-4 px-4 sm:static sm:border-0 sm:mx-0 sm:px-0">
        {page > 0 && (
          <button type="button" className="pp-btn pp-btn-secondary" onClick={() => go(page - 1)} disabled={submitting}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {fr ? "Retour" : "Back"}
          </button>
        )}
        {page < TOTAL_PAGES - 1 ? (
          <button type="button" className="pp-btn pp-btn-primary flex-1" onClick={() => go(page + 1)} disabled={!pageComplete}>
            {fr ? "Continuer" : "Continue"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="pp-btn pp-btn-primary flex-1" onClick={submit} disabled={!pageComplete || submitting}>
            {submitting ? <Spinner /> : <Check className="w-4 h-4" aria-hidden="true" />}
            {submitting ? (fr ? "Analyse de vos réponses…" : "Analysing your answers…") : (fr ? "Voir mes résultats" : "See my results")}
          </button>
        )}
      </div>
      {!pageComplete && page < TOTAL_PAGES - 1 && (
        <p className="text-sm text-dim -mt-3 text-center sm:text-left">
          {fr ? "Répondez à chaque ligne pour continuer." : "Answer every line to continue."}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup<T extends string | number>({ legend, options, value, onChange, language, columns = 2 }: {
  legend: string;
  options: { value: T; label: { en: string; fr: string } }[];
  value: T | undefined;
  onChange: (v: T) => void;
  language: Lang;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-[16px] font-medium text-chalk mb-2">{legend}</legend>
      <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={String(opt.value)}
              className={`min-h-[48px] px-4 py-3 rounded-xl border flex items-center gap-3 text-[15px] cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${
                selected ? "border-path bg-path-soft text-chalk" : "border-ink-600 text-body hover:bg-ink-800"
              }`}
            >
              <input type="radio" checked={selected} onChange={() => onChange(opt.value)} className="w-[18px] h-[18px] accent-path shrink-0" />
              {tr(opt.label, language)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function MultiChoice<T extends string>({ legend, options, values, onToggle, language }: {
  legend: string;
  options: { value: T; label: { en: string; fr: string } }[];
  values: T[];
  onToggle: (v: T) => void;
  language: Lang;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-[16px] font-medium text-chalk mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`min-h-[44px] px-4 rounded-full border flex items-center gap-2 text-sm font-medium cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${
                selected ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-body hover:bg-ink-800"
              }`}
            >
              <input type="checkbox" checked={selected} onChange={() => onToggle(opt.value)} className="sr-only" />
              {selected && <Check className="w-4 h-4" aria-hidden="true" />}
              {tr(opt.label, language)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
