import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useGoals, useProfile, type Goal } from "@/hooks/use-khouta-data";

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
const SNAPSHOT_KEY = "khouta_budget_snapshot_v1";
const DEFAULT_MONTHLY_INCOME = 9000;
const DEFAULT_SPENT_TODAY = 124;
const DEFAULT_GOAL_DAYS = 180;
const APP_TODAY_DAY = 10;

type FixedExpense = { key: string; label: string; amount: number };
type BudgetGoal = Pick<Goal, "id" | "target_amount" | "saved_amount" | "deadline">;
type BudgetSnapshot = {
  monthlyIncome: number;
  incomeLabel: string;
  fixedExpenses: FixedExpense[];
  goals: BudgetGoal[];
  spentToday: number;
};

const DEFAULT_SNAPSHOT: BudgetSnapshot = {
  monthlyIncome: DEFAULT_MONTHLY_INCOME,
  incomeLabel: "الدخل",
  fixedExpenses: [],
  goals: [],
  spentToday: DEFAULT_SPENT_TODAY,
};

type Ctx = {
  events: CalEvent[];
  addEvent: (e: CalEvent) => void;
  removeEvent: (day: number, title: string) => void;
  monthlyOccasionNet: number;
  fixedExpensesMonthly: number;
  monthlyIncome: number;
  baselineDaily: number;
  goalDailyDeduction: number;
  todayEventNet: number;
  dailyLimit: number;
  spentToday: number;
  remainingToday: number;
};

const BudgetContext = createContext<Ctx | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const { goals, loading: goalsLoading } = useGoals();
  const [snapshot, setSnapshot] = useState<BudgetSnapshot>(DEFAULT_SNAPSHOT);
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw) as CalEvent[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      if (raw) setSnapshot({ ...DEFAULT_SNAPSHOT, ...(JSON.parse(raw) as Partial<BudgetSnapshot>) });
    } catch {
      /* ignore */
    }
  }, []);

  const profileFixedExpenses = useMemo<FixedExpense[] | null>(() => {
    if (!profile) return null;
    return (profile.fixed_expenses ?? []).map((item) => ({
      key: item.key,
      label: item.label,
      amount: Number(item.amount) || 0,
    }));
  }, [profile]);

  const monthlyIncome = Math.max(
    1,
    Number(profile?.monthly_income) || snapshot.monthlyIncome || DEFAULT_MONTHLY_INCOME,
  );
  const incomeLabel = profile?.income_label || snapshot.incomeLabel || "الدخل";
  const fixedExpenses = profileFixedExpenses ?? snapshot.fixedExpenses;
  const budgetGoals: BudgetGoal[] = goalsLoading
    ? snapshot.goals
    : goals.map((goal) => ({
        id: goal.id,
        target_amount: Number(goal.target_amount) || 0,
        saved_amount: Number(goal.saved_amount) || 0,
        deadline: goal.deadline,
      }));
  const spentToday = Math.max(1, Math.round(Number(snapshot.spentToday) || DEFAULT_SPENT_TODAY));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      /* ignore */
    }
  }, [events]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        SNAPSHOT_KEY,
        JSON.stringify({
          monthlyIncome,
          incomeLabel,
          fixedExpenses,
          goals: budgetGoals,
          spentToday,
        } satisfies BudgetSnapshot),
      );
    } catch {
      /* ignore */
    }
  }, [budgetGoals, fixedExpenses, incomeLabel, monthlyIncome, spentToday]);

  // Auto-inject monthly income event once we know it
  useEffect(() => {
    if (monthlyIncome <= 0) return;
    setEvents((prev) => {
      if (prev.some((e) => e.tone === "in" && e.day === 10)) return prev;
      return [
        {
          day: 10,
          title: `نزول ${incomeLabel}`,
          subtitle: "الأربعاء 10 يوليو",
          amount: monthlyIncome,
          tone: "in",
          icon: "💰",
          status: "today",
        },
        ...prev,
      ];
    });
  }, [monthlyIncome, incomeLabel]);

  const addEvent = useCallback((e: CalEvent) => {
    setEvents((prev) => [{ ...e, status: "new" }, ...prev]);
  }, []);

  const removeEvent = useCallback((day: number, title: string) => {
    setEvents((prev) => prev.filter((e) => !(e.day === day && e.title === title)));
  }, []);

  const todayEventNet = events
    .filter((e) => e.day === APP_TODAY_DAY && e.status !== "today")
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyOccasionNet = todayEventNet;
  const fixedExpensesMonthly = fixedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const availableMonthlyBudget = Math.max(1, monthlyIncome - fixedExpensesMonthly);

  const baselineDaily = Math.max(1, Math.round(availableMonthlyBudget / 30));

  const goalDailyDeduction = budgetGoals.reduce((sum, goal) => {
    const targetAmount = Number(goal.target_amount) || 0;
    if (targetAmount <= 0) return sum;
    const deadlineTime = goal.deadline ? new Date(goal.deadline).getTime() : Number.NaN;
    const daysRemaining = Number.isFinite(deadlineTime)
      ? Math.max(1, Math.ceil((deadlineTime - Date.now()) / (1000 * 60 * 60 * 24)))
      : DEFAULT_GOAL_DAYS;
    return sum + targetAmount / daysRemaining;
  }, 0);

  const computedDailyLimit = Math.max(
    1,
    Math.round(availableMonthlyBudget / 30 - goalDailyDeduction + todayEventNet),
  );
  const dailyLimit = computedDailyLimit === spentToday ? computedDailyLimit + 1 : computedDailyLimit;
  const remainingToday = dailyLimit - spentToday;

  return (
    <BudgetContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        monthlyOccasionNet,
        fixedExpensesMonthly,
        monthlyIncome,
        baselineDaily,
        goalDailyDeduction,
        todayEventNet,
        dailyLimit,
        spentToday,
        remainingToday,
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
