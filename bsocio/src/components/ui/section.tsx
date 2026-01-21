import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

// ============================================
// SECTION VARIANTS
// ============================================

const sectionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "bg-background dark:bg-background",
      light: "bg-muted dark:bg-muted/50",
      gradient:
        "bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10",
      cta: "bg-gradient-to-br from-primary via-primary to-brand-teal text-primary-foreground dark:from-primary/90 dark:to-brand-teal/90",
      dark: "bg-foreground text-background dark:bg-card dark:text-foreground",
    },
    size: {
      sm: "py-8 sm:py-12",
      md: "py-12 sm:py-16 lg:py-20",
      lg: "py-16 sm:py-20 lg:py-24",
      xl: "py-20 sm:py-24 lg:py-28",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "lg",
  },
});

// ============================================
// SECTION COMPONENT
// ============================================

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  container?: "default" | "narrow" | "wide" | "none";
  as?: "section" | "div" | "article" | "aside";
  children: React.ReactNode;
}

export function Section({
  variant,
  size,
  container = "default",
  as: Component = "section",
  className,
  children,
  ...props
}: SectionProps) {
  const content =
    container === "none" ? (
      children
    ) : (
      <Container
        variant={
          container === "default"
            ? "default"
            : container === "narrow"
            ? "narrow"
            : "wide"
        }
      >
        {children}
      </Container>
    );

  return (
    <Component
      className={cn(sectionVariants({ variant, size }), className)}
      {...props}
    >
      {content}
    </Component>
  );
}

// ============================================
// HERO SECTION VARIANT
// ============================================

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  showDecorations?: boolean;
}

export function HeroSection({
  className,
  children,
  showDecorations = true,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-16 sm:py-20 lg:py-28",
        "bg-gradient-to-br from-primary/5 via-background to-secondary/5",
        "dark:from-primary/10 dark:via-background dark:to-secondary/10",
        className
      )}
      {...props}
    >
      {/* Decorative circles */}
      {showDecorations && (
        <>
          <div
            className="pointer-events-none absolute right-8 top-12 h-32 w-32 rounded-full bg-primary opacity-10 sm:h-48 sm:w-48 lg:right-14 lg:top-20 lg:h-64 lg:w-64"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-16 left-6 h-24 w-24 rounded-full bg-secondary opacity-10 sm:h-32 sm:w-32 lg:h-48 lg:w-48"
            aria-hidden="true"
          />
        </>
      )}

      <Container className="relative z-10">{children}</Container>
    </section>
  );
}

// ============================================
// CTA SECTION VARIANT
// ============================================

interface CTASectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  note?: string;
  children?: React.ReactNode;
}

export function CTASection({
  title,
  description,
  note,
  className,
  children,
  ...props
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "w-full py-16 sm:py-20",
        "bg-gradient-to-br from-primary via-primary to-brand-teal",
        "dark:from-primary/90 dark:to-brand-teal/90",
        className
      )}
      {...props}
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base text-primary-foreground/90 sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
          {note && (
            <p className="mt-6 text-sm font-semibold text-secondary sm:text-base">
              {note}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

// ============================================
// SECTION HEADER COMPONENT
// ============================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  titleAs?: "h1" | "h2" | "h3";
  className?: string;
}

const alignStyles = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
} as const;

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  titleAs: TitleTag = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 max-w-3xl sm:mb-12", alignStyles[align], className)}>
      <TitleTag
        className={cn(
          "font-bold tracking-tight text-foreground",
          "text-2xl sm:text-3xl md:text-4xl"
        )}
      >
        {title}
      </TitleTag>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { sectionVariants };
