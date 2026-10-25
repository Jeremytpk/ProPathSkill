import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSystemTheme } from "./lib/theme";
import { ArrowRight, Cloud, CloudOff, Menu, User, X } from "lucide-react";
import { AssessmentAnswers, Lang } from "./career/assessment";
import { buildBaseTrack, computeProfile, pickMatches, rankOccupations } from "./career/engine";
import type { CareerReport, CareerTrack, MentorGoal } from "./types";
import { useAccount } from "./lib/account";
import { COUNTRIES } from "./lib/country";
import { ProPathLogo } from "./components/ProPathLogo";
import { CareerAssessment, clearAssessmentDraft } from "./components/CareerAssessment";
import { CareerDashboard } from "./components/CareerDashboard";
import { AccountForm } from "./components/AccountForm";
import { Modal, Spinner } from "./components/ui";

// Loaded on demand to keep the first load light on mobile data.
const CoursesPage = lazy(() => import("./components/CoursesPage").then((m) => ({ default: m.CoursesPage })));
const ProjectManager = lazy(() => import("./components/ProjectManager").then((m) => ({ default: m.ProjectManager })));
const AdminPage = lazy(() => import("./components/admin/AdminPage").then((m) => ({ default: m.AdminPage })));
const PlansPage = lazy(() => import("./components/Plans").then((m) => ({ default: m.PlansPage })));
const TeachPage = lazy(() => import("./components/TeachPage").then((m) => ({ default: m.TeachPage })));
const GoalsPage = lazy(() => import("./components/GoalsPage").then((m) => ({ default: m.GoalsPage })));
const PaymentReturn = lazy(() => import("./components/Plans").then((m) => ({ default: m.PaymentReturn })));


type View = "path" | "goals" | "courses" | "projects" | "plans" | "teach" | "admin";

function readPref<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T) || fallback;
  } catch {
    return fallback;
  }
}

function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function initialGoals(fr: boolean): MentorGoal[] {
  return [
    {
      id: "goal_1",
      text: fr ? "Parler à deux personnes qui exercent le métier visé." : "Talk to two people who already do the work you're aiming for.",
      completed: false,
      category: "Industry Network",
    },
    {
      id: "goal_2",
      text: fr ? "Commencer le cours ProPath de votre meilleure piste." : "Start the ProPath course for your top match.",
      completed: false,
      category: "Technical",
    },
    {
      id: "goal_3",
      text: fr ? "Trouver un mentor ou un maître d'apprentissage près de chez vous." : "Find a mentor or master craftsperson near you.",
      completed: false,
      category: "Mentorship",
    },
  ];
}

