import { ShieldCheck } from "lucide-react";

const ALERTS = [
  { brand: "SHEIN", icon: "🔒", tag: "وفرتِ ✓", tagColor: "text-mint", text: "تنبيه شراء 450 ريال – أُلغي الطلب ✓", time: "منذ 20 دقيقة" },
  { brand: "هنقرستيشن", icon: "🍔", tag: "تنبيه", tagColor: "text-destructive", text: "اقتربتِ من ميزانية المطاعم الأسبوعية", time: "منذ 3 ساعات" },
  { brand: "كريم", icon: "🚗", tag: "تنبيه", tagColor: "text-destructive", text: "مصروف مواصلات يتجاوز الحد الشهري", time: "منذ يوم" },
  { brand: "تذكير ادخار", icon: "💚", tag: "وفرتِ ✓", tagColor: "text-mint", text: "وفرت 120 ريال هذا الأسبوع! استمري ♥", time: "منذ يومين" },
];

export function NotificationsTab() {
  return (
    <div className="bg-card">
      <div className="text-center pt-5">
        <h1 className="text-2xl font-black text-foreground">التنبيهات الذكية</h1>
        <p className="text-xs text-muted-foreground mt-1">حماية مالية في وقت التسوق</p>
      </div>

      <div className="px-5 pb-4 space-y-4 mt-5">
        <div
          className="rounded-3xl p-5 text-primary-foreground shadow-xl"
          style={{ background: "linear-gradient(160deg, oklch(0.28 0.05 155), oklch(0.18 0.04 155))" }}
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-full bg-mint/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-mint" />
            </div>
            <h3 className="font-black text-lg">الحماية المالية الفورية</h3>
          </div>
          <p className="text-sm mt-3 text-right opacity-90">
            خُطى ينبهك فوراً قبل أي عملية شراء قد تؤثر على هدفك – داخل أي تطبيق تسوق.
          </p>
          <button className="mt-4 w-full rounded-2xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-right flex items-center gap-2 px-4">
            <span>💡</span> جرّب الميزة – اضغط أحد التطبيقين أدناه
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span>👇</span>
          <h3 className="font-black text-foreground">جرّب الميزة الآن</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Abaya */}
          <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="bg-amber-900 text-white text-center py-3 font-black">
              عباية سودا
            </div>
            <div className="p-4">
              <div className="flex justify-center gap-2 mb-3">
                <span className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">👗</span>
                <span className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">✨</span>
                <span className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">🖤</span>
              </div>
              <p className="text-center text-xs text-mint font-bold mb-2">عبايات • أزياء عربية</p>
              <button className="w-full bg-amber-900 text-white rounded-2xl py-2.5 text-sm font-bold">
                افتح التطبيق ←
              </button>
            </div>
          </div>

          {/* SHEIN */}
          <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="bg-pink-400 text-white text-center py-3 font-black text-lg italic">
              SHEIN
            </div>
            <div className="p-4">
              <div className="flex justify-center gap-2 mb-3">
                <span className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">👜</span>
                <span className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">👠</span>
                <span className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">👗</span>
              </div>
              <p className="text-center text-xs text-pink-500 font-bold mb-2">ملابس • أحذية • إكسسوارات</p>
              <button className="w-full bg-pink-400 text-white rounded-2xl py-2.5 text-sm font-bold">
                افتح التطبيق ←
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button className="text-mint text-xs font-bold">عرض الكل ›</button>
            <h3 className="font-black text-foreground flex items-center gap-1">
              آخر التنبيهات 🔔
            </h3>
          </div>
          <div className="space-y-4">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <span className="text-xl shrink-0">{a.icon}</span>
                <div className="flex-1 text-right">
                  <p className={`text-xs font-bold ${a.tagColor}`}>{a.tag}</p>
                  <p className="text-sm text-foreground mt-0.5">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                </div>
                <p className="font-black text-foreground text-sm shrink-0">{a.brand}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-accent/50 border border-border p-5 space-y-4">
          <h3 className="font-black text-foreground text-right">كيف تعمل الحماية؟</h3>
          {[
            { n: "١", title: "تتسوقين من أي تطبيق", desc: "نراقب نشاطك المالي بأمان" },
            { n: "٢", title: "نكتشف الشراء فوراً", desc: "خلال ثوانٍ من الضغط" },
            { n: "٣", title: "تنبيه ذكي فوري", desc: "يحسب الأثر على هدفك تلقائياً" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black">
                {s.n}
              </div>
              <div className="flex-1 text-right">
                <p className="font-black text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
