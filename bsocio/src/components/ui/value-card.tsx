import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// VALUE CARD COMPONENT
// Used for Mission, Vision, Belief cards on About page and similar
// ============================================

const valueCardVariants = cva(
  cn(
    "flex min-w-[280px] flex-1 flex-col gap-4 rounded-2xl border border-border p-6 transition-all duration-300",
    "bg-card text-card-foreground shadow-md",
    "hover:-translate-y-1 hover:shadow-lg",
    "dark:border-border/50 dark:bg-card"
  ),
  {
    variants: {
      accentColor: {
        primary: "border-t-4 border-t-primary",
        secondary: "border-t-4 border-t-secondary",
        accent: "border-t-4 border-t-accent",
        teal: "border-t-4 border-t-brand-teal",
      },
    },
    defaultVariants: {
      accentColor: "primary",
    },
  }
);

interface ValueCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof valueCardVariants> {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const iconBackgrounds = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20",
  accent: "bg-accent/10 text-accent dark:bg-accent/20",
  teal: "bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20",
} as const;

export function ValueCard({
  icon,
  title,
  accentColor = "primary",
  className,
  children,
  ...props
}: ValueCardProps) {
  return (
    <div
      className={cn(valueCardVariants({ accentColor }), className)}
      {...props}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl",
          iconBackgrounds[accentColor || "primary"]
        )}
      >
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export { valueCardVariants };
