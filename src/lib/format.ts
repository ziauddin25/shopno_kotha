import type { Locale } from "@/types";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatNumber(value: number, locale: Locale): string {
  if (locale === "en") return new Intl.NumberFormat("en-GB").format(value);
  return String(value).replace(/\d/g, (digit) => bengaliDigits[Number(digit)]);
}

export function formatDate(iso: string | null, locale: Locale): string | null {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;

  if (locale === "en") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${day} ${months[month - 1]} ${year}`;
  }

  const bnMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  return `${formatNumber(day, locale)} ${bnMonths[month - 1]} ${formatNumber(year, locale)}`;
}
