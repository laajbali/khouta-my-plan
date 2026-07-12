import {
  Bell,
  ArrowDown,
  ArrowUp,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";
import { useSession } from "@/hooks/use-session";

const RANGES = ["هذا العام", "آخر 3 أشهر", "الشهر الماضي", "هذا الشهر"] as const;
type Range = (typeof RANGES)[number];

const RANGE_MONTHS: Record<Range, number> = {
  "هذا الشهر": 1,
  "الشهر الماضي": 1,
  "آخر 3 أشهر": 3,
  "هذا العام": 12,
};

const CATS = [
  { label: "التسوق", pct: 32, color: "oklch(0.28 0.05 155)" },
  { label: "المطاعم", pct: 25, color: "oklch(0.55 0.12 155)" },
  { label: "المواصلات", pct: 15, color: "oklch(0.75 0.15 80)" },
  { label: "الترفيه", pct: 10, color: "oklch(0.65 0.15 280)" },
  { label: "الفواتير", pct: 8, color: "oklch(0.65 0.2 20)" },
  { label: "أخرى", pct: 10, color: "oklch(0.7 0.02 250)" },
];


export function ReportsTab({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const [range, setRange] = useState<Range>("هذا الشهر");
  const profile = useProfile();
  const { goals } = useGoals();
  const { user } = useSession();
  const displayName =
    profile?.full_name?.trim() || user?.email?.split("@")[0] || "بكِ";

  const stats = useMemo(() => {
    const months = RANGE_MONTHS[range];
    const monthlyIncome = Number(profile?.monthly_income) || 0;
    const monthlyExpense = (profile?.fixed_expenses ?? []).reduce(
      (s, e) => s + (Number(e?.amount) || 0),
      0,
    );
    const monthlySaving = Math.max(0, monthlyIncome - monthlyExpense);
    const income = monthlyIncome * months;
    const expense = monthlyExpense * months;
    const saving = monthlySaving * months;
    const savingRate = income > 0 ? Math.round((saving / income) * 100) : 0;

    const goalsTotal = goals.reduce((s, g) => s + Number(g.target_amount || 0), 0);
    const goalsSaved = goals.reduce((s, g) => s + Number(g.saved_amount || 0), 0);
    const goalProgress = goalsTotal > 0 ? Math.round((goalsSaved / goalsTotal) * 100) : 0;

    // Bars: split the range into up to 5 buckets
    const buckets = Math.min(5, Math.max(1, months));
    const perBucket = months / buckets;
    const NAMES = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthsData = Array.from({ length: buckets }, (_, i) => ({
      m:
        months <= 1
          ? "الفترة"
          : months === 3
            ? ["الشهر ١", "الشهر ٢", "الشهر ٣"][i] ?? `${i + 1}`
            : NAMES[i % 12],
      s: (monthlySaving * perBucket) / 1000,
      e: (monthlyExpense * perBucket) / 1000,
    }));
    const maxBar = Math.max(6, ...monthsData.map((b) => Math.max(b.s, b.e)));

    return {
      income,
      expense,
      saving,
      savingRate,
      goalsTotal,
      goalsSaved,
      goalProgress,
      monthsData,
      maxBar,
      months,
    };
  }, [range, profile?.monthly_income, goals]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
        <div className="w-11" />
        <div className="text-center">
          <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">التقارير</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">تحليل شامل لوضعك المالي</p>
        </div>
        <button onClick={onOpenNotifications} aria-label="التنبيهات" className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition">
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive border-2 border-card text-white text-[9px] font-bold flex items-center justify-center" style={{ fontVariantNumeric: "tabular-nums" }}>
            3
          </span>
        </button>
      </div>


      <div className="px-5 pt-4 space-y-4">
        {/* Praise card */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-mint/15 text-primary flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">
              أحسنت {displayName ? `يا ${displayName}` : ""}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              نسبة ادخارك خلال {range}{" "}
              <span className="text-mint font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {stats.savingRate}%
              </span>
            </p>
            <p className="text-[11px] text-mint font-semibold mt-1 flex items-center gap-1 justify-start text-right">
              استمري على الطريق!
              <TrendingUp className="h-3 w-3" strokeWidth={2} />
            </p>
          </div>
        </div>

        {/* Range tabs */}
        <div className="flex gap-1 bg-secondary rounded-2xl p-1 justify-end">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${
                range === r
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="إجمالي الدخل"
            value={fmt(stats.income)}
            icon={<ArrowUp className="h-4 w-4" strokeWidth={2} />}
            iconBg="bg-mint/15 text-primary"
            valueColor="text-foreground"
          />
          <StatCard
            label="إجمالي المصروفات"
            value={fmt(stats.expense)}
            icon={<ArrowDown className="h-4 w-4" strokeWidth={2} />}
            iconBg="bg-destructive/10 text-destructive"
            valueColor="text-foreground"
          />
          <StatCard
            label="إجمالي الادخار"
            value={fmt(stats.saving)}
            icon={<PiggyBank className="h-4 w-4" strokeWidth={2} />}
            iconBg="bg-blue-50 text-blue-700"
            valueColor="text-mint"
          />
          <div className="rounded-[20px] bg-card border border-border p-4 shadow-sm">
            <p className="text-right text-[11px] font-medium text-muted-foreground">نسبة الادخار</p>
            <div className="flex items-center justify-center mt-2">
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 40 40" className="-rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${stats.savingRate} 100`} pathLength={100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{stats.savingRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <h3 className="text-right font-extrabold text-foreground text-[14px] tracking-tight mb-4">توزيع مصروفاتك</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2.5">
              {CATS.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-[11px]">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="flex-1 text-right text-foreground font-medium">{c.label}</span>
                  <span className="font-bold" style={{ color: c.color, fontVariantNumeric: "tabular-nums" }}>{c.pct}%</span>
                </div>
              ))}
            </div>
            <Donut cats={CATS} total={fmt(stats.expense)} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive/60" /> مصروفات</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-mint" /> ادخار</span>
            </div>
            <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">مقارنة الأداء الشهري</h3>
          </div>
          <div className="flex items-end justify-between gap-3 h-36 relative pr-6" dir="ltr">
            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-[9px] text-muted-foreground text-right font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
              <span>{fmt(stats.maxBar)}K</span>
              <span>{fmt(stats.maxBar * 0.75)}K</span>
              <span>{fmt(stats.maxBar * 0.5)}K</span>
              <span>{fmt(stats.maxBar * 0.25)}K</span>
              <span>0K</span>
            </div>
            {stats.monthsData.map((mo, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-1 h-28">
                  <div className="w-3 bg-mint rounded-t-md" style={{ height: `${(mo.s / stats.maxBar) * 100}%` }} />
                  <div className="w-3 bg-destructive/60 rounded-t-md" style={{ height: `${(mo.e / stats.maxBar) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{mo.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-2">
          <SummaryTile
            icon={<Target className="h-4 w-4" strokeWidth={2} />}
            iconTint="bg-mint/15 text-primary"
            title="هدفك"
            main={stats.goalsTotal > 0 ? `${fmt(stats.goalsTotal)} ر.س` : "لا يوجد"}
            note={stats.goalsTotal > 0 ? `وفَّرتِ ${fmt(stats.goalsSaved)} (${stats.goalProgress}%)` : "أضيفي هدفاً"}
          />
          <SummaryTile
            icon={<Sparkles className="h-4 w-4" strokeWidth={2} />}
            iconTint="bg-amber-50 text-amber-700"
            title="أعلى صرف"
            main="التسوق"
            note="32% من الفترة"
          />
          <SummaryTile
            icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />}
            iconTint="bg-blue-50 text-blue-700"
            title="أكثر تحكم"
            main="الترفيه"
            note="-12% عن السابق"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  valueColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
}) {
  return (
    <div className="rounded-[20px] bg-card border border-border p-4 shadow-sm">
      <p className="text-right text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between mt-2">
        <div className={`h-9 w-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-right">
          <p className={`text-[22px] font-bold ${valueColor} tracking-tight leading-none`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {value}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">ر.س</p>
        </div>
      </div>
    </div>
  );
}

function Donut({ cats, total }: { cats: typeof CATS; total: string }) {
  let offset = 0;
  const R = 16;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 40 40" className="-rotate-90">
        {cats.map((c, i) => {
          const len = (c.pct / 100) * C;
          const el = (
            <circle
              key={i}
              cx="20"
              cy="20"
              r={R}
              fill="none"
              stroke={c.color}
              strokeWidth="6"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] text-muted-foreground font-medium">إجمالي</span>
        <span className="text-[15px] font-bold text-foreground tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{total}</span>
        <span className="text-[9px] text-muted-foreground font-medium">ر.س</span>
      </div>
    </div>
  );
}

function SummaryTile({
  icon,
  iconTint,
  title,
  main,
  note,
}: {
  icon: React.ReactNode;
  iconTint: string;
  title: string;
  main: string;
  note: string;
}) {
  return (
    <div className="rounded-[20px] bg-card border border-border p-3 text-right shadow-sm">
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${iconTint} mb-2`}>
        {icon}
      </div>
      <p className="text-[10px] text-muted-foreground font-medium">{title}</p>
      <p className="text-[12px] font-extrabold text-foreground mt-0.5 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{main}</p>
      <p className="text-[9px] text-muted-foreground mt-1 font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{note}</p>
    </div>
  );
}
