import type { Article, DreamEvidenceTier, DreamTopic, Dua, Locale, SourceReference } from "@/types";
import { dreamTopicRepository, duaRepository, sourceRepository } from "@/lib/repositories";
import { getArticlesByIds } from "@/lib/repositories/article-repository";
import { rankDreamTopics } from "@/lib/dream/ranking";

export interface DreamTopicMatch {
  topic: DreamTopic;
  score: number;
  /** The alias (or title) text the query matched most strongly, for transparency. */
  matchedOn: string;
  articles: Article[];
  duas: Dua[];
  sources: SourceReference[];
  evidenceTier: DreamEvidenceTier;
}

export interface DreamSearchResult {
  query: string;
  normalizedQuery: string;
  total: number;
  matches: DreamTopicMatch[];
}

function evidenceTier(sources: SourceReference[]): DreamEvidenceTier {
  if (sources.some((source) => source.type === "quran" || source.type === "hadith")) {
    return "scripture";
  }
  if (sources.some((source) => source.type === "scholarly")) return "scholarly";
  return "educational";
}

/** Every published topic, for the browse view when no query has been entered. */
export async function getDreamTopicCatalog(): Promise<DreamTopic[]> {
  return dreamTopicRepository.getPublishedDreamTopics();
}

/**
 * Matches a free-text dream description against published dream topics and
 * hydrates each match with the articles, duas and evidence sources it links to.
 *
 * Matching is deliberately conservative (see `rankDreamTopics`): an unrecognised
 * description returns no matches rather than a guess.
 */
export async function searchDreams(input: { query?: string; locale?: Locale }): Promise<DreamSearchResult> {
  const query = (input.query ?? "").slice(0, 200);
  const topics = await dreamTopicRepository.getPublishedDreamTopics();
  const { normalizedQuery, matches: ranked } = rankDreamTopics(topics, query);

  if (ranked.length === 0) {
    return { query, normalizedQuery, total: 0, matches: [] };
  }

  const articleIds = [...new Set(ranked.flatMap((entry) => entry.topic.articleIds))];
  const duaIds = [...new Set(ranked.flatMap((entry) => entry.topic.duaIds))];

  const [articles, duas] = await Promise.all([
    getArticlesByIds(articleIds),
    duaRepository.getDuasByIds(duaIds),
  ]);

  // A dua's own citations are fetched too, so the rendered dua card is never
  // stripped of its source just because the topic linked a different one.
  const sourceIds = [
    ...new Set([
      ...ranked.flatMap((entry) => entry.topic.sourceIds),
      ...duas.flatMap((dua) => dua.sourceIds),
    ]),
  ];
  const sources = await sourceRepository.getSourcesByIds(sourceIds);

  const articleMap = new Map(articles.map((article) => [article.id, article]));
  const duaMap = new Map(duas.map((dua) => [dua.id, dua]));
  const sourceMap = new Map(sources.map((source) => [source.id, source]));

  const matches: DreamTopicMatch[] = ranked.map((entry) => {
    const topicSources = entry.topic.sourceIds
      .map((id) => sourceMap.get(id))
      .filter((source): source is SourceReference => Boolean(source));

    return {
      topic: entry.topic,
      score: entry.score,
      matchedOn: entry.matchedOn,
      articles: entry.topic.articleIds
        .map((id) => articleMap.get(id))
        .filter((article): article is Article => Boolean(article)),
      duas: entry.topic.duaIds
        .map((id) => duaMap.get(id))
        .filter((dua): dua is Dua => Boolean(dua)),
      sources: topicSources,
      evidenceTier: evidenceTier(topicSources),
    };
  });

  return { query, normalizedQuery, total: matches.length, matches };
}
