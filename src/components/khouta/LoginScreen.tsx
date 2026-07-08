import { useState } from "react";
import { KhoutaLogo } from "./Logo";
import { Eye, EyeOff, Mail, Lock, Globe, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Mode = "login" | "signup";

export function LoginScreen({ onCreate: _onCreate, onLogin }: { onCreate: () => void; onLogin: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحباً بعودتك");
        onLogin();
      } else {
        if (!fullName) {
          toast.error("الرجاء إدخال الاسم الكامل");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success(`أهلاً ${fullName}، تم إنشاء حسابك`);
        onLogin();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      toast.error(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 pt-4 pb-8 bg-card overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
          <Globe className="h-3.5 w-3.5" />
          العربية
        </button>
      </div>

      <div className="flex flex-col items-center">
        <KhoutaLogo />
        <h1 className="mt-4 text-3xl font-black text-foreground tracking-tight">خُطى</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">خطواتك نحو مستقبل مالي أفضل</p>
      </div>

      {/* Mode toggle */}
      <div className="mt-6 grid grid-cols-2 bg-secondary rounded-2xl p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`py-2.5 rounded-xl text-sm font-bold transition ${
            mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`py-2.5 rounded-xl text-sm font-bold transition ${
            mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          حساب جديد
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "signup" && (
          <Field
            icon={<User className="h-4 w-4" />}
            placeholder="الاسم الكامل"
            value={fullName}
            onChange={setFullName}
          />
        )}
        <Field
          icon={<Mail className="h-4 w-4" />}
          placeholder="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={setEmail}
          dir="ltr"
        />
        <Field
          icon={<Lock className="h-4 w-4" />}
          placeholder="كلمة المرور"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={setPassword}
          suffix={
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-muted-foreground"
            >
              {showPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          }
        />

        {mode === "login" && (
          <div className="flex items-center justify-end text-xs pt-1">
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
              className="text-mint font-semibold"
            >
              هل نسيت كلمة المرور؟
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 mt-3 shadow-lg shadow-primary/20 disabled:opacity-60 active:scale-[0.99] transition"
        >
          {loading
            ? "جارٍ..."
            : mode === "login"
              ? "تسجيل الدخول"
              : "إنشاء الحساب"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <button className="text-mint font-semibold">سياسة الخصوصية</button>
          <span className="text-border">|</span>
          <button className="text-mint font-semibold">تواصل معنا</button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
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

function Field({
  icon,
  placeholder,
  type = "text",
  suffix,
  value,
  onChange,
  dir,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  suffix?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 focus-within:border-primary transition">
      {suffix}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground text-right"
      />
      <span className="text-muted-foreground">{icon}</span>
    </div>
  );
}
