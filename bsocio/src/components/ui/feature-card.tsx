/**
 * Feature Card Component
 * A versatile card for displaying features, values, or key points
 * Supports multiple color variants and sizes
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { IconName, ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

const featureCardVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      interactive: {
        true: "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      interactive: false,
    },
  }
);

export interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {
  icon?: IconName | React.ReactNode;
  title: string;
  description: string;
  colorVariant?: ColorVariant;
  showBackground?: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  colorVariant = "blue",
  showBackground = true,
  size,
  interactive,
  className,
  ...props
}: FeatureCardProps) {
  const colors = colorVariants[colorVariant];

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return (
        <div className={cn(
          "inline-flex items-center justify-center rounded-xl",
          size === "sm" ? "h-10 w-10" : size === "xl" ? "h-20 w-20" : "h-16 w-16",
          colors.iconBg,
          colors.text
        )}>
          <DynamicIcon 
            name={icon as IconName} 
            size={size === "sm" ? "sm" : size === "xl" ? "xl" : "lg"} 
          />
        </div>
      );
    }

    return (
      <div className={cn(
        "inline-flex items-center justify-center rounded-xl",
        size === "sm" ? "h-10 w-10" : size === "xl" ? "h-20 w-20" : "h-16 w-16",
        colors.iconBg,
        colors.text
      )}>
        {icon}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        featureCardVariants({ size, interactive }),
        showBackground ? colors.bgLight : "bg-white dark:bg-card",
        "border-none",
        className
      )}
      {...props}
    >
      <CardContent className="space-y-4 p-0">
        {renderIcon()}
        <CardTitle className="text-xl font-semibold text-foreground dark:text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export { featureCardVariants };
