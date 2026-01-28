import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// STEP CARD COMPONENT
// A reusable card for navigation links with icon, title, and description
// ============================================

interface StepCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({
  href,
  icon,
  title,
  description,
  className,
}: StepCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Base styles
        "group flex flex-col items-center gap-3 p-5 text-center",
        "rounded-xl transition-all duration-300",
        // Background gradient
        "bg-gradient-to-b from-white to-green-50",
        "dark:from-card dark:to-secondary/5",
        // Border
        "border-l-[6px] border-l-secondary",
        // Shadow
        "shadow-sm",
        // Hover effects
        "hover:-translate-y-1 hover:shadow-lg",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
        "dark:focus:ring-offset-background",
        // Min height for consistency
        "min-h-[140px]",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          "bg-secondary text-white",
          "transition-transform duration-300 group-hover:scale-110"
        )}
      >
        <span className="flex h-6 w-6 items-center justify-center">
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <h3
          className={cn(
            "text-lg font-semibold leading-tight",
            "text-foreground dark:text-foreground"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm leading-relaxed",
            "text-muted-foreground dark:text-muted-foreground"
          )}
        >
          {description}
        </p>
        <span
          className={cn(
            "mt-auto text-sm font-semibold",
            "text-primary",
            "transition-all duration-200 group-hover:underline"
          )}
        >
          Learn More →
        </span>
      </div>
    </Link>
  );
}
