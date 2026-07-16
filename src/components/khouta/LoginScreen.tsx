import { useState } from "react";
import { KhoutaLogo } from "./Logo";
import { Eye, EyeOff, Mail, Lock, Globe, ChevronRight, Fingerprint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LoginScreen({ onCreate, onLogin }: { onCreate: () => void; onLogin: () => void }) {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPass, setShowPass] = useState(false);
 const [remember, setRemember] = useState(true);
 const [loading, setLoading] = useState(false);

 async function submit(e: React.FormEvent) {
 e.preventDefault();
 if (!email ||!password) {
 toast.error("الرجاء إدخال البريد وكلمة المرور");
 return;
 }
 setLoading(true);
 try {
 const { error } = await supabase.auth.signInWithPassword({ email, password });
 if (error) throw error;
 onLogin();
 } catch (err) {
 const msg = err instanceof Error? err.message : "حدث خطأ غير متوقع";
 toast.error(translateError(msg));
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="px-6 pt-5 pb-6 bg-card overflow-y-auto">
 {/* Language pill */}
 <div className="flex items-center justify-start">
 <button className="flex items-center gap-1.5 rounded-full bg-mint/10 border border-mint/30 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-mint/15 transition">
 <Globe className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
 العربية
 </button>
 </div>

 {/* Brand */}
 <div className="flex flex-col items-center mt-6">
 <KhoutaLogo size={82} />
 <h1 className="mt-8 text-[28px] font-black text-foreground tracking-tight leading-none">خُطى</h1>
 <p className="mt-4 text-[12.5px] text-muted-foreground font-medium tracking-tight">
 خطواتك نحو مستقبل مالي أفضل
 </p>
 </div>

 {/* Form */}
 <form onSubmit={submit} className="mt-8 space-y-3.5">
 <Field icon={<Mail className="h-4 w-4" strokeWidth={2} />}>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="رقم الجوال أو البريد الإلكتروني"
 className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/70 text-right"
 />
 </Field>

 <Field icon={<Lock className="h-4 w-4" strokeWidth={2} />}>
 <button
 type="button"
 onClick={() => setShowPass((v) =>!v)}
 className="text-primary/70 shrink-0"
 aria-label="إظهار كلمة المرور"
 >
 {showPass? <Eye className="h-4 w-4" strokeWidth={2} /> : <EyeOff className="h-4 w-4" strokeWidth={2} />}
 </button>
 <input
 type={showPass? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="كلمة المرور"
 className="flex-1 bg-transparent outline-none text-[13px] font-medium text-foreground placeholder:text-muted-foreground/70 text-right"
 />
 </Field>

 <div className="flex items-center justify-between pt-0.5">
 <button
 type="button"
 onClick={async () => {
 if (!email) return toast.error("أدخل البريد أولاً");
 const { error } = await supabase.auth.resetPasswordForEmail(email, {
 redirectTo: window.location.origin,
 });
 if (error) toast.error(error.message);
 else toast.success("أرسلنا رابط إعادة التعيين إلى بريدك");
 }}
 className="text-primary text-[11.5px] font-bold hover:underline"
 >
 هل نسيت كلمة المرور؟
 </button>
 <label className="flex items-center gap-1.5 cursor-pointer select-none">
 <span className="text-[11.5px] font-semibold text-muted-foreground">تذكرني</span>
 <button
 type="button"
 onClick={() => setRemember((v) =>!v)}
 className={`h-4 w-4 rounded-md border transition flex items-center justify-center ${
 remember? "bg-primary border-primary" : "bg-card border-border"
 }`}
 >
 {remember && <span className="h-1.5 w-1.5 rounded-[2px] bg-primary-foreground" />}
 </button>
 </label>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full rounded-2xl bg-primary text-primary-foreground font-extrabold py-[18px] mt-3 shadow-[0_18px_36px_-16px_oklch(0.20_0.05_155/0.65)] disabled:opacity-60 active:scale-[0.97] hover:shadow-[0_22px_44px_-18px_oklch(0.20_0.05_155/0.75)] transition-all duration-200 text-[14px] tracking-tight"
 >
 {loading? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
 </button>
 </form>

 {/* Create account — RTL: gray question first, then dark-green CTA */}
 <p className="mt-5 text-center text-[12px] font-medium">
 <span className="text-muted-foreground">ليس لديك حساب؟</span>
 <button onClick={onCreate} className="text-primary font-extrabold hover:underline mr-1.5">
 إنشاء حساب جديد
 </button>
 </p>

 {/* Biometric */}
 <button
 onClick={() => toast("قريباً: الدخول بالبصمة")}
 className="mt-5 w-full rounded-2xl border border-border bg-card py-3.5 text-[13px] font-extrabold text-foreground flex items-center justify-between px-5 shadow-sm active:scale-[0.99] transition hover:border-mint/40"
 >
 <span className="h-9 w-9 rounded-xl bg-mint/10 text-primary flex items-center justify-center">
 <Fingerprint className="h-5 w-5" strokeWidth={2} />
 </span>
 <span className="flex-1 text-center tracking-tight">دخول بالبصمة</span>
 <span className="h-9 w-9 rounded-xl bg-secondary/70 flex items-center justify-center">
 <ChevronRight className="h-4 w-4 text-muted-foreground rotate-180" strokeWidth={2.5} />
 </span>
 </button>

 {/* Footer */}
 <div className="mt-7 pt-4 border-t border-border/70">
 <div className="flex items-center justify-between text-[10.5px]">
 <button className="text-muted-foreground font-semibold hover:text-foreground transition">سياسة الخصوصية</button>
 <span className="text-border">•</span>
 <button className="text-muted-foreground font-semibold hover:text-foreground transition">تواصل معنا</button>
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
 if (/Password should be at least/i.test(msg)) return "كلمة المرور قصيرة جداً (6 أحرف على الأقل)";
 if (/pwned/i.test(msg)) return "كلمة المرور مسرّبة سابقاً — اختر كلمة أقوى";
 return msg;
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
 return (
 <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-[18px] shadow-[0_2px_8px_-4px_rgb(0_0_0/0.06)] focus-within:border-primary/50 focus-within:shadow-[0_4px_16px_-6px_oklch(0.28_0.05_155/0.2)] transition">
 {children}
 <span className="text-primary/70 shrink-0">{icon}</span>
 </div>
 );
}
