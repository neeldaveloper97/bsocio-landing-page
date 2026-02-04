/**
 * Leadership Page
 * Displays the Bsocio leadership team members
 */

import type { Metadata } from "next";
import Image from "next/image";
import { generateMetadata as createMetadata } from "@/lib/seo";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

export const metadata: Metadata = createMetadata({
  title: "Our Leadership Team | Bsocio",
  description:
    "Meet the Bsocio leadership team spanning technology, global health, sports, entertainment, and social impact—unified by a commitment to end child hunger.",
});

// ============================================
// LEADERSHIP DATA
// ============================================

interface LeadershipMember {
  name: string;
  position: string;
  role: string;
  bio: string;
  image?: string;
}

const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: "Jon Batiste",
    position: "President and Board Member",
    role: "Artist, Advocate & Cultural Innovator",
    bio: "A world-renowned musician and storyteller, Jon brings a deeply humanistic vision to Bsocio's mission. His work bridges culture and purpose, inspiring global audiences to embrace kindness and collective action.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/jonathan+batiste.jpg",
  },
  {
    name: "Titus Gicharu",
    position: "CEO and Board Member",
    role: "Visionary Architect",
    bio: "A strategic thinker with deep roots in both Africa and the United States, Titus leads Bsocio's day-to-day operations with a focus on scalable, sustainable impact and innovative platform design.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/titus+gicharu.jpg",
  },
  {
    name: "Anil Dash",
    position: "Board Member",
    role: "Technology Ethicist & Digital Strategist",
    bio: "A pioneer in examining technology's impact on society, Anil ensures Bsocio's platform is built with integrity, transparency, and user trust at its core.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/anil+dash.jpg",
  },
  {
    name: "David Beckham",
    position: "Board Member",
    role: "Global Influence Ambassador",
    bio: "One of the world's most recognized and trusted figures, David amplifies Bsocio's message to millions, demonstrating how everyday celebrations can drive transformational change worldwide.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/david+beckham.jpg",
  },
  {
    name: "Michael Sheldrick",
    position: "Board Member",
    role: "Policy & Advocacy Architect",
    bio: "Co-Founder of Global Citizen and master of policy-driven social movements, Michael guides Bsocio's strategic partnerships with governments and international organizations.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/michael+sheldrick.jpg",
  },
  {
    name: "Dr. Lawrence Haddad",
    position: "Board Member",
    role: "Global Health & Nutrition Authority",
    bio: "Executive Director of the Global Alliance for Improved Nutrition (GAIN), Dr. Haddad brings unparalleled expertise in ending childhood hunger and ensuring Bsocio's impact is evidence-based and measurable.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/lawrence+haddad.jpg",
  },
  {
    name: "Catherine Kamau",
    position: "Goodwill Ambassador",
    role: "Voice of the Community",
    bio: "Beloved actress and authentic connector to everyday people, Catherine represents the heart of Bsocio—bringing the voices and stories of communities directly to the platform's mission.",
    image: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/catherine+kamau.jpg",
  },
];

// ============================================
// COMPONENTS
// ============================================

function MemberCard({ member }: { member: LeadershipMember }) {
  return (
    <article className="flex flex-col pb-12 border-b border-gray-200 last:border-b-0">
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Photo */}
        <div className="relative w-full max-w-[400px] lg:w-[400px] mx-auto lg:mx-0 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex-shrink-0 overflow-hidden" style={{ aspectRatio: '400/450' }}>
          {member.image && (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 400px"
              priority={false}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-1 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-2xl font-bold leading-8 text-gray-900">
              {member.name}
            </h2>
            <span className="text-2xl font-bold leading-8 text-gray-600">|</span>
            <span className="text-2xl font-bold leading-8 text-gray-900">
              {member.position}
            </span>
          </div>
          <p className="text-lg leading-7 text-brand-blue">{member.role}</p>
          <p className="text-base leading-[26px] text-gray-700 mt-3">{member.bio}</p>
        </div>
      </div>
    </article>
  );
}

// ============================================
// PAGE
// ============================================

export default function LeadershipPage() {
  return (
    <>
      <div className="flex flex-col items-start gap-16 pt-32 pb-16 px-5 md:px-20 lg:px-48 max-w-[1536px] mx-auto bg-white">
        {/* Page Header */}
        <header className="w-full max-w-[1152px] border-b-2 border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold leading-10 text-gray-900 mb-6">
            Our Leadership Team
          </h1>
          <p className="text-base leading-[26px] text-gray-700 max-w-[896px]">
            Our leadership spans technology, global health, sports, entertainment, and
            social impact—unified by a shared commitment to solve humanity&apos;s greatest
            challenges through creativity, compassion, and innovation.
          </p>
        </header>

        {/* Leadership Team */}
        <div className="flex flex-col gap-12 w-full max-w-[1152px]">
          {LEADERSHIP_TEAM.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <CtaImpactSection />
    </>
  );
}
