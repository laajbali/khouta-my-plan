import {
  Bell,
  ArrowLeftRight,
  Receipt,
  QrCode,
  LayoutGrid,
  ShoppingBag,
  ArrowDownLeft,
  ChevronLeft,
} from "lucide-react";

export function HomeTab() {
  return (
    <div className="bg-background">
      {/* Header */}
      <div className="pt-6 px-5 pb-3 flex justify-between items-center bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm">
              س
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-mint border-2 border-card rounded-full" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">صباح الخير،</p>
            <h2 className="text-foreground font-black text-base leading-none mt-1">
              سارة أحمد
            </h2>
          </div>
        </div>
        <button className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center border border-border text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </button>
      </div>

      {/* Wallet Card */}
      <div className="px-5 pt-3 bg-card">
        <div
          className="w-full rounded-[28px] p-5 text-primary-foreground relative overflow-hidden shadow-xl"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.32 0.06 155) 0%, oklch(0.20 0.05 155) 60%, oklch(0.15 0.04 155) 100%)",
            boxShadow: "0 20px 40px -20px oklch(0.28 0.05 155 / 0.5)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-mint/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

          <div className="relative flex justify-between items-start mb-6">
            <div>
              <p className="text-white/60 text-xs font-medium">الرصيد المتاح</p>
              <h3 className="text-[2rem] font-black mt-1 tracking-tight leading-none">
                12,450<span className="text-lg font-bold text-white/70">.00</span>
                <span className="text-sm font-medium mr-2 text-white/70">ر.س</span>
              </h3>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                mada
              </p>
              <p className="text-mint text-xs font-black mt-0.5">خُطى</p>
            </div>
          </div>

          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">
                الحساب الجاري
              </p>
              <p className="text-sm font-bold mt-0.5" dir="ltr">
                •••• 9284
              </p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] font-bold transition border border-white/15">
              كشف الحساب
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-6 grid grid-cols-4 gap-2 bg-card">
        <QuickAction
          icon={<ArrowLeftRight className="w-5 h-5" />}
          label="تحويل"
          tint="bg-mint/15 text-primary"
        />
        <QuickAction
          icon={<Receipt className="w-5 h-5" />}
          label="سداد"
          tint="bg-blue-50 text-blue-700"
        />
        <QuickAction
          icon={<QrCode className="w-5 h-5" />}
          label="باركود"
          tint="bg-amber-50 text-amber-700"
        />
        <QuickAction
          icon={<LayoutGrid className="w-5 h-5" />}
          label="المزيد"
          tint="bg-secondary text-muted-foreground"
        />
      </div>

      {/* Body */}
      <div className="px-5 pb-6 pt-1 space-y-5 bg-background">
        {/* Goal Card */}
        <div className="bg-card rounded-[24px] p-4 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-black text-foreground">أهداف الادخار</h4>
            <button className="text-primary text-[10px] font-bold px-2.5 py-1 bg-accent rounded-lg">
              إضافة هدف
            </button>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing percent={68} />
            <div className="flex-1 text-right">
              <p className="text-sm font-bold text-foreground">
                توفير لشراء سيارة 🚗
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                متبقي 8,000 ر.س من إجمالي 25,000 ر.س
              </p>
            </div>
          </div>
        </div>

        {/* Today Budget */}
        <div className="bg-card rounded-[24px] p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-mint bg-mint/10 px-2 py-1 rounded-lg">
              ضمن الميزانية
            </span>
            <h4 className="text-sm font-black text-foreground">ميزانية اليوم</h4>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              المتبقي <span className="text-mint font-bold">10 ر.س</span>
            </span>
            <div className="text-right">
              <span className="text-2xl font-black text-foreground">35</span>
              <span className="text-xs text-muted-foreground"> / 45 ر.س</span>
            </div>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div
              className="h-full rounded-full bg-gradient-to-l from-mint to-primary"
              style={{ width: "78%" }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <button className="text-primary text-xs font-bold flex items-center gap-0.5">
              الكل <ChevronLeft className="w-3 h-3" />
            </button>
            <h4 className="text-sm font-black text-foreground">العمليات الأخيرة</h4>
          </div>
          <div className="bg-card rounded-[24px] border border-border divide-y divide-border">
            <TransactionRow
              icon={<ShoppingBag className="w-5 h-5" />}
              iconBg="bg-secondary text-muted-foreground"
              title="سوبر ماركت لولو"
              time="اليوم، 09:24 ص"
              amount="-124.50"
              positive={false}
            />
            <TransactionRow
              icon={<ArrowDownLeft className="w-5 h-5" />}
              iconBg="bg-mint/15 text-primary"
              title="تحويل من خالد فهد"
              time="أمس، 02:15 م"
              amount="+500.00"
              positive={true}
            />
            <TransactionRow
              icon={<Receipt className="w-5 h-5" />}
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
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
}) {
  return (
    <button className="flex flex-col items-center gap-2 active:scale-95 transition">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${tint}`}
      >
        {icon}
      </div>
      <span className="text-[11px] font-bold text-foreground">{label}</span>
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
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="oklch(0.93 0.015 150)"
          strokeWidth="5"
        />
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
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-primary">
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
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  amount: string;
  positive: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-3.5">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-foreground">{title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
        </div>
      </div>
      <span
        className={`text-sm font-black ${
          positive ? "text-mint" : "text-foreground"
        }`}
        dir="ltr"
      >
        {amount}
      </span>
    </div>
  );
}
