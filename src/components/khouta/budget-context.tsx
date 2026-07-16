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
  removeEvent: (day: number, title: string) => void;
  upsertGoal: (goal: BudgetGoal) => void;
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
  const [localGoals, setLocalGoals] = useState<BudgetGoal[]>([]);
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
  const remoteGoals: BudgetGoal[] = goals.map((goal) => ({
    id: goal.id,
    target_amount: Number(goal.target_amount) || 0,
    saved_amount: Number(goal.saved_amount) || 0,
    deadline: goal.deadline,
  }));
  const budgetGoals: BudgetGoal[] = useMemo(() => {
    const source = goalsLoading ? snapshot.goals : remoteGoals;
    const merged = new Map<string, BudgetGoal>();
    [...source, ...localGoals].forEach((goal) => merged.set(goal.id, goal));
    return Array.from(merged.values());
  }, [goalsLoading, localGoals, remoteGoals, snapshot.goals]);
  // spentToday derived dynamically as 70% of dailyLimit (see below)

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

  const upsertGoal = useCallback((goal: BudgetGoal) => {
    setLocalGoals((prev) => [goal, ...prev.filter((item) => item.id !== goal.id)]);
  }, []);

  // Salary refresh day = the "in" income event's day; fallback to APP_TODAY_DAY.
  const incomeEvent = events.find((e) => e.tone === "in");
  const salaryDay = incomeEvent?.day ?? APP_TODAY_DAY;

  // Days left until the NEXT salary payout (from the app's "today").
  // If today is exactly the salary day, the next refresh is 30 days out.
  const rawDaysLeft = salaryDay > APP_TODAY_DAY
    ? salaryDay - APP_TODAY_DAY
    : 30 - APP_TODAY_DAY + salaryDay;
  const daysLeftUntilSalary = rawDaysLeft > 0 ? rawDaysLeft : 30;

  // Upcoming (non-income) events between today (exclusive) and the next salary payout.
  const upcomingEventsBudget = events
    .filter((e) => e.tone !== "in")
    .filter((e) => {
      const delta = e.day > APP_TODAY_DAY ? e.day - APP_TODAY_DAY : 30 - APP_TODAY_DAY + e.day;
      return delta > 0 && delta <= daysLeftUntilSalary;
    })
    .reduce((sum, e) => sum + Math.abs(Number(e.amount) || 0), 0);

  const todayEventNet = events
    .filter((e) => e.day === APP_TODAY_DAY && e.status !== "today")
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyOccasionNet = todayEventNet;
  const fixedExpensesMonthly = fixedExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  // Monthly share for each active goal = remaining / months remaining until deadline.
  const goalsMonthlyDeduction = budgetGoals.reduce((sum, goal) => {
    const targetAmount = Number(goal.target_amount) || 0;
    if (targetAmount <= 0) return sum;
    const remaining = Math.max(0, targetAmount - (Number(goal.saved_amount) || 0));
    const deadlineTime = goal.deadline ? new Date(goal.deadline).getTime() : Number.NaN;
    const monthsRemaining = Number.isFinite(deadlineTime)
      ? Math.max(1, Math.ceil((deadlineTime - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
      : Math.max(1, Math.round(DEFAULT_GOAL_DAYS / 30));
    return sum + remaining / monthsRemaining;
  }, 0);

  // Monthly disposable BEFORE subtracting calendar events.
  const monthlyDisposable = monthlyIncome - fixedExpensesMonthly - goalsMonthlyDeduction;

  // Buffer out the upcoming events, THEN divide across the days left.
  const availableUntilSalary = monthlyDisposable - upcomingEventsBudget;

  const baselineDaily = Math.max(
    0,
    Math.round(Math.max(0, monthlyIncome - fixedExpensesMonthly) / 30),
  );
  const goalDailyDeduction = goalsMonthlyDeduction / 30;

  const dailyLimit =
    availableUntilSalary > 0 ? Math.round(availableUntilSalary / daysLeftUntilSalary) : 0;
  const spentToday = dailyLimit > 0 ? Math.round(dailyLimit * 0.7) : 0;
  const remainingToday = dailyLimit > 0 ? dailyLimit - spentToday : 0;



  return (
    <BudgetContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        upsertGoal,
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
