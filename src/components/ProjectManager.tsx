import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Briefcase, Check, ChevronDown, Copy, Download, FileText, Lock, MessageSquare, Plus, Printer,
  Send, Trash2, Circle, CircleDot, CheckCircle2,
} from "lucide-react";
import { useAccount } from "../lib/account";
import type { Lang } from "../career/assessment";
import { tr } from "../career/assessment";
import {
  DOCUMENT_LABELS, DocumentType, nextTask, Project, ProjectDetails, ProjectPlan, projectProgress, ProjectTask, TaskStatus,
} from "../projects/types";
import { Markdown, Modal, ProgressBar, Spinner } from "./ui";

interface Props {
  language: Lang;
  country: string;
  onBack: () => void;
  onUpgrade: () => void;
  /** Idea handed over from a learning plan, to start a new project with. */
  initialIdea?: string | null;
  onIdeaUsed?: () => void;
}

export function ProjectManager({ language, country, onBack, onUpgrade, initialIdea, onIdeaUsed }: Props) {
  const fr = language === "french";
  const { hasPlan, projects, ready } = useAccount();
  const [view, setView] = useState<{ kind: "list" } | { kind: "new" } | { kind: "project"; id: string }>(
    initialIdea ? { kind: "new" } : { kind: "list" }
  );
  const [idea] = useState(initialIdea || "");
  useEffect(() => {
    if (initialIdea) onIdeaUsed?.();
  }, []);

  const openProject = projects.find((p) => view.kind === "project" && p.id === view.id);

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={view.kind === "list" ? onBack : () => setView({ kind: "list" })} className="self-start inline-flex items-center gap-2 text-sm text-mist hover:text-chalk min-h-[44px]">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {view.kind === "list" ? (fr ? "Retour" : "Back") : (fr ? "Tous mes projets" : "All projects")}
      </button>

      {!ready ? (
        <Spinner className="w-8 h-8 mx-auto" />
      ) : !hasPlan("pro") ? (
        <ProGate language={language} onUpgrade={onUpgrade} />
      ) : view.kind === "new" ? (
        <NewProject language={language} country={country} initialIdea={idea} onCreated={(id) => setView({ kind: "project", id })} />
      ) : view.kind === "project" && openProject ? (
        <ProjectView project={openProject} language={language} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <p className="pp-eyebrow">{fr ? "Membres ProPath" : "ProPath members"}</p>
              <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Gestionnaire de projet" : "Project Manager"}</h1>
              <p className="text-mist max-w-2xl">
                {fr ? "De l'idée au lancement : un plan étape par étape, vos documents et un accompagnement à chaque tâche." : "From idea to launch: a step-by-step plan, your documents, and guidance on every task."}
              </p>
            </div>
            <button type="button" className="pp-btn pp-btn-primary" onClick={() => setView({ kind: "new" })}>
              <Plus className="w-4 h-4" aria-hidden="true" /> {fr ? "Nouveau projet" : "New project"}
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="pp-card p-8 text-center flex flex-col items-center gap-3">
              <Briefcase className="w-8 h-8 text-ascent" aria-hidden="true" />
              <p className="text-body">{fr ? "Aucun projet pour l'instant. Décrivez votre idée pour obtenir votre plan." : "No projects yet. Describe your idea to get your plan."}</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {projects.map((p) => {
                const prog = projectProgress(p);
                const next = nextTask(p);
                return (
                  <button key={p.id} type="button" onClick={() => setView({ kind: "project", id: p.id })} className="pp-card p-5 flex flex-col gap-3 text-left hover:!border-ink-600">
                    <h2 className="font-display text-lg font-semibold">{p.plan.title}</h2>
                    <ProgressBar percent={prog.percent} label={fr ? "Avancement" : "Progress"} />
                    <p className="text-sm text-mist"><span className="font-mono text-chalk">{prog.done}/{prog.total}</span> {fr ? "tâches terminées" : "tasks done"}</p>
                    {next && <p className="text-sm text-body"><span className="text-dim">{fr ? "Ensuite : " : "Next: "}</span>{next.title}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProGate({ language, onUpgrade }: { language: Lang; onUpgrade: () => void }) {
  const fr = language === "french";
  const features = fr
    ? ["Un plan complet en phases et en tâches, adapté à votre pays", "Vos documents rédigés : plan d'affaires, budget, pitch, demande de financement…", "Un chef de projet qui vous dit quoi faire ensuite et comment le faire"]
    : ["A full plan in phases and tasks, adapted to your country", "Your documents drafted: business plan, budget, pitch, funding application…", "A project manager that tells you what to do next and how to do it"];
  return (
    <div className="max-w-2xl flex flex-col gap-5">
      <p className="pp-eyebrow flex items-center gap-2"><Lock className="w-3.5 h-3.5" aria-hidden="true" />{fr ? "Inclus dans ProPath Pro" : "Included in ProPath Pro"}</p>
      <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Lancez votre projet avec ProPath" : "Launch your project with ProPath"}</h1>
      <ul className="flex flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-body text-[16px]"><Check className="w-5 h-5 text-path shrink-0 mt-0.5" aria-hidden="true" />{f}</li>
        ))}
      </ul>
      <button type="button" className="pp-btn pp-btn-ai self-start" onClick={onUpgrade}>
        {fr ? "Voir la formule Pro" : "See the Pro plan"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function NewProject({ language, country, initialIdea, onCreated }: { language: Lang; country: string; initialIdea?: string; onCreated: (id: string) => void }) {
  const fr = language === "french";
  const { authedFetch, saveProject, updateProgress } = useAccount();
  const [details, setDetails] = useState<ProjectDetails>({ idea: initialIdea || "", location: "", budget: "", timeline: "", experience: "", team: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof ProjectDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDetails({ ...details, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await authedFetch("/api/project/plan", {
        method: "POST",
        body: JSON.stringify({ ...details, language, country: country || "DR Congo" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { plan } = (await res.json()) as { plan: ProjectPlan };
      const now = new Date().toISOString();
      const project: Project = {
        id: `prj_${Date.now().toString(36)}`,
        createdAt: now,
        updatedAt: now,
        language,
        country: country || "DR Congo",
        details,
        plan,
        taskStatus: {},
        documents: {},
        chat: [],
      };
      await saveProject(project);
      updateProgress((p) => ({ ...p, events: { ...p.events, projectCreatedAt: p.events.projectCreatedAt || now } }));
      onCreated(project.id);
    } catch {
      setError(fr ? "Le plan n'a pas pu être créé. Réessayez dans un instant." : "The plan couldn't be created. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Décrivez votre projet" : "Describe your project"}</h1>
        <p className="text-mist">{fr ? "Plus vous donnez de détails, plus le plan sera précis." : "The more detail you give, the more precise your plan."}</p>
      </div>
      <div>
        <label className="pp-label" htmlFor="pj-idea">{fr ? "Votre idée" : "Your idea"}</label>
        <textarea
          id="pj-idea"
          rows={5}
          required
          minLength={10}
          className="pp-input"
          placeholder={fr ? "Ex. : ouvrir un atelier d'installation de kits solaires pour les maisons de mon quartier à Goma" : "E.g. open a workshop installing solar kits for homes in my neighbourhood in Goma"}
          value={details.idea}
          onChange={set("idea")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="pp-label" htmlFor="pj-location">{fr ? "Ville ou quartier" : "City or area"}</label>
          <input id="pj-location" className="pp-input" value={details.location} onChange={set("location")} />
        </div>
        <div>
          <label className="pp-label" htmlFor="pj-budget">{fr ? "Budget disponible" : "Budget you have"}</label>
          <input id="pj-budget" className="pp-input" placeholder={fr ? "Ex. : 500 USD" : "E.g. 500 USD"} value={details.budget} onChange={set("budget")} />
        </div>
        <div>
          <label className="pp-label" htmlFor="pj-timeline">{fr ? "Lancement souhaité" : "When you want to launch"}</label>
          <input id="pj-timeline" className="pp-input" placeholder={fr ? "Ex. : dans 3 mois" : "E.g. in 3 months"} value={details.timeline} onChange={set("timeline")} />
        </div>
        <div>
          <label className="pp-label" htmlFor="pj-team">{fr ? "Équipe" : "Team"}</label>
          <input id="pj-team" className="pp-input" placeholder={fr ? "Ex. : moi et un associé" : "E.g. me and one partner"} value={details.team} onChange={set("team")} />
        </div>
      </div>
      <div>
        <label className="pp-label" htmlFor="pj-exp">{fr ? "Votre expérience utile" : "Your relevant experience"}</label>
        <textarea id="pj-exp" rows={3} className="pp-input" value={details.experience} onChange={set("experience")} />
      </div>
      {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
      <button type="submit" className="pp-btn pp-btn-primary" disabled={busy || details.idea.trim().length < 10}>
        {busy ? <Spinner /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
        {busy ? (fr ? "Création de votre plan (environ une minute)…" : "Building your plan (about a minute)…") : (fr ? "Créer mon plan" : "Build my plan")}
      </button>
    </form>
  );
}

type Tab = "plan" | "documents" | "budget" | "assistant";

function projectContext(project: Project) {
  return {
    title: project.plan.title,
    summary: project.plan.summary,
    country: project.country,
    currency: project.plan.currency,
    budgetTotal: project.plan.budget.reduce((s, b) => s + (b.estimate || 0), 0),
    phases: project.plan.phases.map((ph) => ({
      title: ph.title,
      tasks: ph.tasks.map((t) => ({ id: t.id, title: t.title, status: project.taskStatus[t.id] || "todo" })),
    })),
  };
}

function ProjectView({ project, language }: { project: Project; language: Lang }) {
  const fr = language === "french";
  const { saveProject, deleteProject } = useAccount();
  const [tab, setTab] = useState<Tab>("plan");
  const [assistantSeed, setAssistantSeed] = useState<{ question: string; taskId?: string } | null>(null);
  const [docToOpen, setDocToOpen] = useState<DocumentType | null>(null);
  const prog = projectProgress(project);
  const next = nextTask(project);

  const update = (patch: Partial<Project>) => saveProject({ ...project, ...patch }).catch(() => undefined);
  const setStatus = (taskId: string, status: TaskStatus) => update({ taskStatus: { ...project.taskStatus, [taskId]: status } });

  const askAbout = (task: ProjectTask) => {
    setAssistantSeed({
      question: fr ? `Aide-moi à réaliser la tâche « ${task.title} ». Par où je commence ?` : `Help me do the task "${task.title}". Where do I start?`,
      taskId: task.id,
    });
    setTab("assistant");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "plan", label: fr ? "Plan" : "Plan" },
    { id: "documents", label: fr ? "Documents" : "Documents" },
    { id: "budget", label: fr ? "Budget et risques" : "Budget and risks" },
    { id: "assistant", label: fr ? "Chef de projet" : "Project manager" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6 items-stretch">
        <div className="flex-[999_1_420px] flex flex-col gap-3">
          <h1 className="font-display text-3xl font-bold tracking-tight">{project.plan.title}</h1>
          <p className="text-mist leading-relaxed max-w-3xl">{project.plan.summary}</p>
          <div className="flex items-center gap-3 max-w-md">
            <div className="flex-1"><ProgressBar percent={prog.percent} label={fr ? "Avancement du projet" : "Project progress"} /></div>
            <span className="font-mono text-sm">{prog.done}/{prog.total}</span>
          </div>
        </div>
        {next && (
          <div className="flex-[1_1_300px] pp-card p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wider text-path-text uppercase">{fr ? "Prochaine tâche" : "Next task"}</p>
            <p className="font-display text-lg font-semibold leading-snug">{next.title}</p>
            <div className="flex flex-wrap gap-2">
              {project.taskStatus[next.id] !== "doing" && (
                <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setStatus(next.id, "doing")}>{fr ? "Commencer" : "Start"}</button>
              )}
              <button type="button" className="pp-btn pp-btn-primary" onClick={() => setStatus(next.id, "done")}>
                <Check className="w-4 h-4" aria-hidden="true" />{fr ? "Terminée" : "Done"}
              </button>
              <button type="button" className="pp-btn pp-btn-ai" onClick={() => askAbout(next)}>{fr ? "Aide" : "Help"}</button>
            </div>
          </div>
        )}
      </div>

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-ink-700">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[44px] px-4 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px ${tab === t.id ? "border-path text-chalk" : "border-transparent text-mist hover:text-chalk"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "plan" && (
        <PlanTab project={project} language={language} onStatus={setStatus} onAsk={askAbout} onDraft={(type) => { setDocToOpen(type); setTab("documents"); }} />
      )}
      {tab === "documents" && <DocumentsTab project={project} language={language} openType={docToOpen} onOpened={() => setDocToOpen(null)} />}
      {tab === "budget" && <BudgetTab project={project} language={language} />}
      {tab === "assistant" && <AssistantTab project={project} language={language} seed={assistantSeed} onSeedUsed={() => setAssistantSeed(null)} />}

      <button
        type="button"
        className="self-start inline-flex items-center gap-2 text-sm text-dim hover:text-danger-text min-h-[44px]"
        onClick={() => {
          if (window.confirm(fr ? "Supprimer ce projet définitivement ?" : "Delete this project permanently?")) deleteProject(project.id);
        }}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" /> {fr ? "Supprimer le projet" : "Delete project"}
      </button>
    </div>
  );
}

const STATUS_ORDER: TaskStatus[] = ["todo", "doing", "done"];

function StatusButton({ status, onChange, fr }: { status: TaskStatus; onChange: (s: TaskStatus) => void; fr: boolean }) {
  const label = status === "done" ? (fr ? "Terminée" : "Done") : status === "doing" ? (fr ? "En cours" : "In progress") : (fr ? "À faire" : "To do");
  const Icon = status === "done" ? CheckCircle2 : status === "doing" ? CircleDot : Circle;
  return (
    <button
      type="button"
      onClick={() => onChange(STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % 3])}
      className={`min-h-[36px] px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 ${
        status === "done" ? "bg-path-soft text-path-text" : status === "doing" ? "bg-ascent-soft text-ascent-text" : "bg-ink-800 text-mist"
      }`}
      aria-label={`${label}. ${fr ? "Changer le statut" : "Change status"}`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />{label}
    </button>
  );
}

function PlanTab({ project, language, onStatus, onAsk, onDraft }: {
  project: Project;
  language: Lang;
  onStatus: (id: string, s: TaskStatus) => void;
  onAsk: (t: ProjectTask) => void;
  onDraft: (type: DocumentType) => void;
}) {
  const fr = language === "french";
  const [open, setOpen] = useState<string | null>(nextTask(project)?.id ?? null);

  return (
    <div className="flex flex-col gap-5">
      {project.plan.phases.map((phase, pi) => {
        const done = phase.tasks.filter((t) => project.taskStatus[t.id] === "done").length;
        return (
          <section key={phase.id} className="pp-card p-5 sm:p-6 flex flex-col gap-3" aria-labelledby={`ph-${phase.id}`}>
            <div className="flex flex-wrap justify-between items-baseline gap-2">
              <h2 id={`ph-${phase.id}`} className="font-display text-lg font-semibold">
                <span className="font-mono text-dim mr-2">{String(pi + 1).padStart(2, "0")}</span>{phase.title}
              </h2>
              <span className="font-mono text-sm">{done}/{phase.tasks.length}</span>
            </div>
            <p className="text-sm text-mist">{phase.goal}</p>
            <ul className="flex flex-col gap-2">
              {phase.tasks.map((task) => {
                const status = project.taskStatus[task.id] || "todo";
                const expanded = open === task.id;
                return (
                  <li key={task.id} className="rounded-xl border border-ink-700">
                    <div className="flex items-center gap-3 p-3">
                      <StatusButton status={status} onChange={(s) => onStatus(task.id, s)} fr={fr} />
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : task.id)}
                        aria-expanded={expanded}
                        className="flex-1 flex items-center justify-between gap-3 text-left min-h-[40px]"
                      >
                        <span className={`text-[15px] ${status === "done" ? "text-dim line-through" : "text-chalk"}`}>{task.title}</span>
                        <ChevronDown className={`w-4 h-4 text-mist shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                    </div>
                    {expanded && (
                      <div className="px-4 pb-4 flex flex-col gap-3 border-t border-ink-700 pt-3">
                        <p className="text-body text-[15px]">{task.description}</p>
                        <ol className="flex flex-col gap-2 list-decimal pl-5 text-[15px] text-body">
                          {task.howTo.map((step) => <li key={step}>{step}</li>)}
                        </ol>
                        <p className="text-sm text-mist">
                          <span className="text-chalk font-medium">{fr ? "Résultat attendu : " : "Deliverable: "}</span>{task.deliverable}
                          <span className="text-dim"> · {fr ? `environ ${task.estimatedDays} jour(s)` : `about ${task.estimatedDays} day(s)`}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="pp-btn pp-btn-ai" onClick={() => onAsk(task)}>
                            <MessageSquare className="w-4 h-4" aria-hidden="true" /> {fr ? "M'aider sur cette tâche" : "Help me with this task"}
                          </button>
                          {task.documentType !== "none" && (
                            <button type="button" className="pp-btn pp-btn-secondary" onClick={() => onDraft(task.documentType as DocumentType)}>
                              <FileText className="w-4 h-4" aria-hidden="true" /> {tr(DOCUMENT_LABELS[task.documentType as DocumentType], language)}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {project.plan.successCriteria.length > 0 && (
        <section className="pp-card p-5 sm:p-6 flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold">{fr ? "Comment savoir que ça marche" : "How you'll know it's working"}</h2>
          <ul className="flex flex-col gap-2">
            {project.plan.successCriteria.map((c) => (
              <li key={c} className="flex gap-3 text-body"><Check className="w-5 h-5 text-path shrink-0" aria-hidden="true" />{c}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function DocumentsTab({ project, language, openType, onOpened }: { project: Project; language: Lang; openType: DocumentType | null; onOpened: () => void }) {
  const fr = language === "french";
  const { authedFetch, saveProject } = useAccount();
  const [viewing, setViewing] = useState<DocumentType | null>(null);
  const [drafting, setDrafting] = useState<DocumentType | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!openType) return;
    if (project.documents[openType]) setViewing(openType);
    else setDrafting(openType);
    onOpened();
  }, [openType]);

  const recommended = project.plan.documents;
  const recommendedTypes = new Set(recommended.map((d) => d.type));
  const others = (Object.keys(DOCUMENT_LABELS) as DocumentType[]).filter((t) => !recommendedTypes.has(t));

  const generate = async () => {
    if (!drafting) return;
    setBusy(true);
    setError(null);
    try {
      const res = await authedFetch("/api/project/document", {
        method: "POST",
        body: JSON.stringify({ project: projectContext(project), type: drafting, notes, language }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { markdown } = await res.json();
      await saveProject({ ...project, documents: { ...project.documents, [drafting]: { markdown, generatedAt: new Date().toISOString() } } });
      setViewing(drafting);
      setDrafting(null);
      setNotes("");
    } catch {
      setError(fr ? "Le document n'a pas pu être rédigé. Réessayez." : "The document couldn't be drafted. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const doc = viewing ? project.documents[viewing] : undefined;

  const download = () => {
    if (!doc || !viewing) return;
    const blob = new Blob([doc.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.plan.title.replace(/[^\w\- ]+/g, "").slice(0, 40)} - ${tr(DOCUMENT_LABELS[viewing], language)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const print = () => {
    const el = document.getElementById("pp-doc-print");
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${tr(DOCUMENT_LABELS[viewing!], language)}</title>
<style>body{font-family:Inter,system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#111;line-height:1.55}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}h1,h2,h3{font-family:Sora,Inter,sans-serif}</style>
</head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const row = (type: DocumentType, purpose?: string) => {
    const existing = project.documents[type];
    return (
      <li key={type} className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-ink-700">
        <FileText className={`w-5 h-5 shrink-0 ${existing ? "text-path" : "text-dim"}`} aria-hidden="true" />
        <div className="flex-1 min-w-[180px] flex flex-col gap-0.5">
          <span className="text-chalk font-medium">{tr(DOCUMENT_LABELS[type], language)}</span>
          {purpose && <span className="text-sm text-mist">{purpose}</span>}
        </div>
        {existing ? (
          <div className="flex gap-2">
            <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setViewing(type)}>{fr ? "Ouvrir" : "Open"}</button>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={() => setDrafting(type)}>{fr ? "Refaire" : "Redo"}</button>
          </div>
        ) : (
          <button type="button" className="pp-btn pp-btn-ai" onClick={() => setDrafting(type)}>{fr ? "Rédiger" : "Draft"}</button>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">{fr ? "Documents recommandés pour ce projet" : "Documents this project needs"}</h2>
        <ul className="flex flex-col gap-2">{recommended.map((d) => row(d.type, d.purpose))}</ul>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">{fr ? "Autres documents" : "Other documents"}</h2>
        <ul className="flex flex-col gap-2">{others.map((t) => row(t))}</ul>
      </section>

      <Modal open={Boolean(drafting)} onClose={() => !busy && setDrafting(null)} title={drafting ? tr(DOCUMENT_LABELS[drafting], language) : ""}>
        <div className="flex flex-col gap-4">
          <p className="text-body text-[15px]">
            {fr
              ? "ProPath AI rédige ce document à partir de votre plan. Ajoutez des informations précises (prix, adresse, noms) pour un meilleur résultat."
              : "ProPath AI drafts this document from your plan. Add specifics (prices, address, names) for a better result."}
          </p>
          <div>
            <label className="pp-label" htmlFor="doc-notes">{fr ? "Informations en plus (facultatif)" : "Extra information (optional)"}</label>
            <textarea id="doc-notes" rows={4} className="pp-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
          <button type="button" className="pp-btn pp-btn-primary" onClick={generate} disabled={busy}>
            {busy && <Spinner />}{busy ? (fr ? "Rédaction en cours…" : "Drafting…") : (fr ? "Rédiger le document" : "Draft document")}
          </button>
        </div>
      </Modal>

      <Modal open={Boolean(viewing && doc)} onClose={() => setViewing(null)} title={viewing ? tr(DOCUMENT_LABELS[viewing], language) : ""} wide>
        {doc && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="pp-btn pp-btn-secondary" onClick={() => { navigator.clipboard.writeText(doc.markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                <Copy className="w-4 h-4" aria-hidden="true" />{copied ? (fr ? "Copié" : "Copied") : (fr ? "Copier" : "Copy")}
              </button>
              <button type="button" className="pp-btn pp-btn-secondary" onClick={download}><Download className="w-4 h-4" aria-hidden="true" />{fr ? "Télécharger" : "Download"}</button>
              <button type="button" className="pp-btn pp-btn-secondary" onClick={print}><Printer className="w-4 h-4" aria-hidden="true" />{fr ? "Imprimer / PDF" : "Print / PDF"}</button>
            </div>
            <p className="text-xs text-dim">
              {fr ? "Brouillon rédigé par ProPath AI : relisez-le et complétez les éléments entre crochets avant de l'utiliser." : "Draft written by ProPath AI: review it and fill in the bracketed items before using it."}
            </p>
            <div id="pp-doc-print"><Markdown>{doc.markdown}</Markdown></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function BudgetTab({ project, language }: { project: Project; language: Lang }) {
  const fr = language === "french";
  const total = project.plan.budget.reduce((s, b) => s + (b.estimate || 0), 0);
  const fmt = (n: number) => `${n.toLocaleString(fr ? "fr-FR" : "en-US")} ${project.plan.currency}`;
  return (
    <div className="flex flex-col gap-6">
      <section className="pp-card p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <h2 className="font-display text-lg font-semibold">{fr ? "Budget de départ estimé" : "Estimated startup budget"}</h2>
          <span className="font-mono text-lg text-chalk">{fmt(total)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="text-left text-dim text-sm">
                <th className="py-2 pr-4 font-medium">{fr ? "Poste" : "Item"}</th>
                <th className="py-2 pr-4 font-medium text-right">{fr ? "Estimation" : "Estimate"}</th>
                <th className="py-2 font-medium">{fr ? "Note" : "Note"}</th>
              </tr>
            </thead>
            <tbody>
              {project.plan.budget.map((b) => (
                <tr key={b.item} className="border-t border-ink-700 align-top">
                  <td className="py-3 pr-4 text-chalk">{b.item}</td>
                  <td className="py-3 pr-4 font-mono text-right whitespace-nowrap">{fmt(b.estimate)}</td>
                  <td className="py-3 text-mist text-sm">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-dim">{fr ? "Estimations à vérifier auprès de fournisseurs locaux." : "Estimates: confirm prices with local suppliers."}</p>
      </section>
      <section className="pp-card p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">{fr ? "Risques et parades" : "Risks and how to handle them"}</h2>
        <ul className="flex flex-col gap-3">
          {project.plan.risks.map((r) => (
            <li key={r.risk} className="p-4 rounded-xl border border-ink-700 flex flex-col gap-1">
              <div className="flex justify-between gap-3">
                <span className="text-chalk font-medium">{r.risk}</span>
                <span className={`pp-chip shrink-0 ${r.likelihood === "high" ? "bg-danger-soft text-danger-text" : r.likelihood === "medium" ? "bg-gold-soft text-gold-text" : "bg-ink-800 text-mist"}`}>
                  {r.likelihood === "high" ? (fr ? "Élevé" : "High") : r.likelihood === "medium" ? (fr ? "Moyen" : "Medium") : (fr ? "Faible" : "Low")}
                </span>
              </div>
              <span className="text-sm text-mist">{r.mitigation}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AssistantTab({ project, language, seed, onSeedUsed }: { project: Project; language: Lang; seed: { question: string; taskId?: string } | null; onSeedUsed: () => void }) {
  const fr = language === "french";
  const { authedFetch, saveProject } = useAccount();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (question: string, focusTaskId?: string) => {
    if (!question.trim() || busy) return;
    setBusy(true);
    setError(null);
    setInput("");
    const userMsg = { role: "user" as const, text: question.trim(), at: new Date().toISOString() };
    const withQuestion = [...project.chat, userMsg].slice(-40);
    await saveProject({ ...project, chat: withQuestion }).catch(() => undefined);
    try {
      const res = await authedFetch("/api/project/assist", {
        method: "POST",
        body: JSON.stringify({
          project: projectContext(project),
          question: userMsg.text,
          focusTaskId,
          history: project.chat.slice(-10).map((m) => ({ role: m.role, text: m.text })),
          language,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { reply } = await res.json();
      const answer = { role: "assistant" as const, text: String(reply), at: new Date().toISOString() };
      await saveProject({ ...project, chat: [...withQuestion, answer].slice(-40) });
    } catch {
      setError(fr ? "Pas de réponse pour le moment. Réessayez." : "No answer right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (seed) {
      send(seed.question, seed.taskId);
      onSeedUsed();
    }
  }, [seed]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [project.chat.length, busy]);

  const quick = fr
    ? ["Que dois-je faire ensuite ?", "Suis-je dans les temps ?", "Comment trouver mes premiers clients ?"]
    : ["What should I do next?", "Am I on track?", "How do I find my first customers?"];

  return (
    <section className="pp-card flex flex-col min-h-[480px]" aria-label={fr ? "Chef de projet ProPath" : "ProPath project manager"}>
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
        {project.chat.length === 0 && (
          <p className="text-mist">
            {fr
              ? "Je connais votre plan et l'avancement de chaque tâche. Demandez-moi quoi faire ensuite, comment faire une tâche, ou de l'aide sur un problème."
              : "I know your plan and where each task stands. Ask me what to do next, how to do a task, or for help with a problem."}
          </p>
        )}
        {project.chat.map((m, i) => (
          <div key={i} className={m.role === "user" ? "self-end max-w-[85%] rounded-2xl rounded-br-md bg-ink-800 px-4 py-3 text-[15px]" : "max-w-[95%] rounded-2xl rounded-bl-md bg-ascent-soft border border-ascent/30 px-4 py-3"}>
            {m.role === "user" ? m.text : <Markdown>{m.text}</Markdown>}
          </div>
        ))}
        {busy && <div className="flex items-center gap-2 text-sm text-mist"><Spinner className="w-4 h-4" />{fr ? "Le chef de projet réfléchit…" : "Thinking…"}</div>}
        {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
        <div ref={endRef} />
      </div>
      <div className="border-t border-ink-700 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <button key={q} type="button" className="min-h-[36px] px-3 rounded-full border border-ink-700 text-sm text-mist hover:text-chalk hover:bg-ink-800" onClick={() => send(q)} disabled={busy}>
              {q}
            </button>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="pm-input" className="sr-only">{fr ? "Votre question" : "Your question"}</label>
          <input id="pm-input" className="pp-input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder={fr ? "Posez votre question…" : "Ask your project manager…"} />
          <button type="submit" className="pp-btn pp-btn-primary !px-0 w-[46px] shrink-0" disabled={busy || !input.trim()} aria-label={fr ? "Envoyer" : "Send"}>
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
