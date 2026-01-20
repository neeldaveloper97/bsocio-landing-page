/**
 * CTA Impact Section Component
 * A comprehensive call-to-action section with legacy boxes and benefits
 * Used on all pages except signup
 */

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Container } from "./container";

// ============================================
// TYPES
// ============================================

interface LegacyItem {
  text: string;
}

interface BenefitItem {
  text: React.ReactNode;
}

export interface CTAImpactSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Main heading with gradient text */
  heading?: string;
  /** Legacy section title */
  legacyTitle?: string;
  /** Legacy box items */
  legacyItems?: LegacyItem[];
  /** "Ready to carry the torch" heading */
  torchHeading?: string;
  /** Benefits list */
  benefits?: BenefitItem[];
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Narrative stripe text */
  narrativeText?: React.ReactNode;
}

// ============================================
// DEFAULT DATA
// ============================================

const DEFAULT_LEGACY_ITEMS: LegacyItem[] = [
  { text: "It's lived" },
  { text: "It's Shared" },
  { text: "It's Passed on" },
];

const DEFAULT_BENEFITS: BenefitItem[] = [
  { text: <>You get <strong>$250</strong> to celebrate your birthday with kindness</> },
  { text: "Feed Hungry children in your name" },
  { text: <>Be honored globally as a <strong>Birthday Hero</strong></> },
  { text: "Zero cost out of pocket" },
];

// ============================================
// SUB-COMPONENTS
// ============================================

function LegacyBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-6 text-center shadow-sm border border-brand-blue/10">
      <span className="text-lg font-semibold text-brand-blue">
        {text}
      </span>
    </div>
  );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4 rounded-xl border-l-4 border-brand-blue bg-gradient-to-r from-gray-50 to-white p-5 shadow-sm">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-brand-blue">
        <svg 
          className="h-5 w-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </span>
      <span className="text-base text-text-muted [&>strong]:font-bold [&>strong]:text-brand-blue">
        {children}
      </span>
    </li>
  );
}

function NarrativeStripe({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue to-[#1557B0] px-8 py-8 text-center shadow-lg">
      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-[10%] -top-1/2 h-[300px] w-[300px] rounded-full bg-white/10" />
      <p className="relative z-10 text-lg font-medium leading-relaxed text-white sm:text-xl">
        {children}
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CTAImpactSection({
  heading = "Bsocio means \"Be Kind to Be Great — like Bill Gates.\"",
  legacyTitle = "A True Legacy Isn't Remembered",
  legacyItems = DEFAULT_LEGACY_ITEMS,
  torchHeading = "Ready to Carry The Torch?",
  benefits = DEFAULT_BENEFITS,
  ctaText = "Accept Your Free $250 Gift",
  ctaHref = "/signup",
  narrativeText = <>Bsocio combines Artificial Intelligence with Human Compassion<br />— to build a future where giving is smart, social, and global.</>,
  className,
  ...props
}: CTAImpactSectionProps) {
  return (
    <section
      className={cn(
        "w-full bg-gradient-to-b from-brand-blue/[0.02] to-brand-blue/[0.05] py-16 sm:py-20 lg:py-24",
        className
      )}
      {...props}
    >
      <Container>
        <div className="relative mx-auto max-w-5xl">
          {/* Decorative backgrounds */}
          <div className="pointer-events-none absolute -right-[20%] -top-1/2 h-[600px] w-[600px] rounded-full bg-brand-blue/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-[30%] -left-[15%] h-[500px] w-[500px] rounded-full bg-brand-green/[0.06] blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-12">
            {/* Gradient Heading */}
            <div className="text-center">
              <h2 className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
                {heading}
              </h2>
            </div>

            {/* Main Card */}
            <div className="w-full rounded-3xl border border-brand-blue/[0.08] bg-white p-8 shadow-xl sm:p-10 lg:p-12">
              <div className="flex flex-col gap-10">
                {/* Legacy Section */}
                <div className="flex flex-col items-center gap-7 text-center">
                  <h3 className="text-2xl font-bold text-text-darker sm:text-3xl">
                    {legacyTitle}
                  </h3>
                  <div className="grid w-full gap-4 sm:grid-cols-3">
                    {legacyItems.map((item, index) => (
                      <LegacyBox key={index} text={item.text} />
                    ))}
                  </div>
                </div>

                {/* Torch Heading */}
                <h3 className="text-center text-2xl font-bold text-text-darker sm:text-3xl">
                  {torchHeading}
                </h3>

                {/* Benefits List */}
                <ul className="flex flex-col gap-4">
                  {benefits.map((benefit, index) => (
                    <BenefitItem key={index}>{benefit.text}</BenefitItem>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <Button asChild size="xl" className="w-full max-w-md">
                    <Link href={ctaHref}>{ctaText}</Link>
                  </Button>
                </div>

                {/* Narrative Stripe */}
                <NarrativeStripe>{narrativeText}</NarrativeStripe>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
