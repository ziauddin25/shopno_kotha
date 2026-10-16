import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Hind_Siliguri, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { htmlLang, isLocale, locales, ogLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";
import "../globals.css";

const bengali = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const latin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const m = getMessages(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.meta.siteNameFull,
      template: `%s | ${m.meta.siteName}`,
    },
    description: m.meta.description,
    applicationName: m.meta.siteName,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        bn: "/bn",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: m.meta.siteName,
      title: m.meta.siteNameFull,
      description: m.meta.description,
      locale: ogLocale(locale),
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: m.meta.siteNameFull,
      description: m.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f6",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const m = getMessages(locale as Locale);

  return (
    <html
      lang={htmlLang(locale)}
      className={cn(bengali.variable, latin.variable, arabic.variable)}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground antialiased",
          locale === "bn" ? "font-bn" : "font-en",
        )}
      >
        <a href="#main-content" className="skip-link">
          {m.nav.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content" className="min-h-[60dvh]">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
