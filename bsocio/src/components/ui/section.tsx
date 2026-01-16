import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        white: "bg-white py-16 sm:py-20 lg:py-24",
        light: "bg-background-light py-16 sm:py-20 lg:py-24",
        gradient: "bg-gradient-to-br from-blue-50 to-green-50 py-16 sm:py-20 lg:py-24",
        cta: "bg-gradient-to-br from-brand-blue via-brand-blue to-brand-teal text-white py-16 sm:py-20",
      },
    },
    defaultVariants: {
      variant: "white",
    },
  }
);

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  container?: "default" | "narrow" | "wide" | "none";
  children: React.ReactNode;
}

export function Section({
  variant,
  container = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const content = container === "none" ? children : (
    <Container variant={container === "default" ? "default" : container === "narrow" ? "narrow" : "wide"}>
      {children}
    </Container>
  );

  return (
    <section
      className={cn(sectionVariants({ variant }), className)}
      {...props}
    >
      {content}
    </section>
  );
}

// Hero Section variant
interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function HeroSection({ className, children, ...props }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "hero-gradient relative w-full overflow-hidden py-16 sm:py-20 lg:py-28",
        className
      )}
      {...props}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute right-8 top-12 h-32 w-32 rounded-full bg-brand-blue opacity-10 sm:h-48 sm:w-48 lg:right-14 lg:top-20 lg:h-64 lg:w-64" />
      <div className="pointer-events-none absolute bottom-16 left-6 h-24 w-24 rounded-full bg-brand-green opacity-10 sm:h-32 sm:w-32 lg:h-48 lg:w-48" />
      
      <Container className="relative z-10">
        {children}
      </Container>
    </section>
  );
}

// CTA Section variant
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
      className={cn("cta-section", className)}
      {...props}
    >
      <Container>
        <div className="cta-inner">
          <h2 className="cta-title">{title}</h2>
          {description && <p className="cta-text">{description}</p>}
          {children}
          {note && <p className="cta-note">{note}</p>}
        </div>
      </Container>
    </section>
  );
}

export { sectionVariants };
