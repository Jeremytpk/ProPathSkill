import React, { useState } from "react";
import { 
  Palette, Sparkles, ArrowLeft, ArrowRight, Loader2, BookOpen, 
  Target, Zap, Flame, Award, Lightbulb, Play, Layers, CheckCircle2,
  Figma, Layout, Eye, Paintbrush, Monitor
} from "lucide-react";
import { motion } from "motion/react";
import { AICourseWorkspace } from "./AICourseWorkspace";

interface CreativeDesignCourseHubProps {
  onBack: () => void;
  language?: string;
  theme?: "dark" | "light";
}

const PRESET_TOPICS = [
  { label: "🎨 UI/UX Design Systems & Figma Tokens", labelFr: "🎨 Design Systems & Tokens Figma UI/UX", title: "UI/UX Design Systems & Figma Token Architecture" },
  { label: "🕶️ Spatial UI & Apple Vision Pro Ergonomics", labelFr: "🕶️ Design d'Interfaces Spatiales & Vision Pro", title: "Spatial UI Design & 3D Ergonomics for AR/VR" },
  { label: "🖌️ AI Generative Branding & Midjourney/Flux", labelFr: "🖌️ Branding IA & Prompts Artistiques Midjourney", title: "AI-Powered Brand Identity & Generative Design" },
  { label: "📱 Interactive Mobile Motion & Micro-Interactions", labelFr: "📱 Micro-interactions & Motion Design Mobile", title: "Mobile Motion Design & Interactive Micro-Interactions" },
  { label: "🌐 Immersive 3D Web & Interactive Canvas", labelFr: "🌐 Web 3D Immersif & Canvas Interactif WebGL", title: "Immersive 3D Web Interfaces & WebGL Canvas Design" }
];

