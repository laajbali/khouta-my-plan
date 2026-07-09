import { ShieldCheck, Copy, Check, Gift, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KhoutaLogo } from "./Logo";

export function InterceptModal({
  open,
  onCancel,
  onProceed,
  merchant = "SHEIN",
  amount = 450,
  userName = "",
  goalTitle = "هدفك",
  goalTarget = 25000,
  goalSaved = 0,
}: {
  open: boolean;
  onCancel: () => void;
  onProceed: () => void;
  merchant?: string;
  amount?: number;
  userName?: string;
  goalTitle?: string;
  goalTarget?: number;
  goalSaved?: number;
}) {
  const [stage, setStage] = useState<"warn" | "reward">("warn");
  const [copied, setCopied] = useState(false);
  const code = `KHUTA${amount}${merchant.slice(0, 2).toUpperCase()}`;
  const delayDays = Math.max(1, Math.round(amount / 38));
  const target = goalTarget;
  const savedBase = goalSaved;
  const savedAfter = savedBase + amount;
  const percentAfter = target > 0 ? Math.min(100, Math.round((savedAfter / target) * 100)) : 0;
  const firstName = (userName || "").split(" ")[0];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStage("warn");
      setCopied(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("تم نسخ الكود");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("تعذر النسخ");
    }
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/70 backdrop-blur-md" onClick={onCancel} />

      {stage === "warn" ? (
        <div className="relative w-full bg-card rounded-[28px] shadow-2xl animate-scale-in overflow-hidden">
          {/* Header — خُطى brand */}
          <div
            className="px-5 pt-5 pb-4 text-white relative"
            style={{
              background:
                "linear-gradient(140deg, oklch(0.32 0.06 155) 0%, oklch(0.20 0.05 155) 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={onCancel}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-black tracking-tight">خُطى</span>
                <KhoutaLogo size={26} className="!rounded-lg" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              <p className="text-[10px] font-bold text-mint tracking-[0.2em] uppercase">
                تدخل ذكي فوري
              </p>
            </div>
            <h2 className="mt-1 text-[22px] font-black tracking-tight">
              لحظة{firstName ? " يا " + firstName : ""}! 🛑
            </h2>
          </div>

          <div className="p-5">
            <p className="text-[13px] text-foreground leading-relaxed text-right">
              أنتِ الآن على وشك شراء منتجات بقيمة{" "}
              <span className="font-black text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
                {amount} ر.س
              </span>{" "}
              من <span className="font-bold">{merchant}</span>.
            </p>
            <p className="text-[12.5px] text-muted-foreground mt-2 text-right font-medium leading-relaxed">
              إذا أكملتِ هذه العملية، ستتأخرين عن هدفك المالي لمدة:
            </p>

            {/* Delay badge */}
            <div className="mt-3 rounded-2xl bg-destructive/10 border border-destructive/25 p-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-destructive">تأخير متوقع</span>
              <span
                className="text-[18px] font-black text-destructive"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {delayDays} يوماً
              </span>
            </div>

            {/* Goal progress preview */}
            <div className="mt-4 rounded-2xl bg-secondary/60 border border-border p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold text-muted-foreground">
                  متبقٍ{" "}
                  <span className="text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {(target - savedBase).toLocaleString()} ر.س
                  </span>
                </span>
                <span className="text-[12px] font-black text-foreground">🚗 شراء سيارة</span>
              </div>
              <div className="h-2 bg-card rounded-full overflow-hidden" dir="ltr">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-mint to-primary transition-all"
                  style={{ width: `${Math.round((savedBase / target) * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] font-bold text-primary text-right" style={{ fontVariantNumeric: "tabular-nums" }}>
                {Math.round((savedBase / target) * 100)}% من الهدف
              </p>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                onClick={onProceed}
                className="flex-1 rounded-2xl bg-secondary text-foreground font-bold py-3.5 text-[12.5px] active:scale-[0.98] transition"
              >
                المتابعة رغم ذلك
              </button>
              <button
                onClick={() => setStage("reward")}
                className="flex-1 rounded-2xl bg-primary text-primary-foreground font-extrabold py-3.5 text-[12.5px] shadow-lg shadow-primary/30 active:scale-[0.98] transition"
              >
                إلغاء الطلب
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full bg-card rounded-[28px] shadow-2xl animate-scale-in overflow-hidden">
          {/* Confetti-ish top */}
          <div
            className="relative px-5 pt-6 pb-8 text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.96 0.04 155) 0%, oklch(0.99 0.01 155) 100%)",
            }}
          >
            <div className="absolute top-3 left-6 text-lg animate-bounce">🎉</div>
            <div className="absolute top-8 right-5 text-base animate-pulse">✨</div>
            <div className="absolute top-5 right-16 text-lg">🎊</div>
            <div className="absolute top-10 left-16 text-base animate-pulse">⭐</div>

            <div className="mx-auto w-16 h-16 rounded-2xl bg-mint/20 flex items-center justify-center relative">
              <Gift className="h-8 w-8 text-primary" strokeWidth={2} />
            </div>
            <h2 className="mt-4 text-[22px] font-black text-foreground tracking-tight">
              أحسنتِ يا سارة! 🎁
            </h2>
            <p className="mt-1.5 text-[12px] text-muted-foreground font-medium max-w-[260px] mx-auto leading-relaxed">
              قرارك الذكي اليوم يصنع مستقبلك غداً
            </p>
          </div>

          <div className="p-5 -mt-3">
            <div className="grid grid-cols-2 gap-2.5">
              <RewardStat label="وفّرتِ اليوم" value={`${amount}`} suffix="ر.س" tone="text-primary bg-mint/15" />
              <RewardStat label="اقتربتِ من هدفك" value={`${percentAfter}%`} tone="text-amber-700 bg-amber-50" />
            </div>

            <div className="mt-3 rounded-2xl border-2 border-dashed border-primary/40 bg-mint/5 p-3.5">
              <div className="flex items-center gap-2 justify-end">
                <p className="text-[11px] font-bold text-foreground">تمت إضافة مكافأة جديدة</p>
                <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              </div>
              <p className="text-center text-[20px] font-black text-primary mt-1.5 tracking-tight">
                كوبون خصم 20%
              </p>
              <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-2">
                <button
                  onClick={copyCode}
                  className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition"
                  aria-label="نسخ الكود"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <span
                  dir="ltr"
                  className="flex-1 text-center font-mono font-bold text-foreground tracking-widest text-[13px]"
                >
                  {code}
                </span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="mt-4 w-full rounded-2xl bg-primary text-primary-foreground font-extrabold py-3.5 shadow-lg shadow-primary/30 active:scale-[0.98] transition flex items-center justify-center gap-2 text-[13px]"
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
              عرض المكافآت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RewardStat({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl p-3 text-right ${tone}`}>
      <p className="text-[10px] font-bold opacity-80">{label}</p>
      <p className="text-[18px] font-black mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
        {suffix && <span className="text-[10px] font-bold mr-1">{suffix}</span>}
      </p>
    </div>
  );
}
