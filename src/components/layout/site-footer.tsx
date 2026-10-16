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
    <footer className="mt-16 border-t border-border/80 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLink locale={locale} />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {m.footer.description}
          </p>
          <p className="text-xs text-muted-foreground">{m.footer.madeFor}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {m.footer.exploreTitle}
          </p>
          <ul className="space-y-2 text-sm">
            {exploreKeys.map((key) => (
              <li key={key}>
                <Link
                  href={map[key].href}
                  className="text-foreground/75 transition-colors hover:text-forest"
                >
                  {map[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {m.footer.policyTitle}
          </p>
          <ul className="space-y-2 text-sm">
            {policyKeys.map((key) => (
              <li key={key}>
                <Link
                  href={map[key].href}
                  className="text-foreground/75 transition-colors hover:text-forest"
                >
                  {map[key].label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localizePath(locale, "/admin")}
                rel="nofollow"
                className="text-foreground/45 transition-colors hover:text-foreground/70"
              >
                {m.nav.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{m.footer.legalNote}</p>
          <p>{m.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
