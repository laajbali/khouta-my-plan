import { useState, type ReactNode } from "react";
import {
  ChevronRight,
  ArrowLeftRight,
  Receipt,
  QrCode,
  Building2,
  Zap,
  Wifi,
  Phone,
  Car,
  GraduationCap,
  Shield,
  CreditCard,
  Plus,
  Target,
  Plane,
  Home as HomeIcon,
  Heart,
  ShoppingBag,
  ArrowDownLeft,
  Camera,
  Check,
  Calendar as CalIcon,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useGoals, type Goal } from "@/hooks/use-khouta-data";

/* ---------- Shared Chrome ---------- */

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-card px-5 pt-4 pb-3 flex items-center justify-between border-b border-border shrink-0">
      <button
        onClick={onBack}
        className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center"
        aria-label="رجوع"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <div className="w-10" />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted-foreground mb-1.5 text-right">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-12 rounded-2xl bg-secondary border border-transparent focus:border-primary/40 focus:bg-card outline-none px-4 text-sm text-right transition";

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.99] transition"
    >
      {children}
    </button>
  );
}

/* ---------- Transfer ---------- */

export function TransferScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const recent = [
    { name: "خالد فهد", iban: "SA •••• 4421" },
    { name: "منى العتيبي", iban: "SA •••• 8801" },
    { name: "أحمد ناصر", iban: "SA •••• 1163" },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("الرجاء إدخال الاسم والمبلغ");
      return;
    }
    toast.success(`تم إرسال ${amount} ر.س إلى ${name}`);
    setTimeout(onBack, 600);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="تحويل مالي" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 text-right">
            المستفيدون الأخيرون
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1" dir="rtl">
            {recent.map((r) => (
              <button
                key={r.iban}
                onClick={() => {
                  setName(r.name);
                  setIban(r.iban);
                }}
                className="shrink-0 flex flex-col items-center gap-1.5 w-16"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {r.name[0]}
                </div>
                <span className="text-[10px] text-foreground truncate w-full text-center">
                  {r.name.split(" ")[0]}
                </span>
              </button>
            ))}
            <button className="shrink-0 flex flex-col items-center gap-1.5 w-16">
              <div className="h-14 w-14 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">جديد</span>
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="اسم المستفيد">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: خالد فهد"
            />
          </Field>
          <Field label="رقم الآيبان">
            <input
              className={inputCls}
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="SA00 0000 0000 0000"
              dir="ltr"
            />
          </Field>
          <Field label="المبلغ (ر.س)">
            <input
              className={inputCls}
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              placeholder="0.00"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </Field>
          <Field label="ملاحظة (اختياري)">
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="سبب التحويل"
            />
          </Field>
          <PrimaryButton type="submit">تحويل الآن</PrimaryButton>
        </form>
      </div>
    </div>
  );
}

/* ---------- Pay Bills ---------- */

const BILLS = [
  { id: "elec", label: "كهرباء", icon: Zap, tint: "bg-amber-50 text-amber-700", amount: 182 },
  { id: "water", label: "مياه", icon: Wifi, tint: "bg-blue-50 text-blue-700", amount: 64 },
  { id: "stc", label: "STC جوال", icon: Phone, tint: "bg-purple-50 text-purple-700", amount: 129 },
  { id: "net", label: "إنترنت", icon: Wifi, tint: "bg-blue-50 text-blue-700", amount: 249 },
  { id: "traffic", label: "مخالفات المرور", icon: Car, tint: "bg-rose-50 text-rose-700", amount: 300 },
  { id: "tuition", label: "رسوم دراسية", icon: GraduationCap, tint: "bg-indigo-50 text-indigo-700", amount: 1500 },
];

