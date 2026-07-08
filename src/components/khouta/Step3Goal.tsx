import { useState } from "react";
import { ChevronLeft, Star, Target } from "lucide-react";
import { Stepper } from "./Stepper";
import { ChoiceCard } from "./ChoiceCard";

const GOALS = [
  { key: "car", label: "شراء سيارة", icon: "🚗", suggested: 80000 },
  { key: "laptop", label: "لابتوب", icon: "💻", suggested: 6000 },
  { key: "travel", label: "سفر", icon: "✈️", suggested: 15000 },
  { key: "wedding", label: "زواج", icon: "💍", suggested: 100000 },
  { key: "education", label: "تعليم", icon: "📚", suggested: 30000 },
  { key: "home", label: "منزل", icon: "🏠", suggested: 500000 },
  { key: "emergency", label: "طوارئ", icon: "🏛️", suggested: 20000 },
  { key: "custom", label: "هدف مخصص", icon: "✨", suggested: 10000 },
];

const DURATIONS = [
  { key: "3m", label: "3 أشهر", months: 3 },
  { key: "6m", label: "6 أشهر", months: 6 },
  { key: "1y", label: "سنة", months: 12 },
  { key: "2y", label: "سنتين", months: 24 },
  { key: "3y", label: "+3 سنوات", months: 36 },
];

export function Step3Goal({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [goal, setGoal] = useState("car");
  const [duration, setDuration] = useState("6m");
  const g = GOALS.find((x) => x.key === goal)!;
  const d = DURATIONS.find((x) => x.key === duration)!;
  const monthly = Math.round(g.suggested / d.months);

  return (
    <div className="bg-card">
      <Header title="حدد هدفك" onBack={onBack} />
      <div className="px-5 py-4">
        <Stepper current={3} />
      </div>

      <div className="px-5 pb-8 space-y-5">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <h2 className="text-lg font-black text-foreground">ما هو هدفك المالي؟</h2>
            <Star className="h-5 w-5 text-gold fill-gold" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            حدد هدفك وسنبني لك خطة ادخار مخصصة
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {GOALS.map((x) => (
            <ChoiceCard
              key={x.key}
              active={goal === x.key}
              onClick={() => setGoal(x.key)}
              icon={<span className="text-2xl">{x.icon}</span>}
              label={x.label}
            />
          ))}
        </div>

        {/* Goal summary card */}
        <div
          className="rounded-3xl p-5 text-primary-foreground shadow-xl"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.28 0.05 155), oklch(0.18 0.04 155))",
          }}
        >
          <div className="flex justify-center text-4xl mb-2">{g.icon}</div>
          <p className="text-center text-xs opacity-70">هدفك المختار</p>
          <p className="text-center text-2xl font-black mt-1">{g.label}</p>
          <div className="border-t border-white/15 mt-4 pt-4 grid grid-cols-2 divide-x divide-white/15 divide-x-reverse">
            <div className="text-center px-2">
              <p className="text-[11px] opacity-70">المبلغ المقترح</p>
              <p className="font-black mt-1 text-gold">
                {g.suggested.toLocaleString()} <span className="text-xs">ريال</span>
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[11px] opacity-70">التوفير الشهري</p>
              <p className="font-black mt-1 text-mint">
                {monthly.toLocaleString()} <span className="text-xs">ريال</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-right text-sm font-bold text-foreground mb-1.5">اسم الهدف</p>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5">
            <input
              defaultValue={g.label}
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-foreground text-right"
            />
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <p className="text-right text-sm font-bold text-foreground mb-1.5">المبلغ المستهدف</p>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5">
            <span className="text-xs text-muted-foreground">ريال</span>
            <input
              defaultValue={g.suggested.toLocaleString()}
              className="flex-1 bg-transparent outline-none text-lg font-bold text-foreground"
            />
            <span className="text-muted-foreground text-lg">$</span>
          </div>
        </div>

        <div>
          <p className="text-right text-sm font-bold text-foreground mb-2">المدة الزمنية</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {DURATIONS.map((x) => (
              <button
                key={x.key}
                onClick={() => setDuration(x.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold border-2 transition ${
                  duration === x.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 shadow-lg shadow-primary/20"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <button onClick={onBack} className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
        <ChevronLeft className="h-5 w-5 text-primary" />
      </button>
      <h1 className="text-xl font-black text-foreground">{title}</h1>
      <div className="w-10" />
    </div>
  );
}
