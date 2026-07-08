import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

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
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-5 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full bg-card rounded-3xl p-6 shadow-2xl animate-scale-in">
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
            <span className="font-bold text-primary">{amount} ر.س</span> إضافية.
          </p>
        </div>

        <button
          onClick={onCancel}
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
      </div>
    </div>
  );
}
