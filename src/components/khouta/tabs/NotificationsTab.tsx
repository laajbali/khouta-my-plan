import {
  ShieldCheck,
  Lightbulb,
  ShoppingBag,
  UtensilsCrossed,
  Car,
  Sparkles,
  Bell,
  ChevronLeft,
  Lock,
} from "lucide-react";

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
  {
    brand: "SHEIN",
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />,
    iconTint: "bg-mint/15 text-primary",
    tag: "تم التوفير",
    tagTone: "text-mint bg-mint/10",
    text: "تم إلغاء عملية شراء بقيمة 450 ر.س بنجاح",
    time: "منذ 20 دقيقة",
  },
  {
    brand: "هنقرستيشن",
    icon: <UtensilsCrossed className="h-5 w-5" strokeWidth={1.8} />,
    iconTint: "bg-amber-50 text-amber-700",
    tag: "تنبيه",
    tagTone: "text-destructive bg-destructive/10",
    text: "اقتربتِ من ميزانية المطاعم الأسبوعية",
    time: "منذ 3 ساعات",
  },
  {
    brand: "كريم",
    icon: <Car className="h-5 w-5" strokeWidth={1.8} />,
    iconTint: "bg-blue-50 text-blue-700",
    tag: "تنبيه",
    tagTone: "text-destructive bg-destructive/10",
    text: "مصروف المواصلات يتجاوز الحد الشهري",
    time: "منذ يوم",
  },
  {
    brand: "تذكير ادخار",
    icon: <Sparkles className="h-5 w-5" strokeWidth={1.8} />,
    iconTint: "bg-mint/15 text-primary",
    tag: "تم التوفير",
    tagTone: "text-mint bg-mint/10",
    text: "وفرتِ 120 ر.س هذا الأسبوع",
    time: "منذ يومين",
  },
];

export function NotificationsTab() {
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
          <button className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur py-3 text-[12px] font-bold text-right flex items-center gap-2 px-4">
            <Lightbulb className="h-4 w-4 text-mint shrink-0" strokeWidth={2} />
            جرّبي الميزة من أحد التطبيقين أدناه
            <ChevronLeft className="h-4 w-4 mr-auto" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">جرّبي الميزة الآن</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SimApp
            name="عباية سودا"
            subtitle="أزياء عربية"
            accent="bg-amber-900"
            icon={<ShoppingBag className="h-6 w-6 text-white" strokeWidth={1.8} />}
          />
          <SimApp
            name="SHEIN"
            subtitle="ملابس وإكسسوارات"
            accent="bg-pink-500"
            icon={<ShoppingBag className="h-6 w-6 text-white" strokeWidth={1.8} />}
          />
        </div>

        {/* Recent alerts */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button className="text-primary text-[11px] font-semibold flex items-center gap-0.5">
              عرض الكل <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <h3 className="font-extrabold text-foreground text-[14px] tracking-tight">آخر التنبيهات</h3>
          </div>
          <div className="divide-y divide-border">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
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

function SimApp({
  name,
  subtitle,
  accent,
  icon,
}: {
  name: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] bg-card border border-border overflow-hidden shadow-sm">
      <div className={`${accent} py-4 flex items-center justify-center`}>
        <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="p-3 text-center">
        <p className="font-extrabold text-foreground text-[13px] tracking-tight">{name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{subtitle}</p>
        <button className="mt-2 w-full bg-secondary text-foreground rounded-xl py-2 text-[11px] font-bold flex items-center justify-center gap-1 border border-border">
          <Lock className="h-3 w-3" strokeWidth={2} />
          محاكاة الشراء
        </button>
      </div>
    </div>
  );
}
