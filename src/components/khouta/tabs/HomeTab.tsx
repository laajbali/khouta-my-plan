import {
  Bell,
  ChevronLeft,
  Sparkles,
  Calendar,
  BarChart3,
  Gift,
  Car,
  Plus,
  TrendingDown,
  TrendingUp,
  Target,
  Radar,
  Users,
} from "lucide-react";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";

export function HomeTab({
  onOpenNoor,
  onOpenGoal,
  onOpenNewGoal,
  onOpenCalendar,
  onOpenNotifications,
  onOpenReports,
  onOpenRewards,
  onOpenProfile,
  onOpenRadar,
  onOpenGroup,
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
}) {
  const profile = useProfile();
  const { goals } = useGoals();
  const displayName = profile?.full_name?.trim() || "";
  const firstName = displayName.split(" ")[0] || "بكِ";
  const initial = (firstName || "خ").charAt(0);
  const topGoal = goals[0];

  const goalTitle = topGoal?.title ?? "هدفك الأول";
  const target = Number(topGoal?.target_amount ?? 25000);
  const saved = Number(topGoal?.saved_amount ?? 0);
  const remaining = Math.max(0, target - saved);
  const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

  // Pick an icon from the goal title keywords
  const titleLower = goalTitle;
  const GoalIcon =
    /سيارة|car/i.test(titleLower) ? Car :
    /لاب|حاسوب|laptop/i.test(titleLower) ? BarChart3 :
    /سفر|رحلة|travel/i.test(titleLower) ? Gift :
    Target;

  return (
    <div className="bg-background pb-4">
      {/* Header — profile on right (visual), bell on left */}
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
        {/* Premium Goal Card — wider, shorter */}
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
                موعد الإنجاز • ديسمبر 2026
              </p>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-lg bg-mint/20 text-mint border border-mint/30">
                <Target className="h-3 w-3" strokeWidth={2.5} />
                هدفك الحالي
              </span>
            </div>

            <button onClick={onOpenGoal} className="w-full flex items-center justify-between text-right">
              <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <GoalIcon className="h-6 w-6 text-white" strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-right pr-3 min-w-0">
                <h3 className="text-[19px] font-black tracking-tight leading-tight truncate">
                  {goalTitle}
                </h3>
                <p className="text-[10.5px] text-white/60 font-semibold mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {percent}% مكتمل
                </p>
              </div>
            </button>

            {/* Segmented progress dots */}
            <div className="mt-3 flex items-center gap-1" dir="ltr">
              {Array.from({ length: 14 }).map((_, i) => {
                const active = i < Math.round((percent / 100) * 14);
                return (
                  <span
                    key={i}
                    className="flex-1 h-1 rounded-full"
                    style={{
                      background: active ? "var(--mint)" : "oklch(1 0 0 / 0.15)",
                    }}
                  />
                );
              })}
            </div>

            {/* Amounts + CTA on one row */}
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
          </div>
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
            desc="اسألي أي شيء"
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

        {/* Today's Financial Summary */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </div>
            <h4 className="text-[14px] font-extrabold text-foreground tracking-tight">ملخص اليوم</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SummaryStat
              value="10"
              label="متبقٍ اليوم"
              suffix="ر.س"
              tone="text-mint"
              icon={<TrendingUp className="h-3 w-3" strokeWidth={2.5} />}
            />
            <SummaryStat
              value="35"
              label="أُنفق اليوم"
              suffix="ر.س"
              tone="text-destructive"
              icon={<TrendingDown className="h-3 w-3" strokeWidth={2.5} />}
            />
            <SummaryStat
              value="45"
              label="الحد اليومي"
              suffix="ر.س"
              tone="text-foreground"
            />
          </div>
          <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div className="h-full rounded-full bg-gradient-to-l from-mint to-primary" style={{ width: "78%" }} />
          </div>
          <p className="mt-2 text-[10.5px] text-muted-foreground text-right font-medium">
            أنتِ ضمن ميزانية اليوم • 78%
          </p>
        </div>

        {/* Add new goal — subtle */}
        <button
          onClick={onOpenNewGoal}
          className="w-full py-3 rounded-2xl border border-dashed border-border text-[12px] font-bold text-muted-foreground flex items-center justify-center gap-1.5 hover:border-primary/40 hover:text-primary transition"
        >
          <Plus className="h-4 w-4" /> إضافة هدف جديد
        </button>
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
}: {
  value: string;
  label: string;
  suffix?: string;
  tone: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className={`inline-flex items-center gap-1 ${tone}`}>
        {icon}
        <span className="text-[22px] font-black leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
      </div>
      {suffix && <p className="text-[9px] text-muted-foreground font-bold mt-1">{suffix}</p>}
      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 tracking-tight">{label}</p>
    </div>
  );
}
