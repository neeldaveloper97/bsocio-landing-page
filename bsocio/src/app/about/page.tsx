/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

// ============================================
// SEO METADATA
// ============================================

export const metadata: Metadata = generateSeoMetadata({
  title: "About Us",
  description:
    "Learn about Bsocio's mission to inspire one billion acts of kindness. Discover our vision for a world where compassion becomes our global culture.",
  pathname: "/about",
});

// ============================================
// ICON COMPONENTS
// ============================================

function MissionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#1F6AE1" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="#1F6AE1" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="#1F6AE1"/>
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="#7CBB00" strokeWidth="2"/>
    </svg>
  );
}

function BeliefIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="#F65314" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2.66699V29.3337" stroke="#1F6AE1" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.6667 6.66699H12.6667C11.429 6.66699 10.242 7.15866 9.36684 8.03383C8.49167 8.909 8 10.096 8 11.3337C8 12.5713 8.49167 13.7583 9.36684 14.6335C10.242 15.5087 11.429 16.0003 12.6667 16.0003H19.3333C20.571 16.0003 21.758 16.492 22.6332 17.3672C23.5083 18.2423 24 19.4293 24 20.667C24 21.9047 23.5083 23.0917 22.6332 23.9668C21.758 24.842 20.571 25.3337 19.3333 25.3337H8" stroke="#1F6AE1" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 29.3337C23.3638 29.3337 29.3333 23.3641 29.3333 16.0003C29.3333 8.63653 23.3638 2.66699 16 2.66699C8.63616 2.66699 2.66663 8.63653 2.66663 16.0003C2.66663 23.3641 8.63616 29.3337 16 29.3337Z" stroke="#7CBB00" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6666 16.0003L14.6666 20.0003L21.3333 12.0003" stroke="#7CBB00" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20.0003C18.2091 20.0003 20 18.2095 20 16.0003C20 13.7912 18.2091 12.0003 16 12.0003C13.7909 12.0003 12 13.7912 12 16.0003C12 18.2095 13.7909 20.0003 16 20.0003Z" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2.66699V5.33366" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 26.667V29.3337" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.10663 6.10742L7.99996 8.00075" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 24.0007L25.8933 25.8941" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.66663 16.0003H5.33329" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26.6666 16.0003H29.3333" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.10663 25.8941L7.99996 24.0007" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 8.00075L25.8933 6.10742" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 29.3337C23.3638 29.3337 29.3333 23.3641 29.3333 16.0003C29.3333 8.63653 23.3638 2.66699 16 2.66699C8.63616 2.66699 2.66663 8.63653 2.66663 16.0003C2.66663 23.3641 8.63616 29.3337 16 29.3337Z" stroke="#9B51E0" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.66663 16.0003H29.3333" stroke="#9B51E0" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2.66699C19.2 6.26699 20.9867 11.0003 20.9867 16.0003C20.9867 21.0003 19.2 25.7337 16 29.3337C12.8 25.7337 11.0133 21.0003 11.0133 16.0003C11.0133 11.0003 12.8 6.26699 16 2.66699Z" stroke="#9B51E0" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

interface ValueCardProps {
  variant: "mission" | "vision" | "belief";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function ValueCard({ variant, icon, title, children }: ValueCardProps) {
  const bgColors = {
    mission: "bg-linear-to-br from-blue-50 to-blue-100",
    vision: "bg-linear-to-br from-green-50 to-green-100",
    belief: "bg-linear-to-br from-orange-50 to-orange-100",
  };

  const iconBgColors = {
    mission: "bg-blue-200/70",
    vision: "bg-green-200/70",
    belief: "bg-orange-200/70",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl p-8 transition-transform hover:-translate-y-0.5",
        "sm:p-10 md:p-12",
        bgColors[variant]
      )}
    >
      <div className="flex flex-col items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl sm:h-16 sm:w-16",
            iconBgColors[variant]
          )}
        >
          {icon}
        </div>
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h2>
      </div>
      <div className="text-xl font-medium leading-relaxed text-gray-800 sm:text-2xl md:text-[1.75rem]">
        {children}
      </div>
    </div>
  );
}

interface ImpactCardProps {
  icon: React.ReactNode;
  iconColor: "blue" | "green" | "orange" | "purple";
  title: string;
  description: string;
  number: string;
}

