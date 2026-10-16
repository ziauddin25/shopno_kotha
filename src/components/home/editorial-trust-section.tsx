import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export function EditorialTrustSection({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  return (
    <section className="rounded-2xl border border-border bg-sage/40 p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="space-y-4">
          <span className="flex size-10 items-center justify-center rounded-lg bg-card text-forest">
            <FileCheck2 className="size-5" aria-hidden />
          </span>
          <h2 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {m.home.trustTitle}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {m.home.trustDescription}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={localizePath(locale, "/sources")}>
              {m.home.trustCta}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <ul className="space-y-4">
          {m.home.trustPoints.map((point, index) => (
            <li key={point.title} className="flex gap-4 rounded-xl bg-card p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-semibold text-forest">
                {index + 1}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{point.title}</p>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
