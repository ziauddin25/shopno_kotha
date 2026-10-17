"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import { getMessages } from "@/messages";
import { defaultLocale, locales, type Locale } from "@/types";

/**
 * Segment-level error boundary.
 *
 * A failed database request in the service layer reaches the reader as this
 * message instead of a stack trace, and the reset button re-runs the render.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = locales.includes(params?.locale as Locale)
    ? (params?.locale as Locale)
    : defaultLocale;
  const m = getMessages(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {m.error.title}
        </h1>
        <p className="text-pretty text-sm text-muted-foreground sm:text-base">
          {m.error.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset} variant="outline" size="sm">
          <RotateCcw className="size-4" aria-hidden />
          {m.error.retry}
        </Button>
        <Button asChild size="sm">
          <Link href={localizePath(locale, "/")}>
            <Home className="size-4" aria-hidden />
            {m.error.home}
          </Link>
        </Button>
      </div>
    </div>
  );
}
