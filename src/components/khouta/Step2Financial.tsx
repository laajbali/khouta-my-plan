import { useState } from "react";
import { ChevronLeft, Star, Plus, CreditCard, Home, Car, BarChart3, MoreHorizontal } from "lucide-react";
import { Stepper } from "./Stepper";
import { ChoiceCard } from "./ChoiceCard";

const INCOME_SOURCES = [
  { key: "salary", label: "راتب شهري", icon: "💼" },
  { key: "bonus", label: "مكافأة", icon: "🎁" },
  { key: "freelance", label: "عمل حر", icon: "💻" },
  { key: "other", label: "أخرى", icon: "•••" },
];

const VARIABLE = [
  { key: "restaurants", label: "المطاعم", icon: "🍽️", amount: 800 },
  { key: "shopping", label: "التسوق", icon: "🛍️", amount: 600 },
  { key: "entertainment", label: "الترفيه", icon: "🎮", amount: 400 },
  { key: "other", label: "أخرى", icon: "•••", amount: 300 },
];

export function Step2Financial({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [income, setIncome] = useState("bonus");
  const [variable, setVariable] = useState("restaurants");

  return (
    <div className="bg-card">
      <Header title="البيانات المالية" onBack={onBack} />
      <div className="px-5 py-4">
        <Stepper current={2} />
      </div>

      <div className="px-5 pb-8 space-y-5">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <h2 className="text-lg font-black text-foreground">ساعدنا نفهم وضعك المالي</h2>
            <Star className="h-5 w-5 text-gold fill-gold" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            كلما كانت بياناتك أدق، كانت خطتك أفضل
          </p>
        </div>

        {/* 1. مصدر دخلك */}
        <Section title="١. مصدر دخلك">
          <div className="grid grid-cols-4 gap-2">
            {INCOME_SOURCES.map((s) => (
              <ChoiceCard
                key={s.key}
                active={income === s.key}
                onClick={() => setIncome(s.key)}
                icon={<span>{s.icon}</span>}
                label={s.label}
              />
            ))}
          </div>
          <div>
            <p className="text-right text-xs text-muted-foreground mt-3 mb-1.5">
              الدخل الشهري (ريال)
            </p>
            <AmountField defaultValue="9000" icon={<CreditCard className="h-4 w-4" />} />
          </div>
        </Section>

        {/* 2. المصاريف الثابتة */}
        <Section title="٢. المصاريف الثابتة (شهرياً)">
          <p className="text-right text-xs text-muted-foreground -mt-2 mb-2">
            أدخل مبالغ المصاريف الشهرية الثابتة
          </p>
          <ExpenseRow label="السكن" icon="🏠" defaultValue="0" />
          <ExpenseRow label="المواصلات" icon="🚗" defaultValue="200" />
          <ExpenseRow label="الإنترنت" icon="📊" defaultValue="100" />
          <ExpenseRow label="أخرى" icon="•••" defaultValue="0" />
          <button className="w-full rounded-2xl border-2 border-dashed border-primary/40 text-primary font-bold py-3 flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> إضافة مصروف آخر
          </button>
        </Section>

        {/* 3. المصاريف المتغيرة */}
        <Section title="٣. المصاريف المتغيرة">
          <div className="grid grid-cols-4 gap-2">
            {VARIABLE.map((v) => (
              <ChoiceCard
                key={v.key}
                active={variable === v.key}
                onClick={() => setVariable(v.key)}
                icon={<span>{v.icon}</span>}
                label={v.label}
                extra={
                  <span className="text-xs font-bold text-foreground mt-1">
                    {v.amount} <span className="text-muted-foreground font-normal">ريال</span>
                  </span>
                }
              />
            ))}
          </div>
        </Section>

        {/* 4. هدف الادخار */}
        <Section title="٤. هدف الادخار">
          <div>
            <p className="text-right text-xs text-muted-foreground mb-1.5">
              مبلغ الادخار الحالي (اختياري)
            </p>
            <AmountField defaultValue="0" />
          </div>
          <div>
            <p className="text-right text-xs text-muted-foreground mb-1.5">
              المبلغ الذي ترغب بالوصول له
            </p>
            <AmountField defaultValue="50,000" />
          </div>
        </Section>

        <button
          onClick={onNext}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 shadow-lg shadow-primary/20"
        >
          التالي
        </button>
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          🛡️ بياناتك آمنة ولن يتم مشاركتها
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 space-y-3 shadow-sm">
      <h3 className="text-right text-base font-black text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function ExpenseRow({ label, icon, defaultValue }: { label: string; icon: string; defaultValue: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-4 py-3">
      <span className="text-xs text-muted-foreground">ريال</span>
      <input
        defaultValue={defaultValue}
        className="w-16 bg-transparent outline-none text-sm font-bold text-foreground"
      />
      <div className="flex-1 flex items-center justify-end gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
    </div>
  );
}

function AmountField({ defaultValue, icon }: { defaultValue: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5">
      <span className="text-xs text-muted-foreground">ريال</span>
      <input
        defaultValue={defaultValue}
        className="flex-1 bg-transparent outline-none text-lg font-bold text-foreground"
      />
      <span className="text-muted-foreground">{icon}</span>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <button
        onClick={onBack}
        className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5 text-primary" />
      </button>
      <h1 className="text-xl font-black text-foreground">{title}</h1>
      <div className="w-10" />
    </div>
  );
}
