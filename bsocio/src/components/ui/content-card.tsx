import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// CONTENT CARD COMPONENT
// Used for impact cards, anchoring initiative cards, and similar
// ============================================

interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "gradient";
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6 lg:p-8",
  lg: "p-6 sm:p-8 lg:p-10",
} as const;

const variantStyles = {
  default: cn(
    "bg-card border border-border rounded-2xl shadow-md",
    "dark:bg-card dark:border-border/50"
  ),
  bordered: cn(
    "bg-card border-2 border-primary rounded-xl",
    "dark:bg-card dark:border-primary/70"
  ),
  gradient: cn(
    "bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20",
    "dark:from-primary/10 dark:to-primary/20 dark:border-primary/30"
  ),
} as const;

export function ContentCard({
  children,
  variant = "default",
  padding = "md",
  className,
  ...props
}: ContentCardProps) {
  return (
    <div
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================
// IMPACT CARD COMPONENT
// Card with icon, title, description, and optional number badge
// ============================================

interface ImpactItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  number?: string | number;
  iconColor?: "primary" | "secondary" | "accent" | "purple";
}

const iconColorStyles = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20",
  accent: "bg-accent/10 text-accent dark:bg-accent/20",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
} as const;

export function ImpactItemCard({
  icon,
  title,
  description,
  number,
  iconColor = "primary",
  className,
  ...props
}: ImpactItemCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-md",
        "dark:border-border/50 dark:bg-card",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            iconColorStyles[iconColor]
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {number && (
        <span className="absolute right-4 top-4 text-3xl font-bold text-muted-foreground/20">
          {number}
        </span>
      )}
    </div>
  );
}

// ============================================
// WIN CARD COMPONENT
// Used for Triple-Win section cards
// ============================================

interface WinCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "accent";
}

const winCardVariants = {
  primary: cn(
    "bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-primary",
    "dark:from-primary/10 dark:to-primary/20"
  ),
  secondary: cn(
    "bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-secondary",
    "dark:from-secondary/10 dark:to-secondary/20"
  ),
  accent: cn(
    "bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-l-accent",
    "dark:from-accent/10 dark:to-accent/20"
  ),
} as const;

export function WinCard({
  title,
  description,
  variant = "primary",
  className,
  ...props
}: WinCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        winCardVariants[variant],
        className
      )}
      {...props}
    >
      <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ============================================
// NUMBERED STEP COMPONENT
// Used for numbered lists with circle indicators
// ============================================

interface NumberedStepProps {
  number: number;
  children: React.ReactNode;
  className?: string;
}

export function NumberedStep({ number, children, className }: NumberedStepProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          "bg-primary text-sm font-bold text-primary-foreground"
        )}
      >
        {number}
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
