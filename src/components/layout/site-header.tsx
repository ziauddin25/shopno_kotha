import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import { buildNavLinks, navLabelsFrom } from "@/lib/navigation";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";
import { BrandLink } from "./brand-link";
import { LanguageSwitcher, type LanguageOption } from "./language-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const links = buildNavLinks(locale, navLabelsFrom(m));

  const languageOptions: LanguageOption[] = [
    { value: "bn", label: m.common.languageBn, short: "বাং" },
    { value: "en", label: m.common.languageEn, short: "EN" },
  ];

  const searchHref = localizePath(locale, "/search");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <BrandLink locale={locale} tagline={m.nav.brandTagline} />

        <NavLinks items={links} className="ml-2 hidden lg:block" />

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link href={searchHref} aria-label={m.nav.search}>
              <Search className="size-5" aria-hidden />
            </Link>
          </Button>
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} label={m.nav.languageLabel} options={languageOptions} />
          </div>
          <MobileNavigation
            locale={locale}
            items={links}
            languageOptions={languageOptions}
            labels={{
              menu: m.nav.openMenu,
              close: m.nav.closeMenu,
              title: m.nav.brandTagline,
              description: m.nav.mainNavigation,
              search: m.nav.search,
              searchHref,
              language: m.nav.languageLabel,
            }}
          />
        </div>
      </div>
    </header>
  );
}
