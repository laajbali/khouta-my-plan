import { useState } from "react";
import { ChevronLeft, User, Phone, MapPin, ChevronDown, Star, Briefcase, GraduationCap, Monitor, MoreHorizontal } from "lucide-react";
import { Stepper } from "./Stepper";
import { ChoiceCard } from "./ChoiceCard";

const CATEGORIES = [
  { key: "student", label: "طالب", icon: <GraduationCap className="h-6 w-6 text-primary" /> },
  { key: "employee", label: "موظف", icon: <Briefcase className="h-6 w-6 text-primary" /> },
  { key: "owner", label: "صاحب عمل", icon: <Monitor className="h-6 w-6 text-primary" /> },
  { key: "other", label: "أخرى", icon: <MoreHorizontal className="h-6 w-6 text-primary" /> },
];

export function Step1Account({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [category, setCategory] = useState("student");

  return (
    <div className="bg-card">
      <Header title="إنشاء الحساب" onBack={onBack} />
      <div className="px-5 py-4">
        <Stepper current={1} />
      </div>

      <div className="px-5 pb-8">
        <div className="flex justify-center mt-4 mb-2 relative">
          <Star className="absolute top-2 right-24 h-4 w-4 text-gold fill-gold" />
          <Star className="absolute top-6 left-24 h-4 w-4 text-gold fill-gold" />
          <div className="h-24 w-24 rounded-full bg-accent/60 flex items-center justify-center border-4 border-card shadow relative">
            <User className="h-10 w-10 text-primary" />
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
              +
            </div>
          </div>
        </div>

        <div className="text-right mt-6">
          <div className="flex items-center gap-2 justify-end">
            <h2 className="text-xl font-black text-foreground">لنبدأ رحلتك المالية</h2>
            <Star className="h-5 w-5 text-gold fill-gold" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">أدخل بياناتك الأساسية للبدء</p>
        </div>

        <div className="space-y-4 mt-5">
          <Labeled label="الاسم الكامل">
            <TextField icon={<User className="h-4 w-4" />} placeholder="مثال: سارة محمد" />
          </Labeled>
          <Labeled label="رقم الجوال">
            <TextField icon={<Phone className="h-4 w-4" />} placeholder="05XXXXXXXX" />
          </Labeled>
          <Labeled label="المدينة">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-right text-sm text-muted-foreground">اختر مدينتك</span>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
          </Labeled>

          <div>
            <p className="text-right text-sm font-bold text-foreground mb-2">من أنت؟</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <ChoiceCard
                  key={c.key}
                  active={category === c.key}
                  onClick={() => setCategory(c.key)}
                  icon={c.icon}
                  label={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 mt-6 shadow-lg shadow-primary/20"
        >
          التالي
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
          🛡️ بياناتك آمنة ولن يتم مشاركتها مع أي طرف ثالث
        </p>
      </div>
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

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-right text-sm font-bold text-foreground mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function TextField({ icon, placeholder }: { icon: React.ReactNode; placeholder: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 focus-within:border-primary">
      <input
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground text-right"
      />
      <span className="text-muted-foreground">{icon}</span>
    </div>
  );
}
