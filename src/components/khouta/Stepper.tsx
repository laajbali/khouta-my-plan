import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "إنشاء الحساب" },
  { n: 2, label: "البيانات المالية" },
  { n: 3, label: "الهدف" },
  { n: 4, label: "ربط البنك" },
];

export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  // Visual order in RTL should show 1 on the right, 4 on the left.
  // We render as flex-row and rely on dir="rtl" from the shell.
  return (
    <div className="flex items-start justify-between px-2">
      {STEPS.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* connector on the right (start side in RTL is right, but we hide first) */}
              {i !== 0 && (
                <div
                  className={`h-[2px] flex-1 ${
                    done || active ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "bg-background text-muted-foreground border border-border"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.n}
              </div>
              {i !== STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 ${
                    done ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-[11px] font-medium ${
                active
                  ? "text-foreground"
                  : done
                    ? "text-foreground/70"
                    : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
