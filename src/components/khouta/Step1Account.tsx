import {
  ChevronRight,
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Briefcase,
  GraduationCap,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { Stepper } from "./Stepper";
import { ChoiceCard } from "./ChoiceCard";
import { useOnboarding } from "./onboarding-context";

const CATEGORIES = [
  { key: "student", label: "طالب", icon: <GraduationCap className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "employee", label: "موظف", icon: <Briefcase className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "owner", label: "صاحب عمل", icon: <Building2 className="h-5 w-5" strokeWidth={1.8} /> },
  { key: "other", label: "أخرى", icon: <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} /> },
];

export function Step1Account({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useOnboarding();

  function next() {
    if (!data.fullName || !data.email || !data.password) return;
    onNext();
  }

  return (
    <div className="bg-background pb-6">
      <Header title="البيانات الأساسية" onBack={onBack} />
      <div className="px-5 pt-3 pb-4 bg-card">
        <Stepper current={1} />
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="text-right">
          <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">لنبدأ رحلتك المالية</h2>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">أدخلي بياناتك الأساسية للبدء</p>
        </div>

        <Field label="الاسم الكامل" icon={<User className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            value={data.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            placeholder="مثال: سارة محمد"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <Field label="رقم الجوال" icon={<Phone className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="05XXXXXXXX"
            dir="ltr"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
        </Field>

        <Field label="المدينة" icon={<MapPin className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
            placeholder="الرياض"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <Field label="البريد الإلكتروني" icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@example.com"
            dir="ltr"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <Field label="كلمة المرور" icon={<Lock className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            type="password"
            value={data.password}
            onChange={(e) => update({ password: e.target.value })}
            placeholder="6 أحرف على الأقل"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <div className="pt-1">
          <p className="text-right text-[12px] font-bold text-foreground mb-2 tracking-tight">من أنت؟</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <ChoiceCard
                key={c.key}
                active={data.userType === c.key}
                onClick={() => update({ userType: c.key })}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 mt-2 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-[14px] tracking-tight active:scale-[0.99] transition"
        >
          التالي
          <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2.5} />
        </button>
        <p className="text-center text-[10px] text-muted-foreground font-medium">
          بياناتك محمية بتشفير كامل ولن تتم مشاركتها
        </p>
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

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-right text-[11px] font-semibold text-foreground/80 mb-1.5 tracking-tight">{label}</p>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary/50 transition">
        {children}
        <span className="text-muted-foreground shrink-0">{icon}</span>
      </div>
    </div>
  );
}
