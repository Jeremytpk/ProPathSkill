import React from "react";
import { motion } from "motion/react";

interface CircularDialProps {
  score: number; // e.g. 9.4
  title: string;
  subtitle?: string;
  size?: number;
  selectedLanguage?: "english" | "french";
}

export function CircularDial({ score, title, subtitle = "Compatibility Index", size = 160, selectedLanguage = "english" }: CircularDialProps) {
  const radius = 65;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Score is out of 10, so percentage is score * 10
  const percentage = Math.min(Math.max(score, 0), 10) * 10;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-5 glass-card">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800/60"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Foreground Circle with Accent Gradient */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Core Value Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            className="text-4.5xl font-extrabold font-display text-white tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 mt-1">
            {selectedLanguage === "french" ? "Adéquation" : "Match Score"}
          </span>
        </div>
      </div>

      <div className="text-center mt-4">
        <h4 className="text-sm font-semibold text-slate-100 font-display">{title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
