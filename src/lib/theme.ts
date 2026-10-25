import { useEffect, useState } from "react";

const query = "(prefers-color-scheme: light)";

/** "light" or "dark", following the device setting and updating when it changes. */
export function useSystemTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" && window.matchMedia?.(query).matches ? "light" : "dark"
  );
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setTheme(mq.matches ? "light" : "dark");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return theme;
}
