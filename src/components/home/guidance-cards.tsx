import Link from "next/link";
import { ArrowRight, Moon, ShieldAlert } from "lucide-react";
import { localizePath } from "@/lib/i18n";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export function GuidanceCards({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  const cards = [
    {
      icon: Moon,
      title: m.home.pleasantTitle,
      body: m.home.pleasantBody,
      cta: m.home.pleasantCta,
      href: localizePath(locale, "/articles/pleasant-dream-etiquette"),
      tone: "bg-sage/50",
    },
    {
      icon: ShieldAlert,
      title: m.home.disturbingTitle,
      body: m.home.disturbingBody,
      cta: m.home.disturbingCta,
      href: localizePath(locale, "/articles/disturbing-dreams-what-to-do"),
      tone: "bg-gold-soft/60",
    },
  ];

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {cards.map(({ icon: Icon, ...card }) => (
        <li
          key={card.title}
          className={`flex flex-col gap-4 rounded-2xl border border-border p-6 ${card.tone}`}
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-card text-forest">
            <Icon className="size-5" aria-hidden />
          </span>
          <h3 className="text-base font-semibold tracking-tight text-foreground">{card.title}</h3>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          <Link
            href={card.href}
            className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline"
          >
            {card.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
