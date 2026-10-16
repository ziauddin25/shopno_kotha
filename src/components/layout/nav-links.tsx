"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  href: string;
  label: string;
}

export function NavLinks({
  items,
  className,
  onNavigate,
  variant = "desktop",
}: {
  items: NavLinkItem[];
  className?: string;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const homeHref = items[0]?.href ?? "";

  return (
    <nav aria-label="Main" className={className}>
      <ul className={cn(variant === "desktop" ? "flex items-center gap-1" : "flex flex-col gap-1")}>
        {items.map((item, index) => {
          const isHome = item.href === homeHref;
          const isActive = isHome ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <li key={item.href} className={variant === "desktop" && index >= 4 ? "hidden xl:block" : undefined}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-lg font-medium transition-colors",
                  variant === "desktop" ? "px-3 py-2 text-sm" : "block px-3 py-2.5 text-base",
                  isActive
                    ? "bg-sage text-forest"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
