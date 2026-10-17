/**
 * Shared helpers for the repository layer.
 *
 * Repositories resolve asynchronously so that swapping the fixture dataset for
 * Supabase does not change a single call site. Fixture latency is tiny and
 * exists only to keep loading states honest during development.
 */
import { defaultLocale, type Locale } from "@/types";

export function withLatency<T>(value: T, ms = 12): Promise<T> {
  if (ms <= 0) return Promise.resolve(value);
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : defaultLocale;
}

export function byPublishedDateDesc(a: { publishedAt: string | null }, b: { publishedAt: string | null }) {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

/**
 * A slice of a result set. `page`/`pageSize`/`totalPages` describe the slice so
 * callers can render pagination once the UI needs it; an unbounded query
 * reports the whole set as page 1 of 1.
 */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function normalizePage(page: number | undefined): number {
  if (typeof page !== "number" || !Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

export function toRange(page: number, pageSize: number): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

/** Wraps an already-sliced result (database pagination) in a `PagedResult`. */
export function pagedResult<T>(items: T[], total: number, page?: number, pageSize?: number): PagedResult<T> {
  if (!pageSize || pageSize < 1) {
    return { items, total, page: 1, pageSize: total, totalPages: 1 };
  }
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, page: Math.min(normalizePage(page), totalPages), pageSize, totalPages };
}

/** Slices an in-memory list (fixture pagination) into a `PagedResult`. */
export function paginate<T>(items: T[], page?: number, pageSize?: number): PagedResult<T> {
  const total = items.length;
  if (!pageSize || pageSize < 1) {
    return pagedResult(items, total);
  }
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(normalizePage(page), totalPages);
  const { from, to } = toRange(current, pageSize);
  return { items: items.slice(from, to + 1), total, page: current, pageSize, totalPages };
}

/**
 * Strips PostgREST filter metacharacters from a user search term so it can be
 * interpolated into `.or(...)`: parentheses group conditions, commas separate
 * them and `{}` delimit array literals. Letters include Bengali, so accented and
 * Indic scripts survive; everything structural (`. , ( ) { } " \ : % *`) is
 * replaced with a space.
 */
export function sanitizeSearchTerm(value: string): string {
  return value.replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

/**
 * Renders a sanitized term as a single, quoted Postgres array-literal element
 * for a PostgREST `cs.{...}` filter. Without the quotes a value containing a
 * space (e.g. the Bengali phrase "স্বপ্ন দেখা") is misread as the array grammar;
 * with them it is one element. Inner quotes/backslashes are escaped defensively
 * even though `sanitizeSearchTerm` already removes them.
 */
export function toArrayLiteralElement(term: string): string {
  return `"${term.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Canonical form for dream-search text (Bengali, Banglish or English): Unicode
 * NFKC, lower-cased, punctuation stripped and whitespace collapsed. Mirrors the
 * database's `public.normalize_dream_text`, with the extra punctuation step, so
 * the fixture and Supabase search paths rank the same input the same way.
 */
export function normalizeDreamText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    // Keep letters, combining marks (Bengali vowel signs and hasant), numbers,
    // whitespace and hyphen; drop everything structural.
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Splits normalised text into its non-empty tokens. */
export function toDreamTokens(normalized: string): string[] {
  return normalized.length > 0 ? normalized.split(" ") : [];
}
