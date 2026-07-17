import { useState, useEffect, useRef, type ReactNode } from "react";
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
  Sparkles,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useGoals, useProfile, type Goal } from "@/hooks/use-khouta-data";
import { useSavingsPlan, type SavingsPlan } from "@/hooks/use-savings-plan";
import { useBudget, type CalEvent } from "./budget-context";

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
      <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">{title}</h2>
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
      <span className="block text-[11px] font-medium text-muted-foreground mb-1.5 text-right">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-12 rounded-2xl bg-secondary border border-transparent focus:border-primary/40 focus:bg-card outline-none px-4 text-[13px] font-medium text-right transition";

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
      className="w-full h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-[13px] shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.99] transition"
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
  { id: "elec", label: "كهرباء", icon: Zap, tint: "bg-primary/10 text-primary", amount: 182 },
  { id: "water", label: "مياه", icon: Wifi, tint: "bg-primary/10 text-primary", amount: 64 },
  { id: "stc", label: "STC جوال", icon: Phone, tint: "bg-primary/10 text-primary", amount: 129 },
  { id: "net", label: "إنترنت", icon: Wifi, tint: "bg-primary/10 text-primary", amount: 249 },
  { id: "traffic", label: "مخالفات المرور", icon: Car, tint: "bg-primary/10 text-primary", amount: 300 },
  { id: "tuition", label: "رسوم دراسية", icon: GraduationCap, tint: "bg-primary/10 text-primary", amount: 1500 },
];

