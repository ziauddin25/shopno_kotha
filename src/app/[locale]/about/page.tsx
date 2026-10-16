import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleSlash, Quote, ShieldCheck } from "lucide-react";
import { NoticeBox } from "@/components/common/notice-box";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.about.title,
    description: m.about.description,
    path: "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const a = getMessages(locale).about;
  const m = getMessages(locale);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {a.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {a.description}
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-border bg-sage/40 p-6 sm:p-8">
        <span className="flex size-10 items-center justify-center rounded-lg bg-card text-forest">
          <Quote className="size-5" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{a.missionTitle}</h2>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {a.missionBody}
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {a.principlesTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {a.principles.map((principle) => (
            <li
              key={principle.title}
              className="flex gap-3.5 rounded-xl border border-border bg-card p-4"
            >
              <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-forest" aria-hidden />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{principle.title}</p>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {a.limitationsTitle}
          </h2>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            {a.limitations.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CircleSlash className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{a.notTitle}</h2>
          <ul className="space-y-3">
            {a.notItems.map((item) => (
              <li key={item.title} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NoticeBox tone="demo" title={m.common.demoNoticeTitle}>
        {m.common.demoNoticeBody}
      </NoticeBox>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={localizePath(locale, "/contact")}>
            {a.ctaContact}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={localizePath(locale, "/sources")}>{a.ctaSources}</Link>
        </Button>
      </div>
    </div>
  );
}
