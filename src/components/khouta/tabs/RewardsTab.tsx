import { Bell, Clock } from "lucide-react";
import { useState } from "react";

const FILTERS = ["منتهية", "قيد الإستخدام", "متاحة الآن", "الكل"];

const COUPONS = [
  { brand: "SHEIN", brandBg: "bg-black", brandColor: "text-white", pct: 20, min: 150, days: 7, btn: "bg-pink-200 text-pink-900" },
  { brand: "جاهز\nJahez", brandBg: "bg-red-500", brandColor: "text-white", pct: 15, min: 60, days: 10, btn: "bg-red-200 text-red-900" },
  { brand: "نون\nnoon", brandBg: "bg-yellow-400", brandColor: "text-black", pct: 10, min: 200, days: 12, btn: "bg-yellow-200 text-yellow-900" },
  { brand: "FLOWARD\nفلورارد", brandBg: "bg-emerald-700", brandColor: "text-white", pct: 25, min: 120, days: 14, btn: "bg-emerald-200 text-emerald-900" },
];

export function RewardsTab() {
  const [filter, setFilter] = useState("الكل");

  return (
    <div className="bg-card">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="w-11" />
        <div className="text-center">
          <h1 className="text-2xl font-black text-foreground">المكافآت</h1>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            🌱 كل مكافأة هي خطوة نحو هدفك
          </p>
        </div>
        <button className="relative h-11 w-11 rounded-full bg-accent flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      <div className="px-5 pb-4 space-y-4 mt-5">
        {/* Achievement card */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm flex items-center gap-4">
          <div className="text-5xl">🎁</div>
          <div className="flex-1 text-right">
            <h3 className="font-black text-foreground">أحسنتِ! التزامك يحقق مكافآت رائعة</h3>
            <p className="text-xs text-muted-foreground mt-1">إجمالي ما وفرته حتى الآن</p>
            <p className="text-2xl font-black text-foreground mt-1">
              2,870 <span className="text-sm text-muted-foreground">ريال</span>
            </p>
            <p className="text-xs text-mint font-bold mt-1">🎁 مكافآت مكتسبة: 8</p>
          </div>
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 40 40" className="h-16 w-16 -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${0.28 * 100} 100`} pathLength={100} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-foreground">28%</span>
              <span className="text-[8px] text-muted-foreground">من هدفك</span>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-accent rounded-full p-1.5 justify-end">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button className="text-xs text-muted-foreground">الأحدث ↓</button>
          <h3 className="font-black text-foreground flex items-center gap-1">
            الكوبونات المتاحة 🏷️
          </h3>
        </div>

        <div className="space-y-3">
          {COUPONS.map((c, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden flex">
              <div className={`w-16 ${c.brandBg} ${c.brandColor} flex items-center justify-center text-xs font-bold text-center whitespace-pre-line`}>
                {c.brand}
              </div>
              <div className="flex-1 p-3 flex justify-between items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">{c.pct}%</p>
                  <p className="text-[10px] text-muted-foreground">خصم</p>
                  <button className={`mt-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${c.btn}`}>
                    استخدم الآن
                  </button>
                </div>
                <div className="flex-1 text-right">
                  <p className="font-bold text-foreground text-sm">خصم على {i === 1 || i === 3 ? "طلباتك" : "مشترياتك"} في {c.brand.split("\n")[0]}</p>
                  <p className="text-xs text-mint mt-1">الحد الأدنى {c.min} ريال</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1 justify-end">
                    صالح {c.days} أيام <Clock className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-black text-foreground flex items-center gap-1 pt-2">
          مكافآت تم استخدامها 🔒
        </h3>

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden flex opacity-70">
          <div className="w-16 bg-gray-500 text-white flex items-center justify-center text-xs font-bold text-center whitespace-pre-line">
            HUNGER{"\n"}STATION
          </div>
          <div className="flex-1 p-3 flex justify-between items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-black text-muted-foreground">10%</p>
              <div className="mt-1.5 rounded-full px-3 py-1 text-[10px] font-bold bg-secondary text-muted-foreground">
                ✓ تم
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="font-bold text-muted-foreground text-sm">خصم على طلباتك في هنقرستيشن</p>
              <p className="text-xs text-muted-foreground mt-1">الحد الأدنى 50 ريال</p>
              <p className="text-[10px] text-muted-foreground mt-1.5">🕐 تم استخدامه 20 يونيو</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl p-4 text-primary-foreground text-center flex items-center gap-3"
          style={{ background: "linear-gradient(160deg, oklch(0.28 0.05 155), oklch(0.18 0.04 155))" }}
        >
          <div className="h-10 w-10 rounded-full bg-mint/20 flex items-center justify-center">
            🛡️
          </div>
          <div className="flex-1 text-right">
            <p className="font-black text-sm flex items-center justify-end gap-1">
              كل قرار ذكي يقربك من هدفك 💎
            </p>
            <p className="text-xs opacity-80 mt-1">
              استمر للحصول على المزيد من المكافآت الحصرية 🎁
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
