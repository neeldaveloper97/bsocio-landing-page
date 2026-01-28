import { Metadata } from "next";
import Image from "next/image";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
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
import "./page.css";

export const metadata: Metadata = {
  title: "How It Works - Bsocio",
  description:
    "Learn how Bsocio works in just 4 easy steps. Our intelligent giving system automates generosity with zero out-of-pocket cost.",
};

// Use HIWDollarIcon as DollarIcon for this page (different color than About page)
const DollarIcon = HIWDollarIcon;

export default function HowItWorksPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="hiw-hero">
        <div className="hiw-hero-container">
          <h1>How It Works — In Just 4 Easy Steps</h1>
          <p>Our intelligent giving system automates generosity, allowing anyone to make an impact — with <span className="zero-highlight">zero out-of-pocket cost</span>.</p>
        </div>
      </section>

      {/* 4 Step Cards */}
      <section className="hiw-tabs">
        <div className="hiw-step-cards">
          <div className="hiw-step-card">
            <div className="hiw-step-icon">
              <GiftIcon />
            </div>
            <h3>Spread Kindness on Us</h3>
            <p>Get $250 with zero cost from your pocket to celebrate your birthday in style!</p>
            <a href="#step1" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">1</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon">
              <MedalIcon />
            </div>
            <h3>Become a Birthday Hero</h3>
            <p>Join a global movement and be honored worldwide for creating a lasting legacy.</p>
            <a href="#step2" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">2</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon hiw-icon-active">
              <ShareIcon />
            </div>
            <h3>Share Your Story</h3>
            <p>Use the world&apos;s first 100% community-first social platform to share your journey and spark change.</p>
            <a href="#step3" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">3</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon hiw-icon-active">
              <FlameIcon />
            </div>
            <h3>Carry the Torch</h3>
            <p>Help carry forward the mission of saving lives for generations to come.</p>
            <a href="#step4" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">4</div>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <div className="hiw-detailed-steps" id="detailedSteps">
        {/* Step 1: Spread Kindness */}
        <section className="hiw-step1" id="step1">
          <div className="hiw-container">
            <div className="hiw-step1-content">
              <div className="hiw-step-header">
                <div className="hiw-step-badge">1</div>
                <h2>Spread Kindness on Us</h2>
              </div>
              <p className="hiw-step-subtitle">Get <strong>$250</strong>, absolutely free, to celebrate your birthday in style!
Accept invitation/Sign up (it&apos;s free!) and instantly receive <strong>$250 in your Bsocio Wallet</strong></p>

              <ul className="hiw-checklist">
                <li>Pledge $50 each to five friends for their birthdays.</li>
                <li>Those same five friends pledge $50 back to you.</li>
                <li>On your birthday, you receive $250 — plus a $20 donation made in your name to feed a hungry child.</li>
                <li>Use your $250 however you like, or transfer it to your bank.</li>
              </ul>

              <div className="hiw-highlight-box">
                <DollarIcon />
                <div>
                  <h3>Zero Cost From Your Pocket</h3>
                  <p>Your $250 reward covers your pledge.
