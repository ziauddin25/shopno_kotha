import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({
  title,
  description,
  retryHref,
  retryLabel,
  className,
}: {
  title: string;
  description?: string;
  retryHref?: string;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {retryHref && retryLabel ? (
        <Button asChild variant="outline" size="sm" className="mt-1">
          <Link href={retryHref}>
            <RotateCcw className="size-4" aria-hidden />
            {retryLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
