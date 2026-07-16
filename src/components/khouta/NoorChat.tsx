import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight, Send, Sparkles } from "lucide-react";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";

type Msg = { role: "user" | "noor"; text: string };

export function NoorChat({ onBack, userName = "" }: { onBack: () => void; userName?: string }) {
  const profile = useProfile();
  const { goals } = useGoals();
  const displayName = (profile?.full_name || userName || "").trim();
  const firstName = displayName.split(" ")[0];

  const income = Number(profile?.monthly_income ?? 0);
  const incomeLabel = profile?.income_label || "دخل";
  const topGoal = goals[0];
  const goalTitle = topGoal?.title ?? "هدفك";
  const goalTarget = Number(topGoal?.target_amount ?? 0);
  const goalSaved = Number(topGoal?.saved_amount ?? 0);
  const goalRemaining = Math.max(0, goalTarget - goalSaved);

  const monthlySavingSuggest = income > 0 ? Math.max(200, Math.round(income * 0.25)) : 1000;
  const monthsToGoal =
    monthlySavingSuggest > 0 && goalRemaining > 0
      ? Math.max(1, Math.ceil(goalRemaining / monthlySavingSuggest))
      : 0;

  const quickReplies = useMemo(
    () => [
      "كم صرفت هذا الأسبوع؟",
      "اقترحي لي ميزانية شهرية",
      `هل أستطيع شراء جوال بـ 3,000 ر.س؟`,
      goalTitle ? `كم يلزمني لتحقيق هدف ${goalTitle}؟` : "كم يلزمني لتحقيق هدفي؟",
    ],
    [goalTitle],
  );

  function noorReply(q: string): string {
    const fmt = (n: number) => n.toLocaleString();
    if (q.includes("صرفت") || q.includes("هذا الأسبوع"))
      return `بحسب بياناتك، ${income > 0 ? `دخلك الشهري ${fmt(income)} ر.س (${incomeLabel}) — ` : ""}راقبي مصاريف هذا الأسبوع من شاشة التقارير للحصول على تحليل دقيق.`;
    if (q.includes("ميزانية"))
      return income > 0
        ? `بناءً على ${incomeLabel} ${fmt(income)} ر.س أقترح: 45% مصاريف ثابتة، 20% تسوق ومطاعم، 25% ادخار لـ${goalTitle}، 10% ترفيه.`
        : `أضيفي دخلك الشهري في البيانات المالية لأقترح ميزانية دقيقة تناسبك.`;
    if (q.includes("جوال") || q.includes("أستطيع شراء"))
      return goalRemaining > 0
        ? `يمكن، لكن قد يؤخر ${goalTitle} بضعة أسابيع. جربي الانتظار لعرض نهاية الشهر لتوفير مبلغ إضافي يدعم هدفك.`
        : `يمكنكِ ذلك بأمان — لا يوجد هدف نشط قد يتأثر.`;
    if (q.includes(goalTitle) || q.includes("هدف"))
      return goalTarget > 0
        ? `هدفك ${goalTitle}: متبقٍ ${fmt(goalRemaining)} ر.س من ${fmt(goalTarget)} ر.س. بمعدل ادخار ${fmt(monthlySavingSuggest)} ر.س شهرياً ستصلين خلال ${monthsToGoal} شهر تقريباً.`
        : `لم يتم إنشاء هدف بعد. أنشئي هدفك من الشاشة الرئيسية لأساعدك في التخطيط.`;
    return `شكراً لسؤالك${firstName ? " يا " + firstName : ""}! جرّبي أحد الأسئلة السريعة أدناه للحصول على إجابة دقيقة بناءً على بياناتك.`;
  }

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize the greeting once profile/goal are known
  useEffect(() => {
    setMessages([
      {
        role: "noor",
        text: `أهلاً${firstName ? " " + firstName : ""} أنا نور، مستشارك المالي.${
          goalTitle && goalTarget > 0
            ? ` هدفك الحالي: ${goalTitle} (${goalTarget.toLocaleString()} ر.س). كيف أقدر أساعدك اليوم؟`
            : " كيف أقدر أساعدك اليوم؟"
        }`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, goalTitle, goalTarget]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "noor", text: noorReply(text) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card px-5 pt-4 pb-3 flex items-center justify-between border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-bold text-foreground text-right">نور</p>
            <p className="text-[10px] text-mint text-right flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-mint rounded-full" /> متصلة الآن
            </p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-bl-md"
                  : "bg-card border border-border text-foreground rounded-2xl rounded-br-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-end">
            <div className="bg-card border border-border rounded-2xl rounded-br-md px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0" dir="rtl">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 text-xs bg-accent text-primary font-bold px-3 py-2 rounded-full border border-mint/20 hover:bg-mint/10 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-card border-t border-border shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2"
        >
          <button
            type="submit"
            className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4 -rotate-180" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك لنور..."
            className="flex-1 bg-transparent outline-none text-sm text-right"
          />
        </form>
      </div>
    </div>
  );
}
