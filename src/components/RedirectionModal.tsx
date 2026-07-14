import React, { useEffect, useState } from "react";
import { EducationResource } from "../types";
import { ExternalLink, ShieldCheck, X, ArrowRight, Hourglass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AICourseWorkspace } from "./AICourseWorkspace";

interface RedirectionModalProps {
  resource: EducationResource | null;
  onClose: () => void;
  language?: string;
}

export function RedirectionModal({ resource, onClose, language = "english" }: RedirectionModalProps) {
  const [countdown, setCountdown] = useState(5);
  const isAICourse = resource?.link?.startsWith("propathskill://course/");

  useEffect(() => {
    if (!resource || isAICourse) return;

    // Reset countdown when resource is selected
    setCountdown(5);

    // Set interval for countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Safe redirect
          window.open(resource.link, "_blank", "noopener,noreferrer");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resource, onClose, isAICourse]);

  if (!resource) return null;

  if (isAICourse) {
    const courseId = resource.link.replace("propathskill://course/", "");
    return (
      <AICourseWorkspace
        courseId={courseId}
        onClose={onClose}
        language={language}
      />
    );
  }

  const handleProceedImmediately = () => {
    window.open(resource.link, "_blank", "noopener,noreferrer");
    onClose();
  };

  const progressPercent = (countdown / 5) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md glass-card p-6 shadow-2xl overflow-hidden z-10"
        >
          {/* Progress bar countdown */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              className="h-full accent-gradient"
              initial={{ width: "100%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "linear" }}
              key={countdown}
            />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 hover:bg-slate-800/50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4 animate-pulse">
              <Hourglass className="w-6 h-6" />
            </div>

            <span className="text-[10px] tracking-widest uppercase font-bold text-indigo-400">
              Free Launchpad Redirector
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              Leaving ProPath
            </h3>

            <p className="text-xs text-slate-400 mt-2 px-2">
              You are being securely redirected to the educational resource hosted on <span className="text-slate-200 font-semibold">{resource.platform}</span>:
            </p>

            {/* Course Information Box */}
            <div className="w-full bg-slate-850/60 rounded-xl p-3 border border-slate-800 text-left my-4">
              <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase">{resource.type}</p>
              <h4 className="text-sm font-semibold text-white mt-1 leading-snug line-clamp-2">
                {resource.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span>Duration:</span> <span className="text-slate-200 font-mono">{resource.duration}</span>
              </p>
            </div>

            {/* Reassurance Message */}
            <div className="flex items-start gap-2 bg-indigo-500/5 rounded-lg p-3 border border-indigo-500/10 text-left w-full text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Records Safe:</span> Your assessment profiles, career-growth indices, and goal planners remain safely stored in our cloud registry.
              </div>
            </div>

            <div className="text-sm text-slate-400 mt-5 mb-1 font-mono">
              Auto-redirecting in <span className="text-indigo-400 font-bold font-display text-base">{countdown}</span> seconds...
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <button
                onClick={onClose}
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50 py-2 rounded-xl text-xs font-bold transition"
              >
                Cancel Redirect
              </button>
              <button
                onClick={handleProceedImmediately}
                className="w-full accent-gradient text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                Proceed Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
