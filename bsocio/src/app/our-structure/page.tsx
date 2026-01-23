/**
 * Our Structure Page
 * Explains Bsocio's dual-entity organizational model
 */

import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/seo";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

export const metadata: Metadata = createMetadata({
  title: "Our Structure | Bsocio",
  description:
    "Learn about Bsocio's dual-entity model combining a nonprofit (Bsocio Humanity Fund) and a Public Benefit Corporation to end child hunger worldwide.",
});

// ============================================
// DATA
// ============================================

const ENTITIES = [
  {
    title: "Bsocio Humanity Fund (Nonprofit)",
    description: "A global nonprofit responsible for:",
    items: [
      "Philanthropic strategy and program execution",
      "Grant-making, partnerships, and community impact",
      "Measuring progress toward eliminating child hunger",
    ],
    footer:
      "The Fund is mission-driven and independent, with an endowment built for long-term sustainability.",
  },
  {
    title: "Bsocio PBC (Public Benefit Corporation)",
    description: "A mission-locked PBC responsible for:",
    items: [
      "Technology and platform development",
      "Innovation, partnerships, and commercial solutions that advance the mission",
      "Scaling tools and systems that strengthen the Bsocio Humanity Fund's impact",
    ],
    footer:
      "By law, the PBC must consider the well-being of all stakeholders—not just shareholders.",
  },
  {
    title: "Future of Humanity LLC",
    description: "The philanthropic sponsor and controlling member responsible for:",
    items: [
      "Providing the initial US$3B Seeded Donation",
      "Holding conventional equity in Bsocio PBC",
      "Aligning long-term incentives between donors, leadership, and the mission",
    ],
    footer:
      "All stockholders participate proportionally in any increase in the PBC's value, ensuring impact and value creation move together.",
  },
];

const GOVERNANCE = [
  {
    title: "Bsocio Humanity Fund Board",
    description: "The nonprofit is governed by a Board of Directors composed of:",
    items: ["Independent directors", "The CEO"],
    footer:
      "They oversee mission execution, fiduciary responsibility, and global program strategy.",
  },
  {
    title: "Bsocio PBC Board",
    description: "Future of Humanity LLC holds exclusive voting and consent rights, including:",
    items: [
      "Appointment of all directors of Bsocio PBC",
      "Authority to replace directors at any time",
      "Oversight to ensure mission-aligned commercial operations",
    ],
  },
  {
    title: "Unified Governance",
    description: "To maintain alignment and prevent fragmented oversight:",
    items: [
      "All Bsocio Humanity Fund directors also serve on the Bsocio PBC Board",
      "Except for designated non-voting observers",
    ],
    footer:
      "This unified model ensures mission, impact, and commercial operations move forward together and remain anchored to Bsocio's purpose.",
  },
];

// ============================================
// COMPONENTS
// ============================================

function SectionDivider() {
  return <div className="w-full h-0.5 bg-gray-200" />;
}

function MissionQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-7 border-l-4 border-brand-blue py-4">
      <p className="text-lg leading-7 text-gray-900 font-medium">{children}</p>
    </div>
  );
}

interface SubsectionProps {
  title: string;
  description: string;
  items: string[];
  footer?: string;
}

function Subsection({ title, description, items, footer }: SubsectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold leading-7 text-gray-900">{title}</h3>
      <div className="flex flex-col gap-4">
        <p className="text-base leading-6 text-gray-700">{description}</p>
        <ul className="flex flex-col gap-2 pl-6 list-disc">
          {items.map((item, index) => (
            <li key={index} className="text-base leading-[26px] text-gray-700">
              {item}
            </li>
          ))}
        </ul>
        {footer && <p className="text-base leading-6 text-gray-700">{footer}</p>}
      </div>
    </div>
  );
}

// ============================================
// PAGE
// ============================================

