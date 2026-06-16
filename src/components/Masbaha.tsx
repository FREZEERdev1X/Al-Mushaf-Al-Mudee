import { useState, useEffect } from "react";
import { RotateCcw, Volume2, VolumeX, Plus, Sparkles, Trophy, Trash2, Heart } from "lucide-react";

interface TasbihHistory {
  phrase: string;
  count: number;
  date: string;
}

interface MasbahaProps {
  lang: "ar" | "en";
}

export default function Masbaha({ lang }: MasbahaProps) {
  const [counter, setCounter] = useState<number>(0);
  const [selectedPhrase, setSelectedPhrase] = useState<string>("سُبْحَانَ اللَّهِ");
  const [customPhrase, setCustomPhrase] = useState<string>("");
  const [target, setTarget] = useState<number>(33);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<TasbihHistory[]>([]);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Default standard Islamic praise phrases
  const standardPhrases = [
    { ar: "سُبْحَانَ اللَّهِ", en: "Subhan Allah (Glory be to Allah)" },
    { ar: "الْحَمْدُ لِلَّهِ", en: "Alhamdulillah (Praise be to Allah)" },
    { ar: "اللَّهُ أَكْبَرُ", en: "Allahu Akbar (Allah is the Greatest)" },
    { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullah (I seek Allah's forgiveness)" },
    { ar: "لَا إِلَهَ إِلَّا اللَّهُ", en: "La ilaha illallah (There is no god but Allah)" },
    { ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", en: "Allahumma salli 'ala Muhammad" }
  ];

  useEffect(() => {
    // Load local storage counters
    const savedCount = localStorage.getItem("masbaha_count");
    if (savedCount) setCounter(parseInt(savedCount));

    const savedPhrase = localStorage.getItem("masbaha_selected");
    if (savedPhrase) setSelectedPhrase(savedPhrase);

    const savedHistory = localStorage.getItem("masbaha_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedSessions = localStorage.getItem("masbaha_sessions");
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));
  }, []);

  const handleIncrement = () => {
    const nextCount = counter + 1;
    setCounter(nextCount);
    localStorage.setItem("masbaha_count", nextCount.toString());

    // Click sound effect simulation
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Standard high-delight crystal click frequency
        oscillator.frequency.value = nextCount % target === 0 ? 880 : 440; 
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.log("Audio not allowed yet:", e);
      }
    }

    // Check if target is reached
    if (nextCount > 0 && nextCount % target === 0) {
      // Create session logs
      const newHistoryItem: TasbihHistory = {
        phrase: selectedPhrase,
        count: target,
        date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem("masbaha_history", JSON.stringify(updatedHistory));

      const nextSessions = completedSessions + 1;
      setCompletedSessions(nextSessions);
      localStorage.setItem("masbaha_sessions", nextSessions.toString());

      // Soft vibration trigger
      if (navigator.vibrate) {
        navigator.vibrate([150, 50, 150]);
      }
    } else {
      // Standard mini vibration click
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  };

  const handleReset = () => {
    setCounter(0);
    localStorage.setItem("masbaha_count", "0");
  };

  const clearHistory = () => {
    setHistory([]);
    setCompletedSessions(0);
    localStorage.removeItem("masbaha_history");
    localStorage.removeItem("masbaha_sessions");
  };

  const handleSelectPhrase = (phrase: string) => {
    setSelectedPhrase(phrase);
    localStorage.setItem("masbaha_selected", phrase);
    setCounter(0);
    localStorage.setItem("masbaha_count", "0");
  };

  const handleCustomPhraseAdd = () => {
    if (customPhrase.trim()) {
      handleSelectPhrase(customPhrase);
      setCustomPhrase("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* Lantern aesthetic header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium md:text-sm">
          <Sparkles className="w-4 h-4" />
          <span>{lang === "ar" ? "السبحة الإلكترونية الرياضية" : "Glowing Digital Tasbih"}</span>
        </div>
        <h2 className="text-2xl font-bold mt-2 text-white font-sans">
          {lang === "ar" ? "تأمل وذكر الله ورتل" : "Meditation and Dhikr Remembrance"}
        </h2>
        <p className="text-gray-400 text-xs max-w-md mt-1 mx-auto leading-relaxed">
          {lang === "ar" 
            ? "اذكر الله يذكرك، ورطب لسانك بالاستغفار والتسبيح المتواصل."
            : "Remember Allah and He will remember you. Moisten your tongue with praise."}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Phrase selector and targets */}
        <div className="lg:col-span-5 bg-[#071129] border border-amber-900/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-amber-400 text-sm font-semibold mb-3 border-b border-amber-500/10 pb-2">
              {lang === "ar" ? "اختر الورد والذِّكر" : "Select Dhikr Phrase"}
            </h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 select-none">
              {standardPhrases.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPhrase(item.ar)}
                  className={`w-full text-right p-3 rounded-xl border text-sm transition-all duration-300 flex items-center justify-between ${
                    selectedPhrase === item.ar
                      ? "bg-amber-500/10 border-amber-500 text-amber-300 font-medium"
                      : "bg-[#050B18] border-white/5 text-gray-300 hover:border-amber-500/20 hover:bg-[#050B18]/80"
                  }`}
                >
                  <span className="text-xs text-mono text-gray-400 font-mono">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="font-sans text-right text-base leading-tight font-medium" dir="rtl">{item.ar}</span>
                    <span className="text-[10px] text-gray-500 font-sans mt-0.5">{item.en}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom formulation input */}
            <div className="mt-4 pt-4 border-t border-amber-500/15">
              <label className="text-xs text-gray-400 block mb-2 text-right lg:text-left">
                {lang === "ar" ? "إضافة ذكر مخصص:" : "Add Custom Dhikr Phrase:"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={lang === "ar" ? "اكتب الذكر هنا..." : "Type custom phrase..."}
                  value={customPhrase}
                  onChange={(e) => setCustomPhrase(e.target.value)}
                  className="bg-[#050B18] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 flex-grow text-center"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
                <button
                  onClick={handleCustomPhraseAdd}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === "ar" ? "تطبيق" : "Apply"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Goal selection */}
          <div className="mt-4 pt-4 border-t border-amber-500/10">
            <h4 className="text-xs text-gray-400 mb-2 font-medium">
              {lang === "ar" ? "الهدف والتكرار المحدد:" : "Dhikr Target Goal:"}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[33, 99, 100, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    setCounter(0);
                  }}
                  className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    target === t
                      ? "bg-amber-600 text-slate-950 font-bold border-amber-500"
                      : "bg-[#050B18] border-white/5 text-gray-400 hover:border-amber-500/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center column: Main interactive Counter Button */}
        <div className="lg:col-span-7 bg-[#071129] border border-amber-900/30 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg min-h-[400px]">
          {/* Sounds and Quick Controls */}
          <div className="w-full flex justify-between items-center mb-4 border-b border-amber-500/10 pb-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg bg-[#050B18] transition-colors border ${
                soundEnabled ? "border-amber-500/20 text-amber-400" : "border-white/5 text-gray-500"
              }`}
              title={soundEnabled ? "Disable click audio" : "Enable click audio"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="text-center">
              <span className="text-xs text-gray-400 block font-mono">
                {lang === "ar" ? "الهدف الحالي" : "Target"}: {target}
              </span>
            </div>

            <button
              onClick={handleReset}
              className="p-2 bg-[#050B18] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
              title="Reset counter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Active phrase text layout */}
          <div className="text-center mb-6 min-h-[48px] flex items-center justify-center px-4">
            <h4 
              className="text-lg md:text-xl font-bold text-amber-200 tracking-wide font-sans cursor-pointer active:scale-95 transition-transform"
              dir="rtl"
              onClick={handleIncrement}
            >
              {selectedPhrase}
            </h4>
          </div>

          {/* Giant Clickable Circular Orb */}
          <div className="relative mb-6 select-none">
            {/* outer visual halo glow */}
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/30 to-yellow-400/20 blur-xl transition-all duration-700 ${
                counter > 0 && counter % target === 0 ? "scale-125 opacity-100" : "scale-100 opacity-60"
              }`} 
            />

            {/* active percentage ring in SVG background */}
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="98"
                stroke="rgba(212, 175, 55, 0.04)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="98"
                stroke="url(#goldGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 98}
                strokeDashoffset={2 * Math.PI * 98 * (1 - Math.min(counter % target, target) / target)}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Interactive Sphere Button */}
            <button
              onClick={handleIncrement}
              id="masbaha-increment-btn"
              className="absolute top-4 left-4 w-48 h-48 rounded-full bg-[#050B18] border border-amber-500/30 focus:outline-none flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-[inset_0_0_30px_rgba(212,175,55,0.15)] hover:border-amber-400"
            >
              <span className="text-5xl font-mono font-bold text-white tracking-tighter">
                {counter}
              </span>
              <span className="text-[11px] text-amber-500/80 uppercase tracking-widest font-mono mt-1">
                {lang === "ar" ? "اضغط للذكر" : "CLICK"}
              </span>

              {/* current cycle label */}
              {completedSessions > 0 && (
                <div className="mt-2 text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                  <Trophy className="w-3 h-3" />
                  <span>x{completedSessions}</span>
                </div>
              )}
            </button>
          </div>

          {/* Micro guidance instructions */}
          <p className="text-gray-400 text-xs font-sans text-center">
            {lang === "ar" 
              ? "سيتم تصفير العداد تلقائياً وتسجيل الختمة في السجل عند الوصول للرقم المستهدف."
              : "Counter resets and logs completed cycle as achievement when meeting target."}
          </p>
        </div>
      </div>

      {/* Complete session history lists */}
      <div className="w-full mt-6 bg-[#071129] border border-amber-500/10 p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={clearHistory}
            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-500/5 hover:bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "مسح السجل" : "Clear History"}</span>
          </button>
          <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5 direction-rtl">
            <Heart className="w-4 h-4 text-amber-400" />
            <span>{lang === "ar" ? "سجل الأذكار اليومي" : "Remembrance Logs"}</span>
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-xs">
            {lang === "ar" 
              ? "لا يوجد تسبيح مسجل بعد. ابدأ اليوم وحصن نفسك."
              : "No Dhikr cycles logged yet. Start reciting and claim rewards."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
            {history.map((record, index) => (
              <div 
                key={index}
                className="flex justify-between items-center bg-[#050B18]/80 hover:bg-[#050B18] border border-amber-500/5 p-2.5 rounded-xl transition-all"
              >
                <div className="text-left font-mono text-[10px] text-gray-400">
                  {record.date}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/15 text-amber-300 font-mono text-xs px-2 py-0.5 rounded-full font-semibold">
                    +{record.count}
                  </span>
                  <span className="font-sans text-xs text-white text-right leading-none font-medium" dir="rtl">
                    {record.phrase}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
