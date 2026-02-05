import { Metadata } from "next";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import {
  GiftIcon,
  MedalIcon,
  ShareIcon,
  FlameIcon,
  HIWDollarIcon,
  WalletIcon,
  HeartIcon,
  TrophyIcon,
  CrownIcon,
  AwardIcon,
  CakeIcon,
  StarIcon,
  CommunityIcon,
} from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works - Bsocio",
  description:
    "Learn how Bsocio works in just 4 easy steps. Our intelligent giving system automates generosity with zero out-of-pocket cost.",
};

const DollarIcon = HIWDollarIcon;

// ============================================
// REUSABLE COMPONENTS
// ============================================

interface StepCardProps {
  icon: React.ReactNode;
  iconActive?: boolean;
  title: string;
  description: string;
  stepNumber: number;
  href: string;
}

function StepCard({ icon, iconActive, title, description, stepNumber, href }: StepCardProps) {
  return (
    <div className="group relative flex min-h-full flex-col gap-5 rounded-3xl border-2 border-secondary bg-(--card-bg) p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl",
          iconActive ? "bg-secondary" : "bg-secondary/10"
        )}
      >
        {icon}
      </div>
      <h3 className="font-dm-sans text-lg font-bold leading-snug text-(--heading-primary)">{title}</h3>
      <p className="font-arimo text-base leading-relaxed text-(--text-secondary)">{description}</p>
      <a
        href={href}
        className="mt-auto inline-flex items-center gap-1 font-arimo text-sm font-bold text-accent transition-all duration-300 hover:gap-2 hover:text-[#E04810]"
      >
        Learn More →
      </a>
      <div className="absolute -top-4 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-dm-sans text-2xl font-bold text-white shadow-lg">
        {stepNumber}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  iconColor: "green" | "orange";
  title: string;
  description: string;
}

