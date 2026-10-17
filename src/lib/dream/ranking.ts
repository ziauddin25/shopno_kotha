import type { DreamTopic } from "@/types";
import { normalizeDreamText, toDreamTokens } from "@/lib/repositories/shared";

/** Below this score a topic is not a confident match and is left out. */
export const DREAM_MATCH_MIN_SCORE = 0.55;
/** Upper bound on matches returned per query. */
export const DREAM_MATCH_MAX = 4;

export interface ScoredTopic {
  topic: DreamTopic;
  score: number;
  /** The alias (or title) text that matched most strongly, for transparency. */
  matchedOn: string;
}

export interface DreamRanking {
  normalizedQuery: string;
  matches: ScoredTopic[];
}

/** Sørensen–Dice coefficient over character bigrams — script-agnostic fuzzy match. */
function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigrams = (value: string) => {
    const counts = new Map<string, number>();
    for (let i = 0; i < value.length - 1; i += 1) {
      const gram = value.slice(i, i + 2);
      counts.set(gram, (counts.get(gram) ?? 0) + 1);
    }
    return counts;
  };

  const left = bigrams(a);
  const right = bigrams(b);
  let intersection = 0;
  for (const [gram, count] of left) {
    const other = right.get(gram);
    if (other) intersection += Math.min(count, other);
  }

  const total = a.length - 1 + (b.length - 1);
  return total === 0 ? 0 : (2 * intersection) / total;
}

function tokenScore(queryTokens: string[], candidateTokens: string[]): number {
  if (queryTokens.length === 0 || candidateTokens.length === 0) return 0;

  const candidateSet = new Set(candidateTokens);
  const querySet = new Set(queryTokens);

  // Every word the reader typed appears somewhere in the candidate.
  if (queryTokens.every((token) => candidateSet.has(token))) return 0.78;
  // The candidate's own words are all present in what the reader typed.
  if (candidateTokens.every((token) => querySet.has(token))) return 0.74;

  const intersection = new Set(queryTokens.filter((token) => candidateSet.has(token))).size;
  const union = new Set([...queryTokens, ...candidateTokens]).size;
  return union === 0 ? 0 : 0.5 * (intersection / union);
}

/** Scores one normalised candidate against the normalised query. */
function scoreCandidate(normalizedQuery: string, queryTokens: string[], candidate: string): number {
  const normalizedCandidate = normalizeDreamText(candidate);
  if (!normalizedCandidate) return 0;
  if (normalizedCandidate === normalizedQuery) return 1;
  if (normalizedCandidate.startsWith(normalizedQuery) || normalizedQuery.startsWith(normalizedCandidate)) {
    return 0.9;
  }

  const candidateTokens = toDreamTokens(normalizedCandidate);
  const tokens = tokenScore(queryTokens, candidateTokens);
  if (normalizedCandidate.includes(normalizedQuery)) return Math.max(0.68, tokens);

  return Math.max(tokens, diceCoefficient(normalizedQuery, normalizedCandidate) * 0.7);
}

/**
 * Best score for a topic across its aliases and both title forms. Titles count
 * because a reader may type the page's own name; they score the same as an
 * alias so no hidden ranking favouritism is introduced.
 */
export function scoreTopic(topic: DreamTopic, normalizedQuery: string, queryTokens: string[]): ScoredTopic {
  const candidates = [
    ...topic.aliases.map((alias) => alias.text),
    topic.title.bn,
    topic.title.en,
  ];

  let best: ScoredTopic = { topic, score: 0, matchedOn: "" };
  for (const candidate of candidates) {
    const score = scoreCandidate(normalizedQuery, queryTokens, candidate);
    if (score > best.score) best = { topic, score, matchedOn: candidate };
  }
  return best;
}

/**
 * Ranks published topics against a free-text query. Conservative by design: an
 * unrecognised description returns an empty list rather than a guess, so the UI
 * can say "we do not have this yet" instead of inventing an interpretation.
 */
export function rankDreamTopics(topics: DreamTopic[], query: string): DreamRanking {
  const normalizedQuery = normalizeDreamText(query.slice(0, 200));
  if (!normalizedQuery) return { normalizedQuery: "", matches: [] };

  const queryTokens = toDreamTokens(normalizedQuery);
  const matches = topics
    .map((topic) => scoreTopic(topic, normalizedQuery, queryTokens))
    .filter((entry) => entry.score >= DREAM_MATCH_MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, DREAM_MATCH_MAX);

  return { normalizedQuery, matches };
}
