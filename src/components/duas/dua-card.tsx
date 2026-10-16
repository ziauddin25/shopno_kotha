import { ExternalLink } from "lucide-react";
import { VerificationBadge } from "@/components/common/verification-badge";
import { getMessages } from "@/messages";
import { sourceTypeLabel } from "@/lib/source-labels";
import type { Dua, Locale, SourceReference } from "@/types";

export function DuaCard({
  dua,
  locale,
  sourceMap,
}: {
  dua: Dua;
  locale: Locale;
  sourceMap: Record<string, SourceReference>;
}) {
  const m = getMessages(locale);
  const sources = dua.sourceIds
    .map((id) => sourceMap[id])
    .filter((source): source is SourceReference => Boolean(source));

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge
            status={dua.verification}
            labels={{
              checked: m.common.verificationChecked,
              pending: m.common.verificationPending,
              demo: m.common.verificationDemo,
            }}
          />
          {dua.translationIsEditorial ? (
            <span className="text-xs text-muted-foreground">{m.common.editorialNote}</span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {dua.title[locale]}
        </h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">{m.duas.occasionLabel}: </span>
          {dua.occasion[locale]}
        </p>
      </header>

      <div className="rounded-xl border border-gold/25 bg-gold-soft/40 px-5 py-4">
        <p className="arabic-text text-xl text-foreground sm:text-[1.65rem]">{dua.arabic}</p>
      </div>

      {dua.transliteration ? (
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {m.duas.transliterationLabel}
          </p>
          <p className="text-sm text-muted-foreground italic">{dua.transliteration}</p>
        </div>
      ) : null}

      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {m.duas.meaningLabel}
        </p>
        <p className="text-pretty text-[0.98rem] leading-[1.8] text-foreground/90">
          {dua.translation[locale]}
        </p>
      </div>

      <footer className="mt-auto space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        {sources.length > 0 ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-foreground/80">{m.duas.sourceLabel}:</span>
            {sources.map((source) => (
              <span key={source.id} className="inline-flex items-center gap-1">
                <span className="sr-only">{sourceTypeLabel(m, source.type)}</span>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest underline decoration-dotted underline-offset-3"
                  >
                    {source.citation ?? source.title[locale]}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  <span>{source.citation ?? source.title[locale]}</span>
                )}
              </span>
            ))}
          </p>
        ) : null}
        <p>
          {dua.verification === "checked" ? m.duas.verifiedNote : m.duas.pendingNote}
        </p>
        {dua.translationIsEditorial ? <p>{m.duas.editorialMeaningNote}</p> : null}
      </footer>
    </article>
  );
}
