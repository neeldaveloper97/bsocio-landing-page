/**
 * Info Card Component
 * A card for displaying information with optional border accent
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ColorVariant } from "@/types/theme";
import { colorVariants } from "@/types/theme";

const infoCardVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      borderPosition: {
        none: "",
        left: "border-l-4",
        top: "border-t-4",
        bottom: "border-b-4",
      },
      interactive: {
        true: "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      borderPosition: "left",
      interactive: false,
    },
  }
);

export interface InfoCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infoCardVariants> {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  colorVariant?: ColorVariant;
  showGradient?: boolean;
}

export function InfoCard({
  title,
  subtitle,
  description,
  children,
  colorVariant = "blue",
  showGradient = true,
  size,
  borderPosition,
  interactive,
  className,
  ...props
}: InfoCardProps) {
  const colors = colorVariants[colorVariant];

  return (
    <Card
      className={cn(
        infoCardVariants({ size, borderPosition, interactive }),
        borderPosition !== "none" && colors.border,
        showGradient ? colors.bgGradient : "bg-white",
        className
      )}
      {...props}
    >
      <CardContent className="space-y-4 p-0">
        {subtitle && (
          <p className="text-sm text-text-muted">{subtitle}</p>
        )}
        <CardTitle className="text-xl font-bold text-text-darker">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-lg text-text-dark">
            {description}
          </CardDescription>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

export { infoCardVariants };