export default function OurStructurePage() {
  return (
    <>
      <div className="flex flex-col items-start gap-12 pt-32 pb-16 px-6 md:px-20 lg:px-40 xl:px-80 max-w-[1536px] mx-auto">
        {/* Header */}
        <div className="w-full max-w-[896px] border-b-2 border-gray-200 pb-1">
          <h1 className="text-3xl md:text-4xl font-bold leading-10 text-gray-900">
            Our Structure
          </h1>
        </div>

        {/* Intro */}
        <div className="flex flex-col gap-4 w-full max-w-[896px]">
          <p className="text-base leading-6 text-gray-700">
            Bsocio operates through a <strong>dual-entity model</strong> consisting of a{" "}
            <strong>nonprofit</strong> (Bsocio Humanity Fund) and a{" "}
            <strong>Public Benefit Corporation (PBC)</strong>, a structure designed to
            accelerate global solutions that end child hunger.
          </p>
          <p className="text-base leading-6 text-gray-700">
            The organization is built on a{" "}
            <strong>US$3 billion Seeded Donation Call Investment</strong> from{" "}
            <strong>Future of Humanity LLC</strong>, a philanthropic vehicle representing
            aligned donors, foundations, and institutional contributors.
          </p>
          <p className="text-base leading-6 text-gray-700">
            This integrated model brings together{" "}
            <strong>philanthropic permanence and mission-aligned innovation</strong>,
            ensuring Bsocio&apos;s ability to scale impact sustainably and over the long term.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-12 w-full max-w-[896px]">
          {/* Section 1: Seeded Donation Call */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">
              Seeded Donation Call
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-6 text-gray-700">
                Future of Humanity donors have committed <strong>US$3,000,000,000</strong>{" "}
                to establish the <strong>Bsocio Humanity Fund</strong>—a{" "}
                <strong>perpetual endowment</strong> targeting <strong>US$300 billion</strong>.
              </p>
              <p className="text-base leading-6 text-gray-700">
                This fund powers Bsocio&apos;s mission to:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc">
                <li className="text-base leading-[26px] text-gray-700">
                  Build long-term, global solutions
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  Address systemic causes of child hunger
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  Coordinate scalable, evidence-driven interventions
                </li>
              </ul>
              <p className="text-base leading-6 text-gray-700">
                The Fund is established{" "}
                <strong>in honor of Bill Gates&apos; 70th birthday</strong>, carrying forward
                his humanitarian legacy.
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Section 2: Our Entities */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">Our Entities</h2>
            <div className="flex flex-col gap-10">
              {ENTITIES.map((entity, index) => (
                <Subsection key={index} {...entity} />
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* Section 3: Our Mission */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">Our Mission</h2>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-6 text-gray-700">
                All entities—Bsocio Humanity Fund, Bsocio PBC, and Future of Humanity
                LLC—share one unified mission:
              </p>
              <MissionQuote>
                <strong>
                  To combat and ultimately eradicate child hunger worldwide through
                  coordinated philanthropy, innovation, and global partnerships.
                </strong>
              </MissionQuote>
            </div>
          </section>

          <SectionDivider />

          {/* Section 4: Governance */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">Governance</h2>
            <div className="flex flex-col gap-10">
              {GOVERNANCE.map((item, index) => (
                <Subsection key={index} {...item} />
              ))}
            </div>
          </section>

          <SectionDivider />

          {/* Section 5: Public Benefit Commitments */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">
              Public Benefit Commitments
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-6 text-gray-700">
                As a Public Benefit Corporation, Bsocio PBC is legally bound to:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc">
                <li className="text-base leading-[26px] text-gray-700">
                  Advance the humanitarian mission
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  Prioritize societal impact
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  Align commercial growth with long-term global progress
                </li>
              </ul>
              <p className="text-base leading-6 text-gray-700">
                These commitments form the foundation of Bsocio&apos;s accountability and
                ethical stewardship.
              </p>
            </div>
          </section>

          <SectionDivider />

          {/* Section 6: Summary */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">Summary</h2>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-6 text-gray-700">
                Bsocio&apos;s structure combines:
              </p>
              <ul className="flex flex-col gap-2 pl-6 list-disc">
                <li className="text-base leading-[26px] text-gray-700">
                  The permanence of a <strong>large-scale philanthropic fund</strong>
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  The innovation capacity of a <strong>mission-locked PBC</strong>
                </li>
                <li className="text-base leading-[26px] text-gray-700">
                  The governance integrity of <strong>unified oversight</strong>
                </li>
              </ul>
              <p className="text-base leading-6 text-gray-700">
                This model positions Bsocio to pursue bold, long-term solutions to{" "}
                <strong>end child hunger for generations to come</strong>.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <CtaImpactSection />
    </>
  );
}
