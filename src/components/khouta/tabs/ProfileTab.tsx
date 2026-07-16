import { useState } from "react";
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
  Settings as SettingsIcon,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-khouta-data";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";


const PREFERENCES = [
  { icon: Bell, label: "الإشعارات", value: "إدارة التنبيهات", tint: "bg-primary/10 text-primary", action: "فتح إعدادات التنبيهات" },
  { icon: Globe, label: "اللغة", value: "العربية", tint: "bg-primary/10 text-primary", action: "تغيير لغة التطبيق قريباً" },
  { icon: Lock, label: "الأمان", value: "إعدادات الحماية", tint: "bg-destructive/10 text-destructive", action: "فتح إعدادات الأمان" },
  { icon: DollarSign, label: "العملة", value: "ريال سعودي", tint: "bg-primary/10 text-primary", action: "العملة الحالية: ريال سعودي" },
  { icon: Sun, label: "طريقة العرض", value: "الوضع الفاتح", tint: "bg-primary/10 text-primary", action: "تبديل الوضع الليلي قريباً" },
  { icon: Info, label: "عن خُطى", value: "الإصدار 1.0.0", tint: "bg-primary/10 text-primary", action: "خُطى — رفيقتك المالية الذكية" },
  { icon: Share2, label: "شارك التطبيق", value: "ادعي أصدقاءك", tint: "bg-primary/10 text-primary", action: "تم نسخ رابط الدعوة" },
  { icon: HelpCircle, label: "المساعدة", value: "الأسئلة الشائعة", tint: "bg-secondary text-muted-foreground", action: "فتح مركز المساعدة" },
];

export function ProfileTab({
  onOpenNotifications,
  onSignOut,
}: {
  onOpenNotifications?: () => void;
  onSignOut?: () => void | Promise<void>;
}) {
  const profile = useProfile();
  const { user } = useSession();
  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "دينا";
  const [view, setView] = useState<"root" | "settings">("root");

  async function signOut() {
    toast.success("تم تسجيل الخروج");
    if (onSignOut) {
      await onSignOut();
    } else {
      await supabase.auth.signOut();
    }
  }

  if (view === "settings") {
    return (
      <div className="bg-background pb-4">
        <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-card">
          <div className="w-11" />
          <h1 className="text-[17px] font-extrabold text-foreground tracking-tight">الإعدادات</h1>
          <button
            onClick={() => setView("root")}
            aria-label="رجوع"
            className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center active:scale-95 transition"
          >
            <ChevronLeft className="h-5 w-5 text-foreground rotate-180" strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {PREFERENCES.map((s) => {
              const Icon = s.icon;
              const isNotif = s.label === "الإشعارات";
              return (
                <button
                  key={s.label}
                  onClick={() => {
                    if (isNotif && onOpenNotifications) onOpenNotifications();
                    else toast(s.action);
                  }}
                  className="rounded-2xl bg-card border border-border p-3 shadow-sm flex items-center gap-2 active:scale-[0.98] transition hover:border-primary/30"
                  dir="rtl"
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.tint}`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="font-extrabold text-foreground text-[12px] tracking-tight truncate">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate font-medium">{s.value}</p>
                  </div>
                  <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" strokeWidth={2.5} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const menu = [
    {
      icon: SettingsIcon,
      label: "الإعدادات",
      desc: "التنبيهات، اللغة، العملة والمزيد",
      tint: "bg-primary/10 text-primary",
      onClick: () => setView("settings"),
    },
    {
      icon: ShieldAlert,
      label: "الخصوصية والأمان",
      desc: "إدارة كلمة المرور والحماية",
      tint: "bg-destructive/10 text-destructive",
      onClick: () => toast("فتح إعدادات الخصوصية والأمان"),
    },
    {
      icon: LifeBuoy,
      label: "المساعدة",
      desc: "الأسئلة الشائعة وتواصل معنا",
      tint: "bg-primary/10 text-primary",
      onClick: () => toast("فتح مركز المساعدة"),
    },
    {
      icon: LogOut,
      label: "تسجيل الخروج",
      desc: "إنهاء الجلسة الحالية",
      tint: "bg-destructive/10 text-destructive",
      onClick: signOut,
    },
  ];

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

      <div className="px-5 pt-4 space-y-4">
        {/* Premium dark green profile card */}
        <div
          dir="rtl"
          className="relative rounded-[24px] overflow-hidden text-white shadow-[0_24px_48px_-24px_oklch(0.20_0.05_155/0.55)] px-5 py-5 flex flex-row items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.30 0.06 155) 0%, oklch(0.20 0.05 155) 60%, oklch(0.13 0.04 155) 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-mint/20 rounded-full blur-3xl pointer-events-none" />
          {/* Avatar — goes to the far right in RTL, far left in LTR */}
          <div className="relative shrink-0">
            <div className="h-[76px] w-[76px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <User className="h-9 w-9" strokeWidth={1.5} />
            </div>
            <button
              onClick={() => toast("قريباً: تغيير صورة الملف الشخصي")}
              className="absolute bottom-0 end-0 h-7 w-7 rounded-full bg-mint text-primary border-[3px] border-[oklch(0.20_0.05_155)] flex items-center justify-center shadow-md active:scale-95 transition"
              aria-label="تغيير الصورة"
            >
              <Camera className="h-3 w-3" strokeWidth={2.4} />
            </button>
          </div>
          {/* Text group — aligned to start (right in RTL, left in LTR) */}
          <div className="relative flex-1 min-w-0 text-start">
            <button
              onClick={() => toast("قريباً: تعديل الاسم")}
              className="flex items-center gap-1.5 w-full justify-start"
            >
              <h2 className="text-[18px] font-black tracking-tight break-words min-w-0">{displayName}</h2>
              <Edit className="h-3.5 w-3.5 text-mint shrink-0" strokeWidth={2} />
            </button>
            <p className="text-[11.5px] text-white/70 mt-1 font-medium break-all text-start">
              {user?.email ?? ""}
            </p>
            <p className="text-[11px] text-mint mt-2 font-semibold tracking-tight text-start">
              مستقبلك المالي بين يديك
            </p>
          </div>
        </div>



        {/* List-style navigation blocks */}
        <div className="rounded-[20px] bg-card border border-border shadow-sm overflow-hidden">
          {menu.map((m, idx) => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                onClick={m.onClick}
                dir="rtl"
                className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-secondary/60 transition ${
                  idx !== menu.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${m.tint}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-right min-w-0">
                  <p className="font-extrabold text-foreground text-[13px] tracking-tight truncate">{m.label}</p>
                  <p className="text-[10.5px] text-muted-foreground truncate font-medium mt-0.5">{m.desc}</p>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground/70 shrink-0" strokeWidth={2.5} />
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

      </div>
    </div>
  );
}
      </div>
    </div>
  );
}