export function PayBillsScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const bill = BILLS.find((b) => b.id === selected);

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="سداد الفواتير" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-xs text-muted-foreground text-right">اختر نوع الفاتورة</p>
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
  { icon: ArrowLeftRight, label: "تحويل دولي", tint: "bg-primary/10 text-primary" },
  { icon: CreditCard, label: "بطاقاتي", tint: "bg-primary/10 text-primary" },
  { icon: Shield, label: "تأمين", tint: "bg-primary/10 text-primary" },
  { icon: Target, label: "استثمار", tint: "bg-primary/10 text-primary" },
  { icon: Building2, label: "قروض", tint: "bg-primary/10 text-primary" },
  { icon: Plane, label: "سفر وحجز", tint: "bg-primary/10 text-primary" },
  { icon: HomeIcon, label: "عقارات", tint: "bg-primary/10 text-primary" },
  { icon: Heart, label: "تبرعات", tint: "bg-primary/10 text-primary" },
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
  { icon: ArrowDownLeft, title: "تحويل من خالد فهد", time: "أمس، 02:15 م", amount: 500, tint: "bg-primary/10 text-primary" },
  { icon: Receipt, title: "فاتورة الكهرباء", time: "أمس، 10:02 ص", amount: -182, tint: "bg-primary/10 text-primary" },
  { icon: ShoppingBag, title: "نون - طلبية", time: "قبل يومين", amount: -238.9, tint: "bg-primary/10 text-primary" },
  { icon: Receipt, title: "STC — فاتورة جوال", time: "قبل 3 أيام", amount: -129, tint: "bg-primary/10 text-primary" },
  { icon: ArrowDownLeft, title: "راتب — شركة أبعاد", time: "1 يوليو", amount: 9000, tint: "bg-primary/10 text-primary" },
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
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

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
          <p className="text-[13px] font-extrabold text-foreground tracking-tight">لا يوجد هدف حالياً</p>
          <p className="text-[11px] text-muted-foreground font-medium">ابدأ بإنشاء هدف جديد من الشاشة الرئيسية</p>
        </div>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100),
  );
  const Icon = iconFor(goal.icon);

  function startEdit() {
    if (!goal) return;
    setEditTitle(goal.title);
    setEditTarget(String(goal.target_amount));
    setEditing(true);
  }

  async function saveEdit() {
    if (!goal) return;
    const nextTitle = editTitle.trim();
    const nextTarget = Number(editTarget);
    if (!nextTitle) return toast.error("اكتب اسم الهدف");
    if (!nextTarget || nextTarget <= 0) return toast.error("أدخل مبلغاً صحيحاً");
    setSavingEdit(true);
    const { error } = await supabase
      .from("savings_goals")
      .update({ title: nextTitle, target_amount: nextTarget })
      .eq("id", goal.id);
    setSavingEdit(false);
    if (error) return toast.error(error.message);
    toast.success("تم تحديث الهدف");
    setEditing(false);
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
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-[11px] font-medium">هدفك</p>
              {editing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 mt-1 text-white text-[14px] font-bold outline-none"
                  placeholder="اسم الهدف"
                />
              ) : (
                <h3 className="font-extrabold text-[17px] tracking-tight truncate">{goal.title}</h3>
              )}
            </div>
            <button
              onClick={editing ? saveEdit : startEdit}
              disabled={savingEdit}
              className="h-9 px-3 rounded-xl bg-mint text-primary text-[11px] font-extrabold active:scale-95 transition disabled:opacity-60"
            >
              {editing ? (savingEdit ? "..." : "حفظ") : "تعديل"}
            </button>
          </div>
          <div className="flex justify-between items-end mb-2" style={{ fontVariantNumeric: "tabular-nums" }}>
            {editing ? (
              <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl px-2 py-1">
                <input
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  className="w-24 bg-transparent text-white text-[13px] font-bold outline-none text-right"
                />
                <span className="text-[11px] text-white/70 font-medium">ر.س</span>
              </div>
            ) : (
              <span className="text-[11px] text-white/60 font-medium">
                من {Number(goal.target_amount).toLocaleString()} ر.س
              </span>
            )}
            <span className="text-[22px] font-bold tracking-tight">
              {Number(goal.saved_amount).toLocaleString()}
              <span className="text-[10px] text-white/70 font-medium mr-1">ر.س</span>
            </span>
          </div>
          <div className="h-2 bg-white/15 rounded-full overflow-hidden" dir="ltr">
            <div
              className="h-full bg-mint rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/70 text-right font-medium">أنجزت {percent}% من الهدف</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <p className="text-[14px] font-extrabold text-foreground text-right tracking-tight">نصائح نور</p>
          <div className="flex items-start gap-3 text-right">
            <Check className="h-4 w-4 text-mint mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              لو ادّخرت 1,000 ر.س شهرياً ستصل للهدف خلال{" "}
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
  const { upsertGoal, refreshGoals } = useBudget();
  const [typeKey, setTypeKey] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("سجّل الدخول أولاً");
      return;
    }
    if (!typeKey || !amount) {
      toast.error("الرجاء إكمال البيانات");
      return;
    }
    const preset = GOAL_TYPES.find((g) => g.key === typeKey);
    const finalName =
      typeKey === "custom" ? name.trim() : (preset?.label ?? name.trim());
    if (typeKey === "custom" && !finalName) {
      toast.error("الرجاء كتابة اسم الهدف");
      return;
    }
    const targetAmount = Number(amount) || 0;
    const goalMonths = Math.max(1, Number(months) || 6);
    const deadline = new Date(Date.now() + goalMonths * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    setSaving(true);
    const { data: inserted, error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      title: finalName,
      icon: typeKey,
      target_amount: targetAmount,
      saved_amount: 0,
      deadline,
    }).select("id, target_amount, saved_amount, deadline").maybeSingle();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (inserted) {
      upsertGoal({
        id: inserted.id,
        target_amount: Number(inserted.target_amount) || targetAmount,
        saved_amount: Number(inserted.saved_amount) || 0,
        deadline: inserted.deadline,
      });
    }
    await refreshGoals();
    toast.success(`تم إنشاء هدف "${finalName}"`);
    setTimeout(onBack, 500);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="هدف جديد" onBack={onBack} />
      <form onSubmit={save} className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground mb-2 text-right">نوع الهدف</p>
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
                  <span className="text-[11px] font-medium">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {typeKey === "custom" && (
          <Field label="اسم الهدف">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عمرة"
            />
          </Field>
        )}
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
            <p className="text-[11px] text-muted-foreground font-medium">للوصول للهدف تحتاجين لادخار</p>
            <p
              className="text-[22px] font-bold text-primary mt-1 tracking-tight"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {Math.ceil(Number(amount) / Number(months)).toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">ر.س/شهر</p>
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

// CalEvent type is imported from budget-context

const WEEK_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const EVENT_KINDS = [
  { key: "birthday", label: "عيد ميلاد", icon: "" },
  { key: "wedding", label: "زواج", icon: "" },
  { key: "travel", label: "سفر", icon: "" },
  { key: "eid", label: "عيد", icon: "" },
  { key: "study", label: "دراسة", icon: "" },
  { key: "other", label: "أخرى", icon: "" },
];

export function CalendarScreen({ onBack }: { onBack: () => void }) {
  const { events, addEvent, updateEvent, removeEventById } = useBudget();
  const [selected, setSelected] = useState(10);
  const [screen, setScreen] = useState<"main" | "add" | "loading" | "ai-done">("main");
  const [lastAdded, setLastAdded] = useState<CalEvent | null>(null);
  const [editing, setEditing] = useState<CalEvent | null>(null);

  function openAdd() {
    setEditing(null);
    setScreen("add");
  }
  function openEdit(e: CalEvent) {
    setEditing(e);
    setScreen("add");
  }

  if (screen === "add") {
    return (
      <AddEventScreen
        initial={editing}
        onBack={() => setScreen("main")}
        onSave={(e) => {
          if (editing) {
            updateEvent(editing.id, e);
          } else {
            addEvent(e);
            setLastAdded(e);
          }
          setScreen("loading");
          setTimeout(() => setScreen(editing ? "main" : "ai-done"), 1400);
        }}
        onDelete={
          editing
            ? () => {
                removeEventById(editing.id);
                setEditing(null);
                setScreen("main");
              }
            : undefined
        }
      />
    );
  }

  const daysInMonth = 31;
  const startWeekday = 0;
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const eventDays = new Map(events.map((e) => [e.day, e.tone]));
  const upcomingCount = events.length;

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="bg-card px-5 pt-5 pb-4 flex items-center justify-between border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        <div className="text-center">
          <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">التقويم المالي</h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">خطّطي اليوم لمستقبل أفضل</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* AI premium gold banner */}
        <div className="rounded-[22px] p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, oklch(0.97 0.04 85), oklch(0.94 0.06 82))", border: "1px solid oklch(0.85 0.14 85 / 0.35)" }}>
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "oklch(0.85 0.14 85 / 0.3)" }}>
            <CalIcon className="h-5 w-5" strokeWidth={2} style={{ color: "oklch(0.45 0.15 85)" }} />
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-[14px] font-extrabold text-foreground tracking-tight">
              لديك مناسبة بعد 5 أيام
            </p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              تم تعديل خطة الادخار تلقائياً • وفّرنا لك 250 ر.س قبل المناسبة
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          className="w-full rounded-2xl bg-primary text-primary-foreground py-3 text-[13px] font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-[0.99] transition"
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
              <span className="text-[14px] font-extrabold text-foreground tracking-tight">يوليو 2026</span>
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
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">
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
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-[12px] font-extrabold transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isToday
                        ? "bg-primary/10 text-primary"
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

        {/* Upcoming events — premium cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium text-muted-foreground">{upcomingCount} مناسبات</span>
            <h3 className="text-[14px] font-extrabold text-foreground tracking-tight">المناسبات القادمة</h3>
          </div>
          <div className="space-y-2.5">
            {events.map((e) => {
              const isIncome = e.id === "income_default";
              return (
                <button
                  type="button"
                  key={e.id}
                  onClick={() => !isIncome && openEdit(e)}
                  disabled={isIncome}
                  className={`w-full text-right rounded-[20px] bg-card border border-border p-3.5 flex items-center gap-3 shadow-sm transition ${
                    isIncome ? "opacity-90 cursor-default" : "cursor-pointer hover:border-primary/40 active:scale-[0.99]"
                  }`}
                >
                  <div className="text-right shrink-0">
                    <div
                      className={`text-[13px] font-bold tracking-tight ${
                        e.tone === "in" ? "text-mint" : e.tone === "save" ? "text-primary" : "text-destructive"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {e.amount > 0 ? "+" : ""}
                      {e.amount.toLocaleString()}
                    </div>
                    <p className="text-[9px] text-muted-foreground font-medium">ر.س</p>
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center justify-end gap-1.5">
                      {e.status === "new" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground">
                          جديد
                        </span>
                      )}
                      {e.status === "today" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-mint/20 text-primary">
                          اليوم
                        </span>
                      )}
                      <p className="text-[13px] font-extrabold text-foreground tracking-tight truncate">
                        {e.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{e.subtitle}</p>
                  </div>
                  <div className="h-11 w-11 rounded-2xl bg-secondary flex items-center justify-center text-xl shrink-0">
                    {e.icon}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {screen === "loading" && (
        <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-[13px] font-medium text-foreground">جارٍ تحليل تأثير المناسبة...</p>
        </div>
      )}

      {/* AI success popup */}
      {screen === "ai-done" && lastAdded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-5 animate-fade-in">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={() => setScreen("main")} />
          <div className="relative w-full bg-card rounded-[28px] shadow-2xl animate-scale-in overflow-hidden">
            <div
              className="px-5 pt-5 pb-4 text-white"
              style={{
                background:
                  "linear-gradient(140deg, oklch(0.32 0.06 155) 0%, oklch(0.20 0.05 155) 100%)",
              }}
            >
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[9px] font-extrabold px-2 py-1 rounded-lg bg-mint text-primary tracking-wider">AI</span>
                <p className="text-[13px] font-extrabold tracking-tight">المستشار المالي</p>
              </div>
              <h2 className="mt-2 text-[17px] font-extrabold tracking-tight text-right">
                تمت إضافة المناسبة بنجاح
              </h2>
            </div>

            <div className="p-5">
              <p className="text-[11px] text-foreground/85 text-right font-medium leading-relaxed">
                قمنا بإعادة توزيع خطة الادخار تلقائياً حتى لا تتأثر ميزانيتك.
              </p>

              <p className="text-[10px] text-muted-foreground text-right mt-4 mb-1 font-medium">
                اختر خطة الادخار المناسبة
              </p>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat plan="daily" label="ادخار يومي" value="12" suffix="ر.س" />
                <MiniStat plan="weekly" label="ادخار أسبوعي" value="85" suffix="ر.س" />
                <MiniStat plan="monthly" label="ادخار شهري" value="340" suffix="ر.س" />
              </div>

              <div className="mt-4 flex gap-2.5">
                <button
                  onClick={() => setScreen("main")}
                  className="flex-1 rounded-2xl bg-secondary text-foreground font-extrabold py-3.5 text-[13px] active:scale-[0.98] transition"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => setScreen("main")}
                  className="flex-1 rounded-2xl bg-primary text-primary-foreground font-extrabold py-3.5 text-[13px] shadow-lg shadow-primary/30 active:scale-[0.98] transition"
                >
                  عرض الخطة الجديدة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  suffix,
  plan,
}: {
  label: string;
  value: string;
  suffix?: string;
  plan?: SavingsPlan;
}) {
  const [selected, setSelected] = useSavingsPlan();
  const active = plan !== undefined && selected === plan;
  const clickable = plan !== undefined;
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => {
        if (!plan) return;
        setSelected(plan);
        toast.success(
          plan === "daily"
            ? "تم اعتماد خطة الادخار اليومي"
            : plan === "weekly"
              ? "تم اعتماد خطة الادخار الأسبوعي"
              : "تم اعتماد خطة الادخار الشهري",
        );
      }}
      className={`rounded-2xl p-2.5 text-center transition ${
        active
          ? "bg-primary text-primary-foreground border border-primary shadow-md shadow-primary/25"
          : "bg-mint/10 border border-mint/25 hover:border-primary/40"
      } ${clickable ? "active:scale-[0.98]" : ""}`}
    >
      <p
        className={`text-[15px] font-bold tracking-tight ${active ? "text-primary-foreground" : "text-primary"}`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
        {suffix && <span className="text-[9px] mr-1 font-medium">{suffix}</span>}
      </p>
      <p className={`text-[9px] font-medium mt-0.5 ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {label}
      </p>
    </button>
  );
}

/* --------- Add Event Form --------- */
function AddEventScreen({
  onBack,
  onSave,
  initial,
  onDelete,
}: {
  onBack: () => void;
  onSave: (e: CalEvent) => void;
  initial?: CalEvent | null;
  onDelete?: () => void;
}) {
  const isEdit = !!initial;
  const [kindKey, setKindKey] = useState<string>(initial?.kindKey ?? "birthday");
  const [name, setName] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [cost, setCost] = useState(
    initial ? String(initial.cost ?? Math.abs(initial.amount)) : "",
  );
  const [cashFlow, setCashFlow] = useState<"out" | "in">(
    initial ? (initial.tone === "in" ? "in" : "out") : "out",
  );
  const [priority, setPriority] = useState<"high" | "med" | "low">(initial?.priority ?? "med");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const kind = EVENT_KINDS.find((k) => k.key === kindKey)!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const label = name.trim() || kind.label;
    if (!date || !cost) {
      toast.error("الرجاء إكمال التاريخ والتكلفة");
      return;
    }
    const dayNum = Number(date.split("-")[2] ?? date) || 20;
    const costNum = Math.abs(Number(cost) || 0);
    const amount = cashFlow === "in" ? costNum : -costNum;
    onSave({
      id: initial?.id ?? "",
      day: dayNum,
      title: label,
      subtitle: `${date} • ${priority === "high" ? "أولوية عالية" : priority === "med" ? "متوسطة" : "منخفضة"}${notes ? " • " + notes : ""}`,
      amount,
      tone: cashFlow,
      icon: kind.icon,
      kindKey,
      date,
      priority,
      notes,
      cost: costNum,
    });
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title={isEdit ? "تعديل المناسبة" : "إضافة مناسبة جديدة"} onBack={onBack} />
      <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">

        <Field label="نوع المناسبة">
          <div className="grid grid-cols-3 gap-2">
            {EVENT_KINDS.map((k) => {
              const active = k.key === kindKey;
              return (
                <button
                  type="button"
                  key={k.key}
                  onClick={() => setKindKey(k.key)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 border transition ${
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <span className="text-xl">{k.icon}</span>
                  <span className="text-[11px] font-medium">{k.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="اسم المناسبة">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind.label}
          />
        </Field>

        <Field label="التاريخ">
          <input
            type="date"
            className={inputCls + " text-right"}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <Field label="نوع التأثير على الميزانية">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCashFlow("out")}
              className={`rounded-xl py-2.5 text-[12px] font-extrabold border transition ${
                cashFlow === "out"
                  ? "bg-destructive/10 text-destructive border-destructive/30"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              مصروف
            </button>
            <button
              type="button"
              onClick={() => setCashFlow("in")}
              className={`rounded-xl py-2.5 text-[12px] font-extrabold border transition ${
                cashFlow === "in"
                  ? "bg-mint/10 text-primary border-mint/30"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              دخل
            </button>
          </div>
        </Field>

        <Field label={cashFlow === "in" ? "المبلغ المتوقع (ر.س)" : "التكلفة المتوقعة (ر.س)"}>
          <input
            className={inputCls}
            value={cost}
            onChange={(e) => setCost(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="1500"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
        </Field>

        <Field label="الأولوية">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "high", l: "عالية", tone: "bg-destructive/10 text-destructive border-destructive/30" },
              { k: "med", l: "متوسطة", tone: "bg-primary/10 text-primary border-amber-200" },
              { k: "low", l: "منخفضة", tone: "bg-mint/10 text-primary border-mint/30" },
            ].map((p) => {
              const active = priority === (p.k as typeof priority);
              return (
                <button
                  type="button"
                  key={p.k}
                  onClick={() => setPriority(p.k as typeof priority)}
                  className={`rounded-xl py-2.5 text-[12px] font-extrabold border transition ${
                    active ? p.tone : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  {p.l}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="ملاحظات (اختياري)">
          <input
            className={inputCls}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي تفاصيل إضافية"
          />
        </Field>

        <PrimaryButton type="submit">{isEdit ? "تعديل المناسبة" : "إضافة المناسبة"}</PrimaryButton>
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full rounded-2xl border border-destructive/40 bg-destructive/5 text-destructive font-extrabold py-3 text-[13px] active:scale-[0.99] transition"
              style={{ color: "#DC2626" }}
            >
              حذف المناسبة
            </button>
          )}
      </form>
    </div>
  );
}

/* ---------- Goals List ---------- */

export function GoalsListScreen({
  onBack,
  onOpenGoal,
  onOpenNewGoal,
}: {
  onBack: () => void;
  onOpenGoal: (id: string) => void;
  onOpenNewGoal: () => void;
}) {
  const { goals, loading, removeGoal } = useGoals();
  const { removeGoalById, refreshGoals } = useBudget();
  const canDelete = goals.length > 1;

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!canDelete) return;
    removeGoalById(id); // instant reactive drop on Dashboard daily limit
    await removeGoal(id);
    await refreshGoals();
    toast.success("تم حذف الهدف");
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="أهدافي" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {loading && (
          <p className="text-center text-[13px] text-muted-foreground py-10 font-medium">جارٍ التحميل...</p>
        )}

        {!loading && goals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-[13px] font-extrabold text-foreground tracking-tight">لا توجد أهداف بعد</p>
            <p className="text-[11px] text-muted-foreground font-medium">ابدأ بإضافة هدفك الأول من الأسفل</p>
          </div>
        )}

        {goals.map((g) => {
          const target = Number(g.target_amount);
          const saved = Number(g.saved_amount);
          const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
          const Icon = iconFor(g.icon);
          return (
            <div
              key={g.id}
              className="w-full rounded-2xl bg-card border border-border p-4 shadow-sm text-right transition hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                {canDelete && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(g.id, e)}
                    className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 active:scale-95 transition hover:bg-destructive/15"
                    aria-label="حذف الهدف"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenGoal(g.id)}
                  className="flex-1 flex items-center gap-3 text-right min-w-0 active:scale-[0.99] transition"
                >
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-extrabold text-foreground truncate tracking-tight">{g.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {saved.toLocaleString()} / {target.toLocaleString()} ر.س • {percent}%
                    </p>
                  </div>
                </button>
              </div>
              <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
                <div className="h-full bg-mint rounded-full" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}

        <button
          onClick={onOpenNewGoal}
          className="w-full py-3 rounded-2xl border border-dashed border-border text-[13px] font-extrabold text-muted-foreground flex items-center justify-center gap-1.5 hover:border-primary/40 hover:text-primary transition"
        >
          <Plus className="h-4 w-4" /> إضافة هدف جديد
        </button>
      </div>
    </div>
  );
}

