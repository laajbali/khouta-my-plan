import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "الأساسية" },
  { n: 2, label: "المالية" },
  { n: 3, label: "الهدف" },
];

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-between px-2" dir="ltr">
      {STEPS.slice().reverse().map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex flex-1 items-center">
            {i !== 0 && (
              <div className={`h-[2px] flex-1 mx-1.5 rounded-full ${done || active ? "bg-primary" : "bg-border"}`} />
            )}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-[12px] font-bold transition ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "bg-secondary text-muted-foreground border border-border"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
