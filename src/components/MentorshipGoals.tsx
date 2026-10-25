import React, { useState } from "react";
import { MentorGoal } from "../types";
import { 
  CheckCircle2, Circle, Plus, Trash2, Award, Users, BookOpen, 
  MessageSquare, LayoutGrid, ListTodo, Calendar, AlertTriangle, 
  ArrowLeftRight, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MentorshipGoalsProps {
  goals: MentorGoal[];
  onChange: (goals: MentorGoal[]) => void;
  selectedLanguage?: "english" | "french";
}

export function MentorshipGoals({ goals, onChange, selectedLanguage = "english" }: MentorshipGoalsProps) {
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  
  // Goal Input Form States
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<MentorGoal["category"]>("Technical");
  const [newGoalPriority, setNewGoalPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newGoalDueDate, setNewGoalDueDate] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Expanded goal card for description / note editing
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Drag and drop visual highlight state
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const isFrench = selectedLanguage === "french";

  // Normalize goals to ensure all have status, priority, description, dueDate
  const normalizedGoals: MentorGoal[] = goals.map(g => ({
    ...g,
    status: (g.status || (g.completed ? "Completed" : "Planned")) as MentorGoal["status"],
    priority: (g.priority || "Medium") as MentorGoal["priority"],
    dueDate: g.dueDate || "",
    description: g.description || ""
  }));

  // Handle Add Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: MentorGoal = {
      id: `goal_${Date.now()}`,
      text: newGoalText.trim(),
      completed: false,
      category: newGoalCategory,
      status: "Planned",
      priority: newGoalPriority,
      dueDate: newGoalDueDate,
      description: newGoalDesc.trim()
    };

    onChange([...goals, newGoal]);
    setNewGoalText("");
    setNewGoalDesc("");
    setNewGoalDueDate("");
    setNewGoalPriority("Medium");
    setShowAdvanced(false);
  };

  // Toggle goal simple complete state (compatibility)
  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextCompleted = !g.completed;
        return { 
          ...g, 
          completed: nextCompleted,
          status: (nextCompleted ? "Completed" : "Planned") as MentorGoal["status"]
        };
      }
      return g;
    });
    onChange(updated);
  };

  // Change goal status specifically
  const handleUpdateStatus = (id: string, status: "Planned" | "In Progress" | "Completed") => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, status, completed: status === "Completed" } : g
    );
    onChange(updated);
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    onChange(updated);
  };

  // Inline Goal Edits (Priority, DueDate, Description)
  const handleEditGoalField = (id: string, field: keyof MentorGoal, value: any) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, [field]: value } : g
    );
    onChange(updated);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colStatus: string) => {
    e.preventDefault();
    setDragOverCol(colStatus);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, status: "Planned" | "In Progress" | "Completed") => {
    e.preventDefault();
    setDragOverCol(null);
    const goalId = e.dataTransfer.getData("text/plain");
    if (goalId) {
      handleUpdateStatus(goalId, status);
    }
  };

  // Category naming translations
  const translateCategory = (cat: MentorGoal["category"]) => {
    if (!isFrench) return cat;
    switch (cat) {
      case "Technical": return "Technique";
      case "Leadership": return "Leadership";
      case "Mentorship": return "Mentorat";
      case "Industry Network": return "Réseau Sectoriel";
    }
  };

  // Priority naming translations
  const translatePriority = (prio: string) => {
    if (!isFrench) return prio;
    switch (prio) {
      case "High": return "Élevée";
      case "Medium": return "Moyenne";
      case "Low": return "Faible";
      default: return prio;
    }
  };

  // Icon mapping for categories
  const getCategoryIcon = (category: MentorGoal["category"]) => {
    switch (category) {
      case "Technical":
        return <Award className="w-4 h-4 text-indigo-400" />;
      case "Leadership":
        return <Users className="w-4 h-4 text-amber-400" />;
      case "Mentorship":
        return <MessageSquare className="w-4 h-4 text-fuchsia-400" />;
      case "Industry Network":
        return <BookOpen className="w-4 h-4 text-sky-400" />;
    }
  };

  // Colors for category badges
  const getCategoryColor = (category: MentorGoal["category"]) => {
    switch (category) {
      case "Technical":
        return "bg-indigo-400/10 text-indigo-300 border-indigo-400/20";
      case "Leadership":
        return "bg-amber-400/10 text-amber-300 border-amber-400/20";
      case "Mentorship":
        return "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20";
      case "Industry Network":
        return "bg-sky-400/10 text-sky-300 border-sky-400/20";
    }
  };

  // Colors for priority badges
  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "High":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low":
        return "bg-slate-500/10 text-mist border-slate-500/20";
      default:
        return "bg-slate-500/10 text-mist border-slate-500/20";
    }
  };

  // Completion counts
  const completedCount = normalizedGoals.filter((g) => g.status === "Completed" || g.completed).length;
  const progressPercent = normalizedGoals.length > 0 ? Math.round((completedCount / normalizedGoals.length) * 100) : 0;

  // Filter columns
  const plannedGoals = normalizedGoals.filter(g => g.status === "Planned");
  const inProgressGoals = normalizedGoals.filter(g => g.status === "In Progress");
  const completedGoals = normalizedGoals.filter(g => g.status === "Completed");

  return (
    <div className="glass-card p-6 md:p-8" id="goal-board-section">
      {/* Title & View Toggles Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-ink-700/80 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            {isFrench ? "Tableau d'Orientation et Objectifs" : "Personal Goal Board & Timelines"}
          </span>
          <h3 className="text-xl font-black font-display text-chalk mt-3">
            {isFrench ? "Suivi Intégral d'Objectifs Professionnels" : "Interactive Career Goal Board"}
          </h3>
          <p className="text-xs text-mist mt-1">
            {isFrench 
              ? "Gérez votre feuille de route, collaborez avec des mentors et déplacez vos objectifs en temps réel."
              : "Define target priorities, set calendar due dates, and track target stages using drag-and-drop mechanics."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* Circular Progress Gauge */}
          <div className="flex items-center gap-3 bg-ink-850/60 rounded-xl px-4 py-2 border border-ink-700">
            <div className="text-right">
              <p className="text-[10px] text-mist font-medium">{isFrench ? "Objectifs Atteints" : "Completed Goals"}</p>
              <p className="text-sm font-bold text-chalk font-mono">{completedCount}/{normalizedGoals.length}</p>
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-850" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-indigo-500"
                  strokeWidth="2.5"
                  strokeDasharray="100"
                  strokeDashoffset={100 - progressPercent}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-bold text-indigo-300 font-mono mt-0.5">{progressPercent}%</span>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex bg-ink-900 p-1 rounded-xl border border-ink-700/80">
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "board"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-mist hover:text-body"
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isFrench ? "Tableau" : "Board"}</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-mist hover:text-body"
              }`}
              title="Simple Checklist View"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>{isFrench ? "Liste" : "List"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Goal Addition Form */}
      <div className="mb-8 bg-ink-850/40 p-5 rounded-2xl border border-ink-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-[10px] uppercase font-bold text-mist mb-1.5">
                {isFrench ? "Objectif Cible" : "Goal Description / Milestone Title"}
              </label>
              <input
                type="text"
                required
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder={isFrench ? "ex. Compléter la première certification DevOps..." : "e.g. Schedule AWS Cloud Practitioner Exam..."}
                className="w-full bg-ink-800/80 border border-ink-600/60 rounded-xl px-4 py-2.5 text-xs text-body placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-sans"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-mist mb-1.5">
                {isFrench ? "Catégorie d'Objectif" : "Strategic Category"}
              </label>
              <select
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value as MentorGoal["category"])}
                className="w-full bg-ink-800/80 border border-ink-600/60 rounded-xl px-4 py-2.5 text-xs text-body focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-sans font-semibold cursor-pointer"
              >
                <option value="Technical">{isFrench ? "Technique / Code" : "Technical (Skills & Courses)"}</option>
                <option value="Leadership">Leadership & Project Management</option>
                <option value="Mentorship">{isFrench ? "Mentorat & Synchronisation" : "Mentorship & Case Studies"}</option>
                <option value="Industry Network">{isFrench ? "Réseau Sectoriel & Salons" : "Industry Networking"}</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full h-10 accent-gradient hover:opacity-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isFrench ? "Créer" : "Create"}</span>
              </button>
            </div>
          </div>

          {/* Advanced Properties toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <span>{showAdvanced ? (isFrench ? "- Masquer les options avancées" : "- Hide Advanced Options") : (isFrench ? "+ Configurer l'échéance et la priorité" : "+ Configure Timeline & Priority")}</span>
            </button>
          </div>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-ink-900/30 border border-ink-700/60"
            >
              <div>
                <label className="block text-[10px] uppercase font-bold text-mist mb-1.5">{isFrench ? "Niveau de Priorité" : "Priority"}</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewGoalPriority(p)}
                      className={`flex-1 py-1.5 px-3 border rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                        newGoalPriority === p
                          ? "bg-indigo-600 text-white border-transparent"
                          : "bg-ink-800/50 text-mist border-ink-600/60 hover:text-body"
                      }`}
                    >
                      {translatePriority(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-mist mb-1.5">{isFrench ? "Date d'Échéance" : "Target Due Date"}</label>
                <div className="relative">
                  <input
                    type="date"
                    value={newGoalDueDate}
                    onChange={(e) => setNewGoalDueDate(e.target.value)}
                    className="w-full bg-ink-800/80 border border-ink-600/60 rounded-lg px-3 py-1.5 text-[10px] text-body focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-mist mb-1.5">{isFrench ? "Note / Description" : "Contextual Details"}</label>
                <input
                  type="text"
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  placeholder={isFrench ? "Spécifier les ressources ou le plan..." : "e.g. Discuss study schedule with John..."}
                  className="w-full bg-ink-800/80 border border-ink-600/60 rounded-lg px-3 py-1.5 text-[10px] text-body placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </motion.div>
          )}
        </form>
      </div>

      {/* RENDER VIEW: KANBAN BOARD VIEW */}
      {viewMode === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-6">
          
          {/* COLUMN 1: PLANNED */}
          <div 
            onDragOver={(e) => handleDragOver(e, "Planned")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "Planned")}
            className={`rounded-2xl bg-ink-900/40 p-4 border transition-all min-h-[400px] flex flex-col justify-between ${
              dragOverCol === "Planned" ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10" : "border-ink-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-ink-700 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <h4 className="text-sm font-black text-body uppercase tracking-wider">{isFrench ? "Planifié" : "Planned"}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-ink-850 text-mist px-2 py-0.5 border border-ink-700 rounded-full">
                  {plannedGoals.length}
                </span>
              </div>

              <div className="space-y-3">
                {plannedGoals.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-dim italic border border-dashed border-ink-700 rounded-xl bg-ink-900/20">
                    {isFrench ? "Aucun objectif planifié" : "No goals planned yet"}
                  </div>
                ) : (
                  plannedGoals.map(g => (
                    <GoalBoardCard
                      key={g.id}
                      goal={g}
                      isFrench={isFrench}
                      onDragStart={handleDragStart}
                      onDelete={handleDeleteGoal}
                      onToggle={handleToggleGoal}
                      onUpdateStatus={handleUpdateStatus}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                      getPriorityColor={getPriorityColor}
                      translateCategory={translateCategory}
                      translatePriority={translatePriority}
                      expanded={expandedGoalId === g.id}
                      onToggleExpand={() => setExpandedGoalId(expandedGoalId === g.id ? null : g.id)}
                      onEditField={handleEditGoalField}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="text-[10px] text-dim text-center pt-4 italic font-mono border-t border-ink-700/50 mt-4">
              {isFrench ? "Glissez les cartes pour changer l'état" : "Drag card to change status"}
            </div>
          </div>

          {/* COLUMN 2: IN PROGRESS */}
          <div 
            onDragOver={(e) => handleDragOver(e, "In Progress")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "In Progress")}
            className={`rounded-2xl bg-ink-900/40 p-4 border transition-all min-h-[400px] flex flex-col justify-between ${
              dragOverCol === "In Progress" ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10" : "border-ink-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-ink-700 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <h4 className="text-sm font-black text-body uppercase tracking-wider">{isFrench ? "En Cours" : "In Progress"}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-ink-850 text-mist px-2 py-0.5 border border-ink-700 rounded-full">
                  {inProgressGoals.length}
                </span>
              </div>

              <div className="space-y-3">
                {inProgressGoals.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-dim italic border border-dashed border-ink-700 rounded-xl bg-ink-900/20">
                    {isFrench ? "Glissez un objectif ici pour commencer" : "No active work in progress"}
                  </div>
                ) : (
                  inProgressGoals.map(g => (
                    <GoalBoardCard
                      key={g.id}
                      goal={g}
                      isFrench={isFrench}
                      onDragStart={handleDragStart}
                      onDelete={handleDeleteGoal}
                      onToggle={handleToggleGoal}
                      onUpdateStatus={handleUpdateStatus}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                      getPriorityColor={getPriorityColor}
                      translateCategory={translateCategory}
                      translatePriority={translatePriority}
                      expanded={expandedGoalId === g.id}
                      onToggleExpand={() => setExpandedGoalId(expandedGoalId === g.id ? null : g.id)}
                      onEditField={handleEditGoalField}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="text-[10px] text-dim text-center pt-4 italic font-mono border-t border-ink-700/50 mt-4">
              {isFrench ? "Glissez les cartes pour changer l'état" : "Drag card to change status"}
            </div>
          </div>

          {/* COLUMN 3: COMPLETED */}
          <div 
            onDragOver={(e) => handleDragOver(e, "Completed")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "Completed")}
            className={`rounded-2xl bg-ink-900/40 p-4 border transition-all min-h-[400px] flex flex-col justify-between ${
              dragOverCol === "Completed" ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10" : "border-ink-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-ink-700 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h4 className="text-sm font-black text-body uppercase tracking-wider">{isFrench ? "Terminé" : "Completed"}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-ink-850 text-mist px-2 py-0.5 border border-ink-700 rounded-full">
                  {completedGoals.length}
                </span>
              </div>

              <div className="space-y-3">
                {completedGoals.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-dim italic border border-dashed border-ink-700 rounded-xl bg-ink-900/20">
                    {isFrench ? "Terminez des objectifs !" : "No goals completed yet"}
                  </div>
                ) : (
                  completedGoals.map(g => (
                    <GoalBoardCard
                      key={g.id}
                      goal={g}
                      isFrench={isFrench}
                      onDragStart={handleDragStart}
                      onDelete={handleDeleteGoal}
                      onToggle={handleToggleGoal}
                      onUpdateStatus={handleUpdateStatus}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                      getPriorityColor={getPriorityColor}
                      translateCategory={translateCategory}
                      translatePriority={translatePriority}
                      expanded={expandedGoalId === g.id}
                      onToggleExpand={() => setExpandedGoalId(expandedGoalId === g.id ? null : g.id)}
                      onEditField={handleEditGoalField}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="text-[10px] text-dim text-center pt-4 italic font-mono border-t border-ink-700/50 mt-4">
              {isFrench ? "Glissez les cartes pour changer l'état" : "Drag card to change status"}
            </div>
          </div>

        </div>
      )}

      {/* RENDER VIEW: ORIGINAL LIST CHECKLIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3 mt-6">
          <AnimatePresence initial={false}>
            {normalizedGoals.length === 0 ? (
              <div className="text-center py-10 text-dim text-xs italic">
                {isFrench 
                  ? "Aucun objectif défini actuellement."
                  : "No mentorship goals currently defined. Use the input form above to establish action targets."}
              </div>
            ) : (
              normalizedGoals.map((g) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                    g.status === "Completed" || g.completed
                      ? "bg-ink-850/30 border-ink-700 opacity-70"
                      : "bg-ink-850/60 border-ink-600/30 hover:border-ink-600/60"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0 mr-4">
                    <button
                      onClick={() => handleToggleGoal(g.id)}
                      className="text-mist hover:text-indigo-400 transition shrink-0 mt-0.5 cursor-pointer"
                    >
                      {g.status === "Completed" || g.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-dim hover:text-indigo-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold leading-snug break-words ${g.status === "Completed" || g.completed ? "line-through text-dim" : "text-body"}`}>
                        {g.text}
                      </p>
                      
                      {g.description && (
                        <p className="text-xs text-mist mt-1 leading-relaxed">{g.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {getCategoryIcon(g.category)}
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-full ${getCategoryColor(g.category)}`}>
                          {translateCategory(g.category)}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-full ${getPriorityColor(g.priority)}`}>
                          {translatePriority(g.priority)}
                        </span>
                        {g.dueDate && (
                          <span className="text-[9px] font-mono text-dim flex items-center gap-1 bg-ink-900/40 px-2 py-0.5 border border-ink-700 rounded-full">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            <span>{g.dueDate}</span>
                          </span>
                        )}
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded-full ${
                          g.status === "Completed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          g.status === "In Progress" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                          "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                        }`}>
                          {g.status === "In Progress" ? (isFrench ? "En Cours" : "In Progress") :
                           g.status === "Completed" ? (isFrench ? "Terminé" : "Completed") :
                           (isFrench ? "Planifié" : "Planned")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedGoalId(expandedGoalId === g.id ? null : g.id)}
                      className="p-1.5 text-dim hover:text-indigo-400 hover:bg-ink-800 rounded-lg transition"
                      title="Edit advanced fields"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1.5 text-dim hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                      title={isFrench ? "Supprimer l'objectif" : "Delete goal"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// CHILD KANBAN GOAL BOARD CARD COMPONENT
// -------------------------------------------------------------
interface GoalBoardCardProps {
  key?: string;
  goal: MentorGoal;
  isFrench: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateStatus: (id: string, status: "Planned" | "In Progress" | "Completed") => void;
  getCategoryIcon: (cat: MentorGoal["category"]) => React.ReactNode;
  getCategoryColor: (cat: MentorGoal["category"]) => string;
  getPriorityColor: (prio: string) => string;
  translateCategory: (cat: MentorGoal["category"]) => string | undefined;
  translatePriority: (prio: string) => string;
  expanded: boolean;
  onToggleExpand: () => void;
  onEditField: (id: string, field: keyof MentorGoal, value: any) => void;
}

function GoalBoardCard({
  goal, isFrench, onDragStart, onDelete, onToggle, onUpdateStatus,
  getCategoryIcon, getCategoryColor, getPriorityColor, translateCategory,
  translatePriority, expanded, onToggleExpand, onEditField
}: GoalBoardCardProps) {
  
  const statusOptions = ["Planned", "In Progress", "Completed"] as const;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, goal.id)}
      className={`bg-ink-850 border hover:border-ink-600/80 p-4 rounded-xl shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none group relative ${
        goal.status === "Completed" ? "border-ink-700/60 bg-ink-900/30 opacity-75" : "border-ink-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => onToggle(goal.id)}
            className="text-dim hover:text-indigo-400 transition shrink-0 mt-0.5 cursor-pointer"
            title={isFrench ? "Marquer comme fait / non fait" : "Toggle completed"}
          >
            {goal.status === "Completed" || goal.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="w-4 h-4 text-dim group-hover:text-mist" />
            )}
          </button>
          
          <div className="min-w-0">
            <h5 className={`text-xs font-bold leading-relaxed break-words ${
              goal.status === "Completed" || goal.completed ? "line-through text-dim" : "text-body"
            }`}>
              {goal.text}
            </h5>
            
            {goal.description && !expanded && (
              <p className="text-[10px] text-mist mt-1 truncate max-w-[200px]">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-dim hover:text-red-400 hover:bg-red-500/10 rounded transition shrink-0 cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Badges strip */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-ink-700/60">
        <span className="shrink-0">{getCategoryIcon(goal.category)}</span>
        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded ${getCategoryColor(goal.category)}`}>
          {translateCategory(goal.category)}
        </span>
        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded ${getPriorityColor(goal.priority || "Medium")}`}>
          {translatePriority(goal.priority || "Medium")}
        </span>
        {goal.dueDate && (
          <span className="text-[8px] font-mono text-mist flex items-center gap-1 bg-ink-900 px-1.5 py-0.5 border border-ink-700 rounded">
            <Calendar className="w-2.5 h-2.5 text-indigo-400" />
            <span>{goal.dueDate}</span>
          </span>
        )}
      </div>

      {/* Mobile-friendly shift buttons & Advanced Toggle */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-ink-700/40">
        <button
          onClick={onToggleExpand}
          className="text-[9px] font-mono font-bold text-mist hover:text-chalk flex items-center gap-0.5"
        >
          <span>{expanded ? (isFrench ? "Fermer" : "Collapse") : (isFrench ? "Détails" : "Details")}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Quick shifts for mobile where drag and drop might not be optimal */}
        <div className="flex gap-1 items-center bg-ink-900 px-1.5 py-0.5 border border-ink-700 rounded-lg">
          {goal.status !== "Planned" && (
            <button
              onClick={() => {
                const prevStatus = goal.status === "Completed" ? "In Progress" : "Planned";
                onUpdateStatus(goal.id, prevStatus);
              }}
              className="p-1 text-mist hover:text-indigo-400"
              title="Move left"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
          <span className="text-[8px] font-mono font-bold text-dim uppercase px-1">
            {isFrench ? "État" : "Move"}
          </span>
          {goal.status !== "Completed" && (
            <button
              onClick={() => {
                const nextStatus = goal.status === "Planned" ? "In Progress" : "Completed";
                onUpdateStatus(goal.id, nextStatus);
              }}
              className="p-1 text-mist hover:text-indigo-400"
              title="Move right"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded properties sub-panel */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-ink-700 space-y-3"
        >
          {/* Change description notes */}
          <div>
            <label className="block text-[8px] uppercase font-bold text-mist mb-1">{isFrench ? "Notes additionnelles" : "Goal Notes / Actions"}</label>
            <textarea
              rows={2}
              value={goal.description || ""}
              onChange={(e) => onEditField(goal.id, "description", e.target.value)}
              placeholder={isFrench ? "Saisir des notes..." : "Add Study links, mentors or targets..."}
              className="w-full bg-ink-900 border border-ink-700 rounded px-2 py-1 text-[10px] text-body focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Change due date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] uppercase font-bold text-mist mb-1">{isFrench ? "Échéance" : "Due Date"}</label>
              <input
                type="date"
                value={goal.dueDate || ""}
                onChange={(e) => onEditField(goal.id, "dueDate", e.target.value)}
                className="w-full bg-ink-900 border border-ink-700 rounded px-2 py-1 text-[9px] text-body font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-mist mb-1">{isFrench ? "Priorité" : "Priority"}</label>
              <select
                value={goal.priority || "Medium"}
                onChange={(e) => onEditField(goal.id, "priority", e.target.value)}
                className="w-full bg-ink-900 border border-ink-700 rounded px-1.5 py-1 text-[9px] text-body focus:outline-none"
              >
                <option value="High">{isFrench ? "Élevée" : "High"}</option>
                <option value="Medium">{isFrench ? "Moyenne" : "Medium"}</option>
                <option value="Low">{isFrench ? "Faible" : "Low"}</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
