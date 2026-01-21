/**
 * Quote Block and Highlight Box Components
 * For callouts, quotes, and important information
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

// ============================================
// QUOTE BLOCK
// ============================================

const quoteBlockVariants = cva(
  "border-l-4 pl-5 py-2",
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface QuoteBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof quoteBlockVariants> {
  children: React.ReactNode;
  colorVariant?: ColorVariant;
  bold?: boolean;
}

export function QuoteBlock({
  children,
  colorVariant = "green",
  bold = true,
  size,
  className,
  ...props
}: QuoteBlockProps) {
  const colors = colorVariants[colorVariant];

  return (
    <div
      className={cn(
        quoteBlockVariants({ size }),
        colors.border,
        className
      )}
      {...props}
    >
      <p className={cn(
        colors.text,
        bold && "font-semibold"
      )}>
        {children}
      </p>
    </div>
  );
}

// ============================================
// HIGHLIGHT BOX
// ============================================

const highlightBoxVariants = cva(
  "rounded-2xl",
  {
    variants: {
      size: {
        sm: "p-6",
        md: "p-8",
        lg: "p-12",
      },
      borderPosition: {
        none: "",
        left: "rounded-l-none border-l-4",
        right: "rounded-r-none border-r-4",
        top: "rounded-t-none border-t-4",
      },
    },
    defaultVariants: {
      size: "md",
      borderPosition: "left",
    },
  }
);

export interface HighlightBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof highlightBoxVariants> {
  title?: string;
  children: React.ReactNode;
  colorVariant?: ColorVariant;
}

export function HighlightBox({
  title,
  children,
  colorVariant = "blue",
  size,
  borderPosition,
  className,
  ...props
}: HighlightBoxProps) {
  const colors = colorVariants[colorVariant];

  // Generate gradient based on color with dark mode support
  const gradientClass = colorVariant === "blue" 
    ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-primary/10 dark:to-primary/5"
    : colorVariant === "green"
    ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-secondary/10 dark:to-secondary/5"
    : colorVariant === "orange"
    ? "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-accent/10 dark:to-accent/5"
    : colorVariant === "teal"
    ? "bg-gradient-to-r from-teal-50 to-teal-100 dark:from-brand-teal/10 dark:to-brand-teal/5"
    : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5";

  return (
    <div
      className={cn(
        highlightBoxVariants({ size, borderPosition }),
        gradientClass,
        borderPosition !== "none" && colors.border,
        "space-y-6",
        className
      )}
      {...props}
    >
      {title && (
        <h2 className={cn("text-2xl sm:text-3xl font-bold", colors.text)}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ============================================
// STAT HIGHLIGHT
// ============================================

export interface StatHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  colorVariant?: ColorVariant;
}

export function StatHighlight({
  value,
  colorVariant = "blue",
  className,
  ...props
}: StatHighlightProps) {
  const colors = colorVariants[colorVariant];

  return (
    <strong className={cn(colors.text, className)} {...props}>
      {value}
    </strong>
  );
}

// ============================================
// CALLOUT BOX
// ============================================

const calloutBoxVariants = cva(
  "rounded-xl border-2 p-8 sm:p-12 text-center",
  {
    variants: {
      size: {
        sm: "p-6 sm:p-8",
        md: "p-8 sm:p-12",
        lg: "p-10 sm:p-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface CalloutBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutBoxVariants> {
  title: string;
  description?: string;
  colorVariant?: ColorVariant;
}

export function CalloutBox({
  title,
  description,
  colorVariant = "blue",
  size,
  className,
  ...props
}: CalloutBoxProps) {
  const colors = colorVariants[colorVariant];

  // Generate gradient based on color with dark mode support
  const gradientClass = colorVariant === "blue"
    ? "bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 dark:from-brand-blue/10 dark:to-brand-blue/5"
    : colorVariant === "green"
    ? "bg-gradient-to-br from-brand-green/5 to-brand-green/10 dark:from-brand-green/10 dark:to-brand-green/5"
    : colorVariant === "orange"
    ? "bg-gradient-to-br from-brand-orange/5 to-brand-orange/10 dark:from-brand-orange/10 dark:to-brand-orange/5"
    : colorVariant === "teal"
    ? "bg-gradient-to-br from-brand-teal/5 to-brand-teal/10 dark:from-brand-teal/10 dark:to-brand-teal/5"
    : "bg-gradient-to-br from-purple-500/5 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-500/5";

  return (
    <div
      className={cn(
        calloutBoxVariants({ size }),
        colors.border,
        gradientClass,
        className
      )}
      {...props}
    >
      <h2 className={cn("text-3xl sm:text-4xl font-bold mb-5", colors.text)}>
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground dark:text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export { quoteBlockVariants, highlightBoxVariants, calloutBoxVariants };
