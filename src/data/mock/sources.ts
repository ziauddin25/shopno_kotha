import type { SourceReference } from "@/types";

/**
 * Phase 1 demo dataset.
 * Entries with verification "checked" were matched against the linked public
 * source (sunnah.com / Quran data API) during authoring. Entries marked
 * "pending" or "demo" are placeholders and must not be quoted as scripture.
 */
export const sources: SourceReference[] = [
  {
    id: "quran-2-255",
    title: {
      bn: "সূরা আল-বাকারা ২:২৫৫ — আয়াতুল কুরসী",
      en: "Al-Baqara 2:255 — Ayat al-Kursi",
    },
    type: "quran",
    citation: "Quran 2:255",
    url: "https://quran.com/2/255",
    note: {
      bn: "কুরসীর এই আয়াতের পাঠ উসমানী রেখত (quran-uthmani) থেকে নেওয়া এবং সূরা-আয়াত নম্বর মিলিয়ে দেখা হয়েছে।",
      en: "Text taken from the Uthmani script and cross-checked with surah/ayah numbering.",
    },
    verification: "checked",
  },
  {
    id: "bukhari-6984",
    title: { bn: "সহিহ বুখারি ৬৯৮৪", en: "Sahih al-Bukhari 6984" },
    type: "hadith",
    citation: "Sahih al-Bukhari 6984",
    url: "https://sunnah.com/bukhari:6984",
    note: {
      bn: "“রূইয়া আল্লাহর কাছ থেকে এবং হলম শয়তানের কাছ থেকে।”",
      en: "“A true good dream is from Allah, and a bad dream is from Satan.”",
    },
    verification: "checked",
  },
  {
    id: "bukhari-6986",
    title: { bn: "সহিহ বুখারি ৬৯৮৬", en: "Sahih al-Bukhari 6986" },
    type: "hadith",
    citation: "Sahih al-Bukhari 6986",
    url: "https://sunnah.com/bukhari:6986",
    note: {
      bn: "অপ্রিয় স্বপ্ন দেখলে শয়তান থেকে আশ্রয় চাওয়া ও বাঁ দিকে ফুঁ দেওয়ার নির্দেশ।",
      en: "Instruction to seek refuge from Satan and spit to the left after a bad dream.",
    },
    verification: "checked",
  },
  {
    id: "bukhari-6987",
    title: { bn: "সহিহ বুখারি ৬৯৮৭", en: "Sahih al-Bukhari 6987" },
    type: "hadith",
    citation: "Sahih al-Bukhari 6987",
    url: "https://sunnah.com/bukhari:6987",
    note: {
      bn: "“মু‘মিনের স্বপ্ন নবুয়তের ছেচল্লিশ ভাগের এক ভাগ।”",
      en: "“The dream of a believer is one of the forty-six parts of prophethood.”",
    },
    verification: "checked",
  },
  {
    id: "muslim-2261a",
    title: { bn: "সহিহ মুসলিম ২২৬১ক", en: "Sahih Muslim 2261a" },
    type: "hadith",
    citation: "Sahih Muslim 2261a",
    url: "https://sunnah.com/muslim:2261",
    note: {
      bn: "অপ্রিয় স্বপ্নের পর বাঁ দিকে তিনবার ফুঁ দিয়ে আশ্রয় চাওয়ার বর্ণনা।",
      en: "Spitting three times to the left and seeking refuge after an unwanted dream.",
    },
    verification: "checked",
  },
  {
    id: "ibn-majah-3906",
    title: { bn: "সুনান ইবনে মাজাহ ৩৯০৬", en: "Sunan Ibn Majah 3906" },
    type: "hadith",
    citation: "Sunan Ibn Majah 3906",
    url: "https://sunnah.com/ibnmajah:3906",
    note: {
      bn: "“স্বপ্ন তিন প্রকার — আল্লাহর কাছ থেকে সুসংবাদ, মনের আলাপ এবং শয়তানের কাছ থেকে ভয়।”",
      en: "“Dreams are of three types: glad tidings from Allah, what is on a person’s mind, and frightening dreams from Satan.”",
    },
    verification: "checked",
  },
  {
    id: "bukhari-6311",
    title: { bn: "সহিহ বুখারি ৬৩১১", en: "Sahih al-Bukhari 6311" },
    type: "hadith",
    citation: "Sahih al-Bukhari 6311",
    url: "https://sunnah.com/bukhari:6311",
    note: {
      bn: "ঘুমানোর আগে ওজুসহ ডান কাত হয়ে আত্মসমর্পণের দোয়া।",
      en: "The entrusting dua said lying on the right side, with ablution, before sleep.",
    },
    verification: "checked",
  },
  {
    id: "bukhari-6324",
    title: { bn: "সহিহ বুখারি ৬৩২৪", en: "Sahih al-Bukhari 6324" },
    type: "hadith",
    citation: "Sahih al-Bukhari 6324",
    url: "https://sunnah.com/bukhari:6324",
    note: {
      bn: "ঘুমানোর সময় ও জেগে ওঠার সময়ের ছোট প্রার্থনা।",
      en: "The short recitations said when going to sleep and when waking up.",
    },
    verification: "checked",
  },
  {
    id: "bukhari-2311",
    title: { bn: "সহিহ বুখারি ২৩১১", en: "Sahih al-Bukhari 2311" },
    type: "hadith",
    citation: "Sahih al-Bukhari 2311",
    url: "https://sunnah.com/bukhari:2311",
    note: {
      bn: "ঘুমের আগে আয়াতুল কুরসী পড়লে ভোর পর্যন্ত আল্লাহর হিফাজতে থাকার বর্ণনা।",
      en: "Reciting Ayat al-Kursi before sleep is described as keeping Allah’s protection until morning.",
    },
    verification: "checked",
  },
  {
    id: "editorial-policy",
    title: {
      bn: "স্বপ্নকথা — সম্পাদকীয় নীতিমালা",
      en: "Shopno Kotha — editorial policy",
    },
    type: "editorial",
    citation: null,
    url: null,
    note: {
      bn: "এই সাইটের নিজস্ব প্রকাশনা নীতি — ধর্মীয় দাবি নয়।",
      en: "The site’s own publishing policy — not a religious claim.",
    },
    verification: "checked",
  },
  {
    id: "scholarly-review-pending",
    title: {
      bn: "পাণ্ডিত্য পর্যালোচনার সংকলন",
      en: "Scholarly review compilation",
    },
    type: "scholarly",
    citation: null,
    url: null,
    note: {
      bn: "অনুমোদিত আলেমের লিখিত পর্যালোচনা ও গবেষণাপত্রের তালিকা সংকলন চলছে — ফেজ ২-এ যুক্ত হবে।",
      en: "A list of approved scholarly reviews and research papers is being compiled — added in Phase 2.",
    },
    verification: "pending",
  },
  {
    id: "cultural-dream-beliefs",
    title: {
      bn: "জনপ্রচলিত সাংস্কৃতিক স্বপ্ন-বিশ্বাস",
      en: "Common cultural dream beliefs",
    },
    type: "cultural",
    citation: null,
    url: null,
    note: {
      bn: "লোকজ বিশ্বাসগুলো কেবল প্রেক্ষাপট হিসেবে উল্লেখ করা হয় — প্রমাণ হিসেবে নয়।",
      en: "Folk beliefs are mentioned as context only — never as proof.",
    },
    verification: "demo",
  },
];
