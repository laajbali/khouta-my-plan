import { useEffect, useState } from "react";
import { Check, Loader2, Briefcase, BarChart3, Building2, Calculator, Calendar, Sparkles, Target } from "lucide-react";
import { KhoutaLogo } from "./Logo";
import { Stepper } from "./Stepper";
import { useOnboarding } from "./onboarding-context";

const STEPS = [
  { key: "income", label: "تحليل الدخل الشهري", icon: Briefcase },
  { key: "expenses", label: "تحليل المصروفات", icon: BarChart3 },
  { key: "bank", label: "تحليل معاملات البنك", icon: Building2 },
  { key: "budget", label: "حساب أفضل ميزانية", icon: Calculator },
  { key: "calendar", label: "إنشاء التقويم المالي", icon: Calendar },
  { key: "ai", label: "تجهيز المستشار الذكي", icon: Sparkles },
];

export function PlanGenerating({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const { submit } = useOnboarding();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function run() {
      // Kick off signup in the background
      const submission = submit();

      // Animate step progress
      const step = () => {
        if (cancelled) return;
        setIdx((i) => {
          if (i >= STEPS.length - 1) return i;
          return i + 1;
        });
      };
      for (let s = 1; s < STEPS.length; s++) {
        timer = setTimeout(step, s * 650);
      }
      // Wait for both animation + submission
      const ok = await submission;
      setTimeout(() => {
        if (cancelled) return;
        setReady(true);
        setIdx(STEPS.length);
        setTimeout(() => onDone(), ok ? 1400 : 1400);
      }, STEPS.length * 650);
    }
    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background pb-6 min-h-full">
      <div className="flex items-center justify-center px-5 pt-6 pb-3 bg-card">
        <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">إنشاء الخطة</h1>
      </div>
      <div className="px-5 pt-3 pb-4 bg-card">
        <Stepper current={4} />
      </div>

      <div className="px-5 pt-6 flex flex-col items-center text-center">
        {ready ? (
          <>
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center ring-8 ring-secondary">
                <Target className="h-11 w-11 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-[20px] font-extrabold text-foreground mt-4 tracking-tight">خطتك جاهزة!</h2>
            <p className="text-[11px] text-muted-foreground mt-1">سنُنقلك للرئيسية تلقائياً</p>
          </>
        ) : (
          <>
            <div className="relative">
              <KhoutaLogo size={96} />
              <div className="absolute -inset-2 rounded-[32px] border-2 border-mint/50 border-t-transparent animate-spin" />
            </div>
            <h2 className="text-[18px] font-extrabold text-foreground mt-5 tracking-tight">جارٍ إنشاء خطتك…</h2>
            <p className="text-[11px] text-muted-foreground mt-1">نحلّل بياناتك لنقترح لك خطة ذكية</p>
          </>
        )}

        <div className="w-full mt-6 space-y-2">
          {STEPS.map((s, i) => {
            const done = i < idx || ready;
            const active = i === idx && !ready;
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 transition ${
                  done
                    ? "bg-mint/10 border-mint/30"
                    : active
                      ? "bg-card border-primary/40 shadow-sm"
                      : "bg-card border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {done ? (
                    <span className="h-6 w-6 rounded-full bg-secondary text-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : active ? (
                    <span className="h-6 w-6 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-secondary" />
                  )}
                  <span className={`text-[11px] font-bold ${done ? "text-mint-foreground" : active ? "text-amber-600" : "text-muted-foreground"}`}>
                    {done ? "تم" : active ? "جارٍ…" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-foreground text-right">{s.label}</span>
                  <span className="h-8 w-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground mt-5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          بياناتك آمنة 100%
        </p>
      </div>
    </div>
  );
}
