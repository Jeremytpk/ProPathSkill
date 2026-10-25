import { useCallback } from "react";
import { useAccount } from "../../lib/account";

export const ADMIN_KEY_STORAGE = "propath_admin_key";

export function storedAdminKey() {
  try {
    return sessionStorage.getItem(ADMIN_KEY_STORAGE) || "";
  } catch {
    return "";
  }
}

export type AdminCall = <T = any>(path: string, init?: RequestInit) => Promise<T>;

/** Admin API calls: sent with the signed-in admin's token, plus the backup admin key if one was entered. */
export function useAdminApi(): AdminCall {
  const { authedFetch } = useAccount();
  return useCallback(async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    const key = storedAdminKey();
    if (key) headers.set("x-admin-key", key);
    const res = await authedFetch(path, { ...init, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  }, [authedFetch]) as AdminCall;
}
