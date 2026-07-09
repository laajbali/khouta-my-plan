import { AlertTriangle, ShieldCheck, Copy, Check, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function InterceptModal({
  open,
  onCancel,
  onProceed,
  merchant = "SHEIN",
  amount = 240,
}: {
  open: boolean;
  onCancel: () => void;
  onProceed: () => void;
  merchant?: string;
  amount?: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const code = `KHUTA${amount}${merchant.slice(0, 2).toUpperCase()}`;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setRevealed(false);
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
    <div className="absolute inset-0 z-50 flex items-center justify-center px-5 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full bg-card rounded-3xl p-6 shadow-2xl animate-scale-in">
        {!revealed ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" strokeWidth={2.2} />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-foreground">
              لحظة يا سارة!
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
              هذه العملية بقيمة{" "}
              <span className="font-semibold text-foreground">{amount} ر.س</span> من{" "}
              <span className="font-semibold text-foreground">{merchant}</span> ستتجاوز
              ميزانية التسوق لهذا الشهر.
            </p>

            <div className="mt-5 rounded-2xl bg-mint/10 border border-mint/30 p-3 flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">
                بإلغاء الطلب، ستقتربين من هدفك بـ{" "}
                <span className="font-bold text-primary">{amount} ر.س</span> إضافية،
                وسنمنحكِ كوبون خصم فوري.
              </p>
            </div>

            <button
              onClick={() => setRevealed(true)}
              className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 shadow-lg shadow-primary/30 hover:opacity-95 active:scale-[0.99] transition"
            >
              إلغاء الطلب وتوفير {amount} ر.س
            </button>
            <button
              onClick={onProceed}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition"
            >
              متابعة الشراء رغم ذلك
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-mint/15 flex items-center justify-center">
              <Tag className="h-8 w-8 text-primary" strokeWidth={2} />
            </div>
            <h2 className="mt-4 text-center text-xl font-bold text-foreground">
              أحسنتِ! كوبون خصم لكِ
            </h2>
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              وفّرتِ {amount} ر.س وقربتِ خطوة إضافية من هدفك
            </p>

            <div className="mt-5 rounded-2xl border-2 border-dashed border-primary/40 bg-mint/5 p-4">
              <p className="text-center text-[11px] text-muted-foreground font-medium">
                كوبون خصم على {merchant}
              </p>
              <p className="text-center text-2xl font-extrabold text-primary mt-1 tracking-tight">
                20% خصم
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-2.5">
                <button
                  onClick={copyCode}
                  className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition"
                  aria-label="نسخ الكود"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <span
                  dir="ltr"
                  className="flex-1 text-center font-mono font-bold text-foreground tracking-widest text-[15px]"
                >
                  {code}
                </span>
              </div>
              <p className="text-center text-[10px] text-muted-foreground font-medium mt-2">
                صالح لمدة 7 أيام
              </p>
            </div>

            <button
              onClick={onCancel}
              className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 shadow-lg shadow-primary/25 active:scale-[0.99] transition"
            >
              تم
            </button>
          </>
        )}
      </div>
    </div>
  );
}
