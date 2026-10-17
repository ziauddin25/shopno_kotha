import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A plain GET form (no client JavaScript required) for describing a dream.
 * Submitting navigates to `action` with the free text in `param`, so the result
 * page can render server-side and the query stays shareable and bookmarkable.
 */
export function DreamSearchBox({
  action,
  param,
  placeholder,
  submitLabel,
  fieldLabel,
  defaultValue,
  id = "dream-search",
  className,
}: {
  action: string;
  param: string;
  placeholder: string;
  submitLabel: string;
  fieldLabel: string;
  defaultValue?: string;
  id?: string;
  className?: string;
}) {
  return (
    <form action={action} method="get" role="search" className={cn("w-full", className)}>
      <div className="rounded-2xl bg-card p-3">
        <label htmlFor={id} className="mb-2 block px-2 text-xs font-semibold tracking-wide text-forest">
          {fieldLabel}
        </label>
        <textarea
          id={id}
          name={param}
          rows={3}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl bg-sage/60 px-3 py-2 outline-none focus:border-forest/30 focus:outline-none"
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit" size="lg" className="h-11 gap-2 rounded-md bg-forest px-6 text-sm font-semibold text-white hover:bg-forest/90">
            <Search className="size-4" aria-hidden />
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
