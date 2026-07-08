import { useState } from "react";
import { KhoutaLogo } from "./Logo";
import { Eye, EyeOff, User, Lock, Globe, Fingerprint } from "lucide-react";

export function LoginScreen({ onCreate, onLogin }: { onCreate: () => void; onLogin: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="px-6 pt-4 pb-8 bg-card">
      {/* Status bar spacer + language */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
          <Globe className="h-3.5 w-3.5" />
          العربية
        </button>
      </div>

      <div className="flex flex-col items-center">
        <KhoutaLogo />
        <h1 className="mt-6 text-4xl font-black text-foreground tracking-tight">
          خُطى
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          خطواتك نحو مستقبل مالي أفضل
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Field icon={<User className="h-4 w-4" />} placeholder="رقم الجوال أو البريد الإلكتروني" />
        <Field
          icon={<Lock className="h-4 w-4" />}
          placeholder="كلمة المرور"
          type={showPass ? "text" : "password"}
          suffix={
            <button type="button" onClick={() => setShowPass((v) => !v)} className="text-muted-foreground">
              {showPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <button className="text-mint font-semibold">هل نسيت كلمة المرور؟</button>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-4 w-4 rounded-full border-2 border-border peer-checked:bg-primary peer-checked:border-primary" />
            <span className="text-muted-foreground">تذكرني</span>
          </label>
        </div>

        <button
          onClick={onLogin}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 mt-3 shadow-lg shadow-primary/20 hover:opacity-95 transition"
        >
          تسجيل الدخول
        </button>

        <p className="text-center text-sm text-muted-foreground pt-1">
          ليس لديك حساب؟{" "}
          <button onClick={onCreate} className="text-mint font-bold">
            إنشاء حساب جديد
          </button>
        </p>

        <button className="w-full flex items-center justify-between rounded-2xl border-2 border-border bg-card py-3.5 px-5 mt-2">
          <Fingerprint className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">دخول بالبصمة</span>
          <span className="text-xl">🔐</span>
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-border">
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

function Field({
  icon,
  placeholder,
  type = "text",
  suffix,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 focus-within:border-primary transition">
      {suffix}
      <input
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground text-right"
      />
      <span className="text-muted-foreground">{icon}</span>
    </div>
  );
}
