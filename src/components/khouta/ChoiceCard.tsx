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
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 transition-all ${
        active
          ? "border-primary bg-accent/50"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {active && (
        <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-mint text-mint-foreground shadow">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      <div className="text-2xl">{icon}</div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {extra}
    </button>
  );
}
