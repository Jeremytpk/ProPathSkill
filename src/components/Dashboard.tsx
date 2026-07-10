import React, { useState, useEffect, useMemo } from "react";
import { CareerReport, CareerTrack, EducationResource, MentorGoal } from "../types";
import { CircularDial } from "./CircularDial";
import { SalarySimulator } from "./SalarySimulator";
import { SkillsGrowth } from "./SkillsGrowth";
import { MentorshipGoals } from "./MentorshipGoals";
import { RedirectionModal } from "./RedirectionModal";
import { LucideIcon } from "./LucideIcon";
import { SECTORS } from "../questions";
import { SECTORS_FR } from "../questions_fr";
import { 
  getPartners, getPrograms, submitTeamApplication, getTeamApplications, logUserClick
} from "../lib/firebase";
import { 
  Compass, MapPin, TrendingUp, Cpu, Award, Users, 
  ExternalLink, Calendar, CheckSquare, Sparkles, AlertCircle,
  Building, BookOpen, Clock, DollarSign, Send, CheckCircle, Search
} from "lucide-react";

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

interface DashboardProps {
  report: CareerReport;
  onUpdateGoals: (goals: MentorGoal[]) => void;
  selectedLanguage: "english" | "french";
  selectedCountry: string;
}

export function Dashboard({ report, onUpdateGoals, selectedLanguage, selectedCountry }: DashboardProps) {
  const { recommendedTracks } = report;
  const isFrench = selectedLanguage === "french";
  
  // Track active track index
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  
  // Selected resource for countdown redirection modal
  const [selectedResource, setSelectedResource] = useState<EducationResource | null>(null);

  // Firestore Data & Interaction States
  const [partners, setPartners] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Application Form States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicationNotes, setApplicationNotes] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Query Tracker State
  const [trackerEmail, setTrackerEmail] = useState("");
  const [searchedApplications, setSearchedApplications] = useState<any[] | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const activeTrack = recommendedTracks[activeTrackIdx] || recommendedTracks[0];

  // Helper to construct base user click metadata
  const getCurrentUserClickBase = () => {
    const email = localStorage.getItem("propath_applicant_email") || applicantEmail || "anonymous";
    const selectedSectorIds = report?.answers?.selectedSectors || [];
    const sectorList = isFrench ? SECTORS_FR : SECTORS;
    const industryNames = selectedSectorIds.map(id => {
      const s = sectorList.find(sec => sec.id === id);
      return s ? s.name : id;
    });

    return {
      userEmail: email,
      userId: email === "anonymous" ? "anonymous" : email,
      trackTitle: activeTrack.title,
      country: selectedCountry || "General",
      language: selectedLanguage,
      industrySelections: industryNames,
      primarySuggestedTrack: recommendedTracks[0]?.title || "",
      primarySuggestedSector: recommendedTracks[0]?.sector || "",
      secondSuggestedTrack: recommendedTracks[1]?.title || "",
      secondSuggestedSector: recommendedTracks[1]?.sector || "",
    };
  };

  // Translations
  const t = {
    matchesTitle: isFrench ? "Correspondances d'Orientation" : "Vocational Intelligence Matches",
    recomTracks: isFrench ? "Pistes Professionnelles Recommandées" : "Recommended Professional Tracks",
    summaryTitle: isFrench ? "Synthèse de la piste" : "Track Executive Summary",
    demandLevel: isFrench ? "Demande" : "Demand",
    peakSalary: isFrench ? "Salaire de pointe" : "Peak Salary",
    credentials: isFrench ? "Parcours prioritaires" : "Priority Paths",
    certificationsTitle: isFrench ? "Programme d'Études Réel et Certifications" : "Step-by-Step Certification Roadmap Flow",
    certificationsDesc: isFrench 
      ? "Pour atteindre l'adéquation maximale, complétez ces certifications accréditées à votre rythme."
      : "Acquire these globally recognized and industry-demanded credentials to validate your capability matching.",
    freeResources: isFrench ? "Ressources d'Apprentissage Gratuites" : "Free Learning Options",
    freeResourcesDesc: isFrench 
      ? "Commencez dès aujourd'hui avec des cours gratuits de premier plan sélectionnés par nos experts."
      : "ProPath maintains a list of completely free learning options. None of the listed programs require subscription details.",
    syllabus: isFrench ? "Syndic de cours / Lien" : "Course Syllabus",
    partnersTitle: isFrench ? "Hub de Placement et Partenaires Recruteurs" : "Hiring Partner Programs & Placement Hub",
    partnersDesc: isFrench 
      ? "Rejoignez des équipes actives au sein de nos partenaires académiques et entreprises locaux adaptés à votre profil."
      : "Join active teams of our trusted educational and corporate partners matching your customized career roadmap.",
    synchronizing: isFrench ? "Synchronisation en cours avec le registre Cloud..." : "Synchronizing partner directories with Secure Cloud Registry...",
    noPrograms: isFrench 
      ? "Aucune formation spécifique ne correspond à cette catégorie dans votre pays. Affichage des formations générales."
      : "No explicit corporate training tracks match this category. Showing generalized training placements instead.",
    duration: isFrench ? "Durée" : "Duration",
    value: isFrench ? "Valeur" : "Value",
    joinTeam: isFrench ? "Rejoindre l'équipe" : "Join Partner Team",
    pipelineTitle: isFrench ? "Pipeline de Placement Direct" : "Direct Partner Placement Pipeline",
    pipelineDesc: isFrench 
      ? "Passez les formations et postulez directement pour rejoindre les équipes de notre réseau d'entreprises locales."
      : "Skip training courses and apply to join teams of our corporate network directly.",
    applyDirect: isFrench ? "Postuler chez" : "Apply",
    trackPlacements: isFrench ? "Suivi de Vos Candidatures Actives" : "Track Your Live Placements",
    trackDesc: isFrench 
      ? "Récupérez en temps réel le statut de vos dossiers de candidatures enregistrés sur le cloud."
      : "Retrieve the real-time cloud-persisted status of your corporate team applications.",
    registeredEmailPlaceholder: isFrench ? "Saisissez l'adresse email enregistrée..." : "Enter registered email...",
    lookup: isFrench ? "Rechercher" : "Lookup",
    lookingUp: isFrench ? "Recherche..." : "Tracking...",
    appliedOn: isFrench ? "Candidature déposée le" : "Applied",
    statusPending: isFrench ? "En attente" : "Pending",
    noApplications: isFrench ? "Aucune candidature trouvée à cette adresse email." : "No submitted placement files found under this email.",
    modalTitle: isFrench ? "Dossier de Placement Partenaire" : "Partner Placement Application",
    modalSubtitle: isFrench ? "Transmettre votre profil de compétences certifiées" : "Transmit your certified skills profile to",
    fullName: isFrench ? "Nom Complet" : "Full Name",
    emailAddr: isFrench ? "Adresse Email" : "Email Address",
    coverNotes: isFrench ? "Notes de motivation (Optionnel)" : "Cover Notes & Background (Optional)",
    placeholderNotes: isFrench ? "Décrivez brièvement vos motivations..." : "Describe why you are a great fit for this specific local role...",
    submitApp: isFrench ? "Transmettre mon dossier" : "Submit Placement File",
    submittingApp: isFrench ? "Transmission sécurisée..." : "Submitting securely...",
    close: isFrench ? "Fermer" : "Close",
    appSuccess: isFrench ? "Votre dossier de candidature a été enregistré avec succès !" : "Your application has been successfully recorded in our secure vault!",
    mandatoryFields: isFrench ? "Veuillez remplir tous les champs obligatoires." : "Please fill out all required fields."
  };

  // 1. Fetch Partners, Programs, and existing applications on mount
  useEffect(() => {
    loadCloudIntegrations();
  }, [selectedCountry]);

  const loadCloudIntegrations = async () => {
    setLoadingData(true);
    try {
      const pts = await getPartners();
      const prs = await getPrograms();
      setPartners(pts);
      setPrograms(prs);

      // Restore applicant profile if persisted locally
      const storedEmail = localStorage.getItem("propath_applicant_email");
      const storedName = localStorage.getItem("propath_applicant_name");
      if (storedEmail) {
        setApplicantEmail(storedEmail);
        setTrackerEmail(storedEmail);
        if (storedName) {
          setApplicantName(storedName);
        }
        
        // Fetch existing applications
        const allApps = await getTeamApplications();
        const filtered = allApps.filter(app => app.userEmail.toLowerCase() === storedEmail.toLowerCase());
        setUserApplications(filtered);
      }
    } catch (err) {
      console.error("Failed to synchronize with partner cloud services:", err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!activeTrack) {
    return (
      <div className="text-center py-12 text-slate-400">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
        No recommended pathways found. Please retake the assessment.
      </div>
    );
  }

  // Filter partners and programs dynamically matching selectedCountry
  const filteredPartners = useMemo(() => {
    if (!selectedCountry) return partners;
    return partners.filter(p => p.country && p.country.toLowerCase() === selectedCountry.toLowerCase());
  }, [partners, selectedCountry]);

  const filteredPrograms = useMemo(() => {
    if (!selectedCountry) return programs;
    return programs.filter(p => p.country && p.country.toLowerCase() === selectedCountry.toLowerCase());
  }, [programs, selectedCountry]);

  // Filter programs matching activeTrack (localized or general)
  const matchedPrograms = useMemo(() => {
    return filteredPrograms.filter(
      p => p.trackId.toLowerCase() === activeTrack.title.toLowerCase() || p.trackId === "General"
    );
  }, [filteredPrograms, activeTrack]);

  // Get matching sector name/description
  const sectorsSource = isFrench ? SECTORS_FR : SECTORS;
  const activeSector = sectorsSource.find((s) => s.id === activeTrack.sector) || {
    name: activeTrack.category,
    description: isFrench ? "Secteur professionnel à forte croissance." : "High-growth vocational sector.",
    icon: "Compass"
  };

  // Difficulty badge colors
  const getDiffColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
      case "Débutant": 
        return "text-indigo-400 bg-indigo-400/10 border-indigo-500/20";
      case "Intermediate":
      case "Intermédiaire": 
        return "text-amber-400 bg-amber-400/10 border-amber-500/20";
      case "Advanced":
      case "Avancé": 
        return "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-500/20";
      default: 
        return "text-slate-400 bg-slate-500/10 border-slate-500/10";
    }
  };

  // 2. Open placement request modal
  const handleOpenPlacementForm = (partner: any, program: any = null) => {
    setSelectedPartner(partner);
    setSelectedProgram(program);
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsApplyModalOpen(true);
  };

  // 3. Submit placement application
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantEmail.trim() || !applicantName.trim()) {
      setErrorMsg(t.mandatoryFields);
      return;
    }

    setSubmittingApp(true);
    setErrorMsg(null);
    try {
      localStorage.setItem("propath_applicant_email", applicantEmail);
      localStorage.setItem("propath_applicant_name", applicantName);
      setTrackerEmail(applicantEmail);

      const appData = {
        userName: applicantName,
        userEmail: applicantEmail,
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        programId: selectedProgram?.id || "direct_placement",
        programTitle: selectedProgram?.title || (isFrench ? "Programme de Placement Direct en Équipe" : "Direct Team Placement Program"),
        trackTitle: activeTrack.title,
        status: "Pending",
        notes: applicationNotes
      };

      await submitTeamApplication(appData);
      
      setSuccessMsg(isFrench ? "Votre dossier de candidature a été enregistré avec succès !" : `Your application to join ${selectedPartner.name}'s team has been recorded!`);
      setApplicationNotes("");
      
      // Refresh user's applications
      const allApps = await getTeamApplications();
      const filtered = allApps.filter(app => app.userEmail.toLowerCase() === applicantEmail.toLowerCase());
      setUserApplications(filtered);

      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSuccessMsg(null);
      }, 3500);

    } catch (err) {
      setErrorMsg(isFrench ? "Échec du dépôt de dossier sur la plateforme." : "Failed to upload application dossier.");
    } finally {
      setSubmittingApp(false);
    }
  };

  // 4. Manually track or lookup applications by email
  const handleManualTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerEmail.trim()) return;

    setTrackingLoading(true);
    try {
      localStorage.setItem("propath_applicant_email", trackerEmail);
      const allApps = await getTeamApplications();
      const filtered = allApps.filter(app => app.userEmail.toLowerCase() === trackerEmail.toLowerCase());
      setSearchedApplications(filtered);
      setUserApplications(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Track Swapper Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 print:hidden">
        <div>
          <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-indigo-400">
            {t.matchesTitle}
          </span>
          <h2 className="text-2xl font-black font-display text-white mt-0.5">
            {t.recomTracks}
          </h2>
        </div>
        
        {/* Animated Pill Selector */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          {recommendedTracks.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => setActiveTrackIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                idx === activeTrackIdx
                  ? "accent-gradient text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LucideIcon name={idx === 0 ? "Sparkles" : "TrendingUp"} size={14} className={idx === activeTrackIdx ? "animate-pulse" : ""} />
              {track.title}
            </button>
          ))}
        </div>
      </div>

      {/* print-only header */}
      <div className="hidden print:block border-b border-slate-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold font-display text-white">PROPATH VOCATIONAL ROADMAP</h1>
        <p className="text-sm text-slate-400 mt-1">
          Career Alignment Analysis & Step-by-Step Training Program for: <span className="text-indigo-400 font-semibold">{activeTrack.title}</span>
        </p>
      </div>

      {/* SECTION 1: Bento-Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Track Executive Summary (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono font-bold text-indigo-400 bg-indigo-400/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                <LucideIcon name={activeSector.icon} size={11} />
                {activeTrack.category}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 rounded-full">
                {activeTrack.demandLevel} {t.demandLevel}
              </span>
            </div>

            <h1 className="text-2xl md:text-3.5xl font-black font-display text-white tracking-tight leading-none mb-4">
              {activeTrack.title}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
              {activeTrack.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 mt-6">
            <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex gap-3 items-center">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Sector</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">{activeSector.name}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex gap-3 items-center">
              <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.peakSalary}</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {(activeTrack.salaryTimeline[activeTrack.salaryTimeline.length - 1]?.salary || 0).toLocaleString()} USD/Yr
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex gap-3 items-center sm:col-span-2 md:col-span-1">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.credentials}</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">{activeTrack.certificationRoadmap.length} {isFrench ? "Voies d'orientation" : "Priority Paths"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: circular compatibility dial (4 cols) */}
        <div className="lg:col-span-4 h-full">
          <CircularDial
            score={activeTrack.matchScore}
            title={activeTrack.title}
            subtitle={isFrench ? `Adéquation avec le secteur ${activeTrack.category}` : `${activeTrack.category} Sector Match`}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </div>

      {/* SECTION 2: Dynamic Analytics & Simulators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Salary Simulator */}
        <div>
          <SalarySimulator
            timeline={activeTrack.salaryTimeline}
            trackTitle={activeTrack.title}
            selectedLanguage={selectedLanguage}
            selectedCountry={selectedCountry}
          />
        </div>

        {/* Skills Growth Chart */}
        <div>
          <SkillsGrowth
            skills={activeTrack.skillsPredicted}
            trackTitle={activeTrack.title}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </div>

      {/* SECTION 3: Roadmap Credentials & Timeline Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Step-by-Step Certification Roadmap Flow (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {isFrench ? "Parcours de Formation" : "Training Track"}
              </span>
              <h3 className="text-xl font-black font-display text-white mt-2">
                {t.certificationsTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.certificationsDesc}
              </p>
            </div>

            {/* Step-by-Step Vertical Steps */}
            <div className="relative border-l-2 border-slate-800/80 pl-5 ml-2.5 space-y-6">
              {activeTrack.certificationRoadmap.map((cert, index) => (
                <div key={`${cert.name}_${index}`} className="relative">
                  {/* Step Marker Badge */}
                  <div className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono border-2 transition ${
                    index === 0
                      ? "accent-gradient text-white border-transparent scale-110"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}>
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-200">{cert.name}</h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getDiffColor(cert.difficulty)}`}>
                        {cert.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {isFrench 
                        ? `Certification accréditée délivrée par ${cert.provider}. Recommandée pour valider vos compétences dans le secteur.`
                        : `Accredited credential issued by ${cert.provider}. Recommended to validate your capability matching in the sector.`}
                    </p>

                    <div className="flex gap-4 text-[10px] font-mono font-semibold text-indigo-400 mt-2">
                      <span>{isFrench ? "Certificateur :" : "Issuer :"} <strong className="text-slate-300">{cert.provider}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-850/60 pt-4 text-[11px] text-slate-500 font-medium">
            ProPath partners with global tech leaders. All recommendations match official, job-ready criteria.
          </div>
        </div>

        {/* Free Online Sandbox Learning Options (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-wider font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded-full border border-fuchsia-500/20">
                {isFrench ? "Apprentissage en Ligne" : "Online Learning"}
              </span>
              <h3 className="text-xl font-black font-display text-white mt-2">
                {t.freeResources}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.freeResourcesDesc}
              </p>
            </div>

            {/* List layout of sandboxes */}
            <div className="space-y-3.5">
              {activeTrack.educationalResources.map((res, index) => (
                <div 
                  key={`${res.name}_${index}`} 
                  onClick={() => {
                    setSelectedResource(res);
                    logUserClick({
                      ...getCurrentUserClickBase(),
                      type: "resource_click",
                      targetId: `resource_${index}`,
                      targetName: res.name,
                      platform: res.platform,
                    });
                  }}
                  className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/60 hover:border-indigo-500/30 hover:bg-slate-900/30 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition">{res.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{res.platform}</p>
                    
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase text-slate-500 mt-2">
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">{res.type}</span>
                      <span className="text-slate-800">•</span>
                      <span>{t.duration}: <span className="text-slate-300">{res.duration}</span></span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-900 rounded-lg text-slate-500 group-hover:text-indigo-400 group-hover:bg-slate-800 transition shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-850/60 pt-4 text-[11px] text-slate-500 font-medium">
            ProPath maintains a list of completely free learning options. None of the listed programs require subscription details.
          </div>
        </div>
      </div>

      {/* SECTION 4: PARTNER ALIGNMENT & TEAM PLACEMENTS HUB */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {isFrench ? "Partenaires Locaux de Recrutement" : "Local Corporate Partnerships"}
            </span>
            <h3 className="text-xl font-black font-display text-white mt-2">
              {t.partnersTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.partnersDesc}
            </p>
          </div>
        </div>

        {loadingData ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin mb-3" />
            <p className="text-xs text-slate-400 font-mono">{t.synchronizing}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Matching Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedPrograms.length === 0 ? (
                <div className="col-span-2 text-center py-8 bg-slate-950/20 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                  {t.noPrograms}
                </div>
              ) : (
                matchedPrograms.map((pr) => {
                  const partner = filteredPartners.find(p => p.id === pr.partnerId);
                  return (
                    <div key={pr.id} className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {partner?.name || pr.partnerName}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-2">{pr.title}</h4>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded">
                            {pr.level}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                          {pr.description}
                        </p>

                        <div className="mt-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/50 text-[10px] text-slate-400 font-mono flex flex-wrap gap-x-4 gap-y-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            <span>{t.duration}: <strong className="text-slate-300">{pr.duration}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-indigo-400" />
                            <span>{t.value}: <strong className="text-slate-300">{pr.cost}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-850/60 flex items-center justify-between gap-2.5">
                        <a
                          href={ensureAbsoluteUrl(pr.link)}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          onClick={() => {
                            logUserClick({
                              ...getCurrentUserClickBase(),
                              type: "program_syllabus_click",
                              targetId: pr.id,
                              targetName: pr.title,
                              partnerId: pr.partnerId,
                              partnerName: partner?.name || pr.partnerName,
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1"
                        >
                          <span>{t.syllabus}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => {
                            handleOpenPlacementForm(partner || { id: pr.partnerId, name: pr.partnerName }, pr);
                            logUserClick({
                              ...getCurrentUserClickBase(),
                              type: "program_join_click",
                              targetId: pr.id,
                              targetName: pr.title,
                              partnerId: pr.partnerId,
                              partnerName: partner?.name || pr.partnerName,
                            });
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{t.joinTeam}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Direct Application Section for Unlisted Programs */}
            {filteredPartners.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.pipelineTitle}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.pipelineDesc}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {filteredPartners.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleOpenPlacementForm(p);
                        logUserClick({
                          ...getCurrentUserClickBase(),
                          type: "partner_website_click",
                          targetId: p.id,
                          targetName: p.name,
                          partnerId: p.id,
                          partnerName: p.name,
                        });
                      }}
                      className="bg-slate-900 hover:bg-indigo-500/20 text-slate-200 border border-slate-800 hover:border-indigo-500/30 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition"
                    >
                      {t.applyDirect} {p.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Application Tracker and Manual Search */}
            <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{t.trackPlacements}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.trackDesc}</p>
                </div>

                {/* Tracking Query Search Bar */}
                <form onSubmit={handleManualTrack} className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder={t.registeredEmailPlaceholder}
                      value={trackerEmail}
                      onChange={(e) => setTrackerEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1 shrink-0 font-mono"
                  >
                    {trackingLoading ? t.lookingUp : t.lookup}
                  </button>
                </form>
              </div>

              {/* Live Status Tracker results */}
              {userApplications.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {userApplications.map((app) => (
                    <div key={app.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{app.partnerName}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-indigo-400">{app.trackTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {t.appliedOn}: {new Date(app.createdAt).toLocaleDateString()} — Code: {app.id.substring(0, 8)}
                        </p>
                        {app.adminNotes && (
                          <p className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-500/10 px-2.5 py-1 rounded-lg mt-2 italic">
                            Response: "{app.adminNotes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                          app.status === "Approved" || app.status === "Approuvé" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 animate-pulse" :
                          app.status === "Joined" || app.status === "Rejoint" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                          app.status === "Reviewing" || app.status === "En cours" ? "text-amber-400 bg-amber-400/10 border-amber-500/20" :
                          "text-slate-400 bg-slate-500/10 border-slate-500/10"
                        }`}>
                          {app.status === "Pending" ? t.statusPending : app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchedApplications !== null ? (
                <p className="text-xs text-slate-500 italic mt-2">{t.noApplications}</p>
              ) : (
                <p className="text-xs text-slate-500 italic mt-2">
                  {isFrench ? "Saisissez votre e-mail ci-dessus pour récupérer vos candidatures existantes." : "Enter your email address above to fetch your existing placement records."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: PERSONAL GOAL BUILDER MENTORSHIP WORKSPACE */}
      <div>
        <MentorshipGoals
          goals={report.mentorGoals || []}
          onChange={onUpdateGoals}
          selectedLanguage={selectedLanguage}
        />
      </div>

      {/* COUNTDOWN REDIRECTION MODAL */}
      <RedirectionModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* SECURE APPLICATION PLACEMENT MODAL */}
      {isApplyModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-lg font-bold font-display text-white">
              {t.modalTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.modalSubtitle} <strong className="text-indigo-400">{selectedPartner.name}</strong>.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Jean Dupont"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">{t.emailAddr} *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="e.g. jean.dupont@propath.io"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>

              {selectedProgram && (
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">{isFrench ? "Formation sélectionnée :" : "Training Course :"}</span>
                  <span className="text-indigo-400 font-bold truncate max-w-[200px]">{selectedProgram.title}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">{t.coverNotes}</label>
                <textarea
                  rows={3}
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  placeholder={t.placeholderNotes}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="flex-1 py-2.5 accent-gradient hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  {submittingApp ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.submittingApp}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.submitApp}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
