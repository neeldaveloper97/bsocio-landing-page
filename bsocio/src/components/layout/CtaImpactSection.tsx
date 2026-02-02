/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// CONSTANTS
// ============================================

const LEGACY_ITEMS = [
  "It's lived",
  "It's Shared",
  "It's Passed on",
] as const;

const BENEFITS = [
  { text: "You get", highlight: "$250", suffix: "to celebrate your birthday with kindness" },
  { text: "Feed Hungry children in your name", highlight: null, suffix: null },
  { text: "Be honored globally as a birthday Hero", highlight: null, suffix: null },
  { text: "Zero cost out of pocket", highlight: null, suffix: null },
] as const;

// ============================================
// SUB-COMPONENTS
// ============================================

function LegacyBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-6 text-center",
        "bg-gradient-to-br from-blue-100 to-blue-200",
        "dark:from-blue-900/30 dark:to-blue-800/30",
        "border border-primary/10 dark:border-primary/20",
        "shadow-sm"
      )}
    >
      <span className="text-sm font-semibold text-primary sm:text-base md:text-lg">
        {children}
      </span>
    </div>
  );
}

interface BenefitItemProps {
  text: string;
  highlight?: string | null;
  suffix?: string | null;
}

function BenefitItem({ text, highlight, suffix }: BenefitItemProps) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl p-4",
        "bg-gradient-to-r from-muted/50 to-background",
        "dark:from-muted/30 dark:to-card",
        "border-l-4 border-primary",
        "shadow-sm"
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        <Check className="h-5 w-5 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground sm:text-base">
        {text}{" "}
        {highlight && <strong className="font-bold text-primary">{highlight}</strong>}
        {suffix && ` ${suffix}`}
      </span>
    </li>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CtaImpactSection() {
  return (
    <section
      className={cn(
        "w-full py-12 sm:py-16 md:py-20 lg:py-24",
        "bg-gradient-to-b from-primary/5 to-primary/10",
        "dark:from-primary/10 dark:to-primary/5"
      )}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-[1200px] w-full px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-4xl",
            "rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12",
            "bg-card shadow-lg",
            "dark:bg-card/80 dark:backdrop-blur-sm",
            "border border-border/50"
          )}
        >
          {/* Header */}
          <h2
            id="cta-heading"
            className={cn(
              "mb-8 text-center",
              "text-2xl font-bold sm:text-3xl md:text-4xl",
              "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            )}
          >
            "Be Kind to Be Great — like Bill Gates."
          </h2>

          {/* Legacy Section */}
          <div className="mb-8 text-center">
            <h3 className="mb-6 text-lg font-bold text-foreground sm:text-xl md:text-2xl">
              A True Legacy Isn't Remembered
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {LEGACY_ITEMS.map((item) => (
                <LegacyBox key={item}>{item}</LegacyBox>
              ))}
            </div>
          </div>

          {/* Torch Heading */}
          <h3 className="mb-6 text-center text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            Ready to Carry The Torch?
          </h3>

          {/* Benefits List */}
          <ul className="mb-8 space-y-3">
            {BENEFITS.map((benefit, index) => (
              <BenefitItem
                key={index}
                text={benefit.text}
                highlight={benefit.highlight}
                suffix={benefit.suffix}
              />
            ))}
          </ul>

          {/* CTA Button */}
          <div className="mb-8 flex justify-center">
            <Button asChild size="xl" className="w-full max-w-md">
              <Link href="/signup">Accept Your Free $250 Gift</Link>
            </Button>
          </div>

          {/* Narrative Stripe */}
          <div
            className={cn(
              "rounded-xl p-6 text-center",
              "bg-gradient-to-r from-primary to-primary/80",
              "dark:from-primary/90 dark:to-primary/70"
            )}
          >
            <p className="text-sm font-medium text-primary-foreground sm:text-base md:text-lg">
              Bsocio combines Artificial Intelligence with Human Compassion — to
              build a future where giving is smart, social, and global.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
