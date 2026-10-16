import type { Dua } from "@/types";

/**
 * Phase 1 demo dataset.
 * Every Arabic text below was copied from the linked public source during
 * authoring. Bengali meanings are editorial renderings and are flagged as
 * such (`translationIsEditorial`) until a reviewer signs off.
 */
export const duas: Dua[] = [
  {
    id: "dua-sleep-trust",
    slug: "dua-sleep-trust",
    title: {
      bn: "ঘুমের আগে আত্মসমর্পণের দোয়া",
      en: "Dua of entrusting oneself before sleep",
    },
    occasion: {
      bn: "ওজু করে ডান কাত হয়ে শোয়ার সময়",
      en: "Said with ablution, lying down on the right side",
    },
    arabic:
      "اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
    transliteration:
      "Allahumma aslamtu wajhi ilaika, wa fawwadtu amri ilaika, wa alja’tu dhahri ilaika, raghbatan wa rahbatan ilaika, la malja’a wa la manja minka illa ilaika. Amantu bikitabikal-ladhi anzalta wa binabiyyikal-ladhi arsalta.",
    translation: {
      bn: "হে আল্লাহ, আমি আমার মুখমণ্ডল তোমার দিকে সমর্পণ করেছি, আমার কাজ তোমার হাতে অর্পণ করেছি এবং আমার পিঠকে তোমার আশ্রয়ে দিয়েছি — তোমার প্রতি আকাঙ্ক্ষা ও ভয় নিয়ে। তোমা ছাড়া কোনো আশ্রয় বা মুক্তির পথ নেই। তোমার নাজিল করা কিতাব ও তোমার প্রেরিত নবীর ওপর আমি ঈমান এনেছি।",
      en: "O Allah, I have surrendered my face to You, entrusted my affair to You and leaned my back on You, in hope and fear of You. There is no refuge nor escape from You except to You. I believe in Your Book which You revealed and in Your Prophet whom You sent.",
    },
    sourceIds: ["bukhari-6311"],
    verification: "checked",
    translationIsEditorial: true,
    isDemo: false,
  },
  {
    id: "dua-sleep-short",
    slug: "dua-sleep-short",
    title: { bn: "ঘুমানোর সময়ের ছোট দোয়া", en: "Short dua when going to sleep" },
    occasion: {
      bn: "বিছানায় শোয়ার মুহূর্তে",
      en: "At the moment of lying down to sleep",
    },
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: {
      bn: "হে আল্লাহ, তোমার নামেই আমি মরি ও বাঁচি।",
      en: "In Your name, O Allah, I die and I live.",
    },
    sourceIds: ["bukhari-6324"],
    verification: "checked",
    translationIsEditorial: true,
    isDemo: false,
  },
  {
    id: "dua-waking",
    slug: "dua-waking",
    title: { bn: "ঘুম থেকে জেগে ওঠার দোয়া", en: "Dua upon waking up" },
    occasion: {
      bn: "নিদ্রা থেকে জেগে ওঠার সময়",
      en: "When waking up from sleep",
    },
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا، وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Al-hamdu lillahil-ladhi ahyana ba’da ma amatana, wa ilaihin-nushur.",
    translation: {
      bn: "সব প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর পুনরায় জীবিত করেছেন; আর তাঁরই কাছে প্রত্যাবর্তন।",
      en: "All praise is for Allah who gave us life after causing us to die, and to Him is the return.",
    },
    sourceIds: ["bukhari-6324"],
    verification: "checked",
    translationIsEditorial: true,
    isDemo: false,
  },
  {
    id: "dua-bad-dream",
    slug: "dua-bad-dream",
    title: {
      bn: "অপ্রিয় স্বপ্নের পর আশ্রয় ও প্রশান্তি",
      en: "Seeking refuge after an unwanted dream",
    },
    occasion: {
      bn: "ভয়ংকর বা অপ্রিয় স্বপ্ন দেখার পর",
      en: "After a frightening or unwanted dream",
    },
    arabic:
      "الرُّؤْيَا الصَّالِحَةُ مِنَ اللَّهِ، وَالْحُلْمُ مِنَ الشَّيْطَانِ، فَإِذَا حَلَمَ فَلْيَتَعَوَّذْ مِنْهُ وَلْيَبْصُقْ عَنْ شِمَالِهِ، فَإِنَّهَا لَا تَضُرُّهُ",
    transliteration:
      "Ar-ru’ya as-salihah min Allah, wal-hulmu min ash-shaytan; fa idha halama fal-yata’awwadh minhu wal-yabsuq ‘an shimalihi, fa innaha la tadurruh.",
    translation: {
      bn: "নেক স্বপ্ন আল্লাহর পক্ষ থেকে, আর দুঃস্বপ্ন শয়তানের পক্ষ থেকে। তাই কেউ অপ্রিয় স্বপ্ন দেখলে সে যেন তা থেকে আশ্রয় প্রার্থনা করে এবং বাঁ দিকে ফুঁ দেয় — তাতে তার কোনো ক্ষতি হবে না।",
      en: "A good dream is from Allah and an evil dream is from Satan. So whoever has an unwanted dream should seek refuge from it and spit to his left; it will not harm him.",
    },
    sourceIds: ["bukhari-6986", "muslim-2261a"],
    verification: "checked",
    translationIsEditorial: true,
    isDemo: false,
  },
  {
    id: "dua-ayatul-kursi",
    slug: "dua-ayatul-kursi",
    title: {
      bn: "ঘুমের আগে আয়াতুল কুরসী",
      en: "Ayat al-Kursi before sleep",
    },
    occasion: {
      bn: "ঘুমাতে যাওয়ার আগে",
      en: "Before going to bed",
    },
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "",
    translation: {
      bn: "আল্লাহ — তিনি ছাড়া কোনো ইলাহ নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আসমান ও জমিনে যা কিছু আছে সবই তাঁর। তাঁর অনুমতি ছাড়া কে তাঁর কাছে সুপারিশ করবে? তিনি জানেন তাদের সামনে ও পিছনে যা কিছু আছে; তাঁর জ্ঞানের কিছুই তারা আয়ত্ত করতে পারে না, কেবল যতটুকু তিনি চান। তাঁর কুরসী আসমান ও জমিনকে পরিব্যাপ্ত করে আছে; এ দুটির রক্ষণাবেক্ষণ তাঁকে ক্লান্ত করে না। তিনিই সুউচ্চ, মহান।",
      en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    },
    sourceIds: ["quran-2-255", "bukhari-2311"],
    verification: "checked",
    translationIsEditorial: true,
    isDemo: false,
  },
];
