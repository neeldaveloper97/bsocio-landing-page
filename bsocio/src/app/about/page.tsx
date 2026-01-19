import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import "./page.css";

export const metadata: Metadata = {
  title: "About Us - Bsocio",
  description: "Learn about our mission to empower humanity to make compassion a daily practice.",
};

// Focus areas data
const FOCUS_AREAS = [
  { text: "Ending Child Hunger", colorClass: "blue" },
  { text: "Innovation & Technology for Good", colorClass: "green" },
  { text: "Global Health", colorClass: "orange" },
  { text: "Sustainable Development", colorClass: "purple" },
];

// Triple-win data
const TRIPLE_WIN_DATA = [
  {
    title: "For the Giver:",
    description: "Amplify joy—turn personal moments into lasting legacies.",
    cardClass: "giver",
  },
  {
    title: "For the Receiver:",
    description: "A child receives reliable nutrition, unlocking their full potential.",
    cardClass: "receiver",
  },
  {
    title: "For Society:",
    description: "Collective action boosts education, health, and economic growth.",
    cardClass: "society",
  },
];

// Zero-cost giving steps
const ZERO_COST_STEPS = [
  "Redirect existing celebration spending—no new money needed.",
  "Every amount matters: $20 has collective power alongside major pledges.",
  "Integrated seamlessly into digital platforms, making giving as easy as sending a text.",
];

// Initiative outcomes
const SOCIO_DAY_OUTCOMES = [
  "Mobilize millions toward urgent global challenges",
  "Amplify awareness through shared storytelling",
  "Ensure legacy by embedding generosity into global culture",
];

const SOCIO_CENTRES_OUTCOMES = [
  "School feeding systems across 100+ countries",
  "Sustainable nutrition for 500 million children annually",
];

