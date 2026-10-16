"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyPageLink, sharePage } from "@/lib/share";

export function ShareButton({
  title,
  shareLabel,
  copyLabel,
  copiedLabel,
  failedLabel,
  className,
}: {
  title: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
  failedLabel: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleShare() {
    const outcome = await sharePage({ title });
    if (outcome === "copied") {
      setStatus("copied");
      return;
    }
    if (outcome === "failed" || outcome === "unavailable") {
      const copied = await copyPageLink();
      setStatus(copied ? "copied" : "failed");
    }
  }

  async function handleCopy() {
    const copied = await copyPageLink();
    setStatus(copied ? "copied" : "failed");
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="size-4" aria-hidden />
          {shareLabel}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {status === "copied" ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {status === "copied" ? copiedLabel : copyLabel}
        </Button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-4 text-xs text-muted-foreground">
        {status === "failed" ? failedLabel : ""}
      </p>
    </div>
  );
}
