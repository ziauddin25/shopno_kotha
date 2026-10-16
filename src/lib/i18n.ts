import { defaultLocale, locales, type Locale } from "@/types";

export { locales, defaultLocale };
export type { Locale };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeLabel(locale: Locale): string {
  return locale === "bn" ? "বাংলা" : "English";
}

export function localeShortLabel(locale: Locale): string {
  return locale === "bn" ? "বাং" : "EN";
}

export function htmlLang(locale: Locale): string {
  return locale === "bn" ? "bn" : "en";
}

export function ogLocale(locale: Locale): string {
  return locale === "bn" ? "bn_BD" : "en_US";
}

/** Prefixes a path with the active locale: `('/bn', '/about') -> '/bn/about'`. */
export function localizePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const suffix = normalized === "/" ? "" : normalized;
  return `/${locale}${suffix}`;
}

/**
 * Swaps the locale segment of an existing localized URL so the language
 * switcher can preserve the current page and its query string.
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1] ?? "")) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return localizePath(target, pathname);
}
