import {
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Menu,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Coins,
  TrendingDown,
  Radar,
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

const GREEN_TONE = "text-primary bg-secondary";
const GREEN_ICON = "bg-secondary text-primary";
const WARN_TONE = "text-white bg-[#EF4444]";
const WARN_ICON = "bg-destructive/10 text-destructive";

const ALERTS: Alert[] = [
  { brand: "شي إن", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "توقف", tagTone: GREEN_TONE, text: "تم إيقاف عملية شراء بقيمة 240 ر.س بنجاح", time: "منذ 12 دقيقة" },
  { brand: "تنبيه ميزانية", icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.8} />, iconTint: WARN_ICON, tag: "تنبيه", tagTone: WARN_TONE, text: "اقتربت من الحد الأسبوعي للمطاعم", time: "منذ 3 ساعات" },
  { brand: "اقتراح ذكي", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "اقتراح", tagTone: GREEN_TONE, text: "يمكنك توفير 200 ر.س هذا الأسبوع", time: "منذ 5 ساعات" },
  { brand: "تنبيه استثماري", icon: <Coins className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "استثمار", tagTone: GREEN_TONE, text: "انخفض سعر الذهب اليوم 1.4% — فرصة شراء", time: "منذ يوم" },
];

const ALL_ALERTS: Alert[] = [
  ...ALERTS,
  { brand: "شي إن", icon: <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "توقف", tagTone: GREEN_TONE, text: "تم إيقاف عملية شراء بقيمة 450 ر.س بنجاح", time: "منذ يومين" },
  { brand: "تنبيه", icon: <TrendingDown className="h-5 w-5" strokeWidth={1.8} />, iconTint: WARN_ICON, tag: "تنبيه", tagTone: WARN_TONE, text: "تجاوز ميزانية التسوق الشهرية", time: "منذ 4 أيام" },
  { brand: "معلومة", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "معلومة", tagTone: GREEN_TONE, text: "تم استلام راتبك الشهري", time: "منذ 5 أيام" },
  { brand: "إنجاز", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: GREEN_ICON, tag: "إنجاز", tagTone: GREEN_TONE, text: "وصلتِ إلى 30% من هدف السيارة", time: "منذ أسبوع" },
];

type MerchantConfig = {
  key: MerchantKey;
  name: string;
  subtitle: string;
  category: string;
  logoBg: string;
  logoText: string;
  logoLabel: string;
  logoStyle?: "italic" | "block" | "lower";
  price: number;
  productTitle: string;
  productSubtitle: string;
  accentBg: string;
  headerText: string;
  ctaBg: string;
  ctaText: string;
};

const MERCHANTS: MerchantConfig[] = [
  { key: "SHEIN", name: "SHEIN", subtitle: "أزياء وإكسسوارات", category: "تسوق", logoBg: "bg-black", logoText: "text-white", logoLabel: "SHEIN", logoStyle: "italic", price: 450, productTitle: "فستان صيفي كاجوال — تصميم عصري", productSubtitle: "متعدد الألوان", accentBg: "from-pink-100 via-rose-50 to-neutral-100", headerText: "text-white", ctaBg: "bg-black", ctaText: "text-white" },
  { key: "نون", name: "نون", subtitle: "تسوق كل شيء", category: "تسوق", logoBg: "bg-yellow-400", logoText: "text-neutral-900", logoLabel: "noon", logoStyle: "lower", price: 320, productTitle: "سماعات لاسلكية بلوتوث — عزل ضوضاء", productSubtitle: "شحن سريع", accentBg: "from-yellow-50 to-neutral-100", headerText: "text-neutral-900", ctaBg: "bg-yellow-400", ctaText: "text-neutral-900" },
];

