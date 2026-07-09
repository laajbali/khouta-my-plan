import { useState } from "react";
import { KhoutaLogo } from "./Logo";
import { Eye, EyeOff, Mail, Lock, Globe, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LoginScreen({ onCreate, onLogin }: { onCreate: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("الرجاء إدخال البريد وكلمة المرور");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("مرحباً بعودتك");
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      toast.error(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 pt-6 pb-8 bg-card overflow-y-auto">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1.5 rounded-xl bg-secondary border border-border px-3 py-1.5 text-[11px] font-bold text-foreground">
          <Globe className="h-3.5 w-3.5" strokeWidth={2} />
          العربية
        </button>
      </div>

      <div className="flex flex-col items-center mt-2">
        <KhoutaLogo />
        <h1 className="mt-4 text-[24px] font-extrabold text-foreground tracking-tight">خُطى</h1>
        <p className="mt-1 text-[12px] text-muted-foreground font-medium">خطواتك نحو مستقبل مالي أفضل</p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-3">
        <Field label="البريد الإلكتروني" icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            dir="ltr"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <Field label="كلمة المرور" icon={<Lock className="h-4 w-4" strokeWidth={1.8} />}>
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="text-muted-foreground shrink-0"
          >
            {showPass ? <Eye className="h-4 w-4" strokeWidth={1.8} /> : <EyeOff className="h-4 w-4" strokeWidth={1.8} />}
          </button>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/60 text-right"
          />
        </Field>

        <div className="flex items-center justify-end text-[11px] pt-1">
          <button
            type="button"
            onClick={async () => {
              if (!email) return toast.error("أدخلي البريد أولاً");
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
              });
              if (error) toast.error(error.message);
              else toast.success("أرسلنا رابط إعادة التعيين إلى بريدك");
            }}
            className="text-primary font-bold"
          >
            هل نسيت كلمة المرور؟
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 mt-2 shadow-lg shadow-primary/25 disabled:opacity-60 active:scale-[0.99] transition text-[14px] tracking-tight"
        >
          {loading ? "جارٍ..." : "تسجيل الدخول"}
        </button>
      </form>

      {/* Signup CTA — routes to multi-step onboarding */}
      <button
        onClick={onCreate}
        className="mt-4 w-full rounded-2xl border border-border bg-card py-3.5 text-[13px] font-bold text-foreground flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition hover:border-primary/40"
      >
        إنشاء حساب جديد
        <ChevronRight className="h-4 w-4 rotate-180 text-primary" strokeWidth={2.5} />
      </button>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-[11px]">
          <button className="text-primary font-bold">سياسة الخصوصية</button>
          <span className="text-border">|</span>
          <button className="text-primary font-bold">تواصل معنا</button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium">
          جميع الحقوق محفوظة لتطبيق خُطى © 2026
        </p>
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return "البريد أو كلمة المرور غير صحيحة";
  if (/User already registered/i.test(msg)) return "هذا الحساب مسجل مسبقاً — سجّلي الدخول";
  if (/Password should be at least/i.test(msg)) return "كلمة المرور قصيرة جداً (6 أحرف على الأقل)";
  if (/pwned/i.test(msg)) return "كلمة المرور مسرّبة سابقاً — اختاري كلمة أقوى";
  return msg;
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-right text-[11px] font-semibold text-foreground/80 mb-1.5 tracking-tight">{label}</p>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary/50 transition">
        {children}
        <span className="text-muted-foreground shrink-0">{icon}</span>
      </div>
    </div>
  );
}
