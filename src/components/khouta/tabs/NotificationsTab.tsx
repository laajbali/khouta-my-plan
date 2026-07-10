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
  Zap,
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
  { brand: "شي إن", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "توفير", tagTone: "text-mint bg-mint/10", text: "تم إلغاء عملية شراء بقيمة 240 ر.س بنجاح", time: "منذ 12 دقيقة" },
  { brand: "تنبيه ميزانية", icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-amber-50 text-amber-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "اقتربت من الحد الأسبوعي للمطاعم", time: "منذ 3 ساعات" },
  { brand: "اقتراح ذكي", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-primary/10 text-primary", tag: "اقتراح", tagTone: "text-primary bg-primary/10", text: "يمكنك توفير 200 ر.س هذا الأسبوع", time: "منذ 5 ساعات" },
  { brand: "تنبيه استثماري", icon: <Coins className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-amber-100 text-amber-800", tag: "استثمار", tagTone: "text-amber-800 bg-amber-50", text: "انخفض سعر الذهب اليوم 1.4% — فرصة شراء", time: "منذ يوم" },
];

const ALL_ALERTS: Alert[] = [
  ...ALERTS,
  { brand: "شي إن", icon: <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "توفير", tagTone: "text-mint bg-mint/10", text: "تم إلغاء عملية شراء بقيمة 450 ر.س بنجاح", time: "منذ يومين" },
  { brand: "تنبيه", icon: <TrendingDown className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-orange-50 text-orange-700", tag: "تنبيه", tagTone: "text-destructive bg-destructive/10", text: "تجاوز ميزانية التسوق الشهرية", time: "منذ 4 أيام" },
  { brand: "معلومة", icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-purple-50 text-purple-700", tag: "معلومة", tagTone: "text-blue-700 bg-blue-50", text: "تم استلام راتبك الشهري", time: "منذ 5 أيام" },
  { brand: "إنجاز", icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />, iconTint: "bg-mint/15 text-primary", tag: "إنجاز", tagTone: "text-mint bg-mint/10", text: "وصلتِ إلى 30% من هدف السيارة", time: "منذ أسبوع" },
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
        {/* Hero — الرادار المالي الذكي */}
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
            <span className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-1 rounded-lg bg-mint text-primary">AI</span>
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-mint" strokeWidth={1.8} />
            </div>
          </div>
          <h3 className="font-extrabold text-[17px] text-right tracking-tight">الرادار المالي الذكي</h3>
          <p className="text-[12px] mt-2 text-right text-white/75 font-medium leading-relaxed">
            يقوم الذكاء الاصطناعي بتحليل عملية الشراء قبل إتمامها لحماية خطتك المالية.
          </p>
          <button
            onClick={() => setSimKey("SHEIN")}
            className="mt-4 w-full rounded-2xl bg-mint text-primary font-extrabold py-3.5 text-[13px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.2} />
            افتح شي إن
          </button>
        </div>

        {/* Donation / خُطى Radar (yellow card — moved from Home) */}
        <div
          className="rounded-[24px] p-4 shadow-sm border relative overflow-hidden"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.97 0.06 85) 0%, oklch(0.99 0.02 85) 100%)",
            borderColor: "oklch(0.85 0.10 85 / 0.5)",
          }}
        >
          <div className="flex items-start gap-3">
            <img
              src={ihsanLogo.url}
              alt="إحسان"
              className="h-12 w-12 rounded-2xl object-contain bg-white/60 p-1 shrink-0"
            />
            <div className="flex-1 text-right min-w-0">
              <p className="text-[14px] font-black text-foreground tracking-tight leading-snug">
                العطاء لا يوقف رحلتك نحو هدفك..
              </p>
              <p className="text-[11.5px] text-foreground/70 font-medium mt-1 leading-relaxed">
                فربما يكون سبباً في بركة ما تملك.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDonate}
            className="mt-4 w-full rounded-2xl text-white font-extrabold py-3 text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition"
            style={{ background: "oklch(0.24 0.05 155)" }}
          >
            <Heart className="h-4 w-4" strokeWidth={2.2} />
            تبرع بجزء
          </button>
        </div>

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
        <span className={`${m.logoText} text-[22px] font-black tracking-tight ${cls}`}>{m.logoLabel}</span>
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
        <p className="text-[15px] font-bold leading-snug">{m.productTitle}</p>
        <p className="text-[11px] text-neutral-500 mt-1">{m.productSubtitle}</p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-[11px] text-neutral-500 mr-1">(1,284)</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-[22px] font-black text-neutral-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {m.price} ر.س
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

        <button
          onClick={() => onCheckout(total)}
          className={`mt-5 w-full rounded-full ${m.ctaBg} ${m.ctaText} font-black py-4 text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg`}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          إضافة للسلة — {total} ريال
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
