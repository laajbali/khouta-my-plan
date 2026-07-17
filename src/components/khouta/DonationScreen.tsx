import { useState } from "react";
import { ChevronRight, Wallet, Plus, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";
import ihsanLogo from "@/assets/ihsan-logo.asset.json";

const PRESETS = [50, 20, 10, 5];

export function DonationScreen({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState<number>(5);
  const [custom, setCustom] = useState("");
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[oklch(0.99_0.005_90)]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="h-10 w-10 rounded-2xl bg-white/70 flex items-center justify-center active:scale-95 transition"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="text-[15px] font-extrabold text-foreground tracking-tight">إحسان</h2>
        <img src={ihsanLogo.url} alt="إحسان" className="h-9 w-9 rounded-lg object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        {/* Hero title */}
        <div className="text-right pt-2">
        <h1 className="text-[17px] font-extrabold text-foreground tracking-tight leading-snug">
          العطاء... بابٌ من أبواب البركة.
        </h1>
        <p className="mt-3 text-[11px] text-muted-foreground font-medium leading-relaxed">
          العطاء لا يوقف رحلتك نحو هدفك...<br />
          فربما يكون سبباً في بركة ما تملك.
        </p>
        </div>

        {/* Ayah card */}
        <div className="rounded-[20px] p-4 text-center bg-white border-[1.5px] border-mint/30">
          <p className="text-[14px] font-extrabold text-foreground leading-loose tracking-tight" dir="rtl">
            ﴿ وَما تُقَدِّموا لِأَنفُسِكُم مِن خَيرٍ تَجِدوهُ عِندَ اللَّه ﴾
          </p>
          <p className="mt-2 text-[11px] font-medium text-primary">
            « البقرة: 110 »
          </p>
        </div>

        {/* Available balance */}
        <div className="rounded-[20px] bg-white border border-border p-4 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-mint/15 flex items-center justify-center shrink-0">
            <Wallet className="h-7 w-7 text-primary" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-right">
            <p className="text-[11px] text-muted-foreground font-medium">الفائض المتاح</p>
            <p className="text-[22px] font-bold text-foreground mt-1 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              350
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">ريال</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">
              يمكنك تخصيص جزء بسيط إذا رغبت.
            </p>
          </div>
        </div>

        {/* Amount picker */}
        <div>
          <h3 className="text-center text-[14px] font-extrabold text-foreground tracking-tight mb-3">
            اختر مبلغ التبرع
          </h3>
          <div className="grid grid-cols-5 gap-2" dir="ltr">
            {PRESETS.map((v) => {
              const active = amount === v && !customOpen;
              return (
                <button
                  key={v}
                  onClick={() => {
                    setAmount(v);
                    setCustomOpen(false);
                  }}
                  className={`rounded-2xl py-3 flex flex-col items-center justify-center border transition ${
                    active
                      ? "text-white shadow-md"
                      : "bg-white text-foreground border-border"
                  }`}
                  style={
                    active
                      ? { background: "oklch(0.32 0.06 155)", borderColor: "oklch(0.32 0.06 155)" }
                      : undefined
                  }
                >
                  <span className="text-[16px] font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {v}
                  </span>
                  <span className={`text-[10px] font-medium mt-0.5 ${active ? "text-white/80" : "text-muted-foreground"}`}>
                    ريال
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setCustomOpen((s) => !s)}
              className={`rounded-2xl py-3 flex flex-col items-center justify-center border-2 border-dashed transition ${
                customOpen ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground bg-white"
              }`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="text-[10px] font-medium mt-0.5">إضافة مبلغ</span>
            </button>
          </div>

          {customOpen && (
            <input
              value={custom}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, "");
                setCustom(v);
                if (v) setAmount(Number(v));
              }}
              inputMode="numeric"
              placeholder="أدخل المبلغ بالريال"
              className="mt-3 w-full h-12 rounded-2xl bg-white border border-border px-4 text-[13px] font-bold text-right outline-none focus:border-primary/50"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            toast.success(`جارٍ تحويلك إلى منصة إحسان لتبرع ${amount} ريال`)
          }
          className="w-full rounded-2xl text-white font-extrabold py-4 flex items-center justify-center gap-2 text-[14px] shadow-lg active:scale-[0.99] transition"
          style={{ background: "oklch(0.24 0.05 155)" }}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
          الانتقال إلى منصة إحسان
        </button>
        <p className="text-center text-[11px] text-muted-foreground font-medium -mt-2">
          سيتم تحويلك إلى منصة إحسان لإتمام التبرع بأمان.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-muted-foreground font-semibold">
          <Lock className="h-3 w-3" strokeWidth={2.5} />
          عملية آمنة ومشفرة
        </div>
      </div>
    </div>
  );
}
