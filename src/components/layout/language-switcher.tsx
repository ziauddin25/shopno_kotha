"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { swapLocaleInPath } from "@/lib/i18n";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

export interface LanguageOption {
  value: Locale;
  label: string;
  short: string;
}

export function LanguageSwitcher({
  locale,
  label,
  options,
  variant = "compact",
  onNavigate,
}: {
  locale: Locale;
  label: string;
  options: LanguageOption[];
  variant?: "compact" | "full";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (target: Locale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === locale) {
      event.preventDefault();
      return;
    }
    const search = window.location.search;
    if (!search) return;
    event.preventDefault();
    router.push(`${swapLocaleInPath(pathname, target)}${search}${window.location.hash}`);
    onNavigate?.();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border bg-card/70 p-0.5",
        variant === "full" && "w-full justify-between",
      )}
      role="group"
      aria-label={label}
    >
      <Languages className="ml-1.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      {options.map((option) => {
        const isActive = option.value === locale;
        return (
          <Link
            key={option.value}
            href={swapLocaleInPath(pathname, option.value)}
            hrefLang={option.value}
            lang={option.value}
            aria-current={isActive ? "true" : undefined}
            onClick={handleClick(option.value)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              variant === "full" && "flex-1 text-center text-sm",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
            )}
          >
            {variant === "full" ? option.label : option.short}
          </Link>
        );
      })}
    </div>
  );
}
