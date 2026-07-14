import React, { useEffect, useState, useRef } from "react";
import { getAICourse } from "../lib/firebase";
import { 
  BookOpen, Send, CheckCircle2, XCircle, Award, Sparkles, 
  ChevronRight, GraduationCap, X, MessageSquare, Loader2, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AICourseWorkspaceProps {
  courseId: string;
  onClose: () => void;
  language?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
}

export function AICourseWorkspace({ courseId, onClose, language = "english" }: AICourseWorkspaceProps) {
  const isFrench = language.toLowerCase() === "french";

  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  
  // Quiz states (for each chapter index)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    async function loadCourse() {
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
        if (data) {
          setCourse(data);
          // Set initial chat message from tutor persona
          setChatMessages([
            {
              id: "msg_welcome",
              sender: "tutor",
              text: isFrench 
                ? `Bonjour ! Je suis ${data.aiTutorPersona || "votre tuteur"}. Bienvenue dans le cours "${data.title}". Je suis là pour vous aider à comprendre chaque chapitre et répondre à vos questions en temps réel. Quel sujet souhaitez-vous aborder en premier ?`
                : `Hello! I am ${data.aiTutorPersona || "your tutor"}. Welcome to the "${data.title}" course. I am here to help you understand each chapter and answer your questions in real-time. What topic would you like to discuss first?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId, isFrench]);

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

  // Track completed chapters (where quiz has been submitted and answered correctly)
  const correctAnswersCount = Object.entries(submittedAnswers).filter(([idx, submitted]) => {
    if (!submitted) return false;
    const chIdx = parseInt(idx, 10);
    const correctIdx = chapters[chIdx]?.quiz?.correctIndex;
    return selectedAnswers[chIdx] === correctIdx;
  }).length;

  const isCourseComplete = correctAnswersCount === chaptersCount;

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
      const response = await fetch("/api/ask-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsgText,
          courseContext: {
            courseTitle: course.title,
            currentChapterTitle: activeChapter?.title,
            currentChapterContent: activeChapter?.content
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
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* LEFT CONTENT AREA: Lesson text & Chapter Quizzes */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto border-r border-slate-900 bg-slate-950">
        
        {/* Workspace Subheader / Navigation */}
        <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-900 flex items-center justify-between sticky top-0 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block font-bold">
                {isFrench ? "Campus Privé ProPathSkill" : "ProPathSkill Private Campus"}
              </span>
              <h2 className="text-sm md:text-base font-black text-white truncate max-w-xs md:max-w-md font-display">
                {course.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker Banner */}
        <div className="px-6 py-3.5 bg-indigo-600/5 border-b border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-mono">
              {isFrench ? "Progression du Curriculum :" : "Curriculum Syllabus Progress:"}{" "}
              <strong className="text-white font-bold">{correctAnswersCount} / {chaptersCount}</strong>{" "}
              {isFrench ? "quiz réussis" : "quizzes passed"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCourseComplete ? (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition animate-bounce cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isFrench ? "Réclamer le Certificat" : "Claim AI Certificate"}</span>
              </button>
            ) : (
              <span className="text-[10px] text-indigo-400/80 font-mono font-bold uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {isFrench ? "Complétez tous les quiz pour débloquer" : "Pass all quizzes to unlock graduation"}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 max-w-4xl w-full mx-auto space-y-6 flex-1">
          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {chapters.map((chap: any, idx: number) => {
              const isActive = activeChapterIndex === idx;
              const isPassed = submittedAnswers[idx] && selectedAnswers[idx] === chap?.quiz?.correctIndex;
              const isWrong = submittedAnswers[idx] && selectedAnswers[idx] !== chap?.quiz?.correctIndex;

              return (
                <button
                  key={chap.id || idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col ${
                    isActive 
                      ? "bg-slate-900 border-indigo-500 text-white shadow-md shadow-indigo-500/5" 
                      : "bg-slate-900/40 border-slate-900 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                    {isFrench ? `Chapitre ${idx + 1}` : `Chapter ${idx + 1}`}
                  </span>
                  <span className="text-[11px] font-semibold truncate mt-1 block">
                    {chap.title}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider">
                    {isPassed && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {isFrench ? "Réussi" : "PASSED"}
                      </span>
                    )}
                    {isWrong && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {isFrench ? "Échoué" : "FAILED"}
                      </span>
                    )}
                    {!submittedAnswers[idx] && (
                      <span className="text-slate-500">
                        {isFrench ? "En Cours" : "INCOMPLETE"}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Text Container */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                {isFrench ? "Syllabus interactif" : "Interactive Syllabus"}
              </span>
              <span className="text-slate-500 text-[10px] font-mono">
                {course.aiTutorPersona || "ProPath AI Guide"}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white font-display">
              {activeChapter?.title}
            </h3>

            {/* Lesson Body */}
            <div className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
              {activeChapter?.content}
            </div>
          </div>

          {/* Chapter Quiz Card */}
          {activeChapter?.quiz && (
            <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {isFrench ? "Test de validation de chapitre" : "Chapter Verification Challenge"}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white leading-snug">
                {activeChapter.quiz.question}
              </h4>

              <div className="space-y-2.5">
                {activeChapter.quiz.options.map((opt: string, optIdx: number) => {
                  const isSelected = selectedAnswers[activeChapterIndex] === optIdx;
                  const isSubmitted = submittedAnswers[activeChapterIndex];
                  const isCorrect = activeChapter.quiz.correctIndex === optIdx;

                  let optionStyle = "border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-300";
                  if (isSelected && !isSubmitted) {
                    optionStyle = "border-indigo-500 bg-indigo-600/5 text-white";
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-500/5 text-emerald-300";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-500/5 text-rose-300";
                    } else {
                      optionStyle = "border-slate-900 bg-slate-950/20 text-slate-500 cursor-not-allowed";
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
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Feedback controls */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {!submittedAnswers[activeChapterIndex] ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswers[activeChapterIndex] === undefined}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isFrench ? "Soumettre ma réponse" : "Lock In Answer"}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-slate-300 text-xs leading-relaxed w-full">
                    <span className="font-bold font-mono text-[10px] block mb-1 uppercase tracking-widest text-indigo-400">
                      {isFrench ? "Explication pédagogique" : "Academic Explanation"}
                    </span>
                    {activeChapter.quiz.explanation}
                    
                    {/* Retry button if they failed */}
                    {selectedAnswers[activeChapterIndex] !== activeChapter.quiz.correctIndex && (
                      <button
                        onClick={() => {
                          setSubmittedAnswers(prev => ({ ...prev, [activeChapterIndex]: false }));
                          setSelectedAnswers(prev => {
                            const copy = { ...prev };
                            delete copy[activeChapterIndex];
                            return copy;
                          });
                        }}
                        className="mt-3 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-800 text-slate-300 transition"
                      >
                        {isFrench ? "Réessayer la question" : "Retry Question"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: AI Tutor Interactive Chat Companion */}
      <div className="w-full md:w-96 h-96 md:h-full border-t md:border-t-0 border-slate-900 bg-slate-900/30 flex flex-col">
        
        {/* Tutor Header */}
        <div className="px-5 py-4 border-b border-slate-900 flex items-center gap-3 bg-slate-900/40">
          <div className="relative">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white font-display">
              {course.aiTutorPersona || "Socrates Guide"}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 block">
              {isFrench ? "Tuteur d'IA Interactif Actif" : "Interactive AI Mentor Active"}
            </span>
          </div>
        </div>

        {/* Chat Thread */}
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
                      ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-indigo-600/5" 
                      : "bg-slate-900 border border-slate-800/80 text-slate-300 rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line font-light">{msg.text}</p>
                </div>
                <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          {sendingQuestion && (
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pl-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>{course.aiTutorPersona || "Tutor"} {isFrench ? "réfléchit..." : "is typing..."}</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Question Submission Input */}
        <form 
          onSubmit={handleSendQuestion} 
          className="p-3 border-t border-slate-900 bg-slate-950/40 flex gap-2"
        >
          <input
            type="text"
            disabled={sendingQuestion}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={isFrench ? "Posez une question sur le cours..." : "Ask your AI tutor a question..."}
            className="flex-1 text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || sendingQuestion}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* DIPLOMA / COMPLETION CERTIFICATE MODAL */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 rounded-3xl border border-indigo-500/30 p-6 md:p-10 w-full max-w-2xl relative shadow-2xl text-center overflow-hidden"
            >
              {/* Confetti / Sparkles Ambient Backdrops */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500" />
              <div className="absolute top-10 right-10 text-indigo-500/10"><Sparkles className="w-40 h-40" /></div>

              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                {/* Seal Icon */}
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8" />
                </div>

                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-indigo-400 block mb-2">
                  {isFrench ? "Diplôme de Réussite Académique" : "Official Academic Diploma of Achievement"}
                </span>

                <h2 className="text-xl md:text-2xl font-black text-white font-display uppercase tracking-tight">
                  ProPathSkill Certificate
                </h2>
                
                <div className="h-[1px] w-24 bg-slate-800 my-4" />

                <p className="text-xs text-slate-400 italic max-w-sm">
                  {isFrench 
                    ? "Ce certificat de réussite valide l'alignement professionnel et la maîtrise technique complète de la formation :" 
                    : "This educational credential verifies full professional alignment and vocational mastery of the interactive syllabus:"}
                </p>

                <h3 className="text-md md:text-lg font-black text-white mt-3 font-display">
                  {course.title}
                </h3>

                <p className="text-xs text-indigo-400 mt-2 font-mono font-bold">
                  {isFrench ? "Délivré par le Mentor Virtuel :" : "Endorsed by Virtuous AI Faculty Mentor:"} {course.aiTutorPersona || "Socrates"}
                </p>

                <div className="w-full bg-slate-950 rounded-2xl p-4 border border-slate-900 mt-6 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">
                      {isFrench ? "Date de diplomation" : "Date of Award"}
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-bold">
                      {new Date().toLocaleDateString(isFrench ? "fr-FR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block text-right">
                      {isFrench ? "ID d'Authentification" : "Security Checksum"}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-mono block font-bold">
                      PPS-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full mt-8">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    {isFrench ? "Imprimer mon Certificat" : "Print Certificate"}
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition shadow-lg shadow-indigo-600/25"
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
