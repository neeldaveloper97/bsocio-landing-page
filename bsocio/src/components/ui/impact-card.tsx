/**
 * Impact Card Component
 * Card with numbered badge for displaying impact items or steps
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { IconName, ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

const impactCardVariants = cva(
  "relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      layout: {
        horizontal: "flex gap-5",
        vertical: "flex flex-col gap-4",
      },
    },
    defaultVariants: {
      size: "lg",
      layout: "horizontal",
    },
  }
);

export interface ImpactCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof impactCardVariants> {
  icon?: IconName | React.ReactNode;
  title: string;
  description: string;
  number?: string | number;
  colorVariant?: ColorVariant;
}

export function ImpactCard({
  icon,
  title,
  description,
  number,
  colorVariant = "blue",
  size,
  layout,
  className,
  ...props
}: ImpactCardProps) {
  const colors = colorVariants[colorVariant];

  const renderIcon = () => {
    if (!icon) return null;

    const iconContent = typeof icon === "string" 
      ? <DynamicIcon name={icon as IconName} size={size === "sm" ? "md" : "lg"} />
      : icon;

    return (
      <div className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl",
        size === "sm" ? "h-12 w-12" : "h-16 w-16",
        colors.iconBg,
        colors.text
      )}>
        {iconContent}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        impactCardVariants({ size, layout }),
        "dark:bg-card dark:border-border/50",
        `hover:${colors.border}`,
        className
      )}
      {...props}
    >
      <CardContent className={cn(
        "p-0",
        layout === "horizontal" ? "flex gap-5" : "flex flex-col gap-4"
      )}>
        {renderIcon()}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground dark:text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      
      {number && (
        <span className={cn(
          "absolute right-6 top-6 font-extrabold opacity-10",
          size === "sm" ? "text-4xl" : "text-6xl",
          colors.text
        )}>
          {typeof number === "number" ? String(number).padStart(2, "0") : number}
        </span>
      )}
    </Card>
  );
}

export { impactCardVariants };
