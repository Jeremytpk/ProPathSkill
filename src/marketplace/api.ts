/** Calls a ProPath API and returns its JSON, throwing an Error whose message is the API's error code. */
export async function apiJson<T = any>(fetcher: (input: string, init?: RequestInit) => Promise<Response>, path: string, init?: RequestInit): Promise<T> {
  const res = await fetcher(path, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `error_${res.status}`), { status: res.status, data });
  return data as T;
}

export function formatUsd(amount: number, lang: "english" | "french") {
  return new Intl.NumberFormat(lang === "french" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
