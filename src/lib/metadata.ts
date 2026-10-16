import type { Metadata } from "next";
import type { Locale } from "@/types";

export function pageMetadata({
  locale,
  title,
  description,
  path = "",
  type = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        bn: `/bn${path}`,
        en: `/en${path}`,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