It&apos;s a win for you, a win for your friends, and a win for children everywhere.</p>
                </div>
              </div>
            </div>

            <div className="hiw-wallet-card">
              <WalletIcon />
              <h3>Your $250 Wallet</h3>
              <div className="hiw-wallet-footer">
                <HeartIcon />
                <p>A win-win for everyone</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Birthday Hero */}
        <section className="hiw-step2" id="step2">
          <div className="hiw-container">
            <div className="hiw-step-header-centered">
              <div className="hiw-step-badge">2</div>
              <h2>Become a Birthday Hero</h2>
            </div>
            <p className="hiw-step-subtitle-centered">Your generosity earns you a place in the <strong>Birthday Hero Hall of Fame</strong>,
 celebrated globally at the <strong>Bsocio Hero Festival</strong>— hosted in <strong>California, New York, London</strong>, and more.</p>

            <p className="hiw-step-subtitle-centered" style={{ fontWeight: 600, color: 'var(--secondary-green)', marginTop: '2rem' }}>Experience the Celebration:</p>

            <div className="hiw-feature-grid">
              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <TrophyIcon />
                </div>
                <div>
                  <h3>Birthday Hero Index</h3>
                  <p>a live AI leaderboard of global kindness.</p>
                </div>
              </div>

              <div className="hiw-feature-card orange">
                <div className="hiw-feature-icon orange">
                  <CrownIcon />
                </div>
                <div>
                  <h3>Hunger Hero Crowning</h3>
                  <p>medals, recognition, and worldwide fame.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <AwardIcon />
                </div>
                <div>
                  <h3>Hunger Games Arena</h3>
                  <p>thrilling competitions for a cause.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <CakeIcon />
                </div>
                <div>
                  <h3>Giant Cake Parade</h3>
                  <p>the sweetest global celebration.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <StarIcon />
                </div>
                <div>
                  <h3>Impact Stage</h3>
                  <p>surprise guests, celebrities, and humanitarian icons.</p>
                </div>
              </div>
            </div>

            <p className="hiw-step-subtitle-centered" style={{ marginTop: '2rem' }}>Your name, your story, and your kindness — all celebrated in the world&apos;s largest kindness festival.</p>
          </div>
        </section>

        {/* Step 3: Share Story */}
        <section className="hiw-step3" id="step3">
          <div className="hiw-container hiw-step3-layout">
            <div className="hiw-step3-visual">
              <div className="hiw-community-card">
                <CommunityIcon />
                <h3>Community First</h3>
                <p>Social Platform</p>
              </div>
            </div>

            <div className="hiw-step3-content">
              <div className="hiw-step-header">
                <div className="hiw-step-badge">3</div>
                <h2>Share Your Story</h2>
              </div>
              <p className="hiw-step-subtitle">Join the world&apos;s first <strong>AI-powered, community-first social platform</strong> built around purpose.</p>
              <p className="hiw-step-subtitle">Bsocio turns your birthday celebrations into stories that inspire and uplift.</p>
              <ul className="hiw-checklist">
                <li>Create your personalized impact feed.</li>
                <li>Invite friends and family to celebrate meaningfully.</li>
                <li>Connect with brands, creators, and changemakers.</li>
                <li>Share how your birthday powers purpose.</li>
              </ul>

              <p>Bsocio isn&apos;t just a platform. It&apos;s a movement of people who believe one day can change everything.</p>

              <div className="hiw-quote-box">
                <p>Your birthday isn&apos;t just about you anymore —
<strong>It&apos;s about the future you create.</strong></p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Carry the Torch */}
        <section className="hiw-step4" id="step4">
          <div className="hiw-container">
            <div className="hiw-step-header-centered">
              <div className="hiw-step-badge">4</div>
              <h2>Carry the Torch</h2>
            </div>
            <p className="hiw-step-subtitle-centered">Carry forward the mission of saving and improving lives for generations to come.

You don&apos;t need to be a billionaire to create a billionaire-level impact.</p>
            <p><strong>Your birthday alone can change lives</strong></p>

            <div className="hiw-scale-section">
              <div className="hiw-scale-card">
                <h3>How do you do it?</h3>
                <div className="hiw-scale-divider"></div>

                <div className="hiw-scale-content">
                  <div className="hiw-scale-item blue">
                    <p>Imagine you&apos;re 20 years old, with 60 birthdays ahead.</p>
                  </div>
                  <div className="hiw-scale-item green">
                    <p>Each year, <strong>$20</strong> is donated in your name to help end child hunger.</p>
                  </div>
                  <div className="hiw-scale-item orange">
                    <p>That&apos;s <strong>$1,200</strong> in lifetime impact—from birthdays you were already going to celebrate.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hiw-divider"></div>

            <div className="hiw-scale-text">
              <p className="hiw-scale-heading">Now, imagine this at scale.</p>
              <p>Every year, 245 million Americans exchange gifts, spending $162 billion—projected to reach $388 billion by 2027. If even a small fraction of the world&apos;s 5 billion social media users joined Bsocio, we could unlock <strong>$300 billion in lifetime giving</strong>— enough to end child hunger for good and carry forward the mission of saving lives beyond 2045.</p>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section className="hiw-legacy">
          <div className="hiw-container-wide">
            <h2>The Bsocio Impact Vision</h2>

            <div className="hiw-legacy-content">
              <div className="hiw-legacy-image">
                <Image
                  src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/thinkinggirl.png"
                  alt="Thinking Girl"
                  width={500}
                  height={500}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="hiw-legacy-text">
                <p>These funds will build <strong style={{ color: '#F65314' }}>Bsocio Centres</strong> worldwide— named after the greatest humanitarian heroes of our time. Each centre will serve as a <strong>hub of innovation, learning, and opportunity,</strong> equipped with school feeding systems across <strong>100+ countries</strong>, delivering sustainable nutrition to <strong>500 million children every year.</strong> So no child ever has to learn on an empty stomach.</p>
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
