import React, { useState, useEffect } from "react";
import { 
  getPartners, savePartner, deletePartner,
  getPrograms, saveProgram, deleteProgram,
  getTeamApplications, updateTeamApplicationStatus, deleteTeamApplication,
  getUserClicks
} from "../lib/firebase";
import { 
  Building, BookOpen, Users, Plus, Trash2, Edit2, Check, X, 
  ExternalLink, MapPin, Briefcase, DollarSign, Clock, Search, 
  ArrowLeft, AlertCircle, Sparkles, Filter
} from "lucide-react";

const PREDEFINED_INDUSTRIES = [
  "Blockchain & Web3",
  "Cloud & AI Engineering",
  "Quantitative Finance",
  "Fintech & Digital Assets",
  "Machine Learning"
];

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

interface AdminPortalProps {
  onBack: () => void;
  theme: "dark" | "light";
}

export function AdminPortal({ onBack, theme }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"partners" | "programs" | "applications" | "monetization">("partners");
  
  // Data States
  const [partners, setPartners] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form States (Partners)
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerDesc, setPartnerDesc] = useState("");
  const [partnerIndustry, setPartnerIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [partnerLoc, setPartnerLoc] = useState("");
  const [partnerWeb, setPartnerWeb] = useState("");
  const [partnerCountry, setPartnerCountry] = useState("United States");

  // Form States (Programs)
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [programPartnerId, setProgramPartnerId] = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [programDuration, setProgramDuration] = useState("");
  const [programCost, setProgramCost] = useState("");
  const [programLevel, setProgramLevel] = useState("Beginner");
  const [programLink, setProgramLink] = useState("");
  const [programTrackId, setProgramTrackId] = useState("");
  const [programCountry, setProgramCountry] = useState("United States");

  // Application Actions
  const [adminNoteInput, setAdminNoteInput] = useState<Record<string, string>>({});

  // Load All Data on Mount & Tab Changes
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const pts = await getPartners();
      const prs = await getPrograms();
      const apps = await getTeamApplications();
      const clks = await getUserClicks();
      setPartners(pts);
      setPrograms(prs);
      setApplications(apps);
      setClicks(clks || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to synchronize with secure cloud registry.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Partner CRUD
  // ---------------------------------------------------------
  const handleOpenPartnerForm = (partner: any = null) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerName(partner.name);
      setPartnerDesc(partner.description);
      
      const isPredefined = PREDEFINED_INDUSTRIES.includes(partner.industry);
      if (isPredefined) {
        setPartnerIndustry(partner.industry);
        setCustomIndustry("");
      } else {
        setPartnerIndustry("Other");
        setCustomIndustry(partner.industry || "");
      }
      
      setPartnerLoc(partner.location);
      setPartnerWeb(partner.website);
      setPartnerCountry(partner.country || "United States");
    } else {
      setEditingPartner(null);
      setPartnerName("");
      setPartnerDesc("");
      setPartnerIndustry("Blockchain & Web3");
      setCustomIndustry("");
      setPartnerLoc("Remote");
      setPartnerWeb("");
      setPartnerCountry("United States");
    }
    setShowPartnerForm(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerDesc.trim()) return;

    const finalIndustry = partnerIndustry === "Other" ? customIndustry.trim() : partnerIndustry;
    if (!finalIndustry) {
      setError("Please specify a custom category/industry.");
      return;
    }

    try {
      const payload = {
        id: editingPartner?.id || null,
        name: partnerName,
        description: partnerDesc,
        industry: finalIndustry,
        location: partnerLoc,
        website: partnerWeb,
        country: partnerCountry,
        createdAt: editingPartner?.createdAt || new Date().toISOString()
      };
      await savePartner(payload);
      setShowPartnerForm(false);
      await loadAllData();
    } catch (err) {
      setError("Could not write partner to Cloud Vault.");
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this partner?")) return;
    try {
      await deletePartner(id);
      await loadAllData();
    } catch (err) {
      setError("Failed to delete partner.");
    }
  };

  // ---------------------------------------------------------
  // Program CRUD
  // ---------------------------------------------------------
  const handleOpenProgramForm = (prog: any = null) => {
    if (prog) {
      setEditingProgram(prog);
      setProgramPartnerId(prog.partnerId);
      setProgramTitle(prog.title);
      setProgramDesc(prog.description);
      setProgramDuration(prog.duration);
      setProgramCost(prog.cost);
      setProgramLevel(prog.level);
      setProgramLink(prog.link);
      setProgramTrackId(prog.trackId);
      setProgramCountry(prog.country || "United States");
    } else {
      setEditingProgram(null);
      setProgramPartnerId(partners[0]?.id || "");
      setProgramTitle("");
      setProgramDesc("");
      setProgramDuration("12 Weeks");
      setProgramCost("Free");
      setProgramLevel("Beginner");
      setProgramLink("");
      setProgramTrackId("");
      setProgramCountry("United States");
    }
    setShowProgramForm(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programTitle.trim() || !programPartnerId) return;

    const selectedPart = partners.find(p => p.id === programPartnerId);
    try {
      const payload = {
        id: editingProgram?.id || null,
        partnerId: programPartnerId,
        partnerName: selectedPart ? selectedPart.name : "Partner Company",
        title: programTitle,
        description: programDesc,
        duration: programDuration,
        cost: programCost,
        level: programLevel,
        link: programLink,
        trackId: programTrackId,
        country: programCountry,
        createdAt: editingProgram?.createdAt || new Date().toISOString()
      };
      await saveProgram(payload);
      setShowProgramForm(false);
      await loadAllData();
    } catch (err) {
      setError("Failed to write educational program.");
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this program?")) return;
    try {
      await deleteProgram(id);
      await loadAllData();
    } catch (err) {
      setError("Failed to delete training program.");
    }
  };

  // ---------------------------------------------------------
  // Placement Application state
  // ---------------------------------------------------------
  const handleUpdateAppStatus = async (appId: string, status: string) => {
    const note = adminNoteInput[appId] || "";
    try {
      await updateTeamApplicationStatus(appId, status, note);
      await loadAllData();
    } catch (err) {
      setError("Failed to update application state.");
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!window.confirm("Delete this placement application?")) return;
    try {
      await deleteTeamApplication(id);
      await loadAllData();
    } catch (err) {
      setError("Failed to delete application.");
    }
  };

  // Filters & Searches
  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPrograms = programs.filter(pr => 
    pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pr.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pr.trackId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.trackTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:hidden">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Personal Dossier</span>
          </button>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-black font-display text-white mt-0.5">
              Vocational Partners & Placements Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure partner directories, schedule training curricula, and manage student placement pipeline requests in real-time.
          </p>
        </div>

        {/* Sync Controls */}
        <button
          onClick={loadAllData}
          className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold font-sans cursor-pointer transition flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          Synchronize Registry
        </button>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Hiring Partners</p>
            <p className="text-xl font-black text-white mt-1">{partners.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-2xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Educational Programs</p>
            <p className="text-xl font-black text-white mt-1">{programs.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Placement Placements</p>
            <p className="text-xl font-black text-white mt-1">
              {applications.length} total ({applications.filter(a => a.status === "Pending").length} pending)
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("partners"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer ${
            activeTab === "partners"
              ? "border-indigo-500 text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Hiring Partners ({partners.length})
        </button>
        <button
          onClick={() => { setActiveTab("programs"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer ${
            activeTab === "programs"
              ? "border-indigo-500 text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Curated Programs ({programs.length})
        </button>
        <button
          onClick={() => { setActiveTab("applications"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer ${
            activeTab === "applications"
              ? "border-indigo-500 text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Team Placement Pipeline ({applications.length})
        </button>
        <button
          onClick={() => { setActiveTab("monetization"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer ${
            activeTab === "monetization"
              ? "border-indigo-500 text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Choice Tracking Analytics ({clicks.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === "partners" ? "Search partners by name or industry..." :
              activeTab === "programs" ? "Search programs or tracks..." : "Search by applicant name or email..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          {activeTab === "applications" && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All States</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="joined">Joined</option>
              </select>
            </div>
          )}

          {activeTab === "partners" && (
            <button
              onClick={() => handleOpenPartnerForm()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
          )}

          {activeTab === "programs" && partners.length > 0 && (
            <button
              onClick={() => handleOpenProgramForm()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Program</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Render */}
      {loading ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-mono">Loading data pipeline from cloud storage...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: PARTNERS */}
          {activeTab === "partners" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPartners.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-500 text-xs">
                  No partners found matching search criteria.
                </div>
              ) : (
                filteredPartners.map((p) => (
                  <div key={p.id} className="glass-card p-6 flex flex-col justify-between hover:border-indigo-500/30 transition">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                            {p.industry}
                          </span>
                          <h3 className="text-base font-bold text-white mt-2">{p.name}</h3>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenPartnerForm(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 cursor-pointer transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 cursor-pointer transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-800/60 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{p.location} ({p.country || "United States"})</span>
                      </div>
                      <a
                        href={ensureAbsoluteUrl(p.website)}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PROGRAMS */}
          {activeTab === "programs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-500 text-xs">
                  No educational programs found matching criteria.
                </div>
              ) : (
                filteredPrograms.map((pr) => (
                  <div key={pr.id} className="glass-card p-6 flex flex-col justify-between hover:border-indigo-500/30 transition">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] font-mono font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {pr.partnerName}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-1.5 py-0.5 rounded">
                              {pr.level}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-2.5">{pr.title}</h3>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenProgramForm(pr)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 cursor-pointer transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(pr.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 cursor-pointer transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                        {pr.description}
                      </p>

                      <div className="mt-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-none flex flex-wrap gap-x-4 gap-y-2 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Duration: <strong className="text-slate-300 font-sans">{pr.duration}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-500" />
                          <span>Cost: <strong className="text-slate-300 font-sans">{pr.cost}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>Country: <strong className="text-slate-300 font-sans">{pr.country || "United States"}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1 font-mono text-[10px] text-indigo-400 font-semibold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">Track: {pr.trackId || "General"}</span>
                      </div>
                      <a
                        href={ensureAbsoluteUrl(pr.link)}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-end sm:self-auto shrink-0 font-mono"
                      >
                        <span>Apply Hub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PLACEMENT APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No placement applications match current filter.
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div key={app.id} className="glass-card p-5 relative overflow-hidden flex flex-col md:flex-row items-stretch gap-6">
                    {/* Status side stripe */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      app.status === "Approved" ? "bg-emerald-500" :
                      app.status === "Joined" ? "bg-indigo-500" :
                      app.status === "Reviewing" ? "bg-amber-500" : "bg-slate-700"
                    }`} />

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white">{app.userName}</h3>
                            <span className="text-xs text-slate-400">({app.userEmail})</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                            <span>Target Partner: <strong className="text-slate-200">{app.partnerName}</strong></span>
                            <span>•</span>
                            <span>Matched Pathway: <strong className="text-indigo-400">{app.trackTitle}</strong></span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                            app.status === "Approved" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                            app.status === "Joined" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                            app.status === "Reviewing" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                            "text-slate-400 bg-slate-500/10 border-slate-500/10"
                          }`}>
                            {app.status}
                          </span>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Application details */}
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 text-xs space-y-2">
                        <p className="text-slate-300 font-sans leading-relaxed">
                          <span className="text-slate-500 font-mono font-semibold block text-[10px] uppercase tracking-wider mb-1">User Cover Statement</span>
                          {app.notes || "No user statement provided."}
                        </p>
                        
                        {app.adminNotes && (
                          <div className="border-t border-slate-800/60 pt-2.5 mt-2.5">
                            <span className="text-slate-500 font-mono font-semibold block text-[10px] uppercase tracking-wider mb-1 text-indigo-400">Admin Response Notes</span>
                            <p className="text-slate-300 font-sans italic">
                              "{app.adminNotes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Actions Panel */}
                    <div className="w-full md:w-72 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-5">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                          Reviewer Response Note
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Schedule call, details sent..."
                          value={adminNoteInput[app.id] || app.adminNotes || ""}
                          onChange={(e) => setAdminNoteInput({ ...adminNoteInput, [app.id]: e.target.value })}
                          className="w-full p-2 text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, "Reviewing")}
                          className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-[11px] font-bold rounded-lg cursor-pointer transition border border-slate-800 flex items-center justify-center gap-1"
                        >
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, "Approved")}
                          className="px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg cursor-pointer transition border border-emerald-500/20 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, "Joined")}
                          className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg cursor-pointer transition col-span-2 flex items-center justify-center gap-1"
                        >
                          <Users className="w-3 h-3" />
                          <span>Mark as Team Joined</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: CHOICE TRACKING MONETIZATION & LEAD ANALYTICS */}
          {activeTab === "monetization" && (
            <div className="space-y-6">
              {/* Lead-Gen & Sponsorship Monetization Metrics */}
              {(() => {
                // Calculate stats
                const totalClicks = clicks.length;
                
                // Calculate dynamic value based on monetization rates:
                // Program Join request: $45.00, Syllabus check: $15.00, External Learning options: $5.00
                const calculatedSponsorshipValue = clicks.reduce((acc, c) => {
                  if (c.type === "program_join_click") return acc + 45.00;
                  if (c.type === "program_syllabus_click") return acc + 15.00;
                  if (c.type === "partner_website_click") return acc + 25.00;
                  return acc + 5.00; // resource check
                }, 0);

                // Group by Partner
                const partnerCounts: { [key: string]: number } = {};
                clicks.forEach(c => {
                  const name = c.partnerName || "General Learning";
                  partnerCounts[name] = (partnerCounts[name] || 0) + 1;
                });
                const sortedPartners = Object.entries(partnerCounts)
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count);

                // Group by Program/Resource Target
                const targetCounts: { [key: string]: number } = {};
                clicks.forEach(c => {
                  const name = c.targetName || "Unknown Target";
                  targetCounts[name] = (targetCounts[name] || 0) + 1;
                });
                const sortedTargets = Object.entries(targetCounts)
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count);

                // Group by Country
                const countryCounts: { [key: string]: number } = {};
                clicks.forEach(c => {
                  const country = c.country || "Unspecified";
                  countryCounts[country] = (countryCounts[country] || 0) + 1;
                });
                const sortedCountries = Object.entries(countryCounts)
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count);

                // Filter clicks based on admin's search string
                const searchedClicks = clicks.filter(c => {
                  const query = searchQuery.toLowerCase();
                  const indsStr = c.industrySelections ? c.industrySelections.join(" ") : "";
                  return (
                    (c.userEmail || "").toLowerCase().includes(query) ||
                    (c.targetName || "").toLowerCase().includes(query) ||
                    (c.partnerName || "").toLowerCase().includes(query) ||
                    (c.type || "").toLowerCase().includes(query) ||
                    (c.country || "").toLowerCase().includes(query) ||
                    (c.language || "").toLowerCase().includes(query) ||
                    (c.trackTitle || "").toLowerCase().includes(query) ||
                    (c.secondSuggestedTrack || "").toLowerCase().includes(query) ||
                    indsStr.toLowerCase().includes(query)
                  );
                });

                // Handler to export clicks as CSV (client-side triggers file download)
                const handleExportCSV = () => {
                  if (clicks.length === 0) return;
                  const headers = [
                    "Timestamp", 
                    "User Email", 
                    "Interaction Type", 
                    "Target Name", 
                    "Partner/Provider", 
                    "Primary Track Match", 
                    "Primary Sector",
                    "Second Track Match",
                    "Second Sector",
                    "Industry Selections",
                    "Country",
                    "Language"
                  ];
                  const rows = clicks.map(c => {
                    const inds = c.industrySelections ? c.industrySelections.join("; ") : "";
                    return [
                      c.createdAt || "",
                      c.userEmail || "anonymous",
                      c.type || "",
                      `"${(c.targetName || "").replace(/"/g, '""')}"`,
                      `"${(c.partnerName || "General Learning").replace(/"/g, '""')}"`,
                      `"${(c.trackTitle || "").replace(/"/g, '""')}"`,
                      `"${(c.primarySuggestedSector || "").replace(/"/g, '""')}"`,
                      `"${(c.secondSuggestedTrack || "").replace(/"/g, '""')}"`,
                      `"${(c.secondSuggestedSector || "").replace(/"/g, '""')}"`,
                      `"${inds.replace(/"/g, '""')}"`,
                      c.country || "General",
                      c.language || "English"
                    ];
                  });
                  const csvData = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
                  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `propath_monetization_leads_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                };

                return (
                  <>
                    {/* BENTO GRID: BUSINESS SUMMARY */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">Total Leads Monitored</span>
                        <h4 className="text-3xl font-black text-white mt-1.5 font-mono">{totalClicks}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Syllabus & application click-throughs.</p>
                      </div>

                      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Partner Leads Value</span>
                        <h4 className="text-3xl font-black text-emerald-400 mt-1.5 font-mono">
                          ${calculatedSponsorshipValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">Generated value based on conversion weight.</p>
                      </div>

                      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Avg Lead Cost</span>
                        <h4 className="text-3xl font-black text-white mt-1.5 font-mono">
                          ${totalClicks > 0 ? (calculatedSponsorshipValue / totalClicks).toFixed(2) : "0.00"}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">Weighted value per user action.</p>
                      </div>

                      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-400">Lead Export Utility</span>
                          <p className="text-[10px] text-slate-300 mt-1">Download choice matrices to monetize with partners.</p>
                        </div>
                        <button
                          onClick={handleExportCSV}
                          disabled={clicks.length === 0}
                          className={`mt-3 w-full font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                            clicks.length === 0
                              ? (theme === "light" ? "bg-slate-200" : "bg-slate-800")
                              : "bg-indigo-600 hover:bg-indigo-500"
                          }`}
                          style={{
                            color: clicks.length === 0
                              ? (theme === "light" ? "#94a3b8" : "#64748b")
                              : "#ffffff"
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Package & Export Leads (.CSV)</span>
                        </button>
                      </div>
                    </div>

                    {/* INTERACTIVE VISUALS: DEMAND SHARES & TARGET LEADS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Top Partners Share */}
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>Sponsor Share (Clicks per Institution)</span>
                        </h4>
                        <div className="space-y-3.5">
                          {sortedPartners.length === 0 ? (
                            <p className="text-[11px] text-slate-500 italic py-6 text-center">No partner clicks captured.</p>
                          ) : (
                            sortedPartners.slice(0, 5).map(({ name, count }) => {
                              const pct = Math.round((count / totalClicks) * 100);
                              return (
                                <div key={name}>
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                                    <span className="truncate max-w-[200px]" title={name}>{name}</span>
                                    <span className="font-mono text-[10px] text-slate-400">{count} clicks ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                                    <div 
                                      className="h-full bg-indigo-500 rounded-full"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Top Cohorts/Programs requested */}
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                          <span>Curated Program Demands</span>
                        </h4>
                        <div className="space-y-3.5">
                          {sortedTargets.length === 0 ? (
                            <p className="text-[11px] text-slate-500 italic py-6 text-center">No program clicks captured.</p>
                          ) : (
                            sortedTargets.slice(0, 5).map(({ name, count }) => {
                              const pct = Math.round((count / totalClicks) * 100);
                              return (
                                <div key={name}>
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                                    <span className="truncate max-w-[200px]" title={name}>{name}</span>
                                    <span className="font-mono text-[10px] text-slate-400">{count} clicks ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                                    <div 
                                      className="h-full bg-fuchsia-500 rounded-full"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Regional Traffic distribution */}
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Geographic Distribution (Local Sponsors)</span>
                        </h4>
                        <div className="space-y-3.5">
                          {sortedCountries.length === 0 ? (
                            <p className="text-[11px] text-slate-500 italic py-6 text-center">No geographical clicks recorded.</p>
                          ) : (
                            sortedCountries.slice(0, 5).map(({ name, count }) => {
                              const pct = Math.round((count / totalClicks) * 100);
                              return (
                                <div key={name}>
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                                    <span className="capitalize">{name === "fr" ? "France (fr)" : name === "cm" ? "Cameroon (cm)" : name}</span>
                                    <span className="font-mono text-[10px] text-slate-400">{count} clicks ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                                    <div 
                                      className="h-full bg-emerald-500 rounded-full"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>

                    {/* ATTRIBUTION DATA LIST OF INDIVIDUAL USER CHOICES */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Raw Choice-Attribution Stream</h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-850 rounded">
                          Showing {searchedClicks.length} of {totalClicks}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              <th className="py-2.5 px-3">Timestamp</th>
                              <th className="py-2.5 px-3">Candidate Email</th>
                              <th className="py-2.5 px-3">Interaction Type</th>
                              <th className="py-2.5 px-3">Choice Target (Course/School)</th>
                              <th className="py-2.5 px-3">Primary / Second Match</th>
                              <th className="py-2.5 px-3">Industry Selections</th>
                              <th className="py-2.5 px-3">Country / Lang</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/50 text-[11px] font-mono">
                            {searchedClicks.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-500 italic">No attribution records match filters.</td>
                              </tr>
                            ) : (
                              searchedClicks.map(c => {
                                let badgeColor = "text-slate-400 bg-slate-500/10 border-slate-500/10";
                                let actionLabel = "Explore Sandbox";
                                if (c.type === "program_join_click") {
                                  badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                                  actionLabel = "Team Join Request";
                                } else if (c.type === "program_syllabus_click") {
                                  badgeColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
                                  actionLabel = "Syllabus Download";
                                } else if (c.type === "partner_website_click") {
                                  badgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                                  actionLabel = "Apply Partner Direct";
                                }

                                return (
                                  <tr key={c.id} className="hover:bg-slate-950/40 text-slate-300">
                                    <td className="py-3 px-3 whitespace-nowrap text-slate-400 text-[10px]">
                                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "Recent"}
                                    </td>
                                    <td className="py-3 px-3 text-slate-200">{c.userEmail || "anonymous"}</td>
                                    <td className="py-3 px-3">
                                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badgeColor}`}>
                                        {actionLabel}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 font-sans font-bold text-slate-100">
                                      {c.targetName}
                                      <span className="block font-mono font-normal text-[9px] text-slate-500 mt-0.5">
                                        Provider: {c.partnerName || "General Learning"}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 font-sans text-slate-300">
                                      <div>{c.trackTitle || "General"}</div>
                                      {c.secondSuggestedTrack && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                          2nd: {c.secondSuggestedTrack} {c.secondSuggestedSector ? `(${c.secondSuggestedSector})` : ""}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-3 px-3 text-slate-300">
                                      {c.industrySelections && c.industrySelections.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                                          {c.industrySelections.map((ind: string) => (
                                            <span key={ind} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[9px] border border-slate-700">
                                              {ind}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-slate-500 italic">None</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-3 uppercase text-slate-400">
                                      <div>{c.country || "Global"}</div>
                                      <div className="text-[10px] text-slate-500 capitalize">{c.language || "English"}</div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------
         MODAL FORM: PARTNER
         --------------------------------------------------------- */}
      {showPartnerForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-lg p-6 md:p-8 relative">
            <button
              onClick={() => setShowPartnerForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black font-display text-white mb-6">
              {editingPartner ? "Edit Hiring Partner Profile" : "Register New Hiring Partner"}
            </h3>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Partner Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Industry Category
                  </label>
                  <select
                    value={partnerIndustry}
                    onChange={(e) => setPartnerIndustry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Blockchain & Web3">Blockchain & Web3</option>
                    <option value="Cloud & AI Engineering">Cloud & AI Engineering</option>
                    <option value="Quantitative Finance">Quantitative Finance</option>
                    <option value="Fintech & Digital Assets">Fintech & Digital Assets</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    HQ Location
                  </label>
                  <input
                    type="text"
                    value={partnerLoc}
                    onChange={(e) => setPartnerLoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Country of Operations
                  </label>
                  <select
                    value={partnerCountry}
                    onChange={(e) => setPartnerCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="France">France</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                  </select>
                </div>
              </div>
              </div>

              {partnerIndustry === "Other" && (
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Custom Industry Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Healthtech, Cyber Security..."
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. partner.com or https://partner.com"
                  value={partnerWeb}
                  onChange={(e) => setPartnerWeb(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Partner Overview & Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={partnerDesc}
                  onChange={(e) => setPartnerDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition shadow-lg shadow-indigo-600/25"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
         MODAL FORM: PROGRAM
         --------------------------------------------------------- */}
      {showProgramForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-lg p-6 md:p-8 relative">
            <button
              onClick={() => setShowProgramForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black font-display text-white mb-6">
              {editingProgram ? "Modify Curated Training Program" : "Launch Curated Partner Training Program"}
            </h3>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Hosting Partner *
                  </label>
                  <select
                    value={programPartnerId}
                    onChange={(e) => setProgramPartnerId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Country *
                  </label>
                  <select
                    value={programCountry}
                    onChange={(e) => setProgramCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="France">France</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Target Track *
                  </label>
                  <select
                    value={programTrackId}
                    onChange={(e) => setProgramTrackId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">General Program</option>
                    <option value="DeFi Security Engineer & Smart Contract Auditor">DeFi Security Engineer & Smart Contract Auditor</option>
                    <option value="AI-Driven Quantitative Risk Architect">AI-Driven Quantitative Risk Architect</option>
                    <option value="Cloud DevOps Engineer & Infrastructure Architect">Cloud DevOps Engineer & Infrastructure Architect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Contract Security Bootcamp"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Weeks"
                    value={programDuration}
                    onChange={(e) => setProgramDuration(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Cost Option
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free"
                    value={programCost}
                    onChange={(e) => setProgramCost(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={programLevel}
                    onChange={(e) => setProgramLevel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Application Link / Hub URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. partner.com/apply or https://partner.com/apply"
                  value={programLink}
                  onChange={(e) => setProgramLink(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
                  Curriculum Overview & Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide core modules, outcomes, and alignment criteria..."
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProgramForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition shadow-lg shadow-indigo-600/25"
                >
                  Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
