import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary to-background flex items-center justify-center py-6 px-3">
      <div className="w-full max-w-[420px] bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden relative">
        {/* Notch */}
        <div className="h-6 flex justify-center items-start pt-2">
          <div className="w-28 h-5 bg-foreground rounded-full" />
        </div>
        <div className="max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