/* ---------- رادار خُطى الذكي (Predictive Radar) ---------- */

export function RadarScreen({ onBack }: { onBack: () => void }) {
  const [activated, setActivated] = useState(false);
  const [freezeStage, setFreezeStage] = useState<"idle" | "noon" | "freeze">("idle");

  if (freezeStage === "noon") {
    return (
      <NoonFreezeSim
        onBack={() => setFreezeStage("idle")}
        onBuy={() => setFreezeStage("freeze")}
      />
    );
  }
  if (freezeStage === "freeze") {
    return (
      <FreezeModeScreen
        onBack={() => setFreezeStage("noon")}
        onExit={() => setFreezeStage("idle")}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="رادار خُطى الذكي" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Pulsing radar */}
        <div className="rounded-[28px] bg-card border border-border p-6 flex flex-col items-center gap-3 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-mint/10 blur-3xl" />
          </div>
          <div className="relative h-40 w-40 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-mint/40 animate-ping" />
            <span className="absolute inset-4 rounded-full border border-mint/50 animate-pulse" />
            <span className="absolute inset-10 rounded-full border border-amber-300/60" />
            <div
              className="relative h-20 w-20 rounded-full flex items-center justify-center text-white shadow-xl"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.85 0.14 85), oklch(0.32 0.06 155), oklch(0.85 0.14 85))",
              }}
            >
              <Sparkles className="h-8 w-8" strokeWidth={2} />
            </div>
          </div>
          <p className="text-[11px] font-medium text-mint tracking-[0.2em] uppercase">
            الرادار يعمل الآن
          </p>
          <h3 className="text-[17px] font-extrabold text-foreground tracking-tight">
            تحليل السلوك الاندفاعي
          </h3>
        </div>

        {/* Insight */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm text-right space-y-2">
          <div className="flex items-center gap-2 justify-end">
            <p className="text-[14px] font-extrabold text-foreground tracking-tight">نمط تم رصده</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5">
              رادار
            </span>
          </div>
          <p className="text-[11px] text-foreground/85 leading-relaxed font-medium">
            تم ملاحظة زيادة بنسبة{" "}
            <span className="font-bold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
              85%
            </span>{" "}
            في محاولات التسوق الاندفاعي يوم{" "}
            <span className="font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>27</span>{" "}
            من كل شهر (يوم المكافأة) بين{" "}
            <span dir="ltr" style={{ fontVariantNumeric: "tabular-nums" }}>11:00 PM</span> و{" "}
            <span dir="ltr" style={{ fontVariantNumeric: "tabular-nums" }}>1:00 AM</span>.
          </p>
        </div>

        {/* Challenge */}
        <div
          className="rounded-[24px] p-4 text-right shadow-sm border"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.97 0.06 85) 0%, oklch(0.99 0.02 85) 100%)",
            borderColor: "oklch(0.85 0.10 85 / 0.5)",
          }}
        >
          <div className="flex items-center gap-2 justify-end mb-2">
            <p className="text-[14px] font-extrabold text-amber-900 tracking-tight">تحدي الليلة</p>
            <span className="text-lg"></span>
          </div>
          <p className="text-[11px] text-amber-950/90 leading-relaxed font-medium">
            متبقي ساعتان على وقت الإغراء المعتاد. قاوم فتح تطبيقات التسوق الليلة واكسب كود توفير حصري من نون لدعم هدفك الحالي!
          </p>
        </div>

        <button
          onClick={() => {
            setActivated(true);
            toast.success("تم تفعيل الحماية الاستباقية الليلة ");
          }}
          disabled={activated}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-extrabold py-4 text-[13px] shadow-lg shadow-primary/25 active:scale-[0.99] transition disabled:opacity-70"
        >
          {activated ? "الحماية مُفعّلة الليلة " : "تفعيل الحماية الاستباقية"}
        </button>

        {/* NEW — Freeze feature card (compact) */}
        <div
          dir="rtl"
          className="rounded-2xl px-3 py-2.5 border border-dashed flex items-center gap-2.5"
          style={{
            borderColor: "oklch(0.82 0.08 155 / 0.55)",
            background: "linear-gradient(140deg, oklch(0.98 0.02 155) 0%, oklch(0.95 0.05 155) 100%)",
          }}
        >
          <div className="h-8 w-8 rounded-lg bg-yellow-400 text-neutral-900 flex items-center justify-center text-[9px] font-extrabold shrink-0 lowercase">
            noon
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center gap-1.5 justify-start">
              <p className="text-[13px] font-extrabold text-foreground tracking-tight leading-tight">ميزة التجميد</p>
              <span className="text-[9px] font-bold text-primary bg-mint/20 border border-mint/40 rounded px-1 py-px leading-none">جديد</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5 leading-tight truncate">
              محاكاة نون — جرّب تدخّل خُطى قبل شراء اندفاعي
            </p>
          </div>
          <button
            onClick={() => setFreezeStage("noon")}
            className="shrink-0 rounded-full bg-primary text-primary-foreground font-extrabold px-3 py-1.5 text-[11px] active:scale-95 transition"
          >
            ابدأ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Noon simulator (for Freeze feature) ---------- */
