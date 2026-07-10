import React, { useState, useMemo } from "react";
import { SECTORS, QUESTIONS, getQuestionsForSector } from "../questions";
import { SECTORS_FR, QUESTIONS_FR, getQuestionsForSectorFR } from "../questions_fr";
import { Sector, ScenarioQuestion } from "../types";
import { LucideIcon } from "./LucideIcon";
import { Check, ArrowRight, ArrowLeft, BrainCircuit, Sparkles, CheckSquare, ChevronDown, ChevronUp, Star, Award, TrendingUp, Sparkle, Lock, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AssessmentQuizProps {
  onSubmit: (data: { answers: Record<string, string>; selectedSectors: string[] }) => void;
  isLoading: boolean;
  selectedLanguage: "english" | "french";
  selectedCountry: string;
}

export function AssessmentQuiz({ onSubmit, isLoading, selectedLanguage, selectedCountry }: AssessmentQuizProps) {
  // Steps can be "sectors", "questions", "suggestions", "deepdive", "success"
  const [currentStep, setCurrentStep] = useState<"sectors" | "questions" | "suggestions" | "deepdive" | "success">("sectors");
  
  const isFrench = selectedLanguage === "french";

  // Resolve questions and sectors list based on active language
  const sectorsList = isFrench ? SECTORS_FR : SECTORS;
  const questionsList = isFrench ? QUESTIONS_FR : QUESTIONS;
  const getSectorQuestions = isFrench ? getQuestionsForSectorFR : getQuestionsForSector;

  // Sector Selection state
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [showAllSectors, setShowAllSectors] = useState(false);

  // Show first 6 sectors by default unless expanded or the sector is already selected
  const visibleSectors = showAllSectors
    ? sectorsList
    : sectorsList.filter((sec, idx) => idx < 6 || selectedSectors.includes(sec.id));
  
  // Baseline Question state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Deep-dive state
  const [selectedSuggestedSectorId, setSelectedSuggestedSectorId] = useState<string | null>(null);
  const [deepDiveQuestionIdx, setDeepDiveQuestionIdx] = useState(0);
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Record<string, string>>({});

  // Translations
  const t = {
    selectIndustryTitle: isFrench ? "Sélectionnez Vos Piliers d'Industrie" : "Select Your Industry Anchors",
    selectIndustryDesc: isFrench 
      ? "Choisissez entre 1 et 3 secteurs qui correspondent à vos aspirations ou sur lesquels vous souhaitez être testé."
      : "Choose 1 to 3 industries that align with your background or curiosity to dynamically contextualize your assessment scenarios.",
    selectedLimit: isFrench ? "Sélectionné (1 à 3 requis)" : "Selected (1 to 3 required)",
    viewMore: isFrench ? `Afficher d'autres secteurs` : "View More Sectors",
    viewLess: isFrench ? "Masquer les secteurs" : "Collapse Sectors",
    proceedToQuiz: isFrench ? "Commencer le Questionnaire" : "Proceed to Scenario Quiz",
    questionOf: isFrench ? "Question" : "Question",
    onOf: isFrench ? "sur" : "of",
    scenarioContext: isFrench ? "Contexte du Scénario Réel" : "Real-World Scenario Context",
    back: isFrench ? "Retour" : "Back",
    nextScenario: isFrench ? "Scénario Suivant" : "Next Scenario",
    completeBaseline: isFrench ? "Terminer l'Évaluation" : "Complete Baseline Evaluation",
    vocationalTitle: isFrench ? "Profil de Résolution de Problèmes Unlocked !" : "Vocational Problem-Solving Style Unlocked!",
    vocationalDesc: isFrench 
      ? "Vos choix révèlent que vous excellez particulièrement dans l'archétype ci-dessous. Pour de meilleurs résultats, validez votre profil par une mise en situation technique."
      : "Based on your real-world responses, you excel naturally at the cognitive dimension detailed below. To lock in this fit, select one target industry for a technical verification.",
    primaryArchetype: isFrench ? "Archétype Cognitif Principal" : "Primary Cognitive Archetype",
    industryVerificationTitle: isFrench ? "Validation Technique Spécifique" : "Industry-Specific Verification",
    industryVerificationDesc: isFrench 
      ? "Veuillez choisir un secteur parmi les recommandations personnalisées ci-dessous pour démarrer le test technique de mise en situation."
      : "Select one high-match sector to unlock a technical scenario deep-dive and verify your technical expertise.",
    beginVerification: isFrench ? "Démarrer la Validation" : "Begin Verification",
    deepDiveTitle: isFrench ? "Validation Technique en cours" : "Deep-Dive Verification",
    technicalScenario: isFrench ? "Mise en Situation Technique" : "Technical Scenario Context",
    completeDeepDive: isFrench ? "Terminer la Validation" : "Complete Deep-Dive",
    nextDeepScenario: isFrench ? "Scénario Suivant" : "Next Deep Scenario",
    verifiedTitle: isFrench ? "Compatibilité Professionnelle Validée !" : "Vocational Match Verified!",
    verifiedDesc: isFrench 
      ? "Félicitations ! En alignant vos compétences de base avec vos réponses techniques, votre score d'adéquation est extrêmement élevé."
      : "Excellent performance! By aligning your baseline cognitive archetype with tailored industry-specific deep-dive questions, your match score is verified as HIGHER.",
    baselineScoreText: isFrench ? "Score d'Évaluation de Base" : "Baseline Alignment Index",
    baselineScoreDesc: isFrench 
      ? "Indice général d'adéquation cognitive avant ciblage technique de spécialité."
      : "General and multi-sector cognitive alignment index before hyper-targeting.",
    deepDiveScoreText: isFrench ? "Score de Validation Technique" : "Technical Scenario Fit",
    deepDiveScoreDesc: isFrench 
      ? "Vos réponses techniques confirment une augmentation notable de votre adéquation à ce métier !"
      : "Deep technical context answers verified higher fit!",
    successStatement: isFrench 
      ? "Vos réponses confirment que vous possédez les aptitudes idéales. Vous êtes maintenant prêt(e) à générer votre feuille de route de carrière personnalisée."
      : "Your targeted deep-dive answers verify that you have successfully achieved a highly optimized vocational match. You are now cleared to generate your customized career path blueprint.",
    generateRoadmap: isFrench ? "Générer ma Feuille de Route" : "Proceed & Generate Roadmap",
    generatingRoadmap: isFrench ? "Génération du plan de carrière..." : "Generating Career Blueprint...",
    changeBaseline: isFrench ? "Changer de secteur" : "Change Baseline",
    technicalAptitude: isFrench ? "Évaluation Technique" : "Technical Aptitude",
    scenarioEvaluation: isFrench ? "Évaluation de Scénario" : "Scenario Evaluation",
    reviewDeepDive: isFrench ? "Revoir les scénarios" : "Review Deep-Dive"
  };

  const getDimensionLabel = (dim: string) => {
    if (!isFrench) return dim;
    const dims: Record<string, string> = {
      "Technical Analytics": "Analyse Technique & Logique",
      "Leadership & Strategy": "Leadership & Stratégie",
      "Creative Problem Solving": "Résolution Créative de Problèmes",
      "Operations & Reliability": "Opérations & Fiabilité"
    };
    return dims[dim] || dim;
  };

  const getDimensionDesc = (dim: string) => {
    if (isFrench) {
      const descs: Record<string, string> = {
        "Technical Analytics": "Vous aimez disséquer les architectures complexes, écrire du code précis, optimiser les requêtes et résoudre les problèmes avec des approches purement rationnelles.",
        "Leadership & Strategy": "Vous excellez dans la coordination d'équipe, l'alignement des visions produits, la gestion de crise et le mentorat des collaborateurs.",
        "Creative Problem Solving": "Vous privilégiez l'expérience utilisateur, l'esthétique épurée, les micro-interactions soignées et le contournement astucieux des limites par l'innovation.",
        "Operations & Reliability": "Vous donnez la priorité absolue à la disponibilité, la sécurité, l'écriture de procédures standardisées et l'automatisation robuste."
      };
      return descs[dim] || "";
    } else {
      const descs: Record<string, string> = {
        "Technical Analytics": "You prioritize algorithmic efficiency, logical debugging, and building complex data flows. You are mathematically rigorous and highly technical.",
        "Leadership & Strategy": "You naturally step into roles that coordinate resources, resolve cross-functional deadlocks, and steer product market adoption trajectories.",
        "Creative Problem Solving": "You view constraints as canvases. You naturally bypass limitations by re-imagining flows and prioritizing emotional user delight.",
        "Operations & Reliability": "Uptime, redundancy, safety, and rigorous standard operating procedures are your north stars. You excel at stabilizing chaos."
      };
      return descs[dim] || "";
    }
  };

  // Filter baseline questions: 4 from selectedSectors or general (excluding q5), 5th is always personal q5
  const activeQuestions = useMemo(() => {
    const sectorSpecific = questionsList.filter((q) => q.sectorId && selectedSectors.includes(q.sectorId) && q.id !== "q5");
    const generalPool = questionsList.filter((q) => !q.sectorId && q.id !== "q5");

    const firstFour = [...sectorSpecific, ...generalPool].slice(0, 4);
    const personalQuestion = questionsList.find((q) => q.id === "q5");
    
    if (personalQuestion) {
      return [...firstFour, personalQuestion];
    }
    return firstFour;
  }, [selectedSectors, questionsList]);

  // Calculate dominant dimension from baseline answers
  const dominantDimension = useMemo(() => {
    const counts: Record<string, number> = {
      "Technical Analytics": 0,
      "Leadership & Strategy": 0,
      "Creative Problem Solving": 0,
      "Operations & Reliability": 0
    };
    
    activeQuestions.forEach((q) => {
      const answeredOptId = answers[q.id];
      if (answeredOptId) {
        const option = q.options.find((o) => o.id === answeredOptId);
        if (option && counts[option.dimension] !== undefined) {
          counts[option.dimension]++;
        }
      }
    });

    let maxDim = "Technical Analytics";
    let maxVal = -1;
    Object.entries(counts).forEach(([dim, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxDim = dim;
      } else if (val === maxVal) {
        const q5AnswerId = answers["q5"];
        const q5 = activeQuestions.find((q) => q.id === "q5");
        if (q5 && q5AnswerId) {
          const q5ChosenOpt = q5.options.find((o) => o.id === q5AnswerId);
          if (q5ChosenOpt && q5ChosenOpt.dimension === dim) {
            maxDim = dim;
          }
        }
      }
    });
    
    return maxDim;
  }, [answers, activeQuestions]);

  // Suggest industries based on dominant dimension
  const suggestedSectors = useMemo(() => {
    let targetIds: string[] = [];
    if (dominantDimension === "Technical Analytics") {
      targetIds = ["ai", "fintech", "biotech"];
    } else if (dominantDimension === "Leadership & Strategy") {
      targetIds = ["spacetech", "smartcities", "fintech"];
    } else if (dominantDimension === "Creative Problem Solving") {
      targetIds = ["creativedesign", "art", "spacetech"];
    } else if (dominantDimension === "Operations & Reliability") {
      targetIds = ["energy", "electrical", "carpentry", "automotive"];
    } else {
      targetIds = ["ai", "energy", "smartcities"];
    }
    
    return sectorsList.filter((s) => targetIds.includes(s.id));
  }, [dominantDimension, sectorsList]);

  // Deep-dive questions
  const deepDiveQuestions = useMemo(() => {
    if (!selectedSuggestedSectorId) return [];
    return getSectorQuestions(selectedSuggestedSectorId).slice(0, 5);
  }, [selectedSuggestedSectorId, getSectorQuestions]);

  // Calculate alignment score metrics
  const baselineScore = useMemo(() => {
    let base = 68;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount > 0) {
      const firstAns = Object.values(answers)[0];
      base += (firstAns ? (firstAns as string).charCodeAt(0) % 7 : 2);
    }
    return base;
  }, [answers]);

  const deepDiveScore = useMemo(() => {
    const answeredCount = Object.keys(deepDiveAnswers).length;
    if (answeredCount === 0) return 0;
    
    let matchCount = 0;
    deepDiveQuestions.forEach((q) => {
      const ansId = deepDiveAnswers[q.id];
      if (ansId) {
        const opt = q.options.find((o) => o.id === ansId);
        if (opt && opt.dimension === dominantDimension) {
          matchCount++;
        }
      }
    });

    return 86 + (matchCount * 2) + (answeredCount % 3);
  }, [deepDiveAnswers, deepDiveQuestions, dominantDimension]);

  // Toggle sector selection (max 3)
  const handleToggleSector = (id: string) => {
    if (selectedSectors.includes(id)) {
      setSelectedSectors(selectedSectors.filter((sid) => sid !== id));
    } else {
      if (selectedSectors.length >= 3) {
        setSelectedSectors([...selectedSectors.slice(1), id]);
      } else {
        setSelectedSectors([...selectedSectors, id]);
      }
    }
  };

  // Select option for question
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  // Select option for deep-dive question
  const handleSelectDeepDiveOption = (questionId: string, optionId: string) => {
    setDeepDiveAnswers({
      ...deepDiveAnswers,
      [questionId]: optionId,
    });
  };

  // Next question / step
  const handleNext = () => {
    if (currentStep === "sectors") {
      if (selectedSectors.length === 0) return;
      setCurrentStep("questions");
    } else if (currentStep === "questions") {
      const q = activeQuestions[currentQuestionIdx];
      if (!answers[q.id]) return;

      if (currentQuestionIdx < activeQuestions.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      } else {
        setCurrentStep("suggestions");
      }
    } else if (currentStep === "suggestions") {
      if (!selectedSuggestedSectorId) return;
      setDeepDiveQuestionIdx(0);
      setDeepDiveAnswers({});
      setCurrentStep("deepdive");
    } else if (currentStep === "deepdive") {
      const q = deepDiveQuestions[deepDiveQuestionIdx];
      if (!deepDiveAnswers[q.id]) return;

      if (deepDiveQuestionIdx < deepDiveQuestions.length - 1) {
        setDeepDiveQuestionIdx(deepDiveQuestionIdx + 1);
      } else {
        setCurrentStep("success");
      }
    }
  };

  // Back action
  const handleBack = () => {
    if (currentStep === "questions") {
      if (currentQuestionIdx > 0) {
        setCurrentQuestionIdx(currentQuestionIdx - 1);
      } else {
        setCurrentStep("sectors");
        setCurrentQuestionIdx(0);
        setAnswers({});
      }
    } else if (currentStep === "suggestions") {
      setCurrentStep("questions");
      setCurrentQuestionIdx(activeQuestions.length - 1);
    } else if (currentStep === "deepdive") {
      if (deepDiveQuestionIdx > 0) {
        setDeepDiveQuestionIdx(deepDiveQuestionIdx - 1);
      } else {
        setCurrentStep("suggestions");
      }
    } else if (currentStep === "success") {
      setCurrentStep("deepdive");
      setDeepDiveQuestionIdx(deepDiveQuestions.length - 1);
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedSuggestedSectorId) return;
    onSubmit({
      answers: { ...answers, ...deepDiveAnswers },
      selectedSectors: [selectedSuggestedSectorId]
    });
  };

  const currentQuestion = activeQuestions[currentQuestionIdx];
  const isSectorsValid = selectedSectors.length >= 1 && selectedSectors.length <= 3;
  const isQuestionAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;

  const currentDeepDiveQuestion = deepDiveQuestions[deepDiveQuestionIdx];
  const isDeepDiveQuestionAnswered = currentDeepDiveQuestion ? !!deepDiveAnswers[currentDeepDiveQuestion.id] : false;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === "sectors" && (
          /* Step 1: Sector Selection */
          <motion.div
            key="sectors-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card p-6 md:p-10 shadow-2xl"
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black tracking-tight font-display text-white">
                {t.selectIndustryTitle}
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                {t.selectIndustryDesc}
              </p>
            </div>

            {/* Grid of Sector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {visibleSectors.map((sec) => {
                const isSelected = selectedSectors.includes(sec.id);
                return (
                  <motion.div
                    key={sec.id}
                    onClick={() => handleToggleSector(sec.id)}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-48 ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/10 border-2"
                        : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/40"
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 accent-gradient text-white rounded-full p-1 border border-indigo-400 shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      {/* Dynamic Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        isSelected
                          ? "accent-gradient text-white border-transparent"
                          : "bg-slate-900 text-slate-400 border-slate-800 group-hover:border-slate-700 group-hover:text-slate-300"
                      }`}>
                        <LucideIcon name={sec.icon} size={20} />
                      </div>

                      <h3 className="text-base font-bold font-display text-white mt-4 group-hover:text-indigo-200 transition">
                        {sec.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-snug line-clamp-3">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] font-mono font-bold tracking-wide uppercase">
                      <span className="text-slate-500">{sec.category}</span>
                      {isSelected && <span className="text-indigo-400">{isFrench ? "Sélectionné" : "Selected"}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* See More / See Less Toggle Button */}
            {sectorsList.length > 6 && (
              <div className="flex justify-center mb-8">
                <button
                  type="button"
                  onClick={() => setShowAllSectors(!showAllSectors)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition-all duration-300 shadow-md cursor-pointer hover:border-slate-700 active:scale-95"
                >
                  {showAllSectors ? (
                    <>
                      {t.viewLess}
                      <ChevronUp className="w-4 h-4 text-indigo-400" />
                    </>
                  ) : (
                    <>
                      {t.viewMore} ({sectorsList.length - 6} {isFrench ? "de plus" : "more"})
                      <ChevronDown className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex justify-between items-center border-t border-slate-800/60 pt-6 mt-6">
              <span className="text-xs text-slate-500 font-medium">
                {selectedSectors.length} {isFrench ? "sur 3 piliers sélectionnés" : "of 3 target industries selected"}
              </span>

              <button
                disabled={!isSectorsValid}
                onClick={handleNext}
                className={`py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isSectorsValid
                    ? "accent-gradient text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {t.proceedToQuiz}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === "questions" && currentQuestion && (
          /* Step 2: Baseline Questionnaire */
          <motion.div
            key="questions-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card p-6 md:p-10 shadow-2xl"
          >
            {/* Header progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                  {currentQuestionIdx === 4 ? t.technicalAptitude : t.scenarioEvaluation}
                </span>
                <span className="text-slate-400">{t.questionOf} {currentQuestionIdx + 1} {t.onOf} {activeQuestions.length}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full accent-gradient transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Special indicator for personal aptitude question 5 */}
            {currentQuestionIdx === 4 ? (
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-500/20 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  {isFrench ? "Ancre d'Aptitude" : "Aptitude Anchor"}
                </span>
                <p className="text-xs md:text-sm text-emerald-100 italic mt-3 leading-relaxed border-l-2 border-emerald-500/60 pl-3">
                  "{currentQuestion.scenario}"
                </p>
              </div>
            ) : (
              /* Scenario Quote Card */
              <div className="bg-slate-950/70 rounded-2xl p-5 border border-slate-800/80 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                  {isFrench ? "Contexte Opérationnel" : "Operational Context"}
                </span>
                <p className="text-xs md:text-sm text-slate-300 italic mt-3 leading-relaxed border-l-2 border-indigo-500/60 pl-3">
                  "{currentQuestion.scenario}"
                </p>
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-lg md:text-xl font-bold font-display text-white mb-6 leading-snug">
              {currentQuestion.text}
            </h3>

            {/* Options list */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start gap-3 group relative overflow-hidden ${
                      isSelected
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-200 font-bold"
                        : "bg-slate-950/40 border-slate-850 text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/20"
                    }`}
                  >
                    {/* Animated side highlight */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 accent-gradient" />
                    )}

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 mt-0.5 ${
                      isSelected
                        ? "accent-gradient border-indigo-500 text-white"
                        : "border-slate-700 text-transparent group-hover:border-slate-500"
                    }`}>
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </div>

                    <span className="leading-relaxed flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-slate-800/60 pt-6 mt-6">
              <button
                onClick={handleBack}
                className="py-2.5 px-5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/30 transition flex items-center gap-2 text-sm font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </button>

              <button
                disabled={!isQuestionAnswered}
                onClick={handleNext}
                className={`py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isQuestionAnswered
                    ? "accent-gradient text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {currentQuestionIdx === activeQuestions.length - 1 ? (
                  <>
                    {isFrench ? "Analyser mes Forces" : "Analyze Strengths"}
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                ) : (
                  <>
                    {t.nextScenario}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === "suggestions" && (
          /* Step 3: Suggested Industries based on Aptitude Diagnostic */
          <motion.div
            key="suggestions-step"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-card p-6 md:p-10 shadow-2xl"
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-[10px] font-mono uppercase tracking-widest font-black mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                {isFrench ? "Diagnostic d'Aptitude Terminé" : "Aptitude Diagnostic Complete"}
              </div>
              <h2 className="text-3xl font-black tracking-tight font-display text-white">
                {isFrench ? "Secteurs Suggérés pour Vous" : "Suggested Industries For You"}
              </h2>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                {isFrench ? "Selon vos réponses, votre profil de force dominant est :" : "Based on your cognitive archetype, your dominant strength profile is:"}{" "}
                <span className="text-indigo-400 font-black font-mono px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20 block sm:inline-block mt-2 sm:mt-0">
                  {getDimensionLabel(dominantDimension)}
                </span>
              </p>
              <p className="text-slate-500 text-xs mt-3 max-w-lg mx-auto">
                {getDimensionDesc(dominantDimension)}
              </p>
              <p className="text-slate-400 mt-4 text-xs">
                {t.industryVerificationDesc}
              </p>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {suggestedSectors.map((sec) => {
                const isSelected = selectedSuggestedSectorId === sec.id;
                return (
                  <motion.div
                    key={sec.id}
                    onClick={() => setSelectedSuggestedSectorId(sec.id)}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`cursor-pointer group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between min-h-[290px] ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-600/10 border-2"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/30"
                    }`}
                  >
                    {/* Header Details */}
                    <div>
                      {/* Selection dot */}
                      <div className="absolute top-4 right-4 flex items-center justify-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "border-slate-700 text-transparent"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isSelected
                          ? "accent-gradient text-white border-transparent"
                          : "bg-slate-900 text-indigo-400 border-slate-800/80 group-hover:border-slate-700 group-hover:text-indigo-300"
                      }`}>
                        <LucideIcon name={sec.icon} size={24} />
                      </div>

                      <h3 className="text-lg font-bold font-display text-white mt-5 group-hover:text-indigo-200 transition">
                        {sec.name}
                      </h3>
                      
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                        {sec.category}
                      </span>

                      <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-4">
                        {sec.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-slate-800/60 pt-6">
              <button
                onClick={handleBack}
                className="py-2.5 px-5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/30 transition flex items-center gap-2 text-sm font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.changeBaseline}
              </button>

              <button
                disabled={!selectedSuggestedSectorId}
                onClick={handleNext}
                className={`py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  selectedSuggestedSectorId
                    ? "accent-gradient text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {t.beginVerification}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === "deepdive" && currentDeepDiveQuestion && (
          /* Step 4: Targeted 5-Question Deep Dive */
          <motion.div
            key="deepdive-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card p-6 md:p-10 shadow-2xl"
          >
            {/* Header progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wide">
                  <Star className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {isFrench ? "Test Technique : " : "Deep-Dive: "}{sectorsList.find(s => s.id === selectedSuggestedSectorId)?.name}
                </span>
                <span>{t.questionOf} {deepDiveQuestionIdx + 1} {t.onOf} {deepDiveQuestions.length}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((deepDiveQuestionIdx + 1) / deepDiveQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Quote Card */}
            <div className="bg-emerald-950/20 rounded-2xl p-5 border border-emerald-500/10 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                {t.technicalScenario}
              </span>
              <p className="text-xs md:text-sm text-slate-300 italic mt-3 leading-relaxed border-l-2 border-emerald-500/60 pl-3">
                "{currentDeepDiveQuestion.scenario}"
              </p>
            </div>

            {/* Question Text */}
            <h3 className="text-lg md:text-xl font-bold font-display text-white mb-6 leading-snug">
              {currentDeepDiveQuestion.text}
            </h3>

            {/* Options list */}
            <div className="space-y-3 mb-8">
              {currentDeepDiveQuestion.options.map((opt) => {
                const isSelected = deepDiveAnswers[currentDeepDiveQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectDeepDiveOption(currentDeepDiveQuestion.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start gap-3 group relative overflow-hidden ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-200 font-bold"
                        : "bg-slate-950/40 border-slate-850 text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/20"
                    }`}
                  >
                    {/* Animated side highlight */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500" />
                    )}

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 text-white"
                        : "border-slate-700 text-transparent group-hover:border-slate-500"
                    }`}>
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </div>

                    <span className="leading-relaxed flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-slate-800/60 pt-6 mt-6">
              <button
                onClick={handleBack}
                className="py-2.5 px-5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/30 transition flex items-center gap-2 text-sm font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </button>

              <button
                disabled={!isDeepDiveQuestionAnswered}
                onClick={handleNext}
                className={`py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isDeepDiveQuestionAnswered
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-95 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {deepDiveQuestionIdx === deepDiveQuestions.length - 1 ? (
                  <>
                    {t.completeDeepDive}
                    <Award className="w-4 h-4 text-emerald-300 animate-pulse" />
                  </>
                ) : (
                  <>
                    {t.nextDeepScenario}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === "success" && (
          /* Step 5: Score verification & unlock proceeding */
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 md:p-10 shadow-2xl overflow-hidden relative"
          >
            {/* Cosmic glow backgrounds */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
              <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-4 animate-bounce">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display text-white">
                {t.verifiedTitle}
              </h2>
              <p className="text-slate-400 mt-3 text-sm">
                {t.verifiedDesc}
              </p>
            </div>

            {/* Score Comparison Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 relative z-10">
              {/* Baseline */}
              <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between items-center text-center">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">
                    {t.baselineScoreText}
                  </span>
                  <div className="text-4xl font-black font-display text-slate-400 mt-2 font-mono">
                    {baselineScore}%
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                  {t.baselineScoreDesc}
                </p>
              </div>

              {/* Verified High Level Deep Dive */}
              <div className="bg-emerald-950/25 rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between items-center text-center relative shadow-lg shadow-emerald-950/40">
                <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                  {isFrench ? "Adéquation Maximale" : "Highest Match"}
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-extrabold flex items-center gap-1 justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t.deepDiveScoreText}
                  </span>
                  <div className="text-4xl font-black font-display text-emerald-400 mt-2 font-mono flex items-baseline justify-center gap-0.5">
                    {deepDiveScore}%
                    <span className="text-xs text-emerald-500 font-medium font-sans">{isFrench ? "vérifié" : "verified"}</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-3 leading-relaxed">
                  {isFrench 
                    ? `Vos réponses techniques certifient une adéquation supérieure de +${deepDiveScore - baselineScore}% !`
                    : `Deep technical context answers verified +${deepDiveScore - baselineScore}% higher fit!`}
                </p>
              </div>
            </div>

            {/* Success Summary Statement */}
            <div className="max-w-xl mx-auto bg-slate-900/40 rounded-xl p-4 border border-slate-800/80 text-center mb-10 text-xs text-slate-400 leading-relaxed relative z-10">
              {t.successStatement}
            </div>

            {/* Proceed Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto py-3 px-6 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 transition flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.reviewDeepDive}
              </button>

              <button
                disabled={isLoading}
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto py-3 px-8 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-indigo-600 to-indigo-700 text-white shadow-xl hover:opacity-95 hover:shadow-indigo-500/25 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.generatingRoadmap}
                  </>
                ) : (
                  <>
                    {t.generateRoadmap}
                    <Sparkle className="w-4 h-4 text-amber-300 animate-spin" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
