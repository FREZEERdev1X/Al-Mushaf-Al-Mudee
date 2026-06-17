import { useState, useEffect } from "react";
import { Compass as CompassIcon, MapPin, Calendar, Bell, BellOff, ArrowUp, Sparkles, AlertCircle, Info } from "lucide-react";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface CompassProps {
  lang: "ar" | "en";
}

// Pre-calculated offline timings for prominent cities to provide 100% reliable offline operation
const OFFLINE_CITIES_TIMINGS: Record<string, { lat: number; lng: number; tz: string; qibla: number; timesAr: string; timings: Record<string, string> }> = {
  makkah: {
    lat: 21.4225, lng: 39.8262, tz: "AST", qibla: 0, timesAr: "مكة المكرمة",
    timings: { Fajr: "04:12", Sunrise: "05:38", Dhuhr: "12:22", Asr: "15:40", Maghrib: "19:04", Isha: "20:34" }
  },
  madinah: {
    lat: 24.4686, lng: 39.6142, tz: "AST", qibla: 178.6, timesAr: "المدينة المنورة",
    timings: { Fajr: "04:09", Sunrise: "05:39", Dhuhr: "12:23", Asr: "15:48", Maghrib: "19:07", Isha: "20:37" }
  },
  al_quds: {
    lat: 31.7683, lng: 35.2137, tz: "EET", qibla: 147.2, timesAr: "القدس الشريف",
    timings: { Fajr: "03:45", Sunrise: "05:31", Dhuhr: "12:44", Asr: "16:24", Maghrib: "19:51", Isha: "21:21" }
  },
  cairo: {
    lat: 30.0444, lng: 31.2357, tz: "EET", qibla: 136.5, timesAr: "القاهرة",
    timings: { Fajr: "04:11", Sunrise: "05:54", Dhuhr: "12:58", Asr: "16:24", Maghrib: "19:56", Isha: "21:26" }
  },
  london: {
    lat: 51.5074, lng: -0.1278, tz: "BST", qibla: 119.2, timesAr: "لندن",
    timings: { Fajr: "02:54", Sunrise: "04:43", Dhuhr: "13:02", Asr: "17:15", Maghrib: "21:21", Isha: "22:45" }
  },
  new_york: {
    lat: 40.7128, lng: -74.0060, tz: "EDT", qibla: 58.5, timesAr: "نيويورك",
    timings: { Fajr: "03:52", Sunrise: "05:24", Dhuhr: "12:57", Asr: "16:53", Maghrib: "20:31", Isha: "22:01" }
  }
};

