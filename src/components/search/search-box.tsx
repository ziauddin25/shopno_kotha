import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBox({
  action,
  placeholder,
  defaultValue,
  submitLabel,
  clearLabel,
  id = "site-search",
  className,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  submitLabel: string;
  clearLabel?: string;
  id?: string;
  className?: string;
}) {
  return (
    <form action={action} method="get" role="search" className={cn("w-full", className)}>
      <label htmlFor={id} className="sr-only">
        {submitLabel}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm focus-within:border-forest/40 focus-within:ring-2 focus-within:ring-ring/20">
        <Search className="ml-2 size-4.5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className="h-9 w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {defaultValue && clearLabel ? (
          <Link
            href={action}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
            {clearLabel}
          </Link>
        ) : null}
        <Button type="submit" size="sm" className="shrink-0">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
