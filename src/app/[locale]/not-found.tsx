import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import { buildNavLinkMap, navLabelsFrom } from "@/lib/navigation";
import { getMessages } from "@/messages";
import { defaultLocale } from "@/types";

export default function LocaleNotFound() {
  const locale = defaultLocale;
  const m = getMessages(locale);
  const map = buildNavLinkMap(locale, navLabelsFrom(m));

  const suggestions = [map.dreamGuidance, map.islamicDreams, map.duas, map.sources];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
      <span className="flex size-12 items-center justify-center rounded-full bg-sage text-forest">
        <Compass className="size-6" aria-hidden />
      </span>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{m.notFound.title}</h1>
        <p className="text-pretty text-sm text-muted-foreground sm:text-base">
          {m.notFound.description}
        </p>
      </div>
      <Button asChild>
        <Link href={localizePath(locale, "/")}>
          <Home className="size-4" aria-hidden />
          {m.common.backHome}
        </Link>
      </Button>
      <div className="w-full space-y-3 border-t border-border/70 pt-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {m.notFound.suggestions}
        </p>
        <ul className="flex flex-wrap justify-center gap-2 text-sm">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-foreground/80 transition-colors hover:border-forest/30 hover:text-forest"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