function NoonFreezeSim({ onBack, onBuy }: { onBack: () => void; onBuy: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-yellow-400 px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="h-9 w-9 rounded-full bg-white/40 flex items-center justify-center text-neutral-900">
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
        <span className="text-neutral-900 text-[17px] font-extrabold tracking-tight lowercase">noon</span>
        <div className="w-9" />
      </div>
      <div className="bg-yellow-400 px-4 pb-4 shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
          <span className="text-[11px] text-neutral-500 font-medium">ابحث في نون</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="aspect-[4/5] bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full bg-neutral-800 shadow-2xl relative">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-neutral-900 border-8 border-neutral-800" />
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-neutral-900 border-8 border-neutral-800" />
          </div>
        </div>
        <div className="px-4 pt-4 text-neutral-900" dir="rtl">
          <p className="text-[14px] font-extrabold leading-snug tracking-tight">سماعة سوني اللاسلكية — عزل ضوضاء</p>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">Sony Wireless Headphones</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-[22px] font-bold text-neutral-900 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              400
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">ر.س</span>
          </div>
          <button
            onClick={onBuy}
            className="mt-5 mb-6 w-full rounded-full bg-yellow-400 text-neutral-900 font-extrabold py-4 text-[13px] active:scale-[0.99] transition shadow-lg"
          >
            شراء الآن
          </button>
        </div>
      </div>
    </div>
  );
}

