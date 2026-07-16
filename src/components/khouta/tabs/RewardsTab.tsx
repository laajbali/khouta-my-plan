import { Bell, Clock, Gift, ShieldCheck, CheckCircle2, ChevronLeft, Tag, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGoals } from "@/hooks/use-khouta-data";

const FILTERS = ["منتهية", "قيد الاستخدام", "متاحة", "الكل"];

type CouponStatus = "available" | "in-use" | "expired";
type Coupon = {
  brand: string;
  accent: string;
  accentText: string;
  pct: number;
  min: number;
  days: number;
  target: string;
  code: string;
  status: CouponStatus;
  usedOn?: string;
};

const COUPONS: Coupon[] = [
  { brand: "SHEIN", accent: "bg-neutral-900", accentText: "text-white", pct: 20, min: 150, days: 7, target: "المشتريات", code: "KHUTA20SH", status: "available" },
  { brand: "نون", accent: "bg-yellow-400", accentText: "text-neutral-900", pct: 10, min: 200, days: 12, target: "المشتريات", code: "KHUTA10NN", status: "available" },
  { brand: "هنقر", accent: "bg-neutral-500", accentText: "text-white", pct: 10, min: 50, days: 0, target: "الطلبات", code: "KHUTA10HG", status: "expired", usedOn: "استُخدم 20 يونيو" },
];

