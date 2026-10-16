import { BadgeCheck, Clock, FlaskConical, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

const config: Record<
  VerificationStatus,
  { icon: LucideIcon; className: string }
> = {
  checked: {
    icon: BadgeCheck,
    className: "border-forest/25 bg-sage text-forest",
  },
  pending: {
    icon: Clock,
    className: "border-gold/40 bg-gold-soft text-[#6b5526]",
  },
  demo: {
    icon: FlaskConical,
    className: "border-border bg-muted text-muted-foreground",
  },
};

export interface VerificationBadgeLabels {
  checked: string;
  pending: string;
  demo: string;
}

export function VerificationBadge({
  status,
  labels,
  className,
}: {
  status: VerificationStatus;
  labels: VerificationBadgeLabels;
  className?: string;
}) {
  const { icon: Icon, className: tone } = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", tone, className)}
    >
      <Icon className="size-3.5" aria-hidden />
      {labels[status]}
    </Badge>
  );
}
