/**
 * Styled List Components
 * Bullet list and numbered list with customizable colors and styles
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

// ============================================
// BULLET LIST
// ============================================

const bulletListVariants = cva(
  "",
  {
    variants: {
      spacing: {
        tight: "space-y-2",
        normal: "space-y-3",
        relaxed: "space-y-4",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      spacing: "normal",
      size: "md",
    },
  }
);

export interface BulletListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof bulletListVariants> {
  items: Array<string | React.ReactNode>;
  colorVariant?: ColorVariant;
  bulletSize?: "sm" | "md" | "lg";
}

const bulletSizes = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

export function BulletList({
  items,
  colorVariant = "blue",
  bulletSize = "md",
  spacing,
  size,
  className,
  ...props
}: BulletListProps) {
  const colors = colorVariants[colorVariant];

  return (
    <ul
      className={cn(bulletListVariants({ spacing, size }), className)}
      {...props}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className={cn(
            "mt-2 shrink-0 rounded-full",
            bulletSizes[bulletSize],
            colors.bg
          )} />
          <span className="text-muted-foreground dark:text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// NUMBERED LIST
// ============================================

const numberedListVariants = cva(
  "",
  {
    variants: {
      spacing: {
        tight: "space-y-3",
        normal: "space-y-4",
        relaxed: "space-y-6",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      spacing: "normal",
      size: "lg",
    },
  }
);

export interface NumberedListProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof numberedListVariants> {
  items: Array<string | React.ReactNode>;
  colorVariant?: ColorVariant;
  startFrom?: number;
}

const numberSizes = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function NumberedList({
  items,
  colorVariant = "blue",
  startFrom = 1,
  spacing,
  size,
  className,
  ...props
}: NumberedListProps) {
  const colors = colorVariants[colorVariant];

  return (
    <ol
      className={cn(numberedListVariants({ spacing, size }), className)}
      {...props}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-4">
          <div className={cn(
            "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
            size === "sm" ? numberSizes.sm : size === "lg" ? numberSizes.lg : numberSizes.md,
            colors.bg
          )}>
            {startFrom + index}
          </div>
          <span className="text-muted-foreground dark:text-muted-foreground">{item}</span>
        </li>
      ))}
    </ol>
  );
}

// ============================================
// CHECK LIST
// ============================================

export interface CheckListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof bulletListVariants> {
  items: Array<string | React.ReactNode>;
  colorVariant?: ColorVariant;
}

export function CheckList({
  items,
  colorVariant = "green",
  spacing,
  size,
  className,
  ...props
}: CheckListProps) {
  const colors = colorVariants[colorVariant];

  return (
    <ul
      className={cn(bulletListVariants({ spacing, size }), className)}
      {...props}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <svg 
            className={cn("mt-0.5 h-5 w-5 shrink-0", colors.text)} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span className="text-muted-foreground dark:text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export { bulletListVariants, numberedListVariants };