export function CreativeDesignCourseHub({ onBack, language = "english", theme = "dark" }: CreativeDesignCourseHubProps) {
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
          industry: "Creative Digital Design & Spatial Interfaces",
          language: isFrench ? "french" : "english"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate course with Gemini AI");
      }

      const data = await response.json();
      if (data && data.title && data.chapters) {
        const fullCourse = {
          id: `gemini_cd_${Date.now()}`,
          ...data
        };
        setActiveCourse({ id: fullCourse.id, data: fullCourse });
      } else {
        throw new Error("Invalid course payload returned");
      }
    } catch (err: any) {
      console.warn("Gemini generation fallback engaged:", err);
      // Fallback: create a structured creative design course directly
      const fallbackCourse = {
        id: `gemini_cd_${Date.now()}`,
        title: title.startsWith("Design") || title.startsWith("UI/UX") ? title : `Creative Digital Design: ${title}`,
        industry: "Creative Digital Design & Spatial UI",
        aiTutorPersona: isFrench ? "Alexandre Mercier (Directeur Artistique & Designer Spatial UI)" : "Alexandre Mercier (Creative Director & Spatial UI Designer)",
        chapters: [
          {
            id: "ch1",
            title: isFrench ? `1. Fondations & Direction Artistique : ${title}` : `1. Foundations & Visual Direction: ${title}`,
            summary: isFrench ? "Maîtriser la hiérarchie visuelle, les systèmes de grilles et la psychologie des couleurs." : "Master visual hierarchy, grid alignment systems, and color psychology.",
            sections: [
              {
                title: isFrench ? "Composition Visuelle, Ratios & Ergonomie" : "Visual Composition, Ratios & UI Ergonomics",
                content: isFrench 
                  ? `Pour concevoir des interfaces d'exception dans ${title}, vous devez maîtriser la composition, l'espace négatif et les lois de la Gestalt. Une structure visuelle cohérente renforce la lisibilité et l'engagement utilisateur.`
                  : `To design world-class interfaces in ${title}, master grid layout, negative space, and Gestalt principles. Visual hierarchy lowers cognitive friction and directs user focus seamlessly.`
              }
            ],
            quiz: {
              question: isFrench ? "Quel principe de design permet de guider le regard de l'utilisateur vers les éléments prioritaires ?" : "Which design principle guides the user's eye directly to key call-to-actions?",
              options: [
                isFrench ? "La hiérarchie visuelle et le contraste" : "Visual hierarchy and contrast scaling",
                isFrench ? "Mettre l'ensemble du texte en gras et en rouge" : "Making all text bold and bright red",
                isFrench ? "Supprimer le contraste entre le fond et le texte" : "Removing background to text contrast",
                isFrench ? "Ignorer les marges et alignements" : "Ignoring margins and grid alignments"
              ],
              correctAnswer: 0,
              explanation: isFrench ? "La hiérarchie visuelle utilise la taille, le poids typographique et le contraste pour organiser l'information." : "Visual hierarchy uses typography scale and color contrast to establish information priorities."
            }
          },
          {
            id: "ch2",
            title: isFrench ? `2. Design Systems & Tokens de Composants` : `2. Scalable Design Systems & Component Tokens`,
            summary: isFrench ? "Créer des bibliothèques de composants Figma, des tokens réutilisables et des variantes interactives." : "Build modular Figma component libraries, automated token systems, and interactive variants.",
            sections: [
              {
                title: isFrench ? "Architecture de Design System & Auto Layout" : "Design System Architecture & Auto Layout Rules",
                content: isFrench 
                  ? "Découvrez l'art de créer des composants scalables. Structurez vos tokens de couleurs, typographies et espacements pour garantir la cohérence entre le design et le code frontend."
                  : "Master scalable component design. Structuring design tokens for color palettes, typography scales, and spatial padding bridges the gap between design and development."
              }
            ],
            quiz: {
              question: isFrench ? "Quel est le rôle principal d'un Design Token ?" : "What is the primary role of a Design Token?",
              options: [
                isFrench ? "Stocker des valeurs de design réutilisables (couleurs, espacements) partagées avec le code" : "Store reusable design variables (colors, spacing) synced with frontend code",
                isFrench ? "Payer les licences de logiciels graphiques" : "Pay software subscription licensing fees",
                isFrench ? "Animer des fichiers vidéo 4K" : "Render 4K background video streams",
                isFrench ? "Bloquer le téléchargement des images" : "Block image downloads on web browsers"
              ],
              correctAnswer: 0,
              explanation: isFrench ? "Les Design Tokens unifient la charte graphique entre Figma et les bibliothèques CSS." : "Design tokens serve as the single source of truth connecting UI design files to production codebase variables."
            }
          },
          {
            id: "ch3",
            title: isFrench ? `3. Prototypage, Spatial UI & Expériences Immersives` : `3. Prototyping, Spatial UI & Immersive Canvas`,
            summary: isFrench ? "Concevoir des interfaces 3D, maîtriser l'ergonomie spatiale et les transitions fluides." : "Design 3D spatial interfaces, spatial ergonomics, eye-tracking UI, and fluid motion transitions.",
            sections: [
              {
                title: isFrench ? "Spatial Computing & Ergonomie de Vision Spatiale" : "Spatial Computing Ergonomics & Depth Interfaces",
                content: isFrench 
                  ? "Explorez les nouvelles frontières du design spatial pour AR/VR et WebGL. Apprenez à gérer les plans de profondeur, les ombres dynamiques et les interactions au regard/geste."
                  : "Explore spatial computing UX boundaries for AR/VR and WebGL canvas design. Master depth layers, dynamic spatial lighting, eye-tracking interaction cues, and volumetric UI containers."
              }
            ],
            quiz: {
              question: isFrench ? "Quelle est la particularité essentielle des interfaces spatiales 3D (AR/VR) ?" : "What is a core characteristic of 3D spatial interfaces in AR/VR computing?",
              options: [
                isFrench ? "L'utilisation de la profondeur (Z-index réel), de l'éclairage ambiant et d'ancres spatiales" : "Leveraging physical depth layering, ambient lighting, and volumetric spatial anchors",
                isFrench ? "L'absence totale de couleur" : "The total absence of color palettes",
                isFrench ? "L'interdiction des polices typographiques" : "Banning all readable typography fonts",
                isFrench ? "L'obligation d'utiliser des écrans cathodiques" : "Requiring CRT television monitor displays"
              ],
              correctAnswer: 0,
              explanation: isFrench ? "Le design spatial intègre l'environnement physique avec de la profondeur 3D et des ombres réalistes." : "Spatial UI integrates physical user environments using real depth, volumetric scale, and realistic lighting shadows."
            }
          }
        ]
      };
      setActiveCourse({ id: fallbackCourse.id, data: fallbackCourse });
    } finally {
      setGenerating(false);
    }
  };

  // Pre-built Gemini Creative Design courses
  const featuredCourses = [
    {
      id: "creativedesign_native",
      badge: isFrench ? "Masterclass Fondations" : "Core Masterclass",
      title: isFrench ? "Design Numérique Créatif, Interfaces Spatiales & UI/UX" : "Creative Digital Design, Spatial UI & UX Architecture",
      description: isFrench 
        ? "Maîtrisez la hiérarchie visuelle, la théorie des couleurs, la conception responsive et l'ergonomie des interfaces spatiales 3D."
        : "Master visual hierarchy, responsive layout systems, color theory, and 3D spatial computing interface ergonomics.",
      topics: isFrench ? ["Design Numérique UI/UX", "Spatial UI & AR/VR", "Design Systems Figma"] : ["UI/UX Interface Design", "Spatial UI & AR/VR", "Figma Design Systems"]
    },
    {
      id: "ai_branding_design",
      badge: isFrench ? "Spécialisation IA" : "AI Specialization",
      title: isFrench ? "Design Graphique & Branding Assisté par l'IA" : "AI-Powered Graphic & Brand Identity Design",
      description: isFrench 
        ? "Créez des chartes graphiques captivantes, des maquettes 3D et des éléments visuels d'exception grâce à l'IA générative."
        : "Generate stunning brand identity guidelines, 3D product mockups, and high-impact visual assets with generative AI.",
      topics: isFrench ? ["Prompts Midjourney & Flux", "Branding & Logos IA", "Vector AI & Assets"] : ["Midjourney & Flux Prompts", "AI Brand Identity", "Vector AI & Assets"]
    },
    {
      id: "spatial_ui_mastery",
      badge: isFrench ? "Interfaces 3D & Immersif" : "3D & Immersive UX",
      title: isFrench ? "Interfaces Spatiales 3D, AR/VR & Ergonomie Vision Pro" : "Spatial UI, AR/VR Ergonomics & Immersive 3D Web",
      description: isFrench 
        ? "Concevez pour Apple Vision Pro et le Web3D : profondeur volumétrique, ombres spatiales et navigation par le regard."
        : "Design for Apple Vision Pro & Web3D canvas: volumetric depth, spatial lighting, and gaze-gesture navigation.",
      topics: isFrench ? ["Ergonomie Spatiale", "UI Volumétrique 3D", "Canvas WebGL & Three.js"] : ["Spatial UX Ergonomics", "Volumetric 3D UI", "WebGL Canvas & Three.js"]
    },
    {
      id: "design_system_engineering",
      badge: isFrench ? "Design System & Frontend" : "Design System & Tokens",
      title: isFrench ? "Design Systems, Tokens Figma & Micro-Interactions" : "Design System Architecture, Figma Tokens & Motion",
      description: isFrench 
        ? "Construisez des bibliothèques de composants Figma modulaires, des variables de tokens et des prototypes interactifs."
        : "Architect modular Figma component libraries, design token variables, and fluid motion micro-interactions.",
      topics: isFrench ? ["Tokens & Auto Layout", "Prototypes Interactifs", "Motion & Micro-interactions"] : ["Tokens & Auto Layout", "Interactive Prototypes", "Motion & Micro-Interactions"]
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-bold font-mono text-pink-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
                ProPath AI Engine
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black font-display tracking-tight mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {isFrench ? "Académie Design Numérique ProPath" : "Creative Digital Design Academy"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className={isDark ? "text-slate-300" : "text-slate-600"}>
            {isFrench ? "Mode Design Actif" : "AI Design Generator Ready"}
          </span>
        </div>
      </div>

      {/* 1. AI Course Generator Section */}
      <div className={`rounded-2xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
        isDark 
          ? "bg-gradient-to-br from-pink-950/80 via-slate-900 to-indigo-950/60 border-pink-500/40 shadow-2xl" 
          : "bg-gradient-to-br from-pink-50 via-white to-purple-50 border-pink-200 shadow-lg"
      }`}>
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            {isFrench ? "Création de Cours ProPath" : "ProPath Course Creation Engine"}
          </div>
          
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
            {isFrench ? "Créer un cours sur mesure en Design Numérique" : "Create a Custom Creative Design Course"}
          </h2>
          
          <p className={`text-xs sm:text-sm mb-6 leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700 font-medium"}`}>
            {isFrench 
              ? "Saisissez n'importe quel sujet de design numérique (ex: Design System Figma, Interfaces Spatiales Vision Pro, Branding Midjourney). Notre plateforme construira immédiatement un cours interactif complet avec mentor expert !"
              : "Type any creative design concept (e.g. Figma Design Systems, Vision Pro Spatial UI, Midjourney Brand Identity). Instantly creates an interactive 3-chapter course with expert guidance and quizzes!"}
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
                  ? "Ex: Design d'Interfaces Spatiales 3D & Design Systems Figma 2026..." 
                  : "e.g. Spatial UI 3D Interfaces & Figma Design Systems 2026..."
              }
              className={`flex-1 rounded-xl px-4 py-3.5 text-sm font-medium transition focus:outline-none ${
                isDark 
                  ? "bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500" 
                  : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 shadow-sm"
              }`}
            />
            
            <button
              onClick={() => handleGenerateCourse()}
              disabled={generating || !customTopic.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold font-sans cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 shrink-0"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isFrench ? "Préparation du cours..." : "Preparing Course..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isFrench ? "Créer le Cours" : "Create Course"}</span>
                </>
              )}
            </button>
          </div>

          {/* Presets */}
          <div className="mt-6 pt-4 border-t border-pink-500/20">
            <span className={`text-xs font-bold block mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {isFrench ? "Ou choisissez un sujet populaire :" : "Or select a trending design topic:"}
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
                      ? "bg-slate-900/90 hover:bg-pink-900/50 border-slate-700 hover:border-pink-500 text-slate-200 hover:text-white" 
                      : "bg-white hover:bg-pink-100 border-pink-200 text-pink-900 shadow-sm hover:border-pink-400"
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
            <div className={`p-2 rounded-xl ${isDark ? "bg-pink-500/20 text-pink-400" : "bg-pink-100 text-pink-700"}`}>
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {isFrench ? "Parcours Certifiants Design Numérique" : "Featured Creative Design Curriculums"}
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {isFrench ? "Formations d'excellence avec accompagnement interactif et certification" : "Verified curriculums with interactive learning and certification"}
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
                  ? "bg-slate-900/90 border-slate-800 hover:border-pink-500/50 shadow-xl" 
                  : "bg-white border-slate-200 hover:border-pink-400 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                    isDark 
                      ? "bg-pink-500/20 border border-pink-500/30 text-pink-300" 
                      : "bg-pink-100 border border-pink-200 text-pink-800"
                  }`}>
                    {c.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 font-bold">
                    <Award className="w-4 h-4" />
                    <span>ProPath Faculty</span>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-2 group-hover:text-pink-500 transition-colors ${
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
                className="mt-6 w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-pink-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFrench ? "Lancer le cours interactif" : "Start Interactive Course"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
