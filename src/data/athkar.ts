export interface ThikerItem {
  id: string;
  text: string;
  translation: string;
  transliteration: string;
  countTarget: number;
  description?: string;
  count?: number; // current state user progress
}

export interface AthkarCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  items: ThikerItem[];
}

export const athkarData: AthkarCategory[] = [
  {
    id: "morning",
    titleAr: "أذكار الصباح",
    titleEn: "Morning Remembrance",
    items: [
      {
        id: "m1",
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
        translation: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaykan-nushur.",
        countTarget: 1,
        description: "رواه الترمذي"
      },
      {
        id: "m2",
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "We have entered the morning and the kingdom belongs to Allah. Praise is due to Allah. There is no deity but Allah alone, who has no partner. To Him belongs the dominion, to Him praise is due, and He is Able to do all things.",
        transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
        countTarget: 1,
        description: "رواه مسلم"
      },
      {
        id: "m3",
        text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        translation: "O Ever-Living, O Sustainer, by Your mercy I seek help. Rectify all of my affairs and do not leave me to myself even for the blink of an eye.",
        transliteration: "Ya Hayyu Ya Qayyumu bi-rahmatika astagheeth, aslih lee sha'nee kullahu, wa la takilnee ila nafsee tarfata 'ayn.",
        countTarget: 3,
        description: "صحيح الجامع"
      },
      {
        id: "m4",
        text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        transliteration: "A'udhu bi-kalimatil-lahit-tammati min sharri ma khalaq.",
        countTarget: 3,
        description: "رواه أحمد"
      }
    ]
  },
  {
    id: "evening",
    titleAr: "أذكار المساء",
    titleEn: "Evening Remembrance",
    items: [
      {
        id: "e1",
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
        translation: "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the return.",
        transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu wa ilaykal-masir.",
        countTarget: 1,
        description: "رواه الترمذي"
      },
      {
        id: "e2",
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "We have entered the evening and the kingdom belongs to Allah. Praise is due to Allah. There is no deity but Allah alone, who has no partner.",
        transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
        countTarget: 1,
        description: "رواه مسلم"
      },
      {
        id: "e3",
        text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.",
        translation: "O Allah, I seek refuge with You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
        transliteration: "Allahumma innee a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
        countTarget: 3,
        description: "رواه البخاري"
      }
    ]
  },
  {
    id: "sleep",
    titleAr: "أذكار النوم",
    titleEn: "Remembrance Before Sleep",
    items: [
      {
        id: "s1",
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
        translation: "In Your name, my Lord, I lie down, and by Your name I rise. If You take my soul then have mercy on it, and if You send it back then protect it as You protect Your righteous servants.",
        transliteration: "Bismika Rabbee wada'tu janbee wa bika arfa'uh. Fa-in amsakta nafsee farhamha, wa in arsaltaha fahfadh-ha bima tahfadhu bihi 'ibadakas-salihin.",
        countTarget: 1,
        description: "رواه البخاري ومسلم"
      },
      {
        id: "s2",
        text: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.",
        translation: "O Allah, in Your name I die and I live.",
        transliteration: "Allahumma bismika amutu wa ahya.",
        countTarget: 1,
        description: "رواه البخاري"
      }
    ]
  },
  {
    id: "after_prayer",
    titleAr: "أذكار بعد الصلاة",
    titleEn: "Remembrance After Prayer",
    items: [
      {
        id: "ap1",
        text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
        translation: "I ask Allah for forgiveness (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honor.",
        transliteration: "Astaghfirullah (3x). Allahumma Antas-Salamu wa minkas-salamu, tabarakta ya Dhal-Jalali wal-Ikram.",
        countTarget: 1,
        description: "رواه مسلم"
      },
      {
        id: "ap2",
        text: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (33).",
        translation: "Glory be to Allah (33), Praise be to Allah (33), Allah is the Greatest (33).",
        transliteration: "Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x).",
        countTarget: 99,
        description: "رواه مسلم - تُمام المائة: لا إله إلا الله وحده لا شريك له"
      }
    ]
  },
  {
    id: "travel",
    titleAr: "أذكار السفر",
    titleEn: "Remembrance for Travel",
    items: [
      {
        id: "t1",
        text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ.",
        translation: "Glory be to Him Who has brought this under our control, whereas we were unable to conquer it, and indeed, to our Lord we shall return.",
        transliteration: "Subhanal-ladhee sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon.",
        countTarget: 1,
        description: "سورة الزخرف (13-14)"
      }
    ]
  }
];

export const dailyDuas: string[] = [
  "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
  "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
  "اللهم يا مقلب القلوب ثبت قلبي على دينك.",
  "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.",
  "اللهم بك أستعين وعليك أتوكل، اللهم ذلل لي صعوبة أمري وسهل لي مشقته.",
  "اللهم إني أسألك العفو والعافية في ديني ودنياي وأهلي ومالي."
];

export const dailyHadiths = [
  {
    hadith: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.",
    translation: "The best among you are those who learn the Qur'an and teach it.",
    source: "رواه البخاري"
  },
  {
    hadith: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...",
    translation: "Whoever recites a letter from the Book of Allah will be credited with a good deed, and a good deed gets a ten-fold reward...",
    source: "رواه الترمذي"
  },
  {
    hadith: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.",
    translation: "Actions are but by intentions, and every person shall have what he intended.",
    source: "رواه البخاري ومسلم"
  }
];

export const quranicBenefits = [
  {
    titleAr: "فضل سورة البقرة",
    titleEn: "Virtue of Surah Al-Baqarah",
    textAr: "قال النبي ﷺ: «اقْرَءُوا سُورَةَ الْبَقَرَةِ فَإِنَّ أَخْذَهَا بَرَكَةٌ وَتَرْكَهَا حَسْرَةٌ وَلا تَسْتَطِيعُهَا الْبَطَلَةُ» أي السحرة.",
    textEn: "The Prophet ﷺ said: 'Recite Surah Al-Baqarah, for holding on to it is a blessing, leaving it is a grief, and the magicians cannot overcome it.'"
  },
  {
    titleAr: "تأمل في قول الله تعالى",
    titleEn: "Reflection on Allah's Word",
    textAr: "«وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ» التقوى هي المفتاح السحري لكل ضيق ومخرج الأزمات.",
    textEn: "'And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect.' Piety is the key out of any hardship."
  },
  {
    titleAr: "فضل قراءة سورة الكهف يوم الجمعة",
    titleEn: "Reading Surah Al-Kahf on Fridays",
    textAr: "عن أبي سعيد الخدري أن النبي ﷺ قال: «مَنْ قَرَأَ سُورَةَ الْكَهْفِ يَوْمَ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ».",
    textEn: "Abu Sa'id al-Khudri reported that the Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday, light will shine for him between the two Fridays.'"
  }
];
