import Link from "next/link";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import "./page.css";

// ============================================
// SVG ICONS FOR STEP CARDS
// ============================================

function HowItWorksIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FestivalsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
      <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13L13 15L15 16L13 17L12 19L11 17L9 16L11 15L12 13Z" fill="currentColor" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================
// CHECK ICON FOR BENEFITS
// ============================================

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ============================================
// DATA DEFINITIONS
// ============================================

interface StepCard {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEP_CARDS: StepCard[] = [
  {
    href: "/how-it-works",
    icon: <HowItWorksIcon />,
    title: "How It Works",
    description: "Discover how you receive $250 to celebrate your birthday with kindness while feeding children in your name.",
  },
  {
    href: "/festivals",
    icon: <FestivalsIcon />,
    title: "Hero Festivals",
    description: "Be honored globally as a Birthday Hero at special festivals celebrating compassion and community impact.",
  },
  {
    href: "/about",
    icon: <AboutIcon />,
    title: "About Bsocio",
    description: "Learn about our mission to build a future where no child goes to school hungry.",
  },
  {
    href: "/news-media",
    icon: <NewsIcon />,
    title: "News & Media",
    description: "Read inspiring stories of Birthday Heroes making a real difference around the world.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function Home() {
  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="circle-blue"></div>
        <div className="circle-green"></div>
        <div className="hero-content">
          <div className="heading-1">
            <h1>Bsocio Like Bill Gates Movement Is Here!</h1>
          </div>
          <div className="paragraph">
            <p className="hero-subtitle">
              We&apos;re giving <strong>you $250</strong> to celebrate your birthday with kindness—while building a
              future where no child goes to school hungry, and the mission of saving lives continues far beyond 2045
            </p>
          </div>
          <div className="hero-buttons">
            <Link href="/signup" className="btn-primary btn-large">Accept Your Free $250 Gift</Link>
            {/* Client component handles smooth scroll even when hash already present */}
            <LearnMoreButton className="btn-secondary-orange btn-large">Learn More</LearnMoreButton>
          </div>
        </div>
      </section>

      {/* Supporting Copy Section */}
      <section className="supporting-copy">
        <div className="container">
          <div className="supporting-content">
            <h2>Bsocio means &quot;Be Kind to Be Great — like Bill Gates.&quot;</h2>
            <p className="subtitle"><strong>The greatest humanitarian hero of our time.</strong></p>
            <p className="paragraph-text">For decades, visionary philanthropy has changed the course of global
              health, education, and human survival.</p>
            <div className="quote-section">
              <p className="quote-text">Imagine a world without his $300 billion in lifetime giving…</p>
            </div>
            <div className="bullet-list">
              <ul>
                <li>Fewer vaccines</li>
                <li>Fewer children in school</li>
                <li>Fewer lives saved</li>
              </ul>
            </div>
            <div className="torch-statement">
              <p><strong>Now, it&apos;s our turn to carry the torch forward — amplified by technology, guided by evidence, and grounded in humanity.</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="learn-more-section" id="learn-more">
        <div className="container-1280">
          <div className="section-header">
            <h2>Explore the Movement</h2>
            <p className="lead">Bsocio isn&apos;t just an app — it&apos;s an <strong>AI-powered community-first Social
                platform</strong> inspired by the humanitarian legacy of Bill Gates, helping everyone make a
              difference intelligently and effortlessly.</p>
          </div>
          <div className="cards-grid steps">
            {STEP_CARDS.map((card) => (
              <Link key={card.href} href={card.href} className="info-card step">
                <div className="step-icon">
                  {card.icon}
                </div>
                <div className="step-body">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="card-cta">Learn More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </div>
  );
}
