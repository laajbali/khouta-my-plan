import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function ChoiceCard({
  active,
  onClick,
  icon,
  label,
  extra,
}: {
  active?: boolean;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  extra?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition shadow-sm ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {active && (
        <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-card">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${active ? "bg-secondary text-primary" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <span className={`text-[11px] font-semibold tracking-tight ${active ? "text-foreground" : "text-foreground/80"}`}>
        {label}
      </span>
      {extra}
    </button>
  );
}