type FreezeMsg = { from: "ai" | "me"; text: string };
const FREEZE_REASONS = ["احتياج فعلي", "حماس", "توتر", "ملل", "مكافأة لنفسي"];
const FREEZE_TOTAL_SECONDS = 3 * 60;

// Follow-up questions the coach cycles through per reason
const FOLLOWUPS: Record<string, string[]> = {
  "احتياج فعلي": [
    "هل تحتاج هذه السماعة فعلاً اليوم، أم يمكن تأجيلها؟",
    "هل لديك سماعة تعمل بشكل جيد حالياً؟",
    "لو أجّلتها أسبوعاً، ما الذي سيتغيّر فعلاً؟",
    "هل يوجد بديل أرخص يغطي نفس الغرض؟",
    "كم يقرّبك مبلغ 400 ريال من هدفك المالي الحالي؟",
    "لو خيّرتك: السماعة الآن أو خطوة أقرب لهدفك، أيهما تختار؟",
  ],
  حماس: [
    "الحماس شعور جميل — من أين جاءك الحماس لهذا المنتج؟",
    "لو انتظرت الحماس يهدأ، هل ستبقى قناعتك بالشراء؟",
    "هل شعرت بهذا الحماس من قبل ثم ندمت على الشراء؟",
    "ما الذي ستستفيده حقاً من هذه السماعة خلال شهر؟",
    "هل يمكن توجيه هذا الحماس نحو هدفك المالي بدلاً منها؟",
  ],
  توتر: [
    "أتفهم شعورك — ما الذي يوترك الآن؟",
    "هل تعتقد أن الشراء سيحلّ سبب التوتر أم يخفّف الشعور مؤقتاً؟",
    "جرّبت من قبل تخفيف التوتر بطريقة أخرى؟ كيف كانت النتيجة؟",
    "لو تنفّست دقيقة ثم عدت للقرار، هل سيتغير رأيك؟",
    "ما الشعور الذي تريده بدل التوتر؟ يمكن نصل له بدون شراء.",
  ],
  ملل: [
    "الملل صديق التسوق الاندفاعي — ما آخر شيء أمتعك حقاً؟",
    "هل يوجد نشاط بسيط الآن يمكنه كسر الملل؟",
    "لو اشتريت السماعة، كم يوماً ستبقى سعيداً بها فعلاً؟",
    "هل يمكن استبدال الشراء بشيء مجاني: مشي، كتاب، مكالمة؟",
    "لو مرّ الملل، هل ستحتاج السماعة أصلاً؟",
  ],
  "مكافأة لنفسي": [
    "تستحق المكافأة — ما الإنجاز الذي تكافئ نفسك عليه؟",
    "هل هذه المكافأة تعبّر فعلاً عن حجم الإنجاز؟",
    "هل هناك مكافأة تعزّز صحتك أو مهاراتك بنفس المبلغ؟",
    "لو ادّخرت المبلغ لهدفك، ألن يكون ذلك مكافأة أكبر؟",
    "المكافآت الصغيرة أحياناً أجمل — هل جربت ذلك؟",
  ],
};

