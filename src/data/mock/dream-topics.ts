import type { DreamTopic } from "@/types";

/**
 * Phase 1 demo dataset for the dream-search journey.
 *
 * A topic is a *concept* a reader might describe ("I had a frightening dream"),
 * not a look-up table of symbol meanings. Every topic points only at content
 * that already exists in the mock articles/duas/sources, so the search never
 * invents an interpretation. Aliases intentionally include Bengali, Banglish
 * (`isRomanized: true`) and English surface forms.
 */
export const dreamTopics: DreamTopic[] = [
  {
    id: "disturbing-dream",
    slug: "disturbing-dream",
    title: { bn: "অপ্রিয় বা ভয়ংকর স্বপ্ন", en: "Disturbing or frightening dreams" },
    summary: {
      bn: "ভয়ংকর স্বপ্ন দেখার পর শান্ত থাকা, আশ্রয় প্রার্থনা এবং যা করা উচিত নয়।",
      en: "What is helpful after a frightening dream, what to avoid, and how to stay calm.",
    },
    categoryId: "disturbing-dreams",
    aliases: [
      { text: "ভয়ংকর স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "দুঃস্বপ্ন", locale: "bn", isRomanized: false },
      { text: "খারাপ স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "অপ্রিয় স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "kharap shopno", locale: "bn", isRomanized: true },
      { text: "dusswapno", locale: "bn", isRomanized: true },
      { text: "voyonkor shopno", locale: "bn", isRomanized: true },
      { text: "bad dream", locale: "en", isRomanized: false },
      { text: "disturbing dream", locale: "en", isRomanized: false },
      { text: "nightmare", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-disturbing", "en-bad-dream", "bn-three-types"],
    duaIds: ["dua-bad-dream"],
    sourceIds: ["bukhari-6986", "muslim-2261a", "ibn-majah-3906"],
    isDemo: false,
  },
  {
    id: "pleasant-dream",
    slug: "pleasant-dream",
    title: { bn: "সুসংবাদদায়ী বা প্রীতিকর স্বপ্ন", en: "Pleasant dreams and good tidings" },
    summary: {
      bn: "সুন্দর স্বপ্ন দেখলে কৃতজ্ঞ থাকা, কার সঙ্গে শেয়ার করা যায় এবং কী দাবি করা যায় না।",
      en: "Staying grateful after a beautiful dream, who to share it with, and what not to claim.",
    },
    categoryId: "peaceful-dreams",
    aliases: [
      { text: "ভালো স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "সুসংবাদ", locale: "bn", isRomanized: false },
      { text: "সুখের স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "bhalo shopno", locale: "bn", isRomanized: true },
      { text: "valo shopno", locale: "bn", isRomanized: true },
      { text: "good dream", locale: "en", isRomanized: false },
      { text: "pleasant dream", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-pleasant", "bn-sharing"],
    duaIds: ["dua-sleep-trust"],
    sourceIds: ["bukhari-6984", "bukhari-6987"],
    isDemo: false,
  },
  {
    id: "three-types-of-dreams",
    slug: "three-types-of-dreams",
    title: { bn: "স্বপ্নের তিন ধরন", en: "The three types of dreams" },
    summary: {
      bn: "হাদিসের আলোকে স্বপ্নের তিন শ্রেণি — সুসংবাদ, মনের আলাপ ও শয়তানের ভয়।",
      en: "The three classes of dreams described in the hadith: glad tidings, the self, and fear.",
    },
    categoryId: "dream-types",
    aliases: [
      { text: "স্বপ্নের ধরন", locale: "bn", isRomanized: false },
      { text: "তিন ধরনের স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "ইসলামে স্বপ্ন", locale: "bn", isRomanized: false },
      { text: "shopner dhoron", locale: "bn", isRomanized: true },
      { text: "teen dhoroner shopno", locale: "bn", isRomanized: true },
      { text: "dream types", locale: "en", isRomanized: false },
      { text: "types of dreams", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-three-types", "en-dreams-sources"],
    duaIds: [],
    sourceIds: ["ibn-majah-3906", "bukhari-6984", "bukhari-6987"],
    isDemo: false,
  },
  {
    id: "dream-interpretation-limits",
    slug: "dream-interpretation-limits",
    title: { bn: "স্বপ্নের ব্যাখ্যার সীমা", en: "The limits of dream interpretation" },
    summary: {
      bn: "স্বপ্নের ব্যাখ্যা কতটা দূর যায়, কোথায় থামা উচিত এবং কখন পণ্ডিতের কাছে যেতে হয়।",
      en: "How far interpretation goes, where it must stop, and when to ask a qualified scholar.",
    },
    categoryId: "interpretation-ethics",
    aliases: [
      { text: "স্বপ্নের ব্যাখ্যা", locale: "bn", isRomanized: false },
      { text: "তাবির", locale: "bn", isRomanized: false },
      { text: "স্বপ্নের মানে", locale: "bn", isRomanized: false },
      { text: "shopner bekkha", locale: "bn", isRomanized: true },
      { text: "tabir", locale: "bn", isRomanized: true },
      { text: "dream interpretation", locale: "en", isRomanized: false },
      { text: "dream meaning", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-limits", "bn-ask-scholar", "en-what-we-publish"],
    duaIds: [],
    sourceIds: ["scholarly-review-pending", "editorial-policy"],
    isDemo: false,
  },
  {
    id: "duas-for-sleep-and-dreams",
    slug: "duas-for-sleep-and-dreams",
    title: { bn: "ঘুম ও স্বপ্নের দোয়া", en: "Duas for sleep and dreams" },
    summary: {
      bn: "ঘুমের আগে ও পরে পড়ার দোয়া, আরবি পাঠ, অর্থ এবং সূত্রসহ।",
      en: "Duas to recite around sleep, with Arabic text, meaning and citation.",
    },
    categoryId: "daily-practice",
    aliases: [
      { text: "ঘুমের দোয়া", locale: "bn", isRomanized: false },
      { text: "ঘুমানোর দোয়া", locale: "bn", isRomanized: false },
      { text: "আয়াতুল কুরসী", locale: "bn", isRomanized: false },
      { text: "ghumer dua", locale: "bn", isRomanized: true },
      { text: "ghumano dua", locale: "bn", isRomanized: true },
      { text: "ayatul kursi", locale: "bn", isRomanized: true },
      { text: "dua before sleep", locale: "en", isRomanized: false },
      { text: "sleep dua", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-sleep-duas", "en-sleep-dua-guide", "bn-sleep-habits"],
    duaIds: ["dua-sleep-trust", "dua-sleep-short", "dua-waking", "dua-ayatul-kursi"],
    sourceIds: ["quran-2-255", "bukhari-6311", "bukhari-6324", "bukhari-2311"],
    isDemo: false,
  },
  {
    id: "cultural-beliefs-vs-evidence",
    slug: "cultural-beliefs-vs-evidence",
    title: { bn: "সংস্কৃতির বিশ্বাস বনাম প্রমাণ", en: "Cultural beliefs versus evidence" },
    summary: {
      bn: "লোকবিশ্বাস ও প্রামাণ্য সূত্রের পার্থক্য, এবং কেন দুটিকে আলাদা রাখা জরুরি।",
      en: "Why folk belief and authenticated sources are kept separate, and how to tell them apart.",
    },
    categoryId: "sources-scholarship",
    aliases: [
      { text: "সংস্কৃতি", locale: "bn", isRomanized: false },
      { text: "লোকবিশ্বাস", locale: "bn", isRomanized: false },
      { text: "kuhok", locale: "bn", isRomanized: true },
      { text: "cultural dream beliefs", locale: "en", isRomanized: false },
      { text: "dream superstition", locale: "en", isRomanized: false },
    ],
    articleIds: ["bn-culture", "bn-scholarship"],
    duaIds: [],
    sourceIds: ["cultural-dream-beliefs", "scholarly-review-pending", "editorial-policy"],
    isDemo: false,
  },
];
