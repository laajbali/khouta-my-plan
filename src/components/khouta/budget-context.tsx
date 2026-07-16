import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useGoals, useProfile, type Goal } from "@/hooks/use-khouta-data";

export type CalEvent = {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  amount: number; // signed: positive = income, negative = expense/save
  tone: "in" | "out" | "save";
  icon: string;
  status?: "new" | "upcoming" | "today";
  kindKey?: string;
  date?: string;
  priority?: "high" | "med" | "low";
  notes?: string;
  cost?: number;
};

function makeEventId() {
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const INITIAL_EVENTS: CalEvent[] = [];

const STORAGE_KEY = "khouta_budget_events_v1";
const SNAPSHOT_KEY = "khouta_budget_snapshot_v1";
const DEFAULT_MONTHLY_INCOME = 10000;
const DEFAULT_SPENT_TODAY = 140;
const DEFAULT_GOAL_DAYS = 180;
const APP_TODAY_DAY = 10;

type FixedExpense = { key: string; label: string; amount: number };

const DEFAULT_FIXED_EXPENSES: FixedExpense[] = [
  { key: "housing", label: "السكن", amount: 2000 },
  { key: "transport", label: "المواصلات", amount: 600 },
  { key: "internet", label: "الإنترنت", amount: 400 },
];

export type BudgetGoal = Pick<Goal, "id" | "target_amount" | "saved_amount" | "deadline">;
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
  fixedExpenses: DEFAULT_FIXED_EXPENSES,
  goals: [],
  spentToday: DEFAULT_SPENT_TODAY,
};


