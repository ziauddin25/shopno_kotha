import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/common/verification-badge";
import { sourceTypeLabel } from "@/lib/source-labels";
import { getMessages } from "@/messages";
import type { Locale, SourceReference } from "@/types";

export function SourceReferenceCard({
  source,
  locale,
}: {
  source: SourceReference;
  locale: Locale;
}) {
  const m = getMessages(locale);

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-full bg-sage text-forest">
          {sourceTypeLabel(m, source.type)}
        </Badge>
        <VerificationBadge
          status={source.verification}
          labels={{
            checked: m.common.verificationChecked,
            pending: m.common.verificationPending,
            demo: m.common.verificationDemo,
          }}
        />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {source.title[locale]}
      </h3>

      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {source.note[locale]}
      </p>

      <div className="mt-auto pt-1 text-xs">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-forest underline decoration-dotted underline-offset-3"
          >
            {source.citation ?? source.url}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : (
          <span className="text-muted-foreground">
            {source.citation ?? m.article.referencePending}
          </span>
        )}
      </div>
    </article>
  );
}
