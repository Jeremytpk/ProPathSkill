import React from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Reset Vocational Dossier?",
  message = "Are you sure you want to clear your current career alignment report and restart your vocational discovery assessment? This action will reset your active progress.",
  confirmText = "Yes, Start New Assessment",
  cancelText = "Keep Current Dossier"
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="confirmation-modal-container">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            id="confirmation-modal-backdrop"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md glass-card p-6 shadow-2xl overflow-hidden z-10 border border-slate-800"
            id="confirmation-modal-content"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 hover:bg-slate-800/50 rounded-lg cursor-pointer"
              id="confirmation-modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4 animate-pulse" id="confirmation-modal-icon-wrapper">
                <RefreshCw className="w-6 h-6 text-indigo-400" />
              </div>

              <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-indigo-400">
                System Action Required
              </span>
              <h3 className="text-lg font-bold font-display text-white mt-1" id="confirmation-modal-title">
                {title}
              </h3>

              <p className="text-xs text-slate-400 mt-3 px-2 leading-relaxed" id="confirmation-modal-message">
                {message}
              </p>

              {/* Warnings/Registry notice */}
              <div className="flex items-start gap-2.5 bg-slate-950/50 rounded-xl p-3 border border-slate-900/60 text-left w-full text-[11px] text-slate-400 mt-5 mb-1" id="confirmation-modal-notice">
                <AlertCircle className="w-4 h-4 text-indigo-400/80 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Registry Sync Warning:</span> Local drafts and active goal lists will be removed. Share your report to copy the permanent cloud URL if you wish to reference it later.
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full mt-6" id="confirmation-modal-actions">
                <button
                  onClick={onClose}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                  id="confirmation-modal-cancel-btn"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full accent-gradient text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/25 cursor-pointer active:scale-95"
                  id="confirmation-modal-confirm-btn"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
