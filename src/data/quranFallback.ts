export interface AyahData {
  numberInSurah: number;
  text: string;
  translation: string;
  tafseer?: string;
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
      {
        numberInSurah: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        tafseer: "أبتدئ قراءة القرآن مستعيناً بالله تعالى باسمه، (الله) المعبود بحق المربّي لخلقه، (الرحمن) ذي الرحمة العامة الذي وسعت رحمته كل شيء، (الرحيم) بالمؤمنين."
      },
      {
        numberInSurah: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        tafseer: "الثناء والمدح الجميل لله خالق العوالم وربّها، القائم بأمورهم، والمربي لجميع خلقه بشتى نعمه الظاهرة والباطنة."
      },
      {
        numberInSurah: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful,",
        tafseer: "(الرحمن) ذو الرحمة العامة الشاملة لجميع المخلوقات، (الرحيم) ذو الرحمة الخاصة بعباده المؤمنين في الدنيا والآخرة."
      },
      {
        numberInSurah: 4,
        text: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense.",
        tafseer: "هو سبحانه وحده المتصرّف والمالك ليوم الجزاء والحساب، وهو يوم القيامة الذي يدان فيه العباد بأعمالهم."
      },
      {
        numberInSurah: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help.",
        tafseer: "نخصّك وحدك بالعبادة والطاعة والذل والانقياد، ونستعين بك وحدك في جلب مصالحنا ودفع المضار وتحقيق شؤوننا."
      },
      {
        numberInSurah: 6,
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path -",
        tafseer: "أرشدنا ووفّقنا واسلك بنا وسدّدنا إلى الطريق المستقيم الواضح المؤدي إلى جنتك، وهو دين الإسلام."
      },
      {
        numberInSurah: 7,
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        tafseer: "طريق الذين تفضّلت عليهم بالهداية من النبيين والصديقين والشهداء والصالحين، غير طريق المغضوب عليهم (اليهود)، وغير طريق الضالين (النصارى)."
      }
    ]
  },
  108: {
    number: 108,
    name: "الكوثر",
    englishName: "Al-Kawthar",
    englishNameTranslation: "Abundance",
    revelationType: "Meccan",
    ayahs: [
      {
        numberInSurah: 1,
        text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
        tafseer: "إنا أعطيناك -أيها الرسول- خيراً كثيراً وعطاء عظيماً في الدنيا والآخرة، ومن ذلك نهر الكوثر العظيم في الجنة."
      },
      {
        numberInSurah: 2,
        text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        translation: "So pray to your Lord and sacrifice [to Him alone].",
        tafseer: "فأخلص لربك وحده صلاتك كلها، واذبح ذبائحك وقرابينك على اسمه وحده خالصاً لوجهه الكريم شُكراً لنعمه."
      },
      {
        numberInSurah: 3,
        text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        translation: "Indeed, your enemy is the one cut off.",
        tafseer: "إن مبغضك ومعاديك ومحارب دعوتك هو الأبتر المقطوع من كل خير في الدنيا والآخرة، المنسي الذكر المذموم دائماً."
      }
    ]
  },
  112: {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    englishNameTranslation: "Sincerity",
    revelationType: "Meccan",
    ayahs: [
      {
        numberInSurah: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, \"He is Allah, [who is] One,",
        tafseer: "قل -أيها الرسول- لمن سألك عن ربك: هو الله المنفرد بالربوبية والإلهية والأسماء والصفات، لا شريك له ولا شبيه."
      },
      {
        numberInSurah: 2,
        text: "اللَّهُ الصَّمَدُ",
        translation: "Allah, the Eternal Refuge.",
        tafseer: "الله وحده هو المقصود في قضاء الحوائج والرغائب، السيد الذي كمل في سؤدده وعظمته، وتفتقر إليه الخلائق كلها."
      },
      {
        numberInSurah: 3,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "He neither begets nor is born,",
        tafseer: "ليس له ولد سبحانه وتعالى، ولم يولد من أصل، لمنزهيته الكاملة عن صفات النقص والمشابهة للمخلوقين."
      },
      {
        numberInSurah: 4,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translation: "And there is none co-equal or comparable unto Him.\"",
        tafseer: "ولم يكن له مكافئ ولا مماثل ولا شبيه في ذاته ولا في أسمائه وصفاته وأفعاله من أحد من خلقه."
      }
    ]
  },
  113: {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishNameTranslation: "The Daybreak",
    revelationType: "Meccan",
    ayahs: [
      {
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translation: "Say, \"I seek refuge in the Lord of daybreak",
        tafseer: "قل -أيها الرسول-: أستجير وأتحصّن برب الصبح وفالقه سبحانه وتعالى القادر على جلاء الظلمة."
      },
      {
        numberInSurah: 2,
        text: "مِن شَرِّ مَا خَلَقَ",
        translation: "From the evil of that which He created",
        tafseer: "من شر وضر جميع ما خلق الله وصنع من شياطين وإنس وجن وهوام وسباع وبلاد وغيرها."
      },
      {
        numberInSurah: 3,
        text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translation: "And from the evil of darkness when it settles",
        tafseer: "ومن شر ظلام الليل إذا دخل وساد وتغلغل، وما ينتشر فيه من ذوي الشرور والفساد والهوام السامة."
      },
      {
        numberInSurah: 4,
        text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translation: "And from the evil of the blowers in knots",
        tafseer: "ومن شر السواحر اللاتي ينفثن وينفخن بغرض السحر والضرر في عقد الخيوط أو الحبال التي يعقدنها للإضرار بالناس."
      },
      {
        numberInSurah: 5,
        text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translation: "And from the evil of an envier when he envies.\"",
        tafseer: "ومن شر الحاسد الباغض الذي يتمنى زوال نعم الله عن غيره، إذا تلبَّس بالحسد وسعى لتنفيذه وإيذاء المحسود."
      }
    ]
  },
  114: {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    englishNameTranslation: "Mankind",
    revelationType: "Meccan",
    ayahs: [
      {
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Say, \"I seek refuge in the Lord of mankind,",
        tafseer: "قل -أيها الرسول-: أستعين وأستجير وأعتصم برب الناس القائم على مصالحهم ومدبر أمورهم."
      },
      {
        numberInSurah: 2,
        text: "مَلِكِ النَّاسِ",
        translation: "The Sovereign of mankind,",
        tafseer: "ملك الناس المتصرف فيهم بالبسط والقبض والملك الكامل، فلا حاكم حقيقي سواه سبحانه."
      },
      {
        numberInSurah: 3,
        text: "إِلَٰهِ النَّاسِ",
        translation: "The God of mankind,",
        tafseer: "إله الناس المعبود بحق وحده لا شريك له، الذي تخضع لعظمته النفوس والقلوب حباً وتألهاً."
      },
      {
        numberInSurah: 4,
        text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translation: "From the evil of the retreating whisperer -",
        tafseer: "من ضر الشيطان الموكل بالإنسان، الذي يوسوس له بالشر فإذا ذكر العبد ربه تراجع وانقبض وخنس."
      },
      {
        numberInSurah: 5,
        text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translation: "Who whispers [evil] into the breasts of mankind -",
        tafseer: "الذي ينفث ويسرب وساوسه وشبهاته وضلالاته في قلوب الإنس بهمس خفي وتزيين باطل."
      },
      {
        numberInSurah: 6,
        text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translation: "From among the jinn and mankind.\"",
        tafseer: "وهذا الموسوس الداعي للشر قد يكون من شياطين الجن، وقد يكون من دعاة الباطل وشياطين الإنس."
      }
    ]
  }
};
