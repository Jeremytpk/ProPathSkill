import React, { useRef, useState } from "react";
import { useAccount } from "../lib/account";
import type { Lang } from "../career/assessment";
import { Modal, Spinner } from "./ui";

function errorMessage(code: string | undefined, fr: boolean) {
  switch (code) {
    case "auth/email-already-in-use":
    case "auth/credential-already-in-use":
      return fr ? "Cet e-mail a déjà un compte. Connectez-vous plutôt." : "This email already has an account. Sign in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return fr ? "E-mail ou mot de passe incorrect." : "Wrong email or password.";
    case "auth/weak-password":
      return fr ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return fr ? "Adresse e-mail invalide." : "That email address isn't valid.";
    case "auth/popup-closed-by-user":
      return null;
    case "auth/operation-not-allowed":
      return fr ? "Cette méthode de connexion n'est pas encore activée." : "This sign-in method isn't enabled yet.";
    default:
      return fr ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.";
  }
}

export function AccountForm({ language, onDone }: { language: Lang; onDone?: () => void }) {
  const fr = language === "french";
  const { signUpWithEmail, signInWithEmail, resetPassword } = useAccount();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      await fn();
      onDone?.();
    } catch (err: any) {
      setError(errorMessage(err?.code, fr));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => (mode === "signup" ? signUpWithEmail(email.trim(), password) : signInWithEmail(email.trim(), password)));
  };

  const forgot = async () => {
    if (!email.trim()) {
      setError(fr ? "Saisissez d'abord votre e-mail." : "Enter your email first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setInfo(fr ? "E-mail de réinitialisation envoyé." : "Password reset email sent.");
    } catch (err: any) {
      setError(errorMessage(err?.code, fr));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-ink-900 border border-ink-700">
        {(["signup", "signin"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`min-h-[40px] rounded-lg text-sm font-semibold ${mode === m ? "bg-ink-800 text-chalk" : "text-mist"}`}
          >
            {m === "signup" ? (fr ? "Créer un compte" : "Create account") : (fr ? "Se connecter" : "Sign in")}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div>
          <label className="pp-label" htmlFor="acct-email">Email</label>
          <input id="acct-email" type="email" className="pp-input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label className="pp-label" htmlFor="acct-password">{fr ? "Mot de passe" : "Password"}</label>
          <input
            id="acct-password"
            type="password"
            className="pp-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>
        {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
        {info && <p className="text-sm text-path-text" role="status">{info}</p>}
        <button type="submit" className="pp-btn pp-btn-primary" disabled={busy}>
          {busy && <Spinner />}
          {mode === "signup" ? (fr ? "Créer mon compte" : "Create my account") : (fr ? "Se connecter" : "Sign in")}
        </button>
        {mode === "signin" && (
          <button type="button" className="text-sm text-mist hover:text-chalk self-start min-h-[44px]" onClick={forgot} disabled={busy}>
            {fr ? "Mot de passe oublié ?" : "Forgot password?"}
          </button>
        )}
      </form>
      {mode === "signup" && (
        <p className="text-xs text-dim">
          {fr ? "Vos résultats d'évaluation sur cet appareil sont conservés." : "Your assessment results on this device are kept."}
        </p>
      )}
    </div>
  );
}

/**
 * Runs an action only for signed-in users. Visitors are asked to sign in or create
 * an account first, then the action continues.
 */
export function useAccountGate(language: Lang) {
  const fr = language === "french";
  const { isGuest } = useAccount();
  const [open, setOpen] = useState(false);
  const pending = useRef<(() => void) | null>(null);

  const guard = (action: () => void) => {
    if (!isGuest) {
      action();
      return;
    }
    pending.current = action;
    setOpen(true);
  };

  const modal = (
    <Modal open={open} onClose={() => setOpen(false)} title={fr ? "Créez votre compte pour commencer" : "Create your account to start"}>
      <div className="flex flex-col gap-4">
        <p className="text-body text-[15px]">
          {fr
            ? "Les cours ProPath sont liés à votre compte : votre progression, vos chapitres et vos certificats vous suivent."
            : "ProPath courses are tied to your account, so your progress, chapters and certificates stay with you."}
        </p>
        <AccountForm
          language={language}
          onDone={() => {
            setOpen(false);
            const action = pending.current;
            pending.current = null;
            if (action) setTimeout(action, 300);
          }}
        />
      </div>
    </Modal>
  );

  return { guard, modal };
}
