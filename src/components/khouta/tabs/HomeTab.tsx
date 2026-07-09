import {
  Bell,
  ArrowLeftRight,
  Receipt,
  QrCode,
  LayoutGrid,
  ShoppingBag,
  ArrowDownLeft,
  ChevronLeft,
  Sparkles,
  Calendar,
  BarChart3,
  Gift,
  Car,
  Building2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";


export function HomeTab({
  onOpenNoor,
  onOpenBank,
  onOpenTransfer,
  onOpenPay,
  onOpenQr,
  onOpenMore,
  onOpenStatement,
  onOpenGoal,
  onOpenNewGoal,
  onOpenCalendar,
  onOpenNotifications,
  onOpenReports,
  onOpenRewards,
  onOpenProfile,
}: {
  onOpenNoor: () => void;
  onOpenBank: () => void;
  onOpenTransfer: () => void;
  onOpenPay: () => void;
  onOpenQr: () => void;
  onOpenMore: () => void;
  onOpenStatement: () => void;
  onOpenGoal: () => void;
  onOpenNewGoal: () => void;
  onOpenCalendar: () => void;
  onOpenNotifications: () => void;
  onOpenReports: () => void;
  onOpenRewards: () => void;
  onOpenProfile: () => void;
}) {
  const profile = useProfile();
  const { goals } = useGoals();
  const displayName = profile?.full_name?.trim() || "بكِ";
  const firstName = displayName.split(" ")[0];
  const initial = firstName.charAt(0) || "خ";
  const topGoal = goals[0];

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="pt-6 px-5 pb-3 flex justify-between items-center bg-card">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 active:scale-95 transition"
          aria-label="الحساب"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-extrabold text-base shadow-sm">
              {initial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-mint border-2 border-card rounded-full" />
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[11px] font-medium tracking-tight">أهلاً،</p>
            <h2 className="text-foreground font-extrabold text-[15px] leading-tight tracking-tight">
              {displayName}
            </h2>
          </div>
        </button>
        <button
          onClick={onOpenNotifications}
          className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center border border-border text-foreground relative active:scale-95 transition"
          aria-label="التنبيهات"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-destructive rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            3
          </span>
        </button>
      </div>

      {/* Wallet Card */}
      <div className="px-5 pt-3 bg-card">
        <button
          onClick={onOpenStatement}
          className="w-full text-right rounded-[28px] p-5 text-primary-foreground relative overflow-hidden active:scale-[0.99] transition"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.34 0.07 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.12 0.03 155) 100%)",
            boxShadow: "0 24px 48px -22px oklch(0.20 0.05 155 / 0.65)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-mint/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-primary/25 rounded-full blur-3xl" />

          <div className="relative flex justify-between items-start mb-7">
            <div>
              <p className="text-white/55 text-[10px] font-semibold tracking-[0.15em] uppercase">الرصيد المتاح</p>
              <h3
                className="text-[2.15rem] font-bold mt-1.5 tracking-tight leading-none text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                12,450<span className="text-xl text-white/60 font-semibold">.00</span>
                <span className="text-[11px] font-bold mr-2 text-mint tracking-wider">ر.س</span>
              </h3>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black tracking-[0.2em] text-white/60 uppercase">mada</p>
              <p className="text-mint text-xs font-extrabold mt-0.5 tracking-tight">خُطى</p>
            </div>
          </div>

          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-[9px] text-white/45 uppercase tracking-[0.2em] font-semibold">الحساب الجاري</p>
              <p className="text-sm font-bold mt-1 text-white/95" dir="ltr" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
                •••• 9284
              </p>
            </div>
            <span className="bg-white/12 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] font-bold border border-white/20 text-white flex items-center gap-1">
              كشف الحساب
              <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
            </span>
          </div>
        </button>
      </div>


      {/* Quick Actions */}
      <div className="px-5 py-6 grid grid-cols-4 gap-2 bg-card">
        <QuickAction onClick={onOpenTransfer} icon={<ArrowLeftRight strokeWidth={1.7} className="w-5 h-5" />} label="تحويل" tint="bg-mint/15 text-primary" />
        <QuickAction onClick={onOpenPay} icon={<Receipt strokeWidth={1.7} className="w-5 h-5" />} label="سداد" tint="bg-blue-50 text-blue-700" />
        <QuickAction onClick={onOpenQr} icon={<QrCode strokeWidth={1.7} className="w-5 h-5" />} label="باركود" tint="bg-amber-50 text-amber-700" />
        <QuickAction onClick={onOpenMore} icon={<LayoutGrid strokeWidth={1.7} className="w-5 h-5" />} label="المزيد" tint="bg-secondary text-muted-foreground" />
      </div>

      {/* Body */}
      <div className="px-5 pt-1 space-y-5 bg-background">
        {/* Open Banking CTA */}
        <button
          onClick={onOpenBank}
          className="w-full rounded-[24px] p-4 bg-card border border-primary/30 flex items-center gap-3 hover:border-primary/50 active:scale-[0.99] transition text-right"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">اربطي حساباتك البنكية</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Open Banking معتمد من ساما — تحليل تلقائي لمصروفاتك
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" strokeWidth={1.8} />
          </div>
        </button>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" strokeWidth={2} />}
            title="المستشار نور"
            desc="اسألي أي شيء مالي"
            metric="جديد"
            metricTone="text-primary bg-primary/10"
            tint="bg-primary/10 text-primary"
            onClick={onOpenNoor}
          />
          <FeatureCard
            icon={<Calendar className="h-5 w-5" strokeWidth={2} />}
            title="التقويم المالي"
            desc="مناسبة بعد 5 أيام"
            metric="5 أيام"
            metricTone="text-blue-700 bg-blue-50"
            tint="bg-blue-50 text-blue-700"
            onClick={onOpenCalendar}
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" strokeWidth={2} />}
            title="التقارير"
            desc="وفرتِ هذا الشهر"
            metric="+18%"
            metricTone="text-mint bg-mint/15"
            tint="bg-mint/15 text-primary"
            onClick={onOpenReports}
          />
          <FeatureCard
            icon={<Gift className="h-5 w-5" strokeWidth={2} />}
            title="المكافآت"
            desc="كوبون بانتظارك"
            metric="2 جديدة"
            metricTone="text-amber-700 bg-amber-100"
            tint="bg-amber-50 text-amber-700"
            onClick={onOpenRewards}
          />
        </div>


        {/* Goal Card — gold + white balanced */}
        <div
          className="relative rounded-[26px] overflow-hidden border border-border shadow-[0_20px_40px_-24px_rgb(0_0_0/0.15)]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.99 0.01 90) 0%, oklch(0.97 0.03 85) 55%, oklch(0.94 0.06 82) 100%)",
          }}
        >
          {/* Gold shimmer accent */}
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl" style={{ background: "oklch(0.85 0.14 85 / 0.35)" }} />
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-lg text-primary-foreground"
                style={{ background: "linear-gradient(135deg, oklch(0.28 0.05 155), oklch(0.20 0.05 155))" }}
              >
                هدفك الحالي
              </span>
              <h4 className="text-[13px] font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                هدف الادخار
              </h4>
            </div>

            {topGoal ? (
              <>
                <button onClick={onOpenGoal} className="w-full flex items-center gap-4 text-right">
                  <ProgressRing
                    percent={Math.min(
                      100,
                      Math.round((Number(topGoal.saved_amount) / Number(topGoal.target_amount)) * 100),
                    )}
                  />
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <p className="text-[15px] font-black text-foreground tracking-tight truncate">{topGoal.title}</p>
                      <Car className="h-4 w-4 text-primary" strokeWidth={1.8} />
                    </div>
                    <p
                      className="text-[11px] text-muted-foreground mt-1 font-medium truncate"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      متبقٍ{" "}
                      <span className="text-foreground font-bold">
                        {Math.max(0, Number(topGoal.target_amount) - Number(topGoal.saved_amount)).toLocaleString()} ر.س
                      </span>
                    </p>
                  </div>
                </button>

                {/* White stat pills */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-card/90 border border-white/60 p-2.5 text-right shadow-sm">
                    <p className="text-[9.5px] text-muted-foreground font-semibold uppercase tracking-wider">المستهدف</p>
                    <p className="text-[15px] font-black text-foreground mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {Number(topGoal.target_amount).toLocaleString()}
                      <span className="text-[10px] text-muted-foreground mr-1 font-bold">ر.س</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-card/90 border border-white/60 p-2.5 text-right shadow-sm">
                    <p className="text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: "oklch(0.55 0.15 85)" }}>
                      المدخر
                    </p>
                    <p className="text-[15px] font-black mt-0.5" style={{ color: "oklch(0.45 0.15 85)", fontVariantNumeric: "tabular-nums" }}>
                      {Number(topGoal.saved_amount).toLocaleString()}
                      <span className="text-[10px] mr-1 font-bold" style={{ color: "oklch(0.55 0.15 85)" }}>ر.س</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenGoal}
                  className="mt-3 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-[12px] font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-[0.99] transition"
                >
                  عرض التفاصيل
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-right py-2 font-medium">
                لا يوجد هدف بعد — ابدئي بإنشاء أول هدف لك
              </p>
            )}

            <button
              onClick={onOpenNewGoal}
              className="mt-2.5 w-full py-2 rounded-xl border border-dashed border-foreground/15 text-[11px] font-bold text-foreground/70 flex items-center justify-center gap-1 hover:border-primary/40 hover:text-primary transition"
            >
              <Plus className="h-3.5 w-3.5" /> إضافة هدف جديد
            </button>
          </div>
        </div>


        {/* Today Budget */}
        <button
          onClick={() => toast("ميزانية اليوم — 10 ر.س متبقية")}
          className="w-full text-right bg-card rounded-[24px] p-4 border border-border active:scale-[0.99] transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-mint bg-mint/10 px-2 py-1 rounded-lg">
              ضمن الميزانية
            </span>
            <h4 className="text-sm font-bold text-foreground">ميزانية اليوم</h4>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              المتبقي <span className="text-mint font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>10 ر.س</span>
            </span>
            <div className="text-right" style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="text-xl font-semibold text-foreground">35</span>
              <span className="text-xs text-muted-foreground"> / 45 ر.س</span>
            </div>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div
              className="h-full rounded-full bg-gradient-to-l from-mint to-primary"
              style={{ width: "78%" }}
            />
          </div>
        </button>


        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={onOpenStatement}
              className="text-primary text-xs font-semibold flex items-center gap-0.5"
            >
              الكل <ChevronLeft className="w-3 h-3" />
            </button>
            <h4 className="text-sm font-bold text-foreground">العمليات الأخيرة</h4>
          </div>
          <div className="bg-card rounded-[24px] border border-border divide-y divide-border">
            <TransactionRow
              onClick={onOpenStatement}
              icon={<ShoppingBag className="w-5 h-5" strokeWidth={1.7} />}
              iconBg="bg-secondary text-muted-foreground"
              title="سوبر ماركت لولو"
              time="اليوم، 09:24 ص"
              amount="-124.50"
              positive={false}
            />
            <TransactionRow
              onClick={onOpenStatement}
              icon={<ArrowDownLeft className="w-5 h-5" strokeWidth={1.7} />}
              iconBg="bg-mint/15 text-primary"
              title="تحويل من خالد فهد"
              time="أمس، 02:15 م"
              amount="+500.00"
              positive={true}
            />
            <TransactionRow
              onClick={onOpenStatement}
              icon={<Receipt className="w-5 h-5" strokeWidth={1.7} />}
              iconBg="bg-blue-50 text-blue-700"
              title="فاتورة الكهرباء"
              time="أمس، 10:02 ص"
              amount="-182.00"
              positive={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  tint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 active:scale-95 transition"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tint}`}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-foreground">{label}</span>
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tint,
  metric,
  metricTone,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tint: string;
  metric?: string;
  metricTone?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-card border border-border p-4 text-right relative overflow-hidden active:scale-[0.98] transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tint}`}>
          {icon}
        </div>
        {metric && (
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-lg ${metricTone ?? "text-primary bg-primary/10"}`}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {metric}
          </span>
        )}
      </div>
      <h4 className="font-extrabold text-foreground text-[14px] tracking-tight">{title}</h4>
      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{desc}</p>
      <ChevronLeft className="h-3 w-3 text-muted-foreground/70 absolute bottom-3 left-3" strokeWidth={2.5} />
    </button>
  );
}


function ProgressRing({ percent }: { percent: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (percent / 100) * c;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="oklch(0.93 0.015 150)" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="oklch(0.28 0.05 155)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-primary"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {percent}%
      </span>
    </div>
  );
}

function TransactionRow({
  icon,
  iconBg,
  title,
  time,
  amount,
  positive,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  amount: string;
  positive: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-3.5 text-right hover:bg-secondary/40 transition"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-foreground">{title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
        </div>
      </div>
      <span
        className={`text-sm font-semibold ${positive ? "text-mint" : "text-foreground"}`}
        dir="ltr"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {amount}
      </span>
    </button>
  );
}
