/**
 * Stats Grid Component
 * For displaying statistics and metrics in a grid layout
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

// ============================================
// STAT ITEM
// ============================================

export interface StatItemData {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  colorVariant?: ColorVariant;
}

export interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StatItemData;
  size?: "sm" | "md" | "lg";
}

const valueSize = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
};

const labelSize = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function StatItem({ data, size = "md", className, ...props }: StatItemProps) {
  const colors = data.colorVariant ? colorVariants[data.colorVariant] : colorVariants.blue;

  return (
    <div className={cn("text-center", className)} {...props}>
      <div className={cn("font-bold", valueSize[size], colors.text)}>
        {data.prefix}
        {data.value}
        {data.suffix}
      </div>
      <p className={cn("text-muted-foreground dark:text-muted-foreground mt-2", labelSize[size])}>{data.label}</p>
    </div>
  );
}

// ============================================
// STATS GRID
// ============================================

const statsGridVariants = cva(
  "grid",
  {
    variants: {
      columns: {
        2: "grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-3",
        4: "grid-cols-2 lg:grid-cols-4",
      },
      gap: {
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
      },
    },
    defaultVariants: {
      columns: 3,
      gap: "md",
    },
  }
);

export interface StatsGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsGridVariants> {
  stats: StatItemData[];
  itemSize?: "sm" | "md" | "lg";
}

export function StatsGrid({
  stats,
  columns,
  gap,
  itemSize = "md",
  className,
  ...props
}: StatsGridProps) {
  return (
    <div className={cn(statsGridVariants({ columns, gap }), className)} {...props}>
      {stats.map((stat, index) => (
        <StatItem key={index} data={stat} size={itemSize} />
      ))}
    </div>
  );
}

export { statsGridVariants };
