import { Bell, ArrowDown, Check } from "lucide-react";
import { useState } from "react";

const RANGES = ["هذا العام", "آخر 3 أشهر", "الشهر الماضي", "هذا الشهر"];

const CATS = [
  { label: "التسوق", pct: 32, color: "oklch(0.28 0.05 155)" },
  { label: "المطاعم", pct: 25, color: "oklch(0.55 0.12 155)" },
  { label: "المواصلات", pct: 15, color: "oklch(0.75 0.15 80)" },
  { label: "الترفيه", pct: 10, color: "oklch(0.65 0.15 280)" },
  { label: "الفواتير", pct: 8, color: "oklch(0.65 0.2 20)" },
  { label: "أخرى", pct: 10, color: "oklch(0.7 0.02 250)" },
];

const MONTHS = [
  { m: "فبراير", s: 4.2, e: 4.0 },
  { m: "مارس", s: 4.8, e: 4.9 },
  { m: "أبريل", s: 4.6, e: 4.7 },
  { m: "مايو", s: 5.0, e: 5.1 },
  { m: "يونيو", s: 5.0, e: 5.0 },
];

export function ReportsTab() {
  const [range, setRange] = useState("هذا الشهر");

  return (
    <div className="bg-card">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="w-11" />
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground">التقارير</h1>
          <p className="text-xs text-muted-foreground mt-1">تحليل شامل لوضعك المالي</p>
        </div>
        <button className="relative h-11 w-11 rounded-full bg-accent flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>

      <div className="px-5 pb-4 space-y-4 mt-5">
        {/* Praise card */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm flex items-center gap-3">
          <span className="text-4xl">💰</span>
          <div className="flex-1 text-right">
            <div className="flex items-center gap-2 justify-end">
              <span>🎉</span>
              <h3 className="font-black text-foreground">أحسنتِ يا سارة!</h3>
              <span className="h-6 w-6 rounded-full bg-mint text-mint-foreground flex items-center justify-center">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              وفرت أكثر من الشهر الماضي بـ <span className="text-2xl font-black text-foreground">18%</span>
            </p>
            <p className="text-xs text-mint font-bold mt-1">🌱 استمري على هذا الطريق!</p>
          </div>
        </div>

        {/* Range tabs */}
        <div className="flex gap-2 bg-accent rounded-full p-1.5 justify-end">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="إجمالي الدخل" value="8,250" icon="💼" iconBg="bg-accent" valueColor="text-foreground" />
          <StatCard
            label="إجمالي المصروفات"
            value="5,380"
            icon={<ArrowDown className="h-5 w-5 text-white" />}
            iconBg="bg-blue-500"
            valueColor="text-destructive"
          />
          <StatCard label="إجمالي الادخار" value="2,870" icon="🏛️" iconBg="bg-accent" valueColor="text-mint" />
          <div className="rounded-3xl bg-card border border-border p-4 shadow-sm">
            <p className="text-right text-xs text-muted-foreground">نسبة الادخار</p>
            <div className="flex justify-center mt-2">
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 40 40" className="-rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeDasharray="34 100" pathLength={100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-foreground">34%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <h3 className="text-right font-black text-foreground mb-4">توزيع مصروفاتك</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              {CATS.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="flex-1 text-right text-foreground">{c.label}</span>
                  <span className="font-bold" style={{ color: c.color }}>{c.pct}%</span>
                </div>
              ))}
            </div>
            <Donut cats={CATS} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-pink-300" /> المصروفات</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-mint" /> الادخار</span>
            </div>
            <h3 className="font-black text-foreground">مقارنة المصروفات والادخار</h3>
          </div>
          <div className="flex items-end justify-between gap-3 h-40 relative pr-6" dir="ltr">
            {/* Y axis */}
            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-[9px] text-muted-foreground text-right">
              <span>6K</span><span>4.5K</span><span>3K</span><span>1.5K</span><span>0K</span>
            </div>
            {MONTHS.map((mo) => (
              <div key={mo.m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-0.5 h-32">
                  <div className="w-3 bg-mint rounded-t" style={{ height: `${(mo.s / 6) * 100}%` }} />
                  <div className="w-3 bg-pink-300 rounded-t" style={{ height: `${(mo.e / 6) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{mo.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-2">
          <SummaryTile bg="oklch(0.95 0.05 155)" icon="🌱" title="هدفك" main="توفير 3,000 ريال" note="وفَّرتِ 2,870 ريال" color="text-mint" />
          <SummaryTile bg="oklch(0.97 0.08 85)" icon="⭐" title="أعلى صرف" main="التسوق" note="32% من مصروفاتك" color="text-gold" />
          <SummaryTile bg="oklch(0.94 0.05 340)" icon="🎯" title="أكثر تحكم" main="الترفيه" note="-12% عن الشهر" color="text-pink-500" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, iconBg, valueColor }: { label: string; value: string; icon: React.ReactNode; iconBg: string; valueColor: string }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-4 shadow-sm">
      <p className="text-right text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between mt-2">
        <div className={`h-9 w-9 rounded-full ${iconBg} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black ${valueColor}`}>{value}</p>
          <p className="text-[10px] text-muted-foreground">ريال</p>
        </div>
      </div>
    </div>
  );
}

function Donut({ cats }: { cats: typeof CATS }) {
  const total = cats.reduce((s, c) => s + c.pct, 0);
  let offset = 0;
  const R = 16;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 40 40" className="-rotate-90">
        {cats.map((c, i) => {
          const len = (c.pct / total) * C;
          const el = (
            <circle
              key={i}
              cx="20"
              cy="20"
              r={R}
              fill="none"
              stroke={c.color}
              strokeWidth="7"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] text-muted-foreground">إجمالي</span>
        <span className="text-base font-black text-foreground">5,380</span>
        <span className="text-[9px] text-muted-foreground">ريال</span>
      </div>
    </div>
  );
}

function SummaryTile({ bg, icon, title, main, note, color }: { bg: string; icon: string; title: string; main: string; note: string; color: string }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: bg }}>
      <div className="text-lg">{icon}</div>
      <p className="text-[10px] text-muted-foreground mt-1">{title}</p>
      <p className={`text-xs font-black mt-1 ${color}`}>{main}</p>
      <p className="text-[9px] text-muted-foreground mt-1">{note}</p>
    </div>
  );
}