export function PayBillsScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const bill = BILLS.find((b) => b.id === selected);

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="سداد الفواتير" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-xs text-muted-foreground text-right">اختاري نوع الفاتورة</p>
        <div className="grid grid-cols-2 gap-3">
          {BILLS.map((b) => {
            const Icon = b.icon;
            const active = selected === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`rounded-2xl p-4 text-right border transition ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${b.tint} mb-3`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-bold text-foreground">{b.label}</p>
                <p
                  className="text-[11px] text-muted-foreground mt-0.5"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  المستحق: {b.amount} ر.س
                </p>
              </button>
            );
          })}
        </div>

        {bill && (
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span
                className="text-lg font-bold text-foreground"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {bill.amount} ر.س
              </span>
              <span className="text-sm font-semibold text-foreground">{bill.label}</span>
            </div>
            <PrimaryButton
              onClick={() => {
                toast.success(`تم سداد فاتورة ${bill.label} بمبلغ ${bill.amount} ر.س`);
                setTimeout(onBack, 600);
              }}
            >
              تأكيد السداد
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- QR Pay ---------- */

export function QrPayScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="الدفع بالباركود" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="relative w-56 h-56 rounded-3xl border-2 border-primary/40 bg-secondary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-2xl" />
          <QrCode className="h-20 w-20 text-primary/70" strokeWidth={1.2} />
          <div className="absolute inset-x-6 h-0.5 bg-primary shadow-[0_0_12px_hsl(var(--primary))] animate-pulse" />
        </div>
        <p className="text-sm text-center text-muted-foreground max-w-xs leading-relaxed">
          وجّهي الكاميرا نحو رمز QR الخاص بالمتجر ليتم إتمام العملية
        </p>
        <div className="w-full max-w-xs space-y-2">
          <PrimaryButton
            onClick={() => {
              toast.success("تم قراءة الرمز — بانتظار التأكيد");
              setTimeout(onBack, 700);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4" /> فتح الكاميرا
            </span>
          </PrimaryButton>
          <button
            onClick={onBack}
            className="w-full text-xs font-semibold text-muted-foreground py-2"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- More Services Grid ---------- */

const MORE = [
  { icon: ArrowLeftRight, label: "تحويل دولي", tint: "bg-mint/15 text-primary" },
  { icon: CreditCard, label: "بطاقاتي", tint: "bg-blue-50 text-blue-700" },
  { icon: Shield, label: "تأمين", tint: "bg-purple-50 text-purple-700" },
  { icon: Target, label: "استثمار", tint: "bg-amber-50 text-amber-700" },
  { icon: Building2, label: "قروض", tint: "bg-rose-50 text-rose-700" },
  { icon: Plane, label: "سفر وحجز", tint: "bg-indigo-50 text-indigo-700" },
  { icon: HomeIcon, label: "عقارات", tint: "bg-teal-50 text-teal-700" },
  { icon: Heart, label: "تبرعات", tint: "bg-pink-50 text-pink-700" },
];

export function MoreServicesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="جميع الخدمات" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-3">
          {MORE.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => toast(`${s.label} — قريباً`)}
                className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-2 active:scale-95 transition"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${s.tint}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Statement ---------- */

const TXNS = [
  { icon: ShoppingBag, title: "سوبر ماركت لولو", time: "اليوم، 09:24 ص", amount: -124.5, tint: "bg-secondary text-muted-foreground" },
  { icon: ArrowDownLeft, title: "تحويل من خالد فهد", time: "أمس، 02:15 م", amount: 500, tint: "bg-mint/15 text-primary" },
  { icon: Receipt, title: "فاتورة الكهرباء", time: "أمس، 10:02 ص", amount: -182, tint: "bg-blue-50 text-blue-700" },
  { icon: ShoppingBag, title: "نون - طلبية", time: "قبل يومين", amount: -238.9, tint: "bg-amber-50 text-amber-700" },
  { icon: Receipt, title: "STC — فاتورة جوال", time: "قبل 3 أيام", amount: -129, tint: "bg-purple-50 text-purple-700" },
  { icon: ArrowDownLeft, title: "راتب — شركة أبعاد", time: "1 يوليو", amount: 9000, tint: "bg-mint/15 text-primary" },
];

export function StatementScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const list = TXNS.filter((t) =>
    filter === "all" ? true : filter === "in" ? t.amount > 0 : t.amount < 0,
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="كشف الحساب" onBack={onBack} />
      <div className="px-5 py-3 flex gap-2 shrink-0 bg-card border-b border-border">
        {[
          { k: "all", l: "الكل" },
          { k: "in", l: "الواردة" },
          { k: "out", l: "الصادرة" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k as typeof filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              filter === f.k
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {list.map((t, i) => {
            const Icon = t.icon;
            const positive = t.amount > 0;
            return (
              <button
                key={i}
                onClick={() => toast(t.title, { description: t.time })}
                className="w-full flex justify-between items-center p-3.5 text-right hover:bg-secondary/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.tint}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.7} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">{t.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.time}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${positive ? "text-mint" : "text-foreground"}`}
                  dir="ltr"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {positive ? "+" : ""}
                  {t.amount.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Goal Detail + Deposit ---------- */

const ICON_MAP: Record<string, typeof Car> = {
  car: Car,
  travel: Plane,
  home: HomeIcon,
  edu: GraduationCap,
  wedding: Heart,
  custom: Target,
};

function iconFor(key: string | null) {
  return ICON_MAP[key ?? "custom"] ?? Target;
}

export function GoalDetailScreen({ onBack }: { onBack: () => void }) {
  const { goals, loading, refresh } = useGoals();
  const goal: Goal | undefined = goals[0];
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <ScreenHeader title="تفاصيل الهدف" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex flex-col h-full bg-background">
        <ScreenHeader title="تفاصيل الهدف" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground">لا يوجد هدف حالياً</p>
          <p className="text-xs text-muted-foreground">ابدئي بإنشاء هدف جديد من الشاشة الرئيسية</p>
        </div>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100),
  );
  const Icon = iconFor(goal.icon);

  async function deposit() {
    const n = Number(amount);
    if (!n || n <= 0) {
      toast.error("أدخلي مبلغاً صحيحاً");
      return;
    }
    if (!goal) return;
    setSaving(true);
    const newAmount = Math.min(Number(goal.target_amount), Number(goal.saved_amount) + n);
    const { error } = await supabase
      .from("savings_goals")
      .update({ saved_amount: newAmount })
      .eq("id", goal.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setAmount("");
    toast.success(`تم إيداع ${n} ر.س في ${goal.title}`);
    refresh();
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="تفاصيل الهدف" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div
          className="rounded-3xl p-5 text-primary-foreground relative overflow-hidden"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.32 0.06 155) 0%, oklch(0.20 0.05 155) 100%)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-white/70 text-xs">هدفك</p>
              <h3 className="font-bold text-lg">{goal.title}</h3>
            </div>
          </div>
          <div className="flex justify-between items-end mb-2" style={{ fontVariantNumeric: "tabular-nums" }}>
            <span className="text-xs text-white/60">
              من {Number(goal.target_amount).toLocaleString()} ر.س
            </span>
            <span className="text-2xl font-bold">
              {Number(goal.saved_amount).toLocaleString()}{" "}
              <span className="text-sm text-white/70">ر.س</span>
            </span>
          </div>
          <div className="h-2 bg-white/15 rounded-full overflow-hidden" dir="ltr">
            <div
              className="h-full bg-mint rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/70 text-right">أنجزتِ {percent}% من الهدف</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <p className="text-sm font-bold text-foreground text-right">إيداع سريع</p>
          <div className="flex gap-2">
            {[100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="flex-1 py-2 rounded-xl bg-secondary text-xs font-bold text-foreground hover:bg-primary/10 transition"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {v}
              </button>
            ))}
          </div>
          <input
            className={inputCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
            placeholder="أدخلي المبلغ"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
          <PrimaryButton onClick={deposit} disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "إيداع في الهدف"}
          </PrimaryButton>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <p className="text-sm font-bold text-foreground text-right">نصائح نور</p>
          <div className="flex items-start gap-3 text-right">
            <Check className="h-4 w-4 text-mint mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              لو ادّخرتِ 1,000 ر.س شهرياً ستصلين للهدف خلال{" "}
              {Math.max(1, Math.ceil((Number(goal.target_amount) - Number(goal.saved_amount)) / 1000))}{" "}
              شهراً تقريباً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- New Goal ---------- */

const GOAL_TYPES = [
  { icon: Car, label: "سيارة", key: "car" },
  { icon: Plane, label: "سفر", key: "travel" },
  { icon: HomeIcon, label: "منزل", key: "home" },
  { icon: GraduationCap, label: "تعليم", key: "edu" },
  { icon: Heart, label: "زواج", key: "wedding" },
  { icon: Target, label: "مخصص", key: "custom" },
];

export function NewGoalScreen({ onBack }: { onBack: () => void }) {
  const { user } = useSession();
  const [typeKey, setTypeKey] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("سجّلي الدخول أولاً");
      return;
    }
    if (!typeKey || !name || !amount) {
      toast.error("الرجاء إكمال البيانات");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      title: name,
      icon: typeKey,
      target_amount: Number(amount),
      saved_amount: 0,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`تم إنشاء هدف "${name}"`);
    setTimeout(onBack, 500);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="هدف جديد" onBack={onBack} />
      <form onSubmit={save} className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 text-right">نوع الهدف</p>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_TYPES.map((g) => {
              const Icon = g.icon;
              const active = typeKey === g.key;
              return (
                <button
                  type="button"
                  key={g.key}
                  onClick={() => setTypeKey(g.key)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 border transition ${
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                  <span className="text-[11px] font-semibold">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <Field label="اسم الهدف">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: عمرة"
          />
        </Field>
        <Field label="المبلغ المستهدف (ر.س)">
          <input
            className={inputCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
            placeholder="0"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
        </Field>
        <Field label="عدد الأشهر">
          <input
            className={inputCls}
            value={months}
            onChange={(e) => setMonths(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="12"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
        </Field>
        {amount && months && (
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 text-right">
            <p className="text-xs text-muted-foreground">للوصول للهدف تحتاجين لادخار</p>
            <p
              className="text-lg font-bold text-primary mt-1"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {Math.ceil(Number(amount) / Number(months)).toLocaleString()} ر.س/شهر
            </p>
          </div>
        )}
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "حفظ الهدف"}
        </PrimaryButton>
      </form>
    </div>
  );
}

/* ---------- Financial Calendar (premium month grid) ---------- */

const CAL_EVENTS = [
  { day: 5, title: "عيد ميلاد أختي", subtitle: "الجمعة 5 يوليو", amount: -150, tone: "out" as const, icon: "🎂" },
  { day: 10, title: "نزول المكافأة", subtitle: "الأربعاء 10 يوليو", amount: 5000, tone: "in" as const, icon: "💰" },
  { day: 16, title: "تحويل الادخار", subtitle: "الثلاثاء 16 يوليو", amount: -1500, tone: "save" as const, icon: "🏦" },
  { day: 27, title: "مناسبة عائلية", subtitle: "السبت 27 يوليو", amount: -400, tone: "out" as const, icon: "🎉" },
];

const WEEK_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(10);
  const daysInMonth = 31;
  const startWeekday = 0; // Sunday
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const eventDays = new Map(CAL_EVENTS.map((e) => [e.day, e.tone]));
  const upcomingCount = CAL_EVENTS.length;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card px-5 pt-5 pb-4 flex items-center justify-between border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        <div className="text-center">
          <h2 className="text-[16px] font-extrabold text-foreground tracking-tight">التقويم المالي</h2>
          <p className="text-[10.5px] text-muted-foreground font-medium mt-0.5">خطّطي اليوم لمستقبل أفضل</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Upcoming banner */}
        <div className="rounded-[22px] bg-card border border-border p-4 flex items-center gap-3 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
            <CalIcon className="h-5 w-5" strokeWidth={1.8} />
            <span className="text-[9px] font-bold mt-0.5">يوليو</span>
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">مناسبات قادمة</p>
            <p className="text-[13px] font-extrabold text-foreground mt-0.5 tracking-tight">
              خطّطي لمناسباتك المالية
            </p>
            <p className="text-[10.5px] text-muted-foreground font-medium mt-0.5">
              أضيفي مناسباتك وستقوم خُطى بضبط خطتك تلقائياً
            </p>
          </div>
          <div className="text-center shrink-0">
            <p
              className="text-[28px] font-black text-primary leading-none"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {upcomingCount}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold mt-0.5">هذا الشهر</p>
          </div>
        </div>

        <button
          onClick={() => toast("قريباً: إضافة مناسبة جديدة")}
          className="w-full rounded-2xl bg-primary text-primary-foreground py-3 text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-[0.99] transition"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          إضافة مناسبة
        </button>

        {/* Month grid */}
        <div className="rounded-[22px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-foreground rotate-180" strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-extrabold text-foreground tracking-tight">يوليو 2026</span>
              <button className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                اليوم
              </button>
            </div>
            <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-foreground" strokeWidth={2.5} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2" dir="rtl">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-[9.5px] font-bold text-muted-foreground py-1">
                {d.slice(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1" dir="rtl">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const isSelected = day === selected;
              const isToday = day === 10;
              const dot = eventDays.get(day);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-[12px] font-bold transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isToday
                        ? "bg-mint/15 text-primary"
                        : "text-foreground hover:bg-secondary/60"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {day}
                  {dot && !isSelected && (
                    <span
                      className="absolute bottom-1 h-1 w-1 rounded-full"
                      style={{
                        background:
                          dot === "in" ? "var(--mint)" : dot === "save" ? "var(--primary)" : "var(--destructive)",
                      }}
                    />
                  )}
                  {dot && isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight banner */}
        <div className="rounded-[22px] p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, oklch(0.97 0.04 85), oklch(0.94 0.06 82))", border: "1px solid oklch(0.85 0.14 85 / 0.35)" }}>
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "oklch(0.85 0.14 85 / 0.3)" }}>
            <CalIcon className="h-5 w-5" strokeWidth={1.8} style={{ color: "oklch(0.45 0.15 85)" }} />
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-[12.5px] font-extrabold text-foreground tracking-tight">
              لديك مناسبة الأسبوع القادم!
            </p>
            <p className="text-[10.5px] text-muted-foreground font-medium mt-0.5">
              مناسبة عائلية يوم 27 يوليو
            </p>
          </div>
          <button
            onClick={() => toast("عرض الخطة المعدّلة")}
            className="text-[11px] font-extrabold bg-primary text-primary-foreground px-3 py-2 rounded-xl shrink-0 shadow-sm"
          >
            الخطة المعدّلة
          </button>
        </div>

        {/* Upcoming list */}
        <div className="rounded-[22px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <button className="text-[11px] font-bold text-primary">عرض الجميع</button>
            <h3 className="text-[13px] font-extrabold text-foreground tracking-tight">المناسبات القادمة</h3>
          </div>
          <div className="divide-y divide-border">
            {CAL_EVENTS.map((e, i) => (
              <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`text-[13px] font-black shrink-0 ${
                    e.tone === "in" ? "text-mint" : e.tone === "save" ? "text-primary" : "text-destructive"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {e.amount > 0 ? "+" : ""}
                  {e.amount.toLocaleString()}
                  <span className="text-[9px] font-bold mr-0.5">ر.س</span>
                </span>
                <div className="flex-1 text-right min-w-0">
                  <p className="text-[12.5px] font-extrabold text-foreground tracking-tight truncate">{e.title}</p>
                  <p className="text-[10.5px] text-muted-foreground font-medium">{e.subtitle}</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-lg shrink-0">
                  {e.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

