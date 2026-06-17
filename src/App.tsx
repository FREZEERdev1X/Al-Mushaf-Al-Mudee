import React, { useState, useEffect, useRef } from "react";
import { 
  Book, BookOpen, Sparkles, User, Volume2, VolumeX, Maximize2, Settings, Search, 
  Share2, Bookmark, Copy, RotateCcw, Compass as CompassIcon, Activity, Award, 
  MessageSquare, Play, Pause, SkipForward, SkipBack, Sliders, Globe, 
  Languages, X, Moon, Sun, Flame, Download, Check, Heart, HelpCircle, Eye, EyeOff,
  ChevronLeft, AlignRight, AlertCircle
} from "lucide-react";

import { quranSurahs, SurahMetadata } from "./data/quranMetadata";
import { quranFallback } from "./data/quranFallback";
import { athkarData, dailyDuas, dailyHadiths, quranicBenefits } from "./data/athkar";

import Masbaha from "./components/Masbaha";
import Compass from "./components/Compass";
import Khatmah from "./components/Khatmah";
import AICompanion from "./components/AICompanion";

// Standard translations catalog
const uiTranslations = {
  ar: {
    appName: "المصحف المضيء",
    tagline: "Al-Mushaf Al-Mudee",
    dashboard: "ورد اليوم",
    mushaf: "المصحف",
    khatmah: "الختمات",
    athkar: "الأذكار والذكر",
    prayerQibla: "المواقيت والقبلة",
    masbaha: "السبحة",
    aiScholar: "المساعد المضيء",
    resumeReading: "واصل القراءة من حيث توقفت",
    lastRead: "آخر موضع قراءة:",
    unspecified: "غير محدد",
    searchSurah: "البحث في أسماء وفهرس السور...",
    allSurahs: "جميع سور القرآن",
    meccan: "مكية",
    medinan: "مدينية",
    ayahsCount: "عدد الآيات:",
    revelation: "مكان النزول:",
    juzStart: "أوّل جزء:",
    bookmarkAdded: "تم حفظ موضع القراءة بنجاح تلقائياً!",
    bookmarkAyah: "حفظ كإشارة مرجعية",
    bookmarkedWord: "إشارة محفوظة",
    fontSizeAr: "حجم الخط العربي",
    fontSizeEn: "حجم خط الترجمة",
    fontFamily: "نوع خط المصحف",
    showTranslation: "عرض الترجمة الإنجليزية",
    showTafseer: "عرض التفسير الميسر المفتوح",
    continuousView: "عرض المصحف العثماني المتواصل",
    verseView: "عرض آية بآية مع التفسير والترجمة",
    loadingSurah: "جاري تحميل الآيات العثمانية من السحابة...",
    noConnectionFallback: "تعذر الاتصال بقاعدة البيانات. جاري تحميل نسخة احتياطية محلية.",
    ayahOfTheDay: "آية اليوم للتدبّر",
    hadithOfTheDay: "حديث اليوم الشريف",
    benefitOfTheDay: "فائدة قرآنية وتأملية",
    shareImage: "مشاركة كبطاقة إيمانية",
    copyAyahSuccess: "تم نسخ النص بنجاح!",
    reciter: "القارئ الصوتي الحالي:",
    sleepTimer: "مؤقت إيقاف التشغيل",
    verseRepeat: "تكرار الآية للحفظ",
    close: "إغلاق",
    generateCard: "تصميم البطاقة الإيمانية الفاخرة",
    selectBackdrop: "اختر الخلفية الروحانية:",
    copyText: "نسخ النص المنسق",
    downloadCard: "تحميل ومشاركة الصورة",
    tafseerTitle: "التفسير الميسر للآية:",
    streakTitle: "عداد همتك اليومية",
    streakSub: "أيام التلاوة والذكر المتتالية",
    splashText: "المصحف المضيء | Al-Mushaf Al-Mudee",
    splashSub: "نور يضيء يومك وعبادتك بـالقرآن والذكر",
    searchPlaceholder: "ابحث عن سور مثل الملك، يس، الكهف..."
  },
  en: {
    appName: "Al-Mushaf Al-Mudee",
    tagline: "The Glowing Mushaf",
    dashboard: "Dashboard",
    mushaf: "Al-Quran",
    khatmah: "Khatmah Goal",
    athkar: "Dhikr & Prayers",
    prayerQibla: "Prayer & Qibla",
    masbaha: "Tasbih",
    aiScholar: "AI Assistant",
    resumeReading: "Resume Reading",
    lastRead: "Last Read Location:",
    unspecified: "None",
    searchSurah: "Search surahs, juz, keywords...",
    allSurahs: "Holy Quran Index",
    meccan: "Meccan",
    medinan: "Medinan",
    ayahsCount: "Verses:",
    revelation: "Revelation:",
    juzStart: "Juz:",
    bookmarkAdded: "Saved reading location successfully!",
    bookmarkAyah: "Save bookmark",
    bookmarkedWord: "Bookmarked",
    fontSizeAr: "Arabic Font Size",
    fontSizeEn: "Translation Font Size",
    fontFamily: "Arabic Script style",
    showTranslation: "Show English Translation",
    showTafseer: "Show Al-Muyassar Tafseer",
    continuousView: "Continuous Book View (Rasm)",
    verseView: "Verse-by-Verse (With Tafseer)",
    loadingSurah: "Loading majestic Quranic verses online...",
    noConnectionFallback: "Using resilient localized fallback databases.",
    ayahOfTheDay: "Ayah of the Day for Reflection",
    hadithOfTheDay: "Hadith of the Day",
    benefitOfTheDay: "Quranic Wisdom Reflection",
    shareImage: "Share Card",
    copyAyahSuccess: "Copied text content successfully!",
    reciter: "Active Reciter:",
    sleepTimer: "Sleep Timer",
    verseRepeat: "Verse Memorize Count",
    close: "Close",
    generateCard: "Aesthetic Islamic Card Customizer",
    selectBackdrop: "Select Spiritual Backdrop Theme:",
    copyText: "Copy Styled Text",
    downloadCard: "Download and Share Image",
    tafseerTitle: "Al-Muyassar Tafseer Explanation:",
    streakTitle: "Spiritual Reading Streak",
    streakSub: "Consecutive devotion days recorded",
    splashText: "Al-Mushaf Al-Mudee",
    splashSub: "Illuminate your day with Quran & Dhikr",
    searchPlaceholder: "Search surah Al-Mulk, Ya-Sin, Kahf..."
  }
};

interface AyahItem {
  numberInSurah: number;
  text: string;
  translation: string;
}

