import {
  User,
  Camera,
  Edit,
  Star,
  Bell,
  Globe,
  Lock,
  DollarSign,
  Sun,
  HelpCircle,
  Info,
  Share2,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

const SETTINGS = [
  { icon: Globe, label: "اللغة", value: "العربية", tint: "bg-blue-50 text-blue-700", action: "تغيير لغة التطبيق قريباً" },
  { icon: Bell, label: "الإشعارات", value: "إدارة التنبيهات", tint: "bg-amber-50 text-amber-700", action: "فتح إعدادات التنبيهات" },
  { icon: DollarSign, label: "العملة", value: "ريال سعودي", tint: "bg-mint/15 text-primary", action: "العملة الحالية: ريال سعودي" },
  { icon: Lock, label: "الأمان", value: "إعدادات الحماية", tint: "bg-destructive/10 text-destructive", action: "فتح إعدادات الأمان" },
  { icon: Sun, label: "طريقة العرض", value: "الوضع الفاتح", tint: "bg-amber-50 text-amber-700", action: "تبديل الوضع الليلي قريباً" },
  { icon: HelpCircle, label: "المساعدة", value: "الأسئلة الشائعة", tint: "bg-secondary text-muted-foreground", action: "فتح مركز المساعدة" },
  { icon: Info, label: "عن خُطى", value: "الإصدار 1.0.0", tint: "bg-blue-50 text-blue-700", action: "خُطى — رفيقتك المالية الذكية" },
  { icon: Share2, label: "شارك التطبيق", value: "ادعي أصدقاءك", tint: "bg-primary/10 text-primary", action: "تم نسخ رابط الدعوة" },
];

export function ProfileTab() {
  const profile = useProfile();
  const { user } = useSession();
  const { goals } = useGoals();
  const topGoal = goals[0];
  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "مستخدم خُطى";
  const commitment = profile?.commitment_score ?? 0;

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
  }

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
        <div className="w-11" />
        <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">الحساب</h1>
        <button
          onClick={() => toast("لا توجد تنبيهات جديدة")}
          className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
        >
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive border-2 border-card text-white text-[9px] font-bold flex items-center justify-center" style={{ fontVariantNumeric: "tabular-nums" }}>
            3
          </span>
        </button>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Profile card */}
        <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <User className="h-9 w-9" strokeWidth={1.8} />
              </div>
              <button
                onClick={() => toast("قريباً: تغيير صورة الملف الشخصي")}
                className="absolute -bottom-1 -left-1 h-7 w-7 rounded-xl bg-card border border-border text-foreground flex items-center justify-center shadow-sm active:scale-95 transition"
              >
                <Camera className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 text-right min-w-0">
              <button
                onClick={() => toast("قريباً: تعديل الاسم")}
                className="flex items-center gap-2 justify-end w-full active:scale-95 transition"
              >
                <Edit className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <h2 className="text-[15px] font-extrabold text-foreground tracking-tight truncate">{displayName}</h2>
              </button>
              <p className="text-[11px] text-muted-foreground mt-1 truncate font-medium">
                {user?.email ?? "مستقبلك المالي بين يديك"}
              </p>
              <div className="mt-3 rounded-2xl bg-secondary/60 border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-amber-700">
                      {commitment >= 70 ? "ممتاز" : commitment >= 40 ? "جيد" : "ابدئي رحلتك"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium text-right">مستوى الالتزام</p>
                </div>
                <p className="text-[22px] font-bold text-foreground text-right leading-none mt-1 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {commitment}<span className="text-[13px] text-muted-foreground font-semibold">%</span>
                </p>
                <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden" dir="ltr">
                  <div className="h-full bg-gradient-to-l from-mint to-primary rounded-full" style={{ width: `${commitment}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current plan */}
        {topGoal ? (
          <div className="rounded-[24px] bg-card border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-mint bg-mint/10 px-2 py-1 rounded-lg">نشط</span>
              <h3 className="text-right font-extrabold text-foreground text-[14px] tracking-tight">الخطة الحالية</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Target className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="flex-1 flex justify-between items-center min-w-0">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium">الهدف</p>
                  <p className="font-extrabold text-foreground text-[13px] truncate tracking-tight">{topGoal.title}</p>
                </div>
                <div className="text-right shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <p className="text-[10px] text-muted-foreground font-medium">المستهدف</p>
                  <p className="font-bold text-foreground text-[14px] tracking-tight">
                    {Number(topGoal.target_amount).toLocaleString()}
                    <span className="text-[10px] text-muted-foreground mr-1 font-semibold">ر.س</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-right font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
              المتبقي {Math.max(0, Number(topGoal.target_amount) - Number(topGoal.saved_amount)).toLocaleString()} ر.س
            </p>
            <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden" dir="ltr">
              <div
                className="h-full bg-gradient-to-l from-mint to-primary rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((Number(topGoal.saved_amount) / Number(topGoal.target_amount)) * 100))}%`,
                }}
              />
            </div>
          </div>
        ) : null}

        <h3 className="text-right font-extrabold text-foreground text-[14px] tracking-tight mt-2">الإعدادات والتفضيلات</h3>

        <div className="grid grid-cols-2 gap-3">
          {SETTINGS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => toast(s.action)}
                className="rounded-2xl bg-card border border-border p-3 shadow-sm flex items-center gap-2 active:scale-[0.98] transition hover:border-primary/30"
              >
                <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" strokeWidth={2.5} />
                <div className="flex-1 text-right min-w-0">
                  <p className="font-extrabold text-foreground text-[12px] tracking-tight truncate">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate font-medium">{s.value}</p>
                </div>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.tint}`}>
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[20px] bg-mint/10 border border-mint/25 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-mint/20 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-right">
            <p className="font-extrabold text-foreground text-[13px] tracking-tight">أمان بياناتك أولويتنا</p>
            <p className="text-[11px] text-muted-foreground font-medium">تشفير كامل ومعايير حماية بنكية</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive font-extrabold py-3.5 flex items-center justify-center gap-2 text-[13px] tracking-tight active:scale-[0.99] transition"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
