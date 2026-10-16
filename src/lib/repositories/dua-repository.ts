import { duas as mockDuas } from "@/data/mock/duas";
import type { Dua } from "@/types";
import { withLatency } from "./shared";

const dataset = [...mockDuas];

export async function getAllDuas(): Promise<Dua[]> {
  return withLatency([...dataset]);
}

export async function getDuaBySlug(slug: string): Promise<Dua | null> {
  const dua = dataset.find((item) => item.slug === slug) ?? null;
  return withLatency(dua);
}
