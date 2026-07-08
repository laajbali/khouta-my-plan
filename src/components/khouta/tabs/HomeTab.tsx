import { Bell, User, ChevronLeft, Star, Check } from "lucide-react";

export function HomeTab() {
  return (
    <div className="bg-card">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5">
        <button className="relative h-11 w-11 rounded-full bg-accent flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black text-foreground flex items-center gap-1.5 justify-center">
            صباح الخير، سارة <span>👋</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">كل خطوة ذكية تقربك من هدفك</p>
        </div>
        <button className="h-11 w-11 rounded-full bg-accent flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </button>
      </div>

      <div className="px-5 pb-4 space-y-4 mt-5">
        {/* Goal card */}
        <div
          className="rounded-3xl p-5 text-primary-foreground shadow-xl"
          style={{
            background: "linear-gradient(160deg, oklch(0.28 0.05 155), oklch(0.18 0.04 155))",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-mint text-xs font-bold flex items-center gap-1">
              🎯 هدفك الحالي
            </span>
            <span className="text-[11px] opacity-70">موعد الإنجاز: ديسمبر 2026</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
              🚗
            </div>
            <div className="flex-1 text-right">
              <h2 className="text-2xl font-black">شراء سيارة 🚗</h2>
              <div className="mt-2 flex gap-1 justify-end" dir="ltr">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < 10 ? "bg-mint" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-mint mt-2">68% من الهدف</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-4 pt-4 grid grid-cols-2 divide-x divide-white/15 divide-x-reverse">
            <div className="text-center">
              <p className="text-[11px] opacity-70">يتبقى</p>
              <p className="font-black mt-1">8,000 <span className="text-xs">ر.س</span></p>
            </div>
            <div className="text-center">
              <p className="text-[11px] opacity-70">الهدف الكلي</p>
              <p className="font-black mt-1">25,000 <span className="text-xs">ر.س</span></p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-2xl border border-white/20 py-3 text-sm font-bold flex items-center justify-center gap-1">
            عرض التفاصيل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard icon="📅" title="التقويم المالي" desc="مناسبة بعد 5 أيام" bg="oklch(0.9 0.05 250)" />
          <FeatureCard icon="🤖" title="المستشار المالي" desc="اسألني أي شيء" bg="oklch(0.9 0.05 320)" />
          <FeatureCard icon="📊" title="التقارير" desc="أداء هذا الشهر" bg="oklch(0.9 0.05 155)" />
          <FeatureCard icon="🎁" title="المكافآت" desc="كوبون جديد بانتظارك" bg="oklch(0.92 0.08 85)" />
        </div>

        {/* Today summary */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-lg">
              💼
            </div>
            <h3 className="text-lg font-black text-foreground">ملخص اليوم</h3>
          </div>
          <div className="grid grid-cols-3 mt-4 text-center">
            <SummaryStat value="10" label="المتبقي" color="text-mint" />
            <SummaryStat value="35" label="تم إنفاقه" color="text-destructive" />
            <SummaryStat value="45" label="المسموح" color="text-foreground" />
          </div>
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div className="h-full bg-mint" style={{ width: "78%" }} />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-mint">
            <Check className="h-4 w-4" strokeWidth={3} /> أنت ضمن ميزانيتك اليومية
          </p>
        </div>

        {/* Latest alerts */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <button className="text-mint text-xs font-bold flex items-center gap-1">
              عرض الكل <ChevronLeft className="h-3 w-3" />
            </button>
            <h3 className="text-base font-black text-foreground flex items-center gap-1.5">
              آخر التنبيهات <span>🔔</span>
            </h3>
          </div>
          <div className="space-y-3">
            <AlertRow color="bg-destructive" text="اقتربتِ من ميزانية المطاعم هذا الأسبوع." time="منذ 20 دقيقة" />
            <AlertRow color="bg-mint" text="وفرت 120 ريال هذا الأسبوع! استمري ♥" time="منذ 3 ساعات" />
            <AlertRow color="bg-blue-500" text="غداً ينزل الراتب. خطتك جاهزة." time="منذ 5 ساعات" />
          </div>
        </div>

        {/* Commitment bar */}
        <div className="rounded-3xl bg-card border border-border p-4 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Star className="h-5 w-5 text-gold fill-gold" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-foreground">أنتِ ملتزمة بالخطة</span>
              <span className="text-xs font-black text-mint">84%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden" dir="ltr">
              <div className="h-full bg-mint rounded-full" style={{ width: "84%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, bg }: { icon: string; title: string; desc: string; bg: string }) {
  return (
    <button className="rounded-3xl bg-card border border-border p-4 text-right shadow-sm relative overflow-hidden">
      <div
        className="h-11 w-11 rounded-full flex items-center justify-center text-xl mb-3 mr-auto"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
      <h4 className="font-black text-foreground text-sm">{title}</h4>
      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
      <ChevronLeft className="h-3 w-3 text-muted-foreground absolute bottom-3 left-3" />
    </button>
  );
}

function SummaryStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">ريال</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function AlertRow({ color, text, time }: { color: string; text: string; time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${color} shrink-0`} />
      <div className="flex-1 text-right">
        <p className="text-sm text-foreground">{text}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}
