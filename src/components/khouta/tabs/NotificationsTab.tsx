import {
  ShieldCheck,
  Lightbulb,
  ShoppingBag,
  UtensilsCrossed,
  Car,
  Sparkles,
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Menu,
  Star,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

type MerchantKey = "SHEIN" | "نون";

type Alert = {
  brand: string;
  icon: React.ReactNode;
  iconTint: string;
  tag: string;
  tagTone: string;
  text: string;
  time: string;
};

const ALERTS: Alert[] = [
  { brand: "SHEIN", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "تم التوفير", tagTone: "text-mint bg-mint/10", text: "تم إلغاء عملية شراء بقيمة 450 ر.س بنجاح", time: "منذ 20 دقيقة" },
  { brand: "هنقرستيشن", icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-amber-50 text-amber-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "اقتربتِ من ميزانية المطاعم الأسبوعية", time: "منذ 3 ساعات" },
  { brand: "كريم", icon: <Car className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-blue-50 text-blue-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "مصروف المواصلات يتجاوز الحد الشهري", time: "منذ يوم" },
  { brand: "تذكير ادخار", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "تم التوفير", tagTone: "text-mint bg-mint/10", text: "وفرتِ 120 ر.س هذا الأسبوع", time: "منذ يومين" },
];

const ALL_ALERTS: Alert[] = [
  ...ALERTS,
  { brand: "نون", icon: <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-yellow-50 text-yellow-700", tag: "تم التوفير", tagTone: "text-mint bg-mint/10", text: "تم إلغاء طلب بقيمة 320 ر.س", time: "منذ 3 أيام" },
  { brand: "امازون", icon: <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-orange-50 text-orange-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "تجاوز ميزانية التسوق الشهرية", time: "منذ 4 أيام" },
  { brand: "STC Pay", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-purple-50 text-purple-700", tag: "معلومة", tagTone: "text-blue-700 bg-blue-50", text: "تم استلام راتبك الشهري", time: "منذ 5 أيام" },
  { brand: "جرير", icon: <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-red-50 text-red-700", tag: "تم التوفير", tagTone: "text-mint bg-mint/10", text: "استخدمتِ كوبون خصم 15%", time: "منذ أسبوع" },
  { brand: "طلبات", icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-orange-50 text-orange-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "طلبات المطاعم زادت 30% هذا الأسبوع", time: "منذ أسبوع" },
  { brand: "أهداف الادخار", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "إنجاز", tagTone: "text-mint bg-mint/10", text: "وصلتِ إلى 30% من هدف السيارة", time: "منذ أسبوعين" },
];

export function NotificationsTab({
  onSimulateIntercept,
}: {
  onSimulateIntercept: (merchant: MerchantKey, amount: number) => void;
}) {
  const [view, setView] = useState<"main" | "shein" | "noon" | "all">("main");

  if (view === "shein") {
    return (
      <SheinSim
        onBack={() => setView("main")}
        onCheckout={(amt) => onSimulateIntercept("SHEIN", amt)}
      />
    );
  }
  if (view === "noon") {
    return (
      <NoonSim
        onBack={() => setView("main")}
        onCheckout={(amt) => onSimulateIntercept("نون", amt)}
      />
    );
  }
  if (view === "all") return <AllAlerts onBack={() => setView("main")} />;

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
        <div className="w-11" />
        <div className="text-center">
          <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">التنبيهات الذكية</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">حماية مالية لحظية</p>
        </div>
        <button className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition">
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive border-2 border-card text-white text-[9px] font-bold flex items-center justify-center" style={{ fontVariantNumeric: "tabular-nums" }}>
            3
          </span>
        </button>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Hero */}
        <div
          className="rounded-[28px] p-5 text-primary-foreground relative overflow-hidden"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.34 0.07 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.12 0.03 155) 100%)",
            boxShadow: "0 24px 48px -22px oklch(0.20 0.05 155 / 0.65)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-mint/20 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between mb-3">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-mint">Open Banking</span>
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-mint" strokeWidth={1.8} />
            </div>
          </div>
          <h3 className="font-extrabold text-[16px] text-right tracking-tight">الحماية المالية الفورية</h3>
          <p className="text-[12px] mt-2 text-right text-white/75 font-medium leading-relaxed">
            نُنبهك فور اكتشاف عملية شراء قد تؤثر على هدفك، داخل أي تطبيق تسوق.
          </p>
          <div className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur py-3 text-[12px] font-bold text-right flex items-center gap-2 px-4">
            <Lightbulb className="h-4 w-4 text-mint shrink-0" strokeWidth={2} />
            جرّبي الميزة من أحد التطبيقين أدناه
            <ChevronLeft className="h-4 w-4 mr-auto" strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">جرّبي الميزة الآن</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SimAppCard
            onClick={() => setView("shein")}
            name="SHEIN"
            subtitle="أزياء وإكسسوارات"
            logoBg="bg-black"
            logoText="text-white"
            logoLabel="SHEIN"
          />
          <SimAppCard
            onClick={() => setView("noon")}
            name="نون"
            subtitle="تسوق كل شيء"
            logoBg="bg-yellow-400"
            logoText="text-neutral-900"
            logoLabel="noon"
          />
        </div>

        {/* Recent alerts */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setView("all")}
              className="text-primary text-[11px] font-semibold flex items-center gap-0.5 active:scale-95 transition"
            >
              عرض الكل <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">آخر التنبيهات</h3>
          </div>
          <div className="divide-y divide-border">
            {ALERTS.map((a, i) => (
              <AlertRow key={i} a={a} />
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm space-y-3">
          <h3 className="font-extrabold text-foreground text-[14px] tracking-tight text-right">كيف تعمل الحماية؟</h3>
          {[
            { n: "1", title: "تتسوقين من أي تطبيق", desc: "نراقب نشاطك المالي بأمان" },
            { n: "2", title: "نكتشف الشراء فوراً", desc: "خلال ثوانٍ من التأكيد" },
            { n: "3", title: "تنبيه ذكي فوري", desc: "يحسب الأثر على هدفك تلقائياً" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                {s.n}
              </div>
              <div className="flex-1 text-right">
                <p className="font-extrabold text-foreground text-[13px] tracking-tight">{s.title}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertRow({ a }: { a: Alert }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${a.iconTint}`}>
        {a.icon}
      </div>
      <div className="flex-1 text-right min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${a.tagTone}`}>{a.tag}</span>
          <p className="text-[13px] font-extrabold text-foreground truncate tracking-tight">{a.brand}</p>
        </div>
        <p className="text-[12px] text-foreground/80 mt-1 font-medium">{a.text}</p>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{a.time}</p>
      </div>
    </div>
  );
}

function SimAppCard({
  onClick,
  name,
  subtitle,
  logoBg,
  logoText,
  logoLabel,
}: {
  onClick: () => void;
  name: string;
  subtitle: string;
  logoBg: string;
  logoText: string;
  logoLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] bg-card border border-border overflow-hidden shadow-sm active:scale-[0.98] transition text-right"
    >
      <div className={`${logoBg} py-6 flex items-center justify-center`}>
        <span className={`${logoText} text-[20px] font-black tracking-tight italic`}>
          {logoLabel}
        </span>
      </div>
      <div className="p-3 text-center">
        <p className="font-extrabold text-foreground text-[13px] tracking-tight">{name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{subtitle}</p>
        <div className="mt-2 w-full bg-primary/10 text-primary rounded-xl py-2 text-[11px] font-bold flex items-center justify-center gap-1">
          محاكاة الشراء
          <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

/* --------------------------- SHEIN simulator --------------------------- */
function SheinSim({ onBack, onCheckout }: { onBack: () => void; onCheckout: (amt: number) => void }) {
  const [qty, setQty] = useState(1);
  const price = 240;
  const total = price * qty;

  return (
    <div className="bg-white min-h-full pb-6">
      {/* Top bar */}
      <div className="bg-black text-white px-4 pt-6 pb-3 flex items-center justify-between">
        <button onClick={onBack} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
        <span className="text-[22px] font-black italic tracking-tight">SHEIN</span>
        <button className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
      <div className="bg-black px-4 pb-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-neutral-400" strokeWidth={2} />
          <span className="text-[12px] text-neutral-500 font-medium">ابحث في SHEIN</span>
        </div>
      </div>

      {/* Product image placeholder */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-50 to-neutral-100 flex items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-neutral-300" strokeWidth={1} />
        <button className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <Heart className="h-5 w-5 text-neutral-700" strokeWidth={2} />
        </button>
        <div className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded">
          -40%
        </div>
      </div>

      <div className="px-4 pt-4 text-neutral-900" dir="rtl">
        <p className="text-[15px] font-bold leading-snug">
          فستان صيفي كاجوال بأكمام قصيرة — تصميم عصري
        </p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-[11px] text-neutral-500 mr-1">(1,284)</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[22px] font-black text-red-600" style={{ fontVariantNumeric: "tabular-nums" }}>
            {price} ر.س
          </span>
          <span className="text-[13px] text-neutral-400 line-through" style={{ fontVariantNumeric: "tabular-nums" }}>
            400 ر.س
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-[13px] font-bold text-neutral-800">الكمية</p>
          <div className="flex items-center gap-3 border border-neutral-300 rounded-full px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-7 w-7 flex items-center justify-center">
              <Minus className="h-3 w-3 text-neutral-700" strokeWidth={2.5} />
            </button>
            <span className="text-[13px] font-bold min-w-[16px] text-center" style={{ fontVariantNumeric: "tabular-nums" }}>
              {qty}
            </span>
            <button onClick={() => setQty((q) => q + 1)} className="h-7 w-7 flex items-center justify-center">
              <Plus className="h-3 w-3 text-neutral-700" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-neutral-50 rounded-2xl p-3 flex items-center justify-between">
          <span className="text-[16px] font-black text-red-600" style={{ fontVariantNumeric: "tabular-nums" }}>
            {total} ر.س
          </span>
          <span className="text-[12px] font-bold text-neutral-700">الإجمالي</span>
        </div>

        <button
          onClick={() => onCheckout(total)}
          className="mt-4 w-full rounded-full bg-black text-white font-black py-4 text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          إتمام الشراء الآن
        </button>
      </div>
    </div>
  );
}

/* --------------------------- Noon simulator --------------------------- */
function NoonSim({ onBack, onCheckout }: { onBack: () => void; onCheckout: (amt: number) => void }) {
  const [qty, setQty] = useState(1);
  const price = 320;
  const total = price * qty;

  return (
    <div className="bg-white min-h-full pb-6">
      <div className="bg-yellow-400 px-4 pt-6 pb-3 flex items-center justify-between">
        <button onClick={onBack} className="h-9 w-9 rounded-full bg-black/10 flex items-center justify-center">
          <ChevronRight className="h-5 w-5 text-neutral-900" strokeWidth={2} />
        </button>
        <span className="text-[26px] font-black italic tracking-tight text-neutral-900 lowercase">
          noon
        </span>
        <button className="h-9 w-9 rounded-full bg-black/10 flex items-center justify-center">
          <ShoppingCart className="h-5 w-5 text-neutral-900" strokeWidth={2} />
        </button>
      </div>
      <div className="bg-yellow-400 px-4 pb-4">
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5">
          <Search className="h-4 w-4 text-neutral-400" strokeWidth={2} />
          <span className="text-[12px] text-neutral-500 font-medium">ابحث عن كل ما تحتاجه</span>
        </div>
      </div>

      <div className="relative aspect-square bg-gradient-to-br from-yellow-50 to-neutral-100 flex items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-neutral-300" strokeWidth={1} />
        <button className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <Heart className="h-5 w-5 text-neutral-700" strokeWidth={2} />
        </button>
      </div>

      <div className="px-4 pt-4 text-neutral-900" dir="rtl">
        <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-1 rounded">
          توصيل مجاني
        </span>
        <p className="text-[15px] font-bold leading-snug mt-2">
          سماعات لاسلكية بلوتوث — عزل ضوضاء نشط
        </p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-[11px] text-neutral-500 mr-1">(892)</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[22px] font-black text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {price} ر.س
          </span>
          <span className="text-[13px] text-neutral-400 line-through" style={{ fontVariantNumeric: "tabular-nums" }}>
            499 ر.س
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-[13px] font-bold text-neutral-800">الكمية</p>
          <div className="flex items-center gap-3 border border-neutral-300 rounded-full px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-7 w-7 flex items-center justify-center">
              <Minus className="h-3 w-3 text-neutral-700" strokeWidth={2.5} />
            </button>
            <span className="text-[13px] font-bold min-w-[16px] text-center" style={{ fontVariantNumeric: "tabular-nums" }}>
              {qty}
            </span>
            <button onClick={() => setQty((q) => q + 1)} className="h-7 w-7 flex items-center justify-center">
              <Plus className="h-3 w-3 text-neutral-700" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-neutral-50 rounded-2xl p-3 flex items-center justify-between">
          <span className="text-[16px] font-black text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {total} ر.س
          </span>
          <span className="text-[12px] font-bold text-neutral-700">الإجمالي</span>
        </div>

        <button
          onClick={() => onCheckout(total)}
          className="mt-4 w-full rounded-lg bg-yellow-400 text-neutral-900 font-black py-4 text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          إتمام الشراء الآن
        </button>
      </div>
    </div>
  );
}

/* --------------------------- All alerts screen --------------------------- */
function AllAlerts({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-background pb-6 min-h-full">
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
        <button
          onClick={onBack}
          className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
        >
          <ChevronRight className="h-5 w-5 text-foreground" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">جميع التنبيهات</h1>
        <div className="w-11" />
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm divide-y divide-border">
          {ALL_ALERTS.map((a, i) => (
            <AlertRow key={i} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
