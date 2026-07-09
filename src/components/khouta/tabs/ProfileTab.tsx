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
  TrendingUp,
  Award,
  Trophy,
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
  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "مستخدم خُطى";
  const commitment = profile?.commitment_score ?? 0;
  const tier =
    commitment >= 75 ? { label: "بلاتيني", color: "oklch(0.68 0.02 250)" } :
    commitment >= 50 ? { label: "ذهبي", color: "var(--gold)" } :
    commitment >= 25 ? { label: "فضّي", color: "oklch(0.75 0.01 240)" } :
                       { label: "برونزي", color: "oklch(0.55 0.10 45)" };
  const nextTier = commitment < 25 ? 25 : commitment < 50 ? 50 : commitment < 75 ? 75 : 100;
  const toNext = Math.max(0, nextTier - commitment);

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

      <div className="px-5 pt-4 space-y-4">
        {/* Premium profile card */}
        <div
          className="relative rounded-[26px] overflow-hidden border border-border shadow-[0_24px_48px_-28px_oklch(0.20_0.05_155/0.45)]"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.28 0.05 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.14 0.04 155) 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "oklch(0.72 0.15 155 / 0.35)" }} />
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: "oklch(0.85 0.14 85 / 0.20)" }} />

          {/* Top row: tier chip + avatar */}
          <div className="relative p-5 pb-4">
            <div className="flex items-start justify-between">
              <div className="relative shrink-0">
                <div className="h-[68px] w-[68px] rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white">
                  <User className="h-8 w-8" strokeWidth={1.6} />
                </div>
                <button
                  onClick={() => toast("قريباً: تغيير صورة الملف الشخصي")}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-card border border-border text-foreground flex items-center justify-center shadow-sm active:scale-95 transition"
                  aria-label="تغيير الصورة"
                >
                  <Camera className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="flex-1 text-right pr-4 min-w-0">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg text-primary"
                  style={{ background: "linear-gradient(135deg, oklch(0.95 0.06 85), oklch(0.88 0.10 85))" }}
                >
                  <Trophy className="h-3 w-3" strokeWidth={2.5} style={{ color: "oklch(0.50 0.15 85)" }} />
                  <span style={{ color: "oklch(0.35 0.10 85)" }}>عضوية {tier.label}</span>
                </span>
                <button
                  onClick={() => toast("قريباً: تعديل الاسم")}
                  className="flex items-center gap-2 justify-end w-full mt-2"
                >
                  <Edit className="h-3.5 w-3.5 text-mint" strokeWidth={2} />
                  <h2 className="text-[17px] font-black text-white tracking-tight truncate">{displayName}</h2>
                </button>
                <p className="text-[11px] text-white/60 mt-0.5 truncate font-medium" dir="ltr">
                  {user?.email ?? "khouta.member"}
                </p>
              </div>
            </div>

            {/* Progress ring — commitment level */}
            <div className="mt-4 rounded-2xl bg-white/8 border border-white/12 backdrop-blur p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 40 40" className="h-16 w-16 -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="oklch(1 0 0 / 0.15)" strokeWidth="4" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(commitment / 100) * 100.5} 100.5`}
                      pathLength={100.5}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[14px] font-black text-white leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {commitment}%
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] text-mint font-bold uppercase tracking-[0.15em]">مستوى الالتزام</p>
                  <p className="text-[13px] font-extrabold text-white mt-1 tracking-tight">
                    {commitment >= 70 ? "أداء ممتاز، استمري!" : commitment >= 40 ? "على الطريق الصحيح" : "ابدئي رحلتك الآن"}
                  </p>
                  <p className="text-[10px] text-white/60 mt-1 font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {toNext > 0 ? `${toNext}% للوصول إلى المستوى التالي` : "وصلتِ للقمة"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat pills */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatPill icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={2.2} />} value="+18%" label="التوفير" />
              <StatPill icon={<Award className="h-3.5 w-3.5" strokeWidth={2.2} />} value="8" label="إنجازات" />
              <StatPill value="2,870" suffix="ر.س" label="تمّ توفيره" />
            </div>
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
