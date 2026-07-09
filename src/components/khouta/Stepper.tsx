import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "الحساب" },
  { n: 2, label: "المالية" },
  { n: 3, label: "الهدف" },
  { n: 4, label: "ربط البنك" },
];

export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center justify-between px-1" dir="ltr">
      {STEPS.slice().reverse().map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex flex-1 items-center">
            {i !== 0 && (
              <div className={`h-[2px] flex-1 mx-1 rounded-full ${done || active ? "bg-primary" : "bg-border"}`} />
            )}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold transition ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "bg-secondary text-muted-foreground border border-border"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : s.n}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