type Ctx = {
  events: CalEvent[];
  addEvent: (e: CalEvent) => void;
  updateEvent: (id: string, patch: Partial<CalEvent>) => void;
  removeEvent: (day: number, title: string) => void;
  removeEventById: (id: string) => void;
  upsertGoal: (goal: BudgetGoal) => void;
  removeGoalById: (id: string) => void;
  refreshGoals: () => Promise<void> | void;
  activeGoals: BudgetGoal[];
  totalGoalDeductions: number;
  totalEventsBudget: number;
  daysRemainingUntilSalary: number;
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
  const { goals, loading: goalsLoading, refresh: refreshGoals } = useGoals();
  const [snapshot, setSnapshot] = useState<BudgetSnapshot>(DEFAULT_SNAPSHOT);
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [localGoals, setLocalGoals] = useState<BudgetGoal[]>([]);
  const [removedGoalIds, setRemovedGoalIds] = useState<Set<string>>(() => new Set());
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setStorageReady(true);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw) as CalEvent[]);
    } catch {
      /* ignore */
    }
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_SNAPSHOT, ...(JSON.parse(raw) as Partial<BudgetSnapshot>) };
        setSnapshot(parsed);
        setLocalGoals(parsed.goals ?? []);
      }
    } catch {
      /* ignore */
    }
    setStorageReady(true);
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
  const remoteGoals: BudgetGoal[] = useMemo(
    () =>
      goals.map((goal) => ({
        id: goal.id,
        target_amount: Number(goal.target_amount) || 0,
        saved_amount: Number(goal.saved_amount) || 0,
        deadline: goal.deadline,
      })),
    [goals],
  );
  const activeGoals: BudgetGoal[] = useMemo(() => {
    const source = goalsLoading && remoteGoals.length === 0 ? snapshot.goals : remoteGoals;
    const merged = new Map<string, BudgetGoal>();
    [...source, ...localGoals].forEach((goal) => merged.set(goal.id, goal));
    // Honor client-side deletions even before the server round-trip resolves.
    removedGoalIds.forEach((id) => merged.delete(id));
    return Array.from(merged.values());
  }, [goalsLoading, localGoals, remoteGoals, snapshot.goals, removedGoalIds]);
  const budgetGoals = activeGoals;

  useEffect(() => {
    if (typeof window === "undefined" || !storageReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      /* ignore */
    }
  }, [events, storageReady]);

  useEffect(() => {
    if (typeof window === "undefined" || !storageReady) return;
    try {
      localStorage.setItem(
        SNAPSHOT_KEY,
        JSON.stringify({
          monthlyIncome,
          incomeLabel,
          fixedExpenses,
          goals: budgetGoals,
          spentToday: DEFAULT_SPENT_TODAY,
        } satisfies BudgetSnapshot),
      );
    } catch {
      /* ignore */
    }
  }, [budgetGoals, fixedExpenses, incomeLabel, monthlyIncome, storageReady]);

  // Auto-inject monthly income event once we know it
  useEffect(() => {
    if (monthlyIncome <= 0) return;
    setEvents((prev) => {
      if (prev.some((e) => e.tone === "in" && e.day === 10)) return prev;
      return [
        {
          id: "income_default",
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
    setEvents((prev) => [{ ...e, id: e.id || makeEventId(), status: "new" }, ...prev]);
  }, []);

  const removeEvent = useCallback((day: number, title: string) => {
    setEvents((prev) => prev.filter((e) => !(e.day === day && e.title === title)));
  }, []);

  const removeEventById = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<CalEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch, id: e.id } : e)));
  }, []);

  const upsertGoal = useCallback((goal: BudgetGoal) => {
    setLocalGoals((prev) => [goal, ...prev.filter((item) => item.id !== goal.id)]);
    setRemovedGoalIds((prev) => {
      if (!prev.has(goal.id)) return prev;
      const next = new Set(prev);
      next.delete(goal.id);
      return next;
    });
  }, []);

  const removeGoalById = useCallback((id: string) => {
    setLocalGoals((prev) => prev.filter((item) => item.id !== id));
    setRemovedGoalIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Synchronous days remaining — no async / date libs, instant on render.
  const daysLeftUntilSalary = useMemo(() => {
    if (typeof window === "undefined") return 20;
    return Math.max(1, 30 - new Date().getDate());
  }, []);

  // Upcoming (non-income) events sum — instant, no date filtering.
  const totalEventsBudget = useMemo(
    () =>
      events
        .filter((e) => e.tone !== "in")
        .reduce((sum, e) => sum + Math.abs(Number(e.amount) || 0), 0),
    [events],
  );

  const todayEventNet = useMemo(
    () =>
      events
        .filter((e) => e.day === APP_TODAY_DAY && e.status !== "today")
        .reduce((sum, e) => sum + e.amount, 0),
    [events],
  );

  const monthlyOccasionNet = todayEventNet;

  // Instant fallbacks — never render 0 or skeletons while profile syncs.
  const income = Number(profile?.monthly_income) || monthlyIncome || 9000;
  const expensesRaw = fixedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const fixedExpensesMonthly = expensesRaw > 0 ? expensesRaw : 2500;

  // Monthly share for each active goal.
  const totalGoalDeductions = useMemo(
    () =>
      activeGoals.reduce((sum, goal) => {
        const targetAmount = Number(goal.target_amount) || 0;
        if (targetAmount <= 0) return sum;
        const remaining = Math.max(0, targetAmount - (Number(goal.saved_amount) || 0));
        const deadlineTime = goal.deadline ? new Date(goal.deadline).getTime() : Number.NaN;
        const monthsRemaining = Number.isFinite(deadlineTime)
          ? Math.max(1, Math.ceil((deadlineTime - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
          : Math.max(1, Math.round(DEFAULT_GOAL_DAYS / 30));
        return sum + remaining / monthsRemaining;
      }, 0),
    [activeGoals],
  );

  const baselineDaily = Math.max(0, Math.round(Math.max(0, income - fixedExpensesMonthly) / 30));
  const goalDailyDeduction = totalGoalDeductions / 30;

  // Instant, synchronous dailyLimit — reactive to goals/events/income.
  const dailyLimit = useMemo(() => {
    const monthlyDisposable = income - fixedExpensesMonthly - totalGoalDeductions - totalEventsBudget;
    return Math.max(0, Math.round(monthlyDisposable / daysLeftUntilSalary));
  }, [income, fixedExpensesMonthly, totalGoalDeductions, totalEventsBudget, daysLeftUntilSalary]);

  const spentToday = 0;
  const remainingToday = Math.max(0, dailyLimit - spentToday);



  return (
    <BudgetContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        removeEvent,
        removeEventById,
        upsertGoal,
        removeGoalById,
        refreshGoals,
        activeGoals,
        totalGoalDeductions,
        totalEventsBudget,
        daysRemainingUntilSalary: daysLeftUntilSalary,
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
