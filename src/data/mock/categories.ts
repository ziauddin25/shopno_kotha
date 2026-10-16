import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "dream-types",
    slug: "dream-types",
    icon: "Layers",
    order: 1,
    title: { bn: "স্বপ্নের ধরন", en: "Dream types" },
    description: {
      bn: "ইসলামি সূত্রমতে স্বপ্নের শ্রেণি ও তাদের পার্থক্য।",
      en: "Categories of dreams in Islamic sources and how they differ.",
    },
  },
  {
    id: "peaceful-dreams",
    slug: "peaceful-dreams",
    icon: "Moon",
    order: 2,
    title: { bn: "শান্ত ও আনন্দদায়ক স্বপ্ন", en: "Pleasant dreams" },
    description: {
      bn: "সুন্দর স্বপ্নের পর কৃতজ্ঞতা, বিনয় ও আচরণবিধি।",
      en: "Gratitude, humility and etiquette after a good dream.",
    },
  },
  {
    id: "disturbing-dreams",
    slug: "disturbing-dreams",
    icon: "ShieldAlert",
    order: 3,
    title: { bn: "ত্রাসময় স্বপ্ন", en: "Disturbing dreams" },
    description: {
      bn: "ভয়ের স্বপ্নের পর শান্তি ও নিরাপত্তার প্রমাণভিত্তিক পদক্ষেপ।",
      en: "Evidence-based steps toward calm after a frightening dream.",
    },
  },
  {
    id: "daily-practice",
    slug: "daily-practice",
    icon: "Sunrise",
    order: 4,
    title: { bn: "দৈনন্দিন আমল", en: "Daily practice" },
    description: {
      bn: "ঘুম, নামাজ ও দোয়া — স্বপ্নশিক্ষার সঙ্গে যুক্ত দৈনন্দিন অভ্যাস।",
      en: "Sleep, prayer and dua — daily habits connected to dream education.",
    },
  },
  {
    id: "interpretation-ethics",
    slug: "interpretation-ethics",
    icon: "Scale",
    order: 5,
    title: { bn: "ব্যাখ্যার সীমা ও নীতি", en: "Limits & ethics" },
    description: {
      bn: "ব্যাখ্যা কোথায় থামে এবং সাংস্কৃতিক বিশ্বাসকে কোনোভাবেই প্রমাণ ধরা যায় না।",
      en: "Where interpretation stops, and why cultural belief is not treated as proof.",
    },
  },
  {
    id: "sources-scholarship",
    slug: "sources-scholarship",
    icon: "Library",
    order: 6,
    title: { bn: "সূত্র ও পাণ্ডিত্য", en: "Sources & scholarship" },
    description: {
      bn: "হাদিস-কুরআনের সূত্র যাচাই এবং পাণ্ডিত্য পর্যালোচনার ব্যাপারে।",
      en: "How hadith and Quran citations are checked, and how scholarly review works.",
    },
  },
];
