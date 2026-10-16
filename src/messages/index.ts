import type { Locale } from "@/types";
import { bn, type Messages } from "./bn";
import { en } from "./en";

const dictionaries: Record<Locale, Messages> = { bn, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.bn;
}

export type { Messages };
