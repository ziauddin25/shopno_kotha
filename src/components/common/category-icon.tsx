import {
  Layers,
  Library,
  Moon,
  Scale,
  ShieldAlert,
  Sunrise,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  Layers,
  Moon,
  ShieldAlert,
  Sunrise,
  Scale,
  Library,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Tag;
  return <Icon className={cn("size-5", className)} aria-hidden />;
}
