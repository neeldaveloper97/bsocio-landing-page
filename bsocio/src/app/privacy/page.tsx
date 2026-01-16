import { Metadata } from "next";
import Link from "next/link";
import "./page.css";

export const metadata: Metadata = {
  title: "Privacy Policy - Bsocio",
  description: "Learn how Bsocio collects, uses, and protects your personal data.",
};

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function PrivacyPage() {
  return (
    <>
      {/* Privacy Page */}
      <div className="legal-page">
        {/* Header */}
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p><strong>Effective Date</strong>: October 28, 2025</p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <p className="legal-intro">
            <strong>Bsocio – The Future of Humanity Initiative</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains what information we collect, how we use and share it, and the choices you have regarding your personal information. By using our services, you consent to this Privacy Policy.
          </p>

          {/* Section 1 */}
          <div className="legal-section">
            <h2>1. About Us</h2>
            <p>
              Welcome to the <strong>Bsocio Like Bill Gates Movement</strong> — a community-driven platform that empowers individuals and organizations to connect, collaborate, and take action toward a better future for humanity.
            </p>
            <p>
              Bsocio leverages social connectivity and peer-to-peer engagement to unlock resources for large-scale humanitarian causes. Our mission is to address global challenges through innovation, compassion, and collective impact.
            </p>
            <p>
              All information collected by Bsocio is stored securely, primarily on servers located in the United States, unless stated otherwise.
            </p>
            <h3>Our Inspiration</h3>
            <p>
              We believe that humanity&apos;s greatest challenges can be overcome through innovation, collaboration, and shared purpose. Our platform channels global connectivity and resources into creating sustainable, meaningful change for communities worldwide.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 2 */}
          <div className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>
              We collect various types of information to operate effectively and deliver personalized, secure services. This includes:
            </p>

            <div className="subsection">
              <h3>a. Information You Provide</h3>
              <p>When you sign up, create content, or communicate on our platform, we collect:</p>
              <ul>
                <li>Personal details (e.g., name, address, phone number, and email).</li>
                <li>User-generated content, messages, and related metadata (such as timestamps).</li>
                <li>Account preferences and profile information.</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>b. Networks and Connections</h3>
              <p>
                We collect data about your connections, followers, and interactions across our platform. This may include imported contacts or communication histories, helping us improve connectivity features.
              </p>
            </div>

            <div className="subsection">
              <h3>c. Transactional Information</h3>
              <p>When you make a purchase or donation, we collect:</p>
              <ul>
                <li>Payment details (credit/debit card or other payment information).</li>
                <li>Billing, shipping, and contact details.</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>d. Information from Others</h3>
              <p>
                We may receive information about you when others interact with your content (e.g., comments, tags, or messages).
              </p>
            </div>

            <div className="subsection">
              <h3>e. Device Information</h3>
              <p>We collect information from the devices you use, such as:</p>
              <ul>
                <li>Device type, operating system, browser type, IP address, and activity logs.</li>
                <li>Device identifiers to help us deliver a consistent experience across devices.</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>f. Cookies and Tracking Technologies</h3>
              <p>
                We use cookies to improve your experience, analyze site performance, and deliver personalized content.
              </p>
              <ul>
                <li><strong>Required cookies</strong>: Essential for site functionality.</li>
                <li><strong>Performance cookies</strong>: Measure site usage and improve performance.</li>
                <li><strong>Functional cookies</strong>: Remember your preferences.</li>
                <li><strong>Advertising cookies</strong>: Deliver relevant ads and promotions.</li>
              </ul>
              <p>
                You can disable cookies through your browser settings, but some features may not function properly.
              </p>
            </div>

            <div className="subsection">
              <h3>g. Customer Surveys</h3>
              <p>
                Participation in surveys is voluntary. Any personal information provided remains confidential, even when collected via third-party providers.
              </p>
            </div>

            <div className="subsection">
              <h3>h. Social Media Features</h3>
              <p>
                Our site may include social media features (e.g., Facebook &quot;Like&quot; buttons). These may collect your IP address and set cookies. Interactions are governed by the respective platform&apos;s privacy policy.
              </p>
            </div>

            <div className="subsection">
              <h3>i. Third-Party Websites</h3>
              <p>
                This policy does not cover third-party websites linked to our platform. We encourage you to review their privacy practices independently.
              </p>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 3 */}
          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li><strong>Provide and improve our services</strong> — personalize your experience and deliver relevant content.</li>
              <li><strong>Enhance security</strong> — verify accounts, detect fraudulent activities, and maintain platform integrity.</li>
              <li><strong>Measure performance</strong> — analyze engagement, trends, and service effectiveness.</li>
              <li><strong>Communicate with you</strong> — send service updates, newsletters, and respond to inquiries.</li>
              <li><strong>Advance research and innovation</strong> — conduct research on topics aligned with social impact, health, and development.</li>
            </ul>
          </div>

          <div className="section-divider"></div>

          {/* Section 4 */}
          <div className="legal-section">
            <h2>4. Information Sharing</h2>
            <p>
              We do <strong>not</strong> sell your personal data. However, we may share information under the following circumstances:
            </p>

            <div className="subsection">
              <h3>a. Within the Bsocio Platform</h3>
              <ul>
                <li><strong>User Interactions</strong>: Information you share or publish may be visible to your selected audience.</li>
                <li><strong>Shared Content</strong>: Others may reshare your content. If you wish to report shared content, contact us directly.</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>b. Third-Party Partners and Service Providers</h3>
              <p>
                We may share data with trusted vendors who support our operations (e.g., payment processors, analytics providers). These partners must adhere to strict confidentiality and data protection standards.
              </p>
            </div>

            <div className="subsection">
              <h3>c. Research and Academic Institutions</h3>
              <p>
                We may share aggregated, non-personally identifiable data to support research that advances social welfare, technology, or health.
              </p>
            </div>

            <div className="subsection">
              <h3>d. Law Enforcement and Legal Requests</h3>
              <p>
                We may disclose information if required by law or to protect rights, property, or the safety of our users and community.
              </p>
            </div>

            <div className="subsection">
              <h3>e. Business Transfers</h3>
              <p>
                If our business or assets are merged or sold, user information may be transferred to the new entity under the same privacy commitments.
              </p>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 5 */}
          <div className="legal-section">
            <h2>5. Your Choices and Rights</h2>

            <div className="subsection">
              <h3>a. Access and Updates</h3>
              <p>
                You can access, correct, or delete your personal information by contacting us or managing your account settings.
              </p>
            </div>

            <div className="subsection">
              <h3>b. Opt-Out Options</h3>
              <p>
                You can unsubscribe from promotional communications using the link in our emails. Note that you will still receive essential service or account notifications.
              </p>
            </div>

            <div className="subsection">
              <h3>c. Public Forums</h3>
              <p>
                Any information shared in public sections of our platform becomes publicly accessible. To request removal, contact us. We will assist where technically feasible.
              </p>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 6 */}
          <div className="legal-section">
            <h2>6. Data Security</h2>
            <p>
              We implement advanced technical, administrative, and physical safeguards to protect your data from unauthorized access, misuse, or disclosure. Sensitive information (e.g., payment data) is transmitted using <strong>SSL encryption</strong> and stored securely.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 7 */}
          <div className="legal-section">
            <h2>7. Children&apos;s Privacy</h2>
            <p>
              Our platform is not directed toward children under 13. We do not knowingly collect personal data from minors. If such data is inadvertently collected, we will delete it promptly upon discovery.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 8 */}
          <div className="legal-section">
            <h2>8. Policy Updates</h2>
            <p>
              We may revise this Privacy Policy periodically. If material changes occur, we will notify users and provide the option to opt out of differing uses. Please review this page regularly for updates.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 9 */}
          <div className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions, requests, or complaints regarding this Privacy Policy, please contact:
            </p>
            <p><strong>Email</strong>: support@bsocio.org</p>
            <p><strong>Website</strong>: www.bsocio.org</p>
          </div>
        </div>
      </div>

      {/* CTA Impact Section */}
      <section className="cta-impact-section">
        <div className="cta-impact-container">
          <div className="cta-impact-header">
            <h2>Your Kindness Creates Lasting Change</h2>
          </div>
          
          <div className="cta-main-card">
            <div className="cta-legacy-section">
              <h3>Join a Movement That&apos;s Changing the World</h3>
              <div className="legacy-boxes">
                <div className="legacy-box">
                  <span>End Classroom Hunger</span>
                </div>
                <div className="legacy-box">
                  <span>Save Lives Beyond 2045</span>
                </div>
                <div className="legacy-box">
                  <span>Create Lasting Impact</span>
                </div>
              </div>
            </div>

            <div className="cta-narrative-stripe">
              <p>When you celebrate your birthday with Bsocio, you&apos;re not just receiving a gift—you&apos;re becoming part of a global movement to ensure no child learns on an empty stomach.</p>
            </div>

            <h3 className="cta-torch-heading">Your $250 Birthday Gift Can:</h3>

            <ul className="cta-benefits-list">
              <li>
                <CheckIcon />
                <span><strong>Feed a child</strong> for an entire school year</span>
              </li>
              <li>
                <CheckIcon />
                <span><strong>Support education</strong> by ensuring kids can focus on learning, not hunger</span>
              </li>
              <li>
                <CheckIcon />
                <span><strong>Join 1 billion acts of kindness</strong> transforming our world</span>
              </li>
              <li>
                <CheckIcon />
                <span><strong>Celebrate with purpose</strong> and become a Birthday Hero</span>
              </li>
            </ul>

            <Link href="/signup" className="btn-primary btn-large" style={{ display: 'block', textAlign: 'center', maxWidth: '400px', margin: '16px auto 0' }}>
              Accept Your Free $250 Gift
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