// SVG Icons
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
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#F65314" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="#F65314" strokeWidth="2"/>
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

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="circle-blue"></div>
        <div className="circle-green"></div>
        <h1>Empowering humanity to make compassion a daily practice</h1>
      </section>

      {/* Humanity Fund Section */}
      <section className="humanity-fund-section">
        <div className="humanity-fund-container">
          <h2>Bsocio Humanity Fund</h2>
          <p>Perpetual engine designed to end classroom hunger worldwide and carry forward the mission of saving lives beyond 2045.</p>
        </div>
      </section>

      {/* Main Article Container */}
      <div className="article-container">
        {/* Our Story Section with Image */}
        <section className="story-section">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>What began as a 70th birthday tribute to Bill Gates has evolved into the <strong>Bsocio Like Bill Gates Movement</strong>—a global call to action dedicated to scaling his vision. Co-created by friends, believers, and changemakers worldwide, we are turning gratitude into action, proving that <strong>strategic kindness can solve humanity&apos;s greatest challenges</strong>.</p>
          </div>
          <div className="story-image">
            <Image
              src="/images/unity-collaboration.png"
              alt="Unity and collaboration"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Mission, Vision, Belief Cards */}
        <section className="cards-section">
          <div className="card mission">
            <div className="card-icon">
              <MissionIcon />
            </div>
            <h2>Our Mission</h2>
            <div className="card-content">
              <p>To inspire <strong>one billion acts of kindness</strong> by transforming everyday celebrations into shared moments of impact.</p>
            </div>
          </div>
          <div className="card vision">
            <div className="card-icon">
              <VisionIcon />
            </div>
            <h2>Our Vision</h2>
            <div className="card-content">
              <p>A world where <strong>compassion becomes our global culture</strong>—and every person sees themselves as a <strong>hero of change</strong>.</p>
            </div>
          </div>
          <div className="card belief">
            <div className="card-icon">
              <BeliefIcon />
            </div>
            <h2>Our Belief</h2>
            <div className="card-content">
              <p>Like Bill Gates, we believe <strong>true greatness is measured by how many people you lift</strong>.</p>
            </div>
          </div>
        </section>

        {/* Why This Movement Now */}
        <section className="why-now-section">
          <h2>Why This Movement Now?</h2>
          <p>Bill Gates has shown the world how focused generosity can transform health, education, and innovation. Yet with the Gates Foundation set to sunset in 2045, a critical question emerges: how do we ensure this momentum not only continues but grows?</p>
          <p className="highlight">Our answer: empower people everywhere to make compassion a daily practice.</p>
          <p>Bsocio is a $300 billion global action framework lovingly called the Future of Humanity Initiative, designed to honor, expand, and safeguard Bill Gates&apos;s philanthropic legacy.</p>
          <p className="highlight">A $9 billion annual funding gap threatens decades of progress</p>
          <p>To close it, our founding members have committed $3 billion to seed the Bsocio Humanity Fund—a perpetual engine designed to end classroom hunger worldwide and carry forward his mission of saving lives beyond 2045.</p>
          <p className="highlight">Now, it&apos;s our turn to carry it forward.</p>
        </section>

        {/* Anchoring Initiatives Cards */}
        <section className="initiatives-section">
          <h2>Anchoring Initiatives</h2>
          <div className="anchoring-cards">
            <div className="anchoring-card">
              <h3>Bill Gates Socio Day — October 28</h3>
              <p className="subtitle"><strong>A global day of action designed to be celebrated every year beyond his lifetime.</strong></p>
              <p>On this day, individuals and organizations redirect celebration spending toward child hunger, health, and education.</p>
              <ul>
                {SOCIO_DAY_OUTCOMES.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="anchoring-card">
              <h3>Bill Gates Socio Centres</h3>
              <p className="subtitle"><strong>Future global hubs of innovation and opportunity.</strong></p>
              <p className="outcomes-title"><strong>Key Outcomes:</strong></p>
              <ul>
                {SOCIO_CENTRES_OUTCOMES.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="highlight-text">So no child ever learns on an empty stomach.</p>
            </div>
          </div>
        </section>

        {/* How We Create Impact */}
        <section className="impact-section">
          <div className="impact-header">
            <h2>How We Create Impact</h2>
            <p className="impact-subtitle">We combine human-centered design with data-driven action to create lasting change across communities worldwide.</p>
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon-wrapper">
                <div className="impact-icon blue">
                  <DollarIcon />
                </div>
                <div className="impact-content">
                  <h3>Human-Centered Giving</h3>
                  <p>Solutions designed around real lives—not headlines.</p>
                </div>
              </div>
              <span className="impact-number" style={{ color: '#1F6AE1' }}>01</span>
            </div>
            <div className="impact-card">
              <div className="impact-icon-wrapper">
                <div className="impact-icon green">
                  <CheckCircleIcon />
                </div>
                <div className="impact-content">
                  <h3>Evidence-Led Action</h3>
                  <p>Data, accountability, and measurable outcomes.</p>
                </div>
              </div>
              <span className="impact-number" style={{ color: '#7CBB00' }}>02</span>
            </div>
            <div className="impact-card">
              <div className="impact-icon-wrapper">
                <div className="impact-icon orange">
                  <SunIcon />
                </div>
                <div className="impact-content">
                  <h3>Strategic Partnerships</h3>
                  <p>Working alongside governments, innovators, and communities.</p>
                </div>
              </div>
              <span className="impact-number" style={{ color: '#F65314' }}>03</span>
            </div>
            <div className="impact-card">
              <div className="impact-icon-wrapper">
                <div className="impact-icon purple">
                  <GlobeIcon />
                </div>
                <div className="impact-content">
                  <h3>Cultural Influence</h3>
                  <p>Turning global awareness into sustained action at scale.</p>
                </div>
              </div>
              <span className="impact-number" style={{ color: '#9B51E0' }}>04</span>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="focus-section">
          <h2>Focus Areas</h2>
          <div className="focus-grid">
            {FOCUS_AREAS.map((area, index) => (
              <div key={index} className="focus-item">
                <span className={`focus-bullet ${area.colorClass}`}></span>
                <p className="focus-text">{area.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Classroom Hunger Must End */}
        <section className="hunger-section">
          <h2>Why Classroom Hunger Must End</h2>
          <p>Classroom hunger is not just a crisis—it&apos;s a global economic emergency.</p>
          <ul className="hunger-list">
            <li><strong>45 million children</strong> arrive at school hungry daily.</li>
            <li>Malnutrition lowers the chance of completing primary school by <strong>20%</strong>.</li>
            <li>Countries lose up to <strong>10% of GDP</strong> to childhood stunting and malnutrition.</li>
          </ul>
          <p className="conclusion">Ending classroom hunger is one of the highest-return investments in human progress.</p>
        </section>
      </div>

      {/* Our Model Section with Background */}
      <div className="model-wrapper">
        <section className="model-section">
          <h2>Our Model: Turn Celebrations Into Change</h2>
          <p>Imagine if every birthday, wedding, or holiday gift could feed a child for a year.</p>
        </section>

        <section className="paradigm-shift">
          <h1>The Paradigm Shift</h1>
          <p>Each year, the global &quot;gift economy&quot; exceeds hundreds of billions of dollars. What if just 1% of that went toward ending classroom hunger?</p>
        </section>

        <section className="triple-win-section">
          <h2>How It Works: A Triple-Win</h2>
          <div className="triple-win-grid">
            {TRIPLE_WIN_DATA.map((item, index) => (
              <div key={index} className={`win-card ${item.cardClass}`}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="zero-cost-section">
          <h2>Zero-Cost, Frictionless Giving</h2>
          <div className="numbered-list">
            {ZERO_COST_STEPS.map((step, index) => (
              <div key={index} className="numbered-item">
                <div className="number-circle"><span>{index + 1}</span></div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="coalition-section">
          <h2>A Coalition for Our Shared Future</h2>
          <p>This mission is bigger than any institution—but achievable when humanity acts together. We are building a global coalition of philanthropists, governments, businesses, creators, and citizens to ensure no child ever learns on an empty stomach.</p>
        </section>
      </div>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
