import { Home, Bell, Gift, User, BarChart3 } from "lucide-react";

export type Tab = "home" | "rewards" | "notifications" | "reports" | "profile";

const TABS: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: "reports", label: "التقارير", icon: BarChart3 },
  { key: "notifications", label: "التنبيهات", icon: Bell },
  { key: "home", label: "", icon: Home },
  { key: "rewards", label: "المكافآت", icon: Gift },
  { key: "profile", label: "الحساب", icon: User },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="sticky bottom-0 z-40 bg-card/95 backdrop-blur border-t border-border px-3 pt-2 pb-3 shrink-0">
      <div className="flex items-end justify-between">

        {TABS.map((t) => {
          const isHome = t.key === "home";
          const isActive = active === t.key;
          const Icon = t.icon;
          const badge = t.key === "notifications" ? 3 : 0;

          if (isHome) {
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className="relative -mt-6 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 shrink-0"
              >
                <Icon className="h-6 w-6" />
              </button>
            );
          }
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className="relative flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2.6 : 2}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] transition-colors ${isActive ? "text-primary font-black" : "text-muted-foreground font-bold"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
