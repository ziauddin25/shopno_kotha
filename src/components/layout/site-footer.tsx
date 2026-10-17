import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import { buildNavLinkMap, navLabelsFrom } from "@/lib/navigation";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";
import { BrandLink } from "./brand-link";

const exploreKeys = ["dreamGuidance", "islamicDreams", "duas", "categories"] as const;
const policyKeys = ["about", "sources", "contact"] as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const map = buildNavLinkMap(locale, navLabelsFrom(m));

  return (
    <footer className="relative isolate mt-16 overflow-hidden border-t border-white/10 bg-[#111a31] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/footer-dream.svg')] bg-cover bg-center opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#10182f]/85 via-[#142038]/90 to-[#10271f]/95"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLink locale={locale} inverse />
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            {m.footer.description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#f0d68f] uppercase">
            {m.footer.exploreTitle}
          </p>
          <ul className="space-y-2.5 text-sm">
            {exploreKeys.map((key) => (
              <li key={key}>
                <Link
                  href={map[key].href}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  {map[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#f0d68f] uppercase">
            {m.footer.policyTitle}
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href={localizePath(locale, "/privacy")}
                className="text-white/75 transition-colors hover:text-white"
              >
                {m.footer.privacyLabel}
              </Link>
            </li>
            {policyKeys.map((key) => (
              <li key={key}>
                <Link
                  href={map[key].href}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  {map[key].label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localizePath(locale, "/admin")}
                rel="nofollow"
                className="text-white/55 transition-colors hover:text-white/80"
              >
                {m.nav.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/15 bg-[#0b1528]/35">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{m.footer.legalNote}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={localizePath(locale, "/privacy")} className="transition-colors hover:text-white">
              {m.footer.privacyLabel}
            </Link>
            <Link href={localizePath(locale, "/sources")} className="transition-colors hover:text-white">
              {m.footer.editorialPolicyLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
