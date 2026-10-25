import React, { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { FIELD_OPTIONS, Lang, tr } from "../career/assessment";
import { getSkill, SKILLS_CATALOG, type SkillGroup } from "../career/skills";

const GROUP_LABEL = (group: SkillGroup, lang: Lang) =>
  group === "foundation"
    ? (lang === "french" ? "Compétences de base" : "Foundations")
    : tr(FIELD_OPTIONS.find((f) => f.value === group)!.label, lang);

/** Choose skills from the shared ProPath skills list. */
export function SkillPicker({ value, onChange, language, max, id }: {
  value: string[];
  onChange: (skills: string[]) => void;
  language: Lang;
  max: number;
  id: string;
}) {
  const fr = language === "french";
  const [query, setQuery] = useState("");
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = SKILLS_CATALOG.filter((k) => !q || tr(k.label, language).toLowerCase().includes(q));
    const order: SkillGroup[] = ["foundation", ...FIELD_OPTIONS.map((f) => f.value)];
    return order.map((g) => ({ group: g, skills: matches.filter((k) => k.group === g) })).filter((g) => g.skills.length);
  }, [query, language]);

  const toggle = (skillId: string) =>
    onChange(value.includes(skillId) ? value.filter((v) => v !== skillId) : value.length < max ? [...value, skillId] : value);

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={fr ? "Compétences choisies" : "Chosen skills"}>
          {value.map((v) => (
            <li key={v}>
              <button type="button" onClick={() => toggle(v)} className="min-h-[36px] px-3 rounded-full bg-path-soft text-path-text text-sm font-medium inline-flex items-center gap-1.5">
                {getSkill(v) ? tr(getSkill(v)!.label, language) : v}
                <X className="w-3.5 h-3.5" aria-label={fr ? "Retirer" : "Remove"} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label className="sr-only" htmlFor={id}>{fr ? "Rechercher une compétence" : "Search skills"}</label>
      <input id={id} className="pp-input" placeholder={fr ? "Rechercher une compétence…" : "Search skills…"} value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="max-h-72 overflow-y-auto rounded-xl border border-ink-700 p-3 flex flex-col gap-4">
        {groups.map((g) => (
          <fieldset key={g.group} className="flex flex-col gap-2">
            <legend className="text-xs font-semibold tracking-wider uppercase text-dim mb-1">{GROUP_LABEL(g.group, language)}</legend>
            <div className="flex flex-wrap gap-2">
              {g.skills.map((k) => {
                const selected = value.includes(k.id);
                return (
                  <label key={k.id} className={`min-h-[36px] px-3 rounded-full border text-sm cursor-pointer inline-flex items-center gap-1.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-path ${selected ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-mist hover:bg-ink-800"}`}>
                    <input type="checkbox" className="sr-only" checked={selected} onChange={() => toggle(k.id)} />
                    {selected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                    {tr(k.label, language)}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <p className="text-xs text-dim">{fr ? `Jusqu'à ${max} compétences.` : `Up to ${max} skills.`}</p>
    </div>
  );
}