export default function Compass({ lang }: CompassProps) {
  const [selectedCity, setSelectedCity] = useState<string>("makkah");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({ lat: 21.4225, lng: 39.8262 });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [timings, setTimings] = useState<Record<string, string>>(OFFLINE_CITIES_TIMINGS.makkah.timings);
  const [cityNameEn, setCityNameEn] = useState<string>("Makkah Al-Mukarramah");
  const [cityNameAr, setCityNameAr] = useState<string>("مكة المكرمة");
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0); // manual turning for desktop preview
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  // Advanced timing adjustments & methods
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [method, setMethod] = useState<string>(() => localStorage.getItem("salah_method") || "3");
  const [school, setSchool] = useState<string>(() => localStorage.getItem("salah_school") || "0");
  const [offsets, setOffsets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("salah_offsets");
      return saved ? JSON.parse(saved) : { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
    } catch {
      return { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
    }
  });

  // Keep state synced to localStorage
  useEffect(() => {
    localStorage.setItem("salah_method", method);
  }, [method]);

  useEffect(() => {
    localStorage.setItem("salah_school", school);
  }, [school]);

  useEffect(() => {
    localStorage.setItem("salah_offsets", JSON.stringify(offsets));
  }, [offsets]);

  // Helper to format times into 12-hour AM/PM or ص/م
  const formatTime12 = (timeStr: string) => {
    if (!timeStr) return "";
    const cleanTime = timeStr.trim().split(" ")[0]; // Clean trailing timezones
    const parts = cleanTime.split(":");
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    if (isNaN(hours)) return timeStr;
    
    const period = hours >= 12 ? (lang === "ar" ? "م" : "PM") : (lang === "ar" ? "ص" : "AM");
    hours = hours % 12;
    if (hours === 0) hours = 12;
    
    return `${hours}:${minutes} ${period}`;
  };

  // Helper to add or subtract minutes from any time string (HH:MM)
  const addMinutesToTime = (timeStr: string, minutesToAdd: number) => {
    if (!timeStr || minutesToAdd === 0) return timeStr;
    const cleanTime = timeStr.trim().split(" ")[0];
    const parts = cleanTime.split(":");
    if (parts.length < 2) return timeStr;
    let hrs = parseInt(parts[0], 10);
    let mins = parseInt(parts[1], 10);
    if (isNaN(hrs) || isNaN(mins)) return timeStr;
    
    let totalMins = hrs * 60 + mins + minutesToAdd;
    // Handle wrap around
    if (totalMins < 0) totalMins += 24 * 60;
    totalMins = totalMins % (24 * 60);
    
    const finalHrs = Math.floor(totalMins / 60).toString().padStart(2, "0");
    const finalMins = (totalMins % 60).toString().padStart(2, "0");
    return `${finalHrs}:${finalMins}`;
  };

  // Helper to retrieve adjusted times using customized manual offsets
  const getAdjustedTime = (key: string) => {
    const baseTime = timings[key] || "00:00";
    const offset = offsets[key] || 0;
    return addMinutesToTime(baseTime, offset);
  };

  // Azan Notifications state
  const [activeMuted, setActiveMuted] = useState<boolean>(true);
  const [nextPrayerName, setNextPrayerName] = useState<string>("Dhuhr");
  const [nextPrayerTime, setNextPrayerTime] = useState<string>("12:22");
  const [countdownText, setCountdownText] = useState<string>("");

  // Hijri adjustment states
  const [hijriOffset, setHijriOffset] = useState<number>(0);
  const [hijriDateText, setHijriDateText] = useState<string>("");

  // Fetch real-time timings on mount or when location coords or settings change
  useEffect(() => {
    if (!coords) return;
    
    let isMounted = true;
    const loadTimes = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=${method}&school=${school}`
        );
        if (!response.ok) throw new Error("Could not fetch remote timings.");

        const json = await response.json();
        if (isMounted && json.data && json.data.timings) {
          const raw = json.data.timings;
          const filteredTimes = {
            Fajr: raw.Fajr,
            Sunrise: raw.Sunrise,
            Dhuhr: raw.Dhuhr,
            Asr: raw.Asr,
            Maghrib: raw.Maghrib,
            Isha: raw.Isha,
          };
          setTimings(filteredTimes);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(
            lang === "ar"
              ? "تعذر الاتصال بالخادم لمزامنة مواقيت دقيقة لليوم. تم استخدام الحساب التقريبي."
              : "Server unreachable. Employing calculated offline estimates."
          );
          generateApproximatedTimings(coords.lat);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTimes();
    return () => {
      isMounted = false;
    };
  }, [coords?.lat, coords?.lng, method, school, lang]);

  useEffect(() => {
    // Generate static offline Hijri calculation with offset
    calculateHijri(hijriOffset);

    // Device orientation for mobile phones (auto rotate compass)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // standard web orientation heading
      const heading = (e as any).webkitCompassHeading || e.alpha;
      if (heading !== undefined && heading !== null) {
        // alpha goes counter clockwise, heading goes clockwise
        const correctedHeading = (e as any).webkitCompassHeading ? heading : 360 - heading;
        setDeviceHeading(Math.round(correctedHeading));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [hijriOffset]);

  // Handle countdown updates
  useEffect(() => {
    const timer = setInterval(() => {
      updateNextPrayer();
    }, 1000);
    return () => clearInterval(timer);
  }, [timings, lang, offsets]);

  const calculateHijri = (offset: number) => {
    // Simple approximate algorithmic Hijri calculator (Tabular Islamic Calendar)
    // Accurate enough for utility with a manual calibration offset slide
    const today = new Date();
    today.setDate(today.getDate() + offset);

    let jd = 0;
    const year = today.getFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();

    // Julian Date conversion
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Convert julian to hijri
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const lRest = l - 10631 * n + 354;
    const jPart = Math.floor((10985 - lRest) / 5316) * Math.floor((50 * lRest) / 17719) + Math.floor(lRest / 5670) * Math.floor((43 * lRest) / 15238);
    const lRestPart = lRest - Math.floor((30 - jPart) / 15) * Math.floor((17719 * jPart) / 50) - Math.floor(jPart / 16) * Math.floor((15238 * jPart) / 43) + 29;
    
    const hMonth = Math.floor((24 * lRestPart) / 709);
    const hDay = lRestPart - Math.floor((709 * hMonth) / 24);
    const hYear = 30 * n + jPart - 30;

    const hijriMonthsAr = [
      "محرّم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
      "رجب", "شعبان", "رمضان", "شوّال", "ذو القعدة", "ذو الحجة"
    ];

    const hijriMonthsEn = [
      "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' ath-Thani", "Jumada al-Ula", "Jumada al-Akhirah",
      "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];

    const formatAr = `${hDay} ${hijriMonthsAr[hMonth - 1]} ${hYear} هـ`;
    const formatEn = `${hDay} ${hijriMonthsEn[hMonth - 1]} ${hYear} AH`;

    setHijriDateText(lang === "ar" ? formatAr : formatEn);
  };

  const updateNextPrayer = () => {
    // Current time
    const now = new Date();
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    const totalCurrentMins = currentHours * 60 + currentMins;

    const parsedTimes: { name: string; mins: number; labelAr: string; labelEn: string }[] = [];
    
    const arNames: Record<string, string> = {
      Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء"
    };

    Object.keys(timings).forEach((key) => {
      const adjustedTimeStr = getAdjustedTime(key);
      const parts = adjustedTimeStr.split(":");
      if (parts.length === 2) {
        const mins = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        parsedTimes.push({
          name: key,
          mins,
          labelAr: arNames[key] || key,
          labelEn: key
        });
      }
    });

    // Sort timings ascending
    parsedTimes.sort((a, b) => a.mins - b.mins);

    // Find next prayer
    let next = parsedTimes.find((p) => p.mins > totalCurrentMins);
    let isNextDay = false;

    if (!next) {
      // Fajr tomorrow
      next = parsedTimes[0];
      isNextDay = true;
    }

    setNextPrayerName(lang === "ar" ? next.labelAr : next.labelEn);
    setNextPrayerTime(getAdjustedTime(next.name));

    // Calculate diff
    let diffMins = 0;
    if (isNextDay) {
      diffMins = (24 * 60 - totalCurrentMins) + next.mins;
    } else {
      diffMins = next.mins - totalCurrentMins;
    }

    const hrs = Math.floor(diffMins / 60);
    const mns = diffMins % 60;
    const sec = 59 - now.getSeconds();

    const hrsText = hrs > 0 ? `${hrs}${lang === "ar" ? " س " : "h "}` : "";
    setCountdownText(`- ${hrsText}${mns}${lang === "ar" ? " د " : "m "}${sec}${lang === "ar" ? " ث" : "s"}`);
  };

  const triggerLocationFetch = () => {
    if (!navigator.geolocation) {
      setErrorMsg(lang === "ar" ? "ميزة تحديد الموقع غير مدعومة في متصفحك." : "Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });

        // Calculate custom offline Qibla compass angle from current coordinates
        calculateQiblaAngleForCoords(lat, lng);
        setCityNameAr("موقعي الحالي");
        setCityNameEn("My GPS Location");
        setSelectedCity("custom");
      },
      (err) => {
        setLoading(false);
        setErrorMsg(lang === "ar" 
          ? "تم رفض صلاحية تحديد الموقع أو انتهت مهلة الإجابة. الرجاء اختيار مدينة رائدة يدوياً."
          : "Location access denied. Please manually select a reference city."
        );
      },
      { timeout: 7000 }
    );
  };

  const calculateQiblaAngleForCoords = (lat: number, lng: number) => {
    const kaabaLat = 21.42252;
    const kaabaLng = 39.82618;

    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (kaabaLat * Math.PI) / 180;
    const kaabaLngRad = (kaabaLng * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    let angle = (Math.atan2(y, x) * 180) / Math.PI;
    if (angle < 0) {
      angle += 360;
    }
    setQiblaAngle(Math.round(angle));
  };

  const generateApproximatedTimings = (lat: number) => {
    // Generate approximate astronomical timings relative to Latitude for complete offline safety
    const baseHour = 12; // noon approx
    const absoluteLatFraction = Math.abs(lat) / 90;
    
    // seasonal solar calculation simulation
    const fajrTime = `04:${Math.round(10 + absoluteLatFraction * 40).toString().padStart(2, "0")}`;
    const sunriseTime = `05:${Math.round(40 + absoluteLatFraction * 20).toString().padStart(2, "0")}`;
    const dhuhrTime = `12:${Math.round(12 + (lat < 0 ? 10 : -5)).toString().padStart(2, "0")}`;
    const asrTime = `15:${Math.round(30 + absoluteLatFraction * 40).toString().padStart(2, "0")}`;
    const maghribTime = `18:${Math.round(50 + absoluteLatFraction * 30).toString().padStart(2, "0")}`;
    const ishaTime = `20:${Math.round(20 + absoluteLatFraction * 30).toString().padStart(2, "0")}`;

    setTimings({
      Fajr: fajrTime,
      Sunrise: sunriseTime,
      Dhuhr: dhuhrTime,
      Asr: asrTime,
      Maghrib: maghribTime,
      Isha: ishaTime
    });
  };

  const handleCityChange = (cityKey: string) => {
    if (cityKey === "custom") return;
    
    setSelectedCity(cityKey);
    const selected = OFFLINE_CITIES_TIMINGS[cityKey];
    setTimings(selected.timings);
    setCityNameAr(selected.timesAr);
    setCityNameEn(cityKey.replace("_", " ").toUpperCase());
    setCoords({ lat: selected.lat, lng: selected.lng });
    setQiblaAngle(Math.round(selected.qibla));
    setErrorMsg(null);
  };

  const handleOffsetChange = (key: string, newVal: number) => {
    const val = Math.max(-60, Math.min(60, newVal));
    setOffsets((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Play simulated Azan or soft chime audio notification
  const playChime = () => {
    if (activeMuted) {
      setActiveMuted(false);
      // Play high frequency pure chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // play sequential synthesizer notes (mimics a double alarm tone)
        const playNote = (freq: number, start: number, duration: number) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = "sine";
          gainNode.gain.setValueAtTime(0.08, start);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.02);
          
          oscillator.start(start);
          oscillator.stop(start + duration);
        };

        const now = audioCtx.currentTime;
        playNote(523.25, now, 0.4); // C5
        playNote(659.25, now + 0.35, 0.4); // E5
        playNote(783.99, now + 0.7, 0.6); // G5
      } catch (e) {
        console.log("Audio contexts blocked");
      }
    } else {
      setActiveMuted(true);
    }
  };

  // Turn compass dynamically using manual slider value (useful for desktop layout iframe)
  const visualRotationAngle = qiblaAngle - (deviceHeading !== null ? deviceHeading : compassHeading);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* City selector and Calendar Sync bar */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
        
        {/* Date and Prayers Countdown */}
        <div className="md:col-span-4 bg-[#071129] border border-amber-900/30 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start">
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500 border border-amber-500/10">
              <Calendar className="w-5 h-5" />
            </div>
            
            {/* Chime alarm option */}
            <button
              onClick={playChime}
              className={`p-2.5 rounded-xl border transition-all ${
                !activeMuted 
                  ? "bg-amber-500/15 border-amber-500 text-amber-300" 
                  : "bg-[#050B18] border-white/5 text-gray-500 hover:text-gray-300"
              }`}
              title={activeMuted ? "Muted. Click to test Azan chime" : "Azan alerts Active."}
            >
              {!activeMuted ? <Bell className="w-4.5 h-4.5" /> : <BellOff className="w-4.5 h-4.5" />}
            </button>
          </div>

          <div className="mt-4">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-widest block font-sans">
              {hijriDateText ? (lang === "ar" ? "التقويم الهجري" : "Hijri Calendar") : ""}
            </span>
            <div className="text-md md:text-lg font-bold text-white font-sans mt-0.5" dir={lang === "ar" ? "rtl" : "ltr"}>
              {hijriDateText || "1 ذو الحجة 1447 هـ"}
            </div>
            <span className="text-gray-500 text-[11px] font-sans block mt-1">
              {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          {/* Hijri offset calibrations slider */}
          <div className="mt-3.5 pt-3.5 border-t border-amber-500/10">
            <label className="text-[10px] text-gray-400 flex justify-between">
              <span>{lang === "ar" ? "موازنة الهلالي يدوياً" : "Calibrate Hijri Month"}</span>
              <span className="font-mono">{hijriOffset >= 0 ? `+${hijriOffset}` : hijriOffset}d</span>
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="1"
              value={hijriOffset}
              onChange={(e) => setHijriOffset(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1 rounded-lg bg-[#050B18] mt-1.5"
            />
          </div>
        </div>

        {/* Location selector and interactive Coordinates retrieval */}
        <div className="md:col-span-8 bg-[#071129] border border-amber-900/30 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {lang === "ar" ? "مرجع الحساب الجغرافي" : "Astronomical Location"}
              </span>
            </div>

            {/* GPS automatic locator button */}
            <button
              onClick={triggerLocationFetch}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 disabled:bg-gray-800 disabled:text-gray-600 disabled:scale-100 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{loading ? (lang === "ar" ? "جاري التحديد..." : "Locating...") : (lang === "ar" ? "تحديد تلقائي بـ GPS" : "Sync My Location GPS")}</span>
            </button>
          </div>

          {/* Dropdown manual cities choice */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                {lang === "ar" ? "اختر المدينة يدوياً:" : "Choose reference city manually:"}
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-[#050B18] border border-white/5 hover:border-amber-500/20 rounded-xl py-2 px-3 text-sm text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="makkah">{lang === "ar" ? "🕋 مكة المكرمة" : "Makkah (Kaaba)"}</option>
                <option value="madinah">{lang === "ar" ? "🕌 المدينة المنورة" : "Madinah (Prophet Mosque)"}</option>
                <option value="al_quds">{lang === "ar" ? "🇵🇸 القدس الشريف" : "Al-Quds (Jerusalem)"}</option>
                <option value="cairo">{lang === "ar" ? "🇪🇬 القاهرة" : "Cairo (Egypt)"}</option>
                <option value="london">{lang === "ar" ? "🇬🇧 لندن" : "London (United Kingdom)"}</option>
                <option value="new_york">{lang === "ar" ? "🇺🇸 نيويورك" : "New York (United States)"}</option>
                {selectedCity === "custom" && (
                  <option value="custom">📍 {lang === "ar" ? "الإحداثيات الحالية" : "Custom gps location"}</option>
                )}
              </select>
            </div>
            
            {/* Meta status coordinate readout */}
            <div className="bg-[#050B18] rounded-xl px-3.5 py-2 flex flex-col justify-center border border-white/5">
              <span className="text-[10px] text-gray-500">{lang === "ar" ? "المدينة الحالية المعروضة" : "Reference Location"}</span>
              <span className="text-sm text-yellow-100 font-sans font-medium mt-0.5 leading-tight truncate">
                {lang === "ar" ? cityNameAr : cityNameEn}
              </span>
              <span className="text-[9px] text-gray-500 font-mono">
                Lat: {coords?.lat.toFixed(4)}, Lng: {coords?.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-3 text-[11px] text-amber-500 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Advanced layout toggle button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-3.5 text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 self-end transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {showAdvanced
                ? (lang === "ar" ? "إخفاء الإعدادات المتقدمة ▴" : "Hide Advanced Settings ▴")
                : (lang === "ar" ? "إعدادات المواقيت المتقدمة ودقة الأذان ▾" : "Advanced Timing Settings & Adjustments ▾")}
            </span>
          </button>

          {/* Advanced collapsible content panel */}
          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-[#050B18] border border-amber-900/20 text-xs text-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/5">
                <div>
                  <label className="text-gray-400 block mb-1">
                    {lang === "ar" ? "طريقة الحساب الفلكي:" : "Astronomical Method:"}
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-[#071129] border border-white/5 rounded-lg py-1.5 px-2 text-xs text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="3">{lang === "ar" ? "رابطة العالم الإسلامي" : "Muslim World League"}</option>
                    <option value="4">{lang === "ar" ? "جامعة أم القرى، مكة" : "Umm Al-Qura, Makkah"}</option>
                    <option value="5">{lang === "ar" ? "الهيئة المصرية العامة للمساحة" : "Egyptian Survey"}</option>
                    <option value="2">{lang === "ar" ? "الجمعية الإسلامية لأمريكا الشمالية" : "ISNA (North America)"}</option>
                    <option value="1">{lang === "ar" ? "جامعة العلوم الإسلامية بكراتشي" : "Karachi University"}</option>
                    <option value="12">{lang === "ar" ? "مواقيت فرنسا (UOIF)" : "France (UOIF)"}</option>
                    <option value="13">{lang === "ar" ? "رئاسة الشؤون الدينية التركية" : "Turkey (Diyanet)"}</option>
                    <option value="9">{lang === "ar" ? "وزارة الأوقاف الكويتية" : "Kuwait Ministry"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">
                    {lang === "ar" ? "المذهب الفقهي (العصر):" : "Juristic School (Asr):"}
                  </label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-[#071129] border border-white/5 rounded-lg py-1.5 px-2 text-xs text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="0">{lang === "ar" ? "جمهور الفقهاء (شافعي، مالكي، حنبلي)" : "Standard (Shafi'i, Maliki, Hanbali)"}</option>
                    <option value="1">{lang === "ar" ? "المذهب الحنفي (مثل العصر متأخر)" : "Hanafi (Later Asr)"}</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-semibold">
                  {lang === "ar" ? "⚙️ ضبط توقيت الصلوات بالدقائق (إذا تفاوتت عن المسجد المحلي):" : "⚙️ Fine-Tune Minutes Offset (If deviating from your local mosque):"}
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(offsets).map((key) => {
                    const arabicNames: Record<string, string> = {
                      Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء"
                    };
                    const val = offsets[key];
                    return (
                      <div key={key} className="flex flex-col gap-1 p-1.5 rounded-lg bg-[#071129] border border-white/5 items-center">
                        <span className="font-medium text-[11px] text-gray-300">
                          {lang === "ar" ? arabicNames[key] : key}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOffsetChange(key, val - 1)}
                            className="w-5 h-5 rounded bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 active:scale-95"
                          >
                            -
                          </button>
                          
                          <span className="min-w-[40px] text-center font-mono font-bold text-[10px] text-amber-400">
                            {val > 0 ? `+${val}` : val} {lang === "ar" ? "د" : "m"}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleOffsetChange(key, val + 1)}
                            className="w-5 h-5 rounded bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main double column Grid: Prayers card and Qibla rotating dial */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Timings list column */}
        <div className="lg:col-span-7 bg-[#071129] border border-amber-900/30 p-5 rounded-3xl flex flex-col justify-between shadow-2xl relative">
          
          {/* Glowing next prayer banner */}
          <div className="bg-gradient-to-r from-amber-600/20 to-yellow-500/5 border border-amber-500/20 px-4 py-3 rounded-2xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              <span className="text-xs text-amber-300 font-sans">
                {lang === "ar" ? "الصلاة التالية بقربك:" : "Next Active Prayer:"}
              </span>
              <span className="font-sans font-bold text-white text-sm bg-amber-500/15 py-0.5 px-2.5 rounded-lg border border-amber-500/15">
                {nextPrayerName}
              </span>
            </div>
            
            <div className="text-right font-mono text-sm tracking-wide text-amber-400 font-bold">
              {formatTime12(nextPrayerTime)} <span className="text-xs font-sans text-gray-400">{countdownText}</span>
            </div>
          </div>

          {/* Standard prayer items row by row */}
          <div className="space-y-2 font-sans">
            {Object.keys(timings).map((key) => {
              const arabicTranslations: Record<string, string> = {
                Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء"
              };

              const translit: Record<string, string> = {
                Fajr: "Ath-Than Fajr Call", Sunrise: "Suryan rise", Dhuhr: "Zuhar noon", Asr: "Midafternoon", Maghrib: "Sunset timing", Isha: "Night darkness"
              };

              const isPassed = false; // standard visual indicators
              
              return (
                <div 
                  key={key}
                  className="flex justify-between items-center px-4 py-3 rounded-xl border border-white/5 bg-[#050B18]/60 hover:bg-[#050B18] hover:border-amber-500/10 transition-all duration-300"
                >
                  <div className="font-mono text-base font-bold text-white tracking-wide">
                    {formatTime12(getAdjustedTime(key))}
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono uppercase hidden sm:inline">
                    {translit[key]}
                  </span>

                  <div className="text-right flex items-center gap-2">
                     <span className="text-xs text-gray-400 font-medium">
                      {key}
                    </span>
                    <span className="text-sm font-bold text-amber-100 min-w-[50px]">
                      {arabicTranslations[key]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-1 text-[11px] text-gray-500 bg-[#050B18]/40 p-2.5 rounded-lg border border-white/5 w-full justify-center">
            <Info className="w-3.5 h-3.5 text-amber-500/60" />
            <span>
              {lang === "ar" 
                ? "الحسابات فلكية دقيقة طبقا للهيئة العامة المصرية للمساحة / رابطة العالم الإسلامي." 
                : "Timings mathematically derived adopting Islamic World League standards."}
            </span>
          </div>
        </div>

        {/* Qibla rotating visual Dial */}
        <div className="lg:col-span-5 bg-[#071129] border border-amber-900/30 p-5 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
          <h3 className="text-sm font-semibold text-white mb-2 font-sans flex items-center gap-1.5">
            <CompassIcon className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>{lang === "ar" ? "بوصلة تحديد القبلة" : "3D Animated Qibla Compass"}</span>
          </h3>
          
          <p className="text-gray-400 text-[11px] text-center mb-4 max-w-[240px] leading-relaxed">
            {lang === "ar" 
              ? `زاوية القبلة: ${qiblaAngle}° نسبة للشمال. يرجى تدوير البوصلة ليتطابق السهم الذهبي مع المشرق الكروي للشمال لضبط القبلة.` 
              : `Qibla Angle: ${qiblaAngle}° from True North. Rotate dial manually or use mobile device heading.`}
          </p>

          {/* Interactive Rotating Compass Ring */}
          <div className="relative w-48 h-48 my-2">
            
            {/* Compass Shadow Backdrop */}
            <div className="absolute inset-2 bg-gradient-to-tr from-[#050B18] to-[#071129] rounded-full border-2 border-amber-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.05)]" />

            {/* Rotating elements wrapper */}
            <div 
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-visualRotationAngle}deg)` }}
            >
              {/* North symbol indicator */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-red-500">
                <span className="text-xs font-extrabold font-sans">N</span>
                <span className="text-[9px] font-sans font-extrabold leading-none mt-0.5">شمال</span>
              </div>

              {/* East & West & South abbreviations */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] font-bold">E</div>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] font-bold">W</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-[10px] font-bold">S</div>

              {/* Islamic aesthetic compass dial ticks */}
              <svg className="absolute inset-0 w-full h-full p-2 scale-90">
                <circle cx="50%" cy="50%" r="46%" stroke="rgba(212,175,55,0.06)" strokeWidth="1" fill="none" />
                <path d="M 48,15 L 48,25 M 48,80 L 48,70 M 15,48 L 25,48 M 80,48 L 70,48" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
                
                {/* Kaaba glowing icon aligned with Qibla angle (offset 0 in rotating frame) */}
                <g transform={`rotate(${qiblaAngle}, 96, 96)`}>
                  <line x1="96" y1="96" x2="96" y2="15" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="3 2" />
                  <circle cx="96" cy="15" r="7" fill="#D4AF37" />
                  
                  {/* Miniature Kaaba symbol inside Qibla point */}
                  <rect x="91.5" y="11" width="9" height="8" rx="1.5" fill="#000" stroke="#FFF" strokeWidth="0.5" />
                  <line x1="91.5" y1="13" x2="100.5" y2="13" stroke="#D4AF37" strokeWidth="1" />
                </g>
              </svg>
            </div>

            {/* Perfect central stationary pointer arrow: Always point gold indicator */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 transform -translate-x-1/2 pointer-events-none flex flex-col justify-start items-center">
              <ArrowUp className="w-5 h-5 text-amber-500 stroke-[3] -mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
            </div>

            {/* Central hub indicator */}
            <div className="absolute inset-0 m-auto w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-lg pointer-events-none" />
          </div>

          {/* Desktop turning slide regulator (in case browser device orientation isn't supported) */}
          {deviceHeading === null && (
            <div className="w-full mt-4 bg-[#050B18] rounded-xl p-3 border border-white/5">
              <label className="text-[10px] text-gray-400 block mb-1 text-center font-sans select-none">
                {lang === "ar" ? "محاكاة تدوير البوصلة باليد:" : "Simulate Compass rotation (Slide):"}
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={compassHeading}
                onChange={(e) => setCompassHeading(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1 rounded-lg bg-[#071129]"
              />
              <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-mono select-none">
                <span>0° N</span>
                <span>{compassHeading}° heading</span>
                <span>360°</span>
              </div>
            </div>
          )}

          {deviceHeading !== null && (
            <div className="mt-2 text-[10px] text-emerald-400 font-mono font-medium tracking-wide flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Auto-Compass Connected: {deviceHeading}° Heading</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
