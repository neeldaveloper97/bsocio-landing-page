import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// QUOTE BOX COMPONENT
// A styled quote/callout box with optional color variants
// ============================================

interface QuoteBoxProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gradient";
  className?: string;
}

const variantStyles = {
  primary: cn(
    "bg-gradient-to-r from-blue-50 to-blue-100",
    "dark:from-primary/10 dark:to-primary/5",
    "border-l-4 border-l-primary"
  ),
  secondary: cn(
    "bg-gradient-to-r from-green-50 to-green-100",
    "dark:from-secondary/10 dark:to-secondary/5",
    "border-l-4 border-l-secondary"
  ),
  gradient: cn(
    "bg-gradient-to-r from-primary via-primary to-brand-teal",
    "dark:from-primary/90 dark:to-brand-teal/90",
    "text-white"
  ),
} as const;

export function QuoteBox({
  children,
  variant = "primary",
  className,
}: QuoteBoxProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl p-5",
        variantStyles[variant],
        className
      )}
      role="note"
    >
      {children}
    </div>
  );
}

// ============================================
// TORCH STATEMENT COMPONENT
// A highlighted statement box with gradient background
// ============================================

interface TorchStatementProps {
  children: React.ReactNode;
  className?: string;
}

export function TorchStatement({ children, className }: TorchStatementProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl p-6 text-center",
        "bg-gradient-to-r from-primary via-primary to-brand-teal",
        "dark:from-primary/90 dark:to-brand-teal/90",
        className
      )}
      role="note"
    >
      <p className="text-base font-bold leading-relaxed text-white sm:text-lg md:text-xl">
        {children}
      </p>
    </div>
  );
}
