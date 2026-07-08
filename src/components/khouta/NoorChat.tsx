import { useState, useRef, useEffect } from "react";
import { ChevronRight, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "noor"; text: string };

const QUICK_REPLIES = [
  "كم صرفت هذا الأسبوع؟",
  "اقترحي لي ميزانية شهرية",
  "هل أستطيع شراء جوال بـ 3,000 ر.س؟",
  "كم يلزمني لتحقيق هدف السيارة؟",
];

function noorReply(q: string): string {
  const lower = q.toLowerCase();
  if (q.includes("صرفت") || q.includes("هذا الأسبوع"))
    return "صرفتِ 1,240 ر.س هذا الأسبوع، بزيادة 12% عن معدلك. أعلى فئة: التسوق (480 ر.س).";
  if (q.includes("ميزانية"))
    return "بناءً على دخلك (9,000 ر.س) أقترح: 45% مصاريف ثابتة، 20% تسوق ومطاعم، 25% ادخار لهدفك، 10% ترفيه.";
  if (q.includes("جوال") || q.includes("أستطيع شراء"))
    return "نعم، لكن سيؤخر هدف السيارة بـ 3 أسابيع. لو انتظرتِ عرض نهاية الشهر ستوفرين ~450 ر.س.";
  if (q.includes("السيارة") || q.includes("هدف"))
    return "متبقٍ 8,000 ر.س من 25,000. بمعدل ادخار 1,000 ر.س شهرياً ستصلين للهدف خلال 8 أشهر — قبل ديسمبر 2026.";
  return "شكراً لسؤالك! أحلل بياناتك المالية… جرّبي أحد الأسئلة السريعة أدناه للحصول على إجابة دقيقة.";
}

export function NoorChat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "noor", text: "أهلاً سارة 👋 أنا نور، مستشارتك المالية. كيف أقدر أساعدك اليوم؟" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {QUICK_REPLIES.map((q) => (
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
            placeholder="اكتبي سؤالك لنور..."
            className="flex-1 bg-transparent outline-none text-sm text-right"
          />
        </form>
      </div>
    </div>
  );
}
