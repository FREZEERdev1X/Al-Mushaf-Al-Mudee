export interface AyahData {
  numberInSurah: number;
  text: string;
  translation: string;
}

export interface FallbackSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: AyahData[];
}

export const quranFallback: Record<number, FallbackSurah> = {
  1: {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatihah",
    englishNameTranslation: "The Opening",
    revelationType: "Meccan",
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
  108: {
    number: 108,
    name: "الكوثر",
    englishName: "Al-Kawthar",
    englishNameTranslation: "Abundance",
    revelationType: "Meccan",
    ayahs: [
      { numberInSurah: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar." },
      { numberInSurah: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", translation: "So pray to your Lord and sacrifice [to Him alone]." },
      { numberInSurah: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", translation: "Indeed, your enemy is the one cut off." }
    ]
  },
  112: {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    englishNameTranslation: "Sincerity",
    revelationType: "Meccan",
    ayahs: [
      { numberInSurah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, \"He is Allah, [who is] One," },
      { numberInSurah: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
      { numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born," },
      { numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "And there is none co-equal or comparable unto Him.\"" }
    ]
  },
  113: {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishNameTranslation: "The Daybreak",
    revelationType: "Meccan",
    ayahs: [
      { numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Say, \"I seek refuge in the Lord of daybreak" },
      { numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", translation: "From the evil of that which He created" },
      { numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "And from the evil of darkness when it settles" },
      { numberInSurah: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translation: "And from the evil of the blowers in knots" },
      { numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "And from the evil of an envier when he envies.\"" }
    ]
  },
  114: {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    englishNameTranslation: "Mankind",
    revelationType: "Meccan",
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