function ImpactCard({ icon, iconColor, title, description, number }: ImpactCardProps) {
  const iconBgColors = {
    blue: "bg-linear-to-br from-primary/15 to-primary/[0.08]",
    green: "bg-linear-to-br from-secondary/15 to-secondary/[0.08]",
    orange: "bg-linear-to-br from-accent/15 to-accent/[0.08]",
    purple: "bg-linear-to-br from-purple-500/15 to-purple-500/[0.08]",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] sm:p-8 md:p-9">
      <div className="flex flex-col items-start gap-5 sm:flex-row">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-18 sm:w-18",
            iconBgColors[iconColor]
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 sm:mb-3 sm:text-xl md:text-2xl">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p>
        </div>
      </div>
      <span className="absolute right-6 top-6 text-5xl font-extrabold leading-none opacity-5 sm:text-6xl md:text-7xl">
        {number}
      </span>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="flex min-h-75 flex-col items-center justify-center px-4 py-16 sm:min-h-100 sm:py-20 md:px-8 lg:px-40"
        style={{
          background: "linear-gradient(100.69deg, #EFF6FF 18.35%, #FFFBF6 51.52%, #FBFFF5 84.7%)",
        }}
        aria-labelledby="about-hero-title"
      >
        <h1
          id="about-hero-title"
          className="max-w-4xl text-center text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Empowering humanity to make compassion a daily practice
        </h1>
      </section>

      {/* Humanity Fund Section */}
      <section className="flex flex-col items-center justify-center border-b border-border bg-white px-4 py-10 sm:py-14 md:px-8 lg:px-40">
        <div className="max-w-4xl rounded-xl border-2 border-primary bg-linear-to-br from-primary/5 to-primary/5 p-6 text-center sm:p-8 md:p-10">
          <h2 className="mb-3 text-2xl font-bold text-primary sm:mb-5 sm:text-3xl md:text-4xl lg:text-[42px]">
            Bsocio Humanity Fund
          </h2>
          <p className="text-base text-foreground sm:text-lg md:text-xl">
            Perpetual engine designed to end classroom hunger worldwide and carry forward the mission of saving lives beyond 2045.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-12 bg-white px-4 py-10 sm:gap-16 sm:py-16 md:gap-24 md:px-8 md:py-20 lg:px-40">
        {/* Our Story Section */}
        <section className="flex w-full max-w-7xl flex-col items-center gap-6 md:flex-row md:gap-12">
          <div className="flex flex-1 flex-col items-start gap-4 sm:gap-6">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Our Story</h2>
            <p className="text-sm leading-relaxed text-foreground sm:text-base">
              What began as a 70th birthday tribute to Bill Gates has evolved into the{" "}
              <strong>Bsocio Like Bill Gates Movement</strong>—a global call to action dedicated to scaling his vision. Co-created by friends, believers, and changemakers worldwide, we are turning gratitude into action, proving that{" "}
              <strong>strategic kindness can solve humanity&apos;s greatest challenges</strong>.
            </p>
          </div>
          <ImageWithSkeleton
            src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/unity-collaboration.png"
            alt="Our Story"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            containerClassName="h-48 w-full flex-1 rounded-2xl shadow-lg sm:h-56 md:h-72 md:max-w-xl"
          />
        </section>

        {/* Mission, Vision, Belief Cards */}
        <section className="flex w-full max-w-7xl flex-col gap-5 sm:gap-6 md:gap-8">
          <ValueCard variant="mission" icon={<MissionIcon />} title="Our Mission">
            <p>
              To inspire <strong>one billion acts of kindness</strong> by transforming everyday celebrations into shared moments of impact.
            </p>
          </ValueCard>
          <ValueCard variant="vision" icon={<VisionIcon />} title="Our Vision">
            <p>
              A world where <strong>compassion becomes our global culture</strong>—and every person sees themselves as a <strong>hero of change</strong>.
            </p>
          </ValueCard>
          <ValueCard variant="belief" icon={<BeliefIcon />} title="Our Belief">
            <p>
              Like Bill Gates, we believe <strong>true greatness is measured by how many people you lift</strong>.
            </p>
          </ValueCard>
        </section>

        {/* Why This Movement Now */}
        <section className="flex w-full max-w-7xl flex-col items-start gap-4 sm:gap-6">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Why This Movement Now?
          </h2>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            Bill Gates has shown the world how focused generosity can transform health, education, and innovation. Yet with the Gates Foundation set to sunset in 2045, a critical question emerges: how do we ensure this momentum not only continues but grows?
          </p>
          <p className="my-2 border-l-4 border-secondary pl-5 text-base font-semibold text-primary sm:my-4 sm:text-lg">
            Our answer: empower people everywhere to make compassion a daily practice.
          </p>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            Bsocio is a $300 billion global action framework lovingly called the Future of Humanity Initiative, designed to honor, expand, and safeguard Bill Gates&apos;s philanthropic legacy.
          </p>
          <p className="my-2 border-l-4 border-secondary pl-5 text-base font-semibold text-primary sm:my-4 sm:text-lg">
            A $9 billion annual funding gap threatens decades of progress
          </p>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            To close it, our founding members have committed $3 billion to seed the Bsocio Humanity Fund—a perpetual engine designed to end classroom hunger worldwide and carry forward his mission of saving lives beyond 2045.
          </p>
          <p className="my-2 border-l-4 border-secondary pl-5 text-base font-semibold text-primary sm:my-4 sm:text-lg">
            Now, it&apos;s our turn to carry it forward.
          </p>
        </section>

        {/* Anchoring Initiatives */}
        <section className="flex w-full max-w-7xl flex-col items-center gap-6 sm:gap-8 md:gap-12">
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Anchoring Initiatives
          </h2>
          <div className="grid w-full gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg sm:gap-5 sm:p-8 md:p-10">
              <h3 className="text-lg font-bold text-primary sm:text-xl md:text-2xl">
                Bill Gates Socio Day — October 28
              </h3>
              <p className="-mt-2 text-sm text-foreground sm:text-base">
                A global day of action designed to be celebrated every year beyond his lifetime.
              </p>
              <p className="text-sm text-foreground sm:text-base">
                On this day, individuals and organizations redirect celebration spending toward child hunger, health, and education.
              </p>
              <ul className="flex flex-col gap-2 pl-6 sm:gap-3">
                <li className="relative text-sm text-foreground before:absolute before:-left-4 before:font-bold before:content-['•'] sm:text-base">
                  Mobilize millions toward urgent global challenges
                </li>
                <li className="relative text-sm text-foreground before:absolute before:-left-4 before:font-bold before:content-['•'] sm:text-base">
                  Amplify awareness through shared storytelling
                </li>
                <li className="relative text-sm text-foreground before:absolute before:-left-4 before:font-bold before:content-['•'] sm:text-base">
                  Ensure legacy by embedding generosity into global culture
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg sm:gap-5 sm:p-8 md:p-10">
              <h3 className="text-lg font-bold text-primary sm:text-xl md:text-2xl">
                Bill Gates Socio Centres
              </h3>
              <p className="-mt-2 text-sm text-foreground sm:text-base">
                Future global hubs of innovation and opportunity.
              </p>
              <p className="text-sm font-semibold text-gray-900 sm:text-base">Key Outcomes:</p>
              <ul className="flex flex-col gap-2 pl-6 sm:gap-3">
                <li className="relative text-sm text-foreground before:absolute before:-left-4 before:font-bold before:content-['•'] sm:text-base">
                  School feeding systems across 100+ countries
                </li>
                <li className="relative text-sm text-foreground before:absolute before:-left-4 before:font-bold before:content-['•'] sm:text-base">
                  Sustainable nutrition for 500 million children annually
                </li>
              </ul>
              <p className="mt-2 border-l-[3px] border-secondary pl-4 text-sm font-semibold text-primary sm:text-base">
                So no child ever learns on an empty stomach.
              </p>
            </div>
          </div>
        </section>

        {/* How We Create Impact */}
        <section className="flex w-full max-w-7xl flex-col items-center gap-8 rounded-3xl bg-linear-to-b from-primary/5 to-primary/5 p-6 sm:gap-12 sm:p-10 md:gap-16 md:p-12 lg:p-16">
          <div className="text-center">
            <h2 className="mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              How We Create Impact
            </h2>
            <p className="max-w-2xl text-base text-slate-500 sm:text-lg">
              We combine human-centered design with data-driven action to create lasting change across communities worldwide.
            </p>
          </div>
          <div className="grid w-full gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
            <ImpactCard
              icon={<DollarIcon />}
              iconColor="blue"
              title="Human-Centered Giving"
              description="Solutions designed around real lives—not headlines."
              number="01"
            />
            <ImpactCard
              icon={<CheckCircleIcon />}
              iconColor="green"
              title="Evidence-Led Action"
              description="Data, accountability, and measurable outcomes."
              number="02"
            />
            <ImpactCard
              icon={<SunIcon />}
              iconColor="orange"
              title="Strategic Partnerships"
              description="Working alongside governments, innovators, and communities."
              number="03"
            />
            <ImpactCard
              icon={<GlobeIcon />}
              iconColor="purple"
              title="Cultural Influence"
              description="Turning global awareness into sustained action at scale."
              number="04"
            />
          </div>
        </section>

        {/* Focus Areas */}
        <section className="flex w-full max-w-7xl flex-col items-start gap-5 sm:gap-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Focus Areas</h2>
          <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { color: "bg-primary", text: "Ending Child Hunger" },
              { color: "bg-secondary", text: "Innovation & Technology for Good" },
              { color: "bg-accent", text: "Global Health" },
              { color: "bg-purple-500", text: "Sustainable Development" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.color)} />
                <p className="text-sm text-foreground sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Classroom Hunger Must End */}
        <section className="flex w-full max-w-7xl flex-col items-end gap-4 rounded-r-2xl border-l-4 border-primary bg-linear-to-br from-blue-50 to-blue-100 p-6 sm:gap-6 sm:p-8 md:p-12">
          <h2 className="w-full text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            Why Classroom Hunger Must End
          </h2>
          <p className="w-full text-base text-foreground sm:text-lg">
            Classroom hunger is not just a crisis—it&apos;s a global economic emergency.
          </p>
          <ul className="flex w-full flex-col gap-3 sm:gap-4">
            {[
              { bold: "45 million children", text: " arrive at school hungry daily." },
              { bold: "", text: "Malnutrition lowers the chance of completing primary school by ", boldEnd: "20%", textEnd: "." },
              { bold: "", text: "Countries lose up to ", boldEnd: "10% of GDP", textEnd: " to childhood stunting and malnutrition." },
            ].map((item, index) => (
              <li key={index} className="relative pl-6 text-base text-foreground sm:pl-8 sm:text-lg">
                <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-accent" />
                {item.bold && <strong className="text-primary">{item.bold}</strong>}
                {item.text}
                {item.boldEnd && <strong className="text-primary">{item.boldEnd}</strong>}
                {item.textEnd}
              </li>
            ))}
          </ul>
          <p className="mt-2 w-full text-base font-bold text-primary sm:text-lg md:text-xl">
            Ending classroom hunger is one of the highest-return investments in human progress.
          </p>
        </section>
      </div>

      {/* Model Section with Green/Blue Background */}
      <div
        className="flex w-full flex-col items-center gap-10 px-4 py-10 sm:gap-16 sm:py-16 md:px-8 md:py-20 lg:px-40"
        style={{
          background: "linear-gradient(283.75deg, #F0FDF4 4.44%, #EFF6FF 96.01%)",
        }}
      >
        {/* Our Model */}
        <section className="flex w-full max-w-7xl flex-col items-start gap-4 sm:gap-6">
          <h2 className="w-full text-center text-2xl font-bold text-primary sm:text-3xl md:text-4xl lg:text-5xl">
            Our Model: Turn Celebrations Into Change
          </h2>
          <p className="w-full text-center text-base text-foreground sm:text-lg md:text-xl">
            Imagine if every birthday, wedding, or holiday gift could feed a child for a year.
          </p>
        </section>

        {/* Paradigm Shift */}
        <section className="w-full max-w-7xl">
          <h3 className="mb-4 text-xl font-bold text-gray-900 sm:mb-5 sm:text-2xl md:text-3xl">
            The Paradigm Shift
          </h3>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            Each year, the global &quot;gift economy&quot; exceeds hundreds of billions of dollars. What if just 1% of that went toward ending classroom hunger?
          </p>
        </section>

        {/* Triple Win */}
        <section className="flex w-full max-w-7xl flex-col gap-6 sm:gap-8 md:gap-12">
          <h2 className="w-full text-center text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            How It Works: A Triple-Win
          </h2>
          <div className="flex w-full flex-col gap-4 sm:gap-6 md:flex-row">
            <div className="flex-1 rounded-xl border-l-4 border-primary bg-linear-to-r from-blue-50 to-white p-5 sm:p-6 md:p-8">
              <h4 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">For the Giver:</h4>
              <p className="text-sm text-foreground sm:text-base md:text-lg">
                Amplify joy—turn personal moments into lasting legacies.
              </p>
            </div>
            <div className="flex-1 rounded-xl border-l-4 border-secondary bg-linear-to-r from-green-50 to-white p-5 sm:p-6 md:p-8">
              <h4 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">For the Receiver:</h4>
              <p className="text-sm text-foreground sm:text-base md:text-lg">
                A child receives reliable nutrition, unlocking their full potential.
              </p>
            </div>
            <div className="flex-1 rounded-xl border-l-4 border-accent bg-linear-to-r from-orange-50 to-white p-5 sm:p-6 md:p-8">
              <h4 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">For Society:</h4>
              <p className="text-sm text-foreground sm:text-base md:text-lg">
                Collective action boosts education, health, and economic growth.
              </p>
            </div>
          </div>
        </section>

        {/* Zero-Cost Giving */}
        <section className="flex w-full max-w-7xl flex-col gap-5 sm:gap-6 md:gap-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            Zero-Cost, Frictionless Giving
          </h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            {[
              "Redirect existing celebration spending—no new money needed.",
              "Every amount matters: $20 has collective power alongside major pledges.",
              "Integrated seamlessly into digital platforms, making giving as easy as sending a text.",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-8 sm:w-8 sm:text-base">
                  {index + 1}
                </div>
                <p className="text-base text-foreground sm:text-lg">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coalition */}
        <section className="flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            A Coalition for Our Shared Future
          </h2>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            This mission is bigger than any institution—but achievable when humanity acts together. We are building a global coalition of philanthropists, governments, businesses, creators, and citizens to ensure no child ever learns on an empty stomach.
          </p>
        </section>
      </div>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
