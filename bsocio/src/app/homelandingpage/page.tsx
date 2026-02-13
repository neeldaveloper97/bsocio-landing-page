import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import { Container } from "@/components/ui/container";
import { StepCard } from "@/components/ui/step-card";
import { QuoteBox, TorchStatement } from "@/components/ui/quote-box";
import { BulletList } from "@/components/ui/bullet-list";
import { Button } from "@/components/ui/button";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import {
  HowItWorksNavIcon as HowItWorksIcon,
  FestivalsNavIcon as FestivalsIcon,
  AboutNavIcon as AboutIcon,
  NewsNavIcon as NewsIcon,
} from "@/components/ui/brand-icons";

// Lazy load below-the-fold section
const CtaImpactSection = dynamic(
  () => import("@/components/layout/CtaImpactSection"),
  { loading: () => <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-primary/5" /> }
);

// ============================================
// SEO METADATA
// ============================================

export const metadata: Metadata = generateSeoMetadata({
  title: "Bsocio - The Future of Humanity Initiative | Get $250 for Your Birthday",
  description:
    "Join the Bsocio movement and receive $250 to celebrate your birthday with kindness. Help feed hungry children and be part of building a future where no child goes to school hungry.",
  pathname: "/homelandingpage",
});

// ============================================
// DATA DEFINITIONS
// ============================================

interface StepCardData {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEP_CARDS: StepCardData[] = [
  {
    href: "/how-it-works",
    icon: <HowItWorksIcon />,
    title: "How It Works",
    description:
      "Discover how you receive $250 to celebrate your birthday with kindness while feeding children in your name.",
  },
  {
    href: "/festivals",
    icon: <FestivalsIcon />,
    title: "Hero Festivals",
    description:
      "Be honored globally as a Birthday Hero at special festivals celebrating compassion and community impact.",
  },
  {
    href: "/about",
    icon: <AboutIcon />,
    title: "About Bsocio",
    description:
      "Learn about our mission to build a future where no child goes to school hungry.",
  },
  {
    href: "/news-media",
    icon: <NewsIcon />,
    title: "News & Media",
    description:
      "Read inspiring stories of Birthday Heroes making a real difference around the world.",
  },
];

const BULLET_ITEMS = [
  "Fewer vaccines",
  "Fewer children in school",
  "Fewer lives saved",
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Optimized for LCP */}
      <section
        className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-[linear-gradient(100.69deg,#EFF6FF_18.35%,#FFFBF6_51.52%,#FBFFF5_84.7%)] px-4 py-20 dark:from-primary/10 dark:via-background dark:to-secondary/10 lg:min-h-screen lg:py-28"
        aria-labelledby="hero-title"
      >

        {/* Hero Content - LCP Element */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:gap-8">
          <h1
            id="hero-title"
            className="max-w-3xl text-[clamp(1.875rem,5vw,3.75rem)] font-bold leading-[1.2] text-primary sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Bsocio Like Bill Gates Movement Is Here!
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-foreground sm:text-lg md:text-xl dark:text-foreground/90">
            We&apos;re giving <strong>you $250</strong> to celebrate your birthday
            with kindness—while building a future where no child goes to school
            hungry, and the mission of saving lives continues far beyond 2045
          </p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/signup/verify">Accept Your Free $250 Gift</Link>
            </Button>
            <LearnMoreButton className="inline-flex items-center justify-center rounded-xl border-2 border-accent bg-white px-6 py-3 text-base font-semibold text-accent transition-all hover:bg-accent hover:text-white dark:bg-card dark:hover:bg-accent">
              Learn More
            </LearnMoreButton>
          </div>
        </div>
      </section>

      {/* Supporting Copy Section */}
      <section
        className="w-full bg-background py-12 dark:bg-background sm:py-16 lg:py-20"
        aria-labelledby="supporting-title"
      >
        <Container variant="narrow">
          <div className="flex flex-col items-start gap-6">
            <h2
              id="supporting-title"
              className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl"
            >
              Bsocio means &quot;Be Kind to Be Great — like Bill Gates.&quot;
            </h2>
            <p className="text-base font-bold text-foreground">
              The greatest humanitarian hero of our time.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              For decades, visionary philanthropy has changed the course of
              global health, education, and human survival.
            </p>

            {/* Quote Box */}
            <QuoteBox variant="primary" className="mt-2">
              <p className="text-base font-semibold text-primary sm:text-lg">
                Imagine a world without his $300 billion in lifetime giving…
              </p>
            </QuoteBox>

            {/* Bullet List */}
            <BulletList
              items={BULLET_ITEMS}
              bulletType="minus"
              bulletColor="secondary"
              className="mt-2"
            />

            {/* Torch Statement */}
            <TorchStatement className="mt-6">
              Now, it&apos;s our turn to carry the torch forward — amplified by
              technology, guided by evidence, and grounded in humanity.
            </TorchStatement>
          </div>
        </Container>
      </section>

      {/* Learn More Section */}
      <section
        id="learn-more"
        className="w-full bg-muted py-12 dark:bg-muted/50 sm:py-16 lg:py-20"
        aria-labelledby="explore-title"
      >
        <Container>
          {/* Section Header */}
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <h2
              id="explore-title"
              className="mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl"
            >
              Explore the Movement
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bsocio isn&apos;t just an app — it&apos;s an{" "}
              <strong className="text-foreground">
                AI-powered community-first Social platform
              </strong>{" "}
              inspired by the humanitarian legacy of Bill Gates, helping
              everyone make a difference intelligently and effortlessly.
            </p>
          </div>

          {/* Step Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_CARDS.map((card) => (
              <StepCard
                key={card.href}
                href={card.href}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </div>
  );
}
