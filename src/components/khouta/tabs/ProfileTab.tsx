import {
  User,
  Camera,
  Edit,
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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-khouta-data";
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

export function ProfileTab({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const profile = useProfile();
  const { user } = useSession();
  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "دينا";

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
          onClick={onOpenNotifications}
          aria-label="التنبيهات"
          className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
        >
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive border-2 border-card text-white text-[9px] font-bold flex items-center justify-center" style={{ fontVariantNumeric: "tabular-nums" }}>
            3
          </span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Premium dark green profile card */}
        <div
          className="relative rounded-[24px] overflow-hidden text-white shadow-[0_24px_48px_-24px_oklch(0.20_0.05_155/0.55)] px-5 py-5 flex items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.30 0.06 155) 0%, oklch(0.20 0.05 155) 60%, oklch(0.13 0.04 155) 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-mint/20 rounded-full blur-3xl" />
          <div className="relative shrink-0">
            <div className="h-[76px] w-[76px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <User className="h-9 w-9" strokeWidth={1.5} />
            </div>
            <button
              onClick={() => toast("قريباً: تغيير صورة الملف الشخصي")}
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-mint text-primary border-[3px] border-[oklch(0.20_0.05_155)] flex items-center justify-center shadow-md active:scale-95 transition"
              aria-label="تغيير الصورة"
            >
              <Camera className="h-3 w-3" strokeWidth={2.4} />
            </button>
          </div>
          <div className="relative flex-1 text-right min-w-0">
            <button
              onClick={() => toast("قريباً: تعديل الاسم")}
              className="flex items-center gap-1.5 justify-end w-full"
            >
              <Edit className="h-3.5 w-3.5 text-mint" strokeWidth={2} />
              <h2 className="text-[19px] font-black tracking-tight truncate">{displayName}</h2>
            </button>
            <p className="text-[11.5px] text-white/70 mt-1 font-medium truncate" dir="ltr">
              {user?.email ?? "dina@khouta.app"}
            </p>
            <p className="text-[11px] text-mint mt-2 font-semibold tracking-tight">
              مستقبلك المالي بين يديك
            </p>
          </div>
        </div>

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
