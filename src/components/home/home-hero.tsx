import Link from "next/link";
import { ArrowRight, BookOpen, Moon, ShieldCheck } from "lucide-react";
import { RotatingDreamCard } from "@/components/home/rotating-dream-card";
import { localizePath } from "@/lib/i18n";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export function HomeHero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const guidanceHref = localizePath(locale, "/dream-guidance");
  const searchHref = localizePath(locale, "/search");

  const points = [
    { icon: BookOpen, label: m.home.trustPoints[0].title },
    { icon: ShieldCheck, label: m.home.trustPoints[1].title },
    { icon: Moon, label: m.home.trustPoints[2].title },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-background via-sage/75 to-gold-soft text-foreground">
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/hero-islamic.svg')] bg-cover bg-center opacity-20 mix-blend-multiply" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background/85 via-sage/55 to-gold-soft/35" />
      <div aria-hidden="true" className="absolute -left-28 top-0 size-96 rounded-full bg-sage/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-[-10rem] size-[32rem] rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-background/75 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-forest uppercase shadow-xs">
              <Moon className="size-4" aria-hidden />
              {m.home.heroEyebrow}
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {m.home.heroTitle}
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              {m.home.heroDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={guidanceHref} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-md shadow-forest/15 transition hover:bg-forest/90">
              {locale === "bn" ? "নির্দেশিকা দেখুন" : "Explore the guidance"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href={searchHref} className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-forest/20 bg-background/70 px-6 py-3 text-sm font-semibold text-forest transition hover:bg-background">
              {locale === "bn" ? "প্রবন্ধ খুঁজুন" : "Search articles"}
            </Link>
          </div>

          <ul className="flex flex-wrap gap-2.5 text-xs text-foreground/75 sm:text-sm">
            {points.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-background/70 px-3.5 py-2.5 shadow-xs">
                <Icon className="size-4 text-gold" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <RotatingDreamCard
          locale={locale}
          title={m.home.sampleDreamLabel}
          dreams={m.home.dreamSamples}
        />
      </div>
    </section>
  );
}
