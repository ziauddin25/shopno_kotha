import { Info, ShieldAlert, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeTone = "info" | "warning" | "demo";

const tones: Record<NoticeTone, { icon: LucideIcon; wrapper: string; iconClass: string }> = {
  info: {
    icon: Info,
    wrapper: "border-forest/20 bg-sage/60",
    iconClass: "text-forest",
  },
  warning: {
    icon: ShieldAlert,
    wrapper: "border-gold/35 bg-gold-soft",
    iconClass: "text-[#8a6f33]",
  },
  demo: {
    icon: Sparkles,
    wrapper: "border-dashed border-border bg-muted/60",
    iconClass: "text-muted-foreground",
  },
};

export function NoticeBox({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: NoticeTone;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, wrapper, iconClass } = tones[tone];
  return (
    <div
      role="note"
      className={cn("flex gap-3 rounded-xl border px-4 py-3.5 text-sm", wrapper, className)}
    >
      <Icon className={cn("mt-0.5 size-4.5 shrink-0", iconClass)} aria-hidden />
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        {children ? <div className="text-muted-foreground">{children}</div> : null}
      </div>
    </div>
  );
}
