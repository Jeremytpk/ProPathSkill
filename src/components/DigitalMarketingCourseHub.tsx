import React, { useState } from "react";
import { 
  Megaphone, Sparkles, ArrowLeft, ArrowRight, Loader2, BookOpen, 
  Target, Zap, Flame, Award, Lightbulb, Play, RefreshCw, Layers, CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { AICourseWorkspace } from "./AICourseWorkspace";

interface DigitalMarketingCourseHubProps {
  onBack: () => void;
  language?: string;
  theme?: "dark" | "light";
}

const PRESET_TOPICS = [
  { label: "🚀 Viral Social & Short-Form Video", labelFr: "🚀 Stratégie Vidéo & Réseaux Viraux", title: "Viral Social Media & Short-Form Video Strategy" },
  { label: "🎯 High-ROAS Meta & Google PPC Ads", labelFr: "🎯 Meta & Google PPC Ads à Fort ROAS", title: "High-ROAS Performance Ads & PPC Strategy" },
  { label: "🔍 AI Answer Engine & Technical SEO", labelFr: "🔍 Référencement SEO & AEO pour l'IA", title: "AI Answer Engine & Technical SEO Mastery" },
  { label: "✍️ Persuasive AI Copywriting", labelFr: "✍️ Copywriting Persuasif & Prompts IA", title: "Persuasive Copywriting & AI Prompting" },
  { label: "📧 Automated Sales Email Funnels", labelFr: "📧 Séquences Mail & Funnels Automatisés", title: "Automated Sales Funnels & Email Marketing" }
];

export function DigitalMarketingCourseHub({ onBack, language = "english", theme = "dark" }: DigitalMarketingCourseHubProps) {
  const isFrench = language.toLowerCase() === "french";
  const isDark = theme === "dark";

  const [customTopic, setCustomTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  
  // Selected course to view in workspace
  const [activeCourse, setActiveCourse] = useState<{ id: string; data?: any } | null>(null);

  // Function to request Gemini AI course generation
  const handleGenerateCourse = async (topicToUse?: string) => {
    const title = topicToUse || customTopic.trim();
    if (!title) return;

    setGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/generate-course-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          industry: "Digital Marketing & Growth",
          language: isFrench ? "french" : "english"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate course with Gemini AI");
      }

      const data = await response.json();
      if (data && data.title && data.chapters) {
        const fullCourse = {
          id: `gemini_dm_${Date.now()}`,
          ...data
        };
        setActiveCourse({ id: fullCourse.id, data: fullCourse });
      } else {
        throw new Error("Invalid course payload returned");
      }
    } catch (err: any) {
      console.warn("Gemini generation fallback engaged:", err);
      // Fallback: create a structured digital marketing course directly
      const fallbackCourse = {
        id: `gemini_dm_${Date.now()}`,
        title: title.startsWith("Digital Marketing") ? title : `Digital Marketing: ${title}`,
        industry: "Digital Marketing & Growth Strategy",
        aiTutorPersona: isFrench ? "Sophie Laurent (Directrice Marketing Digital & Growth)" : "Sophie Laurent (Digital Marketing & Growth Director)",
        chapters: [
          {
            id: "ch1",
            title: isFrench ? `1. Fondations & Positionnement : ${title}` : `1. Strategy & Foundations: ${title}`,
            summary: isFrench ? "Comprendre les leviers psychologiques, la cible et le positionnement." : "Master core positioning, audience personas, and value propositions.",
            sections: [
              {
                title: isFrench ? "Analyse de la Cible & Données d'Intention" : "Audience Personas & High-Intent Triggers",
                content: isFrench 
                  ? `Pour réussir dans ${title}, vous devez identifier précisément les points de friction de votre audience. Une cartographie claire de la cible et des déclencheurs d'achat permet de structurer la proposition de valeur avant le lancement de toute campagne.`
                  : `To succeed in ${title}, you must pinpoint your audience's exact pain points. Clear buyer persona mapping and buying signal research allow marketers to align messaging before launching campaigns.`
              }
            ],
            quiz: {
              question: isFrench ? "Quelle étape est indispensable avant de lancer une campagne ?" : "What is essential before launching a digital campaign?",
              options: [
                isFrench ? "Définir la cible et l'intention d'achat" : "Define the target audience persona and buying intent",
                isFrench ? "Lancer des publicités sans tester le texte" : "Launch ad budgets without creative testing",
                isFrench ? "Ignorer les métriques de conversion" : "Ignore conversion metrics",
                isFrench ? "Supprimer le site web" : "Delete the website"
              ],
              correctAnswer: 0,
              explanation: isFrench ? "Une analyse approfondie de l'audience garantit l'alignement de vos messages." : "Understanding intent ensures message-market fit."
            }
          },
          {
            id: "ch2",
            title: isFrench ? `2. Exécution Créative & Copywriting Persuasif` : `2. Creative Execution & Persuasive Copywriting`,
            summary: isFrench ? "Rédiger des accroches percutantes et concevoir des publicités engageantes." : "Craft high-converting copy angles, viral hooks, and ad creatives.",
            sections: [
              {
                title: isFrench ? "Rédaction d'Accroches & Tests Multi-Formats" : "High-Converting Hooks & Dynamic Creative Testing",
                content: isFrench 
                  ? "Découvrez l'art de captiver l'attention en moins de 3 secondes. Expérimentez plusieurs déclinaisons d'angles rédactionnels et de titres publicitaires pour optimiser vos taux de clics (CTR)."
                  : "Master the 3-second hook rule. Test multiple copy angles and headline variations to optimize Click-Through Rates (CTR)."
              }
            ],
            quiz: {
              question: isFrench ? "Combien de temps avez-vous pour captiver l'attention sur les réseaux sociaux ?" : "How long do you have to capture a user's visual attention online?",
              options: [isFrench ? "Moins de 3 secondes" : "Under 3 seconds", "30 minutes", "2 heures", "1 jour"],
              correctAnswer: 0,
              explanation: isFrench ? "Les 3 premières secondes déterminent si l'utilisateur s'arrête ou continue de faire défiler." : "The first 3 seconds dictate thumb-stopping scroll velocity."
            }
          },
          {
            id: "ch3",
            title: isFrench ? `3. Analytique, ROAS & Scalabilité de ${title}` : `3. Analytics, ROAS & Scaling ${title}`,
            summary: isFrench ? "Optimiser les métriques clés, le retour sur investissement et la croissance." : "Track key conversion metrics, scale ad budgets, and retain customers.",
            sections: [
              {
                title: isFrench ? "Mesure de la Conversion & Rétention" : "Conversion Tracking & Customer Retention",
                content: isFrench 
                  ? "Suivez le retour sur investissement publicitaire (ROAS), le coût par acquisition (CAC) et la valeur à vie (LTV) pour garantir une croissance rentable et durable."
                  : "Monitor Return on Ad Spend (ROAS), Customer Acquisition Cost (CAC), and Lifetime Value (LTV) to build scalable, high-margin marketing engines."
              }
            ],
            quiz: {
              question: isFrench ? "Que mesure le ROAS ?" : "What does ROAS measure?",
              options: [
                isFrench ? "Le retour sur investissement publicitaire" : "Return on Ad Spend",
                isFrench ? "La vitesse du serveur" : "Server bandwidth speed",
                isFrench ? "Le nombre de salariés" : "Employee headcount",
                isFrench ? "La taille du logo" : "Logo size"
              ],
              correctAnswer: 0,
              explanation: isFrench ? "Le ROAS calcule le chiffre d'affaires généré par chaque dollar dépensé en publicité." : "ROAS measures revenue generated per dollar spent on advertising."
            }
          }
        ]
      };
      setActiveCourse({ id: fallbackCourse.id, data: fallbackCourse });
    } finally {
      setGenerating(false);
    }
  };

  // Pre-built Gemini Digital Marketing courses
  const featuredCourses = [
    {
      id: "digital_marketing_native",
      badge: isFrench ? "Masterclass Fondations" : "Core Masterclass",
      title: isFrench ? "Marketing Digital & Stratégie Médias Sociaux" : "Digital Marketing & Social Media Strategy",
      description: isFrench 
        ? "Maîtrisez les tunnels de conversion, le SEO assisté par l'IA (AEO) et le positionnement stratégique de marque."
        : "Master modern conversion funnels, AI-assisted search (AEO), and strategic brand positioning.",
      topics: isFrench ? ["Entonnoir TOFU/MOFU/BOFU", "SEO & AEO", "Branding Organique"] : ["TOFU/MOFU/BOFU Funnels", "SEO & AEO", "Organic Branding"]
    },
    {
      id: "ai_growth_copywriting",
      badge: isFrench ? "Spécialisation IA" : "AI Specialization",
      title: isFrench ? "Growth Marketing & Copywriting Gemini IA" : "AI Growth Marketing & Copywriting with Gemini",
      description: isFrench 
        ? "Apprenez à rédiger des scripts viraux, des emails à fort taux d'ouverture et des accroches avec Gemini AI."
        : "Learn to engineer high-converting sales scripts, email sequences, and ad copy using Gemini AI prompts.",
      topics: isFrench ? ["Ingénierie de Prompt", "Scripts Vidéo TikTok/Reels", "Copywriting Persuasif"] : ["Prompt Engineering", "TikTok/Reels Scripts", "Persuasive Copywriting"]
    },
    {
      id: "seo_aeo_mastery",
      badge: isFrench ? "Référencement & IA" : "SEO & AI Optimization",
      title: isFrench ? "SEO Technique, Moteurs IA (AEO) & Contenu" : "Technical SEO, Answer Engines (AEO) & Content",
      description: isFrench 
        ? "Dominations des résultats Google et citation par les moteurs d'intelligence artificielle comme Gemini et Perplexity."
        : "Dominate Google search rankings and get cited by AI answer engines like Gemini and Search GPT.",
      topics: isFrench ? ["Données Structurées", "Recherche Mots-clés IA", "Autorité Sémantique"] : ["Schema Markup", "AI Keyword Intent", "Topical Authority"]
    },
    {
      id: "performance_ads_analytics",
      badge: isFrench ? "Publicité Payante & ROAS" : "Paid Media & ROAS",
      title: isFrench ? "Meta & Google Ads, Performance & Analytique" : "Performance Ads, Paid Media & Funnel Analytics",
      description: isFrench 
        ? "Optimisez vos campagnes publicitaires payantes, vos tests A/B dynamiques et maximisez votre ROAS."
        : "Scale high-converting Meta Ads, Google PPC campaigns, and optimize Return on Ad Spend (ROAS).",
      topics: isFrench ? ["Publicité Meta/Google", "Optimisation du ROAS", "Attribution & CAC/LTV"] : ["Meta & Google PPC", "ROAS Optimization", "CAC/LTV Analytics"]
    }
  ];

  // If a course is active, render the full AICourseWorkspace!
  if (activeCourse) {
    return (
      <AICourseWorkspace
        courseId={activeCourse.id}
        initialCourseData={activeCourse.data}
        onClose={() => setActiveCourse(null)}
        language={language}
        theme={theme}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full space-y-8 pb-16"
    >
      {/* Top Header / Breadcrumb Bar */}
      <div className={`p-4 sm:p-6 rounded-2xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isDark 
          ? "bg-slate-900/90 border-slate-800 shadow-xl" 
          : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center gap-2 text-xs font-bold w-fit ${
              isDark 
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white" 
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isFrench ? "Retour" : "Back to App"}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-bold font-mono text-purple-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                Gemini 2.5 Flash AI
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black font-display tracking-tight mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {isFrench ? "Académie Marketing Digital Gemini IA" : "Digital Marketing AI Academy"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className={isDark ? "text-slate-300" : "text-slate-600"}>
            {isFrench ? "Mode Apprentissage Actif" : "AI Course Generator Ready"}
          </span>
        </div>
      </div>

      {/* 1. Gemini AI Course Generator Section */}
      <div className={`rounded-2xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
        isDark 
          ? "bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border-indigo-500/40 shadow-2xl" 
          : "bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-lg"
      }`}>
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            {isFrench ? "Générateur de Cours IA Temps Réel" : "Real-time Gemini AI Course Engine"}
          </div>
          
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
            {isFrench ? "Créer un cours sur mesure en Marketing Digital" : "Generate a Custom Digital Marketing Course"}
          </h2>
          
          <p className={`text-xs sm:text-sm mb-6 leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700 font-medium"}`}>
            {isFrench 
              ? "Saisissez n'importe quel sujet de marketing digital (ex: TikTok Virality, Meta Ads ROAS, SEO IA). Notre intégration Gemini construira immédiatement un cours complet avec tuteur intelligent et quiz certifiants !"
              : "Type any digital marketing concept (e.g. TikTok Virality, Meta Ads ROAS, AI-Powered SEO). Gemini AI instantly creates a 3-chapter interactive course with an AI tutor and quizzes!"}
          </p>

          {/* Input Box */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !generating) {
                  handleGenerateCourse();
                }
              }}
              placeholder={
                isFrench 
                  ? "Ex: Stratégie TikTok Virale & Acquisition de Prospects 2026..." 
                  : "e.g. TikTok Viral Strategy & Lead Generation Funnels 2026..."
              }
              className={`flex-1 rounded-xl px-4 py-3.5 text-sm font-medium transition focus:outline-none ${
                isDark 
                  ? "bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                  : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
              }`}
            />
            
            <button
              onClick={() => handleGenerateCourse()}
              disabled={generating || !customTopic.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold font-sans cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 shrink-0"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isFrench ? "Génération avec Gemini..." : "Gemini Generating..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isFrench ? "Générer le Cours IA" : "Generate Course with AI"}</span>
                </>
              )}
            </button>
          </div>

          {/* Presets */}
          <div className="mt-6 pt-4 border-t border-purple-500/20">
            <span className={`text-xs font-bold block mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {isFrench ? "Ou choisissez un sujet populaire :" : "Or select a trending marketing topic:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomTopic(preset.title);
                    handleGenerateCourse(preset.title);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isDark 
                      ? "bg-slate-900/90 hover:bg-purple-900/50 border-slate-700 hover:border-purple-500 text-slate-200 hover:text-white" 
                      : "bg-white hover:bg-purple-100 border-purple-200 text-purple-900 shadow-sm hover:border-purple-400"
                  }`}
                >
                  <span>{isFrench ? preset.labelFr : preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {generateError && (
            <p className="text-xs text-rose-500 font-semibold mt-3 font-mono">{generateError}</p>
          )}
        </div>
      </div>

      {/* 2. Featured Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {isFrench ? "Parcours Certifiants Marketing Digital" : "Featured Digital Marketing Curriculums"}
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {isFrench ? "Cours validés avec assistance Gemini IA et certification" : "Verified curriculums with Gemini AI interactive tutoring"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className={`group rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                isDark 
                  ? "bg-slate-900/90 border-slate-800 hover:border-purple-500/50 shadow-xl" 
                  : "bg-white border-slate-200 hover:border-purple-400 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                    isDark 
                      ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" 
                      : "bg-purple-100 border border-purple-200 text-purple-800"
                  }`}>
                    {c.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 font-bold">
                    <Award className="w-4 h-4" />
                    <span>Gemini Tutor</span>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-2 group-hover:text-purple-500 transition-colors ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {c.title}
                </h3>

                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {c.description}
                </p>

                {/* Topic Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {c.topics.map((t, tidx) => (
                    <span
                      key={tidx}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium ${
                        isDark 
                          ? "bg-slate-950 border border-slate-800 text-slate-300" 
                          : "bg-slate-100 border border-slate-200 text-slate-700"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveCourse({ id: c.id })}
                className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFrench ? "Lancer le cours avec Gemini IA" : "Start Course with Gemini AI"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
