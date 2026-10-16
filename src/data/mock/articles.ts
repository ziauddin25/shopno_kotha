import type { Article } from "@/types";

/**
 * Phase 1 demo dataset.
 *
 * `isDemo: true` marks articles whose body is placeholder copy written to
 * exercise the interface. Articles with `isDemo: false` still quote their
 * Arabic evidence verbatim from the linked sources, but no article in Phase 1
 * has been reviewed by a scholar (`reviewedBy: null` everywhere).
 */
export const articles: Article[] = [
  {
    id: "bn-three-types",
    slug: "three-types-of-dreams",
    locale: "bn",
    title: "ইসলামে স্বপ্নের তিনটি ধরন",
    summary:
      "হাদিসের আলোকে স্বপ্নের তিনটি শ্রেণি — সুসংবাদ, মনের আলাপ এবং শয়তানের ভয় — এবং প্রতিটির ক্ষেত্রে করণীয়।",
    body: [
      {
        type: "paragraph",
        text: "স্বপ্নকে ইসলামি সূত্রে একক বিষয় হিসেবে দেখা হয় না। হাদিসে স্বপ্নকে স্পষ্টভাবে কয়েকটি শ্রেণিতে ভাগ করা হয়েছে, যাতে পাঠক বুঝতে পারেন কোন স্বপ্নে কৃতজ্ঞ হওয়া উচিত, কোনটি নিছক মনের আলাপ, আর কোনটি নিয়ে দুশ্চিন্তার কিছু নেই।",
      },
      { type: "heading", level: 2, text: "তিনটি শ্রেণি" },
      {
        type: "arabic",
        text: "الرُّؤْيَا ثَلَاثٌ فَبُشْرَى مِنَ اللَّهِ وَحَدِيثُ النَّفْسِ وَتَخْوِيفٌ مِنَ الشَّيْطَانِ فَإِذَا رَأَى أَحَدُكُمْ رُؤْيَا تُعْجِبُهُ فَلْيَقُصَّهَا إِنْ شَاءَ وَإِنْ رَأَى شَيْئًا يَكْرَهُهُ فَلَا يَقُصَّهُ عَلَى أَحَدٍ وَلْيَقُمْ يُصَلِّي",
        transliteration:
          "Ar-ru’ya thalath: fa bushra min Allah, wa hadithun-nafs, wa takhwifun min ash-shaytan…",
        translation:
          "স্বপ্ন তিন প্রকার — আল্লাহর কাছ থেকে সুসংবাদ, মনের আলাপ, এবং শয়তানের কাছ থেকে ভয়। কেউ পছন্দনীয় স্বপ্ন দেখলে চাইলে তা বর্ণনা করতে পারে; আর অপছন্দনীয় কিছু দেখলে কারও কাছে তা বর্ণনা করবে না এবং উঠে নামাজ পড়বে।",
        sourceId: "ibn-majah-3906",
      },
      {
        type: "paragraph",
        text: "প্রথম শ্রেণিটি সুসংবাদ — যা কুরআনে ‘বুশরা’ শব্দে উল্লেখিত এবং হাদিসে মুমিনের জন্য সুখবর হিসেবে বর্ণিত। দ্বিতীয়টি মনের আলাপ: দৈনন্দিন ভাবনা, চিন্তা বা ক্লান্তির ছাপ, যার কোনো ব্যাখ্যাগত তাৎপর্য ধরে নেওয়া যায় না। তৃতীয়টি শয়তানের কাছ থেকে ভয়, যা ধর্মীয় দৃষ্টিতে গুরুত্বপূর্ণ নয় — বরং তাকে হালকাভাবে নেওয়ার নির্দেশ দেওয়া হয়েছে।",
      },
      { type: "heading", level: 2, text: "কেন এই শ্রেণিবিভাগ গুরুত্বপূর্ণ" },
      {
        type: "list",
        items: [
          "মনের আলাপকে ‘সংকেত’ ভেবে ভুল করার ঝুঁকি কমে",
          "ভয়ংকর স্বপ্নকে আত্মগত হুমকি হিসেবে না দেখে শান্ত থাকা যায়",
          "প্রতিটি শ্রেণির জন্য পাল্টে যায় করণীয় — কৃতজ্ঞতা, অবহেলা, নাকি আশ্রয় প্রার্থনা",
        ],
      },
      { type: "heading", level: 2, text: "আমরা যা দাবি করি না" },
      {
        type: "paragraph",
        text: "এই শ্রেণিবিভাগ কোনো স্বপ্নকে ভবিষ্যতের সংবাদ বানায় না। হাদিসে ভালো স্বপ্নকে নবুয়তের ছেচল্লিশ ভাগের এক ভাগ বলা হয়েছে; এর অর্থ হলো স্বপ্নের সঙ্গে ওহির আলোড়নহীন ছায়া আছে — নবুয়তের দাবি নয়।",
      },
      {
        type: "note",
        text: "উপরের আরবি পাঠ সুনান ইবনে মাজাহ ৩৯০৬ থেকে হুবহু নেওয়া। বাংলা অনুবাদ সম্পাদকীয় এবং পণ্ডিত পর্যালোচনার অপেক্ষায়।",
      },
    ],
    categoryId: "dream-types",
    keywords: [
      "স্বপ্ন",
      "স্বপ্নের ধরন",
      "তিন ধরনের স্বপ্ন",
      "ruya",
      "dream types",
      "ইসলামে স্বপ্ন",
    ],
    status: "published",
    featured: true,
    publishedAt: "2026-09-18",
    readingMinutes: 7,
    sourceIds: ["ibn-majah-3906", "bukhari-6984", "bukhari-6987"],
    relatedArticleIds: [
      "disturbing-dreams-what-to-do",
      "dream-interpretation-limits",
      "pleasant-dream-etiquette",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "bn-disturbing",
    slug: "disturbing-dreams-what-to-do",
    locale: "bn",
    title: "ত্রাসময় স্বপ্ন দেখলে কী করবেন",
    summary:
      "সূত্রভিত্তিক, শান্ত ও ধাপে ধাপে নির্দেশনা — ভয় ছড়ানো নয়, বরং প্রশান্তি।",
    body: [
      {
        type: "paragraph",
        text: "দুঃস্বপ্নের পর দেহে যে অবসাদ ও ভয় আসে তা স্বাভাবিক। কিন্তু ইসলামি নির্দেশনা এই মুহূর্তে কী করতে হবে তা সুস্পষ্টভাবে বলে দিয়েছে — এবং কোনো ধাপেই ভয় ছড়ানো বা ভবিষ্যদ্বাণীর দিকে যাওয়া নেই।",
      },
      { type: "heading", level: 2, text: "১. আশ্রয় প্রার্থনা" },
      {
        type: "arabic",
        text: "الرُّؤْيَا الصَّالِحَةُ مِنَ اللَّهِ، وَالْحُلْمُ مِنَ الشَّيْطَانِ، فَإِذَا حَلَمَ فَلْيَتَعَوَّذْ مِنْهُ وَلْيَبْصُقْ عَنْ شِمَالِهِ، فَإِنَّهَا لَا تَضُرُّهُ",
        transliteration:
          "…fa idha halama fal-yata’awwadh minhu wal-yabsuq ‘an shimalihi, fa innaha la tadurruh.",
        translation:
          "নেক স্বপ্ন আল্লাহর পক্ষ থেকে, আর দুঃস্বপ্ন শয়তানের পক্ষ থেকে। কেউ অপ্রিয় স্বপ্ন দেখলে সে যেন তা থেকে আশ্রয় প্রার্থনা করে এবং বাঁ দিকে ফুঁ দেয় — তাতে তার কোনো ক্ষতি হবে না।",
        sourceId: "bukhari-6986",
      },
      {
        type: "paragraph",
        text: "সহিহ মুসলিম ২২৬১ক-এ বর্ণনাটি একটু বিস্তৃত: বাঁ দিকে তিনবার ফুঁ দিয়ে শয়তানের অনিষ্ট থেকে আশ্রয় চাইতে বলা হয়েছে। দুটো বর্ণনাই একই মূল নির্দেশকে নির্দেশ করে: ভয়কে প্রশ্রয় না দিয়ে আল্লাহর আশ্রয়ে ফিরে যাওয়া।",
      },
      { type: "heading", level: 2, text: "২. পরের ধাপগুলো" },
      {
        type: "list",
        items: [
          "পাশ ফিরে শুয়ে পড়ুন — বাঁ দিকের পরিবর্তে ডান দিকে ফিরলে মন প্রশান্ত হতে পারে",
          "নামাজের সময় হলে উঠে দুই রকআত নামাজ পড়ুন; অপছন্দনীয় স্বপ্নের পর নামাজের নির্দেশ হাদিসে আছে",
          "স্বপ্নের ভয়ংকর বিবরণ সবার সামনে নিয়ে আসবেন না — এতে ভয় কেবল ছড়ায়",
        ],
      },
      { type: "heading", level: 2, text: "৩. যা করবেন না" },
      {
        type: "list",
        ordered: true,
        items: [
          "স্বপ্নকে ভবিষ্যতের খবর ধরে নেওয়া",
          "ভয় থেকে বড় সিদ্ধান্ত নেওয়া — চাকরি ছাড়া, সম্পর্ক ভাঙা, বা অর্থনৈতিক পদক্ষেপ",
          "স্বপ্নের অর্থ জিজ্ঞাসা করে অচেনা ব্যক্তির কাছে ব্যক্তিগত তথ্য দেওয়া",
        ],
      },
      {
        type: "paragraph",
        text: "মানসিক বা শারীরিক কষ্ট চলমান থাকলে — যেমন ঘন ঘন দুঃস্বপ্ন, অনিদ্রা বা উদ্বেগ — ধর্মীয় আমলের পাশে অভিজ্ঞ চিকিৎসকের পরামর্শ নেওয়া জরুরি। দ্বীন ও চিকিৎসা পরস্পরবিরোধী নয়।",
      },
      {
        type: "note",
        text: "হাদিসের আরবি পাঠ বুখারি ৬৯৮৬ থেকে হুবহু। বাংলা অনুবাদ সম্পাদকীয়, পর্যালোচনার অপেক্ষায়।",
      },
    ],
    categoryId: "disturbing-dreams",
    keywords: [
      "দুঃস্বপ্ন",
      "ত্রাসময় স্বপ্ন",
      "ভয়ংকর স্বপ্ন",
      "bad dream",
      "disturbing dream",
      "নামাজ",
    ],
    status: "published",
    featured: false,
    publishedAt: "2026-09-24",
    readingMinutes: 6,
    sourceIds: ["bukhari-6986", "muslim-2261a", "ibn-majah-3906"],
    relatedArticleIds: [
      "three-types-of-dreams",
      "pleasant-dream-etiquette",
      "dream-interpretation-limits",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "bn-pleasant",
    slug: "pleasant-dream-etiquette",
    locale: "bn",
    title: "ভালো স্বপ্ন দেখলে কী করবেন",
    summary:
      "কৃতজ্ঞতা, বিনয় ও বিশ্বস্ততার আচরণবিধি — এবং কেন ভালো স্বপ্নও ভবিষ্যতের নিশ্চয়তা নয়।",
    body: [
      {
        type: "paragraph",
        text: "সুন্দর স্বপ্ন জাগরণে এক ধরনের উষ্ণতা নিয়ে আসে। ইসলামি নির্দেশনা এই অনুভূতিকে কৃতজ্ঞতা এবং বিনয়ের সঙ্গে গ্রহণ করতে বলে — গর্ব বা বড় দাবির মধ্যে না গিয়ে।",
      },
      {
        type: "arabic",
        text: "رُؤْيَا الْمُؤْمِنِ جُزْءٌ مِنْ سِتَّةٍ وَأَرْبَعِينَ جُزْءًا مِنَ النُّبُوَّةِ",
        transliteration: "Ru’yal-mu’mini juz’un min sittatin wa arba‘ina juz’an min an-nubuwwah.",
        translation:
          "মু‘মিনের স্বপ্ন নবুয়তের ছেচল্লিশ ভাগের এক ভাগ।",
        sourceId: "bukhari-6987",
      },
      { type: "heading", level: 2, text: "আচরণবিধি" },
      {
        type: "list",
        items: [
          "আল্লাহর প্রতি কৃতজ্ঞতা জানানো — স্বপ্ন নিজে পুরস্কার নয়, সুসংবাদের ছায়া মাত্র",
          "শুধু বিশ্বস্ত ও প্রিয় ব্যক্তির সঙ্গে শেয়ার করা; অচেনা মানুষের সামনে বিস্তারিত বর্ণনা নয়",
          "স্বপ্নকে সাফল্যের পূর্বাভাস হিসেবে ব্যবহার না করা",
          "ভবিষ্যতে যাচাই করা সহজ হবে ভেবে স্বপ্নটি সংক্ষেপে লিখে রাখা",
        ],
      },
      { type: "heading", level: 2, text: "ভবিষ্যদ্বাণী নয়" },
      {
        type: "paragraph",
        text: "‘নবুয়তের ছেচল্লিশ ভাগের এক ভাগ’ বলতে স্বপ্নের সঙ্গে নবুয়তের আলোড়নের সামান্য মিল বোঝানো হয়েছে। কোনো ব্যাখ্যাকার এই বাক্যকে ব্যক্তিগত ভবিষ্যদ্বাণীর অনুমতি হিসেবে ব্যবহার করেননি। আমরা এই সীমা কোনো লেখায় লুকাই না।",
      },
      {
        type: "note",
        text: "আরবি পাঠ সহিহ বুখারি ৬৯৮৭ থেকে হুবহু। অনুবাদ সম্পাদকীয়।",
      },
    ],
    categoryId: "peaceful-dreams",
    keywords: ["ভালো স্বপ্ন", "সুন্দর স্বপ্ন", "good dream", "pleasant dream", "কৃতজ্ঞতা"],
    status: "published",
    featured: false,
    publishedAt: "2026-09-30",
    readingMinutes: 5,
    sourceIds: ["bukhari-6987", "ibn-majah-3906"],
    relatedArticleIds: [
      "three-types-of-dreams",
      "disturbing-dreams-what-to-do",
      "dream-etiquette-sharing",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "bn-limits",
    slug: "dream-interpretation-limits",
    locale: "bn",
    title: "স্বপ্ন ব্যাখ্যার সীমা",
    summary:
      "ব্যাখ্যা একটি কলা, ভবিষ্যদ্বাণী নয় — কোন তিনটি সীমা আমরা সব লেখায় প্রকাশ করি।",
    body: [
      {
        type: "paragraph",
        text: "শতাব্দী ধরে স্বপ্ন ব্যাখ্যা ইসলামি পাণ্ডিত্যের একটি আলোচিত শাখা। তবে ক্লাসিক্যাল সাহিত্য নিজেই বারবার সতর্ক করেছে — স্বপ্নের অর্থ অনুমাননির্ভর, ব্যাখ্যাকারীর উপর নির্ভর করে এবং ভবিষ্যৎ কোনোটিই নিশ্চিত করে না।",
      },
      { type: "heading", level: 2, text: "তিনটি সীমা" },
      {
        type: "list",
        ordered: true,
        items: [
          "কোনো স্বপ্ন নিশ্চিতভাবে ভবিষ্যৎ বলে না — ব্যাখ্যা সম্ভাবনার আলোচনা, ঘোষণা নয়",
          "সাংস্কৃতিক বিশ্বাস ও প্রামাণিক সূত্র এক নয়; দুটিকে আলাদা করে দেখানো হয়",
          "ব্যক্তিগত ব্যাখ্যা দরকার হলে যোগ্য আলেমের কাছে যেতে হয় — আমরা নিজে ব্যাখ্যা দিই না",
        ],
      },
      { type: "heading", level: 2, text: "তাহলে ব্যাখ্যার মূল্য কী" },
      {
        type: "paragraph",
        text: "ব্যাখ্যার মূল্য চর্চাগত — এটি মনকে আত্মপরীক্ষায়, প্রতীকের প্রতি সতর্কতায় এবং অতিরঞ্জিত দাবির প্রতি সন্দেহ পোষণে সাহায্য করতে পারে। হাদিসেও ভালো ও মন্দ স্বপ্নের মধ্যকার পাঠ্য পার্থক্য আমাদের শেখায় কী গুরুত্ব দিতে হবে, আর কী উপেক্ষা করা উচিত।",
      },
      {
        type: "paragraph",
        text: "আমরা কোনো প্রবন্ধে স্বপ্নের অভিধান-জাতীয় অর্থ দিই না, এবং ‘এই স্বপ্ন দেখলে এই হবে’ ধরনের লেখা প্রকাশ করি না — কারণ এমন দাবির ধর্মীয় ভিত্তি নেই।",
      },
      {
        type: "note",
        text: "এই লেখাটি মোটেই ব্যাখ্যামূলক নির্দেশিকা নয়; এটি সীমা সম্পর্কে সম্পাদকীয় নীতি।",
      },
    ],
    categoryId: "interpretation-ethics",
    keywords: [
      "ব্যাখ্যা",
      "স্বপ্নের অর্থ",
      "interpretation",
      "limits",
      "তাবির",
      "সীমা",
    ],
    status: "published",
    featured: false,
    publishedAt: "2026-10-02",
    readingMinutes: 6,
    sourceIds: ["bukhari-6987", "editorial-policy", "scholarly-review-pending"],
    relatedArticleIds: [
      "three-types-of-dreams",
      "cultural-beliefs-vs-evidence",
      "when-to-ask-a-scholar",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "bn-sleep-duas",
    slug: "before-sleep-duas",
    locale: "bn",
    title: "ঘুমের আগে ও পরে যে আমলগুলো আছে",
    summary:
      "ওজু, ডান কাত, আত্মসমর্পণের দোয়া এবং আয়াতুল কুরসী — সূত্রভিত্তিক সংক্ষিপ্ত নির্দেশনা।",
    body: [
      {
        type: "paragraph",
        text: "ঘুম ইসলামি নির্দেশনায় এক ধরনের ক্ষণিক মৃত্যুর মতো — তাই এর আগে ও পরে কিছু বাক্য ও কাজের বর্ণনা আছে, যা স্বপ্নের অভিজ্ঞতাকেও প্রভাবিত করে বলে বর্ণিত হয়েছে।",
      },
      { type: "heading", level: 2, text: "১. ওজু করে ডান কাত হওয়া" },
      {
        type: "arabic",
        text: "اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
        transliteration:
          "Allahumma aslamtu wajhi ilaika, wa fawwadtu amri ilaika…",
        translation:
          "হে আল্লাহ, আমি আমার মুখমণ্ডল তোমার দিকে সমর্পণ করেছি, আমার কাজ তোমার হাতে অর্পণ করেছি… (সম্পূর্ণ অনুবাদ দোয়া পাতায়)",
        sourceId: "bukhari-6311",
      },
      { type: "heading", level: 2, text: "২. ছোট দুই বাক্য" },
      {
        type: "arabic",
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya.",
        translation: "হে আল্লাহ, তোমার নামেই আমি মরি ও বাঁচি।",
        sourceId: "bukhari-6324",
      },
      {
        type: "paragraph",
        text: "জেগে ওঠার পর রাসূল (সা.) বলতেন: ‘আল-হামদু লিল্লাহিল্লাজি আহইয়ানা বা’দা মা আমাতানা, ওয়া ইলাইহিন-নুশুর।’ — অর্থ: সব প্রশংসা আল্লাহর, যিনি মৃত্যুর পর জীবিত করেছেন; প্রত্যাবর্তন তাঁরই কাছে।",
      },
      { type: "heading", level: 2, text: "৩. আয়াতুল কুরসী" },
      {
        type: "paragraph",
        text: "আবু হুরায়রা (রা.) থেকে বর্ণিত বুখারি ২৩১১-এ ঘুমের আগে আয়াতুল কুরসী পড়ার বর্ণনা আছে — যেখানে বলা হয়েছে, পাঠ শেষ হলে ভোর পর্যন্ত আল্লাহর পক্ষ থেকে একজন রক্ষক নিয়োগ হয় এবং কোনো শয়তান কাছে আসে না। আয়াতটির আরবি পাঠ ও বাংলা অর্থ দোয়া পাতায় দেওয়া হয়েছে।",
      },
      {
        type: "note",
        text: "আয়াতুল কুরসীর আরবি পাঠ কুরআন ডেটা (quran-uthmani) থেকে নেওয়া; বুখারি ২৩১১-এর সম্পূর্ণ বিবরণ সূত্র পাতায় লিংক করা।",
      },
    ],
    categoryId: "daily-practice",
    keywords: [
      "ঘুমের দোয়া",
      "আয়াতুল কুরসী",
      "bedtime dua",
      "sleep",
      "আমল",
      "ওজু",
    ],
    status: "published",
    featured: false,
    publishedAt: "2026-10-06",
    readingMinutes: 6,
    sourceIds: ["bukhari-6311", "bukhari-6324", "bukhari-2311", "quran-2-255"],
    relatedArticleIds: [
      "three-types-of-dreams",
      "sleep-habits-and-peace-of-mind",
      "disturbing-dreams-what-to-do",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "bn-culture",
    slug: "cultural-beliefs-vs-evidence",
    locale: "bn",
    title: "সাংস্কৃতিক বিশ্বাস বনাম প্রমাণ",
    summary:
      "গ্রামীণ ও নগরজনপ্রিয় স্বপ্ন-বিশ্বাস কোথা থেকে আসে, আর ধর্মীয় সূত্র হিসেবে সেগুলো কেন পাশে রাখা হয়। (ডেমো নমুনা লেখা)",
    body: [
      {
        type: "paragraph",
        text: "স্বপ্ন নিয়ে বাংলাভাষী সমাজে বহু প্রচলিত বিশ্বাস আছে — কোনোটি গল্প, কোনোটি পরিবারিক অভ্যাস, কোনোটি বসন-সাজসজ্জার সঙ্গে জড়িত। এই বিশ্বাসগুলো শক্তিশালী, কিন্তু তাদের কেউ কেউ ধর্মীয় প্রমাণের মর্যাদা চেয়ে বসে। আমাদের কাজ এই দুই জগতের মধ্যে স্পষ্ট দাগ টানা।",
      },
      { type: "heading", level: 2, text: "সাধারণ জনপ্রচলিত বিশ্বাস" },
      {
        type: "list",
        items: [
          "নদী বা স্বচ্ছ পানি দেখা ভালো লক্ষণ",
          "ছোট প্রাণী বা কলহের স্বপ্ন পাশাপাশি ব্যাখ্যা করা",
          "স্বপ্নে কেউ মুখ দেখানোর ঘটনাকে নির্দিষ্ট ব্যক্তির সম্পর্কে সূচক ধরা",
          "স্বপ্ন ‘ফলে যাওয়া’ নিয়ে সময়সংক্রান্ত ধারণা",
        ],
      },
      {
        type: "paragraph",
        text: "এগুলো লোকজ প্রেক্ষাপট — বর্ণিত হাদিস নয়। এদের ওপর ভিত্তি করে কোনো ধর্মীয় সিদ্ধান্ত নেওয়া অনুচিত, আর ভয় বা আশঙ্কার দোহাই দিয়ে কারও ওপর চাপ দেওয়া তো সম্পূর্ণ অগ্রহণযোগ্য।",
      },
      { type: "heading", level: 2, text: "আচরণগত পার্থক্য" },
      {
        type: "paragraph",
        text: "প্রমাণভিত্তিক পথ কম উত্তেজনাকর, কিন্তু শান্ত: ভালো স্বপ্নে কৃতজ্ঞতা, মন্দ স্বপ্নে আশ্রয় ও অবহেলা, আর অনিশ্চিত ব্যাপারে আলেমের কাছে নমনীয় প্রশ্ন।",
      },
      {
        type: "note",
        text: "এই লেখাটি ইন্টারফেস প্রদর্শনের জন্য নমুনা লেখা; কোনো সাংস্কৃতিক বিশ্বাসকে ধর্মীয় সূত্র হিসেবে প্রকাশ করা হয়নি।",
      },
    ],
    categoryId: "interpretation-ethics",
    keywords: [
      "সাংস্কৃতিক বিশ্বাস",
      "কুসংস্কার",
      "cultural belief",
      "প্রমাণ",
      "folk belief",
    ],
    status: "published",
    featured: false,
    publishedAt: "2026-10-08",
    readingMinutes: 5,
    sourceIds: ["cultural-dream-beliefs", "editorial-policy"],
    relatedArticleIds: [
      "dream-interpretation-limits",
      "when-to-ask-a-scholar",
      "three-types-of-dreams",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "bn-scholarship",
    slug: "scholarly-review-what-it-means",
    locale: "bn",
    title: "‘আলেমের পর্যালোচনা’ মানে আসলে কী",
    summary:
      "আমরা এখনো কোনো লেখাকে পণ্ডিত-পর্যালোচিত দাবি করছি না — কেন, এবং ভবিষ্যতে কী বদলাবে। (ডেমো নমুনা লেখা)",
    body: [
      {
        type: "paragraph",
        text: "বিভিন্ন ইসলামি ওয়েবসাইটে ‘পর্যালোচিত’ শব্দটি নানা অর্থে ব্যবহৃত হয় — কখনো সত্যিকারের ইলমি কর্তৃপক্ষের অনুমোদন, কখনো শুধু একটি টাইপো-পরীক্ষা। এই শব্দটি যাতে মুদ্রা না হয়ে যায়, তা নিশ্চিত করার জন্য আমরা আমাদের নিজস্ব সংজ্ঞানির্ধারণ করেছি।",
      },
      { type: "heading", level: 2, text: "আমাদের সংজ্ঞা" },
      {
        type: "list",
        items: [
          "লেখাটি যোগ্য আলেম পড়ে ধর্মীয় দাবিগুলো যাচাই করেছেন",
          "সংশোধন প্রস্তাব লিখিত আকারে লিপিবদ্ধ হয়েছে",
          "পর্যালোচকের নাম এবং পর্যালোচনার তারিখ প্রকাশিত",
        ],
      },
      {
        type: "paragraph",
        text: "ফেজ ১-এ এই তিনটির কোনোটিই পূরণ হয়নি, তাই আমরা কোনো লেখার পাশে ‘পর্যালোচিত’ লেবেল বসাই না। লেখাগুলোর পাশে কেবল সূত্রের অবস্থা যায় — যাচাই করা হয়েছে, বাকি, বা ডেমো।",
      },
      {
        type: "note",
        text: "এটি ইন্টারফেস পরীক্ষার নমুনা লেখা। ভবিষ্যতে পর্যালোচনা-প্রক্রিয়া ডেটাবেসে যুক্ত হবে।",
      },
    ],
    categoryId: "sources-scholarship",
    keywords: [
      "পর্যালোচনা",
      "scholarly review",
      "আলেম",
      "সূত্র যাচাই",
      "editorial",
    ],
    status: "published",
    featured: false,
    publishedAt: "2026-10-09",
    readingMinutes: 4,
    sourceIds: ["scholarly-review-pending", "editorial-policy"],
    relatedArticleIds: [
      "dream-interpretation-limits",
      "cultural-beliefs-vs-evidence",
      "when-to-ask-a-scholar",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "bn-sharing",
    slug: "dream-etiquette-sharing",
    locale: "bn",
    title: "স্বপ্ন কার সঙ্গে শেয়ার করবেন",
    summary:
      "বর্ণনায় সতর্কতা — কখন বলা ও কখন না বলার নির্দেশ ও তার কারণ। (খসড়া — ডেমো নমুনা)",
    body: [
      {
        type: "paragraph",
        text: "স্বপ্নের অভিজ্ঞতা সহজে ছড়িয়ে পড়ে, বিশেষত সোশ্যাল মিডিয়ায়। কিন্তু প্রমাণভিত্তিক নির্দেশনায় কিছু বর্ণনা কমানোর পরামর্শ আছে, বিশেষত অপছন্দনীয় স্বপ্নের ক্ষেত্রে।",
      },
      {
        type: "paragraph",
        text: "এই লেখাটি এখনো খসড়া অবস্থায় আছে — ডেমো ডেটাসেটে প্রকাশনার আগে-পরে অবস্থা দেখানোর জন্য এটিকে ‘খসড়া’ হিসেবে রাখা হয়েছে।",
      },
      {
        type: "note",
        text: "ডেমো নমুনা লেখা — কোনোটিই ধর্মীয় দাবি নয়।",
      },
    ],
    categoryId: "peaceful-dreams",
    keywords: ["শেয়ার", "swopno", "sharing", "sharing dreams", "সোশ্যাল মিডিয়া"],
    status: "draft",
    featured: false,
    publishedAt: null,
    readingMinutes: 3,
    sourceIds: ["ibn-majah-3906"],
    relatedArticleIds: [
      "pleasant-dream-etiquette",
      "three-types-of-dreams",
      "cultural-beliefs-vs-evidence",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "bn-sleep-habits",
    slug: "sleep-habits-and-peace-of-mind",
    locale: "bn",
    title: "ঘুমের অভ্যাস ও মানসিক শান্তি",
    summary:
      "নিয়মিত ঘুম, স্ক্রিন-বিরতি ও রুটিন — স্বপ্নের মানসিক প্রভাব কমানোর বাস্তবিক দিক। (পর্যালোচনায় — ডেমো নমুনা)",
    body: [
      {
        type: "paragraph",
        text: "স্বপ্নের অভিজ্ঞতার প্রভাব অনেকাংশে নির্ভর করে ঘুমের গুণমানের উপর — অপর্যাপ্ত বা অনিয়মিত ঘুম স্বপ্নের স্মৃতি ও ভয় বাড়িয়ে দিতে পারে।",
      },
      { type: "heading", level: 2, text: "বাস্তবিক পদক্ষেপ" },
      {
        type: "list",
        items: [
          "প্রতিদিন প্রায় একই সময়ে ঘুমানো ও জাগা",
          "ঘুমের আগে অন্তত এক ঘণ্টা স্ক্রিন থেকে দূরে থাকা",
          "বিকেলে ক্যাফেইন সীমিত করা",
          "চিন্তা লিখে রাখা — ফলো-আপে সাহায্য করে",
        ],
      },
      {
        type: "note",
        text: "এটি পর্যালোচনা-অবস্থার ডেমো নমুনা লেখা; চিকিৎসা পরামর্শ নয়।",
      },
    ],
    categoryId: "daily-practice",
    keywords: [
      "ঘুমের অভ্যাস",
      "sleep habits",
      "insomnia",
      "মানসিক শান্তি",
      "রুটিন",
    ],
    status: "review",
    featured: false,
    publishedAt: null,
    readingMinutes: 4,
    sourceIds: ["editorial-policy"],
    relatedArticleIds: [
      "before-sleep-duas",
      "disturbing-dreams-what-to-do",
      "dream-etiquette-sharing",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "bn-ask-scholar",
    slug: "when-to-ask-a-scholar",
    locale: "bn",
    title: "কখন আলেমের পরামর্শ নেওয়া উচিত",
    summary:
      "কোন প্রশ্ন ধর্মীয় পরামর্শের, আর কোনটি চিকিৎসা বা ব্যক্তিগত সিদ্ধান্তের — সীমাটা কোথায়। (ডেমো নমুনা লেখা)",
    body: [
      {
        type: "paragraph",
        text: "সব প্রশ্নের উত্তর এক জায়গা থেকে আসে না। ধর্মীয় প্রশ্ন, চিকিৎসা-সংক্রান্ত উদ্বেগ এবং ব্যক্তিগত সিদ্ধান্ত — তিনটির জন্য তিন ধরনের পেশাদারিত্ব প্রয়োজন।",
      },
      { type: "heading", level: 2, text: "আলেমের কাছে যাওয়া যায় যখন" },
      {
        type: "list",
        items: [
          "কোনো আমল বা দোয়ার সঠিক পদ্ধতি জানতে চান",
          "একটি বর্ণনার সনদ বা ব্যাখ্যা শ্রেণিগতভাবে জানতে চান",
          "বিরোধপূর্ণ বর্ণনার প্রেক্ষাপট বুঝতে চান",
        ],
      },
      { type: "heading", level: 2, text: "যা অভিজ্ঞ পেশাদারের কাছে যায়" },
      {
        type: "list",
        items: [
          "দীর্ঘস্থায়ী অনিদ্রা বা দুঃস্বপ্নজনিত উদ্বেগ — চিকিৎসক বা মনোরোগ বিশেষজ্ঞ",
          "সম্পর্ক, পারিবারিক নিরাপত্তা বা আইনগত পরিস্থিতি",
        ],
      },
      {
        type: "paragraph",
        text: "আমরা এই দুই জগতকে পরস্পরবিরোধী দেখি না; শুধু অনুরোধ করি — উত্তরের জন্য যেখানে যাওয়া দরকার, সেখানেই যান।",
      },
      {
        type: "note",
        text: "ইন্টারফেস প্রদর্শনের জন্য নমুনা লেখা — কোনো চিকিৎসা বা ধর্মীয় নির্দেশনা নয়।",
      },
    ],
    categoryId: "interpretation-ethics",
    keywords: ["আলেম", "পরামর্শ", "scholar", "advice", "mentorship"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-10",
    readingMinutes: 5,
    sourceIds: ["scholarly-review-pending", "editorial-policy"],
    relatedArticleIds: [
      "dream-interpretation-limits",
      "cultural-beliefs-vs-evidence",
      "scholarly-review-what-it-means",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "en-dreams-sources",
    slug: "dreams-in-islamic-sources",
    locale: "en",
    title: "Dreams in Islamic sources: an introduction",
    summary:
      "What the hadith collections actually say about dreams — the three categories, and why they are never treated as predictions.",
    body: [
      {
        type: "paragraph",
        text: "Islamic sources do not treat dreams as a single phenomenon. The hadith literature draws clear lines between a pleasant dream understood as good news, a dream that is simply the mind talking, and a frightening dream attributed to Satan. Each category carries different practical guidance.",
      },
      { type: "heading", level: 2, text: "The three categories" },
      {
        type: "arabic",
        text: "الرُّؤْيَا ثَلَاثٌ فَبُشْرَى مِنَ اللَّهِ وَحَدِيثُ النَّفْسِ وَتَخْوِيفٌ مِنَ الشَّيْطَانِ",
        transliteration: "Ar-ru’ya thalath: fa bushra min Allah, wa hadithun-nafs, wa takhwifun min ash-shaytan.",
        translation:
          "Dreams are of three types: glad tidings from Allah, what is on a person’s mind, and frightening dreams from Satan.",
        sourceId: "ibn-majah-3906",
      },
      {
        type: "paragraph",
        text: "Elsewhere the same distinction is put in a single sentence: a true good dream is from Allah, and a bad dream is from Satan. The practical instruction that follows is consistent — a liked dream may be shared, an unpleasant one should not be retold, and prayer is the response to distress.",
      },
      { type: "heading", level: 2, text: "What the texts never promise" },
      {
        type: "paragraph",
        text: "A well-known narration describes the dream of a believer as a part of prophethood. That phrase expresses a faint resemblance between dreams and revelation — it is not a licence to predict the future. Nothing in the cited texts allows a dream to determine a decision about work, marriage or money.",
      },
      {
        type: "note",
        text: "Arabic text is quoted verbatim from Sunan Ibn Majah 3906. Editorial copy — no scholar has reviewed this article yet.",
      },
    ],
    categoryId: "dream-types",
    keywords: ["dreams", "islamic sources", "hadith", "ruya", "dream types"],
    status: "published",
    featured: false,
    publishedAt: "2026-09-20",
    readingMinutes: 6,
    sourceIds: ["ibn-majah-3906", "bukhari-6984", "bukhari-6987"],
    relatedArticleIds: [
      "after-a-bad-dream",
      "what-we-publish",
      "three-types-of-dreams",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "en-bad-dream",
    slug: "after-a-bad-dream",
    locale: "en",
    title: "After a bad dream: a calm, step-by-step response",
    summary:
      "Seek refuge, change position, pray — and refuse to build fear around a dream.",
    body: [
      {
        type: "paragraph",
        text: "Waking from a frightening dream is physically unsettling. The evidence-based response is short and deliberate: seek refuge, avoid retelling it widely, and return to prayer if you are still shaken.",
      },
      {
        type: "arabic",
        text: "الرُّؤْيَا الصَّالِحَةُ مِنَ اللَّهِ، وَالْحُلْمُ مِنَ الشَّيْطَانِ، فَإِذَا حَلَمَ فَلْيَتَعَوَّذْ مِنْهُ وَلْيَبْصُقْ عَنْ شِمَالِهِ، فَإِنَّهَا لَا تَضُرُّهُ",
        transliteration: "…fa idha halama fal-yata’awwadh minhu wal-yabsuq ‘an shimalihi, fa innaha la tadurruh.",
        translation:
          "A good dream is from Allah and an evil dream is from Satan. So whoever has an unwanted dream should seek refuge and spit to his left; it will not harm him.",
        sourceId: "bukhari-6986",
      },
      { type: "heading", level: 2, text: "Steps" },
      {
        type: "list",
        ordered: true,
        items: [
          "Seek refuge with Allah from the harm of the dream",
          "Turn over and settle on your other side",
          "Do not telegraph the dream to everyone",
          "If it still unsettles you, get up and pray",
        ],
      },
      {
        type: "paragraph",
        text: "Persistent nightmares, sleeplessness or anxiety belong with a medical professional as well. Religious practice and clinical care are not in competition.",
      },
      {
        type: "note",
        text: "Arabic text quoted verbatim from Sahih al-Bukhari 6986. Editorial copy — not yet reviewed.",
      },
    ],
    categoryId: "disturbing-dreams",
    keywords: ["bad dream", "nightmare", "disturbing dream", "refuge", "prayer"],
    status: "published",
    featured: false,
    publishedAt: "2026-09-26",
    readingMinutes: 5,
    sourceIds: ["bukhari-6986", "muslim-2261a"],
    relatedArticleIds: [
      "dreams-in-islamic-sources",
      "three-types-of-dreams",
      "what-we-publish",
    ],
    isDemo: false,
    reviewedBy: null,
  },
  {
    id: "en-what-we-publish",
    slug: "what-we-publish",
    locale: "en",
    title: "What we publish — and what we refuse to publish",
    summary:
      "The editorial guardrails behind every article, dua and source card on this site. (Demo sample copy.)",
    body: [
      {
        type: "paragraph",
        text: "Every claim about the Quran, the hadith or a scholar’s opinion is labelled with its source and its verification status. Anything we could not match to a published source is either removed or clearly marked as pending.",
      },
      { type: "heading", level: 2, text: "Never published" },
      {
        type: "list",
        items: [
          "Fabricated or guessed citations",
          "Dream-based predictions or guarantees",
          "Claims of scholarly review that have not happened",
          "Fear-driven or sensational headlines",
        ],
      },
      {
        type: "paragraph",
        text: "In Phase 1, the entire dataset is a demonstration. The interface itself is real — the data behind it is not a production library.",
      },
      {
        type: "note",
        text: "Demo sample copy kept for interface testing.",
      },
    ],
    categoryId: "sources-scholarship",
    keywords: ["editorial policy", "sources", "verification", "transparency"],
    status: "published",
    featured: false,
    publishedAt: "2026-10-01",
    readingMinutes: 4,
    sourceIds: ["editorial-policy", "scholarly-review-pending"],
    relatedArticleIds: [
      "dreams-in-islamic-sources",
      "when-to-ask-a-scholar",
      "dream-interpretation-limits",
    ],
    isDemo: true,
    reviewedBy: null,
  },
  {
    id: "en-sleep-dua-guide",
    slug: "sleep-dua-guide",
    locale: "en",
    title: "A short guide to the sleep and waking duas",
    summary:
      "Draft: the entrusting dua, the short name-of-Allah recitation, and Ayat al-Kursi before sleeping. (Demo draft.)",
    body: [
      {
        type: "paragraph",
        text: "The reported practice is simple: make ablution, lie on your right side, and say the entrusting dua. A shorter recitation — “In Your name, O Allah, I die and I live” — is reported for the moment of lying down, and the waking response praises Allah for restoring life.",
      },
      {
        type: "note",
        text: "Draft demo copy. The full text and meanings live on the Duas page.",
      },
    ],
    categoryId: "daily-practice",
    keywords: ["sleep dua", "bedtime", "waking", "ayat al-kursi"],
    status: "draft",
    featured: false,
    publishedAt: null,
    readingMinutes: 3,
    sourceIds: ["bukhari-6311", "bukhari-6324"],
    relatedArticleIds: [
      "dreams-in-islamic-sources",
      "after-a-bad-dream",
      "before-sleep-duas",
    ],
    isDemo: true,
    reviewedBy: null,
  },
];
