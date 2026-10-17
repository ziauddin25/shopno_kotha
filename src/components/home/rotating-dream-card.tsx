"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import type { Locale } from "@/types";

export function RotatingDreamCard({
  locale,
  title,
  dreams,
}: {
  locale: Locale;
  title: string;
  dreams: string[];
}) {
  const [active, setActive] = useState(0);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (dreams.length < 2) return;
    const timer = window.setInterval(() => {
      const offset = 1 + Math.floor(Math.random() * (dreams.length - 1));
      setActive((current) => (current + offset) % dreams.length);
      setRevision((value) => value + 1);
    }, 3700);
    return () => window.clearInterval(timer);
  }, [dreams.length]);

  function chooseDream(index: number) {
    setActive(index);
    setRevision((value) => value + 1);
  }

  return (
    <aside className="relative mx-auto w-full max-w-xl">
      <div aria-hidden="true" className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#dce9d9]/45 via-[#245746]/25 to-[#b69a61]/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#b69a61]/45 bg-gradient-to-br from-[#faf9f6] via-[#f5f0e5] to-[#eaf0e9] p-5 shadow-2xl shadow-[#14251c]/30 sm:p-8">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-44 rounded-full border border-[#b69a61]/25 bg-[#b69a61]/10" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-14 size-52 rounded-full bg-[#245746]/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#245746] text-[#f5f0e5] shadow-lg shadow-[#245746]/20">
              <Moon className="size-6" aria-hidden />
            </span>
            <p className="text-sm font-semibold text-[#245746] sm:text-base">{title}</p>
          </div>
        </div>

        <blockquote
          key={`${active}-${revision}`}
          aria-live="off"
          className="relative mt-6 min-h-48 rounded-3xl rounded-tl-md border border-[#245746]/10 bg-gradient-to-br from-white via-[#faf9f6] to-[#eaf0e9] p-6 text-pretty text-lg leading-[1.85] text-[#202820] shadow-xl shadow-[#245746]/10 animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none sm:min-h-52 sm:p-7 sm:text-xl"
        >
          “{dreams[active]}”
        </blockquote>

        <div className="relative mt-6 flex justify-end">
          <div role="group" className="flex items-center gap-2" aria-label={locale === "bn" ? "স্বপ্নের গল্প বেছে নিন" : "Choose a dream story"}>
            {dreams.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => chooseDream(index)}
                aria-label={`${locale === "bn" ? "গল্প" : "Story"} ${index + 1}`}
                aria-pressed={active === index}
                className={`size-2.5 cursor-pointer rounded-full transition-all ${active === index ? "w-7 bg-[#b69a61]" : "bg-[#245746]/25 hover:bg-[#245746]/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
