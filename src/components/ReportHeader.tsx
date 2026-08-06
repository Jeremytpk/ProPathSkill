import React, { useState } from "react";
import { CareerReport, CareerTrack } from "../types";
import { saveReport } from "../lib/firebase";
import { Share2, FileText, Clipboard, Check, Sparkles, RefreshCw, Printer } from "lucide-react";

interface ReportHeaderProps {
  report: CareerReport | null;
  onRestart: () => void;
  isSharedView?: boolean;
  selectedLanguage?: "english" | "french";
}

export function ReportHeader({ report, onRestart, isSharedView = false, selectedLanguage = "english" }: ReportHeaderProps) {
  const [sharing, setSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!report) return null;

  const isFrench = selectedLanguage === "french";

  // Generate Markdown summary of the report
  const generateMarkdownReport = (rep: CareerReport) => {
    let md = `# ${isFrench ? "DOSSIER D'ORIENTATION PROFESSIONNELLE PROPATH" : "PROPATH CAREER ALIGNMENT DOSSIER"}\n`;
    md += `*${isFrench ? "Généré dynamiquement le" : "Generated dynamically on"} ${new Date(rep.createdAt).toLocaleDateString()}*\n\n`;
    md += `## 1. ${isFrench ? "PROFIL D'ÉVALUATION D'APTITUDES" : "ADAPTIVE APTITUDE ASSESSMENT PROFILE"}\n`;
    md += `- ${isFrench ? "Secteurs cibles sélectionnés :" : "Selected Target Industries:"} ${rep.answers.selectedSectors.map(s => s.toUpperCase()).join(", ")}\n`;
    md += `- ${isFrench ? "Scénarios complétés :" : "Completed scenarios:"} ${Object.keys(rep.answers.answers).length} ${isFrench ? "scénarios critiques cartographiés." : "critical scenarios mapped."}\n\n`;

    md += `## 2. ${isFrench ? "RECOMMANDATIONS ET TRAJECTOIRES À FORTE CROISSANCE" : "HIGH-GROWTH RECOMMENDATIONS & TIMELINES"}\n\n`;

    rep.recommendedTracks.forEach((track, idx) => {
      md += `### ${isFrench ? "PISTE" : "TRACK"} ${idx + 1}: ${track.title} (${track.category})\n`;
      md += `**${isFrench ? "Score d'adéquation :" : "Match Score:"}** ${track.matchScore}/10 | **${isFrench ? "Niveau de demande :" : "Demand Sector:"}** ${track.demandLevel}\n`;
      md += `**${isFrench ? "Description :" : "Description:"}** ${track.description}\n\n`;

      md += `#### ${isFrench ? "Progression salariale projetée sur 10 ans :" : "Projected 10-Year Salary Progression:"}\n`;
      track.salaryTimeline.forEach(s => {
        md += `- ${isFrench ? "Année" : "Year"} ${s.year} | ${s.role} : ${s.salary.toLocaleString()}\n`;
      });
      md += `\n`;

      md += `#### ${isFrench ? "Prévision d'évolution des compétences de base :" : "Core Skill Maturation Forecast:"}\n`;
      track.skillsPredicted.forEach(s => {
        md += `- ${s.name} : ${isFrench ? "Base" : "Baseline"} ${s.current}% → ${isFrench ? "Projeté" : "Projected"} ${s.predicted}% (5 ${isFrench ? "Ans" : "Years"})\n`;
      });
      md += `\n`;

      md += `#### ${isFrench ? "Feuille de route des certifications étape par étape :" : "Step-by-Step Credentials Roadmap:"}\n`;
      track.certificationRoadmap.forEach((cert, cidx) => {
        md += `${cidx + 1}. **${cert.name}** (${cert.provider}) - ${cert.difficulty} | ${isFrench ? "Durée :" : "Duration:"} ${cert.time}\n`;
      });
      md += `\n`;

      md += `#### ${isFrench ? "Parcours d'apprentissage sélectionnés :" : "Curated Educational Pathways:"}\n`;
      track.educationalResources.forEach(res => {
        md += `- [${res.name}](${res.link}) [${isFrench ? "Plateforme :" : "Platform:"} ${res.platform} | ${isFrench ? "Durée :" : "Duration:"} ${res.duration}]\n`;
      });
      md += `\n---\n\n`;
    });

    md += `## 3. ${isFrench ? "LISTE DES OBJECTIFS DE MENTORAT ACTIFS" : "ACTIVE MENTORSHIP GOALS CHECKLIST"}\n`;
    if (rep.mentorGoals.length === 0) {
      md += `${isFrench ? "Aucun objectif défini pour le moment." : "No goals defined yet."}\n`;
    } else {
      rep.mentorGoals.forEach(g => {
        md += `- [${g.completed ? "x" : " "}] [${g.category}] ${g.text}\n`;
      });
    }

    md += `\n\n*${isFrench ? "Plateforme d'Intelligence Vocationnelle ProPath. Dossier d'alignement certifié." : "ProPath Vocational Intelligence Platform. Alignment dossier secured and certified."}*`;
    return md;
  };

  // Share to Cloud
  const handleShareToCloud = async () => {
    setSharing(true);
    try {
      // Save full report to Firestore
      const id = await saveReport(report);
      if (id) {
        const baseUrl = window.location.origin + window.location.pathname;
        const url = `${baseUrl}?reportId=${id}`;
        setSharedUrl(url);
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport(report);
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 mb-8 print:hidden animate-fade-in">
      <div className="glass-card p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center lg:text-left">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-indigo-400">
              {isSharedView ? (isFrench ? "Dossier d'Orientation Partagé" : "Shared Vocational Dossier") : (isFrench ? "Évaluation Terminée" : "Assessment Complete")}
            </span>
            <h2 className="text-xl font-bold font-display text-white mt-0.5">
              {isSharedView ? (isFrench ? "Rapport d'Orientation Chargé" : "Loaded Career Alignment Report") : (isFrench ? "Votre Analyse d'Orientation est Prête" : "Your Vocational Analysis is Ready")}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSharedView 
                ? (isFrench ? `Consultation d'une feuille de route partagée créée le ${new Date(report.createdAt).toLocaleDateString()}` : `Reviewing a shared roadmap created on ${new Date(report.createdAt).toLocaleDateString()}`)
                : (isFrench ? "Consultez vos pistes recommandées, simulez l'évolution salariale et synchronisez avec vos guides de carrière." : "Review your aligned tracks, simulate compensation growth, and sync with career guides.")
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
          {/* Restart Assessment */}
          {!isSharedView && (
            <button
              onClick={onRestart}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60 px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isFrench ? "Refaire l'Évaluation" : "Retake Assessment"}
            </button>
          )}

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/40 px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
            title={isFrench ? "Copier le dossier complet au format Markdown" : "Copy full dossier as beautifully formatted Markdown"}
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" />
                {isFrench ? "Markdown Copié !" : "Markdown Copied!"}
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                {isFrench ? "Copier le Dossier Markdown" : "Copy Markdown Dossier"}
              </>
            )}
          </button>

          {/* Print Dossier / PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/40 px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
            title={isFrench ? "Imprimer ou enregistrer au format PDF" : "Print or Save as PDF"}
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            {isFrench ? "Imprimer / PDF" : "Print / PDF"}
          </button>

          {/* Share to Cloud with Accent Gradient */}
          <button
            disabled={sharing}
            onClick={handleShareToCloud}
            className={`flex items-center gap-2 accent-gradient hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer ${
              sharing ? "opacity-70 cursor-not-allowed" : ""
            }`}
            title={isFrench ? "Créer un lien de partage sécurisé pour un conseiller de carrière" : "Create a shareable, cloud-stored link for career guides"}
          >
            {sharing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isFrench ? "Synchronisation..." : "Syncing..."}
              </>
            ) : copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-200 font-bold" />
                {isFrench ? "Lien Copié !" : "Link Copied!"}
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                {isFrench ? "Partager le Rapport avec un Mentor" : "Share Report with Mentor"}
              </>
            )}
          </button>
        </div>
      </div>

      {report.note && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
              {isFrench ? "IA de Secours ProPath Active" : "ProPath Backup Intelligence Active"}
            </span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {report.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
