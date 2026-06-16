import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, MessageSquare, Bot, User, Trash2, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AICompanionProps {
  lang: "ar" | "en";
}

// Custom simple client-side Markdown formatter to keep things 100% stable and extremely performant
function parseMarkdown(text: string) {
  // Translate headers, bullet lines, bold words, blockquotes, and linebreaks elegantly
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let trimmed = line.trim();

    // Headers: ### or ## or #
    if (trimmed.startsWith("### ")) {
      return <h4 key={idx} className="text-sm font-bold text-amber-300 mt-2 mb-1 border-b border-gray-800 pb-1">{trimmed.slice(4)}</h4>;
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      const headingText = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(2);
      return <h3 key={idx} className="text-base font-extrabold text-white mt-3 mb-1.5">{headingText}</h3>;
    }

    // Blockquotes: >
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={idx} className="border-r-4 border-amber-500 bg-amber-500/5 px-3 py-2 my-2 rounded-l text-xs text-gray-300 italic text-right" dir="rtl">
          {trimmed.slice(2)}
        </blockquote>
      );
    }

    // Bullet logs: * or -
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      return (
        <li key={idx} className="text-xs text-gray-300 list-disc list-inside mr-2 leading-relaxed text-right md:mr-4 pr-1" dir="rtl">
          {trimmed.slice(2)}
        </li>
      );
    }

    // Bold formatting conversion **text** using standard React structures
    if (trimmed.includes("**")) {
      const parts = trimmed.split("**");
      return (
        <p key={idx} className="text-xs text-gray-300 leading-relaxed mb-1.5">
          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-amber-300 font-semibold">{part}</strong> : part)}
        </p>
      );
    }

    // Default line
    if (trimmed === "") {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p key={idx} className="text-xs text-gray-200 leading-relaxed mb-1" dir="rtl">
        {trimmed}
      </p>
    );
  });
}