export function RewardsTab({ onOpenNotifications, onCompleteReward }: { onOpenNotifications?: () => void; onCompleteReward?: () => void } = {}) {
  const [filter, setFilter] = useState("الكل");
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState(false);
  const { goals } = useGoals();
  const totalSaved = goals.reduce((s, g) => s + Number(g.saved_amount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.target_amount || 0), 0);
  const goalPct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const rewardsCount = COUPONS.filter((c) => c.status !== "expired").length;

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("تم نسخ الكود");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("تعذر النسخ");
    }
  }


  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
        <div className="w-11" />
        <div className="text-center">
          <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">المكافآت</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">كل مكافأة خطوة نحو هدفك</p>
        </div>
        <button onClick={onOpenNotifications} aria-label="التنبيهات" className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition">
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive border-2 border-card text-white text-[9px] font-bold flex items-center justify-center" style={{ fontVariantNumeric: "tabular-nums" }}>
            3
          </span>
        </button>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Achievement card */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Gift className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-right">
            <p className="text-[11px] text-muted-foreground font-medium">إجمالي ما وفرتِه</p>
            <p className="text-[22px] font-bold text-foreground mt-0.5 leading-none tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              {totalSaved.toLocaleString()}<span className="text-[13px] font-semibold text-mint mr-2">ر.س</span>
            </p>
            <p className="text-[11px] text-mint font-semibold mt-1.5 flex items-center gap-1 justify-end">
              {rewardsCount} مكافآت متاحة
              <Gift className="h-3 w-3" strokeWidth={2} />
            </p>
          </div>
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 40 40" className="h-16 w-16 -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${goalPct} 100`} pathLength={100} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[13px] font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{goalPct}%</span>
              <span className="text-[8px] text-muted-foreground font-medium">من هدفك</span>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-secondary rounded-2xl p-1 justify-center">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${
                filter === f
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {(() => {
          const visible = COUPONS.filter((c) =>
            filter === "الكل"
              ? true
              : filter === "متاحة"
                ? c.status === "available"
                : filter === "قيد الاستخدام"
                  ? c.status === "in-use"
                  : c.status === "expired",
          );
          const heading =
            filter === "منتهية"
              ? "الكوبونات المنتهية"
              : filter === "قيد الاستخدام"
                ? "الكوبونات قيد الاستخدام"
                : filter === "متاحة"
                  ? "الكوبونات المتاحة"
                  : "جميع الكوبونات";
          return (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {visible.length}
                </span>
                <h3 className="font-extrabold text-foreground text-[14px] tracking-tight flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" strokeWidth={2} />
                  {heading}
                </h3>
              </div>

              <div className="space-y-3">
                {visible.length === 0 && (
                  <div className="rounded-[20px] bg-card border border-border p-6 text-center text-[12px] font-semibold text-muted-foreground">
                    لا توجد كوبونات ضمن هذا التصنيف
                  </div>
                )}
                {visible.map((c, i) => {
                  const expired = c.status === "expired";
                  const inUse = c.status === "in-use";
                  return (
                    <div
                      key={i}
                      className={`rounded-[20px] bg-card border border-border shadow-sm overflow-hidden flex ${expired ? "opacity-70" : ""}`}
                    >
                      <div className={`w-20 ${c.accent} ${c.accentText} flex flex-col items-center justify-center text-[12px] font-extrabold tracking-tight`}>
                        <span>{c.brand}</span>
                      </div>
                      <div className="flex-1 p-3 flex justify-between items-center gap-3">
                        <div className="text-center shrink-0">
                          <p className={`text-[24px] font-bold leading-none tracking-tight ${expired ? "text-muted-foreground" : "text-foreground"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                            {c.pct}%
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">خصم</p>
                          {expired ? (
                            <div className="mt-2 rounded-lg px-2.5 py-1 text-[10px] font-bold bg-secondary text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                              منتهي
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveCoupon(c)}
                              className={`mt-2 rounded-lg px-2.5 py-1 text-[10px] font-bold active:scale-95 transition ${
                                inUse ? "bg-mint/20 text-primary" : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {inUse ? "قيد الاستخدام" : "استخدم"}
                            </button>
                          )}
                        </div>
                        <div className="flex-1 text-right min-w-0">
                          <p className={`font-extrabold text-[12px] tracking-tight ${expired ? "text-muted-foreground" : "text-foreground"}`}>
                            خصم على {c.target} في {c.brand}
                          </p>
                          <p className="text-[11px] text-mint font-semibold mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
                            حد أدنى {c.min} ر.س
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 justify-end font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {expired ? (c.usedOn ?? "منتهي الصلاحية") : `صالح ${c.days} أيام`}
                            <Clock className="h-3 w-3" strokeWidth={2} />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        <div
          className="rounded-[24px] p-4 text-primary-foreground flex items-center gap-3 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.34 0.07 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.12 0.03 155) 100%)",
            boxShadow: "0 20px 40px -20px oklch(0.20 0.05 155 / 0.6)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-mint/20 rounded-full blur-3xl" />
          <div className="relative h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-mint" strokeWidth={1.8} />
          </div>
          <div className="relative flex-1 text-right">
            <p className="font-extrabold text-[13px] tracking-tight">كل قرار ذكي يقرّبك من هدفك</p>
            <p className="text-[11px] text-white/70 mt-1 font-medium">استمري للحصول على مكافآت حصرية</p>
          </div>
          <ChevronLeft className="relative h-4 w-4 text-white/70 shrink-0" strokeWidth={2.5} />
        </div>
      </div>

      {activeCoupon && (
        <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setActiveCoupon(null)}
          />
          <div className="relative w-full bg-card rounded-t-[28px] p-5 pb-6 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActiveCoupon(null)}
                className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center"
              >
                <X className="h-4 w-4 text-foreground" strokeWidth={2.5} />
              </button>
              <h3 className="text-[15px] font-extrabold text-foreground tracking-tight">كوبونك جاهز</h3>
              <div className="w-9" />
            </div>

            <div
              className={`rounded-[24px] p-5 ${activeCoupon.accent} ${activeCoupon.accentText} relative overflow-hidden`}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-between">
                <span className="text-[11px] font-bold opacity-70">خصم على {activeCoupon.target}</span>
                <span className="text-[16px] font-black tracking-tight">{activeCoupon.brand}</span>
              </div>
              <p
                className="relative mt-3 text-[52px] font-black leading-none text-center"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {activeCoupon.pct}%
              </p>
              <p className="relative text-center text-[11px] font-semibold opacity-80 mt-1">
                حد أدنى {activeCoupon.min} ر.س • صالح {activeCoupon.days} أيام
              </p>
            </div>

            <div className="mt-4 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-4">
              <p className="text-[10px] font-bold text-muted-foreground text-right mb-2">كود الخصم</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCode(activeCoupon.code)}
                  className="h-11 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-[12px] flex items-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> نُسخ
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={2.5} /> نسخ
                    </>
                  )}
                </button>
                <span
                  className="flex-1 text-center text-[18px] font-black text-foreground tracking-[0.2em] font-mono"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {activeCoupon.code}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-3 font-medium">
              انسخ الكود واستخدمه عند إتمام الطلب في تطبيق {activeCoupon.brand}
            </p>

            <button
              onClick={() => {
                setActiveCoupon(null);
              }}
              className="mt-4 w-full rounded-2xl bg-primary text-primary-foreground font-extrabold py-3.5 text-[13px] shadow-lg shadow-primary/25 active:scale-[0.98] transition"
            >
              رائع، أكمل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
