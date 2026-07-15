import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useProfile } from "@/hooks/use-khouta-data";

export type CalEvent = {
  day: number;
  title: string;
  subtitle: string;
  amount: number; // signed: positive = income, negative = expense/save
  tone: "in" | "out" | "save";
  icon: string;
  status?: "new" | "upcoming" | "today";
};

const INITIAL_EVENTS: CalEvent[] = [
  { day: 5, title: "عيد ميلاد أختي", subtitle: "الجمعة 5 يوليو", amount: -150, tone: "out", icon: "🎂", status: "upcoming" },
  { day: 16, title: "تحويل الادخار", subtitle: "الثلاثاء 16 يوليو", amount: -1500, tone: "save", icon: "🏦", status: "upcoming" },
  { day: 27, title: "مناسبة عائلية", subtitle: "السبت 27 يوليو", amount: -400, tone: "out", icon: "🎉", status: "upcoming" },
];

const STORAGE_KEY = "khouta_budget_events_v1";

type Ctx = {
  events: CalEvent[];
  addEvent: (e: CalEvent) => void;
  removeEvent: (day: number, title: string) => void;
  monthlyOccasionNet: number; // signed, only from NEW events
  fixedExpensesMonthly: number;
  monthlyIncome: number;
  baselineDaily: number;
};

const BudgetContext = createContext<Ctx | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const incomeAmount = Number(profile?.monthly_income ?? 0);
  const incomeLabel = profile?.income_label || "الدخل";

  // Hydrate events from localStorage so newly-added occasions survive re-renders / route changes.
  const [events, setEvents] = useState<CalEvent[]>(() => {
    if (typeof window === "undefined") return INITIAL_EVENTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CalEvent[];
    } catch {
      /* ignore */
    }
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      /* ignore */
    }
  }, [events]);

  // Auto-inject monthly income event once we know it
  useEffect(() => {
    if (incomeAmount <= 0) return;
    setEvents((prev) => {
      if (prev.some((e) => e.tone === "in" && e.day === 10)) return prev;
      return [
        {
          day: 10,
          title: `نزول ${incomeLabel}`,
          subtitle: "الأربعاء 10 يوليو",
          amount: incomeAmount,
          tone: "in",
          icon: "💰",
          status: "today",
        },
        ...prev,
      ];
    });
  }, [incomeAmount, incomeLabel]);

  const addEvent = useCallback((e: CalEvent) => {
    setEvents((prev) => [{ ...e, status: "new" }, ...prev]);
  }, []);

  const removeEvent = useCallback((day: number, title: string) => {
    setEvents((prev) => prev.filter((e) => !(e.day === day && e.title === title)));
  }, []);

  // Only newly added occasions affect the daily limit (baseline stays stable).
  const monthlyOccasionNet = events
    .filter((e) => e.status === "new")
    .reduce((sum, e) => sum + e.amount, 0);

  const fixedExpensesMonthly = useMemo(() => {
    const list = profile?.fixed_expenses ?? [];
    return list.reduce((s, x) => s + (Number(x.amount) || 0), 0);
  }, [profile?.fixed_expenses]);

  const baselineDaily = useMemo(() => {
    if (incomeAmount <= 0) return 0;
    const net = Math.max(0, incomeAmount - fixedExpensesMonthly);
    return Math.round(net / 30);
  }, [incomeAmount, fixedExpensesMonthly]);

  return (
    <BudgetContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        monthlyOccasionNet,
        fixedExpensesMonthly,
        monthlyIncome: incomeAmount,
        baselineDaily,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}
