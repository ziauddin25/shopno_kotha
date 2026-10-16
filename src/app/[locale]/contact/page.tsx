import { notFound } from "next/navigation";
import { Mail, MessageSquare } from "lucide-react";
import { NoticeBox } from "@/components/common/notice-box";
import { ContactForm } from "@/components/contact/contact-form";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.contact.title,
    description: m.contact.description,
    path: "/contact",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const m = getMessages(locale);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {m.contact.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.contact.description}
        </p>
      </header>

      <ContactForm labels={m.contact} locale={locale} />

      <section className="grid gap-4 sm:grid-cols-2">
        <NoticeBox tone="info" title={m.contact.editorialTitle}>
          {m.contact.editorialBody}
        </NoticeBox>
        <NoticeBox tone="warning" title={m.common.reportError}>
          {m.common.reportErrorHint}
        </NoticeBox>
      </section>

      <NoticeBox tone="demo" title={m.common.demoNoticeTitle}>
        {m.common.demoNoticeBody}
      </NoticeBox>
    </div>
  );
}
