import * as React from "react";
import { cn } from "@/lib/utils";
import { Minus, Check, ArrowRight, type LucideIcon } from "lucide-react";

// ============================================
// BULLET LIST COMPONENT
// A styled list with customizable bullet icons
// ============================================

type BulletType = "minus" | "check" | "arrow";

interface BulletListProps {
  items: string[];
  bulletType?: BulletType;
  bulletColor?: "primary" | "secondary" | "accent";
  className?: string;
}

const bulletIcons: Record<BulletType, LucideIcon> = {
  minus: Minus,
  check: Check,
  arrow: ArrowRight,
};

const bulletColors = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
} as const;

export function BulletList({
  items,
  bulletType = "minus",
  bulletColor = "secondary",
  className,
}: BulletListProps) {
  const Icon = bulletIcons[bulletType];

  return (
    <ul
      className={cn(
        "flex w-full list-none flex-col gap-5",
        className
      )}
      role="list"
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "relative flex items-center gap-3 pl-10",
            "text-lg font-semibold leading-relaxed",
            "text-foreground dark:text-foreground"
          )}
        >
          <span
            className={cn(
              "absolute left-0 flex h-6 w-6 items-center justify-center rounded-full",
              bulletColors[bulletColor],
              "text-white"
            )}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
