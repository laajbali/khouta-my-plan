import { useState } from "react";
import { ChevronLeft, Wifi, ShieldCheck, Check, Lock } from "lucide-react";
import { Stepper } from "./Stepper";

export function Step4Bank({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [save, setSave] = useState(true);
  const [cardNumber, setCardNumber] = useState("4587");
  const [name, setName] = useState("سارة أحمد");

  return (
    <div className="bg-card">
      <Header title="إضافة بطاقة الدفع" onBack={onBack} />
      <div className="px-5 py-4">
        <Stepper current={4} />
      </div>

      <div className="px-5 pb-8 space-y-5">
        <p className="text-right text-sm text-muted-foreground">
          أضف بطاقة مدى لربط حسابك البنكي وتحليل مصروفاتك بدقة.
        </p>

        {/* Card mockup */}
        <div
          className="relative rounded-3xl p-6 aspect-[1.6/1] text-primary-foreground shadow-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.30 0.06 155), oklch(0.18 0.04 155))",
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-1 items-center">
              <span className="h-3 w-8 rounded-full bg-mint" />
              <span className="h-3 w-3 rounded-full bg-blue-500" />
            </div>
            <Wifi className="h-6 w-6 rotate-90" />
          </div>
          <div className="absolute top-16 left-6 text-lg font-bold">
            <span className="text-mint">مدى</span> <span className="text-white">mada</span>
          </div>
          <div className="absolute right-6 bottom-16 flex gap-2">
            <div className="h-10 w-14 rounded bg-white/20 border border-white/30 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/15" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-14 right-6 left-6 text-center text-lg font-mono tracking-widest">
            {cardNumber} **** **** ****
          </div>
          <div className="absolute bottom-4 right-6 font-serif italic text-2xl font-bold">
            VISA
          </div>
        </div>

        <Labeled label="رقم البطاقة">
          <input
            value={`${cardNumber} **** **** ****`}
            onChange={(e) => setCardNumber(e.target.value.slice(0, 4))}
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-right font-mono tracking-widest text-sm outline-none focus:border-primary"
          />
        </Labeled>

        <Labeled label="اسم حامل البطاقة">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-right text-sm outline-none focus:border-primary"
          />
        </Labeled>

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="رمز الأمان (CVV)">
            <input
              placeholder="•••"
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-center text-sm outline-none focus:border-primary"
            />
          </Labeled>
          <Labeled label="تاريخ الانتهاء">
            <input
              defaultValue="08 / 29"
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-center text-sm font-semibold outline-none focus:border-primary"
            />
          </Labeled>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-accent/50 border border-mint/30 px-4 py-3">
          <ShieldCheck className="h-8 w-8 text-mint shrink-0" />
          <div className="text-right flex-1">
            <p className="text-sm font-bold text-foreground">حماية وأمان 100%</p>
            <p className="text-xs text-muted-foreground">بياناتك مشفرة ولن يتم تخزينها.</p>
          </div>
        </div>

        <label className="flex items-center justify-between gap-2 cursor-pointer">
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center transition ${
              save ? "bg-mint text-mint-foreground" : "border-2 border-border"
            }`}
            onClick={() => setSave((s) => !s)}
          >
            {save && <Check className="h-4 w-4" strokeWidth={3} />}
          </div>
          <span className="text-sm text-foreground font-medium">حفظ البطاقة للاستخدام مستقبلاً</span>
        </label>

        <button
          onClick={onNext}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Lock className="h-4 w-4" />
          إضافة البطاقة
        </button>
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          🛡️ بياناتك آمنة 100%
        </p>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <button onClick={onBack} className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
        <ChevronLeft className="h-5 w-5 text-primary" />
      </button>
      <h1 className="text-xl font-black text-foreground">{title}</h1>
      <div className="w-10" />
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-right text-sm font-bold text-foreground mb-1.5">{label}</p>
      {children}
    </div>
  );
}
