import { createContext, useContext, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type OnboardingData = {
 // Step 1
 fullName: string;
 phone: string;
 city: string;
 userType: string;
 userTypeCustom: string;
 email: string;
 password: string;
 // Step 2
 incomeSource: string;
 incomeSourceCustom: string;
 monthlyIncome: string;
 expenses: { key: string; label: string; amount: string; editable?: boolean }[];
 // Step 3
 goalKey: string;
 goalLabel: string;
 goalAmount: number;
 goalMonths: number;
 goalMonthsCustom: string;
};

const DEFAULT: OnboardingData = {
 fullName: "",
 phone: "",
 city: "",
 userType: "employee",
 userTypeCustom: "",
 email: "",
 password: "",
 incomeSource: "salary",
 incomeSourceCustom: "",
 monthlyIncome: "",
 expenses: [
 { key: "housing", label: "السكن", amount: "" },
 { key: "transport", label: "المواصلات", amount: "" },
 { key: "internet", label: "الإنترنت", amount: "" },
 ],
 goalKey: "car",
 goalLabel: "شراء سيارة",
 goalAmount: 80000,
 goalMonths: 6,
 goalMonthsCustom: "",
};

type Ctx = {
 data: OnboardingData;
 update: (p: Partial<OnboardingData>) => void;
 submit: () => Promise<boolean>;
 loading: boolean;
};

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<OnboardingData>(DEFAULT);
 const [loading, setLoading] = useState(false);

 function update(p: Partial<OnboardingData>) {
 setData((prev) => ({...prev,...p }));
 }

 async function submit(): Promise<boolean> {
 if (!data.email ||!data.password ||!data.fullName) {
 toast.error("الرجاء إكمال البيانات الأساسية");
 return false;
 }
 setLoading(true);

 // Compute income label + normalized fixed expenses once — reused for both
 // the localStorage snapshot (instant dashboard hydration) and the DB upsert.
 const INCOME_LABELS: Record<string, string> = {
 salary: "راتب",
 scholarship: "مكافأة",
 bonus: "مكافأة",
 freelance: "عمل حر",
 };
 const incomeLabel =
 data.incomeSource === "other"
? data.incomeSourceCustom.trim() || "دخل"
 : INCOME_LABELS[data.incomeSource] || "دخل";
 const fixedExpenses = data.expenses
.map((e) => ({ key: e.key, label: e.label?.trim() || "", amount: Number(e.amount) || 0 }))
.filter((e) => e.amount > 0 && e.label.length > 0);
 const monthlyIncomeNum = Number(data.monthlyIncome) || 0;
 const goalMonths =
 data.goalMonths === -1
? Math.max(1, Number(data.goalMonthsCustom) || 6)
 : Math.max(1, Number(data.goalMonths) || 6);
 const goalDeadline = new Date(Date.now() + goalMonths * 30 * 24 * 60 * 60 * 1000)
.toISOString()
.slice(0, 10);

 // Persist onboarding inputs to the shared budget snapshot immediately so the
 // Dashboard renders the user's real numbers even before Supabase responds.
 if (typeof window!== "undefined" && monthlyIncomeNum > 0) {
 try {
 window.localStorage.setItem(
 "khouta_budget_snapshot_v1",
 JSON.stringify({
 monthlyIncome: monthlyIncomeNum,
 incomeLabel,
 fixedExpenses,
 goals: [
 {
 id: `onboarding-${data.goalKey || "goal"}`,
 target_amount: Number(data.goalAmount) || 0,
 saved_amount: 0,
 deadline: goalDeadline,
 },
 ],
 spentToday: 0,
 }),
 );
 } catch {
 /* ignore */
 }
 }

 try {

 let userId: string | undefined;

 const { data: auth, error } = await supabase.auth.signUp({
 email: data.email,
 password: data.password,
 options: {
 emailRedirectTo: window.location.origin,
 data: { full_name: data.fullName },
 },
 });

 if (error) {
 // Account already exists → try signing in seamlessly with same credentials
 if (/already|registered|exists/i.test(error.message)) {
 const { data: signIn, error: signInErr } =
 await supabase.auth.signInWithPassword({
 email: data.email,
 password: data.password,
 });
 if (signInErr) throw signInErr;
 userId = signIn.user?.id;
 } else {
 throw error;
 }
 } else {
 userId = auth.user?.id;
 // If auto-confirm is off, session may be null — try sign-in
 if (!auth.session && userId) {
 await supabase.auth.signInWithPassword({
 email: data.email,
 password: data.password,
 });
 }
 }

 if (userId) {
 await supabase.from("profiles").upsert({
 id: userId,
 full_name: data.fullName,
 monthly_income: monthlyIncomeNum,
 income_source: data.incomeSource,
 income_label: incomeLabel,
 fixed_expenses: fixedExpenses,
 });
 // Only create the onboarding goal if no goal exists yet for this user
 const { data: existing } = await supabase
.from("savings_goals")
.select("id")
.eq("user_id", userId)
.limit(1);
 if (!existing || existing.length === 0) {
 await supabase.from("savings_goals").insert({
 user_id: userId,
 title: data.goalLabel,
 target_amount: data.goalAmount,

 saved_amount: 0,
 deadline: goalDeadline,
 });
 }
 }
 // Show welcome toast ONCE per app lifetime — guard prevents the loop
 // where PlanGenerating + Step4Card both call submit() and re-fire it.
 if (typeof window!== "undefined" &&!sessionStorage.getItem("khouta_welcomed")) {
 sessionStorage.setItem("khouta_welcomed", "1");
 toast.success(`أهلاً ${data.fullName}`);
 }
 return true;
 } catch (err) {
 const msg = err instanceof Error? err.message : "حدث خطأ";
 // Suppress password/credential warnings here — password was already
 // validated at Step 1. Show a neutral message instead of looping.
 if (/Invalid login credentials|Password should be|password/i.test(msg)) {
 toast.error("تعذّر إنشاء الحساب — حاولي مرة أخرى");
 } else {
 toast.error(msg);
 }
 return false;
 } finally {
 setLoading(false);
 }
 }

 return (
 <OnboardingContext.Provider value={{ data, update, submit, loading }}>
 {children}
 </OnboardingContext.Provider>
 );
}

export function useOnboarding() {
 const ctx = useContext(OnboardingContext);
 if (!ctx) throw new Error("useOnboarding must be inside OnboardingProvider");
 return ctx;
}
