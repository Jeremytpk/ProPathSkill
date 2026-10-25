import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="pp-prose text-[15px] leading-relaxed text-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function ProgressBar({ percent, tone = "path", label }: { percent: number; tone?: "path" | "gold" | "ascent"; label?: string }) {
  const color = tone === "gold" ? "bg-gold" : tone === "ascent" ? "bg-ascent" : "bg-path";
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="h-2 rounded-full bg-ink-800 overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Meter({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-body">{label}</span>
        <span className="font-mono text-chalk">{value}</span>
      </div>
      <ProgressBar percent={value} label={label} />
      {sub && <p className="text-xs text-dim">{sub}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto pp-card rounded-b-none sm:rounded-b-[20px] p-5 sm:p-7`}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="font-display text-xl font-semibold text-chalk">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-11 h-11 -mt-2 -mr-2 rounded-xl flex items-center justify-center text-mist hover:bg-ink-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className={`inline-block rounded-full border-2 border-ink-600 border-t-path animate-spin ${className}`} aria-hidden="true" />
  );
}
