import { User, Camera, Edit, Star, Bell, Globe, Lock, DollarSign, Sun, HelpCircle, Info, Share2, ShieldCheck, LogOut, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

const SETTINGS = [
  { icon: Globe, label: "اللغة", value: "العربية", bg: "bg-blue-100" },
  { icon: Bell, label: "الإشعارات", value: "إدارة التنبيهات", bg: "bg-yellow-100" },
  { icon: DollarSign, label: "العملة", value: "ريال سعودي", bg: "bg-emerald-100" },
  { icon: Lock, label: "الأمان", value: "إعدادات الأمان", bg: "bg-pink-100" },
  { icon: Sun, label: "طريقة العرض", value: "الوضع الفاتح", bg: "bg-orange-100" },
  { icon: HelpCircle, label: "المساعدة", value: "الأسئلة الشائعة", bg: "bg-gray-100" },
  { icon: Info, label: "عن خُطى", value: "معلومات التطبيق", bg: "bg-blue-100" },
  { icon: Share2, label: "شارك التطبيق", value: "ادعُ أصدقاءك", bg: "bg-purple-100" },
];

export function ProfileTab() {
  return (
    <div className="bg-card">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="w-11" />
        <h1 className="text-2xl font-black text-foreground">الحساب</h1>
        <button className="relative h-11 w-11 rounded-full bg-accent flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>

      <div className="px-5 pb-4 space-y-4 mt-5">
        {/* Profile card */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <button className="absolute -bottom-1 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end">
                <Edit className="h-4 w-4 text-primary" />
                <h2 className="text-xl font-black text-foreground">سارة محمد</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">🌱 مستقبلك المالي بين يديك</p>
              <div className="mt-3 rounded-2xl bg-accent/50 p-3">
                <p className="text-[10px] text-muted-foreground text-right">مستوى الالتزام</p>
                <p className="text-2xl font-black text-foreground text-right">84%</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                  <span className="text-xs font-bold text-gold">ممتاز</span>
                </div>
                <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden" dir="ltr">
                  <div className="h-full bg-mint rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current plan */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <h3 className="text-right font-black text-foreground text-lg mb-3">الخطة الحالية</h3>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center text-2xl">
              🚗
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">الهدف</p>
                <p className="font-black text-foreground">شراء سيارة</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">المبلغ المستهدف</p>
                <p className="font-black text-foreground">25,000 <span className="text-xs">ريال</span></p>
                <p className="text-[10px] text-muted-foreground">المتبقي 8,000 ريال</p>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden" dir="ltr">
            <div className="h-full bg-mint rounded-full" style={{ width: "68%" }} />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-mint font-bold">68% منجز</span>
            <span className="text-muted-foreground">ينتهي ديسمبر 2026</span>
          </div>
        </div>

        <h3 className="text-right font-black text-foreground text-lg mt-2">الإعدادات والتفضيلات</h3>

        <div className="grid grid-cols-2 gap-3">
          {SETTINGS.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.label} className="rounded-2xl bg-card border border-border p-3 shadow-sm flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 text-right">
                  <p className="font-black text-foreground text-sm">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground">{s.value}</p>
                </div>
                <div className={`h-9 w-9 rounded-full ${s.bg} flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl bg-accent/40 border border-mint/30 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-mint flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-mint-foreground" />
          </div>
          <div className="flex-1 text-right">
            <p className="font-black text-foreground text-sm">أمان بياناتك أولويتنا</p>
            <p className="text-xs text-muted-foreground">نستخدم أعلى معايير الأمان لحماية خصوصيتك</p>
          </div>
        </div>

        <button className="w-full rounded-2xl border-2 border-destructive/40 bg-destructive/5 text-destructive font-black py-4 flex items-center justify-center gap-2">
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
