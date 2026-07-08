import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary to-background flex items-center justify-center py-6 px-3">
      <div className="w-full max-w-[420px] bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden relative flex flex-col h-[90vh] max-h-[900px]">
        {/* Notch */}
        <div className="h-6 flex justify-center items-start pt-2 shrink-0">
          <div className="w-28 h-5 bg-foreground rounded-full" />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
