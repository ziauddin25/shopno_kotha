"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
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
  const targetOption = options.find((option) => option.value !== locale);

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

  if (!targetOption) return null;

  return (
    <Link
      href={swapLocaleInPath(pathname, targetOption.value)}
      hrefLang={targetOption.value}
      lang={targetOption.value}
      aria-label={`${label}: ${targetOption.label}`}
      onClick={handleClick(targetOption.value)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
        variant === "full" && "w-full py-2.5 text-base",
      )}
    >
      <Globe className="size-4 shrink-0" aria-hidden />
      <span>{targetOption.label}</span>
    </Link>
  );
}
