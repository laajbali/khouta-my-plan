import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
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

type Ctx = {
  events: CalEvent[];
  addEvent: (e: CalEvent) => void;
  removeEvent: (day: number, title: string) => void;
  monthlyOccasionNet: number; // signed
};

const BudgetContext = createContext<Ctx | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const incomeAmount = Number(profile?.monthly_income ?? 0);
  const incomeLabel = profile?.income_label || "الدخل";
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);

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

  // Net impact of occasions on this month's budget (excludes the salary itself)
  // Only newly added occasions affect the baseline daily limit.
  const monthlyOccasionNet = events
    .filter((e) => e.status === "new")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <BudgetContext.Provider value={{ events, addEvent, removeEvent, monthlyOccasionNet }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}