const ACK_LINES = [
  "شكراً لصراحتك ",
  "ملاحظة جميلة، خلينا نكمل.",
  "أفهم قصدك تماماً.",
  "منطقي جداً، فكرة مهمة.",
  "جميل، هذا يساعدنا نفكر بهدوء.",
];

function FreezeModeScreen({ onBack, onExit }: { onBack: () => void; onExit: () => void }) {
  const profile = useProfile();
  const firstName = (profile?.full_name || "").trim().split(" ")[0];
  const [reason, setReason] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(FREEZE_TOTAL_SECONDS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [askIndex, setAskIndex] = useState(0);
  const [msgs, setMsgs] = useState<FreezeMsg[]>([
    {
      from: "ai",
      text: `مرحبًا${firstName ? " " + firstName : ""} لاحظت أنك على وشك شراء سماعة بقيمة 400 ريال من نون.`,
    },
    {
      from: "ai",
      text: "اكتشفت أن هذه ثالث مرة تحاول شراء منتج مشابه خلال الفترة الأخيرة.",
    },
    {
      from: "ai",
      text: "ما السبب الأقرب لقرار الشراء؟",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  // Countdown
  useEffect(() => {
    if (!reason || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [reason, seconds]);

  // Gentle nudge if user idle for a while — asks the next question
  useEffect(() => {
    if (!reason || seconds <= 0) return;
    const last = msgs[msgs.length - 1];
    if (last?.from !== "ai") return;
    const idle = setTimeout(() => {
      askNext();
    }, 35_000);
    return () => clearTimeout(idle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, reason, seconds]);

  function askNext() {
    if (!reason) return;
    const list = FOLLOWUPS[reason] ?? [];
    if (list.length === 0) return;
    const q = list[askIndex % list.length];
    setAskIndex((i) => i + 1);
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "ai", text: q }]);
      setTyping(false);
    }, 700);
  }

  function pickReason(r: string) {
    setReason(r);
    setMsgs((m) => [
      ...m,
      { from: "me", text: r },
      {
        from: "ai",
        text: "شكراً لمشاركتك. فتحت لك جلسة تجميد 3 دقائق — خلينا نتحدث بهدوء خلالها.",
      },
    ]);
    setTyping(true);
    setTimeout(() => {
      const list = FOLLOWUPS[r] ?? [];
      setMsgs((m) => [...m, { from: "ai", text: list[0] ?? "كيف تشعر الآن تجاه القرار؟" }]);
      setAskIndex(1);
      setTyping(false);
    }, 900);
  }

  function sendUser(text: string) {
    const value = text.trim();
    if (!value || seconds <= 0) return;
    setMsgs((m) => [...m, { from: "me", text: value }]);
    setInput("");
    const ack = ACK_LINES[Math.floor(Math.random() * ACK_LINES.length)];
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "ai", text: ack }]);
      setTyping(false);
      setTimeout(() => askNext(), 900);
    }, 700);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = ((FREEZE_TOTAL_SECONDS - seconds) / FREEZE_TOTAL_SECONDS) * 100;
  const finished = reason !== null && seconds === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card px-5 pt-4 pb-3 flex items-center justify-between border-b border-border shrink-0">
        {reason && !finished ? (
          <button
            onClick={() => {
              const ok = window.confirm(
                "هل هذه حالة طوارئ فعلية؟\nسيتم إيقاف مؤقت التجميد والخروج لإكمال الشراء.",
              );
              if (ok) {
                toast("خروج طارئ — تم إيقاف التجميد");
                onExit();
              }
            }}
            className="h-10 px-3 rounded-2xl bg-primary/10 text-primary text-[11px] font-extrabold flex items-center gap-1 border border-rose-200 active:scale-[0.98] transition"
            aria-label="خروج طارئ"
          >
            <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
            طوارئ
          </button>
        ) : (
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center"
            aria-label="رجوع"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
        <div className="text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <Shield className="h-4 w-4 text-primary" strokeWidth={2} />
            <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">وضع التجميد</h2>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">نساعدك تتخذ قرارك بهدوء</p>
        </div>
        <div className="w-10" />
      </div>


      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
        {reason && (
          <div className="rounded-[22px] bg-card border border-border p-4 shadow-sm text-center">
            <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
              {finished ? "انتهى الوقت!" : "الجلسة ستنتهي خلال"}
            </p>
            <p
              className="text-[28px] font-bold text-primary mt-1 leading-none tracking-tight"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {mm}:{ss}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">
              {finished ? "القرار النهائي لك" : "دقائق متبقية"}
            </p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground rounded-br-sm font-medium"
                  : "bg-card border border-border text-foreground rounded-bl-sm font-medium"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 justify-end">
                <span className="text-[9px] font-bold text-muted-foreground">
                  {m.from === "me" ? (firstName || "أنت") : "خُطى"}
                </span>
              </div>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-end">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {!reason && (
          <div className="grid grid-cols-2 gap-2 pt-2" dir="rtl">
            {FREEZE_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => pickReason(r)}
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-[12px] font-extrabold text-foreground text-right active:scale-[0.98] transition hover:border-primary/40"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {reason && !finished && (
        <div className="p-3 bg-card border-t border-border shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendUser(input);
            }}
            className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2"
          >
            <button
              type="submit"
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0"
              aria-label="إرسال"
            >
              <Send className="h-4 w-4 -rotate-180" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب ردك..."
              className="flex-1 bg-transparent outline-none text-[13px] font-medium text-right"
            />
          </form>
        </div>
      )}

      {finished && (
        <div className="border-t border-border bg-card p-4 space-y-2 shrink-0">
          <button
            onClick={() => {
              toast.success("أحسنت! تم إلغاء الشراء ");
              onExit();
            }}
            className="w-full rounded-2xl bg-primary text-primary-foreground font-extrabold py-3.5 text-[13px] shadow-lg shadow-primary/25 active:scale-[0.99] transition"
          >
            إلغاء الشراء
          </button>
          <button
            onClick={() => {
              toast("متابعة الشراء — القرار لك");
              onExit();
            }}
            className="w-full rounded-2xl bg-secondary text-foreground font-extrabold py-3.5 text-[13px] active:scale-[0.99] transition"
          >
            متابعة الشراء
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- التحدي الجماعي + شات ريما ---------- */

type ChatMsg = { from: "me" | "her" | "system"; text: string; emoji?: string };

export function GroupChallengeScreen({ onBack, userName = "" }: { onBack: () => void; userName?: string }) {
  const firstName = (userName || "").trim().split(" ")[0] || "أنت";
  const [showAdd, setShowAdd] = useState(false);
  const [newFriend, setNewFriend] = useState("");
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "me", text: "أنا وفّرت اليوم 240 ريال من شي إن، وين وصلت؟", emoji: "" },
    { from: "her", text: "كفو! أنا باقي لي 10% وأقفل ميزانية هذا الأسبوع!", emoji: "" },
  ]);

  function send(text?: string) {
    const value = (text ?? draft).trim();
    if (!value) return;
    setMsgs((m) => [...m, { from: "me", text: value }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { from: "her", text: `يعطيكِ العافية${firstName && firstName !== "أنت" ? " يا " + firstName : ""}، محفزّة صح ` },
      ]);
    }, 900);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="التحدي الجماعي" onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        {/* Top: add friend + progress bars */}
        <div className="p-5 space-y-4 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdd(true)}
              className="text-primary text-[12px] font-extrabold flex items-center gap-1 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              إضافة صديق آخر
            </button>
            <h3 className="text-[14px] font-extrabold text-foreground tracking-tight">
              {firstName} وريما في تحدٍّ واحد
            </h3>
          </div>

          <ProgressBar name={`أنت (${firstName})`} percent={68} tone="primary" />
          <ProgressBar name="الصديق (ريما)" percent={45} tone="amber" />
        </div>

        {/* Motivational reminder */}
        <div className="px-5 pt-4">
          <div className="rounded-2xl bg-mint/10 border border-mint/30 p-3.5 text-right">
            <p className="text-[11px] text-foreground font-medium leading-relaxed">
              ريما قريبة منك! باقي لها تكة وتوصل لهدفها، وش رأيك تحمّسها الحين؟
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="px-5 pt-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground">مباشر</span>
            <h4 className="text-[14px] font-extrabold text-foreground tracking-tight">
              محادثة ريما المالية
            </h4>
          </div>

          <div className="space-y-2">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed font-medium ${
                    m.from === "me"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm border border-border"
                  }`}
                >
                  {m.text} {m.emoji ?? ""}
                </div>
              </div>
            ))}
          </div>

          {/* Quick tap bubbles */}
          <div className="flex flex-wrap gap-2 justify-end pt-1">
            {["يلا نكمّل! ", "توفيري اليوم مبسوط فيه ", "قربت من هدفك "].map((t) => (
              <button
                key={t}
                onClick={() => send(t)}
                className="text-[11px] font-bold text-primary bg-mint/10 border border-mint/30 rounded-full px-3 py-1.5 active:scale-95 transition"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => send()}
          aria-label="إرسال"
          className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md active:scale-95 transition"
        >
          <ChevronRight className="h-5 w-5 rotate-180" strokeWidth={2.5} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="اكتب رسالة تحفيزية..."
          className="flex-1 h-10 rounded-2xl bg-secondary border border-transparent focus:border-primary/40 outline-none px-4 text-[13px] font-medium text-right"
        />
      </div>

      {showAdd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative w-full rounded-3xl bg-card shadow-2xl p-5 space-y-3 animate-scale-in">
            <h4 className="text-[17px] font-extrabold text-foreground text-right tracking-tight">
              إضافة صديق للتحدي
            </h4>
            <input
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
              placeholder="05XXXXXXXX"
              inputMode="numeric"
              dir="ltr"
              className="w-full h-12 rounded-2xl bg-secondary border border-transparent focus:border-primary/40 outline-none px-4 text-[13px] font-bold text-right"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-2xl bg-secondary text-foreground font-extrabold py-3 text-[13px]"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!/^05\d{8}$/.test(newFriend)) {
                    toast.error("رقم الجوال يجب أن يتكون من 10 خانات ويبدأ بـ 05");
                    return;
                  }
                  toast.success("تمت دعوة صديقتك للتحدي ");
                  setNewFriend("");
                  setShowAdd(false);
                }}
                className="flex-1 rounded-2xl bg-primary text-primary-foreground font-extrabold py-3 text-[13px]"
              >
                إرسال الدعوة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({
  name,
  percent,
  tone,
}: {
  name: string;
  percent: number;
  tone: "primary" | "amber";
}) {
  const barColor =
    tone === "primary"
      ? "linear-gradient(to left, oklch(0.55 0.14 155), oklch(0.32 0.06 155))"
      : "linear-gradient(to left, oklch(0.85 0.14 85), oklch(0.72 0.16 65))";
  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[11px] font-bold text-foreground"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {percent}%
        </span>
        <span className="text-[13px] font-extrabold text-foreground tracking-tight">{name}</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
