import { Check } from "lucide-react";

const STEPS = [
 { n: 1, label: "الحساب" },
 { n: 2, label: "المالية" },
 { n: 3, label: "الهدف" },
 { n: 4, label: "ربط البنك" },
];

export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
 // Render LTR so lines connect visually the same regardless of RTL page.
 const items = STEPS.slice().reverse(); // [4,3,2,1] shown left→right
 return (
 <div className="flex items-center px-1" dir="ltr">
 {items.map((s, i) => {
 const done = s.n < current;
 const active = s.n === current;
 const isLast = i === items.length - 1;
 // The connector belongs to the *higher-numbered* neighbour (step to the left of the current one).
 // We render it AFTER each circle except the last (rightmost = step 1).
 const nextDone =!isLast && items[i + 1].n < current;
 const lineFilled = done || active || nextDone;
 return (
 <div key={s.n} className="flex items-center flex-1 last:flex-none">
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
 {done? <Check className="h-3 w-3" strokeWidth={3} /> : s.n}
 </div>
 <span
 className={`text-[9px] font-semibold whitespace-nowrap ${
 active? "text-foreground" : "text-muted-foreground"
 }`}
 >
 {s.label}
 </span>
 </div>
 {!isLast && (
 <div
 className={`h-[2px] flex-1 mx-1.5 rounded-full ${
 lineFilled? "bg-primary" : "bg-border"
 }`}
 />
 )}
 </div>
 );
 })}
 </div>
 );
}
