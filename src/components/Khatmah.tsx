import React, { useState, useEffect } from "react";
import { ListTodo, Plus, Award, AlignRight, BookOpen, Trash, Check, Sparkles, ChevronLeft, CalendarClock } from "lucide-react";

interface KhatmahGoal {
  id: string;
  title: string;
  startDate: string;
  durationDays: number;
  currentPages: number;
  totalPages: number; // usually 604
  createdAt: string;
}

interface ReadingLog {
  date: string;
  pagesRead: number;
}

interface KhatmahProps {
  lang: "ar" | "en";
}

export default function Khatmah({ lang }: KhatmahProps) {
  // Plan states
  const [plans, setPlans] = useState<KhatmahGoal[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>("");
  const [showPlannerForm, setShowPlannerForm] = useState<boolean>(false);

  // New plan form inputs
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDays, setFormDays] = useState<number>(30); // 30 days is common (1 juz per day)
  
  // Daily increment input
  const [incrementCount, setIncrementCount] = useState<string>("5");
  const [historyLogs, setHistoryLogs] = useState<ReadingLog[]>([]);

  // Achievements unlocked state
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    // Load existing plans from localStorage
    const savedPlans = localStorage.getItem("khatmah_plans");
    const activeId = localStorage.getItem("khatmah_active_id");
    const savedLogs = localStorage.getItem("khatmah_logs");
    const savedBadges = localStorage.getItem("khatmah_badges");

    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      setPlans(parsedPlans);
      if (activeId) {
        setActivePlanId(activeId);
      } else if (parsedPlans.length > 0) {
        setActivePlanId(parsedPlans[0].id);
      }
    } else {
      // Build default initial plan: "ختمة البداية والنور" (30 Days plan)
      const initial: KhatmahGoal = {
        id: "default_khatmah",
        title: lang === "ar" ? "ختمة النور والبركة" : "Khatmah of Light & Blessing",
        startDate: new Date().toISOString().split("T")[0],
        durationDays: 30,
        currentPages: 12,
        totalPages: 604,
        createdAt: new Date().toISOString()
      };
      setPlans([initial]);
      setActivePlanId("default_khatmah");
      localStorage.setItem("khatmah_plans", JSON.stringify([initial]));
      localStorage.setItem("khatmah_active_id", "default_khatmah");
    }

    if (savedLogs) setHistoryLogs(JSON.parse(savedLogs));
    else {
      // Generate some dummy historical pages read for last week stats
      const initialLogs = [
        { date: "06/10", pagesRead: 4 },
        { date: "06/11", pagesRead: 6 },
        { date: "06/12", pagesRead: 8 },
        { date: "06/13", pagesRead: 10 },
        { date: "06/14", pagesRead: 5 },
        { date: "06/15", pagesRead: 12 },
        { date: "06/16", pagesRead: 7 }
      ];
      setHistoryLogs(initialLogs);
      localStorage.setItem("khatmah_logs", JSON.stringify(initialLogs));
    }

    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  const activePlan = plans.find((p) => p.id === activePlanId);

  // Re-evaluate badges upon page increments
  useEffect(() => {
    if (!activePlan) return;
    
    const unlocked: string[] = [];
    if (activePlan.currentPages >= 1) unlocked.push("badge_start"); // Started
    if (activePlan.currentPages >= 151) unlocked.push("badge_quarter"); // 25%+
    if (activePlan.currentPages >= 302) unlocked.push("badge_half"); // 50%+
    if (activePlan.currentPages >= 453) unlocked.push("badge_three_quarters"); // 75%
    if (activePlan.currentPages >= 604) unlocked.push("badge_completed"); // Completed!
    if (historyLogs.length >= 3) unlocked.push("badge_consistency"); // Read 3 days in a row

    if (JSON.stringify(unlocked) !== JSON.stringify(badges)) {
      setBadges(unlocked);
      localStorage.setItem("khatmah_badges", JSON.stringify(unlocked));
    }
  }, [activePlan, historyLogs]);

  // Handle plan creation form
  const handleCreatePlan = (e: any) => {
    e.preventDefault();
    const title = formTitle.trim() || (lang === "ar" ? `خطة ختم جديدة` : `Khatmah Planner Goal`);
    
    const newPlan: KhatmahGoal = {
      id: "plan_" + Date.now(),
      title,
      startDate: new Date().toISOString().split("T")[0],
      durationDays: formDays,
      currentPages: 0,
      totalPages: 604,
      createdAt: new Date().toISOString()
    };

    const updatedPlans = [newPlan, ...plans];
    setPlans(updatedPlans);
    setActivePlanId(newPlan.id);
    localStorage.setItem("khatmah_plans", JSON.stringify(updatedPlans));
    localStorage.setItem("khatmah_active_id", newPlan.id);
    
    // reset form
    setFormTitle("");
    setFormDays(30);
    setShowPlannerForm(false);
  };

  const handleDeletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    if (updated.length > 0) {
      setActivePlanId(updated[0].id);
      localStorage.setItem("khatmah_active_id", updated[0].id);
    } else {
      setActivePlanId("");
      localStorage.removeItem("khatmah_active_id");
    }
    localStorage.setItem("khatmah_plans", JSON.stringify(updated));
  };

  // Add pages read log
  const handleAddProgress = () => {
    if (!activePlan) return;
    const count = parseInt(incrementCount);
    if (isNaN(count) || count <= 0) return;

    const newPages = Math.min(activePlan.currentPages + count, activePlan.totalPages);

    // Update plan array
    const updatedPlans = plans.map((p) => {
      if (p.id === activePlan.id) {
        return { ...p, currentPages: newPages };
      }
      return p;
    });

    setPlans(updatedPlans);
    localStorage.setItem("khatmah_plans", JSON.stringify(updatedPlans));

    // Append to daily logs graph
    const todayLabel = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    
    // Check if entry for today already exists, increment it, else push
    const existingLogIdx = historyLogs.findIndex((log) => log.date === todayLabel);
    let updatedLogs = [...historyLogs];
    if (existingLogIdx !== -1) {
      updatedLogs[existingLogIdx].pagesRead += count;
    } else {
      updatedLogs.push({ date: todayLabel, pagesRead: count });
    }
    // Limit to last 7 logs only
    updatedLogs = updatedLogs.slice(-7);
    setHistoryLogs(updatedLogs);
    localStorage.setItem("khatmah_logs", JSON.stringify(updatedLogs));

    // Buzz feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Quick buttons
  const setQuickProgress = (val: number) => {
    setIncrementCount(val.toString());
  };

  // Computes
  const totalPages = activePlan ? activePlan.totalPages : 604;
  const currentPages = activePlan ? activePlan.currentPages : 0;
  const remainingPages = Math.max(totalPages - currentPages, 0);
  const percentageCompleted = Math.round((currentPages / totalPages) * 100);

  // Plan computations
  const duration = activePlan ? activePlan.durationDays : 30;
  const dailyTarget = Math.round(totalPages / duration);
  
  // Calculate remaining days based on start date
  const getDaysRemaining = () => {
    if (!activePlan) return 0;
    const start = new Date(activePlan.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    const today = new Date();
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const daysRemaining = getDaysRemaining();
  const adjustedProjection = daysRemaining > 0 ? Math.ceil(remainingPages / daysRemaining) : dailyTarget;

  // List of standard achievable high-quality badges
  const availableBadges = [
    { id: "badge_start", nameAr: "عزم البداية", nameEn: "Will of Start", descAr: "قرأت أول صفحة في الختمة الجديدة", descEn: "Read your first page in the active Khatmah.", emoji: "🌱" },
    { id: "badge_quarter", nameAr: "رُبع الطريق", nameEn: "Quarter Journey", descAr: "أتممت قراءة 150 صفحة بنجاح", descEn: "Completed over 150 pages read.", emoji: "🥉" },
    { id: "badge_half", nameAr: "نصف القرآن", nameEn: "Half Quran Goal", descAr: "أنجزت قراءة 300 صفحة من القرآن الكريم", descEn: "Completed 300 pages read.", emoji: "🥈" },
    { id: "badge_three_quarters", nameAr: "على مشارف الختام", nameEn: "Before Sunset", descAr: "أنجزت قراءة 450 صفحة واقتربت من الختمة", descEn: "Completed 450 pages read.", emoji: "🥇" },
    { id: "badge_completed", nameAr: "قارئ المصحف المضيء", nameEn: "Mudee Graduated", descAr: "أتممت ختم القرآن الكريم كاملا هنيئاً لك!", descEn: "Successfully finished reading the entire Quran!", emoji: "👑" },
    { id: "badge_consistency", nameAr: "المثابر الرصين", nameEn: "Spiritual Devotion", descAr: "التزمت بالقراءة والتوثيق لثلاثة أيام متتالية", descEn: "Maintained a continuous 3-day reading streak", emoji: "🔥" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      
      {/* Header element */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium md:text-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{lang === "ar" ? "برنامج الختمة والتحصيل الإيماني" : "Interactive Khatmah Progression Tracker"}</span>
        </div>
        <h2 className="text-2xl font-bold mt-2 text-white font-sans">
          {lang === "ar" ? "ختمة القرآن الكريم المضيئة" : "Daily Graduation Plan Metrics"}
        </h2>
        <p className="text-gray-400 text-xs max-w-md mt-1 mx-auto leading-relaxed">
          {lang === "ar" 
            ? "خطط لمستواك العبادي اليومي، سجّل تقدمك بلمسات سريعة، واحصد إنجازاتك."
            : "Plan your daily worship readings, log page increments swiftly, and monitor streaks."}
        </p>
      </div>

      {/* Grid of contents: Left columns is form/switcher, Right column is metrics */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column - Select plan OR Create plan */}
        <div className="lg:col-span-4 bg-[#0B132B]/85 border border-amber-500/15 p-5 rounded-3xl flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-amber-500/10 pb-2">
              <button
                onClick={() => setShowPlannerForm(!showPlannerForm)}
                className="bg-amber-600/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1 font-medium shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showPlannerForm ? (lang === "ar" ? "الخطط" : "Plans") : (lang === "ar" ? "خطة جديدة" : "New Plan")}</span>
              </button>
              
              <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1 pr-1">
                <ListTodo className="w-4 h-4 text-amber-400" />
                <span>{lang === "ar" ? "خطتي المعتمدة" : "Active Plans"}</span>
              </h3>
            </div>

            {/* If Planner Form is selected */}
            {showPlannerForm ? (
              <form onSubmit={handleCreatePlan} className="space-y-4 font-sans active:outline-none">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    {lang === "ar" ? "مسمى الخطة والمنهاج:" : "Title of your Khatmah Plan:"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    placeholder={lang === "ar" ? "مثال: ختمة رمضان أو خطة الورد الصباحي" : "e.g., Summer Khatmah"}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#070C1B] border border-gray-800 focus:border-amber-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    {lang === "ar" ? "المستهدف لإنهاء الختم (أيام):" : "Days to complete (Duration):"}
                  </label>
                  <select
                    value={formDays}
                    onChange={(e) => setFormDays(parseInt(e.target.value))}
                    className="w-full bg-[#070C1B] border border-gray-800 rounded-xl py-2 px-3 text-sm text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="10">{lang === "ar" ? "10 أيام (مكثف جداً)" : "10 Days (Very Intense)"}</option>
                    <option value="15">{lang === "ar" ? "15 يوم (خاتمين في الشهر)" : "15 Days (2 Parts/Day)"}</option>
                    <option value="30">{lang === "ar" ? "30 يوم (جزء واحد يومياً)" : "30 Days (1 Part/Day)"}</option>
                    <option value="60">{lang === "ar" ? "60 يوم (نصف جزء يومياً)" : "60 Days (Half Part/Day)"}</option>
                    <option value="90">{lang === "ar" ? "90 يوم (سفر متأمل مريح)" : "90 Days (Relaxed Journey)"}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-[#090D1C] font-bold text-xs py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.15)] flex justify-center items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === "ar" ? "تأكيد وبدء الخطة" : "Create & Start Goal"}</span>
                </button>
              </form>
            ) : (
              /* Plans Switcher list */
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {plans.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    {lang === "ar" ? "لا توجد خطة مفعلة. أنشئ واحدة للبدء!" : "No active goals found. Click new plan."}
                  </div>
                ) : (
                  plans.map((p) => {
                    const progressVal = Math.round((p.currentPages / p.totalPages) * 100);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActivePlanId(p.id);
                          localStorage.setItem("khatmah_active_id", p.id);
                        }}
                        className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          activePlanId === p.id
                            ? "bg-amber-500/5 border-amber-500/60 shadow-inner"
                            : "bg-[#070C1B] border-gray-800/80 hover:border-amber-500/10 hover:bg-[#070C1B]/80"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(p.id);
                            }}
                            className="text-gray-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/5 transition-all"
                            title="Delete this goal"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className={`text-sm font-semibold truncate ${activePlanId === p.id ? "text-amber-300" : "text-white"}`}>
                            {p.title}
                          </span>
                        </div>

                        {/* info statistics */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-gray-400 font-sans">
                            {progressVal}% | {p.durationDays} {lang === "ar" ? "يوم" : "days"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {p.currentPages}/{p.totalPages} {lang === "ar" ? "ص" : "p"}
                          </span>
                        </div>

                        {/* progress line */}
                        <div className="w-full bg-gray-800/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${progressVal}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {!showPlannerForm && activePlan && (
            <div className="mt-4 pt-4 border-t border-amber-500/10 text-center">
              <span className="text-[10.5px] text-gray-500 block">
                {lang === "ar" ? "تاريخ بدء الختم:" : "Goal Launch Date:"}
              </span>
              <span className="text-xs font-mono text-gray-300 font-medium">
                {activePlan.startDate}
              </span>
            </div>
          )}
        </div>

        {/* Right column - Dynamic Page Increment and Stats Rings */}
        {activePlan ? (
          <div className="lg:col-span-8 bg-[#0B132B]/85 border border-amber-500/15 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 shadow-2xl">
            
            {/* Progression details */}
            <div className="md:col-span-6 flex flex-col justify-between">
              
              {/* Daily page logger */}
              <div>
                <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{lang === "ar" ? "توثيق صفحات التلاوة" : "Record Daily Readings"}</span>
                </h3>

                <div className="bg-[#070C1B] border border-gray-800/80 rounded-2xl p-4">
                  <span className="text-[11px] text-gray-400 block mb-1.5">
                    {lang === "ar" ? "كم صفحة أنجزت قراءتها الآن؟" : "Select number of pages to log:"}
                  </span>
                  
                  {/* Quick selection tabs */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1, 5, 10, 20].map((v) => (
                      <button
                        key={v}
                        onClick={() => setQuickProgress(v)}
                        className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          incrementCount === v.toString()
                            ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                            : "bg-[#0B132B] border-gray-800 text-gray-400 hover:border-gray-700"
                        }`}
                      >
                        +{v}
                      </button>
                    ))}
                  </div>

                  {/* Manual input counter */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={incrementCount}
                      onChange={(e) => setIncrementCount(e.target.value)}
                      className="bg-[#0B132B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-center font-mono text-white focus:outline-none focus:border-emerald-500 w-full"
                    />
                    
                    <button
                      onClick={handleAddProgress}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>{lang === "ar" ? "توثيق" : "Log"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress summaries */}
              <div className="mt-5 space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">{lang === "ar" ? "الصفحات المنجزة:" : "Pages read:"}</span>
                  <span className="font-mono text-white font-semibold">{currentPages} {lang === "ar" ? "صفحة" : "p"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">{lang === "ar" ? "الصفحات المتبقية للختمة:" : "Remaining pages:"}</span>
                  <span className="font-mono text-amber-300 font-semibold">{remainingPages} {lang === "ar" ? "صفحة" : "p"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">{lang === "ar" ? "المستهدف اليومي الثابت:" : "Fixed Daily Target:"}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{dailyTarget} {lang === "ar" ? "صفحات/يوم" : "p/day"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{lang === "ar" ? "معدل القراءة المقترح للإنجاز:" : "Suggested pace:"}</span>
                  <span className="font-mono text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/10">
                    {adjustedProjection} {lang === "ar" ? "صفحة/يوم" : "p/day"}
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing circular progress graph */}
            <div className="md:col-span-6 flex flex-col items-center justify-center border-l md:border-l-0 md:border-r border-amber-500/10 pl-0 md:pl-4">
              
              <div className="relative">
                {/* SVG glowing circle ring */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(16, 185, 129, 0.05)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="url(#emeraldGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - percentageCompleted / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inside circle text representation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-bold text-white">
                    {percentageCompleted}%
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                    {lang === "ar" ? "إنجاز الختم" : "Completed"}
                  </span>
                </div>
              </div>

              {/* Progress remaining days estimation bar card */}
              <div className="w-full mt-4 bg-[#070C1B] rounded-2xl p-3 border border-gray-800 text-center flex items-center justify-center gap-3">
                <CalendarClock className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block leading-tight">
                    {lang === "ar" ? "الأيام المتبقية في الخطة" : "Days remaining until plan end"}
                  </span>
                  <span className="text-sm font-sans font-bold text-white">
                    {daysRemaining} {lang === "ar" ? "أيام متبقية" : "days left"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#0B132B]/85 border border-amber-500/15 p-12 rounded-3xl flex flex-col items-center justify-center shadow-xl text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mb-3 animate-pulse" />
            <p className="text-sm text-gray-400">{lang === "ar" ? "الرجاء اختيار أو إنشاء خطة ختم جديدة بالجانب لتفعيل لوحة الموشرات." : "Please select or create a Khatmah plan on the left side to load dashboards."}</p>
          </div>
        )}
      </div>

      {/* Gamified system bottom row: Achievements medals */}
      <div className="w-full mt-6 bg-[#0B132B]/60 border border-amber-500/10 p-5 rounded-3xl">
        <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5 mb-4 border-b border-amber-500/10 pb-2.5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{lang === "ar" ? "الأوسمة والإنجازات الروحانية المنفتحة" : "Spiritual Achievement Badges Claimed"}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {availableBadges.map((badge) => {
            const isUnlocked = badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300 relative ${
                  isUnlocked
                    ? "bg-amber-500/10 border-amber-500/35 grayscale-0 shadow-lg"
                    : "bg-[#070C1B]/90 border-gray-900 grayscale opacity-40 hover:opacity-50"
                }`}
              >
                {/* Badge Emoji */}
                <div className="text-3xl mb-1.5 select-none relative filter drop-shadow">
                  {badge.emoji}
                  {isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white scale-75 shadow">
                      <Check className="w-2 h-2" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="text-[11px] font-bold text-white font-sans leading-snug">
                  {lang === "ar" ? badge.nameAr : badge.nameEn}
                </div>

                {/* desc */}
                <p className="text-[9px] text-gray-500 mt-1 leading-snug font-sans truncate w-full" title={lang === "ar" ? badge.descAr : badge.descEn}>
                  {lang === "ar" ? badge.descAr : badge.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
