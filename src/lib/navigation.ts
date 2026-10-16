import { localizePath } from "@/lib/i18n";
import type { Messages } from "@/messages";
import type { Locale } from "@/types";

export interface NavItem {
  href: string;
  labelKey:
    | "home"
    | "dreamGuidance"
    | "islamicDreams"
    | "duas"
    | "categories"
    | "about"
    | "sources"
    | "contact";
}

const items: NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/dream-guidance", labelKey: "dreamGuidance" },
  { href: "/islamic-dreams", labelKey: "islamicDreams" },
  { href: "/duas", labelKey: "duas" },
  { href: "/categories", labelKey: "categories" },
  { href: "/about", labelKey: "about" },
  { href: "/sources", labelKey: "sources" },
  { href: "/contact", labelKey: "contact" },
];

export const navItems = items;

export type NavLabels = Record<NavItem["labelKey"], string>;

export function navLabelsFrom(m: Messages): NavLabels {
  return {
    home: m.nav.home,
    dreamGuidance: m.nav.dreamGuidance,
    islamicDreams: m.nav.islamicDreams,
    duas: m.nav.duas,
    categories: m.nav.categories,
    about: m.nav.about,
    sources: m.nav.sources,
    contact: m.nav.contact,
  };
}

export function buildNavLinks(locale: Locale, labels: NavLabels) {
  return items.map((item) => ({
    href: localizePath(locale, item.href),
    label: labels[item.labelKey],
  }));
}

export function buildNavLinkMap(
  locale: Locale,
  labels: NavLabels,
): Record<NavItem["labelKey"], { href: string; label: string }> {
  return Object.fromEntries(
    items.map((item) => [
      item.labelKey,
      { href: localizePath(locale, item.href), label: labels[item.labelKey] },
    ]),
  ) as Record<NavItem["labelKey"], { href: string; label: string }>;
}

export const footerExploreKeys: NavItem["labelKey"][] = [
  "home",
  "dreamGuidance",
  "islamicDreams",
  "duas",
];

export const footerPolicyKeys: NavItem["labelKey"][] = [
  "categories",
  "about",
  "sources",
  "contact",
];
