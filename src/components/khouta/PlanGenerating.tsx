import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Stepper } from "./Stepper";
import { KhoutaLogo } from "./Logo";

const TASKS = [
  { key: "income", label: "تحليل الدخل الشهري", icon: "💼" },
  { key: "expenses", label: "تحليل المصروفات", icon: "📊" },
  { key: "bank", label: "تحليل معاملات البنك", icon: "🏛️" },
  { key: "budget", label: "حساب أفضل ميزانية", icon: "🧮" },
  { key: "calendar", label: "إنشاء التقويم المالي", icon: "📅" },
  { key: "advisor", label: "تجهيز المستشار الذكي", icon: "🤖" },
];

export function PlanGenerating({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= TASKS.length) {
      const t = setTimeout(onDone, 1600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, onDone]);

  const done = step >= TASKS.length;

  return (
    <div className="bg-card min-h-[600px]">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-black text-foreground text-center">إنشاء الخطة</h1>
        <div className="py-5">
          <Stepper current={4} />
        </div>
      </div>

      <div className="px-5 pb-8">
        <div className="text-right mb-4">
          {done ? (
            <>
              <div className="flex items-center gap-2 justify-end">
                <h2 className="text-2xl font-black text-foreground">خطتك جاهزة!</h2>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">ستنتقل للرئيسية تلقائياً</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-foreground">جاري إنشاء خطتك...</h2>
              <p className="text-sm text-muted-foreground mt-1">
                نحلل بياناتك لنقترح لك خطة ذكية
              </p>
            </>
          )}
        </div>

        {/* Big progress circle */}
        <div className="flex justify-center my-6">
          <div className="relative h-40 w-40">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--mint)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(step / TASKS.length) * 283} 283`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
              {done ? <span className="text-5xl">🎯</span> : <KhoutaLogo size={100} />}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {TASKS.map((t, i) => {
            const state = i < step ? "done" : i === step ? "loading" : "pending";
            return (
              <div
                key={t.key}
                className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 transition ${
                  state === "done"
                    ? "border-mint/40 bg-accent/30"
                    : state === "loading"
                      ? "border-gold bg-card"
                      : "border-border bg-card opacity-60"
                }`}
              >
                <div>
                  {state === "done" && (
                    <div className="flex items-center gap-1.5 bg-mint text-mint-foreground rounded-full px-3 py-1 text-xs font-bold">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      تم
                    </div>
                  )}
                  {state === "loading" && (
                    <div className="flex items-center gap-1.5 text-gold text-xs font-bold">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري...
                    </div>
                  )}
                  {state === "pending" && (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                  <span className="text-lg">{t.icon}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
          🛡️ بياناتك آمنة 100%
        </p>
      </div>
    </div>
  );
}
