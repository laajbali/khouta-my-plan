import {
  ChevronRight,
  Plus,
  Trash2,
  Wallet,
  Gift,
  Laptop,
  MoreHorizontal,
  Home,
  Car,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { Stepper } from "./Stepper";
import { ChoiceCard } from "./ChoiceCard";
import { useOnboarding } from "./onboarding-context";

const INCOME_SOURCES = [
  { key: "salary", label: "راتب شهري", icon: <Wallet className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "scholarship", label: "منحة", icon: <Gift className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "freelance", label: "عمل حر", icon: <Laptop className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "other", label: "أخرى", icon: <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} /> },
];

const EXPENSE_ICONS: Record<string, React.ReactNode> = {
  housing: <Home className="h-4 w-4" strokeWidth={1.8} />,
  transport: <Car className="h-4 w-4" strokeWidth={1.8} />,
  internet: <Wifi className="h-4 w-4" strokeWidth={1.8} />,
};

export function Step2Financial({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useOnboarding();

  function updateExpense(key: string, patch: Partial<{ amount: string; label: string }>) {
    update({ expenses: data.expenses.map((e) => (e.key === key ? { ...e, ...patch } : e)) });
  }

  function addExpense() {
    update({
      expenses: [
        ...data.expenses,
        { key: `custom-${Date.now()}`, label: "", amount: "0", editable: true },
      ],
    });
  }

  function removeExpense(key: string) {
    update({ expenses: data.expenses.filter((e) => e.key !== key) });
  }

  function next() {
    if (!data.incomeSource) {
      toast.error("عذراً، الرجاء تحديد مصدر الدخل");
      return;
    }
    if (data.incomeSource === "other" && !data.incomeSourceCustom.trim()) {
      toast.error("عذراً، الرجاء كتابة مصدر الدخل");
      return;
    }
    const hasExpense = data.expenses.some(
      (e) => Number(e.amount) > 0 && (e.label?.trim().length ?? 0) > 0,
    );
    if (!hasExpense) {
      toast.error("عذراً، الرجاء إدخال مصروف شهري واحد على الأقل");
      return;
    }
    onNext();
  }

  return (
    <div className="bg-background pb-6">
      <Header title="البيانات المالية" onBack={onBack} />
      <div className="px-5 pt-3 pb-4 bg-card">
        <Stepper current={2} />
      </div>

      <div className="px-5 pt-5 space-y-5">
        <div className="text-right">
          <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">ساعدينا نفهم وضعك المالي</h2>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">كلما كانت البيانات أدق، كانت خطتك أفضل</p>
        </div>

        {/* Income sources */}
        <Section title="مصدر الدخل">
          <div className="grid grid-cols-4 gap-2">
            {INCOME_SOURCES.map((s) => (
              <ChoiceCard
                key={s.key}
                active={data.incomeSource === s.key}
                onClick={() => update({ incomeSource: s.key })}
                icon={s.icon}
                label={s.label}
              />
            ))}
          </div>
          {data.incomeSource === "other" && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary/50 transition">
              <input
                value={data.incomeSourceCustom}
                onChange={(e) => update({ incomeSourceCustom: e.target.value })}
                placeholder="اكتب مصدر الدخل"
                className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
              />
            </div>
          )}
          <div className="mt-3">
            <p className="text-right text-[11px] font-semibold text-foreground/80 mb-1.5 tracking-tight">
              الدخل الشهري
            </p>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary/50 transition">
              <span className="text-[11px] text-muted-foreground font-semibold">ر.س</span>
              <input
                value={data.monthlyIncome}
                onChange={(e) => update({ monthlyIncome: e.target.value.replace(/[^\d]/g, "") })}
                placeholder="9,000"
                inputMode="numeric"
                className="flex-1 bg-transparent outline-none text-[16px] font-bold text-foreground placeholder:text-muted-foreground/50 placeholder:font-medium text-right"
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          </div>
        </Section>

        {/* Fixed expenses */}
        <Section title="المصاريف الشهرية">
          <div className="space-y-2">
            {data.expenses.map((e, i) => (
              <div
                key={e.key}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm"
              >
                <div className="h-8 w-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
                  {EXPENSE_ICONS[e.key] ?? <MoreHorizontal className="h-4 w-4" strokeWidth={1.8} />}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-semibold">ر.س</span>
                  <input
                    value={e.amount}
                    onChange={(ev) => updateExpense(e.key, { amount: ev.target.value.replace(/[^\d]/g, "") })}
                    placeholder={e.key === "housing" ? "2,000" : e.key === "transport" ? "400" : e.key === "internet" ? "100" : "0"}
                    inputMode="numeric"
                    className="w-20 bg-transparent outline-none text-[13px] font-bold text-foreground placeholder:text-muted-foreground/50 placeholder:font-medium"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                  {e.editable ? (
                    <input
                      value={e.label}
                      onChange={(ev) => updateExpense(e.key, { label: ev.target.value })}
                      placeholder="اسم المصروف"
                      className="flex-1 bg-transparent outline-none text-right text-[12px] font-semibold text-foreground placeholder:text-muted-foreground/60"
                    />
                  ) : (
                    <span className="flex-1 text-right text-[12px] font-semibold text-foreground">{e.label}</span>
                  )}
                </div>
                {i >= 3 && (
                  <button
                    onClick={() => removeExpense(e.key)}
                    className="h-7 w-7 rounded-lg text-destructive/70 hover:bg-destructive/10 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addExpense}
              className="w-full rounded-2xl border border-dashed border-border py-2.5 text-[12px] font-bold text-muted-foreground flex items-center justify-center gap-1 hover:border-primary/40 hover:text-primary transition"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              إضافة مصروف آخر
            </button>
          </div>
        </Section>

        <button
          onClick={next}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-[14px] tracking-tight active:scale-[0.99] transition"
        >
          التالي
          <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
      <button
        onClick={onBack}
        className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
      >
        <ChevronRight className="h-5 w-5 text-foreground" strokeWidth={2} />
      </button>
      <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">{title}</h1>
      <div className="w-11" />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
      <h3 className="text-right text-[14px] font-extrabold text-foreground tracking-tight mb-3">{title}</h3>
      {children}
    </div>
  );
}
