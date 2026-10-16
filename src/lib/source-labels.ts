import type { Messages } from "@/messages";
import type { SourceType } from "@/types";

const order: SourceType[] = ["quran", "hadith", "scholarly", "cultural", "editorial"];

export function sourceTypeLabel(m: Messages, type: SourceType): string {
  const index = order.indexOf(type);
  return m.sources.types[index]?.title ?? type;
}

export function sourceTypeDescription(m: Messages, type: SourceType): string {
  const index = order.indexOf(type);
  return m.sources.types[index]?.body ?? "";
}