export default function AICompanion({ lang }: AICompanionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom theological recommended quick starter queries
  const arabicQuickPrompts = [
    { title: "📖 شرح وتدبر سورة الملك", prompt: "ما هي فضائل سورة الملك وكيف نتدبر آياتها بشكل مبسط؟" },
    { title: "💡 شرح كلمة فلكية عثمانية صعبة", prompt: "اشرح لي الكلمة القرآنية 'الخُنَّس الكُنَّس' لغوياً وتفسيرياً." },
    { title: "📅 اقتراح ورد تلاوة وحفظ", prompt: "اقترح علي ورداً يومياً للتلاوة والحفظ للمبتدئين يناسب ربع جزء يومياً." },
    { title: "🕌 تعزيز الخشوع في الصلاة", prompt: "كيف أحقق الخشوع والسكينة القلبية أثناء قراءة القرآن الكريم والصلاة؟" }
  ];

  const englishQuickPrompts = [
    { title: "📖 Virtue of Surah Al-Mulk", prompt: "What are the blessings of reciting Surah Al-Mulk daily?" },
    { title: "💡 Explain a tough Quranic word", prompt: "Explain the Arabic Quranic term 'Al-Khunnas Al-Kunnas' from Surah At-Takwir." },
    { title: "📅 Suggest a Quran reading plan", prompt: "Suggest a simple daily Quran recitation schedule for a busy person." },
    { title: "🕌 Focus & Khushoo in Salah", prompt: "How can I improve my mindfulness and focus (Khushoo) during prayer and recitation?" }
  ];

  const promptsToUse = lang === "ar" ? arabicQuickPrompts : englishQuickPrompts;

  useEffect(() => {
    // Load historical conversations
    const savedChat = localStorage.getItem("assistant_chat_history");
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      // Setup Initial Greeting message from AI companion
      const initialGreeting: Message = {
        role: "assistant",
        content: lang === "ar" 
          ? `السلام عليكم ورحمة الله وبركاته، أهلاً بك يا رفيق القرآن في **المساعد المضيء**! 🌟

أنا هنا رفيق مشورتك على درب الذكر والعبادة. يسعدني مساعدتك في:
- **تفسير السور والآيات** بالتأمل والتدبر.
- **شرح مفردات ومعاني** الكلمات العثمانية الصعبة.
- **جدولة أوراد التلاوة والحفظ** المناسبة للتكامل والختمة.
- **البحث الإيماني العقائدي** في مقاصد السور.

كيف يمكنني مرافقتك وتنوير دربك اليوم؟ تفضل بطرح تساؤلك الفقهي أو العقائدي، أو اختر أحد الأسئلة المقترحة بالأسفل لتجربتها حياً.`
          : `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! Welcome, beloved seeker of light, to the **AI Theological Companion**. 🌟

I am here to support your spiritual ascension and understanding of the Holy Quran. I can assist you with:
- **Tafseer & Reflection** of verses and chapters.
- **Vocabulary explanation** of delicate Quranic terms.
- **Setting daily schedules** for recitation and memorization.
- **Finding verses** related to patience, prayer, or charity.

What spiritual quest can I enhance for you today? Ask your question, or pick from the suggested helpful prompts below!`
      };
      setMessages([initialGreeting]);
      localStorage.setItem("assistant_chat_history", JSON.stringify([initialGreeting]));
    }
  }, [lang]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputVal).trim();
    if (!textToSend || loading) return;

    // Append user message
    const userMsg: Message = { role: "user", content: textToSend };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    localStorage.setItem("assistant_chat_history", JSON.stringify(nextMessages));
    
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });

      if (!response.ok) {
        throw new Error("Assistant response failed");
      }

      const json = await response.json();
      if (json.reply) {
        const botMsg: Message = { role: "assistant", content: json.reply };
        const updatedChat = [...nextMessages, botMsg];
        setMessages(updatedChat);
        localStorage.setItem("assistant_chat_history", JSON.stringify(updatedChat));
      } else if (json.error) {
        throw new Error(json.error);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        role: "assistant",
        content: lang === "ar"
          ? "عذراً أخي الفاضل، تعذر الاتصال بمزود الذكاء الاصطناعي حالياً. يرجى التأكد من إعداد Secrets أو المحاولة لاحقاً."
          : "Apologies, couldn't establish a secure connection with the AI server. Please check configurations or try again later."
      };
      setMessages([...nextMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    const restoredGreeting: Message = {
      role: "assistant",
      content: lang === "ar"
        ? "أهلاً بك مجدداً يا رفيق القرآن في المساعد المضيء! تم مسح سجل المحادثة بنجاح. بمَ تود طرح سؤالك اليوم؟"
        : "Welcome back! The conversation thread was cleared successfully. What can I explain for you today?"
    };
    setMessages([restoredGreeting]);
    localStorage.setItem("assistant_chat_history", JSON.stringify([restoredGreeting]));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-stretch h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Top action header bar */}
      <div className="flex justify-between items-center mb-3 bg-[#071129] p-3 rounded-2xl border border-amber-900/30">
        <button
          onClick={clearChatHistory}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-2.5 py-1.5 rounded-xl transition-all"
          title="Clear thread history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "مسح المحادثة" : "Clear Chat"}</span>
        </button>

        <div className="flex items-center gap-2.5 direction-rtl">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-right flex flex-col items-end">
            <h3 className="text-xs md:text-sm font-bold text-white leading-tight font-sans">
              {lang === "ar" ? "المساعد المضيء ورفيق التدبر" : "Al-Mushaf Al-Mudee Intelligent AI Guide"}
            </h3>
            <span className="text-[9px] text-amber-500/80 font-medium block mt-0.5 font-mono">
              ● MODEL: gemini-3.5-flash
            </span>
          </div>
        </div>
      </div>

      {/* Main chat window balloons scrolling frame */}
      <div className="flex-grow bg-[#050B18] border border-amber-500/10 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4 flex flex-col styled-scrollbar">
        {messages.map((msg, idx) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 max-w-[85%] md:max-w-[75%] ${
                isAI ? "self-start text-right" : "self-end flex-row-reverse text-left"
              }`}
            >
              {/* Profile icon bubble */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isAI
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    : "bg-[#071129] border border-white/5 text-gray-300"
                }`}
              >
                {isAI ? <Bot className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
              </div>

              {/* Balloon content wrapper */}
              <div
                className={`p-3.5 rounded-2xl text-xs flex flex-col gap-1 shadow-md ${
                  isAI
                    ? "bg-[#071129] border border-amber-500/15 text-gray-200 rounded-tr-none text-right"
                    : "bg-amber-600/10 border border-amber-500/20 text-white rounded-tl-none text-left"
                }`}
              >
                {/* Meta header author */}
                <span className="text-[10px] text-gray-400 font-semibold mb-1 font-sans block block-rtl">
                  {isAI ? (lang === "ar" ? "المساعد المضيء (عالم)" : "Intelligent Scholar") : (lang === "ar" ? "رفيق الدرب" : "You (Worshipper)")}
                </span>

                {/* Formatted body text lines */}
                <div className="space-y-1 select-text">
                  {isAI ? parseMarkdown(msg.content) : parseMarkdown(msg.content)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing and load triggers placeholder */}
        {loading && (
          <div className="flex items-center gap-2 self-start max-w-[75%]">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-[#071129] border border-amber-500/10 p-3.5 rounded-2xl rounded-tr-none text-gray-400 text-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce delay-300" />
              </div>
              <span className="font-sans text-[11px] font-medium">
                {lang === "ar" ? "يتدبر معاني الآيات ويبحث..." : "Reflecting and meditating..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested widgets quick prompt tabs */}
      {messages.length <= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          {promptsToUse.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              className="text-right p-2.5 rounded-xl border border-amber-500/10 hover:border-amber-500/30 bg-[#050B18] hover:bg-[#071129] text-gray-300 hover:text-amber-200 text-xs transition-all duration-300 flex items-center justify-between gap-2 shadow-sm shrink-0 leading-relaxed font-sans"
            >
              <ArrowRight className="w-4 h-4 text-amber-500 hidden md:inline" />
              <span className="text-right font-medium">{p.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Interactive write message box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={lang === "ar" ? "اسأل المساعد: كيف أتدبر سورة الكهف؟" : "Ask assistant: Help me reflect on patience"}
          disabled={loading}
          className="bg-[#050B18] border border-white/5 focus:border-amber-500 focus:outline-none text-sm text-white px-4 py-3 rounded-2xl flex-grow font-sans text-center md:text-right"
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputVal.trim()}
          className="bg-amber-600 hover:bg-amber-500 active:scale-95 disabled:bg-[#071129] disabled:text-gray-600 border border-amber-900/30 text-slate-950 font-semibold p-3.5 rounded-2xl transition-all self-center shrink-0 shadow-md"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