export default function App() {
  const theme = useSystemTheme();
  const { progress, updateProgress, authedFetch, isGuest, user, cloudSync, signOut, access } = useAccount();
  const [language, setLanguage] = useState<Lang>(() => readPref<Lang>("propath_language", "french"));
  const [country, setCountry] = useState<string>(() => readPref("propath_country", ""));
  // After paying for a tutor course, the payment page sends the learner back to it.
  const [reopenCourse] = useState<string | null>(() => {
    const open = new URLSearchParams(window.location.search).get("open") || "";
    return open.startsWith("tc:") ? open.slice(3) : null;
  });
  const [view, setView] = useState<View>(() => (reopenCourse ? "courses" : window.location.hash === "#admin" ? "admin" : "path"));
  // Only admins see the Admin link.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    authedFetch("/api/admin/me").then((r) => r.json()).then((d) => setIsAdmin(Boolean(d.admin))).catch(() => setIsAdmin(false));
  }, [user?.uid]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [retakeConfirm, setRetakeConfirm] = useState(false);
  // People who already started the assessment go straight back to it.
  const [startMode, setStartMode] = useState<"choose" | "assessment">(() => {
    try {
      return localStorage.getItem("propath_assessment_draft") ? "assessment" : "choose";
    } catch {
      return "choose";
    }
  });
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(() => new URLSearchParams(window.location.search).get("payment"));
  const fr = language === "french";

  useEffect(() => {
    document.documentElement.lang = fr ? "fr" : "en";
  }, [fr]);

  const updateLanguage = (l: Lang) => {
    setLanguage(l);
    writePref("propath_language", l);
  };
  const updateCountry = (c: string) => {
    setCountry(c);
    writePref("propath_country", c);
  };
  const countryLabel = COUNTRIES.find((c) => c.name === country)?.label[fr ? "fr" : "en"] || country;
  const countryCode = COUNTRIES.find((c) => c.name === country)?.code || "CD";

  const closePayment = () => {
    setPaymentId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("open");
    window.history.replaceState({}, "", url.toString());
  };

  const handleSubmit = async (answers: AssessmentAnswers) => {
    setSubmitting(true);
    let tracks: CareerTrack[];
    let summary: string | undefined;
    let profile = computeProfile(answers);
    let note: string | undefined;
    try {
      const res = await authedFetch("/api/career/report", {
        method: "POST",
        body: JSON.stringify({ answers, language, country: countryLabel || "DR Congo" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      tracks = data.tracks;
      summary = data.summary;
      profile = data.profile;
      if (!data.enriched) note = "offline";
    } catch {
      // Matching runs locally too; only the personalised roadmap needs the server.
      tracks = pickMatches(rankOccupations(answers, profile)).map((m) => buildBaseTrack(m, profile, language));
      note = "offline";
    }

    const report: CareerReport = {
      id: `local_${Date.now()}`,
      createdAt: new Date().toISOString(),
      answers,
      profile,
      summary,
      recommendedTracks: tracks,
      mentorGoals: initialGoals(fr),
      country: countryLabel,
      language,
      note,
    };
    updateProgress((p) => ({
      ...p,
      report,
      activeTrackId: tracks[0]?.id,
      events: { ...p.events, assessmentCompletedAt: report.createdAt },
    }));
    clearAssessmentDraft();
    if (note === "offline") {
      setNotice(fr
        ? "Vos résultats sont prêts. La feuille de route détaillée pour votre pays n'a pas pu être générée ; vous pourrez refaire l'évaluation plus tard pour l'obtenir."
        : "Your results are ready. The detailed roadmap for your country couldn't be generated; retake the assessment later to get it.");
    }
    setSubmitting(false);
    window.scrollTo({ top: 0 });
  };

  const retake = () => {
    updateProgress((p) => ({ ...p, report: null, activeTrackId: undefined }));
    setStartMode("assessment");
    setRetakeConfirm(false);
    setView("path");
  };

  const navItems: { id: View; label: string }[] = [
    { id: "path", label: fr ? "Mon parcours" : "My path" },
    { id: "goals", label: fr ? "Mes objectifs" : "My goals" },
    { id: "courses", label: fr ? "Cours" : "Courses" },
    { id: "projects", label: fr ? "Projets" : "Projects" },
    { id: "plans", label: fr ? "Abonnement" : "Plans" },
  ];

  const go = (v: View) => {
    setView(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const languageToggle = (
    <div role="group" aria-label={fr ? "Langue" : "Language"} className="flex border border-ink-700 rounded-xl overflow-hidden shrink-0">
      {(["english", "french"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={language === l}
          onClick={() => updateLanguage(l)}
          className={`h-10 px-3 text-sm font-semibold ${language === l ? "bg-ink-800 text-chalk" : "text-mist hover:text-chalk"}`}
        >
          {l === "english" ? "EN" : "FR"}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-ink-900 text-chalk font-sans">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 pp-btn pp-btn-primary">
        {fr ? "Aller au contenu" : "Skip to content"}
      </a>
      <header className="sticky top-0 z-40 bg-ink-900 border-b border-ink-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button type="button" onClick={() => go("path")} className="flex items-center shrink-0" aria-label={fr ? "ProPath, accueil" : "ProPath home"}>
            <ProPathLogo className="h-10 w-auto rounded-lg" />
          </button>
          <nav aria-label={fr ? "Navigation principale" : "Main"} className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={view === item.id ? "page" : undefined}
                className={`h-10 px-3 rounded-xl text-sm font-medium ${view === item.id ? "text-chalk bg-ink-800" : "text-mist hover:text-chalk"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {languageToggle}
            <button type="button" onClick={() => setAccountOpen(true)} className="h-10 px-3 rounded-xl border border-ink-700 flex items-center gap-2 text-sm text-mist hover:text-chalk">
              <User className="w-4 h-4" aria-hidden="true" />
              <span className="max-w-[160px] truncate">{isGuest ? (fr ? "Se connecter" : "Sign in") : user?.email}</span>
              {access.plan !== "free" && <span className="pp-chip bg-gold-soft text-gold-text !py-0.5">{access.plan === "pro" ? "Pro" : "Basic"}</span>}
            </button>
          </div>
          <button type="button" className="md:hidden ml-auto w-11 h-11 rounded-xl border border-ink-700 flex items-center justify-center" aria-label={fr ? "Menu" : "Menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-ink-700 px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => go(item.id)} aria-current={view === item.id ? "page" : undefined}
                className={`min-h-[48px] px-3 rounded-xl text-left font-medium ${view === item.id ? "bg-ink-800 text-chalk" : "text-mist"}`}>
                {item.label}
              </button>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              {languageToggle}
              <button type="button" onClick={() => { setAccountOpen(true); setMenuOpen(false); }} className="pp-btn pp-btn-secondary flex-1">
                <User className="w-4 h-4" aria-hidden="true" />{isGuest ? (fr ? "Créer un compte" : "Create account") : (fr ? "Mon compte" : "My account")}
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="main" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>}>
        {view === "admin" ? (
          <AdminPage onExit={() => go("path")} />
        ) : view === "courses" ? (
          <CoursesPage language={language} initialTutorCourse={reopenCourse} />
        ) : view === "teach" ? (
          <TeachPage language={language} />
        ) : view === "plans" ? (
          <PlansPage language={language} countryCode={countryCode} />
        ) : view === "projects" ? (
          <ProjectManager
            language={language}
            country={countryLabel}
            onBack={() => go("path")}
            onUpgrade={() => go("plans")}
            initialIdea={projectIdea}
            onIdeaUsed={() => setProjectIdea(null)}
          />
        ) : view === "goals" ? (
          <GoalsPage language={language} country={countryLabel} onBuildProject={(idea) => { setProjectIdea(idea); go("projects"); }} />
        ) : !country ? (
          <Onboarding language={language} onLanguage={updateLanguage} onCountry={updateCountry} />
        ) : progress.report && progress.report.profile ? (
          <CareerDashboard
            report={progress.report}
            language={language}
            country={countryLabel}
            onRetake={() => setRetakeConfirm(true)}
            onOpenProjects={() => go("projects")}
            onOpenGoals={() => go("goals")}
          />
        ) : startMode === "choose" ? (
          <StartChoice language={language} onAssessment={() => setStartMode("assessment")} onGoal={() => go("goals")} />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="max-w-2xl mx-auto text-center flex flex-col gap-3">
              <p className="pp-eyebrow">{fr ? "Évaluation ProPath · environ 10 minutes" : "ProPath assessment · about 10 minutes"}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {fr ? "Découvrez les métiers faits pour vous" : "Find the work that fits you"}
              </h1>
              <p className="text-mist text-[17px]">
                {fr
                  ? "Dites-nous ce que vous aimeriez faire et ce que vous savez faire. ProPath vous montre les métiers qui vous correspondent et comment y arriver."
                  : "Tell us what you'd enjoy and what you're good at. ProPath shows you the work that fits and how to get there."}
              </p>
            </div>
            <CareerAssessment language={language} submitting={submitting} onSubmit={handleSubmit} />
          </div>
        )}
        </Suspense>
      </main>

      <footer className="border-t border-ink-700 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-sm text-dim">
          <span>© {new Date().getFullYear()} ProPath</span>
          <span className="flex items-center gap-2">
            {cloudSync ? <Cloud className="w-4 h-4 text-path" aria-hidden="true" /> : <CloudOff className="w-4 h-4" aria-hidden="true" />}
            {cloudSync ? (fr ? "Progression enregistrée" : "Progress saved") : (fr ? "Progression enregistrée sur cet appareil" : "Progress saved on this device")}
          </span>
          <span className="flex items-center gap-4">
            {country && (
              <button type="button" className="hover:text-chalk min-h-[44px]" onClick={() => updateCountry("")}>
                {countryLabel} · {fr ? "changer" : "change"}
              </button>
            )}
            <button type="button" className="hover:text-chalk min-h-[44px]" onClick={() => go("teach")}>{fr ? "Enseigner sur ProPath" : "Teach on ProPath"}</button>
            {isAdmin && <button type="button" className="hover:text-chalk min-h-[44px]" onClick={() => go("admin")}>Admin</button>}
          </span>
        </div>
      </footer>

      <Modal open={accountOpen} onClose={() => setAccountOpen(false)} title={isGuest ? (fr ? "Connexion à ProPath" : "Sign in to ProPath") : (fr ? "Mon compte" : "My account")}>
        {isGuest ? (
          <div className="flex flex-col gap-4">
            <p className="text-body text-[15px]">
              {fr
                ? "Créez votre compte pour commencer les cours, parler au tuteur et suivre votre progression. Vos résultats d'évaluation sont conservés."
                : "Create your account to start courses, talk to the tutor and track your progress. Your assessment results are kept."}
            </p>
            <AccountForm language={language} onDone={() => setAccountOpen(false)} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-body">{user?.email}</p>
            <p className="text-sm text-mist">
              {access.plan !== "free"
                ? `ProPath ${access.plan === "pro" ? "Pro" : "Basic"}` + (access.expiresAt ? ` · ${fr ? "jusqu'au" : "until"} ${new Date(access.expiresAt).toLocaleDateString(fr ? "fr-FR" : "en-US")}` : "")
                : (fr ? "Formule gratuite" : "Free plan")}
            </p>
            <button type="button" className="pp-btn pp-btn-primary" onClick={() => { setAccountOpen(false); go("plans"); }}>
              {access.plan === "free" ? (fr ? "Voir les formules" : "See plans") : (fr ? "Gérer mon abonnement" : "Manage my plan")}
            </button>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={() => { signOut(); setAccountOpen(false); }}>
              {fr ? "Se déconnecter" : "Sign out"}
            </button>
          </div>
        )}
      </Modal>

      <Modal open={retakeConfirm} onClose={() => setRetakeConfirm(false)} title={fr ? "Refaire l'évaluation ?" : "Retake the assessment?"}>
        <div className="flex flex-col gap-4">
          <p className="text-body">
            {fr
              ? "Vos nouveaux résultats remplaceront les actuels. Vos cours et vos projets sont conservés."
              : "Your new results will replace the current ones. Your courses and projects are kept."}
          </p>
          <div className="flex gap-3">
            <button type="button" className="pp-btn pp-btn-secondary flex-1" onClick={() => setRetakeConfirm(false)}>{fr ? "Annuler" : "Cancel"}</button>
            <button type="button" className="pp-btn pp-btn-primary flex-1" onClick={retake}>{fr ? "Refaire" : "Retake"}</button>
          </div>
        </div>
      </Modal>

      {paymentId && (
        <Suspense fallback={null}>
          <PaymentReturn transactionId={paymentId} language={language} onDone={closePayment} />
        </Suspense>
      )}

      {notice && (
        <div role="status" className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 pp-card p-4 flex gap-3 items-start">
          <p className="text-sm text-body flex-1">{notice}</p>
          <button type="button" aria-label={fr ? "Fermer" : "Dismiss"} className="w-9 h-9 -m-1 rounded-lg flex items-center justify-center text-mist hover:bg-ink-800" onClick={() => setNotice(null)}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function StartChoice({ language, onAssessment, onGoal }: { language: Lang; onAssessment: () => void; onGoal: () => void }) {
  const fr = language === "french";
  const doors = [
    {
      onClick: onAssessment,
      eyebrow: fr ? "Environ 10 minutes" : "About 10 minutes",
      title: fr ? "Aidez-moi à trouver ma voie" : "Help me find my path",
      text: fr
        ? "Vous ne savez pas encore quel métier choisir ? Répondez à des questions simples : ProPath vous montre les métiers qui vous correspondent et comment y arriver."
        : "Not sure what to do yet? Answer simple questions and ProPath shows you the work that fits you and how to get there.",
      cta: fr ? "Faire l'évaluation" : "Take the assessment",
    },
    {
      onClick: onGoal,
      eyebrow: fr ? "Environ 2 minutes" : "About 2 minutes",
      title: fr ? "J'ai déjà un projet ou un objectif" : "I already have a project or goal",
      text: fr
        ? "Décrivez ce que vous voulez faire : ProPath vous dit quelles compétences apprendre, dans quel ordre, avec un cours pour chacune."
        : "Describe what you want to do and ProPath tells you which skills to learn, in what order, with a course for each.",
      cta: fr ? "Décrire mon objectif" : "Describe my goal",
    },
  ];
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center flex flex-col gap-3">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{fr ? "Par où voulez-vous commencer ?" : "Where would you like to start?"}</h1>
        <p className="text-mist text-[17px]">{fr ? "Le talent est partout. ProPath trace le chemin." : "Talent is everywhere. ProPath shows the path."}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {doors.map((d) => (
          <button key={d.title} type="button" onClick={d.onClick} className="pp-card p-6 sm:p-8 flex flex-col gap-3 text-left hover:!border-path">
            <span className="pp-eyebrow">{d.eyebrow}</span>
            <span className="font-display text-xl font-semibold text-chalk">{d.title}</span>
            <span className="text-[15px] text-mist leading-relaxed flex-1">{d.text}</span>
            <span className="inline-flex items-center gap-2 font-semibold text-path-text mt-2">{d.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Onboarding({ language, onLanguage, onCountry }: { language: Lang; onLanguage: (l: Lang) => void; onCountry: (c: string) => void }) {
  const fr = language === "french";
  const [selected, setSelected] = useState("");
  return (
    <div className="max-w-xl mx-auto pp-card p-6 sm:p-10 flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-4">
        <ProPathLogo className="h-20 w-auto rounded-xl" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{fr ? "Bienvenue sur ProPath" : "Welcome to ProPath"}</h1>
        <p className="text-mist">{fr ? "Le talent est partout. ProPath trace le chemin." : "Talent is everywhere. ProPath shows the path."}</p>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-[16px] font-medium mb-3">{fr ? "Votre langue" : "Your language"}</legend>
        <div className="grid grid-cols-2 gap-3">
          {(["french", "english"] as Lang[]).map((l) => (
            <button key={l} type="button" aria-pressed={language === l} onClick={() => onLanguage(l)}
              className={`min-h-[52px] rounded-xl border font-semibold ${language === l ? "border-path bg-path-soft text-chalk" : "border-ink-600 text-mist hover:bg-ink-800"}`}>
              {l === "french" ? "Français" : "English"}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-[16px] font-medium mb-3">{fr ? "Votre pays" : "Your country"}</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COUNTRIES.map((c) => (
            <button key={c.code} type="button" aria-pressed={selected === c.name} onClick={() => setSelected(c.name)}
              className={`min-h-[52px] px-3 rounded-xl border text-sm font-semibold ${selected === c.name ? "border-path bg-path-soft text-chalk" : "border-ink-600 text-mist hover:bg-ink-800"}`}>
              {c.label[fr ? "fr" : "en"]}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" className="pp-btn pp-btn-primary" disabled={!selected} onClick={() => onCountry(selected)}>
        {fr ? "Commencer" : "Get started"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
