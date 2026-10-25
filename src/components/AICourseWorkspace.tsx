import React, { useEffect, useState, useRef } from "react";
import { getAICourse } from "../lib/firebase";
import { useAccount } from "../lib/account";
import { ExamPaywall } from "./Plans";
import { 
  BookOpen, Send, CheckCircle2, XCircle, Award, Sparkles, 
  ChevronRight, GraduationCap, X, MessageSquare, Loader2, RefreshCw,
  Lock, ArrowRight, ArrowLeft, Target, Zap, BarChart3, Layers, Lightbulb,
  TrendingUp, FileText, Check, Globe, Search, PieChart, ArrowUpRight, Activity, Minus,
  User, ShieldCheck, Printer, Share2, Edit3, Sliders, RotateCcw, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AICourseWorkspaceProps {
  courseId: string;
  initialCourseData?: any;
  onClose: () => void;
  language?: string;
  theme?: "dark" | "light";
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
}

// Visual Graphic & Diagram component for lesson sections
function CourseGraphicDiagram({ type, isDark, isFrench, title }: { type?: string; isDark: boolean; isFrench: boolean; title?: string }) {
  const diagType = (type || "").toLowerCase();

  // 1. Funnel Visual Graphic
  if (diagType.includes("funnel") || diagType.includes("entonnoir")) {
    return (
      <div className={`my-5 p-5 rounded-2xl border ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
          <div className="flex items-center gap-2">
            <Layers className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-indigo-400" : "text-indigo-700"}`}>
              {isFrench ? "📊 Graphique Visuel : Entonnoir de Conversion Modernisé" : "📊 Visual Graphic: Conversion Funnel Architecture"}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-800 border border-indigo-200"
          }`}>
            TOFU → MOFU → BOFU
          </span>
        </div>

        <div className="space-y-3">
          {/* TOFU */}
          <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
            isDark 
              ? "bg-gradient-to-r from-indigo-950/80 to-indigo-900/40 border-indigo-500/30" 
              : "bg-indigo-50/90 border-indigo-200 shadow-xs"
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                TOFU
              </span>
              <div>
                <h5 className={`text-xs font-bold ${isDark ? "text-indigo-200" : "text-indigo-950"}`}>
                  {isFrench ? "Sensibilisation (Top of Funnel)" : "Awareness (Top of Funnel)"}
                </h5>
                <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                  {isFrench ? "Attirer du trafic qualifié via SEO, contenu pilier & réseaux sociaux." : "Drive high-intent discovery via SEO pillars, short-form video & organic content."}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold shrink-0 self-start md:self-center ${
              isDark ? "bg-indigo-500/30 text-indigo-200" : "bg-indigo-100 text-indigo-900 border border-indigo-300"
            }`}>
              100k+ {isFrench ? "Impressions" : "Impressions"}
            </span>
          </div>

          <div className="flex justify-center -my-1">
            <ArrowRight className={`w-4 h-4 rotate-90 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          </div>

          {/* MOFU */}
          <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
            isDark 
              ? "bg-gradient-to-r from-purple-950/80 to-purple-900/40 border-purple-500/30" 
              : "bg-purple-50/90 border-purple-200 shadow-xs"
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                MOFU
              </span>
              <div>
                <h5 className={`text-xs font-bold ${isDark ? "text-purple-200" : "text-purple-950"}`}>
                  {isFrench ? "Évaluation & Intérêt (Middle of Funnel)" : "Consideration & Interest (Middle of Funnel)"}
                </h5>
                <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                  {isFrench ? "Nourrir les prospects avec des études de cas, newsletters & guides gratuits." : "Nurture prospects with case studies, lead magnets, and retargeting ads."}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold shrink-0 self-start md:self-center ${
              isDark ? "bg-purple-500/30 text-purple-200" : "bg-purple-100 text-purple-900 border border-purple-300"
            }`}>
              15k {isFrench ? "Prospects Qualifiés" : "Engaged Leads"}
            </span>
          </div>

          <div className="flex justify-center -my-1">
            <ArrowRight className={`w-4 h-4 rotate-90 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>

          {/* BOFU */}
          <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
            isDark 
              ? "bg-gradient-to-r from-emerald-950/80 to-emerald-900/40 border-emerald-500/30" 
              : "bg-emerald-50/90 border-emerald-200 shadow-xs"
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                BOFU
              </span>
              <div>
                <h5 className={`text-xs font-bold ${isDark ? "text-emerald-200" : "text-emerald-950"}`}>
                  {isFrench ? "Conversion & Fidélisation (Bottom of Funnel)" : "Conversion & Loyalty (Bottom of Funnel)"}
                </h5>
                <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                  {isFrench ? "Convertir en acheteurs actifs et maximiser la valeur à vie (LTV)." : "Convert into active customers with high-converting offers & onboarding."}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold shrink-0 self-start md:self-center ${
              isDark ? "bg-emerald-500/30 text-emerald-200" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
            }`}>
              2.4k+ {isFrench ? "Clients (Ratio 2,4%)" : "Customers (2.4% Conv)"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. SEO Topic Cluster Visual Graphic
  if (diagType.includes("seo")) {
    return (
      <div className={`my-5 p-5 rounded-2xl border ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
          <div className="flex items-center gap-2">
            <Globe className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
              {isFrench ? "🌐 Schéma Visuel SEO : Architecture en Grappe de Contenu" : "🌐 Visual Graphic: Topic Cluster Architecture"}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            Schema.org + Internal Linking
          </span>
        </div>

        <div className={`relative p-4 rounded-xl border flex flex-col items-center gap-4 ${
          isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          {/* Central Pillar Node */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 text-center max-w-md w-full border border-indigo-400/30">
            <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-100 mb-0.5">
              {isFrench ? "PAGE PILIER PRINCIPALE" : "CORNERSTONE PILLAR PAGE"}
            </div>
            <div>{isFrench ? "Guide Ultime du Domaine (Autorité Sémantique Forte)" : "Ultimate Master Guide (High Topical Authority)"}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900 border-indigo-500/30" : "bg-white border-indigo-200 shadow-xs"
            }`}>
              <span className={`text-[9px] font-mono font-bold block mb-1 ${isDark ? "text-indigo-400" : "text-indigo-700"}`}>CLUSTER 1</span>
              <p className={`text-[11px] font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{isFrench ? "Recherche d'Intention & Longue Traîne" : "Intent Keyword Mapping & Long-Tail"}</p>
            </div>
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900 border-purple-500/30" : "bg-white border-purple-200 shadow-xs"
            }`}>
              <span className={`text-[9px] font-mono font-bold block mb-1 ${isDark ? "text-purple-400" : "text-purple-700"}`}>CLUSTER 2</span>
              <p className={`text-[11px] font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{isFrench ? "Maillage Interne & Balisage Schema" : "Internal Link Equity & Schema Markup"}</p>
            </div>
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900 border-emerald-500/30" : "bg-white border-emerald-200 shadow-xs"
            }`}>
              <span className={`text-[9px] font-mono font-bold block mb-1 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>CLUSTER 3</span>
              <p className={`text-[11px] font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{isFrench ? "Indexation & Optimisation IA (AEO)" : "AI Search Summary Indexing (AEO)"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. AIDA Matrix Copywriting Graphic
  if (diagType.includes("aida") || diagType.includes("copy")) {
    return (
      <div className={`my-5 p-5 rounded-2xl border ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
          <div className="flex items-center gap-2">
            <FileText className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-700"}`}>
              {isFrench ? "📝 Graphique Visuel : Matrice de Copywriting Persuasif AIDA" : "📝 Visual Graphic: AIDA Copywriting Matrix"}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}>
            Attention → Intérêt → Désir → Action
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? "bg-amber-950/30 border-amber-500/30" : "bg-amber-50 border-amber-200"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">A</span>
              <h5 className={`text-xs font-bold ${isDark ? "text-amber-300" : "text-amber-950"}`}>{isFrench ? "Attention (L'Accroche)" : "Attention (The Hook)"}</h5>
            </div>
            <p className={`text-[11px] italic ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              "{isFrench ? "Arrêtez de gaspiller votre budget. Voici la formule à 4.2x ROAS en 14 jours." : "Stop losing buyers at checkout. Here is the 3-step friction fix."}"
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? "bg-indigo-950/30 border-indigo-500/30" : "bg-indigo-50 border-indigo-200"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white font-black text-xs flex items-center justify-center">I</span>
              <h5 className={`text-xs font-bold ${isDark ? "text-indigo-300" : "text-indigo-950"}`}>{isFrench ? "Intérêt (Le Problème)" : "Interest (The Friction)"}</h5>
            </div>
            <p className={`text-[11px] italic ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              "{isFrench ? "80% des clients abandonnent leur panier à cause de frais cachés non clarifiés." : "80% of cart drop-offs are caused by unexpected delivery fee breakdowns."}"
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? "bg-purple-950/30 border-purple-500/30" : "bg-purple-50 border-purple-200"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded bg-purple-600 text-white font-black text-xs flex items-center justify-center">D</span>
              <h5 className={`text-xs font-bold ${isDark ? "text-purple-300" : "text-purple-950"}`}>{isFrench ? "Désir (Preuve Sociale)" : "Desire (Social Proof)"}</h5>
            </div>
            <p className={`text-[11px] italic ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              "{isFrench ? "Plus de 12 000 marques ont augmenté leurs revenus de 34% sans budget supplémentaire." : "Over 12,000 growth teams scaled monthly revenue by 34% in 30 days."}"
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? "bg-emerald-950/30 border-emerald-500/30" : "bg-emerald-50 border-emerald-200"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded bg-emerald-600 text-white font-black text-xs flex items-center justify-center">A</span>
              <h5 className={`text-xs font-bold ${isDark ? "text-emerald-300" : "text-emerald-950"}`}>{isFrench ? "Action (CTA Clair)" : "Action (Clear CTA)"}</h5>
            </div>
            <p className={`text-[11px] italic ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              "{isFrench ? "Essayez gratuitement pendant 14 jours — sans carte de crédit requise." : "Start your 14-day free trial today — zero credit card required."}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. ROAS & Unit Economics Graphic
  if (diagType.includes("roas") || diagType.includes("metric") || diagType.includes("formula")) {
    return (
      <div className={`my-5 p-5 rounded-2xl border ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
          <div className="flex items-center gap-2">
            <BarChart3 className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
              {isFrench ? "📈 Graphique Visuel : Formule d'Économie Unitaire & ROAS" : "📈 Visual Graphic: Unit Economics & ROAS Equation"}
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            Benchmark Target Ratio: 3 : 1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-4 rounded-xl border ${
            isDark ? "bg-slate-950/80 border-emerald-500/30" : "bg-emerald-50/70 border-emerald-200"
          }`}>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-1 ${
              isDark ? "text-emerald-400" : "text-emerald-800"
            }`}>
              {isFrench ? "FORMULE DU ROAS" : "ROAS EQUATION"}
            </span>
            <div className={`text-xs font-mono font-bold mb-2 p-2 rounded border text-center ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-emerald-200 text-emerald-950"
            }`}>
              ROAS = {isFrench ? "Revenu Publicitaire / Dépense Publicitaire" : "Ad Revenue / Total Ad Spend"}
            </div>
            <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              {isFrench ? "Exemple : 45 000 $ générés pour 10 000 $ investis = ROAS de 4,5x (450%)." : "Example: $45,000 ad revenue from $10,000 spend = 4.5x ROAS (450% Return)."}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? "bg-slate-950/80 border-indigo-500/30" : "bg-indigo-50/70 border-indigo-200"
          }`}>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-1 ${
              isDark ? "text-indigo-400" : "text-indigo-800"
            }`}>
              {isFrench ? "RATIO DE RENTABILITÉ LTV / CAC" : "TARGET LTV : CAC BENCHMARK"}
            </span>
            <div className={`text-xs font-mono font-bold mb-2 p-2 rounded border text-center ${
              isDark ? "bg-slate-900 border-slate-800 text-indigo-300" : "bg-white border-indigo-200 text-indigo-950"
            }`}>
              LTV : CAC ≥ 3 : 1
            </div>
            <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
              {isFrench ? "Exemple : LTV de 900 $ pour un CAC de 250 $ = Ratio de 3,6x (Modèle scalable et rentable)." : "Example: Customer LTV of $900 vs CAC of $250 = 3.6x Ratio (Highly profitable & scale-ready)."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. Default Universal Process Flow Graphic
  return (
    <div className={`my-5 p-5 rounded-2xl border ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-indigo-400" : "text-indigo-700"}`}>
            {isFrench ? "⚙️ Graphique Visuel : Flux d'Exécution & Méthodologie" : "⚙️ Visual Graphic: Step-by-Step Execution Workflow"}
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
          isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-800 border border-indigo-200"
        }`}>
          Step-by-Step Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        <div className={`p-3.5 rounded-xl border ${
          isDark ? "bg-slate-950/70 border-indigo-500/30" : "bg-indigo-50/70 border-indigo-200"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            <h5 className={`text-xs font-bold ${isDark ? "text-indigo-300" : "text-indigo-950"}`}>{isFrench ? "Diagnostic & Analyse" : "Audit & Strategy"}</h5>
          </div>
          <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            {isFrench ? "Identifier les objectifs, cartographier les contraintes et analyser l'écosystème." : "Identify baseline requirements, map pain points, and define strategic core targets."}
          </p>
        </div>

        <div className={`p-3.5 rounded-xl border ${
          isDark ? "bg-slate-950/70 border-purple-500/30" : "bg-purple-50/70 border-purple-200"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
            <h5 className={`text-xs font-bold ${isDark ? "text-purple-300" : "text-purple-950"}`}>{isFrench ? "Déploiement & Éxecution" : "Execution & Testing"}</h5>
          </div>
          <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            {isFrench ? "Mettre en œuvre les protocoles, exécuter les tests A/B et valider les étapes." : "Implement practical protocols, run iterative tests, and refine execution."}
          </p>
        </div>

        <div className={`p-3.5 rounded-xl border ${
          isDark ? "bg-slate-950/70 border-emerald-500/30" : "bg-emerald-50/70 border-emerald-200"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            <h5 className={`text-xs font-bold ${isDark ? "text-emerald-300" : "text-emerald-950"}`}>{isFrench ? "Optimisation & Échelle" : "Scale & Optimization"}</h5>
          </div>
          <p className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
            {isFrench ? "Mesurer les performances réelles, ajuster les processus et automatiser la croissance." : "Measure real-world impact, standardize quality metrics, and automate scaling."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AICourseWorkspace({ courseId, initialCourseData, onClose, language = "english", theme = "dark" }: AICourseWorkspaceProps) {
  const isFrench = language.toLowerCase() === "french";
  const isDark = theme === "dark";

  // Progress is restored from and saved to the learner's account automatically.
  const { progress, updateProgress, entitlements, authedFetch } = useAccount();
  const [showExamPaywall, setShowExamPaywall] = useState(false);
  const saved = progress.courses[courseId];
  const startingCourse = initialCourseData || saved?.course || null;

  const [course, setCourse] = useState<any | null>(startingCourse);
  const [loading, setLoading] = useState(!startingCourse);
  const [activeChapterIndex, setActiveChapterIndex] = useState(saved?.lastChapter ?? 0);

  // Quiz states (for each chapter index)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() =>
    Object.fromEntries(Object.entries(saved?.answers || {}).map(([k, v]) => [Number(k), v]))
  );
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(Object.keys(saved?.answers || {}).map((k) => [Number(k), true]))
  );

  const lastSavedSignature = useRef("");
  useEffect(() => {
    const chapters: any[] = course?.chapters || [];
    if (!chapters.length) return;
    const answers: Record<string, number> = {};
    const passed: number[] = [];
    chapters.forEach((chap, idx) => {
      if (!submittedAnswers[idx] || selectedAnswers[idx] === undefined) return;
      answers[String(idx)] = selectedAnswers[idx];
      const correct = typeof chap?.quiz?.correctIndex === "number" ? chap.quiz.correctIndex : chap?.quiz?.correctAnswer ?? 0;
      if (selectedAnswers[idx] === correct) passed.push(idx);
    });
    const signature = JSON.stringify([activeChapterIndex, answers]);
    if (signature === lastSavedSignature.current) return;
    lastSavedSignature.current = signature;
    // Generated courses exist nowhere else, so keep a copy to reopen them later.
    const keepCopy = Boolean(initialCourseData) || courseId.startsWith("gen_");
    updateProgress((p) => {
      const prev = p.courses[courseId];
      const complete = passed.length === chapters.length;
      return {
        ...p,
        courses: {
          ...p.courses,
          [courseId]: {
            title: course.title,
            startedAt: prev?.startedAt || new Date().toISOString(),
            lastChapter: activeChapterIndex,
            answers,
            passed,
            totalChapters: chapters.length,
            completedAt: complete ? prev?.completedAt || new Date().toISOString() : undefined,
            ...(keepCopy ? { course } : {}),
          },
        },
      };
    });
  }, [course, activeChapterIndex, submittedAnswers, selectedAnswers]);

  // Mini Quiz states (keyed by `${chapterIndex}_mini_${secIdx}`)
  const [miniQuizSelected, setMiniQuizSelected] = useState<Record<string, number>>({});
  const [miniQuizSubmitted, setMiniQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectMiniOption = (key: string, optionIdx: number) => {
    if (miniQuizSubmitted[key]) return;
    setMiniQuizSelected(prev => ({ ...prev, [key]: optionIdx }));
  };

  const handleSubmitMiniQuiz = (key: string) => {
    if (miniQuizSelected[key] === undefined) return;
    setMiniQuizSubmitted(prev => ({ ...prev, [key]: true }));
  };
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadTutorMsg, setHasUnreadTutorMsg] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Certificate & Student Information Modal States
  const [showCertificate, setShowCertificate] = useState(false);
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdminEditingCert, setIsAdminEditingCert] = useState(false);

  const [studentInfo, setStudentInfo] = useState<{
    fullName: string;
    email: string;
    title: string;
    organization: string;
    country: string;
    studentId: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("propath_student_info");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      fullName: "",
      email: "",
      title: "",
      organization: "ProPath Academy of Growth",
      country: "",
      studentId: `PPS-${Math.floor(100000 + Math.random() * 900000)}`
    };
  });

  const [certCustomData, setCertCustomData] = useState({
    fullName: "",
    title: "",
    organization: "",
    studentId: "",
    courseTitle: "",
    issueDate: "",
    boardPresident: "ProPath Learning School",
    boardPresidentTitle: "",
    facultyMentor: "",
    facultyMentorTitle: "",
    citationText: ""
  });

  useEffect(() => {
    setCertCustomData(prev => ({
      fullName: prev.fullName || studentInfo.fullName || "Student Full Name",
      title: prev.title || studentInfo.title || (isFrench ? "Spécialiste Certifié" : "Certified Specialist"),
      organization: prev.organization || studentInfo.organization || (isFrench ? "ProPath Académie Mondiale d'Excellence" : "ProPath Global Academy of Vocational Excellence"),
      studentId: prev.studentId || studentInfo.studentId || `PPS-${Math.floor(100000 + Math.random() * 900000)}`,
      courseTitle: prev.courseTitle || course?.title || "",
      issueDate: prev.issueDate || new Date().toLocaleDateString(isFrench ? "fr-FR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      boardPresident: prev.boardPresident || "ProPath Learning School",
      boardPresidentTitle: prev.boardPresidentTitle || (isFrench ? "Président du Conseil Académique" : "ProPath Academic Board President"),
      facultyMentor: prev.facultyMentor || course?.aiTutorPersona || (isFrench ? "Tuteur ProPath" : "ProPath Tutor"),
      facultyMentorTitle: prev.facultyMentorTitle || (isFrench ? "Mentor Pédagogique Qualifié" : "Certified Faculty AI Mentor"),
      citationText: prev.citationText || (isFrench 
        ? "En reconnaissance de la validation intégrale des modules de formation, des examens théoriques, des études de cas pratiques et de la maîtrise professionnelle démontrée dans le programme :" 
        : "For exceptional performance and successful completion of all core syllabus requirements, practical case studies, and final examination modules in:")
    }));
  }, [course, studentInfo, isFrench]);

  const handleResetCertDefaults = () => {
    setCertCustomData({
      fullName: studentInfo.fullName || "Student Full Name",
      title: studentInfo.title || (isFrench ? "Spécialiste Certifié" : "Certified Specialist"),
      organization: isFrench ? "ProPath Académie Mondiale d'Excellence" : "ProPath Global Academy of Vocational Excellence",
      studentId: `PPS-${Math.floor(100000 + Math.random() * 900000)}`,
      courseTitle: course?.title || "",
      issueDate: new Date().toLocaleDateString(isFrench ? "fr-FR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      boardPresident: "ProPath Learning School",
      boardPresidentTitle: isFrench ? "Président du Conseil Académique" : "ProPath Academic Board President",
      facultyMentor: course?.aiTutorPersona || (isFrench ? "Tuteur ProPath" : "ProPath Tutor"),
      facultyMentorTitle: isFrench ? "Mentor Pédagogique Qualifié" : "Certified Faculty AI Mentor",
      citationText: isFrench 
        ? "En reconnaissance de la validation intégrale des modules de formation, des examens théoriques, des études de cas pratiques et de la maîtrise professionnelle démontrée dans le programme :" 
        : "For exceptional performance and successful completion of all core syllabus requirements, practical case studies, and final examination modules in:"
    });
  };

  const handleOpenAdminCertEditor = () => {
    setIsAdminEditingCert(true);
    setShowCertificate(true);
  };

  const handleClaimCertificateClick = () => {
    // The exam and certificate of ProPath AI courses are paid.
    if (!entitlements.has(`exam_${courseId}`)) {
      setShowExamPaywall(true);
      return;
    }
    if (!studentInfo.fullName || !studentInfo.fullName.trim()) {
      setShowStudentInfoModal(true);
    } else {
      setShowCertificate(true);
    }
  };

  const handleSaveStudentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInfo.fullName.trim()) return;
    try {
      localStorage.setItem("propath_student_info", JSON.stringify(studentInfo));
    } catch (err) {
      console.error(err);
    }
    setShowStudentInfoModal(false);
    setShowCertificate(true);
  };

  useEffect(() => {
    async function loadCourse() {
      const preset = initialCourseData || saved?.course;
      if (preset) {
        setCourse(preset);
        setChatMessages([
          {
            id: "msg_welcome",
            sender: "tutor",
            text: isFrench
              ? `Bonjour ! Je suis ${preset.aiTutorPersona || "votre tuteur"}. Bienvenue dans le cours "${preset.title}". Posez-moi vos questions sur chaque chapitre.`
              : `Hello! I'm ${preset.aiTutorPersona || "your tutor"}. Welcome to "${preset.title}". Ask me anything about each chapter.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let actualCourseId = courseId;
        if (isFrench && courseId === "digital_marketing_native") {
          actualCourseId = "digital_marketing_native_fr";
        }
        let data = await getAICourse(actualCourseId);
        if (!data && actualCourseId !== courseId) {
          data = await getAICourse(courseId);
        }
        if (!data) {
          data = getBuiltInCourse(actualCourseId || courseId, isFrench);
        }
        if (data) {
          setCourse(data);
          // Set initial chat message from tutor persona
          setChatMessages([
            {
              id: "msg_welcome",
              sender: "tutor",
              text: isFrench 
                ? `Bonjour ! Je suis ${data.aiTutorPersona || "votre mentor de cours"}. Bienvenue dans le cours "${data.title}". Je suis là pour vous aider à comprendre chaque chapitre et répondre à vos questions en temps réel. Quel sujet souhaitez-vous aborder en premier ?`
                : `Hello! I am ${data.aiTutorPersona || "your course mentor"}. Welcome to the "${data.title}" course. I am here to help you understand each chapter and answer your questions in real-time. What topic would you like to discuss first?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading course:", err);
        const fallback = getBuiltInCourse(courseId, isFrench);
        setCourse(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId, initialCourseData, isFrench]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="text-indigo-500 mb-4"
        >
          <RefreshCw className="w-10 h-10" />
        </motion.div>
        <h3 className="text-sm font-semibold text-slate-300 animate-pulse font-mono uppercase tracking-widest">
          {isFrench ? "Chargement du Campus Virtuel..." : "Synchronizing Virtual Campus..."}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {isFrench ? "Génération du plan d'apprentissage assisté par l'IA..." : "Loading custom AI lesson assets..."}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <div className="p-3 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 mb-4">
          <X className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">
          {isFrench ? "Cours Introuvable" : "Course Not Found"}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
          {isFrench 
            ? "Ce cours interactif n'a pas pu être chargé depuis le registre sécurisé." 
            : "The selected interactive course registry record could not be loaded."}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 transition"
        >
          {isFrench ? "Fermer l'Espace de Cours" : "Close Learning Workspace"}
        </button>
      </div>
    );
  }

  const chapters = course.chapters || [];
  const activeChapter = chapters[activeChapterIndex];
  const chaptersCount = chapters.length;

  // Helper to resolve the correct answer index from quiz data safely
  const getCorrectAnswerIndex = (chap: any): number => {
    if (!chap?.quiz) return 0;
    if (typeof chap.quiz.correctIndex === "number") return chap.quiz.correctIndex;
    if (typeof chap.quiz.correctAnswer === "number") return chap.quiz.correctAnswer;
    return 0;
  };

  // Helper to check if a chapter's quiz has been passed
  const isChapterPassed = (chIdx: number): boolean => {
    const chap = chapters[chIdx];
    if (!chap || !submittedAnswers[chIdx]) return false;
    const correctIdx = getCorrectAnswerIndex(chap);
    return selectedAnswers[chIdx] === correctIdx;
  };

  // Sequential progression gate:
  // Chapter 0 (Chapter 1) is unlocked by default.
  // Chapter N (N > 0) is unlocked ONLY when Chapter N-1 is passed.
  const isChapterUnlocked = (chIdx: number): boolean => {
    if (chIdx <= 0) return true;
    for (let i = 0; i < chIdx; i++) {
      if (!isChapterPassed(i)) return false;
    }
    return true;
  };

  // Count total passed chapters in course
  const correctAnswersCount = chapters.reduce((acc: number, _, idx: number) => {
    return acc + (isChapterPassed(idx) ? 1 : 0);
  }, 0);

  const isCourseComplete = chaptersCount > 0 && correctAnswersCount === chaptersCount;

  const handleSelectChapter = (idx: number) => {
    if (!isChapterUnlocked(idx)) return;
    setActiveChapterIndex(idx);
    const contentArea = document.getElementById("lesson-content-scroll");
    if (contentArea) contentArea.scrollTop = 0;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (submittedAnswers[activeChapterIndex]) return; // locked
    setSelectedAnswers(prev => ({ ...prev, [activeChapterIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswers[activeChapterIndex] === undefined) return;
    setSubmittedAnswers(prev => ({ ...prev, [activeChapterIndex]: true }));
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || sendingQuestion) return;

    const userMsgText = questionInput.trim();
    setQuestionInput("");
    
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setSendingQuestion(true);

    try {
      const response = await authedFetch("/api/ask-tutor", {
        method: "POST",
        body: JSON.stringify({
          question: userMsgText,
          courseContext: {
            courseTitle: course.title,
            currentChapterTitle: activeChapter?.title,
            currentChapterContent: [
              activeChapter?.summary,
              ...(activeChapter?.sections || []).map((s: any) =>
                [s.title, s.content, ...(s.keyPoints || [])].filter(Boolean).join("\n")
              ),
            ].filter(Boolean).join("\n\n")
          },
          tutorPersona: course.aiTutorPersona || "Socrates",
          chatHistory: chatMessages.slice(-5), // Send last 5 messages for conversation context
          language: isFrench ? "french" : "english"
        })
      });

      if (response.ok) {
        const data = await response.json();
        const tutorMsg: ChatMessage = {
          id: `msg_${Date.now()}_tutor`,
          sender: "tutor",
          text: data.response || (isFrench ? "Je m'excuse, je n'ai pas pu formuler ma réponse." : "I apologize, I was unable to formulate a response."),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, tutorMsg]);
      } else {
        throw new Error("Tutor API failed");
      }
    } catch (err) {
      console.error("Ask tutor error:", err);
      const errMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        sender: "tutor",
        text: isFrench 
          ? "Désolé, je rencontre des difficultés techniques pour me connecter. Veuillez relire le cours !" 
          : "Apologies, I am experiencing temporary connectivity challenges. Please review the lesson details above!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setSendingQuestion(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <ExamPaywall
        open={showExamPaywall}
        onClose={() => setShowExamPaywall(false)}
        courseId={courseId}
        courseTitle={course.title}
        language={isFrench ? "french" : "english"}
      />
      {/* LEFT CONTENT AREA: Lesson text & Chapter Quizzes */}
      <div 
        id="lesson-content-scroll"
        className={`flex-1 flex flex-col h-full overflow-y-auto border-r ${
          isDark ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-slate-50"
        }`}
      >
        
        {/* Workspace Subheader / Navigation */}
        <div className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between sticky top-0 backdrop-blur-md z-20 ${
          isDark ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200 shadow-xs"
        }`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                isDark 
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white" 
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs"
              }`}
              title={isFrench ? "Retour au Hub de Cours / Tableau de Bord" : "Back to Course Hub / Dashboard"}
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span className="font-bold">{isFrench ? "Retour au Hub" : "Back to Hub"}</span>
            </button>

            <div className={`p-2 rounded-xl border hidden sm:flex ${
              isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200"
            }`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-wider block font-bold ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}>
                {isFrench ? "Campus Privé ProPathSkill" : "ProPathSkill Private Campus"}
              </span>
              <h2 className={`text-xs sm:text-sm font-black truncate max-w-[140px] sm:max-w-xs md:max-w-md font-display ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {course.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsChatOpen(prev => !prev);
                setHasUnreadTutorMsg(false);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer relative ${
                isChatOpen
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : isDark 
                    ? "border-slate-800 text-indigo-400 hover:text-white hover:bg-slate-800" 
                    : "border-slate-300 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 shadow-xs"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">
                {isFrench ? "Assistant de Cours" : "Course Assistant"}
              </span>
              {hasUnreadTutorMsg && !isChatOpen && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isDark 
                  ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                  : "border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Tracker Banner */}
        <div className={`px-6 py-3.5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? "bg-indigo-600/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className={`text-xs font-mono ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {isFrench ? "Progression du Curriculum :" : "Curriculum Syllabus Progress:"}{" "}
              <strong className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>{correctAnswersCount} / {chaptersCount}</strong>{" "}
              {isFrench ? "quiz réussis" : "quizzes passed"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isCourseComplete ? (
              <button
                onClick={handleClaimCertificateClick}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition animate-bounce cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isFrench ? "Réclamer le Certificat" : "Claim AI Certificate"}</span>
              </button>
            ) : (
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border hidden sm:inline-block ${
                isDark 
                  ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
                  : "text-indigo-700 bg-indigo-100 border-indigo-200"
              }`}>
                {isFrench ? "Passez chaque quiz pour débloquer le chapitre suivant" : "Pass each chapter test to unlock the next chapter"}
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 sm:p-6 max-w-4xl w-full mx-auto space-y-4 sm:space-y-6 flex-1">
          {/* Chapter Selector Tabs with Sequential Locking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {chapters.map((chap: any, idx: number) => {
              const isActive = activeChapterIndex === idx;
              const unlocked = isChapterUnlocked(idx);
              const correctIdx = getCorrectAnswerIndex(chap);
              const isPassed = submittedAnswers[idx] && selectedAnswers[idx] === correctIdx;
              const isWrong = submittedAnswers[idx] && selectedAnswers[idx] !== correctIdx;

              let cardStyle = "";
              if (!unlocked) {
                cardStyle = isDark 
                  ? "bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed opacity-60" 
                  : "bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-60";
              } else if (isActive) {
                cardStyle = isDark 
                  ? "bg-slate-900 border-indigo-500 text-white shadow-md shadow-indigo-500/10" 
                  : "bg-white border-indigo-500 text-slate-900 shadow-md ring-1 ring-indigo-500";
              } else {
                cardStyle = isDark 
                  ? "bg-slate-900/40 border-slate-900 hover:bg-slate-900 text-slate-400 hover:text-slate-200" 
                  : "bg-white/70 border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900";
              }

              return (
                <button
                  key={chap.id || idx}
                  disabled={!unlocked}
                  onClick={() => handleSelectChapter(idx)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col relative ${cardStyle}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                      {isFrench ? `Chapitre ${idx + 1}` : `Chapter ${idx + 1}`}
                    </span>
                    {!unlocked && <Lock className="w-3 h-3 text-amber-500/70 shrink-0" />}
                  </div>

                  <span className="text-[11px] font-semibold truncate mt-1 block">
                    {chap.title}
                  </span>

                  <span className="mt-2 flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider">
                    {!unlocked ? (
                      <span className="text-amber-500/70 flex items-center gap-1">
                        {isFrench ? "VERROUILLÉ" : "LOCKED"}
                      </span>
                    ) : isPassed ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {isFrench ? "RÉUSSI" : "PASSED"}
                      </span>
                    ) : isWrong ? (
                      <span className="text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {isFrench ? "ÉCHOUÉ" : "FAILED"}
                      </span>
                    ) : (
                      <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                        {isFrench ? "EN COURS" : "IN PROGRESS"}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Text Container */}
          <div className={`rounded-3xl p-6 md:p-8 space-y-6 border ${
            isDark 
              ? "bg-slate-900/80 border-slate-800 text-slate-200 shadow-xl" 
              : "bg-white border-slate-200 text-slate-800 shadow-md"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest rounded-md border ${
                isDark 
                  ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
                  : "text-indigo-700 bg-indigo-50 border-indigo-200"
              }`}>
                {isFrench ? `Syllabus du Chapitre ${activeChapterIndex + 1}` : `Chapter ${activeChapterIndex + 1} Lesson`}
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {course.aiTutorPersona || "ProPath Faculty Advisor"}
              </span>
            </div>

            <h3 className={`text-lg md:text-xl font-bold font-display ${isDark ? "text-white" : "text-slate-900"}`}>
              {activeChapter?.title}
            </h3>

            {/* Lesson Body */}
            <div className={`text-xs md:text-sm leading-relaxed space-y-5 font-normal ${
              isDark ? "text-slate-200" : "text-slate-700"
            }`}>
              {/* Summary callout if available */}
              {activeChapter?.summary && (
                <div className={`p-4 rounded-xl border font-medium ${
                  isDark 
                    ? "bg-indigo-950/40 border-indigo-800/60 text-indigo-200" 
                    : "bg-indigo-50/80 border-indigo-200 text-indigo-900"
                }`}>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-indigo-500">
                    {isFrench ? "🎯 Objectif & Aperçu du Chapitre" : "🎯 Chapter Objective & Key Takeaways"}
                  </span>
                  <p>{activeChapter.summary}</p>
                </div>
              )}

              {/* Sections list */}
              {Array.isArray(activeChapter?.sections) && activeChapter.sections.length > 0 ? (
                <div className="space-y-8 pt-2">
                  {activeChapter.sections.map((sec: any, secIdx: number) => {
                    // Auto-determine diagram type if not specified
                    const secTitleLower = (sec.title || "").toLowerCase();
                    const secContentLower = (sec.content || "").toLowerCase();
                    let diagramType = sec.diagramType || "";
                    if (!diagramType) {
                      if (secTitleLower.includes("funnel") || secTitleLower.includes("entonnoir") || secContentLower.includes("tofu")) diagramType = "funnel";
                      else if (secTitleLower.includes("seo") || secTitleLower.includes("search") || secContentLower.includes("cluster")) diagramType = "seo";
                      else if (secTitleLower.includes("copywriting") || secTitleLower.includes("aida") || secContentLower.includes("accroche")) diagramType = "aida";
                      else if (secTitleLower.includes("roas") || secTitleLower.includes("cac") || secTitleLower.includes("ltv") || secContentLower.includes("metric")) diagramType = "roas";
                      else diagramType = "process_flow";
                    }

                    return (
                      <div key={secIdx} className="space-y-6">
                        <div 
                          className={`p-5 md:p-6 rounded-2xl border transition-all ${
                            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                        {/* Section Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h4 className={`text-base md:text-lg font-bold flex items-center gap-2.5 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-indigo-500/30">
                              {secIdx + 1}
                            </span>
                            <span>{sec.title}</span>
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            isDark ? "bg-indigo-950/60 border-indigo-800 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-700"
                          }`}>
                            {isFrench ? "Module Théorie & Pratique" : "Theory & Applied Practice"}
                          </span>
                        </div>

                        {/* Detailed Paragraph Content */}
                        <div className={`text-xs md:text-sm leading-relaxed space-y-3 whitespace-pre-line ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                          {sec.content}
                        </div>

                        {/* Key Points Checklist */}
                        {Array.isArray(sec.keyPoints) && sec.keyPoints.length > 0 && (
                          <div className={`mt-4 p-4 rounded-xl border ${
                            isDark ? "bg-slate-900/60 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800 shadow-xs"
                          }`}>
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-2.5 flex items-center gap-1.5 ${
                              isDark ? "text-indigo-400" : "text-indigo-800 font-bold"
                            }`}>
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                              {isFrench ? "⚡ Points Clés & Règles Essentielles" : "⚡ Key Takeaways & Essential Rules"}
                            </span>
                            <ul className="space-y-2 text-xs">
                              {sec.keyPoints.map((kp: string, kpIdx: number) => (
                                <li key={kpIdx} className="flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? "bg-indigo-400" : "bg-indigo-600"}`} />
                                  <span className={isDark ? "text-slate-300" : "text-slate-800 font-medium"}>{kp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Visual Graphic Diagram */}
                        <CourseGraphicDiagram type={diagramType} isDark={isDark} isFrench={isFrench} title={sec.title} />

                        {/* Real-World Case Study / Example Box */}
                        {sec.example && (
                          <div className={`mt-4 p-4 md:p-5 rounded-xl border ${
                            isDark 
                              ? "bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-950 border-emerald-500/30 text-slate-200" 
                              : "bg-emerald-50/80 border-emerald-200 text-slate-900 shadow-xs"
                          }`}>
                            <div className="flex items-center gap-2 mb-2.5">
                              <Lightbulb className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} />
                              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                                isDark ? "text-emerald-400" : "text-emerald-800"
                              }`}>
                                {isFrench ? "💡 Cas Pratique & Exemple d'Application Réelle" : "💡 Real-World Case Study & Application Example"}
                              </span>
                            </div>
                            
                            {sec.example.scenario && (
                              <div className="mb-2 text-xs leading-relaxed">
                                <span className={`font-bold mr-1.5 ${isDark ? "text-emerald-400" : "text-emerald-900"}`}>{isFrench ? "Scénario :" : "Scenario:"}</span>
                                <span className={isDark ? "text-slate-300" : "text-slate-800"}>{sec.example.scenario}</span>
                              </div>
                            )}
                            {sec.example.execution && (
                              <div className="mb-2 text-xs leading-relaxed">
                                <span className={`font-bold mr-1.5 ${isDark ? "text-indigo-400" : "text-indigo-900"}`}>{isFrench ? "Mise en Œuvre :" : "Execution:"}</span>
                                <span className={isDark ? "text-slate-300" : "text-slate-800"}>{sec.example.execution}</span>
                              </div>
                            )}
                            {sec.example.result && (
                              <div className={`mt-2.5 p-2.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 ${
                                isDark 
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                                  : "bg-emerald-100 border-emerald-300 text-emerald-950"
                              }`}>
                                <TrendingUp className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} />
                                <span>{isFrench ? `Résultat Mesuré : ${sec.example.result}` : `Measured Impact: ${sec.example.result}`}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Checkpoint Mini-Quiz (embedded after every 3 lessons or if sec.miniQuiz exists) */}
                      {(() => {
                        const miniQuiz = sec.miniQuiz || ((secIdx + 1) % 3 === 0 ? {
                          question: isFrench 
                            ? `Quiz Intermédiaire (Leçons ${Math.max(1, secIdx - 1)} à ${secIdx + 1}) : Quelle règle clé garantit la performance dans ce module ?` 
                            : `Checkpoint Mini-Quiz (Lessons ${Math.max(1, secIdx - 1)} to ${secIdx + 1}): What core principle ensures performance in this module?`,
                          options: [
                            isFrench ? "L'application méthodique des principes théoriques et cas pratiques" : "Applying structured industry principles & systematic execution",
                            isFrench ? "Ignorer les retours d'expérience et les données" : "Disregarding user analytics and feedback",
                            isFrench ? "Supprimer les contrôles de qualité et de sécurité" : "Bypassing fundamental quality and security checks",
                            isFrench ? "Faire des suppositions non vérifiées" : "Making unverified guesswork decisions"
                          ],
                          correctAnswer: 0,
                          explanation: isFrench 
                            ? "La validation méthodique de chaque bloc de 3 leçons garantit une assimilation solide avant l'examen final de chapitre." 
                            : "Mastering each 3-lesson block validates your practical understanding before the final chapter assessment."
                        } : null);

                        if (!miniQuiz) return null;

                        const key = `${activeChapterIndex}_mini_${secIdx}`;
                        const selectedIdx = miniQuizSelected[key];
                        const isSubmitted = miniQuizSubmitted[key];
                        const isSelected = selectedIdx !== undefined;
                        const correctIdx = typeof miniQuiz.correctAnswer === "number" ? miniQuiz.correctAnswer : miniQuiz.correctIndex || 0;

                        return (
                          <div key={`mini_${secIdx}`} className={`my-6 rounded-2xl p-5 md:p-6 space-y-4 border ${
                            isDark 
                              ? "bg-gradient-to-r from-indigo-950/50 via-slate-900/90 to-purple-950/40 border-indigo-500/30 text-slate-200" 
                              : "bg-indigo-50/80 border-indigo-200 text-slate-900 shadow-sm"
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-indigo-500/20">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                                  {isFrench 
                                    ? `⚡ Quiz Intermédiaire (Leçons ${Math.max(1, secIdx - 1)} à ${secIdx + 1})` 
                                    : `⚡ Checkpoint Mini-Quiz (Lessons ${Math.max(1, secIdx - 1)} to ${secIdx + 1})`}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                                isDark ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-100 text-indigo-800 border-indigo-200"
                              }`}>
                                {isFrench ? "Validation 3 Leçons" : "3-Lesson Checkpoint"}
                              </span>
                            </div>

                            <h5 className={`text-xs md:text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {miniQuiz.question}
                            </h5>

                            <div className="space-y-2">
                              {miniQuiz.options.map((opt: string, optIdx: number) => {
                                const isThisSelected = selectedIdx === optIdx;
                                const isCorrect = correctIdx === optIdx;

                                let optionStyle = isDark 
                                  ? "border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-200" 
                                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800";

                                if (isThisSelected && !isSubmitted) {
                                  optionStyle = "border-indigo-500 bg-indigo-600/20 font-bold " + (isDark ? "text-white" : "text-indigo-900");
                                } else if (isSubmitted) {
                                  if (isCorrect) {
                                    optionStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold";
                                  } else if (isThisSelected && !isCorrect) {
                                    optionStyle = "border-rose-500 bg-rose-500/15 text-rose-400 font-bold";
                                  } else {
                                    optionStyle = "border-slate-800 bg-slate-950/30 text-slate-500 opacity-50";
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={isSubmitted}
                                    onClick={() => handleSelectMiniOption(key, optIdx)}
                                    className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    {isSubmitted && isThisSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="pt-2">
                              {!isSubmitted ? (
                                <button
                                  onClick={() => handleSubmitMiniQuiz(key)}
                                  disabled={!isSelected}
                                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  {isFrench ? "Valider le Quiz Intermédiaire" : "Lock In Mini-Quiz Answer"}
                                </button>
                              ) : (
                                <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                  isDark ? "bg-slate-950/80 border-slate-800 text-slate-200" : "bg-white border-indigo-200 text-slate-800"
                                }`}>
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold">
                                    {isFrench ? "Explication Pédagogique" : "Academic Feedback"}
                                  </span>
                                  <p className="text-xs leading-relaxed">{miniQuiz.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Direct content fallback if provided */}
              {activeChapter?.content && (
                <div className="whitespace-pre-line leading-relaxed pt-2">
                  {activeChapter.content}
                </div>
              )}
            </div>
          </div>

          {/* Section Transition Indicator */}
          <div className="flex items-center justify-center gap-3 py-2 text-xs font-mono font-bold uppercase tracking-wider">
            <div className={`h-px flex-1 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
            <span className={`px-3 py-1 rounded-full border text-[10px] ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-300 text-slate-600"
            }`}>
              {isFrench ? "↓ Étape de Validation : Répondez au Test ci-dessous" : "↓ Step 2: Complete Chapter Test below"}
            </span>
            <div className={`h-px flex-1 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          </div>

          {/* Chapter Quiz Card */}
          {activeChapter?.quiz && (
            <div className={`rounded-3xl p-6 md:p-8 space-y-5 border ${
              isDark 
                ? "bg-slate-900/60 border-slate-800 text-slate-200" 
                : "bg-white border-slate-200 text-slate-900 shadow-sm"
            }`}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {isFrench ? `Test du Chapitre ${activeChapterIndex + 1}` : `Chapter ${activeChapterIndex + 1} Verification Test`}
                </span>
              </div>

              <h4 className={`text-sm font-semibold leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                {activeChapter.quiz.question}
              </h4>

              <div className="space-y-2.5">
                {activeChapter.quiz.options.map((opt: string, optIdx: number) => {
                  const isSelected = selectedAnswers[activeChapterIndex] === optIdx;
                  const isSubmitted = submittedAnswers[activeChapterIndex];
                  const targetCorrectIdx = getCorrectAnswerIndex(activeChapter);
                  const isCorrect = targetCorrectIdx === optIdx;

                  let optionStyle = isDark 
                    ? "border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-200"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800";
                    
                  if (isSelected && !isSubmitted) {
                    optionStyle = "border-indigo-500 bg-indigo-600/10 font-bold " + (isDark ? "text-white" : "text-indigo-900");
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-500/10 text-rose-600 font-bold";
                    } else {
                      optionStyle = "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Feedback / Sequential Next Chapter Controls */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                {!submittedAnswers[activeChapterIndex] ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswers[activeChapterIndex] === undefined}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isFrench ? "Soumettre ma réponse" : "Lock In Answer"}
                  </button>
                ) : (
                  <div className={`p-5 rounded-2xl border text-xs leading-relaxed w-full space-y-4 ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-indigo-50/50 border-indigo-100 text-slate-800"
                  }`}>
                    <div>
                      <span className="font-bold font-mono text-[10px] block mb-1 uppercase tracking-widest text-indigo-500">
                        {isFrench ? "Explication pédagogique" : "Academic Explanation"}
                      </span>
                      <p className="text-xs leading-relaxed">{activeChapter.quiz.explanation}</p>
                    </div>

                    {/* Check if user passed this active chapter test */}
                    {selectedAnswers[activeChapterIndex] === getCorrectAnswerIndex(activeChapter) ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {isFrench ? `Test du Chapitre ${activeChapterIndex + 1} réussi !` : `Chapter ${activeChapterIndex + 1} Test Passed!`}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                              {activeChapterIndex < chaptersCount - 1
                                ? (isFrench ? `Le Chapitre ${activeChapterIndex + 2} est maintenant débloqué.` : `Chapter ${activeChapterIndex + 2} is now unlocked.`)
                                : (isFrench ? "Félicitations, vous avez validé l'ensemble des modules !" : "Congratulations, you have mastered all chapters!")}
                            </p>
                          </div>
                        </div>

                        {activeChapterIndex < chaptersCount - 1 ? (
                          <button
                            onClick={() => handleSelectChapter(activeChapterIndex + 1)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                          >
                            <span>{isFrench ? `Chapitre ${activeChapterIndex + 2} Suivant` : `Continue to Chapter ${activeChapterIndex + 2}`}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleClaimCertificateClick}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer animate-pulse"
                          >
                            <Award className="w-4 h-4" />
                            <span>{isFrench ? "Réclamer le Certificat" : "Claim AI Certificate"}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                              {isFrench ? "Réponse incorrecte" : "Test Answer Incorrect"}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                              {isFrench 
                                ? "Révisez la leçon ci-dessus et réessayez pour débloquer la suite du cours." 
                                : "Review the lesson material above and try again to unlock the next chapter."}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSubmittedAnswers(prev => ({ ...prev, [activeChapterIndex]: false }));
                            setSelectedAnswers(prev => {
                              const copy = { ...prev };
                              delete copy[activeChapterIndex];
                              return copy;
                            });
                          }}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition shrink-0 cursor-pointer ${
                            isDark 
                              ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200" 
                              : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm"
                          }`}
                        >
                          {isFrench ? "Réessayer la question" : "Retry Question"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON (FAB) FOR AI TEACHER CHAT */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsChatOpen(true);
            setHasUnreadTutorMsg(false);
          }}
          className={`fixed bottom-6 right-6 z-40 px-4 py-3 md:px-5 md:py-3.5 rounded-full shadow-2xl flex items-center gap-3 border font-semibold transition cursor-pointer ${
            isDark
              ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white border-indigo-400/40 shadow-indigo-500/30 hover:brightness-110"
              : "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white border-indigo-400/40 shadow-indigo-600/30 hover:brightness-110"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <span className="text-xs font-bold font-display">
            {isFrench 
              ? `Assistant de Cours` 
              : `Chat with Mentor`}
          </span>
          {hasUnreadTutorMsg && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </motion.button>
      )}

      {/* FLOATING COURSE CHAT WINDOW */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-3 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-96 max-w-full h-[480px] sm:h-[520px] max-h-[calc(100vh-4rem)] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
              isDark ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className={`p-2 rounded-xl border ${
                    isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200"
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h3 className={`text-xs font-black font-display truncate max-w-[190px] ${isDark ? "text-white" : "text-slate-900"}`}>
                    {course.aiTutorPersona || (isFrench ? "Tuteur ProPath" : "ProPath Tutor")}
                  </h3>
                  <span className={`text-[10px] font-mono block ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                    {isFrench ? "• En ligne (Mentor)" : "• Online (Course Mentor)"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isDark 
                      ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                      : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title={isFrench ? "Réduire" : "Minimize"}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isDark 
                      ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                      : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title={isFrench ? "Fermer" : "Close"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div 
                      className={`p-3 text-xs leading-relaxed ${
                        isUser 
                          ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-indigo-600/10" 
                          : isDark
                            ? "bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none"
                            : "bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>
                    </div>
                    <span className={`text-[8px] font-mono mt-1 px-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              {sendingQuestion && (
                <div className={`flex items-center gap-2 text-[10px] font-mono pl-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span>{course.aiTutorPersona ? course.aiTutorPersona.split(' ')[0] : "Mentor"} {isFrench ? "réfléchit..." : "is typing..."}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Question Submission Input */}
            <form 
              onSubmit={handleSendQuestion} 
              className={`p-3 border-t flex gap-2 ${
                isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
              }`}
            >
              <input
                type="text"
                disabled={sendingQuestion}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={isFrench ? "Posez une question sur le cours..." : "Ask a question about the course..."}
                className={`flex-1 text-xs p-2.5 rounded-xl border transition focus:outline-none focus:border-indigo-500 disabled:opacity-50 ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm"
                }`}
              />
              <button
                type="submit"
                disabled={!questionInput.trim() || sendingQuestion}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDENT CREDENTIAL INFORMATION FORM MODAL */}
      <AnimatePresence>
        {showStudentInfoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-left overflow-y-auto max-h-[92vh]"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-amber-400 to-purple-500" />
              
              <button
                onClick={() => setShowStudentInfoModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-400 block">
                    {isFrench ? "Accréditation Officielle ProPath" : "Official ProPath Accreditation"}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    {isFrench ? "Informations de Diplomation" : "Student Credential Information"}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {isFrench 
                  ? "Félicitations pour votre réussite à l'examen final ! Veuillez renseigner vos informations ci-dessous afin de délivrer votre Certificat de Reconnaissance officiel ProPath à votre nom." 
                  : "Congratulations on passing your final exam! Please enter your full professional details below so ProPath can officially issue your Recognition Certificate."}
              </p>

              <form onSubmit={handleSaveStudentInfo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFrench ? "Nom & Prénom Complet *" : "Full Legal / Professional Name *"}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentInfo.fullName}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={isFrench ? "ex: Alexandre Moreau" : "e.g., Alexandre Moreau"}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isFrench ? "Adresse Email (Optionnelle)" : "Email Address (Optional)"}</span>
                  </label>
                  <input
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={isFrench ? "ex: alexandre.m@propath.io" : "e.g., alexandre.m@propath.io"}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {isFrench ? "Titre / Spécialisation" : "Title / Specialization"}
                    </label>
                    <input
                      type="text"
                      value={studentInfo.title}
                      onChange={(e) => setStudentInfo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={isFrench ? "ex: Growth Marketing Specialist" : "e.g., Growth Marketing Specialist"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {isFrench ? "Établissement / Pays" : "Organization / Location"}
                    </label>
                    <input
                      type="text"
                      value={studentInfo.organization}
                      onChange={(e) => setStudentInfo(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder={isFrench ? "ex: ProPath Global Academy, France" : "e.g., ProPath Global Academy, France"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStudentInfoModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-medium cursor-pointer transition"
                  >
                    {isFrench ? "Annuler" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={!studentInfo.fullName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isFrench ? "Générer mon Certificat ProPath" : "Generate ProPath Certificate"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROPATH OFFICIAL RECOGNITION CERTIFICATE MODAL */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white text-slate-900 border-4 border-amber-600/70 rounded-3xl p-6 sm:p-10 md:p-12 w-full max-w-3xl relative shadow-2xl text-center overflow-hidden my-auto print:shadow-none print:border-4 print:border-amber-600 print:text-black print:bg-white"
            >
              {/* Gold Ambient Corner Accents */}
              <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-600/80 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-600/80 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-600/80 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-600/80 rounded-br-2xl pointer-events-none" />
              
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-indigo-900" />

              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer print:hidden p-1 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                {/* Admin Certificate Editing Control Banner */}
                {isAdminEditingCert && (
                  <div className="w-full mb-6 p-4 rounded-2xl bg-indigo-950 text-white border border-indigo-800 text-left print:hidden shadow-lg">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-800">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                          {isFrench ? "Éditeur Administrateur de Certificat" : "Admin Certificate Customizer"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleResetCertDefaults}
                          className="px-2.5 py-1 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-slate-300 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-400" />
                          <span>{isFrench ? "Réinitialiser" : "Reset Defaults"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAdminEditingCert(false)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isFrench ? "Terminer" : "Done Editing"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Nom du Récipiendaire" : "Recipient Name"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.fullName}
                          onChange={(e) => setCertCustomData({ ...certCustomData, fullName: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Titre / Spécialité" : "Professional Title"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.title}
                          onChange={(e) => setCertCustomData({ ...certCustomData, title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Organisme / Académie" : "Issuing Authority"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.organization}
                          onChange={(e) => setCertCustomData({ ...certCustomData, organization: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Titre de la Formation" : "Course Title"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.courseTitle}
                          onChange={(e) => setCertCustomData({ ...certCustomData, courseTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Code de Sécurité (ID)" : "Security Checksum ID"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.studentId}
                          onChange={(e) => setCertCustomData({ ...certCustomData, studentId: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Date de Délivrance" : "Issue Date"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.issueDate}
                          onChange={(e) => setCertCustomData({ ...certCustomData, issueDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Texte d'Homologation / Citation" : "Official Citation Statement"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.citationText}
                          onChange={(e) => setCertCustomData({ ...certCustomData, citationText: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Président du Conseil" : "Board President Name"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.boardPresident}
                          onChange={(e) => setCertCustomData({ ...certCustomData, boardPresident: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Titre du Président" : "President Title"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.boardPresidentTitle}
                          onChange={(e) => setCertCustomData({ ...certCustomData, boardPresidentTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-indigo-300 uppercase block mb-1">
                          {isFrench ? "Mentor Pédagogique" : "Faculty Mentor Name"}
                        </label>
                        <input
                          type="text"
                          value={certCustomData.facultyMentor}
                          onChange={(e) => setCertCustomData({ ...certCustomData, facultyMentor: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-900 flex items-center justify-center text-amber-400 font-black text-xs shadow-xs">
                    PP
                  </div>
                  <span className="text-[11px] font-mono tracking-widest uppercase font-black text-indigo-950">
                    {certCustomData.organization || "ProPath Global Academy of Vocational Excellence"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-mono uppercase tracking-wider mb-4 font-bold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isFrench ? "Certificat Officiel de Reconnaissance et de Réussite" : "Official ProPath Certificate of Recognition"}</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-display uppercase tracking-wider">
                  CERTIFICATE OF RECOGNITION
                </h1>
                
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-3" />

                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold mt-1">
                  {isFrench ? "CE CERTIFICAT EST DÉCERNÉ AVEC FÉLICITATIONS À :" : "THIS CERTIFICATE IS PROUDLY PRESENTED TO:"}
                </p>

                {/* Recipient Full Name */}
                <div className="my-3 py-3 px-8 rounded-2xl bg-amber-50/60 border border-amber-200/80 max-w-md w-full shadow-2xs">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-950 font-display tracking-tight">
                    {certCustomData.fullName || studentInfo.fullName || "Student Full Name"}
                  </h2>
                  {(certCustomData.title || studentInfo.title) && (
                    <span className="text-xs font-mono text-amber-800 block mt-1 font-bold">
                      {certCustomData.title || studentInfo.title}
                    </span>
                  )}
                </div>

                {/* Citation Statement */}
                <p className="text-xs text-slate-600 italic max-w-xl leading-relaxed mt-2 font-medium">
                  {certCustomData.citationText || (isFrench 
                    ? "En reconnaissance de la validation intégrale des modules de formation, des examens théoriques, des études de cas pratiques et de la maîtrise professionnelle démontrée dans le programme :" 
                    : "For exceptional performance and successful completion of all core syllabus requirements, practical case studies, and final examination modules in:")}
                </p>

                {/* Course Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-black text-indigo-950 mt-3 font-display px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs">
                  {certCustomData.courseTitle || course.title}
                </h3>

                {/* Key Metadata Grid */}
                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">
                      {isFrench ? "Date de délivrance" : "Issue Date"}
                    </span>
                    <span className="text-xs text-slate-900 font-mono font-black">
                      {certCustomData.issueDate || new Date().toLocaleDateString(isFrench ? "fr-FR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold">
                      {isFrench ? "Établissement Émetteur" : "Issuing Authority"}
                    </span>
                    <span className="text-xs text-indigo-900 font-mono font-black truncate block">
                      {certCustomData.organization || studentInfo.organization || "ProPath Academy"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block font-bold text-left sm:text-right">
                      {isFrench ? "Code d'Authentification" : "Security Checksum"}
                    </span>
                    <span className="text-xs text-amber-800 font-mono block font-black text-left sm:text-right">
                      {certCustomData.studentId || studentInfo.studentId || `PPS-${Math.floor(100000 + Math.random() * 900000)}`}
                    </span>
                  </div>
                </div>

                {/* Signatures & Seal Block */}
                <div className="w-full mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Left Signature */}
                  <div className="text-center sm:text-left space-y-1">
                    <div className="font-serif italic text-amber-900 text-lg font-bold tracking-wide">
                      {certCustomData.boardPresident || "ProPath Learning School"}
                    </div>
                    <div className="h-[1px] w-32 bg-slate-300 mx-auto sm:mx-0 my-1" />
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                      {certCustomData.boardPresidentTitle || (isFrench ? "Président du Conseil Académique" : "ProPath Academic Board President")}
                    </span>
                  </div>

                  {/* Center Official Stamp */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-amber-700 border border-amber-200">
                        <Award className="w-6 h-6 text-amber-600" />
                        <span className="text-[7px] font-mono font-black tracking-tighter uppercase text-indigo-950">VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Signature */}
                  <div className="text-center sm:text-right space-y-1">
                    <div className="font-serif italic text-indigo-950 text-lg font-bold tracking-wide">
                      {certCustomData.facultyMentor || course.aiTutorPersona || (isFrench ? "Tuteur ProPath" : "ProPath Tutor")}
                    </div>
                    <div className="h-[1px] w-32 bg-slate-300 mx-auto sm:mx-0 sm:ml-auto my-1" />
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                      {certCustomData.facultyMentorTitle || (isFrench ? "Mentor Pédagogique Qualifié" : "Certified Faculty AI Mentor")}
                    </span>
                  </div>
                </div>

                {/* Modal Action Controls (Hidden when printing) */}
                <div className="flex flex-wrap gap-2.5 w-full mt-8 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 min-w-[140px] py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-slate-700" />
                    <span>{isFrench ? "Imprimer / PDF" : "Print / PDF Download"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `ProPath Verification ID: ${certCustomData.studentId || studentInfo.studentId} | Recipient: ${certCustomData.fullName || studentInfo.fullName} | Course: ${certCustomData.courseTitle || course.title}`;
                      navigator.clipboard.writeText(text);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="flex-1 min-w-[140px] py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Share2 className="w-4 h-4 text-indigo-700" />
                    <span>{copiedLink ? (isFrench ? "Lien Copié !" : "Copied!") : (isFrench ? "Copier Vérification" : "Copy Verification")}</span>
                  </button>

                  <button
                    onClick={() => setIsAdminEditingCert(!isAdminEditingCert)}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs ${
                      isAdminEditingCert 
                        ? "bg-amber-50 border-amber-300 text-amber-900 font-black" 
                        : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-950"
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-indigo-700" />
                    <span>{isAdminEditingCert ? (isFrench ? "Fermer l'Éditeur" : "Close Editor") : (isFrench ? "Éditer Certificat (Admin)" : "Edit Certificate (Admin)")}</span>
                  </button>

                  <button
                    onClick={() => setShowCertificate(false)}
                    className="py-2.5 px-5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold cursor-pointer transition shadow-md"
                  >
                    {isFrench ? "Fermer" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Built-in courses generator for any selected industry
function getBuiltInCourse(courseId: string, isFrench: boolean): any {
  const cId = (courseId || "").toLowerCase();

  if (cId.includes("digital_marketing") || cId.includes("marketing") || cId.includes("content_creation")) {
    return {
      id: "digital_marketing_native",
      title: isFrench 
        ? "ProPath Académie - Marketing Digital & Stratégie Médias Sociaux" 
        : "ProPath Academy - Digital Marketing & Social Media Strategy Masterclass",
      industry: "Digital Marketing & Growth",
      aiTutorPersona: isFrench ? "Tuteur ProPath" : "ProPath Tutor",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Fondations du Marketing Digital, Buyer Persona & Architecture SEO" : "1. Digital Marketing Foundations, Buyer Persona & SEO Architecture",
          summary: isFrench ? "Maîtriser l'entonnoir de conversion (TOFU/MOFU/BOFU), la cartographie des personas, l'indexation Google et l'autorité de domaine." : "Master conversion funnels (TOFU/MOFU/BOFU), buyer persona engineering, search indexing, and organic domain authority.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : L'Entonnoir de Conversion Modernisé (TOFU / MOFU / BOFU)" : "Lesson 1: The Modernized Conversion Funnel (TOFU / MOFU / BOFU)",
              content: isFrench 
                ? "Le marketing digital moderne s'appuie sur un entonnoir structuré qui accompagne l'utilisateur de la prise de conscience (TOFU - Top of Funnel), à l'évaluation des solutions (MOFU - Middle of Funnel), jusqu'à la conversion et la fidélisation (BOFU - Bottom of Funnel). Chaque étape requiert des messages spécifiques adaptés au niveau d'intention du prospect."
                : "Modern digital marketing operates on a structured conversion funnel leading users from Awareness (TOFU) through Consideration (MOFU) down to Conversion and Retention (BOFU). Each funnel stage requires tailored messaging aligned with buyer intent and pain points.",
              keyPoints: [
                isFrench ? "TOFU : Attirer une audience qualifiée avec du contenu éducatif gratuit" : "TOFU: Attract top-of-funnel reach using high-value educational content",
                isFrench ? "MOFU : Démontrer l'expertise par des études de cas et webinaires" : "MOFU: Build solution intent with case studies and interactive webinars",
                isFrench ? "BOFU : Déclencher l'achat avec des preuves sociales et offres ciblées" : "BOFU: Drive conversions with high-converting CTAs and risk-free guarantees"
              ],
              example: {
                scenario: isFrench ? "Campagne SaaS B2B pour logiciel de gestion d'équipe" : "B2B SaaS product launch campaign",
                result: isFrench ? "+140% d'inscriptions qualifiées en 60 jours" : "+140% qualified lead signups within 60 days"
              }
            },
            {
              title: isFrench ? "Leçon 2 : Cartographie des Buyer Personas & Ingestion d'Intention" : "Lesson 2: Customer Persona Mapping & Audience Intent Engineering",
              content: isFrench
                ? "Définir précisément le profil de son client idéal (ICP - Ideal Customer Profile) est la pierre angulaire de toute stratégie de croissance. Cartographiez les douleurs réelles (pain points), les objectifs prioritaires et les canaux d'information privilégiés de votre cible."
                : "Crafting precise Ideal Customer Profiles (ICPs) underpins all sustainable marketing growth. Map your audience's emotional triggers, urgent pain points, buying objections, and daily media consumption channels.",
              keyPoints: [
                isFrench ? "Identifier les freins psychologiques et objections d'achat" : "Uncover psychological friction and core buying objections",
                isFrench ? "Segmenter l'audience par niveau de maturité et secteur" : "Segment audiences by business vertical and buying maturity stage",
                isFrench ? "Aligner le ton rédactionnel sur le vocabulaire métier du client" : "Align brand messaging tone directly with audience industry vocabulary"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Mécanique d'Indexation Google & Algorithmes de Recherche" : "Lesson 3: Search Engine Indexing Mechanics & PageRank Infrastructure",
              content: isFrench
                ? "Les robots d'exploration (crawlers) de Google parcourent le Web pour cataloguer et classer les pages selon leur pertinence sémantique. Comprendre le budget d'exploration (crawl budget), les balises canonical et la hiérarchie des balises HTML (H1-H3) est indispensable."
                : "Google search spiders continuously crawl and index web pages based on semantic relevance and technical authority. Master crawl budgets, canonical tags, structured data, and clean HTML heading hierarchies (H1-H3).",
              keyPoints: [
                isFrench ? "Budget d'exploration : Optimiser la vitesse de chargement pour les crawlers" : "Crawl Budget: Optimize server response times for search crawlers",
                isFrench ? "Balises Schema.org : Structurer les données pour les extraits enrichis" : "Schema.org: Inject structured JSON-LD data for rich search snippet cards",
                isFrench ? "Indexabilité : Éviter le contenu dupliqué avec les URLs canoniques" : "Indexability: Prevent duplicate content penalties using canonical URLs"
              ],
              miniQuiz: {
                question: isFrench ? "Quel composant technique indique aux moteurs de recherche la version officielle d'une page pour éviter le contenu dupliqué ?" : "Which technical tag informs search engine crawlers of the canonical, official URL to prevent duplicate content penalties?",
                options: [
                  isFrench ? "La balise rel='canonical'" : "The rel='canonical' link tag",
                  isFrench ? "La balise script WebGL" : "The WebGL canvas script tag",
                  isFrench ? "Le fichier favicon.ico" : "The site favicon.ico icon file",
                  isFrench ? "L'en-tête HTTP 404 Not Found" : "The HTTP 404 status header"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "La balise rel='canonical' indique l'URL source principale à indexer pour regrouper l'autorité SEO." : "The rel='canonical' tag directs Google crawlers to the authoritative master URL for link equity indexing."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Recherche de Mots-Clés & Clusters Thématiques" : "Lesson 4: Keyword Research, Search Volume Analysis & Intent Clustering",
              content: isFrench
                ? "Plutôt que de viser des mots-clés génériques hyper-concurrentiels, structurez votre site en Topic Clusters (piliers thématiques). Identifiez l'intention de recherche (informationnelle, navigationnelle, transactionnelle) pour capturer des prospects prêts à acheter."
                : "Move beyond single high-competition head keywords by building semantic topic clusters. Categorize search terms by user intent (informational, navigational, transactional) to convert high-intent search traffic.",
              keyPoints: [
                isFrench ? "Mots-clés de longue traîne : Fort taux de conversion et faible concurrence" : "Long-Tail Keywords: High purchase intent with low competitive difficulty",
                isFrench ? "Piliers thématiques : Lier les articles satellites à la page maître" : "Topic Clusters: Link cluster articles internally to master pillar pages",
                isFrench ? "Volume vs Intention : Privilégier la valeur transactionnelle au volume brut" : "Intent over Volume: Prioritize transactional search intent over broad queries"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : Optimisation SEO On-Page & Balisage Sémantique" : "Lesson 5: On-Page & Technical SEO: Title Tags, Meta Descriptions & Core Web Vitals",
              content: isFrench
                ? "L'optimisation sur page implique l'écriture de balises Title accrocheuses (50-60 caractères), de méta-descriptions incitatives, l'optimisation des images (attributs ALT) et la satisfaction des métriques Core Web Vitals (LCP, FID, CLS)."
                : "On-page SEO requires crafting high-CTR Title tags (50-60 chars), compelling meta descriptions, optimized image alt attributes, and passing Google Core Web Vitals performance benchmarks (LCP, INP, CLS).",
              keyPoints: [
                isFrench ? "Title Tag : Placer le mot-clé principal au début de la balise" : "Title Tags: Position primary keywords near the front of the title tag",
                isFrench ? "Core Web Vitals : Assurer un chargement inférieur à 2,5 secondes" : "Core Web Vitals: Ensure Largest Contentful Paint (LCP) loads under 2.5s",
                isFrench ? "Optimisation des images : Compresser et utiliser les formats WebP/AVIF" : "Image Optimization: Compress assets and adopt WebP/AVIF modern formats"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Backlinks, Autorité de Domaine & Growth Loops SEO" : "Lesson 6: Off-Page SEO, Backlink Equity & Domain Authority Growth Loops",
              content: isFrench
                ? "L'autorité hors-page se construit par l'acquisition de backlinks de qualité provenant de sites référents dans votre secteur. Menez des campagnes de relations presse digitales et créez des ressources partageables (infographies, études de marché)."
                : "Off-page authority is forged by acquiring high-quality backlinks from recognized industry domains. Execute digital PR outreach campaigns, produce original industry research reports, and leverage viral infographic assets.",
              keyPoints: [
                isFrench ? "Qualité du backlink : Un lien d'un site d'autorité vaut 100 liens spammés" : "Link Quality: 1 high-authority editorial backlink outweighs 100 spam links",
                isFrench ? "Anchor Text : Varier les textes d'ancrage pour maintenir un profil naturel" : "Anchor Text: Diversify anchor text variations to maintain natural link velocity",
                isFrench ? "Growth Loops SEO : Encourager le partage spontané de vos contenus" : "SEO Growth Loops: Design interactive tools and reports that earn organic shares"
              ],
              miniQuiz: {
                question: isFrench ? "Pourquoi les mots-clés de longue traîne génèrent-ils un taux de conversion supérieur ?" : "Why do long-tail search keywords consistently produce higher conversion rates than short head terms?",
                options: [
                  isFrench ? "Parce qu'ils reflètent une intention d'achat précise et ciblée" : "Because they indicate explicit, specific purchasing intent",
                  isFrench ? "Parce qu'ils coûtent plus cher à héberger sur un serveur" : "Because they cost more money to render on web servers",
                  isFrench ? "Parce qu'ils forcent le navigateur à recharger la page" : "Because they force the browser to reload pages twice",
                  isFrench ? "Parce qu'ils sont invisibles sur les téléphones portables" : "Because they are hidden from mobile search algorithms"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Un utilisateur cherchant un terme très précis est très proche de sa décision d'achat." : "Users searching specific long-tail terms (e.g. 'buy modern team CRM software') are at the bottom of the buying funnel."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Quelle combinaison stratégique permet de dominer les résultats de recherche sur le long terme ?" : "Which integrated strategy builds dominant, long-term organic search authority while lowering CAC?",
            options: [
              isFrench ? "Des Topic Clusters piliers alliés à un balisage Schema.org et des backlinks d'autorité" : "Cornerstone topic clusters combined with technical Schema markup and high-authority backlinks",
              isFrench ? "Acheter des paquets de liens spammés sur des forums automatisés" : "Purchasing automated spam link packages on black-hat forums",
              isFrench ? "Changer le titre de sa page d'accueil tous les jours" : "Changing home page titles daily to confuse search crawlers",
              isFrench ? "Supprimer l'ensemble des anciens articles du blog" : "Deleting all legacy blog content to cut server storage fees"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "La synergie entre contenu pilier, SEO technique et réputation hors-page crée un moteur d'acquisition organique imbattable." : "Combining high-value content clusters, technical perfection, and domain authority creates a self-reinforcing organic growth flywheel."
          }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Stratégie de Contenu, Copywriting Persuasif & Médias Sociaux" : "2. Content Strategy, Persuasive Copywriting & Viral Social Media",
          summary: isFrench ? "Rédiger des accroches hypnotiques, maîtriser les modèles AIDA/PAS, créer du contenu vidéo court et automatiser l'acquisition par email." : "Craft magnetic headlines, master AIDA/PAS frameworks, produce short-form video hooks, and build automated lead nurturing funnels.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Les Formules de Copywriting (AIDA & PAS)" : "Lesson 1: Core Copywriting Frameworks: AIDA & PAS Models",
              content: isFrench
                ? "Le copywriting est l'art de rédiger du texte qui pousse à l'action. Utilisez la formule AIDA (Attention, Intérêt, Désir, Action) pour structurer vos pages de vente et la formule PAS (Problème, Agitation, Solution) pour captiver vos lecteurs dès la première phrase."
                : "Copywriting is the strategic craft of writing persuasive words that drive reader action. Master the AIDA framework (Attention, Interest, Desire, Action) for sales pages and the PAS model (Problem, Agitation, Solution) for ads and social posts.",
              keyPoints: [
                isFrench ? "Attention : Capter l'esprit du lecteur en moins de 3 secondes" : "Attention: Hook the reader within 3 seconds using pattern interruption",
                isFrench ? "Agitation (PAS) : Faire ressentir la douleur de l'inaction" : "Agitation (PAS): Emotionally highlight the friction of leaving problems unsolved",
                isFrench ? "Action (CTA) : Proposer un appel à l'action clair et sans ambiguïté" : "Action (CTA): Present a single, frictionless call-to-action prompt"
              ]
            },
            {
              title: isFrench ? "Leçon 2 : Rédaction d'Accroches Magnétiques & Pattern Interrupt" : "Lesson 2: Crafting Magnetic Headlines & The 3-Second Visual Hook",
              content: isFrench
                ? "L'accroche (Headline) représente 80% du succès d'un contenu. Utilisez des ruptures de motif (pattern interrupt), posez des questions provocatrices ou révélez des chiffres contre-intuitifs pour stopper le défilement de l'utilisateur."
                : "Your headline accounts for 80% of your content's engagement. Employ visual pattern interrupts, counter-intuitive statements, and specific numbers to stop social feeds in their tracks.",
              keyPoints: [
                isFrench ? "Règle des 4U : Utile, Urgent, Unique, Ultra-spécifique" : "The 4 U's: Useful, Urgent, Unique, and Ultra-specific headline rule",
                isFrench ? "Visual Hook : Associer le texte à une animation ou un contraste visuel" : "Visual Hooks: Pair headline copy with contrasting dynamic visual movement",
                isFrench ? "Curiosity Gap : Susciter la curiosité sans tomber dans le clickbait vide" : "Curiosity Gaps: Tease valuable insights without resorting to empty clickbait"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Algorithmes de Vidéos Courtes (TikTok, Instagram Reels, YouTube Shorts)" : "Lesson 3: Short-Form Video Strategy & Algorithm Mechanics (TikTok, Reels, Shorts)",
              content: isFrench
                ? "Les algorithmes de recommandations privilégient le taux de visionnage complet (completion rate) et le temps de rétention. Concevez des vidéos dynamiques avec des coupes toutes les 2 secondes et du sous-titrage natif."
                : "Video recommendation engines prioritize watch completion rates and rewatch loops. Design fast-paced video scripts featuring visual cuts every 2 seconds and hardcoded captions for silent viewing.",
              keyPoints: [
                isFrench ? "Taux de rétention : Conserver +60% de l'audience jusqu'à la fin" : "Retention Rate: Retain over 60% of video viewers past the 3-second mark",
                isFrench ? "Sous-titres dynamiques : 85% des vidéos sont vues sans le son" : "Dynamic Captions: 85% of mobile video content is consumed on mute",
                isFrench ? "Loop Effect : Créer une fin qui s'enchaîne de manière fluide avec le début" : "Seamless Loops: Craft endings that flow seamlessly back into the video start"
              ],
              miniQuiz: {
                question: isFrench ? "Dans la formule de copywriting PAS (Problème, Agitation, Solution), quel est le rôle exact de l'Agitation ?" : "In the PAS (Problem, Agitation, Solution) copywriting framework, what is the specific function of 'Agitation'?",
                options: [
                  isFrench ? "Mettre en lumière les conséquences émotionnelles et financières du problème non résolu" : "Emotionally highlighting the pain points and consequences of leaving the problem unsolved",
                  isFrench ? "Proposer immédiatement une réduction tarifaire de 50%" : "Offering an immediate 50% discount coupon before explaining the product",
                  isFrench ? "Insulter les commentaires sous la publication" : "Aggressively arguing with user comments in social media posts",
                  isFrench ? "Changer la typographie du site en police Comic Sans" : "Changing the site typography to a bright red bold font"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "L'agitation permet au prospect de ressentir l'urgence de résoudre sa situation avant de lui présenter la solution." : "Agitation builds urgent emotional awareness of the problem, making the solution feel essential."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Recyclage Multicanal & Vitesse Éditoriale" : "Lesson 4: Multi-Channel Content Repurposing & Editorial Velocity",
              content: isFrench
                ? "Maximisez le retour sur investissement de chaque contenu. Transformez un article pilier ou un enregistrement de podcast en 10 actifs prêts à publier sur LinkedIn, Twitter, Instagram et dans une newsletter hebdomadaire."
                : "Maximize your content ROI by establishing a multi-channel repurposing pipeline. Convert 1 master pillar post or webinar into 10 platform-tailored assets across LinkedIn, X, Instagram, and email newsletters.",
              keyPoints: [
                isFrench ? "Règle 1:10 : 1 idée centrale déclinée en 10 formats visuels et textuels" : "The 1:10 Rule: 1 core core idea adapted into 10 distinct platform formats",
                isFrench ? "Adaptation native : Respecter les codes graphiques de chaque réseau" : "Native Formatting: Respect platform-native visual and text mechanics",
                isFrench ? "Recyclage temporel : Re-publier les meilleurs contenus tous me 90 jours" : "Evergreen Recycling: Re-schedule top-performing evergreen content every 90 days"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : Preuve Sociale, UGC & Communauté de Marque" : "Lesson 5: Social Proof, Case Studies & Community Engagement Retention",
              content: isFrench
                ? "La preuve sociale réduit l'hésitation à l'achat. Intégrez des témoignages clients authentiques, des études de cas détaillées et exploitez les contenus générés par les utilisateurs (UGC - User Generated Content)."
                : "Social proof dismantles customer buying skepticism. Integrate authentic video reviews, quantitative case studies, and leverage User-Generated Content (UGC) to transform buyers into brand advocates.",
              keyPoints: [
                isFrench ? "UGC : Décupler la confiance avec des vidéos clients non filtrées" : "UGC: Supercharge buying trust using unpolished authentic customer videos",
                isFrench ? "Études de cas : Structurer la preuve avec Chiffres + Avant/Après" : "Quantified Case Studies: Structure proof around Metrics + Before/After transformations",
                isFrench ? "Communauté : Créer des espaces d'échange exclusifs pour les clients" : "Community Hubs: Build private VIP groups that foster long-term customer loyalty"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Lead Magnets & Séquences d'Automation Email" : "Lesson 6: Lead Magnets, Email Nurturing Sequences & Marketing Automation",
              content: isFrench
                ? "Construisez une liste d'emails qualifiée en offrant un Lead Magnet irrésistible (eBook, modèle gratuit, calculateur). Mettez en place une séquence de bienvenue automatique en 5 étapes pour convertir vos abonnés en acheteurs."
                : "Build an owned email asset by offering high-converting Lead Magnets (eBooks, templates, interactive calculators). Deploy a 5-step automated welcome drip sequence that nurtures leads into paying customers.",
              keyPoints: [
                isFrench ? "Lead Magnet : Offrir une solution rapide à un problème très précis" : "Lead Magnet: Deliver immediate high value addressing a single urgent need",
                isFrench ? "Séquence Drip : 5 emails automatisés espacés de 24 à 48 heures" : "Email Drips: 5 automated emails sent over 7-10 days building brand trust",
                isFrench ? "Segmentation : Personnaliser les offres selon les clics de l'abonné" : "Behavioral Segmentation: Tag and trigger emails based on user click habits"
              ],
              miniQuiz: {
                question: isFrench ? "Quelle est la fonction principale d'une séquence email automatisée de nurturing ?" : "What is the primary function of an automated lead-nurturing email drip sequence?",
                options: [
                  isFrench ? "Éduquer les abonnés dans le temps pour les faire passer du statut de prospect à client payant" : "Educating subscribers over time to transition them from warm leads into paying customers",
                  isFrench ? "Envoyer 10 emails identiques par jour pour forcer une ouverture" : "Sending 10 identical marketing emails per day to force immediate opens",
                  isFrench ? "Désabonner automatiquement les nouveaux inscrits après 24 heures" : "Automatically purging new email signups after 24 hours",
                  isFrench ? "Bloquer l'accès aux articles gratuits du site web" : "Blocking visitors from reading free website blog articles"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Le nurturing automatique instaure la confiance en apportant de la valeur régulière jusqu'à l'acte d'achat." : "Drip sequences provide steady, targeted value that gently overcomes purchase barriers."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Comment l'association d'accroches vidéos courtes et d'un entonnoir d'automation email optimise-t-elle le ROI ?" : "How does combining short-form video hooks with an automated lead magnet funnel maximize marketing ROI?",
            options: [
              isFrench ? "Les vidéos génèrent un fort trafic TOFU peu coûteux, et l'email nurture et convertit sur le long terme" : "Video hooks drive cheap TOFU reach, while lead magnets capture contact info for long-term email nurturing",
              isFrench ? "Les vidéos éliminent complètement le besoin d'avoir une page de vente" : "Video clips replace the need for any product landing page or checkout",
              isFrench ? "Les lead magnets versent automatiquement de l'argent aux spectateurs" : "Lead magnets credit cash directly to viewers who watch videos",
              isFrench ? "Les algorithmes des réseaux sociaux achètent eux-mêmes les produits" : "Social media algorithms automatically purchase products for users"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "Cette synergie associe la portée virale des réseaux sociaux à la rétention et conversion de l'emailing." : "Combining viral top-of-funnel discovery with automated email nurturing creates a self-sustaining acquisition engine."
          }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Performance Ads, Acquisition Payante & Analytique Marketing" : "3. Performance Ads, Paid Acquisition & Growth Analytics",
          summary: isFrench ? "Piloter vos campagnes publicitaires (Meta Ads / Google PPC), optimiser le ROAS, configurer le tracking CAPI et maîtriser les ratios CAC / LTV." : "Execute Meta & Google PPC ads, optimize ROAS, configure server-side CAPI tracking, and master CAC to LTV growth unit economics.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Architecture Meta Ads & Dynamic Creative Optimization (DCO)" : "Lesson 1: Paid Media Architecture: Meta Ads (Facebook & Instagram) & Creative Testing",
              content: isFrench
                ? "La publicité payante permet d'accélérer l'acquisition de clients. Apprenez à tester dynamiquement différents visuels et textes, à calculer le Retour sur Investissement Publicitaire (ROAS = Chiffre d'affaires publicitaire / Dépense publicitaire) et à affiner votre ciblage."
                : "Paid media provides predictable client acquisition at scale. Learn to run dynamic ad creative tests (DCO), optimize click-through rates, and track Return on Ad Spend (ROAS = Revenue from Ads / Total Ad Spend).",
              keyPoints: [
                isFrench ? "Structure de campagne : Sparring broad targeting vs ciblages Lookalike" : "Campaign Setup: Test broad interest targeting against high-value Lookalikes",
                isFrench ? "DCO : Laisser l'IA assembler la meilleure combinaison visuel + texte" : "DCO: Allow ad algorithms to dynamically match creative hooks with text",
                isFrench ? "ROAS Cible : Calculer le point d'équilibre financier (Break-even ROAS)" : "Break-Even ROAS: Calculate exact profit threshold margin prior to scaling"
              ]
            },
            {
              title: isFrench ? "Leçon 2 : Google PPC Search Ads & Maximisation du Quality Score" : "Lesson 2: Google PPC Search Ads, Keyword Bidding & Quality Score",
              content: isFrench
                ? "Les campagnes Search Google capturent des intentionnistes au moment précis de leur besoin. Maîtrisez les types de correspondance (Exact, Expression, Large) et optimisez votre Quality Score pour réduire le coût par clic (CPC)."
                : "Google Search ads capture active demand at the exact moment of search intent. Master match types (Exact, Phrase, Broad), negative keyword lists, and optimize Quality Score to lower Cost-Per-Click (CPC).",
              keyPoints: [
                isFrench ? "Quality Score : Pertinence de l'annonce, de la page d'atterrissage et du CTR" : "Quality Score: Optimize ad copy, keyword alignment, and landing page UX",
                isFrench ? "Mots-clés négatifs : Bloquer le trafic hors-sujet pour économiser le budget" : "Negative Keywords: Exclude unqualified search terms to protect ad spend",
                isFrench ? "Enchères automatisées : Exploiter le Smart Bidding basé sur les conversions" : "Smart Bidding: Leverage target CPA and ROAS automated bidding algorithms"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Tracking Infrastructure : Pixels, Conversions API (CAPI) & UTMs" : "Lesson 3: Tracking Infrastructure: Meta Pixel, Conversions API (CAPI) & UTM Parameters",
              content: isFrench
                ? "Le tracking précis des données est indispensable dans un monde post-cookie. Installez la Conversions API (CAPI) côté serveur pour remonter 100% des événements d'achat et utilisez des paramètres UTM rigoureux."
                : "Accurate conversion telemetry is mandatory for modern ad platforms. Implement server-side Conversions API (CAPI) alongside standard Pixels to capture offline events and track UTM campaign parameter paths.",
              keyPoints: [
                isFrench ? "Server-Side CAPI : Contourner les bloqueurs de publicité et restrictions iOS" : "Server-Side CAPI: Protect conversion signals against iOS browser restrictions",
                isFrench ? "Conventions UTM : Normaliser la nomenclature utm_source, medium et campaign" : "UTM Standardization: Maintain pristine utm_source, medium, and campaign parameters",
                isFrench ? "Attribution : Comprendre les modèles First-Touch, Last-Touch et Multi-Touch" : "Attribution Models: Evaluate First-Touch, Last-Touch, and Data-Driven attribution"
              ],
              miniQuiz: {
                question: isFrench ? "Comment l'augmentation du Quality Score dans Google Ads impacte-t-elle votre budget ?" : "How does increasing your Google PPC Quality Score directly impact your advertising budget?",
                options: [
                  isFrench ? "Elle réduit le Coût Par Clic (CPC) réel tout en offrant un meilleur positionnement" : "It lowers your actual Cost-Per-Click (CPC) while earning higher ad position rankings",
                  isFrench ? "Elle double le coût de chaque clic sur votre compte publicitaire" : "It doubles the cost of every keyword click on your account",
                  isFrench ? "Elle masque automatiquement les annonces pendant les week-ends" : "It forces search engines to hide your ad on weekends",
                  isFrench ? "Elle exige de payer des frais d'abonnement mensuels supplémentaires" : "It requires paying extra monthly platform subscription fees to Google"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Google récompense les annonces les plus pertinentes avec des coûts d'enchères réduits et une meilleure visibilité." : "A higher Quality Score lowers CPC cost barriers and grants superior search ad placements."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Optimisation du ROAS & Gestion de la Fatigue Publicitaire" : "Lesson 4: Return on Ad Spend (ROAS) Optimization & Ad Fatigue Management",
              content: isFrench
                ? "Surveillez la courbe de fatigue de vos créatives publicitaires (baisse du CTR, hausse du CPM). Renouvelez vos visuels toutes les 2 à 3 semaines et appliquez des règles d'enchères automatisées pour couper les ensembles non rentables."
                : "Monitor ad creative decay curves indicated by falling CTRs and rising CPMs. Refresh visual variations every 2-3 weeks and deploy automated rules to turn off non-performing ad sets.",
              keyPoints: [
                isFrench ? "Creative Fatigue : Identifier la baisse d'efficacité des visuels" : "Ad Fatigue: Spot decay signals early via falling CTR and rising CPM metrics",
                isFrench ? "Règles automatisées : Couper automatiquement si le coût par prospect dépasse le seuil" : "Automated Rules: Set triggers to kill ad sets exceeding target Cost Per Acquisition",
                isFrench ? "Scalabilité horizontale : Dupliquer les gagnants sur de nouvelles audiences" : "Horizontal Scaling: Scale budget by launching winning ads into broad new audiences"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : Unit Economics : Coût d'Acquisition Client (CAC) vs. Valeur à Vie (LTV)" : "Lesson 5: Unit Economics: Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV)",
              content: isFrench
                ? "Une entreprise rentable doit maîtriser son Coût d'Acquisition Client (CAC) et s'assurer que la Valeur à Vie (LTV) d'un client est au moins 3 fois supérieure au CAC (Ratio LTV:CAC ≥ 3:1)."
                : "Sustainable growth requires monitoring Customer Acquisition Cost (CAC) against Lifetime Value (LTV). Maintain a target benchmark ratio of LTV:CAC ≥ 3:1 to ensure positive cash flow and profitable scaling.",
              keyPoints: [
                isFrench ? "Formule du CAC : (Total Dépenses Marketing + Ventes) / Nombre de Nouveaux Clients" : "CAC Formula: Total Marketing & Sales Costs / Total New Customers Acquired",
                isFrench ? "Calcul de la LTV : Panier Moyen × Fréquence d'Achat × Durée de Rétention" : "LTV Formula: Average Purchase Value × Purchase Frequency × Retention Span",
                isFrench ? "Ratio 3:1 : Le standard d'or pour investir sereinement dans la croissance" : "3:1 Benchmark Ratio: The golden standard for continuous paid growth reinvestment"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Tests A/B, Conversion Rate Optimization (CRO) & GA4" : "Lesson 6: A/B Testing Frameworks, Conversion Rate Optimization (CRO) & Analytics",
              content: isFrench
                ? "Ne devinez pas : testez. Formulez des hypothèses de tests A/B sur vos pages de destination (titres, boutons d'action, visuels), analysez la signification statistique et suivez les événements d'entonnoir dans Google Analytics 4 (GA4)."
                : "Replace assumptions with data. Formulate split-test hypotheses on landing pages (headlines, CTA button colors, hero images), ensure statistical significance, and configure Google Analytics 4 (GA4) funnel telemetry.",
              keyPoints: [
                isFrench ? "Tests A/B : Ne modifier qu'une seule variable à la fois pour isoler l'impact" : "A/B Testing: Isolate a single variable per test to prove statistical causation",
                isFrench ? "CRO : Réduire les frictions dans le formulaire de paiement" : "CRO Discipline: Eliminate unnecessary form fields and checkout speed friction",
                isFrench ? "GA4 Funnels : Identifier les étapes de déperdition de trafic" : "GA4 Exploration Funnels: Pinpoint exact user drop-off stages in conversion paths"
              ],
              miniQuiz: {
                question: isFrench ? "Si une campagne affiche un Taux de Clic (CTR) élevé mais une faible conversion sur la page d'arrivée, où se situe le problème ?" : "If an ad campaign exhibits high Click-Through Rate (CTR) but low landing page conversion, where is the friction located?",
                options: [
                  isFrench ? "Le message de la page d'arrivée ne correspond pas à la promesse de l'annonce ou présente des frictions" : "The landing page offer/copy disconnects from the ad promise or has checkout friction",
                  isFrench ? "Le texte de la publicité est illisible sur les écrans" : "The ad copy is too difficult for social media users to read",
                  isFrench ? "La régie publicitaire a prélevé l'argent sans envoyer de vrais visiteurs" : "The ad platform charged money without sending real visitors",
                  isFrench ? "La connexion internet de l'utilisateur a été coupée" : "The internet connection of the user was disconnected"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Un CTR élevé prouve que l'annonce captive, mais l'absence de conversion révèle une rupture sur la page de destination." : "A high CTR confirms ad resonance; low conversion points to offer disconnect or UX friction on the landing page."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Quel est le ratio idéal recommandé entre la valeur à vie du client (LTV) et le coût d'acquisition (CAC) ?" : "What is considered a healthy benchmark ratio for Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC)?",
            options: [
              "LTV : CAC ≥ 3 : 1",
              "LTV : CAC = 1 : 1",
              "LTV : CAC = 0.5 : 1",
              "LTV : CAC = 1 : 10"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "Un ratio LTV:CAC de 3:1 ou plus garantit la rentabilité globale des dépenses d'acquisition marketing." : "An LTV:CAC ratio of 3:1 or higher indicates a scalable, profitable customer acquisition model."
          }
        }
      ]
    };
  }

  if (cId.includes("creativedesign") || cId.includes("design") || cId.includes("spatial") || cId.includes("ux") || cId.includes("ui")) {
    return {
      id: "creativedesign_native",
      title: isFrench 
        ? "ProPath Académie - Design Numérique Créatif, Interfaces Spatiales & Architecture UI/UX" 
        : "ProPath Academy - Creative Digital Design, Spatial UI & UX Architecture Masterclass",
      industry: "Creative Digital Design & Spatial Interfaces",
      aiTutorPersona: isFrench ? "Alexandre Mercier (Directeur Artistique & Designer Spatial UI)" : "Alexandre Mercier (Creative Director & Spatial UI Designer)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Fondations UI/UX, Design Systems & Architecture de Tokens Figma" : "1. UI/UX Foundations, Design Systems & Figma Token Architecture",
          summary: isFrench ? "Maîtriser la hiérarchie visuelle, les systèmes de grilles responsives, la théorie des couleurs et l'architecture des Design Systems." : "Master visual hierarchy, responsive layout systems, color theory, component tokens, and scalable Design Systems.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Ergonomie Web, Règles de la Gestalt & Composition Visuelle" : "Lesson 1: Digital UX Ergonomics, Gestalt Rules & Visual Composition",
              content: isFrench
                ? "Le design d'interface moderne s'appuie sur la psychologie cognitive et la perception humaine. Appliquez les lois de la Gestalt (proximité, similitude, continuité) et la règle des tiers pour guider naturellement le regard de l'utilisateur vers les actions prioritaires."
                : "Modern digital interface design leverages cognitive psychology and visual perception. Master Gestalt laws (proximity, similarity, continuity) and layout grids to guide user attention toward primary call-to-action elements with zero friction.",
              keyPoints: [
                isFrench ? "Loi de Proximité : Regrouper visuellement les éléments ayant une fonction liée" : "Law of Proximity: Group related UI elements together visually",
                isFrench ? "Hiérarchie Typographique : Définir des échelles proportionnelles (Ratio Major Third 1.25)" : "Typography Scale: Establish proportional type scales (e.g., Major Third 1.25x ratio)",
                isFrench ? "Espace Négatif : Utiliser les marges pour donner du souffle et de la clarté" : "Negative Space: Use generous white space padding to elevate clarity"
              ]
            },
            {
              title: isFrench ? "Leçon 2 : Architecture de Design Systems & Tokens Figma" : "Lesson 2: Design System Architecture, Figma Components & Tokens",
              content: isFrench
                ? "Un Design System unifie les équipes design et ingénierie. Créez des tokens atomiques pour les couleurs, la typographie, les rayons de bordure et les ombres. Configurez des composants modulaires dans Figma avec Auto Layout et propriétés de variantes."
                : "A unified Design System bridges product design and engineering codebases. Construct atomic design tokens for color palettes, typography variables, spatial padding, and border radius rules synced with CSS variables.",
              keyPoints: [
                isFrench ? "Tokens Atomiques : Définir les variables de base (Primary, Neutral, Padding)" : "Atomic Tokens: Standardize base variables for color, type, and spacing",
                isFrench ? "Figma Auto Layout : Concevoir des composants fluides et auto-adaptatifs" : "Figma Auto Layout: Build responsive components that adapt dynamically",
                isFrench ? "Documentation : Décrire les états (Hover, Active, Disabled, Focus)" : "State Telemetry: Document component interactive states clearly for frontend devs"
              ]
            }
          ],
          quiz: {
            question: isFrench ? "Quel est l'avantage clé d'utiliser des Design Tokens dans une équipe produit ?" : "What is the key benefit of leveraging Design Tokens in product design?",
            options: [
              isFrench ? "Garantir une source de vérité unique réutilisable directement dans le code frontend" : "Ensuring a single source of truth synced directly with frontend CSS code",
              isFrench ? "Accélérer la vitesse d'impression des affiches papier" : "Increasing paper poster printing speed",
              isFrench ? "Supprimer la nécessité d'effectuer des tests utilisateurs" : "Eliminating the need for user testing",
              isFrench ? "Masquer les images sur les appareils mobiles" : "Hiding images on mobile displays"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "Les Design Tokens traduisent les choix visuels en variables informatiques directement exploitables par les développeurs." : "Design tokens serve as shared variables connecting UI design tools directly to production code."
          }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Design Graphique Assisté par l'IA (Midjourney, Flux & Vector AI)" : "2. AI-Assisted Visual Design, Branding & Generative Prompts",
          summary: isFrench ? "Exploiter l'IA générative pour concevoir des identités de marque, des maquettes 3D, des illustrations et des jeux de pictos." : "Leverage generative AI to craft brand identities, 3D product mockups, custom illustration systems, and vector icon sets.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Ingénierie de Prompts Artistiques & Midjourney v6 / Flux" : "Lesson 1: Artistic Prompt Engineering for Midjourney v6 & Flux",
              content: isFrench
                ? "L'IA générative révolutionne la création visuelle. Apprenez à composer des prompts artistiques précis en spécifiant le style graphique (ex: Minimalist vector illustration, 3D claymation, Isometric tech UI), l'éclairage studio et la palette de couleurs."
                : "Generative AI transforms visual production speeds. Master prompt engineering syntax by specifying art style parameters (e.g. Minimalist vector illustration, 3D glassmorphism, Isometric UI), camera lens depth, and lighting.",
              keyPoints: [
                isFrench ? "Paramètres de Style : Utiliser --ar, --stylize et --v 6 pour contrôler le rendu" : "Style Controls: Utilize aspect ratios, stylize parameters, and lighting prompts",
                isFrench ? "Consistance de Marque : Utiliser les références de style (Style References --sref)" : "Brand Consistency: Maintain style coherence using style reference parameters",
                isFrench ? "Vectorisation : Convertir les visuels IA en SVG éditables avec Vector AI" : "Vectorization: Convert AI bitmap outputs into scalable, clean SVG assets"
              ]
            }
          ],
          quiz: {
            question: isFrench ? "Comment garantir la cohérence visuelle d'une marque lors de la génération d'images par IA ?" : "How can brand visual consistency be maintained when generating AI assets?",
            options: [
              isFrench ? "En utilisant des références de style (--sref) et des guides de palettes de couleurs stricts dans les prompts" : "Using style reference parameters (--sref) and strict color palette guidelines in prompts",
              isFrench ? "En régénérant 100 fois la même image au hasard" : "Randomly regenerating the prompt 100 times",
              isFrench ? "En supprimant tous les mots-clés du prompt" : "Removing all descriptive keywords from the prompt",
              isFrench ? "En désactivant le processeur graphique" : "Disabling GPU hardware acceleration"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "Les références de style et les contraintes de palette maintiennent la charte graphique globale." : "Style references lock in aesthetic moodboards and color palettes across generative runs."
          }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Design d'Interfaces Spatiales 3D & Expériences Immersives WebGL" : "3. 3D Spatial UI Design, AR/VR & Immersive Canvas",
          summary: isFrench ? "Concevoir pour le Spatial Computing (Apple Vision Pro, Quest), la profondeur 3D, l'ergonomie oculaire et le WebGL interactif." : "Design for Spatial Computing (Apple Vision Pro, Meta Quest), 3D depth layers, eye-gaze ergonomics, and interactive WebGL canvas.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Ergonomie Spatiale, Rayons Visuels & Modélisation 3D" : "Lesson 1: Spatial Ergonomics, Visual Rays & Volumetric UI Containers",
              content: isFrench
                ? "Dans un environnement informatique spatial (AR/VR), l'écran traditionnel disparaît. Concevez des conteneurs UI volumétriques positionnés dans le champ de vision naturel de l'utilisateur (45° d'amplitude oculaire)."
                : "In spatial computing (AR/VR), physical screens give way to volumetric canvases. Position UI windows within natural human gaze arcs (45-degree visual field) and utilize glassmorphic depth cues.",
              keyPoints: [
                isFrench ? "Champ Visuel Confortable : Placer le contenu principal dans la zone centrale de 45°" : "Comfortable Gaze Zone: Position core UI elements within the central 45° visual cone",
                isFrench ? "Depth Cues : Utiliser l'ombre portée et le flou d'arrière-plan (Glassmorphism) pour la profondeur" : "Depth Cues: Employ subtle drop shadows and background blur to convey spatial depth",
                isFrench ? "Interactions Regard & Pincement : Concevoir des états de survol élargis pour la sélection" : "Eye-Gaze & Pinch: Size targets generously (≥44pt) for effortless eye tracking select"
              ]
            }
          ],
          quiz: {
            question: isFrench ? "Pourquoi la taille des cibles tactiles et d'interaction oculaire doit-elle être plus importante en Design Spatial 3D ?" : "Why must interactive touch and eye-gaze targets be sized more generously in 3D Spatial UI design?",
            options: [
              isFrench ? "Pour compenser la micro-imprécision du suivi oculaire et éviter la fatigue visuelle" : "To accommodate subtle eye-tracking variance and prevent ocular strain",
              isFrench ? "Parce que les processeurs VR ne peuvent pas afficher de petits boutons" : "Because VR headsets cannot render small UI buttons",
              isFrench ? "Pour augmenter le coût du casque AR" : "To inflate AR headset hardware costs",
              isFrench ? "Pour empêcher l'utilisateur de cliquer sur l'écran" : "To prevent users from tapping on virtual glass"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "Une taille minimale généreuse (ex: 44pt+) facilite le ciblage par le regard sans exiger un effort visuel intense." : "Generous visual hit targets allow fluid gaze selection without causing ocular fatigue."
          }
        }
      ]
    };
  }

  if (cId.includes("ai_systems") || cId.includes("ai")) {
    return {
      id: "ai_systems_native",
      title: isFrench 
        ? "ProPath Académie - Systèmes IA, Modèles LLM & Ingenierie RAG" 
        : "ProPath Academy - AI Systems, LLM Architectures & RAG Engineering",
      industry: "Artificial Intelligence & LLMs",
      aiTutorPersona: isFrench ? "Dr. Alan Turing (Mentor Senior IA & Architecte LLM)" : "Dr. Alan Turing (Senior AI & LLM Faculty Mentor)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Architecture des LLMs, Attention & Fine-Tuning" : "1. LLM Architecture, Attention Mechanisms & Model Fine-Tuning",
          summary: isFrench ? "Maîtriser le mécanisme de Self-Attention, la tokenisation BPE, les couches Transformer et les méthodes de fine-tuning PEFT/LoRA." : "Master self-attention, BPE tokenization, Transformer blocks, and PEFT/LoRA fine-tuning workflows.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Les Fondations des Transformers & Self-Attention" : "Lesson 1: Transformer Foundations & Self-Attention Math",
              content: isFrench 
                ? "Les modèles de langage modernes reposent sur l'architecture Transformer introduite en 2017. Le mécanisme de Self-Attention permet au modèle de calculer la pertinence relative de chaque mot dans une séquence de manière entièrement parallélisable."
                : "Modern Large Language Models rely on the Transformer architecture. Self-attention layers compute pairwise token relationships in parallel, capturing long-range dependencies far better than sequential RNNs.",
              keyPoints: [
                isFrench ? "Matrices Q, K, V : Query, Key et Value pour pondérer l'attention" : "Q, K, V Matrices: Query, Key, Value vectors score contextual token weight",
                isFrench ? "Parallélisation : Traitement simultané de l'ensemble de la séquence" : "Parallelization: Simultaneous sequence processing removes RNN bottlenecks",
                isFrench ? "Scalabilité : Scaling Laws liant calcul, données et paramètres" : "Scaling Laws: Compute, data size, and parameter counts drive capabilities"
              ],
              example: {
                scenario: isFrench ? "Optimisation de l'attention pour un contexte de 128k tokens" : "Optimizing attention for a 128k token context window",
                result: isFrench ? "-40% de consommation mémoire GPU grâce à FlashAttention" : "40% GPU memory reduction via FlashAttention kernels"
              }
            },
            {
              title: isFrench ? "Leçon 2 : Tokenisation BPE, Vocabulaire & Positional Encoding" : "Lesson 2: BPE Tokenization, Vocabulary Indexing & Positional Encoding",
              content: isFrench
                ? "Avant d'être traités, les textes bruts sont découpés en sous-mots (tokens) via des algorithmes comme Byte-Pair Encoding (BPE). Les encodages positionnels (RoPE, ALiBi) réinjectent la notion d'ordre spatial des mots."
                : "Raw text is discretized into sub-word units using Byte-Pair Encoding (BPE). Rotary Position Embeddings (RoPE) inject positional sequence order directly into Query-Key attention calculations.",
              keyPoints: [
                isFrench ? "Tokenisation BPE : Compression efficace et gestion du texte multilingue" : "BPE Tokenization: Efficient sub-word splitting handles rare domain words",
                isFrench ? "Rotary Embeddings (RoPE) : Extrapolation à des fenêtres de contexte ultra-longues" : "RoPE Embeddings: Enables context window extrapolation to 1M+ tokens",
                isFrench ? "Espace Latent : Projeter les tokens sous forme de vecteurs denses" : "Latent Space: Project discrete token IDs into continuous vector spaces"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Multi-Head Attention & Normalisation des Couches" : "Lesson 3: Multi-Head Attention & Layer Normalization Networks",
              content: isFrench
                ? "Multi-Head Attention divise le vecteur en sous-espaces pour capturer simultanément des relations sémantiques, syntactiques et temporelles différentes. Les connexions résiduelles évitent la disparition du gradient."
                : "Multi-Head Attention splits latent vectors across heads to evaluate syntax, grammar, and semantic ties concurrently. Residual skip-connections stabilize deep backpropagation gradients.",
              keyPoints: [
                isFrench ? "Têtes multiples : Extraire plusieurs dimensions d'analyse en parallèle" : "Multi-Heads: Process independent representation subspaces in parallel",
                isFrench ? "LayerNorm & RMSNorm : Stabiliser les activations dans les réseaux très profonds" : "RMSNorm: Stabilizes numerical activation distributions across deep layers",
                isFrench ? "Feed-Forward Networks (FFN) : Stocker les connaissances factuelles du modèle" : "FFN Layers: Store parametric factual knowledge within model weights"
              ],
              miniQuiz: {
                question: isFrench ? "Quel composant des Transformers permet au modèle de conserver la notion d'ordre des mots dans une phrase ?" : "Which Transformer mechanism enables the network to maintain word sequence order during parallel processing?",
                options: [
                  isFrench ? "L'encodage positionnel (ex: RoPE)" : "Positional Encoding (e.g., RoPE)",
                  isFrench ? "Le compilateur WebGL" : "The WebGL shader compiler",
                  isFrench ? "La base de données SQL" : "The relational SQL database",
                  isFrench ? "La mémoire cache du navigateur" : "The browser local cache"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "L'encodage positionnel (RoPE) injecte l'information d’ordre dans les vecteurs d'attention." : "Positional embeddings inject token order signals directly into attention calculations."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Pré-entraînement Supervisé & Fine-Tuning LoRA / QLoRA" : "Lesson 4: Supervised Pre-training & Efficient Fine-Tuning (LoRA / QLoRA)",
              content: isFrench
                ? "Le pré-entraînement apprend la structure de la langue sur des pétaoctets de texte. Le fine-tuning avec LoRA (Low-Rank Adaptation) permet d'adapter des modèles géants en n'entraînant qu'une fraction (0,1%) des poids."
                : "Pre-training acquires broad language understanding from massive corpora. Low-Rank Adaptation (LoRA) fine-tunes large foundation models by inserting trainable rank-decomposition matrices.",
              keyPoints: [
                isFrench ? "LoRA : Réduire le besoin en mémoire VRAM lors du fine-tuning" : "LoRA: Fine-tune 70B parameter models on a single consumer GPU",
                isFrench ? "Quantification 4-bit (QLoRA) : Charger les poids en précision NF4" : "4-bit Quantization (QLoRA): Compress model weights into NF4 precision",
                isFrench ? "Spécialisation Domaine : Adapter l'IA au vocabulaire médical, juridique ou dev" : "Domain Adaption: Tailor models to specialized medical, legal, or code tasks"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : Alignement par RLHF & Direct Preference Optimization (DPO)" : "Lesson 5: Human Alignment: RLHF & Direct Preference Optimization (DPO)",
              content: isFrench
                ? "Pour rendre un LLM inoffensif et utile (Helpful, Harmless, Honest), on applique l'alignement par préférence humaine (RLHF ou DPO). DPO élimine le besoin d'un modèle de récompense séparé."
                : "Foundation LLMs are aligned to human intent using Reinforcement Learning from Human Feedback (RLHF) and Direct Preference Optimization (DPO), ensuring answers are helpful, accurate, and safe.",
              keyPoints: [
                isFrench ? "Paires de préférences : Entraîner le modèle sur des choix A vs B" : "Preference Pairs: Train models on preferred vs dispreferred text pairs",
                isFrench ? "DPO : Dérivation directe sans modèle de récompense PPO complexe" : "DPO Advantage: Direct mathematical loss function replaces complex PPO reward models",
                isFrench ? "Safety Guardrails : Éviter les réponses toxiques ou hallucinées" : "Safety Guardrails: Mitigate adversarial prompts and toxic output generation"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Inférence Haute Performance (vLLM, TensorRT-LLM & Speculative Decoding)" : "Lesson 6: High-Performance Inference: vLLM, PagedAttention & Speculative Decoding",
              content: isFrench
                ? "Le déploiement industriel exige de servir des milliers de requêtes par seconde. vLLM et PagedAttention gèrent dynamiquement la mémoire cache KV pour diviser par 4 la latence d'inférence."
                : "Production AI serving demands high throughput. Frameworks like vLLM use PagedAttention to manage KV cache memory dynamically, achieving 4x throughput boosts in enterprise production.",
              keyPoints: [
                isFrench ? "PagedAttention : Éliminer la fragmentation de la VRAM GPU" : "PagedAttention: Eliminates GPU VRAM memory fragmentation for KV cache",
                isFrench ? "Speculative Decoding : Utiliser un petit modèle pour accélérer le grand" : "Speculative Decoding: Small draft model accelerates token generation speed",
                isFrench ? "TTFT (Time to First Token) : Optimiser le délai avant le premier token" : "TTFT Metric: Minimize latency before the first generated token streams"
              ],
              miniQuiz: {
                question: isFrench ? "Quel est le principal avantage de la technique LoRA pour le fine-tuning des LLMs ?" : "What is the primary operational benefit of Low-Rank Adaptation (LoRA) when fine-tuning foundation LLMs?",
                options: [
                  isFrench ? "Permettre l'entraînement en n'ajustant qu'une fraction minime des poids, réduisant la VRAM nécessaire" : "Fine-tuning models by training under 1% of total weights, dramatically cutting GPU memory costs",
                  isFrench ? "Effacer complètement la mémoire du réseau de neurones" : "Completely erasing the weights and memory of the neural network",
                  isFrench ? "Accélérer la vitesse d'affichage des écrans LCD" : "Accelerating standard LCD monitor refresh rates",
                  isFrench ? "Convertir le code TypeScript en binaire C++" : "Transpiling TypeScript code to raw C++ binary"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "LoRA injecte des petites matrices réductrices, permettant d'adapter de grands modèles sans réentraîner tous les paramètres." : "LoRA freezes original weights and trains lightweight adapter matrices, saving up to 90% GPU memory."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Quelle architecture et technique permettent de servir un LLM en production à haut débit avec une empreinte mémoire optimale ?" : "Which combined architectural stack provides maximum token serving throughput and lowest latency in production?",
            options: [
              isFrench ? "Moteur d'inférence vLLM avec PagedAttention et quantification des poids" : "vLLM inference engine with PagedAttention KV caching and quantized model weights",
              isFrench ? "Récompenser manuellement chaque token généré sur papier" : "Manually evaluating generated text tokens on paper after generation",
              isFrench ? "Multiplier le nombre d'images PNG enregistrées sur le serveur" : "Increasing static image file uploads on local web servers",
              isFrench ? "Recharger la page HTML à chaque mot produit par le modèle" : "Reloading the HTML web page on every generated word token"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "L'association de vLLM, PagedAttention et de la quantification est l'état de l'art pour servir des LLMs à l'échelle industrielle." : "Combining vLLM, PagedAttention, and model weight quantization represents the modern gold standard for high-throughput AI serving."
          }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Vector Embeddings, Bases Vectorielles & Pipeline RAG" : "2. Vector Embeddings, Vector DBs & RAG Architecture",
          summary: isFrench ? "Concevoir des systèmes RAG (Retrieval-Augmented Generation) pour alimenter les LLMs avec les données privées de votre entreprise." : "Design production-grade Retrieval-Augmented Generation pipelines connecting vector databases with enterprise LLMs.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : Représentations Vectorielles & Espace Latent Dense" : "Lesson 1: Dense Vector Embeddings & Semantic Similarity Distances",
              content: isFrench
                ? "Les modèles d'embedding transforment des mots, phrases ou documents en vecteurs numériques denses (ex: 1536 dimensions). La proximité dans l'espace latent mesure la ressemblance sémantique via la similitude cosinus."
                : "Embedding models convert text chunks into high-dimensional dense vectors. Geometric closeness within latent space measures semantic concept similarity using Cosine or Euclidean distance metrics.",
              keyPoints: [
                isFrench ? "Similitude Cosinus : Mesurer l'angle entre deux vecteurs sémantiques" : "Cosine Distance: Evaluates spatial vector angles to measure topic relevance",
                isFrench ? "Embeddings Multilingues : Rapprocher des concepts similaires dans différentes langues" : "Multilingual Embeddings: Align cross-language concepts within shared vector spaces",
                isFrench ? "Dimensionnalité : Équilibrer précision vectorielle et coûts de stockage" : "Dimensionality: Balance vector accuracy against database RAM overhead"
              ]
            },
            {
              title: isFrench ? "Leçon 2 : Découpage Stratégique des Documents (Chunking Strategies)" : "Lesson 2: Advanced Document Chunking & Text Splitting Tactics",
              content: isFrench
                ? "La qualité d'un système RAG dépend de sa stratégie de découpage. Analysez la taille optimale des blocs (chunks de 512 à 1024 tokens) et utilisez un chevauchement (overlap) pour ne pas perdre le contexte entre deux blocs."
                : "RAG accuracy depends heavily on document chunking. Optimize chunk size (512-1024 tokens) with overlap buffers to prevent context fragmentation across document split boundaries.",
              keyPoints: [
                isFrench ? "Recursive Character Splitting : Découper en préservant la structure des paragraphes" : "Recursive Splitting: Respects natural paragraph and Markdown header structures",
                isFrench ? "Semantic Chunking : Regrouper les phrases partageant une même continuité thématique" : "Semantic Chunking: Groups sentences based on embedding continuity shifts",
                isFrench ? "Chunk Overlap : Préserver 10 à 20% de contexte entre deux morceaux adjacents" : "Chunk Overlap: Retains 10-20% boundary context across adjacent chunks"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Bases de Données Vectorielles (Pinecone, Qdrant, ChromaDB, PGVector)" : "Lesson 3: Vector Databases & High-Dimensional HNSW Indexing",
              content: isFrench
                ? "Les bases vectorielles utilisent des algorithmes de recherche approximative des plus proches voisins (ANN - Approximate Nearest Neighbors) comme HNSW pour interroger des millions de vecteurs en quelques millisecondes."
                : "Vector databases utilize Approximate Nearest Neighbor (ANN) index algorithms like Hierarchical Navigable Small World (HNSW) to query millions of high-dimensional vectors in single-digit milliseconds.",
              keyPoints: [
                isFrench ? "Indexation HNSW : Graphe hiérarchique pour des requêtes sub-millisecondes" : "HNSW Indexing: Hierarchical graph structures deliver sub-millisecond lookups",
                isFrench ? "Filtrage Métadonnées : Combiner recherche vectorielle et filtres SQL (date, catégorie)" : "Metadata Filtering: Merges vector vector similarity with SQL structured filters",
                isFrench ? "Hybridation Dense / Sparse : Associer BM25 et Embeddings pour une précision maximale" : "Hybrid Search: Combines keyword BM25 with dense vector embeddings"
              ],
              miniQuiz: {
                question: isFrench ? "Quel algorithme d'indexation vectorielle est réputé pour sa vitesse de recherche ultra-rapide par graphes dans les bases de données vectorielles ?" : "Which vector indexing algorithm uses hierarchical graph navigation for sub-millisecond ANN vector search?",
                options: [
                  isFrench ? "HNSW (Hierarchical Navigable Small World)" : "HNSW (Hierarchical Navigable Small World)",
                  isFrench ? "Le tri à bulles (Bubble Sort)" : "Standard Bubble Sort algorithm",
                  isFrench ? "Le protocole SMTP" : "The SMTP email network protocol",
                  isFrench ? "La compression ZIP" : "ZIP archive file compression"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "HNSW construit un graphe à plusieurs niveaux permettant d'explorer rapidement les plus proches voisins sémantiques." : "HNSW creates multi-layer graph structures for fast approximate nearest neighbor vector retrieval."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Re-Ranking & Modèles Cross-Encoder" : "Lesson 4: Re-Ranking Architecture & Cross-Encoder Relevance Scoring",
              content: isFrench
                ? "Les bases vectorielles ramènent parfois des résultats hors-sujet. L'étape de Re-Ranking passe les 20 meilleurs candidats dans un modèle Cross-Encoder spécialisé pour ne transmettre au LLM que les 3 extraits les plus pertinents."
                : "Initial vector search can return noisy candidate matches. Re-ranking pipelines pass the top 20 retrieved candidates through a precision Cross-Encoder model to yield the top 3 contextual passages.",
              keyPoints: [
                isFrench ? "Bi-Encoder vs Cross-Encoder : Vitesse vs Précision extrême de ré-évaluation" : "Bi-Encoder vs Cross-Encoder: Fast lookup vector search vs deep joint relevance scoring",
                isFrench ? "Cohérence du Contexte : Réduire le bruit envoyé dans l'invite du LLM" : "Context Cleanliness: Minimizes irrelevant noise fed into LLM prompt windows",
                isFrench ? "Réduction des Coûts : Réduire le nombre de tokens d'entrée transmis au LLM" : "Token Savings: Reduces input context token counts, lowering API call fees"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : RAG Graphique (GraphRAG) & Connaissances Entreprise" : "Lesson 5: Knowledge Graphs, GraphRAG & Complex Multi-Hop Reasoning",
              content: isFrench
                ? "GraphRAG associe les bases de données vectorielles aux Graphes de Connaissances. Cela permet d'effectuer des raisonnements complexes multi-sauts (multi-hop reasoning) sur la structure globale des documents."
                : "GraphRAG combines vector databases with Knowledge Graphs (Entities + Relationships). This enables multi-hop relational queries across vast corporate document repositories.",
              keyPoints: [
                isFrench ? "Extraction d'Entités : Détecter automatiquement les personnes, concepts et liens" : "Entity Extraction: Automatically identifies key entities and semantic relations",
                isFrench ? "Multi-Hop Reasoning : Relier des informations dispersées dans 5 documents différents" : "Multi-Hop Reasoning: Connects facts spanning across disparate documents",
                isFrench ? "Synthèse Globale : Répondre à des questions synthétiques sur l'ensemble d'un corpus" : "Global Summarization: Answers high-level structural questions across entire datasets"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Évaluation du RAG (Ragas Framework & Hallucination Metrics)" : "Lesson 6: RAG Evaluation Frameworks: Ragas, Faithfulness & Context Recall",
              content: isFrench
                ? "Mesurer rigoureusement la qualité d'un RAG est indispensable. Utilisez le framework Ragas pour calculer l'exactitude des informations (Faithfulness), la pertinence du contexte (Context Relevance) et le rappel."
                : "Production RAG requires continuous telemetry metrics. Leverage evaluation frameworks like Ragas to quantify Answer Faithfulness, Context Precision, and Noise Suppression scores.",
              keyPoints: [
                isFrench ? "Faithfulness Metric : Vérifier que chaque affirmation provient bien du document" : "Faithfulness Metric: Ensures generated statements originate from retrieved context",
                isFrench ? "Context Precision : Mesurer la proportion de texte utile récupéré" : "Context Precision: Quantifies the ratio of relevant vs noisy context tokens retrieved",
                isFrench ? "Détection d'Hallucinations : Alerter automatiquement en cas d'invention" : "Hallucination Alerts: Automated checks trigger when claims lack context backing"
              ],
              miniQuiz: {
                question: isFrench ? "Quelle étape dans un pipeline RAG avancé permet de réordonner avec une extrême précision les documents récupérés avant de les envoyer au LLM ?" : "Which component in an advanced RAG pipeline precision-scores and reorders retrieved context chunks before passing them to the LLM?",
                options: [
                  isFrench ? "Le Re-Ranker (Cross-Encoder)" : "The Re-Ranker (Cross-Encoder)",
                  isFrench ? "Le serveur FTP" : "The local FTP storage server",
                  isFrench ? "L'antivirus système" : "The desktop operating system antivirus",
                  isFrench ? "Le pilote de la carte réseau" : "The network interface hardware driver"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Le Re-Ranker utilise un modèle Cross-Encoder pour mesurer la pertinence exacte entre la question et les extraits." : "Cross-Encoder Re-Rankers evaluate full question-passage attention, delivering superior context ranking."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Comment garantir l'absence d'hallucinations et la pertinence maximale des réponses d'un RAG en entreprise ?" : "How can an enterprise ensure zero hallucinations and maximum answer relevance within a RAG architecture?",
            options: [
              isFrench ? "Associer le chunking sémantique, un index HNSW hybride, un Re-Ranker et l'évaluation continue Ragas" : "Combine semantic chunking, hybrid HNSW search, Cross-Encoder re-ranking, and Ragas automated metrics",
              isFrench ? "Envoyer 500 documents complets non découpés dans un seul prompt sans filtrage" : "Passing 500 raw unchunked PDF documents into a single prompt without any vector filtering",
              isFrench ? "Désactiver la base de données vectorielle et faire deviner les réponses par le modèle" : "Disabling vector storage and letting the model guess internal corporate facts",
              isFrench ? "Utiliser un fichier texte plat unique sans aucun embedding" : "Using a single flat text file stored without vector embeddings"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "L'association du chunking intelligent, de la recherche hybride, du re-ranking et du suivi Ragas forme le standard RAG de niveau entreprise." : "Hybrid retrieval paired with Cross-Encoder re-ranking and Ragas telemetry underpins enterprise production RAG."
          }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Agents IA Autonomes, Execution d'Outils & Orchestration Enterprise" : "3. Autonomous AI Agents, Tool Execution & Enterprise Orchestration",
          summary: isFrench ? "Concevoir des agents IA capables de planifier, d'exécuter des outils externes, de corriger leurs erreurs et de collaborer en réseau." : "Build autonomous tool-calling AI agents, multi-agent networks, human-in-the-loop controls, and enterprise guardrails.",
          sections: [
            {
              title: isFrench ? "Leçon 1 : La Boucle de Raisonnement Agentique (ReAct & Chain-of-Thought)" : "Lesson 1: Agentic Reasoning Loops: ReAct & Plan-And-Solve Frameworks",
              content: isFrench
                ? "Contrairement aux chatbots statiques, les agents IA fonctionnent selon une boucle de raisonnement dynamique ReAct (Thought -> Action -> Observation). L'agent formule une pensée, choisit un outil, observe le résultat et ajuste sa stratégie."
                : "Unlike static completion APIs, autonomous agents operate on iterative ReAct loops (Reasoning + Acting). Agents evaluate states, select tools, observe outputs, and adjust strategy dynamically until tasks resolve.",
              keyPoints: [
                isFrench ? "Boucle ReAct : Pensée -> Action -> Observation -> Synthèse" : "ReAct Loop: Thought -> Action -> Observation -> Final Answer cycle",
                isFrench ? "Auto-Correction : Analyser les erreurs d'exécution pour retenter avec un paramètre corrigé" : "Self-Correction: Parses code error traces and retries alternative parameters",
                isFrench ? "Planification dynamique : Décomposer un problème complexe en sous-tâches" : "Task Decomposition: Breaks high-level prompts into executable sub-task graphs"
              ]
            },
            {
              title: isFrench ? "Leçon 2 : Invocation Dynamique d'Outils & Function Calling" : "Lesson 2: Native Function Calling, Structured Outputs & API Tool Execution",
              content: isFrench
                ? "Le Function Calling permet au LLM d'émettre des structures JSON valides contenant le nom de la fonction et ses arguments précis. L'environnement exécute l'API et réinjecte le résultat au modèle."
                : "Native Function Calling enables LLMs to emit deterministic JSON payloads matching API schemas. The execution runtime calls the API, returns external payload results, and resumes model reasoning.",
              keyPoints: [
                isFrench ? "Schéma JSON Schema : Définir la signature exacte et les types attendus des outils" : "JSON Schema: Defines strict parameter types, descriptions, and required keys",
                isFrench ? "Exécution Côté Serveur : Sécuriser les clés d'API et les autorisations d'outils" : "Server Execution: Secures API credentials and restricts unauthorized system access",
                isFrench ? "Valideurs Pydantic / Zod : Garantir le typage strict des réponses érodées" : "Schema Validation: Zod / Pydantic frameworks guarantee runtime type safety"
              ]
            },
            {
              title: isFrench ? "Leçon 3 : Orchestration Multi-Agents & Graph Workflows (LangGraph, AutoGen)" : "Lesson 3: Multi-Agent Architectures & Directed Graph Workflows (LangGraph)",
              content: isFrench
                ? "Pour les tâches d'envergure, un agent unique devient inefficace. Structurez un réseau multi-agents où des agents spécialisés (ex: Chercheur, Rédacteur, Relecteur) collaborent via un graphe d'états orienté."
                : "Complex business workflows demand specialized multi-agent architectures. Frameworks like LangGraph structure multi-agent networks using directed state graphs, cycle loops, and persistent state nodes.",
              keyPoints: [
                isFrench ? "Graphe d'États : Gérer la mémoire partagée et les transitions entre agents" : "State Graphs: Maintains shared execution memory across agent node handoffs",
                isFrench ? "Agent Supervisor : Un agent maître distribue et valide le travail des sous-agents" : "Supervisor Agents: Router agents delegate sub-tasks and audit worker output quality",
                isFrench ? "Human-in-the-Loop : Mettre en pause le graphe pour exiger une validation humaine" : "Human-in-the-Loop: Pauses execution graphs at critical points for human approval"
              ],
              miniQuiz: {
                question: isFrench ? "Comment appelle-t-on le modèle de conception où un agent IA formule une pensée, exécute un outil, observe le résultat et ajuste sa réponse ?" : "What design pattern describes an AI agent forming a reasoning step, executing a tool call, observing the output, and adjusting its next step?",
                options: [
                  isFrench ? "La boucle ReAct (Reasoning + Acting)" : "The ReAct Loop (Reasoning + Acting)",
                  isFrench ? "L'effet d'écho stéréo" : "Stereo audio echo effect",
                  isFrench ? "Le mode d'économie d'énergie" : "Battery power saving mode",
                  isFrench ? "L'extension de fichier CSS" : "CSS stylesheet file extension"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Le modèle ReAct (Reasoning + Acting) combine la planification réflexive et l'action concrète via des outils." : "The ReAct paradigm interleaves chain-of-thought reasoning with real-world tool execution."
              }
            },
            {
              title: isFrench ? "Leçon 4 : Mémoire Long-Terme, State Persistence & Profiling Agentique" : "Lesson 4: Agent Memory Systems: Short-Term, Long-Term & Epistemic State",
              content: isFrench
                ? "Les agents sophistiqués combinent une mémoire à court terme (fenêtre de contexte active), une mémoire épisodique (historique des sessions passées dans un vecteur DB) et une mémoire sémantique (préférences de l'utilisateur)."
                : "Advanced agents leverage tiered memory architectures: Short-term context memory, Episodic memory (past execution histories indexed in vector DBs), and Semantic memory (user preference profiles).",
              keyPoints: [
                isFrench ? "Mémoire Épisodique : Rappeler les solutions apportées lors de problèmes similaires" : "Episodic Memory: Recalls successful resolution strategies from previous sessions",
                isFrench ? "Mémoire Sémantique : Stocker les faits durables concernant l'utilisateur" : "Semantic Memory: Persists long-term facts, constraints, and user preferences",
                isFrench ? "Compression de Contexte : Résumer automatiquement l'historique trop long" : "Context Compression: Summarizes conversation history when approaching limit bounds"
              ]
            },
            {
              title: isFrench ? "Leçon 5 : Sécurité des Agents, Prompt Injection & Guardrails" : "Lesson 5: Agentic Security: Guardrails, Indirect Prompt Injection & Sanitization",
              content: isFrench
                ? "Donner la capacité d'exécuter des actions à une IA comporte des risques. Protégez vos agents contre les injections de prompts indirectes (données malveillantes lues dans un email ou un fichier) grâce à des barrières de sécurité stricts."
                : "Granting execution capabilities to LLMs introduces security risks. Guard against indirect prompt injection (malicious commands embedded in external retrieved text) using isolation layers and input sanitizers.",
              keyPoints: [
                isFrench ? "Indirect Prompt Injection : Neutraliser les commandes cachées dans les documents" : "Indirect Injection Defense: Sanitizes untrusted text before agent evaluation",
                isFrench ? "Privilège Minimum : Restreindre les droits d'accès des outils (lecture seule)" : "Least Privilege: Restricts tool execution scope (e.g. read-only database queries)",
                isFrench ? "Guardrails en Entrée/Sortie : Valider la sécurité des requêtes et réponses" : "Input/Output Guardrails: Intercepts toxic inputs or unintended tool calls"
              ]
            },
            {
              title: isFrench ? "Leçon 6 : Déploiement Entreprise, Monitoring OpenTelemetry & Tracing" : "Lesson 6: Enterprise Production Deployment, Observability & OpenTelemetry Tracing",
              content: isFrench
                ? "Déployer des agents en production nécessite une observabilité totale. Utilisez des outils comme LangSmith, Phoenix ou OpenTelemetry pour tracer chaque étape du graphe, mesurer le coût en tokens et déboguer en direct."
                : "Enterprise agent deployment requires end-to-end observability. Deploy tracing solutions like LangSmith, Arize Phoenix, or OpenTelemetry to inspect node execution paths, token costs, and latency bottlenecks.",
              keyPoints: [
                isFrench ? "Traces de Graphe : Visualiser le cheminement exact des décisions de l'agent" : "Execution Traces: Visualizes step-by-step agent decisions and tool parameters",
                isFrench ? "Suivi des Coûts : Suivre l'utilisation des tokens par utilisateur et par tâche" : "Cost Telemetry: Tracks token usage and compute cost per user execution run",
                isFrench ? "Tests de Régression : Valider que les mises à jour n'altèrent pas le taux de succès" : "Regression Evaluation: Automated evaluation suites prevent performance drift"
              ],
              miniQuiz: {
                question: isFrench ? "Pourquoi la supervision 'Human-in-the-Loop' est-elle recommandée pour les agents IA effectuant des actions critiques (ex: virements bancaires, envoi d'emails) ?" : "Why is Human-in-the-Loop oversight essential for autonomous AI agents performing high-stakes actions?",
                options: [
                  isFrench ? "Elle exige une validation humaine explicite avant d'exécuter des actions irréversibles" : "It requires explicit human verification before executing high-risk, irreversible operations",
                  isFrench ? "Elle permet à l'ordinateur de s'éteindre pendant la nuit" : "It allows the server computer to power off overnight",
                  isFrench ? "Elle efface tous les comptes d'utilisateurs automatiquement" : "It automatically purges all user accounts from the database",
                  isFrench ? "Elle bloque l'accès à la connexion internet" : "It prevents the application from connecting to the internet"
                ],
                correctAnswer: 0,
                explanation: isFrench ? "Human-in-the-Loop garantit qu'aucune action irréversible ou coûteuse n'est exécutée sans approbation humaine." : "Human-in-the-Loop inserts safety approval gates prior to executing sensitive or irreversible operations."
              }
            }
          ],
          quiz: {
            question: isFrench ? "Quelle architecture globale garantit un agent IA autonome hautement performant, sécurisé et prêt pour l'entreprise ?" : "Which integrated architectural design delivers a secure, highly capable enterprise-ready autonomous AI agent system?",
            options: [
              isFrench ? "Un réseau multi-agents LangGraph avec Function Calling strict, barrières de sécurité, mémoire persistante et tracing OpenTelemetry" : "A LangGraph multi-agent graph with strict Function Calling, security guardrails, tiered memory, and OpenTelemetry tracing",
              isFrench ? "Un simple prompt de 5 lignes sans aucun outil ni contrôle de sécurité" : "A single 5-line prompt without any tool connections or security boundary controls",
              isFrench ? "Demander à l'utilisateur de saisir son mot de passe dans la console navigateur" : "Prompting users to manually enter system passwords in browser developer console logs",
              isFrench ? "Enregistrer les conversations dans des fichiers images JPEG sur le bureau" : "Saving chat logs inside static JPEG image files on local desktop folders"
            ],
            correctAnswer: 0,
            explanation: isFrench ? "L'association d'une orchestration graphique, du typage d'outils, de la mémoire et de l'observabilité crée le standard des agents IA d'entreprise." : "Combining directed graph orchestration, typed function calling, memory, and observability underpins production AI agents."
          }
        }
      ]
    };
  }

  if (cId.includes("fintech") || cId.includes("finance")) {
    return {
      id: "fintech_native",
      title: isFrench ? "ProPath École d'Apprentissage - FinTech & Analyse Quantitative" : "ProPath Learning School - FinTech & Quantitative Risk",
      industry: "Financial Technology",
      aiTutorPersona: "Elena Rostova (Quantitative Risk Lead)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Trading Algorithmique & Modèles Quantitatifs" : "1. Algorithmic Trading & Quantitative Models",
          summary: isFrench ? "Architecture des systèmes à haute fréquence et gestion du risque." : "High-frequency architecture and risk management.",
          sections: [{ title: "Execution Engines", content: "Understanding market microstructure, order books, and latency optimization." }],
          quiz: { question: "What is a primary goal of quantitative risk models?", options: ["Measuring portfolio Value-at-Risk (VaR)", "Manual chart drawing", "Printing physical receipts", "Decreasing bandwidth"], correctAnswer: 0, explanation: "VaR estimates maximum expected portfolio loss." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Protocoles DeFi & Smart Contracts" : "2. DeFi Protocols & Smart Contracts",
          summary: isFrench ? "Finance décentralisée et sécurité des contrats intelligents." : "Decentralized liquidity and smart contract audits.",
          sections: [{ title: "Liquidity Pools", content: "Automated Market Makers (AMMs) use constant product formulas (x * y = k)." }],
          quiz: { question: "Which formula governs Automated Market Makers like Uniswap v2?", options: ["x * y = k", "E = mc^2", "a^2 + b^2 = c^2", "P = IV"], correctAnswer: 0, explanation: "The constant product formula maintains pool balance." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Réglementation FinTech & Analytics Temps Réel" : "3. FinTech Regulation & Real-Time Analytics",
          summary: isFrench ? "Conformité anti-blanchiment et surveillance réglementaire." : "AML/KYC automation and transaction monitoring.",
          sections: [{ title: "RegTech Automation", content: "Using machine learning to flag abnormal transaction vectors in real-time." }],
          quiz: { question: "What is RegTech designed to solve?", options: ["Automating regulatory compliance and reporting", "Building social networks", "Designing GPUs", "Cooking recipes"], correctAnswer: 0, explanation: "RegTech uses tech to streamline compliance." }
        }
      ]
    };
  }

  if (cId.includes("smartgrid") || cId.includes("energy")) {
    return {
      id: "smartgrid_native",
      title: isFrench ? "ProPath École d'Apprentissage - Énergie Propre & Réseaux Intelligents" : "ProPath Learning School - Smart Grid & Clean Energy",
      industry: "Clean Energy & Smart Grids",
      aiTutorPersona: isFrench ? "Tuteur ProPath" : "ProPath Tutor",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Micro-réseaux & Stockage BESS" : "1. Microgrids & BESS Energy Storage",
          summary: isFrench ? "Intégration du stockage par batterie à grande échelle." : "Utility-scale battery energy storage systems.",
          sections: [{ title: "BESS Management", content: "Optimizing lithium and flow battery charge/discharge cycles against peak demand." }],
          quiz: { question: "What is BESS in clean energy infrastructure?", options: ["Battery Energy Storage System", "Basic Electrical Solar Setup", "Biomass Energy Supply Standard", "Building Emergency Power"], correctAnswer: 0, explanation: "BESS buffers intermittent solar/wind generation." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Onduleurs Intelligents & Stabilisation" : "2. Smart Inverters & Grid Stability",
          summary: isFrench ? "Maintien de la fréquence et de la tension de réseau." : "Frequency containment and grid synthetic inertia.",
          sections: [{ title: "Grid-Forming Inverters", content: "Providing virtual inertia to offset loss of physical spinning generators." }],
          quiz: { question: "Why are grid-forming inverters essential for high-renewable grids?", options: ["They provide synthetic inertia and voltage support", "They burn coal faster", "They block internet traffic", "They increase line losses"], correctAnswer: 0, explanation: "Grid-forming inverters maintain voltage frequency without spinning turbines." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Réseaux Électriques Intelligents & Crédits Carbone" : "3. Decentralized Energy & Carbon Credit Systems",
          summary: isFrench ? "Traçabilité de l'énergie propre et marchés d'échange." : "Clean energy origin certificates and carbon accounting.",
          sections: [{ title: "Carbon Auditing", content: "Verifying hourly clean energy matching for enterprise sustainability." }],
          quiz: { question: "What does 24/7 carbon matching track?", options: ["Hourly alignment of clean generation with energy consumption", "Annual average solar output", "Distance to power plants", "Fuel prices"], correctAnswer: 0, explanation: "24/7 matching verifies zero-carbon power hour by hour." }
        }
      ]
    };
  }

  if (cId.includes("art")) {
    return {
      id: "art_native",
      title: isFrench ? "ProPath École d'Apprentissage - Beaux-Arts & Direction Artistique" : "ProPath Learning School - Fine Arts & Creative Media Direction",
      industry: "Fine Arts & Visual Media",
      aiTutorPersona: "Claire Dupont (Artistic Director)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Théorie des Couleurs & Composition Spatiale" : "1. Color Theory & Spatial Composition",
          summary: isFrench ? "Harmonie visuelle, contraste et direction du regard." : "Visual harmony, contrast ratios, and visual pacing.",
          sections: [{ title: "Visual Rhythm", content: "Guiding the viewer's focal progression through weight and negative space." }],
          quiz: { question: "What is negative space in fine art composition?", options: ["The breathing area around primary subjects", "Dark black background paint", "An error in canvas sizing", "Transparent glass"], correctAnswer: 0, explanation: "Negative space gives emphasis and rhythm to the visual subject." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Curation & Direction d'Exposition" : "2. Gallery Curation & Spatial Exhibition",
          summary: isFrench ? "Scénographie et narration visuelle en galerie." : "Gallery lighting, spatial choreography, and narrative sequencing.",
          sections: [{ title: "Exhibition Choreography", content: "Structuring physical and virtual gallery flows to evoke emotional progression." }],
          quiz: { question: "What is the primary role of a gallery curator?", options: ["Structuring the thematic and visual narrative of artwork", "Selling physical frames", "Cleaning gallery floors", "Building websites"], correctAnswer: 0, explanation: "Curators select and frame artworks into cohesive cultural narratives." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Brand Aesthetics & Média Créatif" : "3. Brand Aesthetics & Creative Direction",
          summary: isFrench ? "Direction artistique de marque et identité visuelle." : "Translating artistic heritage into modern visual brand languages.",
          sections: [{ title: "Creative Branding", content: "Synthesizing typography, palette, and imagery into unforgettable brand identities." }],
          quiz: { question: "What defines strong creative direction?", options: ["Cohesive visual identity aligned with story and purpose", "Using maximum contrasting colors randomly", "Copying competitor logos", "Omitting brand assets"], correctAnswer: 0, explanation: "Creative direction unifies story, aesthetics, and user connection." }
        }
      ]
    };
  }

  if (cId.includes("electrical")) {
    return {
      id: "electrical_native",
      title: isFrench ? "ProPath École d'Apprentissage - Automatisme & Électrotechnique Industrielle" : "ProPath Learning School - Industrial Automation & Electrical Systems",
      industry: "Electrical Engineering",
      aiTutorPersona: "Ingénieur Jean-Luc (Industrial Automation Lead)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Programmation API & Sécurité des Câblages" : "1. PLC Programming & Wiring Safety Protocols",
          summary: isFrench ? "Logique Ladder, relais et normes de sécurité industrielle." : "Ladder logic, industrial relays, and safety interlocks.",
          sections: [{ title: "Ladder Logic Foundations", content: "Designing fail-safe control circuits for industrial automated lines." }],
          quiz: { question: "What does PLC stand for in industrial automation?", options: ["Programmable Logic Controller", "Power Line Converter", "Primary Electrical Circuit", "Portable Lighting Cable"], correctAnswer: 0, explanation: "PLCs execute real-time logic for factory machinery." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Triphasé, Transformateurs & Variateurs VFD" : "2. Three-Phase Power & Variable Frequency Drives",
          summary: isFrench ? "Gestion des moteurs industriels et régulation de vitesse." : "Motor speed control and AC drive efficiency.",
          sections: [{ title: "VFD Motor Control", content: "Modulating frequency to control torque and save energy in heavy pumps and conveyors." }],
          quiz: { question: "What is the primary benefit of a VFD?", options: ["Precise motor speed control and reduced energy spikes", "Direct current generation", "Heating electrical panels", "Lowering voltage to zero"], correctAnswer: 0, explanation: "VFDs adjust motor frequency dynamically for optimal speed." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Systèmes SCADA & Supervision Intelligente" : "3. SCADA Supervision & Smart Building Systems",
          summary: isFrench ? "Supervision industrielle et télémétrie IoT." : "Industrial telemetry, alarm logging, and automated diagnostics.",
          sections: [{ title: "SCADA Architecture", content: "Centralizing plant telemetry to prevent unplanned downtime." }],
          quiz: { question: "What is SCADA used for?", options: ["Supervisory Control and Data Acquisition in industrial facilities", "Designing printed posters", "Editing video clips", "Calculating tax returns"], correctAnswer: 0, explanation: "SCADA systems monitor and control industrial operations centrally." }
        }
      ]
    };
  }

  if (cId.includes("carpentry")) {
    return {
      id: "carpentry_native",
      title: isFrench ? "ProPath École d'Apprentissage - Charpenterie Artisanale & Éco-Construction" : "ProPath Learning School - Artisanal Carpentry & Sustainable Construction",
      industry: "Artisanal Carpentry & Wood Engineering",
      aiTutorPersona: "Master Carpenter Thomas",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Science du Bois & Assemblages de Précision" : "1. Wood Science & Precision Mortise-Tenon Joinery",
          summary: isFrench ? "Sélection des essences, fil du bois et assemblages traditionnels." : "Timber grain dynamics, moisture content, and joinery mechanics.",
          sections: [{ title: "Traditional Joinery", content: "Crafting interlocking joints without metal fasteners for century-long durability." }],
          quiz: { question: "Why is grain orientation vital in timber joinery?", options: ["It dictates load capacity and moisture movement resistance", "It changes wood color instantly", "It lowers wood weight", "It prevents dust"], correctAnswer: 0, explanation: "Aligning grain prevents split stress under seasonal humidity changes." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Charpente Lourde & Distribution des Charges" : "2. Heavy Timber Framing & Structural Load Bearing",
          summary: isFrench ? "Calcul de fermes de charpente et résistance des structures." : "Truss geometry, tension members, and roof pitch distribution.",
          sections: [{ title: "Truss Engineering", content: "Distributing roof snow and wind loads safely into foundation posts." }],
          quiz: { question: "Which shape provides optimal rigid stability in timber framing?", options: ["Triangle", "Square", "Hexagon", "Circle"], correctAnswer: 0, explanation: "Triangulation prevents shear collapse under load." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Éco-Construction & Restauration Patrimoniale" : "3. Sustainable Timber Architecture & Restoration",
          summary: isFrench ? "Matériaux écologiques et restauration d'ouvrages anciens." : "Low-carbon building techniques and heritage timber conservation.",
          sections: [{ title: "Sustainable Timber", content: "Sourcing certified sustainably harvested wood for carbon-neutral structures." }],
          quiz: { question: "Why is timber considered a low-carbon building material?", options: ["Trees sequester atmospheric carbon dioxide as they grow", "It requires extreme heat to produce", "It emits ozone", "It never degrades"], correctAnswer: 0, explanation: "Wood stores captured carbon throughout the lifespan of the building." }
        }
      ]
    };
  }

  if (cId.includes("automotive")) {
    return {
      id: "automotive_native",
      title: isFrench ? "ProPath École d'Apprentissage - Motorisation Électrique & Diagnostic Auto" : "ProPath Learning School - Electric Vehicle Drivetrains & Diagnostics",
      industry: "Automotive Technology",
      aiTutorPersona: "Professor Vance (Automotive Engineering Lead)",
      chapters: [
        {
          id: "ch1",
          title: isFrench ? "1. Diagnostic Batterie Haute-Tension VE" : "1. EV High-Voltage Battery Pack Diagnostics",
          summary: isFrench ? "Gestion thermique, cellules Li-ion et sécurité haute tension." : "Thermal management, cell balancing, and safety isolations.",
          sections: [{ title: "BMS Cell Balancing", content: "Monitoring individual cell voltages to maximize range and battery longevity." }],
          quiz: { question: "What is the primary function of an EV Battery Management System (BMS)?", options: ["Monitoring cell state, temperature, and voltage safety", "Changing tire pressure", "Controlling radio volume", "Painting car panels"], correctAnswer: 0, explanation: "The BMS safeguards thermal health and prevents overcharge." }
        },
        {
          id: "ch2",
          title: isFrench ? "2. Bus CAN, Reprogrammation ECU & Capteurs" : "2. CAN-Bus Telemetry & ECU Calibration",
          summary: isFrench ? "Réseau de bord, oscilloscopes et analyse des trames." : "Multiplex network diagnostics and digital sensor calibration.",
          sections: [{ title: "CAN-Bus Diagnostics", content: "Decoding high-speed differential signals between power controllers and sensors." }],
          quiz: { question: "What does CAN stand for in automotive systems?", options: ["Controller Area Network", "Central Auto Node", "Car Automation Network", "Computerized Engine Name"], correctAnswer: 0, explanation: "CAN-Bus enables electronic modules to communicate without dedicated wires." }
        },
        {
          id: "ch3",
          title: isFrench ? "3. Groupes Motopropulseurs & Systèmes Électriques" : "3. EV Motor Inverters & Powertrain Dynamics",
          summary: isFrench ? "Inverseurs de puissance SiC et freinage régénératif." : "Silicon carbide inverters, permanent magnet AC motors, and regen braking.",
          sections: [{ title: "Regenerative Braking", content: "Converting kinetic deceleration back into electrical energy stored in the battery." }],
          quiz: { question: "How does regenerative braking benefit EV efficiency?", options: ["It recaptures deceleration kinetic energy into battery charge", "It heats the exhaust pipe", "It turns off headlights", "It pumps air into tires"], correctAnswer: 0, explanation: "Regen braking recovers up to 80% of braking energy." }
        }
      ]
    };
  }

  // Universal Industry Fallback
  const cleanTitle = courseId.replace(/_/g, " ").replace("native", "").trim();
  const formattedTitle = cleanTitle ? cleanTitle.toUpperCase() : "CAREER SPECIALIZATION";

  return {
    id: courseId,
    title: isFrench 
      ? `ProPath École d'Apprentissage - Spécialisation (${formattedTitle})`
      : `ProPath Learning School - Professional Specialization (${formattedTitle})`,
    industry: formattedTitle,
    aiTutorPersona: "ProPath Senior Faculty Advisor",
    chapters: [
      {
        id: "ch1",
        title: isFrench ? "1. Fondations & Principes Directeurs" : "1. Industry Foundations & Core Methodologies",
        summary: isFrench ? "Maîtriser les standards fondamentaux de la profession." : "Master essential professional concepts, tools, and practices.",
        sections: [{ title: "Core Architecture", content: "Understanding structural workflows, key terminology, and quality benchmarks." }],
        quiz: { question: "What is the key factor in mastering this domain?", options: ["Applying structured industry principles and continuous practice", "Random guessing", "Skipping fundamentals", "Ignoring standard protocols"], correctAnswer: 0, explanation: "Methodical execution guarantees long-term mastery." }
      },
      {
        id: "ch2",
        title: isFrench ? "2. Pratiques Avancées & Cas Concrets" : "2. Applied Execution & Advanced Workflows",
        summary: isFrench ? "Mise en pratique sur des cas réels du secteur." : "Solving complex real-world challenges with modern tools.",
        sections: [{ title: "Practical Optimization", content: "Implementing scalable strategies to streamline daily productivity and quality." }],
        quiz: { question: "How do leaders approach operational challenges?", options: ["By analyzing root causes and implementing systematic protocols", "By ignoring errors", "By reducing safety checks", "By guessing outcomes"], correctAnswer: 0, explanation: "Root-cause analysis prevents recurring failures." }
      },
      {
        id: "ch3",
        title: isFrench ? "3. Leadership, Innovation & Certification" : "3. Innovation, Leadership & Master Project",
        summary: isFrench ? "Projets de synthèse et validation des compétences." : "Final capstone project validation and industry certification.",
        sections: [{ title: "Capstone Validation", content: "Demonstrating job-ready expertise through a real-world capstone project." }],
        quiz: { question: "What is required to achieve ProPath Master Certification?", options: ["Completing all module quizzes and capstone project validation", "Reading only the title", "Closing the page", "Leaving answers blank"], correctAnswer: 0, explanation: "Certification validates full practical mastery of all modules." }
      }
    ]
  };
}
