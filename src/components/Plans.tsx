import React, { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { Check, CheckCircle2, XCircle } from "lucide-react";
import type { Lang } from "../career/assessment";
import { useAccount, type CheckoutRequest } from "../lib/account";
import { AccountForm } from "./AccountForm";
import { storedCountryCode } from "../lib/country";
import { Modal, Spinner } from "./ui";

export interface Pricing {
  currency: string;
  basic: number;
  pro: number;
  exam: number;
}

export function formatPrice(amount: number, currency: string, lang: Lang) {
  try {
    return new Intl.NumberFormat(lang === "french" ? "fr-FR" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function usePricing(countryCode: string) {
  const [data, setData] = useState<{ pricing: Pricing; months: number[]; testMode: boolean } | null>(null);
  useEffect(() => {
    fetch(apiUrl(`/api/pricing?country=${encodeURIComponent(countryCode)}`))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ pricing: { currency: "USD", basic: 2, pro: 5, exam: 2 }, months: [1, 3, 6, 12], testMode: false }));
  }, [countryCode]);
  return data;
}

/** Runs a checkout, asking guests to create an account first so purchases can't be lost. */
export function useCheckout(language: Lang) {
  const { isGuest, checkout } = useAccount();
  const fr = language === "french";
  const [pending, setPending] = useState<CheckoutRequest | null>(null);
  const [needAccount, setNeedAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async (request: CheckoutRequest) => {
    setError(null);
    if (isGuest) {
      setPending(request);
      setNeedAccount(true);
      return;
    }
    setBusy(true);
    try {
      await checkout(request);
    } catch (err: any) {
      setError(
        err?.message === "already_owned"
          ? (fr ? "Vous l'avez déjà acheté." : "You already own this.")
          : (fr ? "Le paiement n'a pas pu démarrer. Réessayez." : "The payment couldn't start. Please try again.")
      );
      setBusy(false);
    }
  };

  const accountModal = (
    <Modal open={needAccount} onClose={() => setNeedAccount(false)} title={fr ? "Créez votre compte pour payer" : "Create your account to pay"}>
      <div className="flex flex-col gap-4">
        <p className="text-body text-[15px]">
          {fr ? "Vos achats sont liés à votre compte, pour ne jamais les perdre." : "Purchases are tied to your account so you never lose them."}
        </p>
        <AccountForm
          language={language}
          onDone={() => {
            setNeedAccount(false);
            if (pending) setTimeout(() => start(pending), 300);
          }}
        />
      </div>
    </Modal>
  );

  return { start, busy, error, accountModal };
}

export function PlansPage({ language, countryCode }: { language: Lang; countryCode: string }) {
  const fr = language === "french";
  const { access } = useAccount();
  const data = usePricing(countryCode);
  const [months, setMonths] = useState(1);
  const { start, busy, error, accountModal } = useCheckout(language);

  if (!data) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;
  const { pricing } = data;
  const price = (n: number) => formatPrice(n, pricing.currency, language);

  const plans = [
    {
      id: "free" as const,
      name: fr ? "Gratuit" : "Free",
      price: price(0),
      features: fr
        ? ["Évaluation et pistes de carrière", "Feuille de route personnalisée", "Cours ProPath AI (sans examen)", "Chapitres gratuits des formateurs", "Progression sur cet appareil"]
        : ["Assessment and career matches", "Personal roadmap", "ProPath AI courses (exams not included)", "Free chapters from tutors", "Progress saved on this device"],
    },
    {
      id: "basic" as const,
      name: "Basic",
      price: price(pricing.basic),
      features: fr
        ? ["Tout le plan Gratuit", "Progression sauvegardée sur tous vos appareils", "Suivi de vos cours, de votre parcours et de votre feuille de route"]
        : ["Everything in Free", "Progress saved across all your devices", "Tracking of your courses, journey and roadmap"],
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: price(pricing.pro),
      features: fr
        ? ["Tout le plan Basic", "Gestionnaire de projet ProPath : plan, documents, accompagnement", "Portfolio professionnel", "Opportunités d'emploi"]
        : ["Everything in Basic", "ProPath Project Manager: plan, documents, coaching", "Professional portfolio", "Job opportunities"],
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="pp-eyebrow">{fr ? "Abonnements" : "Plans"}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{fr ? "Choisissez votre formule" : "Choose your plan"}</h1>
        <p className="text-mist">
          {fr
            ? "Payez par mobile money (M-Pesa, Orange Money, Airtel Money) ou par carte. Sans engagement : votre accès s'arrête simplement à la fin de la période payée."
            : "Pay with mobile money (M-Pesa, Orange Money, Airtel Money) or card. No commitment: access simply ends when the paid period does."}
        </p>
      </div>

      <div role="group" aria-label={fr ? "Durée" : "Duration"} className="flex flex-wrap gap-2">
        {data.months.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={months === m}
            onClick={() => setMonths(m)}
            className={`min-h-[44px] px-4 rounded-full border text-sm font-semibold ${months === m ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-mist hover:bg-ink-800"}`}
          >
            {m === 1 ? (fr ? "1 mois" : "1 month") : fr ? `${m} mois` : `${m} months`}
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {plans.map((plan) => {
          const current = access.plan === plan.id;
          const monthly = plan.id === "free" ? 0 : pricing[plan.id];
          return (
            <article key={plan.id} className={`pp-card p-6 flex flex-col gap-4 ${plan.id === "pro" ? "!border-ascent" : ""} ${current ? "!border-path" : ""}`}>
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
                {current && <span className="pp-chip bg-path-soft text-path-text">{fr ? "Votre formule" : "Current plan"}</span>}
              </div>
              <p>
                <span className="font-display text-3xl font-bold">{plan.price}</span>
                {plan.id !== "free" && <span className="text-mist"> / {fr ? "mois" : "month"}</span>}
              </p>
              {plan.id !== "free" && months > 1 && (
                <p className="text-sm text-mist -mt-2">{fr ? `${price(monthly * months)} pour ${months} mois` : `${price(monthly * months)} for ${months} months`}</p>
              )}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[15px] text-body"><Check className="w-5 h-5 text-path shrink-0" aria-hidden="true" />{f}</li>
                ))}
              </ul>
              {plan.id !== "free" && (
                <button
                  type="button"
                  className={`pp-btn ${plan.id === "pro" ? "pp-btn-ai" : "pp-btn-primary"}`}
                  disabled={busy}
                  onClick={() => start({ kind: "subscription", plan: plan.id, months, country: countryCode })}
                >
                  {busy && <Spinner />}
                  {current ? (fr ? "Prolonger" : "Extend") : (fr ? `Choisir ${plan.name}` : `Get ${plan.name}`)}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {access.expiresAt && (
        <p className="text-sm text-mist">
          {fr ? "Votre formule est active jusqu'au " : "Your plan is active until "}
          {new Date(access.expiresAt).toLocaleDateString(fr ? "fr-FR" : "en-US")}.
        </p>
      )}
      {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
      <p className="text-sm text-dim">
        {fr
          ? `Les examens et certificats des cours ProPath AI coûtent ${price(pricing.exam)} chacun. Les chapitres payants des formateurs s'achètent séparément.`
          : `ProPath AI course exams and certificates cost ${price(pricing.exam)} each. Paid tutor chapters are bought separately.`}
      </p>
      {accountModal}
    </div>
  );
}

/** Shown after the payment page sends the user back to ProPath. */
export function PaymentReturn({ transactionId, language, onDone }: { transactionId: string; language: Lang; onDone: () => void }) {
  const fr = language === "french";
  const { authedFetch, ready } = useAccount();
  const [state, setState] = useState<{ status: string; testMode?: boolean; kind?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let stop = false;
    let tries = 0;
    const poll = async () => {
      try {
        const res = await authedFetch(`/api/pay/status/${encodeURIComponent(transactionId)}`);
        const data = await res.json();
        if (stop) return;
        setState(res.ok ? data : { status: "error" });
        if (res.ok && data.status === "pending" && !data.testMode && tries++ < 40) setTimeout(poll, 3000);
      } catch {
        if (!stop) setState({ status: "error" });
      }
    };
    poll();
    return () => {
      stop = true;
    };
  }, [transactionId, ready]);

  const simulate = async (outcome: "accept" | "refuse") => {
    setBusy(true);
    const res = await authedFetch(`/api/pay/test/${encodeURIComponent(transactionId)}`, { method: "POST", body: JSON.stringify({ outcome }) });
    const data = await res.json().catch(() => ({}));
    setState((s) => ({ ...s, status: data.status || "error" }));
    setBusy(false);
  };

  const status = state?.status;
  return (
    <Modal open onClose={onDone} title={fr ? "Paiement" : "Payment"}>
      <div className="flex flex-col gap-4 items-start">
        {!state || (status === "pending" && !state.testMode) ? (
          <p className="flex items-center gap-3 text-body"><Spinner />{fr ? "Confirmation de votre paiement…" : "Confirming your payment…"}</p>
        ) : status === "pending" && state.testMode ? (
          <>
            <p className="text-body">{fr ? "Mode test : aucun argent réel n'est utilisé. Simulez le résultat du paiement." : "Test mode: no real money is used. Simulate the payment result."}</p>
            <div className="flex gap-3">
              <button type="button" className="pp-btn pp-btn-primary" disabled={busy} onClick={() => simulate("accept")}>{fr ? "Simuler un paiement réussi" : "Simulate success"}</button>
              <button type="button" className="pp-btn pp-btn-secondary" disabled={busy} onClick={() => simulate("refuse")}>{fr ? "Simuler un échec" : "Simulate failure"}</button>
            </div>
          </>
        ) : status === "accepted" ? (
          <>
            <p className="flex items-center gap-3 text-chalk font-medium"><CheckCircle2 className="w-6 h-6 text-path" aria-hidden="true" />{fr ? "Paiement confirmé. Merci !" : "Payment confirmed. Thank you!"}</p>
            <button type="button" className="pp-btn pp-btn-primary" onClick={onDone}>{fr ? "Continuer" : "Continue"}</button>
          </>
        ) : (
          <>
            <p className="flex items-center gap-3 text-chalk font-medium"><XCircle className="w-6 h-6 text-danger" aria-hidden="true" />
              {status === "refused" ? (fr ? "Le paiement n'a pas abouti." : "The payment didn't go through.") : (fr ? "Nous n'avons pas pu vérifier ce paiement." : "We couldn't check this payment.")}
            </p>
            <p className="text-sm text-mist">
              {fr
                ? `Vous pouvez réessayer. Si de l'argent a été débité, contactez-nous avec la référence ${transactionId}.`
                : `You can try again. If money was taken, contact us with reference ${transactionId}.`}
            </p>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={onDone}>{fr ? "Fermer" : "Close"}</button>
          </>
        )}
      </div>
    </Modal>
  );
}

/** Purchase prompt for the exam and certificate of a ProPath AI course. */
export function ExamPaywall({ open, onClose, courseId, courseTitle, language }: {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  language: Lang;
}) {
  const fr = language === "french";
  const countryCode = storedCountryCode();
  const data = usePricing(countryCode);
  const { start, busy, error, accountModal } = useCheckout(language);
  return (
    <>
      <Modal open={open} onClose={onClose} title={fr ? "Examen et certificat" : "Exam and certificate"}>
        <div className="flex flex-col gap-4">
          <p className="text-body text-[15px]">
            {fr
              ? `Le cours « ${courseTitle} » est gratuit. Pour obtenir votre certificat ProPath, débloquez l'examen.`
              : `The course "${courseTitle}" is free. To get your ProPath certificate, unlock the exam.`}
          </p>
          {data ? (
            <p className="font-display text-2xl font-bold">{formatPrice(data.pricing.exam, data.pricing.currency, language)}</p>
          ) : (
            <Spinner />
          )}
          <p className="text-sm text-mist">{fr ? "Paiement par mobile money ou carte. Accès définitif à l'examen de ce cours." : "Pay with mobile money or card. Permanent access to this course's exam."}</p>
          {error && <p className="text-sm text-danger-text" role="alert">{error}</p>}
          <button type="button" className="pp-btn pp-btn-primary" disabled={busy || !data} onClick={() => start({ kind: "exam", courseId, country: countryCode })}>
            {busy && <Spinner />}{fr ? "Débloquer l'examen" : "Unlock the exam"}
          </button>
        </div>
      </Modal>
      {accountModal}
    </>
  );
}
