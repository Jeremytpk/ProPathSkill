import { useCallback } from "react";
import { useAccount } from "../../lib/account";

export type AdminCall = <T = any>(path: string, init?: RequestInit) => Promise<T>;

/** Admin API calls, sent with the signed-in admin's token. */
export function useAdminApi(): AdminCall {
  const { authedFetch } = useAccount();
  return useCallback(async (path: string, init: RequestInit = {}) => {
    const res = await authedFetch(path, init);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  }, [authedFetch]) as AdminCall;
}
