import { useEffect, useState } from "react";
import { ChevronRight, ShieldCheck, Check, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Stepper } from "./Stepper";
import { useOnboarding } from "./onboarding-context";

export function Step4Card({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { data, submit, loading } = useOnboarding();
  const [number, setNumber] = useState("4587");
  const [name, setName] = useState(data.fullName || "سارة أحمد");
  const [expiry, setExpiry] = useState("08/29");
  const [cvv, setCvv] = useState("");
  const [save, setSave] = useState(false);

  useEffect(() => {
    const who = data.fullName?.trim() || "بك";
    toast.dismiss();
    toast.success(`أهلاً ${who}، لنربط بطاقتك الآن`, { id: "step4-welcome" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function finish() {
    const ok = await submit();
    if (ok) onNext();
  }

  const last4 = number.replace(/\D/g, "").slice(0, 4).padEnd(4, "•");

  return (
    <div className="bg-background pb-6 min-h-full">
      <Header title="إضافة بطاقة الدفع" onBack={onBack} />
      <div className="px-5 pt-3 pb-4 bg-card">
        <Stepper current={4} />
      </div>

      <div className="px-5 pt-5 space-y-5">
        <p className="text-[11px] text-muted-foreground text-right leading-relaxed">
          أضيفي بطاقة مدى لربط حسابك البنكي وتحليل مصروفاتك بدقة.
        </p>

        {/* Card visual */}
        <div
          className="rounded-[24px] p-5 text-primary-foreground relative overflow-hidden aspect-[1.6/1] flex flex-col justify-between"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.34 0.07 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.12 0.03 155) 100%)",
            boxShadow: "0 20px 40px -20px oklch(0.20 0.05 155 / 0.6)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-mint/15 rounded-full blur-3xl" />
          <div className="flex items-start justify-between relative">
            <Wifi className="h-5 w-5 rotate-90 text-white/70" strokeWidth={2} />
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-6 rounded-full bg-mint" />
              <span className="h-2 w-6 rounded-full bg-white/80" />
              <span className="text-[11px] font-bold text-white ml-1">mada</span>
            </div>
          </div>

          <div className="relative flex items-end justify-between">
            <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400/70" />
            <p className="text-[16px] font-bold tracking-[0.2em] text-white/95" style={{ fontVariantNumeric: "tabular-nums" }}>
              {last4} •••• •••• ••••
            </p>
          </div>

          <div className="relative flex items-end justify-between">
            <p className="italic font-bold text-[15px] text-white/90">VISA</p>
            <p className="text-[11px] text-white/70 font-semibold">{name || "اسم حامل البطاقة"}</p>
          </div>
        </div>

        {/* Card number */}
        <Field label="رقم البطاقة">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 16))}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            className="w-full bg-transparent outline-none text-[14px] font-bold text-foreground text-right"
            style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.1em" }}
          />
        </Field>

        <Field label="اسم حامل البطاقة">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent outline-none text-[13px] font-semibold text-foreground text-right"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="تاريخ الانتهاء">
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
              placeholder="MM/YY"
              className="w-full bg-transparent outline-none text-[13px] font-bold text-foreground text-right"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </Field>
          <Field label="رمز الأمان (CVV)">
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              placeholder="•••"
              type="password"
              className="w-full bg-transparent outline-none text-[13px] font-bold text-foreground text-right"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </Field>
        </div>

        <button
          onClick={() => setSave((s) => !s)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 flex items-center gap-3 shadow-sm active:scale-[0.99] transition"
        >
          <span className="flex-1 text-right text-[12px] font-semibold text-foreground">
            حفظ البطاقة للاستخدام مستقبلاً
          </span>
          <div
            className={`h-5 w-5 rounded-md flex items-center justify-center border shrink-0 transition ${
              save ? "bg-primary border-primary" : "bg-card border-border"
            }`}
          >
            {save && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
          </div>
        </button>

        {/* Safety row */}
        <div className="rounded-2xl bg-mint/15 border border-mint/25 p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-mint text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-right">
            <p className="text-[12px] font-extrabold text-foreground">حماية وأمان 100%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">بياناتك مشفّرة ولن يتم تخزينها</p>
          </div>
        </div>

        <button
          onClick={finish}
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-[14px] tracking-tight active:scale-[0.99] transition disabled:opacity-60"
        >
          {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب والبدء"}
          {!loading && <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-muted-foreground text-right mb-1.5">{label}</p>
      <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">{children}</div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
      <button
        onClick={onBack}
        className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
      >
        <ChevronRight className="h-5 w-5 text-foreground" strokeWidth={2} />
      </button>
      <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">{title}</h1>
      <div className="w-11" />
    </div>
  );
}
