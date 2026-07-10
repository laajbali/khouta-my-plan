import {
  ChevronRight,
  Car,
  Laptop,
  Plane,
  Gem,
  BookOpen,
  Home,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Stepper } from "./Stepper";
import { useOnboarding } from "./onboarding-context";

const GOALS = [
  { key: "car", label: "شراء سيارة", icon: <Car className="h-5 w-5" strokeWidth={1.8} />, suggested: 80000 },
  { key: "laptop", label: "لابتوب", icon: <Laptop className="h-5 w-5" strokeWidth={1.8} />, suggested: 6000 },
  { key: "travel", label: "سفر", icon: <Plane className="h-5 w-5" strokeWidth={1.8} />, suggested: 15000 },
  { key: "wedding", label: "زواج", icon: <Gem className="h-5 w-5" strokeWidth={1.8} />, suggested: 100000 },
  { key: "education", label: "تعليم", icon: <BookOpen className="h-5 w-5" strokeWidth={1.8} />, suggested: 30000 },
  { key: "home", label: "منزل", icon: <Home className="h-5 w-5" strokeWidth={1.8} />, suggested: 500000 },
  { key: "emergency", label: "طوارئ", icon: <ShieldAlert className="h-5 w-5" strokeWidth={1.8} />, suggested: 20000 },
  { key: "custom", label: "مخصص", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, suggested: 10000 },
];

const DURATIONS = [
  { key: 3, label: "3 أشهر" },
  { key: 6, label: "6 أشهر" },
  { key: 12, label: "سنة" },
  { key: 24, label: "سنتين" },
  { key: -1, label: "أخرى" },
];

export function Step3Goal({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const { data, update } = useOnboarding();
  // Clear any lingering password/validation toasts from Step 1
  useEffect(() => {
    toast.dismiss();
  }, []);
  const selected = GOALS.find((g) => g.key === data.goalKey) ?? GOALS[0];
  const effMonths =
    data.goalMonths === -1 ? Math.max(1, Number(data.goalMonthsCustom) || 0) : data.goalMonths;
  const monthly = effMonths > 0 ? Math.round(data.goalAmount / effMonths) : 0;

  function selectGoal(key: string) {
    const g = GOALS.find((x) => x.key === key)!;
    update({ goalKey: key, goalLabel: g.label, goalAmount: g.suggested });
  }

  function finish() {
    onFinish();
  }

  return (
    <div className="bg-background pb-6">
      <Header title="حددي هدفك" onBack={onBack} />
      <div className="px-5 pt-3 pb-4 bg-card">
        <Stepper current={3} />
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="text-right">
          <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">ما هو هدفك المالي؟</h2>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">اختاري هدفاً وسنبني لك خطة مخصصة</p>
        </div>

        {/* Goals grid */}
        <div className="grid grid-cols-4 gap-2">
          {GOALS.map((g) => {
            const active = data.goalKey === g.key;
            return (
              <button
                key={g.key}
                onClick={() => selectGoal(g.key)}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition shadow-sm ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {g.icon}
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${active ? "text-foreground" : "text-foreground/80"}`}>
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expanded detail */}
        <div
          className="rounded-[24px] p-4 text-primary-foreground relative overflow-hidden"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.34 0.07 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.12 0.03 155) 100%)",
            boxShadow: "0 20px 40px -20px oklch(0.20 0.05 155 / 0.6)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-mint/20 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-mint">
              {selected.icon}
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-white/50 font-semibold tracking-[0.15em] uppercase">هدفك المختار</p>
              {data.goalKey === "custom" ? (
                <input
                  type="text"
                  value={data.goalLabel}
                  onChange={(e) => update({ goalLabel: e.target.value })}
                  placeholder="اكتبي اسم هدفك"
                  className="mt-0.5 w-full bg-transparent outline-none text-[15px] font-extrabold text-white text-right tracking-tight placeholder:text-white/40 border-b border-white/20 focus:border-mint pb-0.5"
                />
              ) : (
                <p className="text-[15px] font-extrabold tracking-tight mt-0.5">{selected.label}</p>
              )}
            </div>
          </div>

          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-3 text-right">
            <p className="text-[10px] text-white/50 font-semibold">المبلغ المستهدف</p>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                name="goal-amount"
                inputMode="numeric"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                value={data.goalAmount.toLocaleString()}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/[^\d]/g, ""));
                  update({ goalAmount: isNaN(n) ? 0 : n });
                }}
                className="flex-1 bg-transparent outline-none text-[22px] font-bold text-white text-right leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
              <span className="text-[11px] text-mint font-bold">ر.س</span>
            </div>
          </div>

          <div className="relative mt-3">
            <p className="text-right text-[10px] text-white/50 font-semibold mb-2">المدة الزمنية</p>
            <div className="grid grid-cols-5 gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => update({ goalMonths: d.key })}
                  className={`rounded-xl py-2 text-[11px] font-bold transition ${
                    data.goalMonths === d.key
                      ? "bg-mint text-primary"
                      : "bg-white/10 text-white/70 border border-white/10"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {data.goalMonths === -1 && (
              <input
                value={data.goalMonthsCustom}
                onChange={(e) => update({ goalMonthsCustom: e.target.value.replace(/[^\d]/g, "") })}
                placeholder="اكتبي عدد الأشهر"
                inputMode="numeric"
                className="mt-2 w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-[12px] font-bold text-white text-right outline-none focus:border-mint placeholder:text-white/40"
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
            )}
          </div>

          <div className="relative mt-3 bg-mint/15 border border-mint/25 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-mint text-primary flex items-center justify-center shrink-0">
              <Target className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-white/60 font-semibold">توفير شهري مطلوب</p>
              <p className="text-[18px] font-bold text-mint leading-none mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                {monthly.toLocaleString()}
                <span className="text-[11px] mr-1 text-mint/80 font-semibold">ر.س</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={finish}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-[14px] tracking-tight active:scale-[0.99] transition"
        >
          التالي
          <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
      <button
        onClick={onBack}
        className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
      >
        <ChevronRight className="h-5 w-5 text-foreground" strokeWidth={2} />
      </button>
      <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">{title}</h1>
      <div className="w-11" />
    </div>
  );
}
