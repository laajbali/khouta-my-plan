import { useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  BarChart3,
  Gift,
  Car,
  Plus,
  TrendingDown,
  TrendingUp,
  Target,
  Users,
  Heart,
} from "lucide-react";
import { useProfile, useGoals, type Goal } from "@/hooks/use-khouta-data";
import { useBudget } from "@/components/khouta/budget-context";
import ihsanLogo from "@/assets/ihsan-logo.asset.json";


export function HomeTab({
  onOpenNoor,
  onOpenGoal,
  onOpenNewGoal,
  onOpenCalendar,
  onOpenNotifications,
  onOpenReports,
  onOpenRewards,
  onOpenProfile,
  onOpenGroup,
  onOpenDonate,
}: {
  onOpenNoor: () => void;
  onOpenBank: () => void;
  onOpenTransfer: () => void;
  onOpenPay: () => void;
  onOpenQr: () => void;
  onOpenMore: () => void;
  onOpenStatement: () => void;
  onOpenGoal: () => void;
  onOpenNewGoal: () => void;
  onOpenCalendar: () => void;
  onOpenNotifications: () => void;
  onOpenReports: () => void;
  onOpenRewards: () => void;
  onOpenProfile: () => void;
  onOpenRadar: () => void;
  onOpenGroup: () => void;
  onOpenDonate: () => void;
}) {
  const profile = useProfile();
  const { goals } = useGoals();
  const displayName = profile?.full_name?.trim() || "";
  const firstName = displayName.split(" ")[0] || "بك";
  const initial = (firstName || "خ").charAt(0);

  const [goalIdx, setGoalIdx] = useState(0);
  const safeIdx = goals.length > 0 ? Math.min(goalIdx, goals.length - 1) : 0;
  const current: Goal | undefined = goals[safeIdx];

  const { dailyLimit, spentToday, remainingToday } = useBudget();
  const isOverBudget = spentToday > dailyLimit;
  const budgetPct =
    dailyLimit > 0 ? Math.max(0, Math.min(100, Math.round((spentToday / dailyLimit) * 100))) : 0;


  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="pt-6 px-5 pb-3 flex justify-between items-center bg-card" dir="rtl">
        <button
          onClick={onOpenProfile}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-extrabold text-base shadow-sm active:scale-95 transition"
          aria-label="الحساب"
        >
          {initial}
        </button>
        <div className="text-center flex-1 mx-3">
          <p className="text-foreground text-[15px] font-extrabold tracking-tight leading-tight">
            صباح الخير{firstName ? "، " + firstName : ""} 👋
          </p>
          <p className="text-muted-foreground text-[10.5px] mt-0.5 font-medium">
            كل خطوة ذكية تقرّبك من هدفك
          </p>
        </div>
        <button
          onClick={onOpenNotifications}
          className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center border border-border text-foreground relative active:scale-95 transition"
          aria-label="التنبيهات"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-destructive rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            3
          </span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4 bg-background">
        {/* Goals carousel */}
        {current ? (
          <>
            <GoalCarouselCard
              goal={current}
              index={safeIdx}
              total={goals.length}
              onPrev={() => setGoalIdx((i) => (i - 1 + goals.length) % goals.length)}
              onNext={() => setGoalIdx((i) => (i + 1) % goals.length)}
              onSelect={setGoalIdx}
              onOpenGoal={onOpenGoal}
            />
            <button
              onClick={onOpenNewGoal}
              className="w-full py-2.5 rounded-2xl border border-dashed border-border text-[12px] font-bold text-muted-foreground flex items-center justify-center gap-1.5 hover:border-primary/40 hover:text-primary transition"
            >
              <Plus className="h-4 w-4" /> إضافة هدف جديد
            </button>
          </>
        ) : (
          <button
            onClick={onOpenNewGoal}
            className="w-full rounded-[26px] p-6 text-center border-2 border-dashed border-border bg-card hover:border-primary/40 transition"
          >
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Target className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <p className="text-[14px] font-extrabold text-foreground">أنشئ هدفك الأول</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              ابدأ رحلة الادخار الآن
            </p>
          </button>
        )}


        {/* Today's Financial Summary — dynamic */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </div>
            <h4 className="text-[14px] font-extrabold text-foreground tracking-tight">ملخص اليوم</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SummaryStat
              value={remainingToday.toLocaleString()}
              label="متبقٍ اليوم"
              suffix="ر.س"
              tone={isOverBudget ? "text-red-500" : "text-mint"}
              icon={<TrendingUp className="h-3 w-3" strokeWidth={2.5} />}
              loading={isBudgetLoading}
            />
            <SummaryStat
              value={spentToday.toLocaleString()}
              label="أُنفق اليوم"
              suffix="ر.س"
              tone="text-destructive"
              icon={<TrendingDown className="h-3 w-3" strokeWidth={2.5} />}
              loading={isBudgetLoading}
            />
            <SummaryStat
              value={dailyLimit.toLocaleString()}
              label="الحد اليومي"
              suffix="ر.س"
              tone="text-foreground"
              loading={isBudgetLoading}
            />
          </div>
          <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div
              className={`h-full rounded-full transition-all ${
                isBudgetLoading
                  ? "bg-gradient-to-l from-mint/40 to-primary/40 animate-pulse"
                  : isOverBudget
                    ? "bg-red-500"
                    : "bg-gradient-to-l from-mint to-primary"
              }`}

              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p
            className={`mt-2 text-[10.5px] text-right font-medium ${
              isBudgetLoading
                ? "text-muted-foreground animate-pulse"
                : isOverBudget
                  ? "text-red-500 font-bold"
                  : "text-muted-foreground"
            }`}
          >
            {isBudgetLoading
              ? "جارٍ حساب ميزانية اليوم…"
              : isOverBudget
                ? `لقد تجاوزت الحد اليومي اليوم! • ${budgetPct}%`
                : `أنت ضمن ميزانية اليوم • ${budgetPct}%`}
          </p>

        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon={<Calendar className="h-5 w-5" strokeWidth={2} />}
            title="التقويم المالي"
            desc="مناسبة بعد 5 أيام"
            tint="bg-blue-50 text-blue-700"
            onClick={onOpenCalendar}
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" strokeWidth={2} />}
            title="المستشار المالي"
            desc="اسأل أي شيء"
            tint="bg-primary/10 text-primary"
            badge="AI"
            onClick={onOpenNoor}
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" strokeWidth={2} />}
            title="التقارير"
            desc="أداء هذا الشهر"
            tint="bg-mint/15 text-primary"
            onClick={onOpenReports}
          />
          <FeatureCard
            icon={<Gift className="h-5 w-5" strokeWidth={2} />}
            title="المكافآت"
            desc="كوبون جديد بانتظارك"
            tint="bg-amber-50 text-amber-700"
            onClick={onOpenRewards}
          />
        </div>

        {/* Group Challenge card */}
        <button
          onClick={onOpenGroup}
          dir="rtl"
          className="w-full rounded-[22px] p-4 bg-card border border-border shadow-sm flex items-center gap-3 text-right active:scale-[0.99] transition hover:border-primary/40"
        >
          <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center gap-2 justify-start">
              <p className="text-[13.5px] font-black text-foreground tracking-tight leading-tight">
                التحدي الجماعي 💚
              </p>
              <span className="text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded-md bg-mint/15 text-primary">
                جديد
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground font-semibold mt-1 leading-tight text-right">
              تحدَّ أصدقاءك وادّخروا سوياً — أنت 68% • ريما 45%
            </p>
          </div>
          <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={2.5} />
        </button>

        {/* Ihsan — Donation card (compact) */}
        <div
          dir="rtl"
          className="rounded-2xl px-3 py-2.5 shadow-sm border flex items-center gap-2.5"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.97 0.06 85) 0%, oklch(0.99 0.02 85) 100%)",
            borderColor: "oklch(0.85 0.10 85 / 0.5)",
          }}
        >
          <img
            src={ihsanLogo.url}
            alt="إحسان"
            className="h-9 w-9 rounded-xl object-contain bg-white/60 p-0.5 shrink-0"
          />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[11.5px] font-black text-foreground tracking-tight leading-tight truncate">
              العطاء لا يوقف رحلتك نحو هدفك..
            </p>
            <p className="text-[9.5px] text-foreground/70 font-medium mt-0.5 leading-tight truncate">
              فربما يكون سبباً في بركة ما تملك.
            </p>
          </div>
          <button
            onClick={onOpenDonate}
            className="shrink-0 rounded-full text-white font-extrabold px-3 py-1.5 text-[10.5px] flex items-center gap-1 active:scale-95 transition"
            style={{ background: "oklch(0.24 0.05 155)" }}
          >
            <Heart className="h-3 w-3" strokeWidth={2.4} />
            تبرع
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCarouselCard({
  goal,
  index,
  total,
  onPrev,
  onNext,
  onSelect,
  onOpenGoal,
}: {
  goal: Goal;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  onOpenGoal: () => void;
}) {
  const title = goal.title;
  const target = Number(goal.target_amount);
  const saved = Number(goal.saved_amount);
  const remaining = Math.max(0, target - saved);
  const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

  const GoalIcon = useMemo(() => {
    if (/سيارة|car/i.test(title)) return Car;
    if (/لاب|حاسوب|laptop/i.test(title)) return BarChart3;
    if (/سفر|رحلة|travel/i.test(title)) return Gift;
    return Target;
  }, [title]);

  return (
    <div
      className="relative rounded-[26px] overflow-hidden text-white shadow-[0_24px_48px_-24px_oklch(0.20_0.05_155/0.55)]"
      style={{
        background:
          "linear-gradient(140deg, oklch(0.32 0.06 155) 0%, oklch(0.22 0.05 155) 55%, oklch(0.14 0.04 155) 100%)",
      }}
    >
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-mint/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full blur-3xl" style={{ background: "oklch(0.85 0.14 85 / 0.20)" }} />

      <div className="relative px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9.5px] font-bold text-white/60 tracking-[0.15em] uppercase">
            هدف {index + 1} من {total}
          </p>
          <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-lg bg-mint/20 text-mint border border-mint/30">
            <Target className="h-3 w-3" strokeWidth={2.5} />
            هدفك
          </span>
        </div>

        <button onClick={onOpenGoal} className="w-full flex items-center justify-between text-right">
          <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <GoalIcon className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-right pr-3 min-w-0">
            <h3 className="text-[19px] font-black tracking-tight leading-tight truncate">{title}</h3>
            <p className="text-[10.5px] text-white/60 font-semibold mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
              {percent}% مكتمل
            </p>
          </div>
        </button>

        <div className="mt-3 flex items-center gap-1" dir="ltr">
          {Array.from({ length: 14 }).map((_, i) => {
            const active = i < Math.round((percent / 100) * 14);
            return (
              <span
                key={i}
                className="flex-1 h-1 rounded-full"
                style={{ background: active ? "var(--mint)" : "oklch(1 0 0 / 0.15)" }}
              />
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-xl bg-white/8 border border-white/10 px-3 py-2 text-right">
            <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">تبقى</p>
            <p className="text-[13px] font-black" style={{ fontVariantNumeric: "tabular-nums" }}>
              {remaining.toLocaleString()}
              <span className="text-[9px] text-white/60 font-bold mr-1">ر.س</span>
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-white/8 border border-white/10 px-3 py-2 text-right">
            <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">الهدف</p>
            <p className="text-[13px] font-black" style={{ fontVariantNumeric: "tabular-nums" }}>
              {target.toLocaleString()}
              <span className="text-[9px] text-white/60 font-bold mr-1">ر.س</span>
            </p>
          </div>
          <button
            onClick={onOpenGoal}
            aria-label="عرض التفاصيل"
            className="h-[52px] w-[52px] rounded-xl bg-mint text-primary flex items-center justify-center shadow-md active:scale-95 transition"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Carousel controls */}
        {total > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={onPrev}
              aria-label="الهدف السابق"
              className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center active:scale-95 transition"
            >
              <ChevronRight className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  aria-label={`الهدف ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === index ? "w-5 h-1.5 bg-mint" : "w-1.5 h-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onNext}
              aria-label="الهدف التالي"
              className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center active:scale-95 transition"
            >
              <ChevronLeft className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tint,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tint: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[22px] bg-card border border-border p-4 text-right relative overflow-hidden active:scale-[0.98] transition hover:border-primary/40 hover:shadow-md shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${tint}`}>
          {icon}
        </div>
        {badge && (
          <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-primary text-primary-foreground tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <h4 className="font-extrabold text-foreground text-[14px] tracking-tight">{title}</h4>
      <p className="text-[10.5px] text-muted-foreground mt-1 font-medium">{desc}</p>
      <ChevronLeft className="h-3 w-3 text-muted-foreground/70 absolute bottom-3 left-3" strokeWidth={2.5} />
    </button>
  );
}

function SummaryStat({
  value,
  label,
  suffix,
  tone,
  icon,
  loading,
}: {
  value: string;
  label: string;
  suffix?: string;
  tone: string;
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="text-center">
      <div className={`inline-flex items-center gap-1 ${tone}`}>
        {!loading && icon}
        {loading ? (
          <span
            className="inline-block h-5 w-10 rounded-md bg-muted animate-pulse"
            aria-label="جارٍ الحساب"
          />
        ) : (
          <span
            className="text-[22px] font-black leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </span>
        )}
      </div>
      {suffix && <p className="text-[9px] text-muted-foreground font-bold mt-1">{suffix}</p>}
      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 tracking-tight">{label}</p>
    </div>
  );
}