interface LoadedSurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AyahItem[];
}

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [splashVisible, setSplashVisible] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Streak counter states
  const [streakCount, setStreakCount] = useState<number>(3);

  // Quran Reader States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [activeSurahData, setActiveSurahData] = useState<LoadedSurahData | null>(null);
  const [surahLoading, setSurahLoading] = useState<boolean>(false);
  const [surahError, setSurahError] = useState<string | null>(null);
  
  // Bookmarks Last Read State
  const [lastReadSurah, setLastReadSurah] = useState<{ id: number; nameAr: string; nameEn: string; verse: number } | null>(null);
  const [surahBookmarks, setSurahBookmarks] = useState<Record<number, number[]>>({}); // SurahId -> Array of verses bookmarked

  // Stylizations slider
  const [arabicFontSize, setArabicFontSize] = useState<number>(26);
  const [englishFontSize, setEnglishFontSize] = useState<number>(14);
  const [fontFamilyType, setFontFamilyType] = useState<string>("amiri"); // amiri vs cairo vs me_quran
  const [readingMode, setReadingMode] = useState<"continuous" | "verseByVerse">("verseByVerse");
  const [displayTranslation, setDisplayTranslation] = useState<boolean>(true);
  const [displayTafseer, setDisplayTafseer] = useState<boolean>(false);

  // Audio System States
  const [activePlaying, setActivePlaying] = useState<boolean>(false);
  const [activeVerseAudioIndex, setActiveVerseAudioIndex] = useState<number | null>(null); // index inside Surah (0-indexed)
  const [selectedReciter, setSelectedReciter] = useState<string>("everyayah.Yasser_Ad-Dussary_128kbps"); // default Yasser Al-Dossari, supports everyayah and cdn.islamic.network sources
  const [repeatLimit, setRepeatLimit] = useState<number>(1); // 1, 2, 3 repetitions for memorizers
  const [repeatCounter, setRepeatCounter] = useState<number>(0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0); // 0 = disabled, else 15, 30, 45, 60
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Card Creator Generator States
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [cardContent, setCardContent] = useState<{ textAr: string; textEn: string; source: string }>({ textAr: "", textEn: "", source: "" });
  const [cardBackdrop, setCardBackdrop] = useState<string>("royal_gold");
  const [copiedIndicator, setCopiedIndicator] = useState<boolean>(false);

  // Daily dynamic generators
  const [dailyAyah, setDailyAyah] = useState<{ text: string; translation: string; surah: string; verse: number } | null>(null);
  const [dailyHadith, setDailyHadith] = useState<{ hadith: string; translation: string; source: string } | null>(null);
  const [dailyBenefit, setDailyBenefit] = useState<{ titleAr: string; titleEn: string; textAr: string; textEn: string } | null>(null);
  const [randomDua, setRandomDua] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);

  // Splash Screen & Initial Data loader
  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2800);

    // Load bookmarks and last read
    const savedLastRead = localStorage.getItem("quran_last_read");
    if (savedLastRead) setLastReadSurah(JSON.parse(savedLastRead));

    const savedBookmarks = localStorage.getItem("quran_bookmarks");
    if (savedBookmarks) setSurahBookmarks(JSON.parse(savedBookmarks));

    const savedLang = localStorage.getItem("app_lang");
    if (savedLang) setLang(savedLang as "ar" | "en");

    // Seed Random Daily Elements
    selectDailySpiritualGifts();

    return () => clearTimeout(timer);
  }, []);

  const selectDailySpiritualGifts = () => {
    // Elegant hardcoded picks for "Ayah of the Day"
    const beautifulVerses = [
      { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.", surah: "البقرة", verse: 255 },
      { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Indeed, with hardship [will be] ease.", surah: "الشرح", verse: 6 },
      { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", translation: "And say, \"My Lord, increase me in knowledge.\"", surah: "طه", verse: 114 },
      { text: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ", translation: "And rely upon the Ever-Living who does not die...", surah: "الفرقان", verse: 58 }
    ];

    const pickVerse = beautifulVerses[new Date().getDate() % beautifulVerses.length];
    setDailyAyah(pickVerse);

    const pickHadith = dailyHadiths[new Date().getDate() % dailyHadiths.length];
    setDailyHadith(pickHadith);

    const pickBenefit = quranicBenefits[new Date().getDate() % quranicBenefits.length];
    setDailyBenefit(pickBenefit);

    const pickDua = dailyDuas[new Date().getDate() % dailyDuas.length];
    setRandomDua(pickDua);
  };

  // Lang state sync
  const switchLang = (newLang: "ar" | "en") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  // Toggle dark/light modes
  const handleToggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  };

  // Fetch Surah verses from custom Proxy caching backend Api
  useEffect(() => {
    if (selectedSurahId === null) return;

    const fetchSurah = async () => {
      setSurahLoading(true);
      setSurahError(null);
      setActiveSurahData(null);
      setActiveVerseAudioIndex(null);
      setActivePlaying(false);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      try {
        let fetchedData = null;

        // 1. High Resilience: Attempt to fetch directly from the client's public API endpoint.
        // This is extremely robust because browser-side requests bypass cloud hosting (Google Cloud Run) IP rate limits or blocklists.
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          
          const clientResponse = await fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurahId}/editions/quran-uthmani,en.sahih`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (clientResponse.ok) {
            const clientJson = await clientResponse.json();
            if (clientJson.code === 200 && clientJson.data && clientJson.data.length >= 2) {
              const arabicEdition = clientJson.data[0];
              const englishEdition = clientJson.data[1];
              fetchedData = {
                number: arabicEdition.number,
                name: arabicEdition.name,
                englishName: arabicEdition.englishName,
                englishNameTranslation: arabicEdition.englishNameTranslation,
                revelationType: arabicEdition.revelationType,
                numberOfAyahs: arabicEdition.numberOfAyahs,
                ayahs: arabicEdition.ayahs.map((ayah: any, index: number) => ({
                  numberInSurah: ayah.numberInSurah,
                  text: ayah.text,
                  translation: englishEdition.ayahs[index]?.text || ""
                }))
              };
              console.log("Quran loaded successfully via direct client-side API.");
            }
          }
        } catch (clientErr) {
          console.warn("Direct client-side AlQuran API fetch failed or timed out. Falling back to backend proxy...", clientErr);
        }

        // 2. Failure fallback: If client-side direct request did not succeed, fetch from server proxy
        if (!fetchedData) {
          const response = await fetch(`/api/quran/surah/${selectedSurahId}`);
          const json = await response.json();

          if (response.ok && json.data) {
            fetchedData = json.data;
            console.log("Quran loaded successfully via server-side proxy API.");
          } else {
            throw new Error(json.error || "Failed to load Surah text via proxy");
          }
        }

        if (fetchedData) {
          setActiveSurahData(fetchedData);
        } else {
          throw new Error("No data received from client or proxy");
        }
      } catch (err: any) {
        console.warn("Backend dynamic fetch failed. Loading secure local fallback offline...", err);
        // Resilent offline fallback data lookup
        const offlineData = quranFallback[selectedSurahId];
        if (offlineData) {
          setActiveSurahData({
            number: offlineData.number,
            name: offlineData.name,
            englishName: offlineData.englishName,
            englishNameTranslation: offlineData.englishNameTranslation,
            revelationType: offlineData.revelationType,
            numberOfAyahs: offlineData.ayahs.length,
            ayahs: offlineData.ayahs
          });
          setSurahError(uiTranslations[lang].noConnectionFallback);
        } else {
          // generate dummy loading block so it never crashes
          setSurahError(uiTranslations[lang].noConnectionFallback);
          generateDummOfflineSurah(selectedSurahId);
        }
      } finally {
        setSurahLoading(false);
      }
    };

    fetchSurah();
  }, [selectedSurahId]);

  const generateDummOfflineSurah = (id: number) => {
    const meta = quranSurahs.find((s) => s.number === id);
    if (!meta) return;
    setActiveSurahData({
      number: id,
      name: meta.name,
      englishName: meta.englishName,
      englishNameTranslation: meta.englishNameTranslation,
      revelationType: meta.revelationType,
      numberOfAyahs: meta.numberOfAyahs,
      ayahs: Array.from({ length: Math.min(meta.numberOfAyahs, 12) }).map((_, idx) => ({
        numberInSurah: idx + 1,
        text: `بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ - آية ${idx + 1} تجريبية في وضع الأوفلاين الكامل.`,
        translation: `Sample Offline fallback verse ${idx + 1} for preview. Please connect to internet to cache complete Quran.`
      }))
    });
  };

  // Autoplay progression & loop logics
  useEffect(() => {
    if (!audioRef.current) return;

    const handleAudioEnded = () => {
      if (!activeSurahData || activeVerseAudioIndex === null) return;

      // Memorizer repetition loop check
      if (repeatCounter + 1 < repeatLimit) {
        setRepeatCounter(repeatCounter + 1);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log(e));
        }
        return;
      }

      // Progression to next verse
      setRepeatCounter(0);
      const nextIdx = activeVerseAudioIndex + 1;
      if (nextIdx < activeSurahData.ayahs.length) {
        setActiveVerseAudioIndex(nextIdx);
        // Trigger auto scrolling
        setTimeout(() => {
          activeVerseRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      } else {
        // finished surah
        setActivePlaying(false);
        setActiveVerseAudioIndex(null);
      }
    };

    const currentAudio = audioRef.current;
    currentAudio.addEventListener("ended", handleAudioEnded);
    return () => {
      currentAudio.removeEventListener("ended", handleAudioEnded);
    };
  }, [activeSurahData, activeVerseAudioIndex, repeatLimit, repeatCounter]);

  // Handle active playing sound trigger
  useEffect(() => {
    if (!audioRef.current || activeVerseAudioIndex === null || !activeSurahData) return;

    // Map current active Verse index to global index to fetch from the Islamic Network API
    const calculateGlobalAyahNumber = (surahNum: number, verseNumInSurah: number) => {
      let cumulative = 0;
      for (let i = 1; i < surahNum; i++) {
        const found = quranSurahs.find((s) => s.number === i);
        cumulative += found ? found.numberOfAyahs : 0;
      }
      return cumulative + verseNumInSurah;
    };

    const globalIndex = calculateGlobalAyahNumber(selectedSurahId!, activeSurahData.ayahs[activeVerseAudioIndex].numberInSurah);
    let audioUrl = "";
    if (selectedReciter.startsWith("everyayah.")) {
      const folder = selectedReciter.replace("everyayah.", "");
      const surahStr = selectedSurahId!.toString().padStart(3, "0");
      const ayahStr = activeSurahData.ayahs[activeVerseAudioIndex].numberInSurah.toString().padStart(3, "0");
      audioUrl = `https://everyayah.com/data/${folder}/${surahStr}${ayahStr}.mp3`;
    } else {
      audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${globalIndex}.mp3`;
    }

    audioRef.current.src = audioUrl;
    if (activePlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio Context blocked by browser permission policy:", err);
        setActivePlaying(false);
      });
    }
  }, [activeVerseAudioIndex, selectedReciter]);

  // Play controls
  const togglePlayAudio = (idx?: number) => {
    if (!activeSurahData) return;

    // If tapping specifically on a verse play button
    if (idx !== undefined) {
      if (activeVerseAudioIndex === idx) {
        if (activePlaying) {
          audioRef.current?.pause();
          setActivePlaying(false);
        } else {
          audioRef.current?.play().catch(e => console.log(e));
          setActivePlaying(true);
        }
      } else {
        setRepeatCounter(0);
        setActiveVerseAudioIndex(idx);
        setActivePlaying(true);
      }
      return;
    }

    // Default bar bottom triggers
    if (activeVerseAudioIndex === null) {
      setRepeatCounter(0);
      setActiveVerseAudioIndex(0);
      setActivePlaying(true);
    } else {
      if (activePlaying) {
        audioRef.current?.pause();
        setActivePlaying(false);
      } else {
        audioRef.current?.play().catch(e => console.log(e));
        setActivePlaying(true);
      }
    }
  };

  const handleNextTrack = () => {
    if (!activeSurahData || activeVerseAudioIndex === null) return;
    const nextIdx = activeVerseAudioIndex + 1;
    if (nextIdx < activeSurahData.ayahs.length) {
      setRepeatCounter(0);
      setActiveVerseAudioIndex(nextIdx);
    }
  };

  const handlePrevTrack = () => {
    if (!activeSurahData || activeVerseAudioIndex === null) return;
    const prevIdx = activeVerseAudioIndex - 1;
    if (prevIdx >= 0) {
      setRepeatCounter(0);
      setActiveVerseAudioIndex(prevIdx);
    }
  };

  // Sleep Timer execution
  useEffect(() => {
    if (sleepTimerMinutes === 0) {
      setSleepTimerRemaining(null);
      return;
    }

    setSleepTimerRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          audioRef.current?.pause();
          setActivePlaying(false);
          setSleepTimerMinutes(0);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  // Bookmarking and Saved placements
  const handleAddBookmark = (surahId: number, verseNum: number) => {
    const list = surahBookmarks[surahId] || [];
    let updated: number[];
    if (list.includes(verseNum)) {
      updated = list.filter((v) => v !== verseNum);
    } else {
      updated = [...list, verseNum];
    }

    const nextBookmarks = { ...surahBookmarks, [surahId]: updated };
    setSurahBookmarks(nextBookmarks);
    localStorage.setItem("quran_bookmarks", JSON.stringify(nextBookmarks));

    // Save automatic last read
    const activeMeta = quranSurahs.find((s) => s.number === surahId);
    if (activeMeta) {
      const lastReadObj = {
        id: surahId,
        nameAr: activeMeta.name,
        nameEn: activeMeta.englishName,
        verse: verseNum
      };
      setLastReadSurah(lastReadObj);
      localStorage.setItem("quran_last_read", JSON.stringify(lastReadObj));
    }

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // Launch Card image Creator Modal
  const openCardCreator = (textAr: string, textEn: string, source: string) => {
    setCardContent({ textAr, textEn, source });
    setCardBackdrop("royal_gold");
    setCopiedIndicator(false);
    setShowShareModal(true);
  };

  const handleCopyCardText = () => {
    const textToCopy = `✨ ${cardContent.textAr}\n\n"${cardContent.textEn}"\n\n— المصدر: ${cardContent.source} | تطبيق المصحف المضيء`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndicator(true);
    setTimeout(() => setCopiedIndicator(false), 2000);
  };

  const simulateDownloadAction = () => {
    // Show download simulation notice and flash haptic feedback
    alert(lang === "ar" ? "تم توليد وتصدير البطاقة الإيمانية الفاخرة بجودة عالية لجهازك!" : "Splendid! The high-quality spiritual quote card was generated and saved to your devices successfully.");
    setShowShareModal(false);
  };

  // Filters for Surah Index search
  const filteredSurahs = quranSurahs.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.includes(query) ||
      s.englishName.toLowerCase().includes(query) ||
      s.number.toString() === query ||
      `جزء ${s.juzStart}`.includes(query) ||
      `juz ${s.juzStart}`.includes(query)
    );
  });

  return (
    <div className={`min-h-screen ${themeMode === "dark" ? "bg-[#050B18] text-white" : "bg-[#fdfbf7] text-gray-900"} font-sans transition-colors duration-300 relative overflow-x-hidden`}>
      
      {/* Background Starry Glow Simulation pattern inside dark mode */}
      {themeMode === "dark" && (
        <div className="absolute inset-0 bg-[#050B18] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      )}

      {/* 1. Splash Loading Screen overlay */}
      {splashVisible && (
        <div className="fixed inset-0 z-50 bg-[#050B18] flex flex-col items-center justify-center text-center px-4 transition-all duration-700">
          
          {/* Animated Islamic luxury lantern dome mockup */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-200 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(217,119,6,0.3)] animate-pulse">
              <BookOpen className="w-11 h-11 text-[#050B18] stroke-[2]" />
            </div>
            
            {/* candle glimmers glow halo */}
            <div className="absolute -inset-2 rounded-full border border-amber-500/10 animate-ping opacity-65" />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-wide font-sans mb-2 text-shadow-sm">
            {uiTranslations[lang].splashText}
          </h1>
          <p className="text-amber-500 text-[10px] uppercase tracking-[0.2em] max-w-sm font-semibold">
            {uiTranslations[lang].splashSub}
          </p>

          <div className="mt-8 flex gap-1 justify-center items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-200" />
            <span className="w-2 h-2 bg-amber-300 rounded-full animate-bounce delay-300" />
          </div>
        </div>
      )}

      {/* Background audio tag helper node */}
      <audio ref={audioRef} />

      {/* 2. Top Navigation Header Bar */}
      <header className={`sticky top-0 z-40 px-10 py-3 border-b backdrop-blur-md flex items-center justify-between ${
        themeMode === "dark" ? "bg-[#050B18]/90 border-amber-900/10" : "bg-[#fdfbf7]/90 border-amber-500/15"
      }`}>
        
        {/* Languages Switcher & Theme toggles */}
        <div className="flex items-center gap-2">
          
          {/* Dual language prompt toggle button */}
          <button
            onClick={() => switchLang(lang === "ar" ? "en" : "ar")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              themeMode === "dark" 
                ? "bg-[#071129] border-amber-900/30 text-amber-400 hover:border-amber-400" 
                : "bg-amber-500/5 border-amber-500/20 text-amber-700 hover:bg-amber-500/10"
            }`}
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Theme custom Toggle Button (Light & Dark) */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              themeMode === "dark" 
                ? "bg-[#071129] border-amber-900/30 text-amber-400 hover:border-amber-400" 
                : "bg-amber-500/5 border-amber-500/15 text-amber-600 hover:bg-amber-500/10"
            }`}
            title="Toggle theme mode"
          >
            {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Brand name and dynamic tagline */}
        <div className="text-right flex items-center gap-2.5">
          <div className="hidden sm:block">
            <h1 className="text-base font-extrabold tracking-wide text-amber-500 text-shadow-sm">
              {uiTranslations[lang].appName}
            </h1>
            <span className="text-[10px] text-amber-200/50 uppercase tracking-[0.2em] block -mt-0.5">
              {uiTranslations[lang].tagline}
            </span>
          </div>
          
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-amber-200 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            <BookOpen className="w-5 h-5 text-[#050B18] stroke-[2.5]" />
          </div>
        </div>
      </header>

      {/* 3. Global Sub Tabs layout switcher (Bento bar scrollable on smaller widths) */}
      <nav className={`w-full overflow-x-auto border-b sticky top-[57px] z-30 flex justify-center py-2 px-4 shadow-sm select-none scrollbar-none ${
        themeMode === "dark" ? "bg-[#050B18]/95 border-amber-900/10" : "bg-[#f9f5ed]/95 border-amber-500/10"
      }`}>
        <div className="flex gap-1 items-center max-w-full md:max-w-4xl">
          {[
            { id: "home", label: uiTranslations[lang].dashboard, icon: Activity },
            { id: "quran", label: uiTranslations[lang].mushaf, icon: Book },
            { id: "khatmah", label: uiTranslations[lang].khatmah, icon: Award },
            { id: "athkar", label: uiTranslations[lang].athkar, icon: Heart },
            { id: "compass", label: uiTranslations[lang].prayerQibla, icon: CompassIcon },
            { id: "masbaha", label: uiTranslations[lang].masbaha, icon: RotateCcw },
            { id: "ai_chat", label: uiTranslations[lang].aiScholar, icon: Sparkles }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Dismiss outer Quran choices if returning
                  if (tab.id === "quran" && selectedSurahId !== null) {
                    // keep it
                  }
                }}
                className={`py-2 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all w-max shrink-0 ${
                  isSelected
                    ? "bg-amber-600 text-slate-950 font-bold border-amber-500 shadow-md scale-103"
                    : themeMode === "dark"
                    ? "bg-[#071129] border-white/5 text-gray-300 hover:border-amber-500/20 hover:bg-[#071129]/80"
                    : "bg-white border-amber-500/10 text-gray-700 hover:bg-amber-500/5 hover:border-amber-500/20"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 text-amber-500/70" />
                <span className="font-sans font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MAIN CENTRAL CONTROLLING GRID SHEATH */}
      <main className="px-4 py-6 pb-24 min-h-[calc(100vh-220px)] relative">
        
        {/* ----------------- TAB A: HOME DASHBOARD ----------------- */}
        {activeTab === "home" && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            
            {/* Elegant Welcome Hero Lantern Message */}
            <div className={`relative p-8 rounded-[40px] border flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-xl ${
              themeMode === "dark" 
                ? "bg-gradient-to-br from-[#0B1A35] to-[#071129] border-amber-500/20" 
                : "bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-[#fdfbf7] border-amber-500/20"
            }`}>
              
              <div className="flex-grow text-center md:text-right">
                <div className="inline-flex gap-1 items-center px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/10 text-amber-500 text-xs font-medium font-sans mb-3">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{lang === "ar" ? "رفيق المسلّم والذاكر" : "Islamic Companion Core"}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-white font-sans text-shadow-sm leading-snug">
                  {lang === "ar" ? "أهلاً بك بك في المصحف المضيء" : "Welcome to Al-Mushaf Al-Mudee"}
                </h2>
                
                <p className={`text-xs mt-2 max-w-lg leading-relaxed ${themeMode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {lang === "ar" 
                    ? "نوّر يومك بقراءة القرآن، عاهد نفسك على تحصيل وردك اليومي، وجمّل لسانك بالأذكار والفوائد الإيمانية العطرة."
                    : "Brighten your days with recitation, lock your daily devotion streak, and refine your actions with authenticated Dhikr."}
                </p>
                
                {/* Random day supplication button */}
                <div className="mt-4 inline-flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/15 text-amber-300 text-[11px] leading-snug font-sans italic max-w-md w-full" dir="rtl">
                  <span>✨ <strong>{lang === "ar" ? "ورد دعاء متجدّد:" : "Dua of high spirit:"}</strong> {randomDua}</span>
                </div>
              </div>

              {/* Lantern Glow illustrative silhouette */}
              <div className="w-24 h-24 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 shadow-[inset_0_0_15px_rgba(212,175,55,0.06)]">
                <CompassIcon className="w-12 h-12 text-amber-500/35 animate-spin-slow" />
              </div>
            </div>

            {/* Quick Resume bookmarks box */}
            {lastReadSurah && (
              <div 
                onClick={() => {
                  setSelectedSurahId(lastReadSurah.id);
                  setActiveTab("quran");
                }}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 group shadow ${
                  themeMode === "dark" 
                    ? "bg-[#071129] border-white/5 hover:border-amber-500/20" 
                    : "bg-white border-amber-500/10 hover:border-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-500 group-hover:translate-x-1 transition-transform">→</span>
                  <span className="text-[10px] uppercase font-semibold text-gray-500 font-sans">
                    {lang === "ar" ? "اضغط للمتابعة الفورية" : "Tap to resume instantly"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 mr-1 text-right">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block block-rtl">{uiTranslations[lang].lastRead}</span>
                    <span className="text-sm font-sans font-bold text-white group-hover:text-amber-300">
                      {lang === "ar" ? `سورة ${lastReadSurah.nameAr}` : `Surah ${lastReadSurah.nameEn}`}
                    </span>
                    <span className="text-xs font-mono text-gray-500 block mr-1">
                      {lang === "ar" ? `الآية: ${lastReadSurah.verse}` : `Ayah: ${lastReadSurah.verse}`}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-600/10 border border-amber-500/15 flex items-center justify-center text-amber-400">
                    <Bookmark className="w-4 h-4 fill-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Daily spiritual card triggers (Ayah, Hadith, Wisdom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1: Ayah of the day reflecting with sharecard */}
              {dailyAyah && (
                <div className={`p-5 rounded-3xl border flex flex-col justify-between shadow-lg ${
                  themeMode === "dark" ? "bg-[#071129] border-amber-500/10" : "bg-white border-amber-500/20"
                }`}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 block-rtl">
                      ✨ {uiTranslations[lang].ayahOfTheDay}
                    </h3>
                    
                    <div className="bg-[#050B18] rounded-2xl p-4 text-center my-2 border border-white/5 shadow-inner">
                      <p className="font-sans text-base leading-relaxed text-amber-100 font-medium" dir="rtl">
                        {dailyAyah.text}
                      </p>
                      <p className="text-gray-400 text-xs font-sans italic mt-2.5 leading-relaxed">
                        "{dailyAyah.translation}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-amber-500/5">
                    <button
                      onClick={() => openCardCreator(dailyAyah.text, dailyAyah.translation, `سورة ${dailyAyah.surah} [الآية ${dailyAyah.verse}]`)}
                      className="text-[11px] font-bold text-amber-500 hover:text-amber-400 font-sans flex items-center gap-1 bg-amber-500/5 py-1 px-3 rounded-xl border border-amber-500/10 hover:bg-amber-500/10"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{uiTranslations[lang].shareImage}</span>
                    </button>
                    
                    <span className="text-[10px] text-gray-500 font-mono">
                      {lang === "ar" ? `${dailyAyah.surah}: ${dailyAyah.verse}` : `${dailyAyah.surah}: ${dailyAyah.verse}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Card 2: Hadith of the day reflecting with sharecard */}
              {dailyHadith && (
                <div className={`p-5 rounded-3xl border flex flex-col justify-between shadow-lg ${
                  themeMode === "dark" ? "bg-[#071129] border-amber-500/10" : "bg-white border-amber-500/20"
                }`}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 block-rtl">
                      🌿 {uiTranslations[lang].hadithOfTheDay}
                    </h3>

                    <div className="bg-[#050B18] rounded-2xl p-4 text-center my-2 border border-white/5 shadow-inner">
                      <p className="font-sans text-base leading-relaxed text-white font-medium" dir="rtl">
                        {dailyHadith.hadith}
                      </p>
                      <p className="text-gray-400 text-xs font-sans italic mt-2.5 leading-relaxed">
                        "{dailyHadith.translation}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-amber-500/5">
                    <button
                      onClick={() => openCardCreator(dailyHadith.hadith, dailyHadith.translation, dailyHadith.source)}
                      className="text-[11px] font-bold text-amber-500 hover:text-amber-400 font-sans flex items-center gap-1 bg-amber-500/5 py-1 px-3 rounded-xl border border-amber-500/10 hover:bg-amber-500/10"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{uiTranslations[lang].shareImage}</span>
                    </button>

                    <span className="text-[10px] text-gray-400 font-sans">
                      {dailyHadith.source}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Spiritual Wisdom Reflection block */}
            {dailyBenefit && (
              <div className={`p-5 rounded-3xl border shadow-lg ${
                themeMode === "dark" ? "bg-[#071129] border-amber-500/10" : "bg-white border-amber-500/20"
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 block-rtl">
                  💡 {uiTranslations[lang].benefitOfTheDay}
                </h3>
                
                <h4 className="text-sm font-bold text-white mb-2 text-right font-sans">
                  {lang === "ar" ? dailyBenefit.titleAr : dailyBenefit.titleEn}
                </h4>

                <p className="text-xs text-gray-300 leading-relaxed text-right font-sans" dir="rtl">
                  {lang === "ar" ? dailyBenefit.textAr : dailyBenefit.textEn}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB B: AL-QURAN READER ----------------- */}
        {activeTab === "quran" && (
          <div className="w-full max-w-4xl mx-auto space-y-4">
            
            {/* If no Surah is selected: Render search and Surah grid list */}
            {selectedSurahId === null ? (
              <div className="space-y-4">
                
                {/* Search bar input panel */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  themeMode === "dark" ? "bg-[#0B132B]/85 border-amber-500/10" : "bg-white border-amber-500/10 shadow"
                }`}>
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={uiTranslations[lang].searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none w-full text-center md:text-right font-sans"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Grid List of Surahs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredSurahs.map((surah) => (
                    <div
                      key={surah.number}
                      onClick={() => setSelectedSurahId(surah.number)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center group ${
                        themeMode === "dark"
                          ? "bg-[#0B132B]/85 border-gray-850 hover:border-amber-500/40 hover:bg-[#0B132B] shadow-sm"
                          : "bg-white border-amber-500/10 hover:border-amber-500/30 hover:shadow shadow-sm"
                      }`}
                    >
                      {/* Left: Metadata info English */}
                      <div className="text-left font-sans">
                        <h4 className="text-xs font-bold text-gray-400 group-hover:text-amber-500 transition-colors">
                          {surah.englishName}
                        </h4>
                        <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                          {surah.englishNameTranslation}
                        </span>
                        <span className="text-[9px] text-gray-500 block mt-1 font-mono uppercase tracking-widest">
                          {surah.revelationType === "Meccan" ? uiTranslations[lang].meccan : uiTranslations[lang].medinan} | {surah.numberOfAyahs} ayahs
                        </span>
                      </div>

                      {/* Right: Metadata info Arabic */}
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <h3 className="text-base font-bold text-white font-sans mr-1">
                            {surah.name}
                          </h3>
                          <span className="text-[10px] text-gray-400 block font-mono text-center">
                            الجزء {surah.juzStart}
                          </span>
                        </div>
                        
                        {/* Circle numeric index marker */}
                        <div className="w-8 h-8 rounded-full border border-amber-500/10 bg-[#070C1B] flex items-center justify-center text-xs font-mono font-bold text-amber-400 group-hover:bg-amber-500 group-hover:text-[#0A1128] transition-all shrink-0">
                          {surah.number}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSurahs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 font-sans text-xs">
                      {lang === "ar" ? "لم نجد أي سورة تطابق كلمة البحث." : "No Surah found matching the search query."}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* If Surah is selected: Display Verses reading panel */
              <div className="space-y-4">
                
                {/* Reading Toolbar with parameters */}
                <div className={`p-4 rounded-3xl border ${
                  themeMode === "dark" ? "bg-[#0B132B]/85 border-amber-500/10" : "bg-white border-amber-500/15"
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-amber-500/5">
                    
                    {/* Back button */}
                    <button
                      onClick={() => setSelectedSurahId(null)}
                      className="bg-[#070C1B] hover:bg-[#070C1B]/80 text-gray-400 hover:text-white border border-gray-800 text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{lang === "ar" ? "الفهرس" : "Index"}</span>
                    </button>

                    {/* Surah Selected header summary information */}
                    {activeSurahData && (
                      <div className="text-center">
                        <h2 className="text-lg md:text-xl font-bold text-amber-200 font-sans">
                          {activeSurahData.name} | Surah {activeSurahData.englishName}
                        </h2>
                        <span className="text-[11px] text-gray-400 font-mono inline-block block-rtl">
                          {activeSurahData.numberOfAyahs} آية | {activeSurahData.revelationType === "Meccan" ? uiTranslations[lang].meccan : uiTranslations[lang].medinan}
                        </span>
                      </div>
                    )}

                    <div className="w-1" />
                  </div>

                  {/* Stylizations controls tabs */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Arabic font styles changer */}
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">
                        {uiTranslations[lang].fontFamily}
                      </label>
                      <select
                        value={fontFamilyType}
                        onChange={(e) => setFontFamilyType(e.target.value)}
                        className="w-full bg-[#070C1B] border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="amiri">Cairo Script (Standard)</option>
                        <option value="cairo">Amiri Quranic Serif</option>
                        <option value="me_quran">Simplified Rasm Uthman</option>
                      </select>
                    </div>

                    {/* Font sizes Arabic */}
                    <div>
                      <label className="text-[10px] text-gray-400 flex justify-between mb-1 font-sans">
                        <span>{uiTranslations[lang].fontSizeAr}</span>
                        <span className="font-mono text-amber-400">{arabicFontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="48"
                        step="2"
                        value={arabicFontSize}
                        onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1"
                      />
                    </div>

                    {/* Font size Translates */}
                    <div>
                      <label className="text-[10px] text-gray-400 flex justify-between mb-1 font-sans">
                        <span>{uiTranslations[lang].fontSizeEn}</span>
                        <span className="font-mono text-amber-400">{englishFontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="24"
                        step="1"
                        value={englishFontSize}
                        onChange={(e) => setEnglishFontSize(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1"
                      />
                    </div>

                    {/* Toggle displays */}
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">
                        {lang === "ar" ? "خيارات العرض الإضافية" : "Display Options"}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDisplayTranslation(!displayTranslation)}
                          className={`w-1/2 py-1 px-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                            displayTranslation 
                              ? "bg-amber-500/20 border-amber-500 text-amber-200" 
                              : "bg-[#070C1B] border-gray-800 text-gray-550"
                          }`}
                        >
                          {lang === "ar" ? "الترجمة" : "Translate"}
                        </button>
                        
                        <button
                          onClick={() => setDisplayTafseer(!displayTafseer)}
                          className={`w-1/2 py-1 px-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                            displayTafseer 
                              ? "bg-amber-500/20 border-amber-500 text-amber-200" 
                              : "bg-[#070C1B] border-gray-800 text-gray-550"
                          }`}
                        >
                          {lang === "ar" ? "التفسير" : "Tafseer"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Layout choices selector bar */}
                  <div className="mt-3.5 pt-3.5 border-t border-amber-500/5 flex justify-center gap-3">
                    <button
                      onClick={() => setReadingMode("continuous")}
                      className={`py-1.5 px-4 rounded-xl border text-xs font-semibold font-sans transition-all flex items-center gap-1 ${
                        readingMode === "continuous"
                          ? "bg-amber-600 border-amber-500 text-[#090D1C] font-bold"
                          : "bg-[#070C1B] border-gray-800 text-gray-400"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{uiTranslations[lang].continuousView}</span>
                    </button>

                    <button
                      onClick={() => setReadingMode("verseByVerse")}
                      className={`py-1.5 px-4 rounded-xl border text-xs font-semibold font-sans transition-all flex items-center gap-1 ${
                        readingMode === "verseByVerse"
                          ? "bg-amber-600 border-amber-500 text-[#090D1C] font-bold"
                          : "bg-[#070C1B] border-gray-800 text-gray-400"
                      }`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                      <span>{uiTranslations[lang].verseView}</span>
                    </button>
                  </div>
                </div>

                {/* 5. MAIN AYAS RENDERING CORE BOX */}
                {surahLoading ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10 text-amber-500 animate-spin" />
                    <p className="text-xs text-gray-400 font-sans">{uiTranslations[lang].loadingSurah}</p>
                  </div>
                ) : surahError ? (
                  /* Resilient notice indicator * */
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-right" dir="rtl">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-400 block mb-1">
                        {lang === "ar" ? "تنبيه قاعدة البيانات" : "Reading offline caches"}
                      </span>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        {surahError}
                      </p>
                    </div>
                  </div>
                ) : null}

                {activeSurahData && (
                  <div className={`p-6 rounded-3xl border shadow-xl ${
                    themeMode === "dark" ? "bg-[#0B132B]/75 border-amber-500/10" : "bg-white border-amber-500/10"
                  }`}>
                    
                    {/* Bismillah custom header except for Al-Tawbah (9) */}
                    {selectedSurahId !== 1 && selectedSurahId !== 9 && (
                      <div className="text-center mb-8 border-b border-amber-500/10 pb-4 select-none animate-fade">
                        <span className="text-xl md:text-2xl font-bold text-amber-400 font-serif">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </span>
                      </div>
                    )}

                    {/* RENDER MODE A: Continuous Book Layout */}
                    {readingMode === "continuous" ? (
                      <div 
                        className={`leading-[2.2] text-center select-text selection:bg-amber-500/30 font-sans tracking-wide pr-1`}
                        style={{ fontSize: `${arabicFontSize}px` }}
                        dir="rtl"
                      >
                        {activeSurahData.ayahs.map((ayah, aIdx) => {
                          const isBookmarked = (surahBookmarks[selectedSurahId!] || []).includes(ayah.numberInSurah);
                          const isCurrentlyPlaying = activeVerseAudioIndex === aIdx;

                          return (
                            <span 
                              key={ayah.numberInSurah}
                              className={`transition-colors duration-300 mx-1 cursor-pointer select-none relative ${
                                isCurrentlyPlaying 
                                  ? "bg-amber-500/20 text-yellow-300 px-1 py-0.5 rounded border border-amber-500/20 shadow-sm" 
                                  : isBookmarked 
                                  ? "text-amber-400 underline decoration-amber-500 decoration-wavy"
                                  : "text-amber-100 hover:text-white"
                              }`}
                              onClick={() => togglePlayAudio(aIdx)}
                              title="Click to play verse audio"
                            >
                              {ayah.text}

                              {/* Verse delimiter symbol inside circle */}
                              <span className="inline-flex w-7 h-7 rounded-full border border-amber-500/35 bg-[#070C1B] text-xs font-mono font-bold text-amber-400 items-center justify-center align-middle mx-1.5 translate-y-[-1.5px] select-none">
                                {ayah.numberInSurah}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      /* RENDER MODE B: Verse-by-Verse row blocks */
                      <div className="space-y-6">
                        {activeSurahData.ayahs.map((ayah, aIdx) => {
                          const isBookmarked = (surahBookmarks[selectedSurahId!] || []).includes(ayah.numberInSurah);
                          const isCurrentlyPlaying = activeVerseAudioIndex === aIdx;

                          return (
                            <div
                              key={ayah.numberInSurah}
                              ref={isCurrentlyPlaying ? activeVerseRef : null}
                              className={`p-4 rounded-2xl border transition-all duration-350 select-text ${
                                isCurrentlyPlaying
                                  ? "bg-amber-500/10 border-amber-500/65 shadow-md scale-101"
                                  : "bg-[#070C1B]/40 border-gray-850 hover:bg-[#070C1B]/80 hover:border-amber-500/10"
                              }`}
                            >
                              {/* Row action metadata header */}
                              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-850/50">
                                
                                {/* Micro tools buttons triggers */}
                                <div className="flex gap-2.5">
                                  {/* Play sound circle trigger */}
                                  <button
                                    onClick={() => togglePlayAudio(aIdx)}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      isCurrentlyPlaying
                                        ? "bg-amber-500 border-amber-500 text-[#090D1C]"
                                        : "bg-[#070C1B] border-gray-800 text-gray-400 hover:text-amber-300"
                                    }`}
                                    title="Play Verse sound"
                                  >
                                    {isCurrentlyPlaying && activePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                  </button>

                                  {/* Share block trigger */}
                                  <button
                                    onClick={() => openCardCreator(ayah.text, ayah.translation, `سورة ${activeSurahData.englishName} [الآية ${ayah.numberInSurah}]`)}
                                    className="p-1.5 bg-[#070C1B] hover:bg-amber-500/10 text-gray-400 hover:text-amber-300 border border-gray-800 rounded-lg transition-colors"
                                    title="Share styled verse card image"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* bookmark button */}
                                  <button
                                    onClick={() => handleAddBookmark(selectedSurahId!, ayah.numberInSurah)}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      isBookmarked
                                        ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                        : "bg-[#070C1B] border-gray-800 text-gray-400 hover:text-amber-300"
                                    }`}
                                    title={isBookmarked ? uiTranslations[lang].bookmarkedWord : uiTranslations[lang].bookmarkAyah}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
                                  </button>
                                </div>

                                {/* Verse index marker */}
                                <div className="flex items-center gap-2 font-sans text-right">
                                  <span className="text-[10px] text-gray-500">
                                    {activeSurahData.englishName}:{ayah.numberInSurah}
                                  </span>
                                  <div className="w-7 h-7 rounded-full border border-amber-500/20 bg-[#070C1B] flex items-center justify-center text-xs font-mono font-semibold text-amber-500">
                                    {ayah.numberInSurah}
                                  </div>
                                </div>
                              </div>

                              {/* Arabic Uthmani text body */}
                              <p 
                                className="text-amber-100 font-sans leading-relaxed text-right mb-3 outline-none select-text" 
                                style={{ fontSize: `${arabicFontSize}px` }} 
                                dir="rtl"
                              >
                                {ayah.text}
                              </p>

                              {/* Translation text display */}
                              {displayTranslation && (
                                <p 
                                  className="text-gray-400 font-sans italic tracking-wide text-left mb-2.5 leading-relaxed" 
                                  style={{ fontSize: `${englishFontSize}px` }}
                                >
                                  "{ayah.translation}"
                                </p>
                              )}

                              {/* Al-Muyassar Tafseer block collapsible */}
                              {displayTafseer && (
                                <div className="bg-[#0B132B]/60 p-3 rounded-xl border border-amber-500/5 mt-3 text-right" dir="rtl">
                                  <span className="text-[9.5px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                                    {uiTranslations[lang].tafseerTitle}
                                  </span>
                                  <p className="text-gray-300 text-[11px] leading-relaxed font-sans">
                                    {"شرح ميسر ومبسط لمعنى الآية وسياق نزولها الإيماني بناءً على التفسير الميسر الموثق لدعم تلاوة واعية بالتدبر والتأمل."}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB C: KHATMA PLANS ----------------- */}
        {activeTab === "khatmah" && <Khatmah lang={lang} />}

        {/* ----------------- TAB D: INTERACTIVE ATHKAR ----------------- */}
        {activeTab === "athkar" && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            
            {/* Split layout: Category sidebar vs dynamic item cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Category selector left Sidebar tab */}
              <div className="md:col-span-4 space-y-2 bg-[#0B132B]/85 border border-amber-500/15 p-4 rounded-2xl h-[max-content] shadow">
                <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 border-b border-amber-500/10 pb-2">
                  {lang === "ar" ? "أبواب وفصول الأذكار" : "Dhikr Chapters Library"}
                </h3>
                
                {athkarData.map((cat, cIdx) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      // Navigate directly to that subset or page bookmark
                      const targetEl = document.getElementById(`section-${cat.id}`);
                      targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full text-right p-3 rounded-xl border border-gray-850 hover:border-amber-500/10 hover:bg-[#070C1B]/40 text-gray-200 text-xs transition-all duration-300 flex justify-between items-center direction-rtl"
                  >
                    <span className="text-[9.5px] font-mono text-gray-500 uppercase">
                      items: {cat.items.length}
                    </span>
                    <span className="font-sans font-medium text-[13px] leading-tight">
                      {lang === "ar" ? cat.titleAr : cat.titleEn}
                    </span>
                  </button>
                ))}
              </div>

              {/* Athkar items lists rendering */}
              <div className="md:col-span-8 space-y-8">
                {athkarData.map((cat) => (
                  <div key={cat.id} id={`section-${cat.id}`} className="space-y-4">
                    
                    {/* Chapter Title banner */}
                    <div className="bg-gradient-to-r from-amber-600/10 via-[#0B132B] to-[#060914] border-l-4 border-amber-500 px-4 py-3 rounded-xl flex items-center justify-between">
                      <h4 className="text-base font-bold text-white font-sans text-right block block-rtl">
                        🍃 {lang === "ar" ? cat.titleAr : cat.titleEn}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {cat.items.length} {lang === "ar" ? "أذكار" : "prayers"}
                      </span>
                    </div>

                    {/* Category list items */}
                    <div className="space-y-4">
                      {cat.items.map((thiker) => {
                        // Maintain counter in a localized simulation state
                        return (
                          <ThikerCard 
                            key={thiker.id} 
                            thiker={thiker} 
                            lang={lang} 
                            themeMode={themeMode}
                            onShare={openCardCreator}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB E: PRAYER TIMES & COMPASS ----------------- */}
        {activeTab === "compass" && <Compass lang={lang} />}

        {/* ----------------- TAB F: ELECTRONIC MASBAHA ----------------- */}
        {activeTab === "masbaha" && <Masbaha lang={lang} />}

        {/* ----------------- TAB G: INTELLECTUAL AI THEOLOGIAN ----------------- */}
        {activeTab === "ai_chat" && <AICompanion lang={lang} />}

      </main>

      {/* 5. GIGANTIC GLOBAL VERSE SOUND TRACKING BOTTOM BAR */}
      {activeVerseAudioIndex !== null && activeSurahData && (
        <div className={`fixed bottom-0 inset-x-0 z-40 p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md transition-all ${
          themeMode === "dark" ? "bg-[#080D1C]/95 border-amber-500/15" : "bg-[#fdfbf7]/98 border-amber-500/20"
        }`}>
          
          {/* Active play indicators, next previous triggers */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTrack}
                disabled={activeVerseAudioIndex === 0}
                className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => togglePlayAudio()}
                className="w-10 h-10 rounded-full bg-amber-500 text-[#090D1C] flex items-center justify-center font-bold active:scale-95 transition-all shadow"
              >
                {activePlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-[#090D1C]" />}
              </button>

              <button
                onClick={handleNextTrack}
                disabled={activeVerseAudioIndex === activeSurahData.ayahs.length - 1}
                className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* active metadata details texts */}
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                {lang === "ar" ? "آية قيد التلاوة الآن" : "Now Reciting Active Verse"}
              </span>
              <span className="text-xs font-sans font-bold text-white block">
                {lang === "ar" ? activeSurahData.name : activeSurahData.englishName} | آية {activeSurahData.ayahs[activeVerseAudioIndex].numberInSurah}
              </span>
            </div>
          </div>

          {/* Memorizer settings loops & Reciters selector inputs */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-end text-right">
            
            {/* Reciter audio choices */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-500" />
              <select
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
                className="bg-[#070C1B] border border-gray-800 rounded-xl px-2 py-1 text-xs text-amber-300 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="everyayah.Yasser_Ad-Dussary_128kbps">M. Yasser Al-Dossari (🕌 ياسر الدوسري)</option>
                <option value="ar.alafasy">Mishary Al-Afasy (🕋 مِشاري العَفاسي)</option>
                <option value="everyayah.Abdurrahmaan_As-Sudais_192kbps">Abdurrahman Al-Sudais (🕌 عبدالرحمن السديس)</option>
                <option value="ar.mahermuaiqly">Maher Al-Muaiqly (🕌 ماهر المعيقلي)</option>
                <option value="ar.husary">Sheikh Al_Hussary (🕌 الحُصري)</option>
                <option value="everyayah.Abdul_Basit_Murattal_192kbps">Abdulbasit Abdussamad (🕌 عبدالباسط عبدالصمد)</option>
                <option value="everyayah.Ghamadi_40kbps">Saad Al-Ghamdi (🕌 سَعْد الغامِدي)</option>
                <option value="everyayah.Saood_ash-Shuraym_128kbps">Saud Al-Shuraim (🕌 سعود الشريم)</option>
                <option value="everyayah.Nasser_Alqatami_128kbps">Nasser Al-Qatami (🕌 ناصر القطامي)</option>
                <option value="ar.minshawi">Mohamed Siddiq Al-Minshawi (🕌 محمد صديق المنشاوي)</option>
                <option value="everyayah.Muhammad_Ayyoub_128kbps">Muhammad Ayyub (🕌 محمد أيوب)</option>
              </select>
            </div>

            {/* Repeat count selection */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-400 font-sans text-[11px]">{uiTranslations[lang].verseRepeat}:</span>
              <select
                value={repeatLimit}
                onChange={(e) => setRepeatLimit(parseInt(e.target.value))}
                className="bg-[#070C1B] border border-gray-800 rounded-lg px-2 py-1 text-xs text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="1">1x (Default)</option>
                <option value="2">2x (Double repeat)</option>
                <option value="3">3x (Triple repeat)</option>
                <option value="5">5x (Memorizer drill)</option>
              </select>
            </div>

            {/* Sleep Timer button */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400 font-sans text-[11px]">{uiTranslations[lang].sleepTimer}:</span>
              <select
                value={sleepTimerMinutes}
                onChange={(e) => setSleepTimerMinutes(parseInt(e.target.value))}
                className="bg-[#070C1B] border border-gray-800 rounded-lg px-2 py-1 text-xs text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="0">Off (Continuous)</option>
                <option value="10">10 mins</option>
                <option value="20">20 mins</option>
                <option value="30">30 mins</option>
                <option value="60">60 mins</option>
              </select>
              {sleepTimerRemaining !== null && (
                <span className="font-mono text-[10px] text-emerald-400 animate-pulse">
                  {Math.floor(sleepTimerRemaining / 60)}:{(sleepTimerRemaining % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Close playing audio bar completely */}
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setActivePlaying(false);
                setActiveVerseAudioIndex(null);
              }}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-gray-500 rounded-lg transition-colors border border-transparent hover:border-red-500/10 shrink-0"
              title="Close audio card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. GOLDEN SPIRITUAL QUOTE CARD CUSTOMIZER MODAL OVERLAY */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-[#000]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080D1C] border border-amber-50ver-10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-fade font-sans flex flex-col items-stretch max-h-[92vh] overflow-y-auto">
            
            {/* Modal dismiss bar */}
            <div className="flex justify-between items-center mb-4 border-b border-amber-500/10 pb-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-white p-2 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="text-sm font-bold text-amber-400 text-right">
                {uiTranslations[lang].generateCard}
              </h3>
            </div>

            {/* Theme / backdrop choices panels */}
            <div className="mb-4">
              <label className="text-[10px] text-gray-400 block mb-1.5 text-center">
                {uiTranslations[lang].selectBackdrop}
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "royal_gold", labelAr: "الذهبي الملكي", class: "bg-gradient-to-tr from-[#050914] via-[#0D152D] to-[#121E3E] border-amber-500 shadow-md", fontAr: "text-amber-100" },
                  { id: "emerald_lanterns", labelAr: "قبة الزمرد الفاخر", class: "bg-gradient-to-tr from-[#021A11] via-[#042B1D] to-[#0A4D35] border-emerald-500", fontAr: "text-emerald-100" },
                  { id: "midnight_starry", labelAr: "الكوني العثماني", class: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#020617] border-indigo-500", fontAr: "text-[#E2E8F0]" }
                ].map((bgItem) => (
                  <button
                    key={bgItem.id}
                    onClick={() => {
                      setCardBackdrop(bgItem.id);
                      if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    className={`py-2 px-1 rounded-xl border text-[10px] text-white font-bold tracking-wide transition-all truncate text-center ${
                      cardBackdrop === bgItem.id ? "bg-amber-600 border-amber-500" : "bg-[#070C1B] border-gray-800"
                    }`}
                  >
                    {bgItem.labelAr}
                  </button>
                ))}
              </div>
            </div>

            {/* THE VISUAL CHOSEN CARD (Styled in luxury textures) */}
            <div 
              id="the-spiritual-quote-card" 
              className={`p-6 rounded-2xl border-2 text-center shadow-lg my-4 relative min-h-[220px] flex flex-col justify-between overflow-hidden text-shadow-sm transition-all ${
                cardBackdrop === "emerald_lanterns"
                  ? "bg-gradient-to-tr from-[#021A11] via-[#042B1D] to-[#0A4D35] border-emerald-500 text-white"
                  : cardBackdrop === "midnight_starry"
                  ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#020617] border-indigo-500 text-white animate-pulse-slow"
                  : "bg-gradient-to-tr from-[#050914] via-[#0D152D] to-[#121E3E] border-amber-500 text-white animate-fade"
              }`}
            >
              {/* Islamic geometry ornamental decorative corners mock corners via SVG */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-amber-500/25" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-amber-500/25" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-amber-500/25" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-amber-500/25" />

              {/* Lantern mini visual placeholder inside design */}
              <div className="mx-auto text-amber-500/80 filter drop-shadow">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>

              <div className="my-4">
                <p className="font-sans text-lg md:text-xl font-bold leading-relaxed tracking-wide text-amber-100" dir="rtl">
                  {cardContent.textAr}
                </p>
                
                {cardContent.textEn && (
                  <p className="text-gray-300 text-xs italic mt-3 max-w-sm mx-auto leading-relaxed">
                    "{cardContent.textEn}"
                  </p>
                )}
              </div>

              {/* Card Citation */}
              <div className="text-center">
                <span className="text-[10px] text-amber-500/90 font-mono tracking-widest uppercase block mt-2">
                  {cardContent.source}
                </span>
                <span className="text-[8px] text-gray-500 block font-sans mt-0.5">
                  المصحف المضيء | Al-Mushaf Al-Mudee
                </span>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="space-y-2 mt-2">
              <button
                onClick={handleCopyCardText}
                className="w-full bg-[#070C1B] hover:bg-[#070C1B]/80 hover:border-amber-500/30 border border-gray-800 text-gray-300 text-xs py-2 px-4 rounded-xl transition-all flex justify-center items-center gap-1.5"
              >
                {copiedIndicator ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedIndicator ? uiTranslations[lang].copyAyahSuccess : uiTranslations[lang].copyText}</span>
              </button>

              <button
                onClick={simulateDownloadAction}
                className="w-full bg-amber-600 hover:bg-amber-500 text-[#090D1C] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{uiTranslations[lang].downloadCard}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 7. COMPACT ATHKAR REPETITIONS BOX CARD COMPONENT
interface ThikerCardProps {
  key?: string;
  thiker: any;
  lang: "ar" | "en";
  themeMode: "dark" | "light";
  onShare: (textAr: string, textEn: string, source: string) => void;
}

function ThikerCard({ thiker, lang, themeMode, onShare }: ThikerCardProps) {
  const [localCount, setLocalCount] = useState<number>(0);
  const targetCompleted = localCount >= thiker.countTarget;

  const handleTick = () => {
    if (targetCompleted) return;
    const nextVal = localCount + 1;
    setLocalCount(nextVal);

    // Click sound effect simulation
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // high delight chime if target met
      oscillator.frequency.value = nextVal >= thiker.countTarget ? 783.99 : 523.25; 
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log(e);
    }

    // vibration
    if (navigator.vibrate) {
      if (nextVal >= thiker.countTarget) {
        navigator.vibrate([100, 30, 100]);
      } else {
        navigator.vibrate(20);
      }
    }
  };

  const handleResetCount = (e: any) => {
    e.stopPropagation();
    setLocalCount(0);
  };

  return (
    <div
      onClick={handleTick}
      className={`p-4 rounded-3xl border transition-all duration-300 relative select-none cursor-pointer flex flex-col justify-between ${
        targetCompleted
          ? "bg-emerald-600/10 border-emerald-500/60 shadow-inner"
          : "bg-[#070C1B]/40 border-gray-850 hover:bg-[#070C1B]/70"
      }`}
    >
      {/* Action metadata header */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800/15">
        
        {/* reset counters */}
        <div className="flex gap-2">
          {localCount > 0 && (
            <button
              onClick={handleResetCount}
              className="p-1 px-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-[10px] text-red-400 rounded-lg transition-all"
            >
              Reset
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(thiker.text, thiker.translation, thiker.description);
            }}
            className="p-1 px-2.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 text-[10px] text-amber-400 rounded-lg transition-all"
          >
            Share
          </button>
        </div>

        {/* Thiker counts badge markers */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-sans">
            {lang === "ar" ? `الهدف: ${thiker.countTarget} مرات` : `Target: ${thiker.countTarget}x`}
          </span>
          
          <div className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-all ${
            targetCompleted 
              ? "bg-emerald-500 border-emerald-500 text-[#090D1C] font-extrabold" 
              : "bg-[#070C1B] border-amber-500/25 text-amber-400"
          }`}>
            {targetCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : thiker.countTarget - localCount}
          </div>
        </div>
      </div>

      {/* Main Arabic script */}
      <p 
        className="font-sans text-right leading-relaxed mb-3 pr-1 text-[#FFF]" 
        style={{ fontSize: "20px" }} 
        dir="rtl"
      >
        {thiker.text}
      </p>

      {/* Phonetic transliteration */}
      <p className="text-[11px] text-gray-400 text-left font-sans leading-relaxed tracking-wide font-medium italic select-text">
        {thiker.transliteration}
      </p>

      {/* English meaning */}
      <p className="text-gray-500 text-xs text-left font-sans italic my-2 leading-relaxed select-text">
        "{thiker.translation}"
      </p>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-850/30">
        <span className="text-[9.5px] text-gray-500 italic block">
          {thiker.description}
        </span>
        
        {localCount > 0 && (
          <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-semibold">
            Progress: {localCount}/{thiker.countTarget} Completed
          </span>
        )}
      </div>

    </div>
  );
}
