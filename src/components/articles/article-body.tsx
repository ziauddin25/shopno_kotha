import { ExternalLink } from "lucide-react";
import { NoticeBox } from "@/components/common/notice-box";
import { VerificationBadge } from "@/components/common/verification-badge";
import { buildHeadingEntries } from "@/lib/article-content";
import { getMessages } from "@/messages";
import type { ArticleBlock, Locale, SourceReference } from "@/types";
import { cn } from "@/lib/utils";

export function ArticleToc({ blocks, locale }: { blocks: ArticleBlock[]; locale: Locale }) {
  const m = getMessages(locale);
  const headings = buildHeadingEntries(blocks).filter((entry) => entry.level === 2);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label={m.article.toc}
      className="rounded-2xl border border-border bg-card p-5 text-sm shadow-xs"
    >
      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
        {m.article.toc}
      </p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-foreground/75 transition-colors hover:text-forest"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ArabicBlock({
  block,
  locale,
  sourceMap,
}: {
  block: Extract<ArticleBlock, { type: "arabic" }>;
  locale: Locale;
  sourceMap: Record<string, SourceReference>;
}) {
  const m = getMessages(locale);
  const source = block.sourceId ? sourceMap[block.sourceId] : undefined;

  return (
    <figure className="space-y-3 rounded-xl border border-border bg-sage/40 p-5">
      <p className="arabic-text text-xl text-foreground sm:text-[1.6rem]">{block.text}</p>
      {block.transliteration ? (
        <p className="text-sm text-muted-foreground italic">{block.transliteration}</p>
      ) : null}
      {block.translation ? (
        <p className="text-pretty text-sm leading-relaxed text-foreground/90">
          {block.translation}
        </p>
      ) : null}
      {source ? (
        <figcaption className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <VerificationBadge
            status={source.verification}
            labels={{
              checked: m.common.verificationChecked,
              pending: m.common.verificationPending,
              demo: m.common.verificationDemo,
            }}
          />
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-3 hover:text-forest"
            >
              {source.citation ?? source.title[locale]}
              <ExternalLink className="size-3" aria-hidden />
            </a>
          ) : (
            <span>{source.citation ?? source.title[locale]}</span>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ArticleBody({
  blocks,
  locale,
  sourceMap,
  className,
}: {
  blocks: ArticleBlock[];
  locale: Locale;
  sourceMap: Record<string, SourceReference>;
  className?: string;
}) {
  const m = getMessages(locale);
  const headings = buildHeadingEntries(blocks);
  const headingEntries = new Map(headings.map((heading) => [heading.blockIndex, heading]));

  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const entry = headingEntries.get(index);
            const id = entry?.id;
            if (block.level === 3) {
              return (
                <h3
                  key={index}
                  id={id}
                  className="scroll-mt-24 pt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
                >
                  {block.text}
                </h3>
              );
            }
            return (
              <h2
                key={index}
                id={id}
                className="scroll-mt-24 pt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                {block.text}
              </h2>
            );
          }
          case "list":
            return block.ordered ? (
              <ol
                key={index}
                className="list-decimal space-y-3 pl-5 text-pretty text-base leading-[1.9] text-foreground/90 marker:text-forest sm:text-lg"
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={index}
                className="list-disc space-y-3 pl-5 text-pretty text-base leading-[1.9] text-foreground/90 marker:text-forest sm:text-lg"
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="rounded-r-xl border-l-3 border-gold/60 bg-gold-soft/60 px-5 py-4"
              >
                <p className="text-pretty text-base leading-[1.9] text-foreground/90 italic sm:text-lg">
                  {block.text}
                </p>
                {block.attribution ? (
                  <footer className="mt-2 text-xs text-muted-foreground">
                    — {block.attribution}
                  </footer>
                ) : null}
              </blockquote>
            );
          case "arabic":
            return <ArabicBlock key={index} block={block} locale={locale} sourceMap={sourceMap} />;
          case "note":
            return (
              <NoticeBox key={index} tone="info" title={m.common.editorialNote}>
                {block.text}
              </NoticeBox>
            );
          default:
            return (
              <p key={index} className="prose-editorial text-pretty">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
