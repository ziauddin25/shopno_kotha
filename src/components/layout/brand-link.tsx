import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

export function BrandLink({
  locale,
  tagline,
  className,
}: {
  locale: Locale;
  tagline?: string;
  className?: string;
}) {
  return (
    <Link
      href={localizePath(locale, "/")}
      className={cn("group flex items-center gap-2.5 rounded-lg", className)}
    >
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-lg border border-gold/40 bg-sage text-[0.95rem] font-semibold text-forest"
      >
        স্ব
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[0.98rem] font-semibold tracking-tight text-foreground">
          {locale === "bn" ? "স্বপ্নকথা" : "Shopno Kotha"}
        </span>
        {tagline ? (
          <span className="text-[0.68rem] font-medium tracking-wide text-muted-foreground">
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