function FeatureCard({ icon, iconColor, title, description }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl bg-(--card-bg) p-6 shadow-lg transition-transform duration-300 hover:translate-x-1",
        "border-l-4",
        iconColor === "orange" ? "border-l-accent" : "border-l-secondary"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          iconColor === "green" ? "bg-secondary/10" : "bg-[#FFF4ED]"
        )}
      >
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-arimo text-lg font-bold text-(--heading-primary)">{title}</h3>
        <p className="font-arimo text-sm text-(--text-secondary)">{description}</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-(--hero-gradient) px-5 py-16 sm:py-24 md:py-32">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 text-center">
          <h1 className="max-w-[714px] font-dm-sans text-[clamp(32px,5vw,60px)] font-bold leading-tight text-primary">
            How It Works — In Just 4 Easy Steps
          </h1>
          <p className="max-w-[767px] font-dm-sans text-lg leading-10 text-(--text-body)">
            Our intelligent giving system automates generosity, allowing anyone to make an impact — with{" "}
            <span className="inline-block rounded-full border border-secondary/20 bg-secondary/10 px-3.5 py-1.5 font-bold text-secondary shadow-sm">
              zero out-of-pocket cost
            </span>
            .
          </p>
        </div>
      </section>

      {/* 4 Step Cards */}
      <section className="flex flex-col items-center gap-15 bg-(--section-bg-alt) px-4 py-16 sm:py-20 md:py-20">
        <div className="grid w-full max-w-[1200px] gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 lg:grid-cols-4">
          <StepCard
            icon={<GiftIcon />}
            title="Spread Kindness on Us"
            description="Get $250 with zero cost from your pocket to celebrate your birthday in style!"
            stepNumber={1}
            href="#step1"
          />
          <StepCard
            icon={<MedalIcon />}
            title="Become a Birthday Hero"
            description="Join a global movement and be honored worldwide for creating a lasting legacy."
            stepNumber={2}
            href="#step2"
          />
          <StepCard
            icon={<ShareIcon />}
            iconActive
            title="Share Your Story"
            description="Use the world's first 100% community-first social platform to share your journey and spark change."
            stepNumber={3}
            href="#step3"
          />
          <StepCard
            icon={<FlameIcon />}
            iconActive
            title="Carry the Torch"
            description="Help carry forward the mission of saving lives for generations to come."
            stepNumber={4}
            href="#step4"
          />
        </div>
      </section>

      {/* Detailed Steps */}
      <div className="bg-(--section-bg-alt)" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}>
        {/* Step 1: Spread Kindness */}
        <section className="py-16 sm:py-20" id="step1">
          <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 md:grid-cols-2 md:gap-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold text-white">
                  1
                </div>
                <h2 className="font-arimo text-[clamp(28px,4vw,36px)] font-bold leading-tight text-primary">
                  Spread Kindness on Us
                </h2>
              </div>
              <p className="mb-6 font-arimo text-xl leading-relaxed text-(--text-body)">
                Get <strong>$250</strong>, absolutely free, to celebrate your birthday in style! Accept invitation/Sign up (it&apos;s free!) and instantly receive <strong>$250 in your Bsocio Wallet</strong>
              </p>

              <ul className="mb-8 flex flex-col gap-4">
                {[
                  "Pledge $50 each to five friends for their birthdays.",
                  "Those same five friends pledge $50 back to you.",
                  "On your birthday, you receive $250 — plus a $20 donation made in your name to feed a hungry child.",
                  "Use your $250 however you like, or transfer it to your bank.",
                ].map((item, index) => (
                  <li key={index} className="relative pl-9 font-arimo text-base leading-relaxed text-(--text-body)">
                    <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary text-xs text-secondary">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-3 rounded-xl border-2 border-accent bg-[#FFF4ED] p-6">
                <DollarIcon />
                <div>
                  <h3 className="mb-2 font-arimo text-xl font-bold text-(--heading-primary)">Zero Cost From Your Pocket</h3>
                  <p className="font-arimo text-base text-(--text-body)">
                    Your $250 reward covers your pledge. It&apos;s a win for you, a win for your friends, and a win for children everywhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-2xl bg-(--card-bg) p-8 shadow-xl">
              <WalletIcon />
              <h3 className="font-arimo text-3xl font-bold text-primary">Your $250 Wallet</h3>
              <div className="flex w-full items-center justify-center gap-2 border-t-2 border-(--divider) pt-4">
                <HeartIcon />
                <p className="font-arimo font-bold text-(--text-body)">A win-win for everyone</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Birthday Hero */}
        <section className="py-16 sm:py-20 bg-linear-to-br from-[#EFF6FF] to-white" id="step2">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-xl font-bold text-white">
                2
              </div>
              <h2 className="font-arimo text-[clamp(28px,4vw,36px)] font-bold text-primary">
                Become a Birthday Hero
              </h2>
            </div>
            <p className="mx-auto mb-12 max-w-3xl text-center font-arimo text-xl leading-relaxed text-(--text-body)">
              Your generosity earns you a place in the <strong>Birthday Hero Hall of Fame</strong>, celebrated globally at the <strong>Bsocio Hero Festival</strong>— hosted in <strong>California, New York, London</strong>, and more.
            </p>

            <p className="mb-8 text-center text-lg font-semibold text-secondary">
              Experience the Celebration:
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<TrophyIcon />}
                iconColor="green"
                title="Birthday Hero Index"
                description="a live AI leaderboard of global kindness."
              />
              <FeatureCard
                icon={<CrownIcon />}
                iconColor="orange"
                title="Hunger Hero Crowning"
                description="medals, recognition, and worldwide fame."
              />
              <FeatureCard
                icon={<AwardIcon />}
                iconColor="green"
                title="Hunger Games Arena"
                description="thrilling competitions for a cause."
              />
              <FeatureCard
                icon={<CakeIcon />}
                iconColor="green"
                title="Giant Cake Parade"
                description="the sweetest global celebration."
              />
              <FeatureCard
                icon={<StarIcon />}
                iconColor="green"
                title="Impact Stage"
                description="surprise guests, celebrities, and humanitarian icons."
              />
            </div>

            <p className="mx-auto mt-12 max-w-3xl text-center font-arimo text-xl text-(--text-body)">
              Your name, your story, and your kindness — all celebrated in the world&apos;s largest kindness festival.
            </p>
          </div>
        </section>

        {/* Step 3: Share Story */}
        <section className="py-16 sm:py-20" id="step3">
          <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 md:grid-cols-[auto_1fr]">
            <div className="order-2 md:order-1">
              <div className="flex min-w-[320px] flex-col items-center gap-4 rounded-3xl bg-linear-to-br from-[#5D9DFF] to-[#1A67DB] p-12 text-center text-white shadow-2xl">
                <CommunityIcon />
                <h3 className="font-dm-sans text-4xl font-bold">Community First</h3>
                <p className="text-xl opacity-90">Social Platform</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold text-white">
                  3
                </div>
                <h2 className="font-arimo text-[clamp(28px,4vw,36px)] font-bold text-primary">
                  Share Your Story
                </h2>
              </div>
              <p className="mb-4 font-arimo text-xl text-(--text-body)">
                Join the world&apos;s first <strong>AI-powered, community-first social platform</strong> built around purpose.
              </p>
              <p className="mb-6 font-arimo text-xl text-(--text-body)">
                Bsocio turns your birthday celebrations into stories that inspire and uplift.
              </p>

              <ul className="mb-6 flex flex-col gap-4">
                {[
                  "Create your personalized impact feed.",
                  "Invite friends and family to celebrate meaningfully.",
                  "Connect with brands, creators, and changemakers.",
                  "Share how your birthday powers purpose.",
                ].map((item, index) => (
                  <li key={index} className="relative pl-9 font-arimo text-base text-(--text-body)">
                    <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary text-xs text-secondary">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mb-6 font-arimo text-(--text-body)">
                Bsocio isn&apos;t just a platform. It&apos;s a movement of people who believe one day can change everything.
              </p>

              <div className="rounded-xl border-l-4 border-primary bg-(--section-bg) p-6">
                <p className="font-arimo text-xl italic text-(--heading-primary)">
                  Your birthday isn&apos;t just about you anymore —<br />
                  <strong>It&apos;s about the future you create.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Carry the Torch */}
        <section className="py-16 sm:py-20" id="step4">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-xl font-bold text-white">
                4
              </div>
              <h2 className="font-arimo text-[clamp(28px,4vw,36px)] font-bold text-primary">
                Carry the Torch
              </h2>
            </div>
            <p className="mx-auto mb-4 max-w-3xl text-center font-arimo text-xl text-(--text-body)">
              Carry forward the mission of saving and improving lives for generations to come. You don&apos;t need to be a billionaire to create a billionaire-level impact.
            </p>
            <p className="mb-12 text-center font-arimo text-xl font-bold text-(--heading-primary)">
              Your birthday alone can change lives
            </p>

            {/* Scale Section */}
            <div className="mx-auto max-w-4xl rounded-3xl bg-[#EFF6FF] p-8 md:p-12">
              <h3 className="mb-4 font-arimo text-2xl font-bold text-(--heading-primary)">How do you do it?</h3>
              <div className="mb-6 h-1 w-24 rounded bg-secondary" />
              <div className="flex flex-col gap-4">
                <div className="rounded-r-xl border-l-4 border-primary bg-[#F8FBFF] p-6">
                  <p className="font-arimo text-lg text-(--text-body)">Imagine you&apos;re 20 years old, with 60 birthdays ahead.</p>
                </div>
                <div className="rounded-r-xl border-l-4 border-secondary bg-[#F0FDF4] p-6">
                  <p className="font-arimo text-lg text-(--text-body)">
                    Each year, <strong>$20</strong> is donated in your name to help end child hunger.
                  </p>
                </div>
                <div className="rounded-r-xl border-l-4 border-accent bg-[#FFF7ED] p-6">
                  <p className="font-arimo text-lg text-(--text-body)">
                    That&apos;s <strong className="text-2xl text-accent">$1,200</strong> in lifetime impact—from birthdays you were already going to celebrate.
                  </p>
                </div>
              </div>
            </div>

            <div className="my-12 h-0.5 bg-(--divider)" />

            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 font-arimo text-xl font-bold text-(--heading-primary)">Now, imagine this at scale.</p>
              <p className="font-arimo text-xl leading-relaxed text-(--text-body)">
                Every year, 245 million Americans exchange gifts, spending $162 billion—projected to reach $388 billion by 2027. If even a small fraction of the world&apos;s 5 billion social media users joined Bsocio, we could unlock <strong>$300 billion in lifetime giving</strong>— enough to end child hunger for good and carry forward the mission of saving lives beyond 2045.
              </p>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="mb-10 text-center font-arimo text-[clamp(32px,5vw,48px)] font-bold text-primary">
              The Bsocio Impact Vision
            </h2>

            <div className="grid items-center gap-10 md:grid-cols-2">
              <ImageWithSkeleton
                src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/thinkinggirl.png"
                alt="Thinking Girl"
                sizes="(max-width: 768px) 100vw, 500px"
                containerClassName="h-[400px] w-full rounded-2xl sm:h-[500px]"
              />

              <div>
                <p className="font-dm-sans text-base leading-relaxed text-(--text-body)">
                  These funds will build <strong className="text-accent">Bsocio Centres</strong> worldwide— named after the greatest humanitarian heroes of our time. Each centre will serve as a <strong>hub of innovation, learning, and opportunity,</strong> equipped with school feeding systems across <strong>100+ countries</strong>, delivering sustainable nutrition to <strong>500 million children every year.</strong> So no child ever has to learn on an empty stomach.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
