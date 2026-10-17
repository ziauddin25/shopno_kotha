import type { ArticleBlock } from "@/types";

export interface HeadingEntry {
  id: string;
  text: string;
  level: 2 | 3;
  blockIndex: number;
}

export function headingId(text: string, index: number): string {
  const base = text
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `section-${index}${base ? `-${base}` : ""}`;
}

/**
 * Produces stable heading ids so the table of contents and the rendered body
 * always agree, regardless of the script (Bengali headings included).
 */
export function buildHeadingEntries(blocks: ArticleBlock[]): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  let headingIndex = 0;

  for (const [blockIndex, block] of blocks.entries()) {
    if (block.type === "heading") {
      entries.push({
        id: headingId(block.text, headingIndex),
        text: block.text,
        level: block.level,
        blockIndex,
      });
      headingIndex += 1;
    }
  }

  return entries;
}
