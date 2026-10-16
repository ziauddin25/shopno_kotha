import { sources as mockSources } from "@/data/mock/sources";
import type { SourceReference } from "@/types";
import { withLatency } from "./shared";

const dataset = [...mockSources];

export async function getAllSources(): Promise<SourceReference[]> {
  return withLatency([...dataset]);
}

export async function getSourcesByIds(ids: string[]): Promise<SourceReference[]> {
  const found = ids
    .map((id) => dataset.find((source) => source.id === id))
    .filter((source): source is SourceReference => Boolean(source));
  return withLatency(found);
}

export function getSourceMapSync(): Record<string, SourceReference> {
  return Object.fromEntries(dataset.map((source) => [source.id, source]));
}
