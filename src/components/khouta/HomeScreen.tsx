import { KhoutaLogo } from "./Logo";

export function HomeScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-card p-6 text-center">
      <div className="flex justify-center mb-4">
        <KhoutaLogo size={80} />
      </div>
      <h1 className="text-2xl font-black text-foreground">مرحباً بك في خُطى!</h1>
      <p className="text-sm text-muted-foreground mt-2">
        الشاشة الرئيسية قيد الإعداد — أرسل الصور التالية لإكمالها.
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-2xl bg-primary text-primary-foreground font-bold px-6 py-3"
      >
        إعادة تشغيل الرحلة
      </button>
    </div>
  );
}
