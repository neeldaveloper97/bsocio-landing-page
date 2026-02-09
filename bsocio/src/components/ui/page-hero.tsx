import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable hero section with the standard Bsocio gradient background.
 * Used across Home, About, How-It-Works, and other pages.
 *
 * NOTE: The gradient matches the brand exactly:
 * linear-gradient(100.69deg, #EFF6FF 18.35%, #FFFBF6 51.52%, #FBFFF5 84.7%)
 */

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
  /** HTML id for aria-labelledby targeting */
  id?: string;
}

export function PageHero({ children, className, id }: PageHeroProps) {
  return (
    <section
      id={id}
      className={cn(
        "flex min-h-75 w-full flex-col items-center justify-center",
        "bg-[linear-gradient(100.69deg,#EFF6FF_18.35%,#FFFBF6_51.52%,#FBFFF5_84.7%)]",
        "px-4 py-16 sm:py-20 md:px-8",
        "dark:from-primary/10 dark:via-background dark:to-secondary/10",
        className
      )}
    >
      {children}
    </section>
  );
}
