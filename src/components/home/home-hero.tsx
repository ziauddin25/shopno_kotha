import Link from "next/link";
import { BookOpen, Moon, ShieldCheck } from "lucide-react";
import { SearchBox } from "@/components/search/search-box";
import { localizePath } from "@/lib/i18n";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export function HomeHero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const searchHref = localizePath(locale, "/search");

  const points = [
    { icon: BookOpen, label: m.home.trustPoints[0].title },
    { icon: ShieldCheck, label: m.home.trustPoints[1].title },
    { icon: Moon, label: m.home.trustPoints[2].title },
  ];

  return (
    <section className="border-b border-border/70 bg-sage/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {m.home.heroEyebrow}
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {m.home.heroTitle}
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {m.home.heroDescription}
          </p>
        </div>

        <div className="max-w-2xl space-y-4">
          <SearchBox
            action={searchHref}
            placeholder={m.home.searchPlaceholder}
            submitLabel={m.home.searchSubmit}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {m.home.suggestedLabel}:
            </span>
            {m.home.suggestedSearches.map((term) => (
              <Link
                key={term}
                href={`${searchHref}?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/75 transition-colors hover:border-forest/30 hover:text-forest"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
          {points.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2">
              <Icon className="size-4 text-forest" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
