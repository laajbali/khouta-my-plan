import { useEffect, useState } from "react";

export type SavingsPlan = "daily" | "weekly" | "monthly";

const KEY = "khouta.savingsPlan";

function read(): SavingsPlan {
  if (typeof window === "undefined") return "monthly";
  const v = window.localStorage.getItem(KEY);
  return v === "daily" || v === "weekly" || v === "monthly" ? v : "monthly";
}

export function useSavingsPlan() {
  const [plan, setPlan] = useState<SavingsPlan>("monthly");

  useEffect(() => {
    setPlan(read());
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) setPlan(read());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function update(next: SavingsPlan) {
    setPlan(next);
    try {
      window.localStorage.setItem(KEY, next);
      // notify same-tab listeners
      window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: next }));
    } catch {
      /* ignore */
    }
  }

  return [plan, update] as const;
}
