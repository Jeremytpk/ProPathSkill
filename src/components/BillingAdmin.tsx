import React, { useState } from "react";
import { Spinner } from "./ui";

const KEY_STORAGE = "propath_admin_key";
const COUNTRY_CODES = ["DEFAULT", "CD", "CI", "SN", "FR", "CA", "US"];

interface Pricing {
  currency: string;
  basic: number;
  pro: number;
  exam: number;
}

/** Prices, manual plan grants and recent payments. Needs PROPATH_ADMIN_KEY. */
export function BillingAdmin() {
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return sessionStorage.getItem(KEY_STORAGE) || "";
    } catch {
      return "";
    }
  });
  const [table, setTable] = useState<Record<string, Pricing> | null>(null);
  const [defaults, setDefaults] = useState<Pricing | null>(null);
  const [country, setCountry] = useState("CD");
  const [form, setForm] = useState<Pricing>({ currency: "USD", basic: 2, pro: 5, exam: 2 });
  const [grant, setGrant] = useState({ email: "", plan: "basic", months: "1" });
  const [payments, setPayments] = useState<any[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const call = async (path: string, init: RequestInit = {}) => {
    try {
      sessionStorage.setItem(KEY_STORAGE, adminKey);
    } catch {
      // ignore
    }
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", "x-admin-key": adminKey } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
    } catch (err: any) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const pick = (code: string, t = table, d = defaults) => {
    setCountry(code);
    const key = code === "DEFAULT" ? "default" : code;
    setForm({ ...(d || { currency: "USD", basic: 2, pro: 5, exam: 2 }), ...(t?.[key] || {}) });
  };

  const load = () =>
    run(async () => {
      const [pricing, pay] = await Promise.all([call("/api/admin/pricing"), call("/api/admin/payments")]);
      setTable(pricing.countries);
      setDefaults(pricing.defaults);
      setPayments(pay.payments);
      pick(country, pricing.countries, pricing.defaults);
    });

  const savePricing = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await call("/api/admin/pricing", { method: "POST", body: JSON.stringify({ country, pricing: form }) });
      setMessage({ ok: true, text: `Saved prices for ${country}.` });
      const pricing = await call("/api/admin/pricing");
      setTable(pricing.countries);
    });
  };

  const grantPlan = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await call("/api/admin/subscription", {
        method: "POST",
        body: JSON.stringify({ email: grant.email.trim(), plan: grant.plan, months: Number(grant.months) }),
      });
      setMessage({ ok: true, text: grant.plan === "free" ? `Removed the plan for ${grant.email}.` : `Granted ${grant.plan} to ${grant.email}.` });
    });
  };

  const num = (k: keyof Pricing) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: Number(e.target.value) });

  return (
    <section className="pp-card p-5 sm:p-6 flex flex-col gap-6 mb-8" aria-labelledby="billing-admin-h">
      <div className="flex flex-col gap-1">
        <h2 id="billing-admin-h" className="font-display text-xl font-semibold">Plans and payments</h2>
        <p className="text-sm text-mist">Requires PROPATH_ADMIN_KEY and a Firebase service account on the server.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <div>
          <label className="pp-label" htmlFor="admin-key">Admin key</label>
          <input id="admin-key" type="password" className="pp-input" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} autoComplete="off" />
        </div>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={load} disabled={!adminKey || busy}>{busy && <Spinner />}Load</button>
      </div>

      {message && <p className={`text-sm ${message.ok ? "text-path-text" : "text-danger-text"}`} role="status">{message.text}</p>}

      {table && (
        <form onSubmit={savePricing} className="flex flex-col gap-3">
          <h3 className="font-display font-semibold">Prices by country</h3>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_CODES.map((c) => (
              <button key={c} type="button" aria-pressed={country === c} onClick={() => pick(c)}
                className={`min-h-[40px] px-3 rounded-full border text-sm font-semibold ${country === c ? "border-path bg-path-soft text-path-text" : "border-ink-600 text-mist"}`}>
                {c === "DEFAULT" ? "Default" : c}{(c === "DEFAULT" ? table.default : table[c]) ? " ·" : ""}
              </button>
            ))}
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <div>
              <label className="pp-label" htmlFor="pr-cur">Currency</label>
              <input id="pr-cur" className="pp-input" value={form.currency} maxLength={3} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="pp-label" htmlFor="pr-basic">Basic / month</label>
              <input id="pr-basic" type="number" min={0} step="0.01" className="pp-input" value={form.basic} onChange={num("basic")} />
            </div>
            <div>
              <label className="pp-label" htmlFor="pr-pro">Pro / month</label>
              <input id="pr-pro" type="number" min={0} step="0.01" className="pp-input" value={form.pro} onChange={num("pro")} />
            </div>
            <div>
              <label className="pp-label" htmlFor="pr-exam">AI course exam</label>
              <input id="pr-exam" type="number" min={0} step="0.01" className="pp-input" value={form.exam} onChange={num("exam")} />
            </div>
          </div>
          <button type="submit" className="pp-btn pp-btn-primary self-start" disabled={busy}>Save prices for {country === "DEFAULT" ? "all other countries" : country}</button>
        </form>
      )}

      <form onSubmit={grantPlan} className="flex flex-col gap-3">
        <h3 className="font-display font-semibold">Grant a plan manually</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_140px_120px_auto] items-end">
          <div>
            <label className="pp-label" htmlFor="gr-email">Account email</label>
            <input id="gr-email" type="email" required className="pp-input" value={grant.email} onChange={(e) => setGrant({ ...grant, email: e.target.value })} />
          </div>
          <div>
            <label className="pp-label" htmlFor="gr-plan">Plan</label>
            <select id="gr-plan" className="pp-input" value={grant.plan} onChange={(e) => setGrant({ ...grant, plan: e.target.value })}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="free">Remove plan</option>
            </select>
          </div>
          <div>
            <label className="pp-label" htmlFor="gr-months">Months</label>
            <input id="gr-months" type="number" min={1} className="pp-input" value={grant.months} onChange={(e) => setGrant({ ...grant, months: e.target.value })} />
          </div>
          <button type="submit" className="pp-btn pp-btn-secondary" disabled={!adminKey || busy}>Apply</button>
        </div>
      </form>

      {payments && (
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-semibold">Recent payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-dim">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Reference</th>
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && <tr><td colSpan={5} className="py-3 text-mist">No payments yet.</td></tr>}
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-ink-700">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{p.id}{p.provider === "test" ? " (test)" : ""}</td>
                    <td className="py-2 pr-3">{p.description}</td>
                    <td className="py-2 pr-3 text-right font-mono whitespace-nowrap">{p.amount} {p.currency}</td>
                    <td className={`py-2 ${p.status === "accepted" ? "text-path-text" : p.status === "refused" ? "text-danger-text" : "text-mist"}`}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
