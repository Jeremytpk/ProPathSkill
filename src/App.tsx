import React, { useState, useEffect } from "react";
import { AssessmentQuiz } from "./components/AssessmentQuiz";
import { Dashboard } from "./components/Dashboard";
import { ReportHeader } from "./components/ReportHeader";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { AdminPortal } from "./components/AdminPortal";
import { CareerReport, MentorGoal } from "./types";
import { getReport } from "./lib/firebase";
import { 
  Sparkles, Compass, AlertCircle, RefreshCw, 
  ChevronRight, BookOpen, UserCheck, Shield, Sun, Moon, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUPPORTED_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "CD", name: "DRCongo", flag: "🇨🇩", currency: "CDF" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", currency: "FCFA" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮", currency: "FCFA" }
];

export default function App() {
  const [report, setReport] = useState<CareerReport | null>(null);
  const [loadingShared, setLoadingShared] = useState(false);
  const [sharedError, setSharedError] = useState<string | null>(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Localization and Regional States
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    return localStorage.getItem("propath_country") || "";
  });

  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "french">(() => {
    return (localStorage.getItem("propath_language") as "english" | "french") || "english";
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  const updateCountry = (country: string) => {
    setSelectedCountry(country);
    localStorage.setItem("propath_country", country);
  };

  const updateLanguage = (lang: "english" | "french") => {
    setSelectedLanguage(lang);
    localStorage.setItem("propath_language", lang);
  };

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("propath_theme");
    return (saved === "dark" || saved === "light") ? saved : "dark";
  });

  // Sync theme to root element classes
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("propath_theme", theme);
  }, [theme]);

  // Check URL params for a shared report ID on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("reportId");

    if (reportId) {
      setLoadingShared(true);
      getReport(reportId)
        .then((sharedData) => {
          if (sharedData) {
            setReport({
              id: reportId,
              ...sharedData
            });
            console.log("Shared report retrieved successfully:", reportId);
          } else {
            setSharedError("The requested Career Alignment Report could not be located in our cloud registry. It may have expired or been deleted.");
          }
        })
        .catch((err) => {
          console.error(err);
          setSharedError("A network synchronization issue occurred while downloading the report. Please try reloading.");
        })
        .finally(() => {
          setLoadingShared(false);
        });
    } else {
      // Load active local report if available
      const localReport = localStorage.getItem("propath_active_report");
      if (localReport) {
        try {
          setReport(JSON.parse(localReport));
        } catch (e) {
          console.error("Failed to parse local career report:", e);
        }
      }
    }
  }, []);

  // Handle Quiz Submission
  const handleQuizSubmit = async (data: { answers: Record<string, string>; selectedSectors: string[] }) => {
    setSubmittingAssessment(true);
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          country: selectedCountry || "United States",
          language: selectedLanguage || "english"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate career alignment report.");
      }

      const responseData = await response.json();
      
      // Setup initial mentor goals
      const initialGoals: MentorGoal[] = [
        {
          id: "goal_1",
          text: selectedLanguage === "french"
            ? "Passer en revue les compétences et les plans d'action avec un mentor de carrière."
            : "Review matched competency levels and delta trajectories with a career mentor.",
          completed: false,
          category: "Mentorship",
        },
        {
          id: "goal_2",
          text: selectedLanguage === "french"
            ? "S'inscrire au programme de formation gratuit prioritaire suggéré."
            : "Register for the top-priority curated free educational program.",
          completed: false,
          category: "Technical",
        },
        {
          id: "goal_3",
          text: selectedLanguage === "french"
            ? "Évaluer vos compétences techniques sur des projets de code open source ou GitHub."
            : "Benchmark high-level skills on open GitHub repositories or code projects.",
          completed: false,
          category: "Leadership",
        }
      ];

      const newReport: CareerReport = {
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        answers: data,
        recommendedTracks: responseData.recommendedTracks,
        mentorGoals: initialGoals,
        note: responseData.note,
      };

      setReport(newReport);
      localStorage.setItem("propath_active_report", JSON.stringify(newReport));
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setSubmitError(selectedLanguage === "french"
        ? "Le moteur intelligent d'intelligence artificielle a rencontré une forte latence. ProPath a chargé l'algorithme d'orientation local pour garantir un résultat immédiat."
        : "The AI service is experiencing high demand. ProPath has dynamically loaded our high-fidelity offline backup engine to ensure seamless, zero-delay results.");
    } finally {
      setSubmittingAssessment(false);
    }
  };

  // Update Mentor Goals
  const handleUpdateGoals = (updatedGoals: MentorGoal[]) => {
    if (!report) return;
    const updatedReport = {
      ...report,
      mentorGoals: updatedGoals,
    };
    setReport(updatedReport);
    
    // Only save locally if it's our own active report
    if (report.id.startsWith("local_")) {
      localStorage.setItem("propath_active_report", JSON.stringify(updatedReport));
    }
  };

  // Restart / Reset
  const handleRestart = () => {
    setIsConfirmOpen(true);
  };

  const handleLogoClick = () => {
    if (report) {
      setIsConfirmOpen(true);
    }
  };

  const confirmReset = () => {
    setReport(null);
    setIsAdminView(false);
    setHasOnboarded(false);
    localStorage.removeItem("propath_active_report");
    // Clean up URL parameters if any
    const url = new URL(window.location.href);
    url.searchParams.delete("reportId");
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-slate-950 bg-vibrant-gradient text-slate-100" 
        : "bg-slate-50 bg-vibrant-gradient text-slate-900"
    }`}>
      
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div className={`absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[130px] transition-opacity duration-300 ${theme === "dark" ? "bg-indigo-500/10 opacity-100" : "bg-indigo-500/5 opacity-80"}`} />
        <div className={`absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-300 ${theme === "dark" ? "bg-purple-500/8 opacity-100" : "bg-purple-500/3 opacity-80"}`} />
      </div>

      {/* Top Professional Header Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md py-4 px-6 print:hidden transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-slate-950/80 border-slate-900/60" 
          : "bg-white/80 border-slate-200/60"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={handleLogoClick}
            className={`flex items-center gap-3 select-none ${report ? "cursor-pointer group hover:opacity-90 transition-all duration-200" : ""}`}
            id="propath-logo-and-title-nav"
          >
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className={`text-sm font-bold font-display tracking-tight block transition-colors ${
                theme === "dark" ? "text-white group-hover:text-indigo-200" : "text-slate-900 group-hover:text-indigo-600"
              }`}>
                Pro<span className="text-indigo-500 dark:text-indigo-400">Path</span>
              </span>
              <span className="text-[9px] text-slate-500 tracking-wider uppercase font-semibold font-mono block leading-none">
                {selectedLanguage === "french" ? "Intelligence Vocationnelle" : "Vocational Intelligence"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Country and Language Quick Switchers */}
            <div className="flex items-center gap-1.5 border-r border-slate-800/80 pr-3 mr-1">
              <select
                value={selectedLanguage}
                onChange={(e) => updateLanguage(e.target.value as "english" | "french")}
                className="bg-slate-900/60 border border-slate-800 text-slate-300 text-[10px] rounded px-1.5 py-1 font-sans font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                title="Select Language"
              >
                <option value="english">🇬🇧 EN</option>
                <option value="french">🇫🇷 FR</option>
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => updateCountry(e.target.value)}
                className="bg-slate-900/60 border border-slate-800 text-slate-300 text-[10px] rounded px-1.5 py-1 font-sans font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                title="Select Country"
              >
                <option value="" disabled>{selectedLanguage === "french" ? "Choisir Pays" : "Select Country"}</option>
                {SUPPORTED_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Portal Toggle Link */}
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={`px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer text-xs font-bold font-sans flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                isAdminView
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                  : theme === "dark"
                    ? "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900 hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title="Admin Console"
              id="admin-portal-toggle"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isAdminView ? (selectedLanguage === "french" ? "Quitter Admin" : "Exit Admin") : (selectedLanguage === "french" ? "Portail Admin" : "Admin Console")}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                theme === "dark" 
                  ? "border-slate-800 bg-slate-900/60 text-amber-400 hover:bg-slate-900 hover:text-amber-300" 
                  : "border-slate-200 bg-white text-indigo-600 hover:bg-slate-50 hover:text-indigo-700"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {report && !window.location.search.includes("reportId") && !isAdminView && (
              <button
                onClick={confirmReset}
                className={`${
                  theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                } transition font-bold font-sans cursor-pointer`}
              >
                {selectedLanguage === "french" ? "Réinitialiser" : "Reset"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 md:px-8 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Loader for Shared Report retrieval */}
        {loadingShared ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
              <Compass className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Retrieving Shared Vocational Dossier
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              Connecting to secure cloud vaults to download matched career tracks and mentorship checklists...
            </p>
          </div>
        ) : sharedError ? (
          /* Error display for invalid shared report */
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Dossier Retrieval Failed
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {sharedError}
            </p>
            <button
              onClick={() => {
                setSharedError(null);
                // Clear query parameters
                const url = new URL(window.location.href);
                url.searchParams.delete("reportId");
                window.history.pushState({}, "", url.toString());
              }}
              className="mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Start New Evaluation
            </button>
          </div>
        ) : isAdminView ? (
          /* Route to Partner and Application Admin Console */
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPortal onBack={() => setIsAdminView(false)} theme={theme} />
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {!hasOnboarded ? (
              /* Step 0: Regional & Language Onboarding */
              <motion.div
                key="onboarding-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-2xl mx-auto glass-card p-6 md:p-10 shadow-2xl relative overflow-hidden"
              >
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="text-center mb-8 relative z-10">
                  <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4">
                    <Compass className="w-8 h-8 animate-pulse text-indigo-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight">
                    {selectedLanguage === "french" ? "Bienvenue sur ProPath" : "Welcome to ProPath"}
                  </h2>
                  <p className="text-slate-400 mt-2 text-xs md:text-sm">
                    {selectedLanguage === "french"
                      ? "Configurez vos préférences linguistiques et régionales afin d'obtenir des salaires, programmes et débouchés adaptés à votre pays de résidence."
                      : "Configure your language and regional preferences to align educational programs, local trainers, and market salary realities."}
                  </p>
                </div>

                {/* Language Select */}
                <div className="mb-8 relative z-10">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono mb-3">
                    {selectedLanguage === "french" ? "1. Choisissez votre langue" : "1. Choose Your Language"}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateLanguage("english")}
                      className={`p-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        selectedLanguage === "english"
                          ? "bg-indigo-600/20 border-indigo-500 text-white font-extrabold shadow"
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-lg">🇬🇧</span> English
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLanguage("french")}
                      className={`p-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        selectedLanguage === "french"
                          ? "bg-indigo-600/20 border-indigo-500 text-white font-extrabold shadow"
                          : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-lg">🇫🇷</span> Français
                    </button>
                  </div>
                </div>

                {/* Country Select */}
                <div className="mb-8 relative z-10">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono mb-3">
                    {selectedLanguage === "french" ? "2. Sélectionnez votre pays de résidence" : "2. Select Your Country of Residence"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SUPPORTED_COUNTRIES.map((cnt) => {
                      const isSelected = selectedCountry === cnt.name;
                      return (
                        <button
                          key={cnt.code}
                          type="button"
                          onClick={() => updateCountry(cnt.name)}
                          className={`p-3.5 rounded-xl border text-xs flex flex-col items-center text-center justify-between h-24 transition cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600/20 border-indigo-500 text-white font-bold shadow border-2"
                              : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-2xl mb-1">{cnt.flag}</span>
                          <div>
                            <span className="font-semibold block truncate max-w-full leading-none">{cnt.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-1 block uppercase">{cnt.currency}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  disabled={!selectedCountry}
                  onClick={() => setHasOnboarded(true)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                    selectedCountry
                      ? "accent-gradient text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {selectedLanguage === "french"
                      ? (report ? "Accéder au Dossier" : "Commencer l'évaluation")
                      : (report ? "Access Personal Dossier" : "Proceed to Assessment")}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : !report ? (
              /* Step 1: Scenario Assessment Quiz */
              <motion.div
                key="quiz-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                {/* Visual Intro Banner */}
                <div className="text-center max-w-3xl mx-auto mb-10 mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {selectedLanguage === "french" ? "Découverte Professionnelle Nouvelle Génération" : "Next-Generation Professional Discovery"}
                  </span>
                  <h1 className="text-3.5xl md:text-5xl font-black font-display text-white tracking-tight leading-tight mt-4">
                    {selectedLanguage === "french" ? (
                      <>
                        Associez votre Aptitude à des <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
                          Métiers d'Avenir
                        </span>
                      </>
                    ) : (
                      <>
                        Map Your Aptitude to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
                          High-Growth Careers
                        </span>
                      </>
                    )}
                  </h1>
                  <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
                    {selectedLanguage === "french"
                      ? "ProPath est une plateforme intelligente d'orientation. Nous décryptons votre style de résolution de problèmes à l'aide de scénarios réels pour concevoir des plans de carrière sur mesure."
                      : "ProPath is an immersive vocational intelligence platform. We decode your problem-solving style through dynamic real-world scenarios to design actionable execution roadmaps."}
                  </p>
                </div>

                <AssessmentQuiz
                  onSubmit={handleQuizSubmit}
                  isLoading={submittingAssessment}
                  selectedLanguage={selectedLanguage}
                  selectedCountry={selectedCountry}
                />
              </motion.div>
            ) : (
              /* Step 2: Dashboard & Mentorship View */
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Actionable Report Header Controls */}
                <ReportHeader
                  report={report}
                  onRestart={confirmReset}
                  isSharedView={!report.id.startsWith("local_")}
                />

                {/* Dashboard grid visualizers */}
                <Dashboard
                  report={report}
                  onUpdateGoals={handleUpdateGoals}
                  selectedLanguage={selectedLanguage}
                  selectedCountry={selectedCountry}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>ProPath Vocational Cloud System (v2.5)</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} ProPath. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* Branded Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmReset}
      />

      {/* Dynamic Submit Error Toast */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm glass-card border border-red-500/30 p-4 shadow-2xl flex items-start gap-3"
            id="error-toast-dossier"
          >
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
              <AlertCircle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white font-display">
                {selectedLanguage === "french" ? "Notification d'Orientation" : "Alignment Notice"}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {submitError}
              </p>
              <button
                onClick={() => setSubmitError(null)}
                className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 hover:text-indigo-300 mt-2 block transition cursor-pointer"
              >
                {selectedLanguage === "french" ? "Fermer" : "Dismiss"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
