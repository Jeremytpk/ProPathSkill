/**
 * Address of the ProPath server. Empty when the website and server share an address
 * (local development, or both on one host); set VITE_API_URL when the website is hosted
 * separately, e.g. on Netlify with the server on Render.
 */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function apiUrl(path: string) {
  return path.startsWith("/api") ? `${API_BASE}${path}` : path;
}
