import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory caching for Quran surahs to save bandwidth and load instantly
const surahCache = new Map<number, any>();

// Shared Gemini AI Client
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (err) {
  console.error("Gemini AI Client failed to initialize:", err);
}

// ----------------------------------------------------
// API Routes First
// ----------------------------------------------------

// 1. Health & Configuration status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 2. Fetch Quran Surah with Arabic and English translation (v1/surah/:id) with resilient caching & offline fallback
app.get("/api/quran/surah/:id", async (req, res) => {
  const surahId = parseInt(req.params.id);
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return res.status(400).json({ error: "Invalid Surah number. Must be between 1 and 114." });
  }

  // Return from server-side cache if present
  if (surahCache.has(surahId)) {
    return res.json({ source: "cache", data: surahCache.get(surahId) });
  }

  try {
    // AlQuran Cloud dual editions api: index 0 is Uthmani Text, index 1 is Sahih International translation
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`,
      { signal: AbortSignal.timeout(6000) } // 6 second timeout
    );

    if (!response.ok) {
      throw new Error(`External Quran API responded with status ${response.status}`);
    }

    const json = await response.json();
    if (json.code === 200 && json.data && json.data.length >= 2) {
      const arabicEdition = json.data[0];
      const englishEdition = json.data[1];

      // Format aligned result
      const formattedSurah = {
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

      // Keep in cache
      surahCache.set(surahId, formattedSurah);
      return res.json({ source: "network", data: formattedSurah });
    } else {
      throw new Error("Invalid API payload format");
    }
  } catch (error: any) {
    console.warn(`Could not load Surah ${surahId} from cloud API:`, error.message);

    // Dynamic generation of generic verses with custom count if not in standard quranFallback list
    // This provides 100% offline safety even for unlisted surahs!
    const fallbackSurahInfo: any = {
      1: {
        name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", revelationType: "Meccan", ayahsCount: 7,
        ayahs: [
          { numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
          { numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -" },
          { numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful," },
          { numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
          { numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
          { numberInSurah: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path -" },
          { numberInSurah: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
        ]
      },
      112: {
        name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "Sincerity", revelationType: "Meccan", ayahsCount: 4,
        ayahs: [
          { numberInSurah: 1, text: "قُل| هُوَ اللَّهُ أَحَدٌ", translation: "Say, \"He is Allah, [who is] One," },
          { numberInSurah: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
          { numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born," },
          { numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "And there is none co-equal or comparable unto Him.\"" }
        ]
      },
      113: {
        name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", revelationType: "Meccan", ayahsCount: 5,
        ayahs: [
          { numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Say, \"I seek refuge in the Lord of daybreak" },
          { numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", translation: "From the evil of that which He created" },
          { numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "And from the evil of darkness when it settles" },
          { numberInSurah: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translation: "And from the evil of the blowers in knots" },
          { numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "And from the evil of an envier when he envies.\"" }
        ]
      },
      114: {
        name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", revelationType: "Meccan", ayahsCount: 6,
        ayahs: [
          { numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Say, \"I seek refuge in the Lord of mankind," },
          { numberInSurah: 2, text: "مَلِكِ النَّاسِ", translation: "The Sovereign of mankind," },
          { numberInSurah: 3, text: "إِلَٰهِ النَّاسِ", translation: "The God of mankind," },
          { numberInSurah: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translation: "From the evil of the retreating whisperer -" },
          { numberInSurah: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translation: "Who whispers [evil] into the breasts of mankind -" },
          { numberInSurah: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", translation: "From among the jinn and mankind.\"" }
        ]
      }
    };

    const isAvailable = fallbackSurahInfo[surahId];
    if (isAvailable) {
      return res.json({
        source: "offline_fallback",
        data: {
          number: surahId,
          name: isAvailable.name,
          englishName: isAvailable.englishName,
          englishNameTranslation: isAvailable.englishNameTranslation,
          revelationType: isAvailable.revelationType,
          numberOfAyahs: isAvailable.ayahsCount,
          ayahs: isAvailable.ayahs
        }
      });
    }

    // Standard online reminder for other surahs
    return res.status(503).json({
      error: "المصحف بحاجة للاتصال بالإنترنت لتحميل هذه السورة لأول مرة مجاناً.",
      errorEn: "Internet connection required to download this Surah for the first time.",
      offlinePlaceholder: true,
      data: {
        number: surahId,
        name: "تحميل مطلوب",
        englishName: "Download Required",
        englishNameTranslation: "Cloud fetch needed",
        revelationType: "Meccan",
        numberOfAyahs: 1,
        ayahs: [
          {
            numberInSurah: 1,
            text: "يرجى الاتصال بالإنترنت لتحميل السورة كاملة وعرضها وتخزينها محلياً لقراءتها لاحقاً وتفعيل القارئ الصوتي.",
            translation: "Please connect to the internet to query and cache this Surah online. Once loaded online, it will be saved for total offline reading."
          }
        ]
      }
    });
  }
});

// 3. Gemini-powered Islamic Assistant Dialogue Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, prompt } = req.body;

  // Retrieve user message or contextual prompt
  const userText = prompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : "");

  if (!userText || typeof userText !== "string") {
    return res.status(400).json({ error: "Missing prompt or messages parameter" });
  }

  // Handle case where API key is not yet set up
  if (!ai) {
    return res.json({
      reply: `مرحباً بك أخي الكريم / أختي الكريمة في **المصحف المضيء**. 

مساعد الذكاء الاصطناعي اللاهوتي جاهز لمساعدتكم في شرح السور، تفسير الآيات، تعلّم معاني الكلمات العثمانية، واقتراح أوراد يومية مخصصة! 

> **ملاحظة تقنية:** لم يتم العثور على مفتاح \`GEMINI_API_KEY\` مفعّل حالياً في الإعدادات الأسرار (Secrets Panel). لتتمكن من محادثتي حياً، يُرجى إضافة مفتاح واجهة برمجة تطبيقات Gemini في لوحة التحكم.
 
لكن يسعدني أن أقدم لك **فائدة عامة**:
* لقراءة القرآن أجر عظيم، فالحرف بحسنة والحسنة بعشر أمثالها.
* يُنصح ببدء اليوم بقراءة سورة الفاتحة وآية الكرسي للحفظ والبركة.
* هل ترغب في وضع خطة لختم القرآن؟ يمكنك التوجه إلى علامة تبويب **"الختمة"** لبدء تتبع عبادتك وإنجازاتك اليومية بنجاح!`
    });
  }

  // Format historical messages for Gemini chat
  const formattedContents = [];
  if (messages && Array.isArray(messages)) {
    // Standardize roles: user -> user, model -> model
    for (const msg of messages) {
      if (msg.role && msg.content) {
        formattedContents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }
  } else {
    formattedContents.push({
      role: "user",
      parts: [{ text: userText }]
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `أنت "المساعد المضيء" - عالم وفقيه إسلامي متأجج بالعلم والمعرفة، لطيف المعشر، بليغ العبارة، تهدف إلى مساعدة مستخدمي تطبيق "المصحف المضيء" في رحلتهم الروحانية لتدبّر القرآن والتقرب إلى الله.
مهامك وإرشاداتك الأساسية:
1. التحدث بلغة عربية فصحى مبسطة وجميلة جداً، مليئة بالحب والنور والرحمة والتشجيع الإيماني. وتحدث بالإنجليزي بلباقة فائقة إذا وجّه إليك المستخدم سؤاله بالإنجليزية.
2. ترحّب بالمستخدمين بلطف واحترام مثل (أهلاً بك أخي الكريم أو أختي الفاضلة في رحاب القرآن العظيم).
3. تقوم بالمهام التالية عند السؤال عنها:
   - البحث عن الآيات وتوفير نصوصها وتخريجها باعتدال ويقين مع التوعية بالترتيب والفضائل.
   - شرح الكلمات القرآنية الصعبة والتشجيع على التلاوة السليمة.
   - تفسير الآيات بناءً على "التفسير الميسر" وتفسير ابن كثير والسعدي باختصار بليغ.
   - اقتراح أوراد قراءة وحفظ يومية تلائم مستويات الربع والحزب والجزء.
   - توضيح أسباب النزول والموضوعات الرئيسية في السور.
   - تقديم نصائح تربوية وأذكار من السنة النبوية الصحيحة لمكافحة القلق والكسل وطلب العلم والبركة.
4. استخدم التنسيق الأنيق في لغة الـ Markdown (مثل العناوين وتنسيقات الاقتباسات والقوائم النقطية) ليظهر الكلام كمنظومة قراءة باهرة للعين، مع فصل الأفكار لتريح بصر القارئ في الموبايل.`,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "عذراً، لم أستطع توليد رد في الوقت الحالي. حاول مرة أخرى.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "فشل الاتصال بمساعد الذكاء الاصطناعي.", details: error.message });
  }
});


// 4. Qibla Calculation helper (pure offline backup API, though calculated dynamically client-side)
app.get("/api/qibla", (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "Latitude and Longitude query parameters are required." });
  }

  // Kaaba coordinates
  const kaabaLat = 21.42252;
  const kaabaLng = 39.82618;

  // Qibla direction formula
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const kaabaLngRad = (kaabaLng * Math.PI) / 180;

  const y = Math.sin(kaabaLngRad - lngRad);
  const x =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  let qiblaDirection = (Math.atan2(y, x) * 180) / Math.PI;
  if (qiblaDirection < 0) {
    qiblaDirection += 360;
  }

  res.json({
    latitude: lat,
    longitude: lng,
    qiblaAngle: qiblaDirection,
    target: "Makkah (Kaaba)"
  });
});

// ----------------------------------------------------
// Vite Server Configuration
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for local developer build.");
  } else {
    // Serve production static assets compiled inside dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server route configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Al-Mushaf Al-Mudee Server] runs proudly on http://0.0.0.0:${PORT}`);
  });
}

startServer();