export function NotificationsTab({
  onSimulateIntercept,
  onOpenRadar,
}: {
  onSimulateIntercept: (merchant: MerchantKey, amount: number) => void;
  onOpenRadar?: () => void;
}) {

  const [simKey, setSimKey] = useState<MerchantKey | null>(null);
  const [view, setView] = useState<"main" | "all">("main");

  if (simKey) {
    const m = MERCHANTS.find((x) => x.key === simKey)!;
    return (
      <MerchantSim
        merchant={m}
        onBack={() => setSimKey(null)}
        onCheckout={(amt) => onSimulateIntercept(m.key, amt)}
      />
    );
  }
  if (view === "all") return <AllAlerts onBack={() => setView("main")} />;

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="flex items-center justify-center px-5 pt-6 pb-3 bg-card">
        <div className="text-center">
          <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">التنبيهات الذكية</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">حماية مالية في وقت التسوق</p>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Hero — الحماية المالية الفورية (compact) */}
        <div className="rounded-[24px] px-4 py-4 bg-muted relative overflow-hidden">
          <div className="relative flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              حماية
            </span>
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            </div>
          </div>
          <h3 className="font-extrabold text-[14px] text-right tracking-tight text-foreground">الحماية المالية الفورية</h3>
          <p className="text-[11px] mt-1 text-right text-muted-foreground font-medium leading-relaxed">
            الذكاء الاصطناعي يحلل عملياتك قبل إتمامها لحماية خطتك.
          </p>
          <button
            onClick={() => setSimKey("SHEIN")}
            className="mt-3 w-full rounded-xl bg-primary text-white font-extrabold py-2.5 text-[12px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.2} />
            افتح شي إن
          </button>
        </div>

        {/* رادار خُطى — compact row */}
        <button
          onClick={onOpenRadar}
          dir="rtl"
          className="w-full rounded-2xl border border-border bg-white px-3 py-3 flex items-center gap-3 active:scale-[0.99] transition"
        >
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <Radar className="h-4 w-4 text-primary" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[13px] font-extrabold text-foreground tracking-tight leading-tight">رادار خُطى الذكي</p>
          </div>
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={2.5} />
        </button>

        {/* Smart Activity Timeline */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setView("all")}
              className="text-primary text-[11px] font-semibold flex items-center gap-0.5 active:scale-95 transition"
            >
              عرض الكل <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">سجل النشاط الذكي</h3>
          </div>
          <div className="divide-y divide-border">
            {ALERTS.map((a, i) => (
              <AlertRow key={i} a={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ a }: { a: Alert }) {
  const isWarning = a.tag === "تنبيه";
  const iconBg = isWarning ? "bg-destructive/10" : "bg-secondary";
  const iconColor = isWarning ? "text-destructive" : "text-primary";

  return (
    <div dir="rtl" className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
      >
        {a.icon}
      </div>
      <div className="flex-1 text-right min-w-0">
        <span className="block text-[13px] font-extrabold text-foreground">{a.tag}</span>
        <p className="text-[12px] font-medium text-foreground mt-1 tracking-tight leading-snug">
          {a.text}
        </p>
        <p
          className="text-[10px] text-muted-foreground mt-0.5 font-medium"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {a.time}
        </p>
      </div>
    </div>
  );
}





/* --------------------------- Generic merchant simulator --------------------------- */
function MerchantSim({
  merchant: m,
  onBack,
  onCheckout,
}: {
  merchant: MerchantConfig;
  onBack: () => void;
  onCheckout: (amt: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const total = m.price * qty;
  const cls = m.logoStyle === "italic" ? "italic" : m.logoStyle === "lower" ? "lowercase" : "";

  return (
    <div className="bg-white min-h-full pb-6">
      <div className={`${m.logoBg} px-4 pt-6 pb-3 flex items-center justify-between`}>
        <button onClick={onBack} className={`h-9 w-9 rounded-full bg-white/10 flex items-center justify-center ${m.headerText}`}>
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
        <span className={`${m.logoText} text-[17px] font-extrabold tracking-tight ${cls}`}>{m.logoLabel}</span>
        <button className={`h-9 w-9 rounded-full bg-white/10 flex items-center justify-center ${m.headerText}`}>
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
      <div className={`${m.logoBg} px-4 pb-4`}>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-neutral-400" strokeWidth={2} />
          <span className="text-[12px] text-neutral-500 font-medium">ابحث في {m.name}</span>
        </div>
      </div>

      <div className={`relative aspect-[4/5] bg-gradient-to-br ${m.accentBg} flex items-center justify-center`}>
        <ShoppingBag className="h-24 w-24 text-neutral-300" strokeWidth={1} />
        <button className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <Heart className="h-5 w-5 text-neutral-700" strokeWidth={2} />
        </button>
      </div>

      <div className="px-4 pt-4 text-neutral-900" dir="rtl">
        <p className="text-[14px] font-extrabold leading-snug tracking-tight">{m.productTitle}</p>
        <p className="text-[11px] text-neutral-500 mt-1 font-medium">{m.productSubtitle}</p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-[11px] text-neutral-500 mr-1 font-medium">(1,284)</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[22px] font-bold text-neutral-900 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
            {m.price}
          </span>
          <span className="text-[10px] text-neutral-500 font-medium">ر.س</span>
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

        <button
          onClick={() => onCheckout(total)}
          className={`mt-5 w-full rounded-full ${m.ctaBg} ${m.ctaText} font-extrabold py-4 text-[13px] flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg`}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          إضافة للسلة — {total} ريال
        </button>
      </div>
    </div>
  );
}

/* --------------------------- All alerts screen --------------------------- */
function AllAlertRow({ a }: { a: Alert }) {
  const isWarning = a.tag === "تنبيه";
  const iconBg = isWarning ? "bg-destructive/10" : "bg-secondary";
  const iconColor = isWarning ? "text-destructive" : "text-primary";

  return (
    <div dir="rtl" className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
      >
        {a.icon}
      </div>
      <div className="flex-1 text-right min-w-0">
        <span className="block text-[13px] font-extrabold text-foreground">{a.tag}</span>
        <p className="text-[12px] font-medium text-foreground mt-1 tracking-tight leading-snug">
          {a.text}
        </p>
        <p
          className="text-[10px] text-muted-foreground mt-0.5 font-medium"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {a.time}
        </p>
      </div>
    </div>
  );
}

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
            <AllAlertRow key={i} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
