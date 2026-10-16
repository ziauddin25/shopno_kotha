"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LanguageSwitcher, type LanguageOption } from "./language-switcher";
import { NavLinks, type NavLinkItem } from "./nav-links";
import type { Locale } from "@/types";

export function MobileNavigation({
  locale,
  items,
  languageOptions,
  labels,
}: {
  locale: Locale;
  items: NavLinkItem[];
  languageOptions: LanguageOption[];
  labels: {
    menu: string;
    close: string;
    title: string;
    description: string;
    search: string;
    searchHref: string;
    language: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={labels.menu} className="lg:hidden" />
        }
      >
        <Menu className="size-5" aria-hidden />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="inset-0 top-0 left-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 gap-6 overflow-y-auto rounded-none p-5 sm:max-w-none"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="text-base font-semibold">{labels.title}</DialogTitle>
          <DialogClose
            render={
              <Button variant="outline" size="sm" aria-label={labels.close} />
            }
          >
            {labels.close}
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">{labels.description}</DialogDescription>
        <NavLinks
          variant="mobile"
          items={items}
          onNavigate={() => setOpen(false)}
        />
        <div className="mt-auto space-y-4">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href={labels.searchHref} onClick={() => setOpen(false)}>
              <Search className="size-4" aria-hidden />
              {labels.search}
            </Link>
          </Button>
          <LanguageSwitcher
            locale={locale}
            label={labels.language}
            options={languageOptions}
            variant="full"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
