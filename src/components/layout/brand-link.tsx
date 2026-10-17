import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

export function BrandLink({
  locale,
  tagline,
  className,
  inverse = false,
}: {
  locale: Locale;
  tagline?: string;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <Link
      href={localizePath(locale, "/")}
      className={cn("flex w-fit max-w-full cursor-pointer items-center gap-3 rounded-xl", className)}
    >
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#d8bd78]/60 bg-gradient-to-br from-[#172b4a] via-[#245746] to-[#514368] shadow-md"
      >
        <svg viewBox="0 0 48 48" className="size-11" fill="none">
          <circle cx="24" cy="24" r="21.5" stroke="#E3C77D" strokeOpacity=".45" />
          <path
            d="M10 37V24a14 14 0 0 1 28 0v13"
            stroke="#F1D995"
            strokeOpacity=".9"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="m24 7 1.1 2.25 2.48.36-1.79 1.74.42 2.46L24 12.65l-2.21 1.16.42-2.46-1.79-1.74 2.48-.36L24 7Z"
            fill="#F0D68F"
          />
          <path
            d="M13.5 19.5v13M34.5 19.5v13"
            stroke="#F1D995"
            strokeOpacity=".45"
          />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            fill="#FFF9E9"
            fontFamily="var(--font-bengali), sans-serif"
            fontSize="10.5"
            fontWeight="700"
          >
            স্বপ্ন
          </text>
          <path d="M16 34h16" stroke="#E3C77D" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cn("truncate text-base font-bold tracking-tight sm:text-lg", inverse ? "text-white" : "text-foreground")}>
          {locale === "bn" ? "স্বপ্নকথা" : "Shopno Kotha"}
        </span>
        {tagline ? (
          <span className={cn("hidden truncate text-[0.68rem] font-medium tracking-wide sm:block", inverse ? "text-white/65" : "text-muted-foreground")}>
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
