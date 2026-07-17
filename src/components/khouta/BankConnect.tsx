import { useState } from "react";
import { ChevronRight, ShieldCheck, Check, Loader2 } from "lucide-react";

const BANKS = [
  { key: "rajhi", name: "الراجحي", color: "bg-primary/10 text-primary", short: "R" },
  { key: "snb", name: "الأهلي (SNB)", color: "bg-emerald-50 text-emerald-800", short: "SNB" },
  { key: "alinma", name: "الإنماء", color: "bg-emerald-100 text-emerald-900", short: "A" },
  { key: "riyad", name: "الرياض", color: "bg-blue-100 text-blue-900", short: "R" },
  { key: "albilad", name: "البلاد", color: "bg-primary/10 text-primary", short: "B" },
  { key: "aljazira", name: "الجزيرة", color: "bg-red-50 text-red-800", short: "J" },
];

type State = "select" | "connecting" | "done";

export function BankConnect({
  onBack,
  onConnected,
}: {
  onBack: () => void;
  onConnected: (bank: string) => void;
}) {
  const [state, setState] = useState<State>("select");
  const [chosen, setChosen] = useState<string | null>(null);

  function connect(bankKey: string) {
    setChosen(bankKey);
    setState("connecting");
    setTimeout(() => {
      setState("done");
      setTimeout(() => onConnected(bankKey), 900);
    }, 1800);
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="bg-card px-5 pt-4 pb-3 flex items-center justify-between border-b border-border shrink-0">
        <button onClick={onBack} className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">الربط البنكي</h1>
        <div className="w-10" />
      </div>

      <div className="p-5 space-y-5">
        {/* SAMA badge card */}
        <div className="rounded-3xl p-5 text-primary-foreground relative overflow-hidden"
          style={{ background: "linear-gradient(140deg, oklch(0.32 0.06 155), oklch(0.20 0.05 155))" }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-mint/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-mint" />
              </div>
              <div className="text-right flex-1">
                <p className="text-[10px] text-mint font-bold tracking-widest">SAMA APPROVED</p>
                <p className="text-[13px] font-extrabold tracking-tight">معتمد من البنك المركزي السعودي</p>
              </div>
            </div>
            <h2 className="text-[17px] font-extrabold mt-2 tracking-tight">الربط عبر Open Banking</h2>
            <p className="text-[11px] text-white/80 mt-1 leading-relaxed font-medium">
              اسحبي بياناتك المالية تلقائياً بأمان تام — لا يتم مشاركة كلمة سرك، ويمكنكِ فصل الربط في أي وقت.
            </p>
          </div>
        </div>

        {state === "select" && (
          <>
            <div>
              <p className="text-[14px] font-extrabold text-foreground mb-3 text-right tracking-tight">اختر بنكك</p>
              <div className="grid grid-cols-2 gap-3">
                {BANKS.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => connect(b.key)}
                    className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/40 active:scale-[0.98] transition"
                  >
                    <div className={`h-12 w-12 rounded-xl ${b.color} flex items-center justify-center font-extrabold text-[14px]`}>
                      {b.short}
                    </div>
                    <span className="text-[13px] font-extrabold text-foreground tracking-tight">{b.name}</span>
                    <span className="text-[10px] text-mint font-medium"> متاح</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-secondary p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-right flex-1">
                <p className="text-[11px] font-bold text-foreground">تشفير من طرف لطرف</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                  نستخدم معايير Open Banking المعتمدة. بياناتك لا تُخزّن ولا تُشارك.
                </p>
              </div>
            </div>
          </>
        )}

        {state === "connecting" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-foreground">
              جارٍ الربط مع {BANKS.find((b) => b.key === chosen)?.name}...
            </p>
            <p className="text-xs text-muted-foreground">قد يستغرق هذا بضع ثوانٍ</p>
          </div>
        )}

        {state === "done" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-mint flex items-center justify-center">
              <Check className="h-8 w-8 text-mint-foreground" strokeWidth={3} />
            </div>
            <p className="text-lg font-bold text-foreground">تم الربط بنجاح!</p>
            <p className="text-xs text-muted-foreground">جارٍ نقلك إلى الرئيسية...</p>
          </div>
        )}
      </div>
    </div>
  );
}
