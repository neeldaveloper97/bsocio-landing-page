import { Metadata } from "next";
import Link from "next/link";
import "./page.css";

export const metadata: Metadata = {
  title: "Terms of Use - Bsocio",
  description: "Read the terms and conditions for using the Bsocio platform.",
};

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function TermsPage() {
  return (
    <>
      {/* Terms Page */}
      <div className="legal-page">
        {/* Header */}
        <div className="legal-header">
          <h1>Bsocio App — Terms of Use</h1>
          <div className="legal-meta">
            <p><strong>Effective Date</strong>: October 28, 2025</p>
            <p><strong>Last Updated</strong>: October 28, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          {/* Section 1 */}
          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>Bsocio – The Future of Humanity Initiative</strong> (<strong>&quot;Bsocio,&quot; &quot;we,&quot; &quot;us,&quot;</strong> or <strong>&quot;our&quot;</strong>). These <strong>Terms of Use (&quot;Terms&quot;)</strong> govern your access to and use of the Bsocio mobile application, website, and any related services (collectively, the <strong>&quot;App&quot;</strong> or <strong>&quot;Services&quot;</strong>).
            </p>
            <p>
              By downloading, registering for, or using Bsocio, you agree to be bound by these Terms. If you do not agree, do not access or use our Services.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 2 */}
          <div className="legal-section">
            <h2>2. Purpose of Bsocio</h2>
            <p>
              Bsocio is a global platform built to <strong>empower individuals, artists, and communities</strong> to turn life&apos;s special moments into acts of kindness, generosity, and social impact. Through the App, users can participate in campaigns, events, donations, and programs aligned with <strong>The Future of Humanity Initiative</strong>.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 3 */}
          <div className="legal-section">
            <h2>3. Eligibility</h2>
            <p>
              You must be at least <strong>18 years old</strong> (or the age of majority in your jurisdiction) to use Bsocio. By creating an account, you represent and warrant that you meet this requirement and that the information you provide is accurate and complete.
            </p>
            <p>
              If you are using the App on behalf of an organization or group, you represent that you have authority to bind that entity to these Terms.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 4 */}
          <div className="legal-section">
            <h2>4. Account Registration and Security</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and up-to-date information during registration.</li>
              <li>Maintain the confidentiality of your login credentials.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <p>
              We are not responsible for any loss or damage resulting from your failure to protect your account information.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 5 */}
          <div className="legal-section">
            <h2>5. Use of the App</h2>
            <p>
              You agree to use Bsocio only for lawful purposes and in accordance with these Terms. You agree <strong>not to</strong>:
            </p>
            <ul>
              <li>Use the App for any fraudulent, misleading, or harmful purpose.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Interfere with or disrupt the operation of the App.</li>
              <li>Collect or store data about other users without consent.</li>
              <li>Post, upload, or distribute any offensive, defamatory, or infringing content.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate any account that violates these Terms.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 6 */}
          <div className="legal-section">
            <h2>6. Donations, Wallets, and Transactions</h2>
            <p>
              The Bsocio App may include tools for giving, receiving, or tracking donations and impact-based contributions.
            </p>
            <ul>
              <li><strong>Transparency:</strong> All transactions will be processed through approved payment gateways or partners.</li>
              <li><strong>Wallet Credits:</strong> Any credit or bonus in the Bsocio Wallet is for in-app use only and may not be exchanged for cash unless expressly stated.</li>
              <li><strong>No Guarantee of Refunds:</strong> Donations and contributions made through the App are generally <strong>non-refundable</strong>, except as required by applicable law.</li>
              <li><strong>Verification:</strong> Users may be required to complete Know Your Customer (KYC) verification before accessing certain features or receiving benefits.</li>
            </ul>
          </div>

          <div className="section-divider"></div>

          {/* Section 7 */}
          <div className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              All content on Bsocio — including logos, text, graphics, music, software, and trademarks — is the property of <strong>Future of Humanity Initiative, Bsocio</strong>, or its licensors.
            </p>
            <p>
              You are granted a limited, non-exclusive, revocable license to access and use the App for personal and non-commercial purposes.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or exploit any part of the App without prior written consent.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 8 */}
          <div className="legal-section">
            <h2>8. User-Generated Content</h2>
            <p>
              By submitting or sharing content (including text, images, or videos) through Bsocio, you grant Bsocio a <strong>non-exclusive, worldwide, royalty-free license</strong> to use, reproduce, display, and distribute that content in connection with the movement and its campaigns.
            </p>
            <p>
              You remain the owner of your content but agree that you will not post anything that infringes on others&apos; rights or violates any laws.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 9 */}
          <div className="legal-section">
            <h2>9. Partnerships and Collaborations</h2>
            <p>
              Bsocio may feature artists, organizations, or causes as part of its programs. Participation in any featured campaign or partnership is voluntary and subject to the specific program&apos;s terms, which may include eligibility, benefit distribution, and impact reporting conditions.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 10 */}
          <div className="legal-section">
            <h2>10. Privacy and Data Protection</h2>
            <p>Your privacy is important to us.</p>
            <p>
              Our <Link href="/privacy"><strong>Privacy Policy</strong></Link> explains how we collect, use, and protect your personal information when you use the App.
            </p>
            <p>
              By using Bsocio, you consent to our data practices as described in the Privacy Policy.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 11 */}
          <div className="legal-section">
            <h2>11. Disclaimers</h2>
            <p>
              Bsocio is provided on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis.
            </p>
            <p>
              We do not guarantee uninterrupted access, error-free functionality, or the accuracy of any data or impact metrics displayed in the App.
            </p>
            <p>
              We make no warranties, express or implied, regarding merchantability, fitness for purpose, or non-infringement.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 12 */}
          <div className="legal-section">
            <h2>12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Bsocio, its affiliates, and partners shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of data, revenue, or goodwill arising from your use of or inability to use the App.
            </p>
            <p>
              Our total liability for any claim shall not exceed the amount you have paid (if any) in connection with your use of Bsocio during the past twelve (12) months.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 13 */}
          <div className="legal-section">
            <h2>13. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time, without notice, if you violate these Terms or engage in conduct harmful to the community or the platform.
            </p>
            <p>
              Upon termination, your right to use the App will cease immediately, but certain sections (such as Intellectual Property, Disclaimers, and Limitation of Liability) will survive termination.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 14 */}
          <div className="legal-section">
            <h2>14. Modifications</h2>
            <p>
              We may update or revise these Terms from time to time.
            </p>
            <p>
              When we do, we will update the &quot;Last Updated&quot; date above. Continued use of the App after such updates constitutes acceptance of the new Terms.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 15 */}
          <div className="legal-section">
            <h2>15. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law principles.
            </p>
            <p>
              Any disputes arising from or related to these Terms shall first be resolved amicably through negotiation. If unresolved, disputes may be referred to arbitration or the courts of the applicable jurisdiction.
            </p>
          </div>

          <div className="section-divider"></div>

          {/* Section 16 */}
          <div className="legal-section">
            <h2>16. Contact Information</h2>
            <p>For questions, feedback, or support, please contact us:</p>
            <p><strong>Email</strong>: support@bsocio.org</p>
            <p><strong>Website</strong>: www.bsocio.org</p>
          </div>

          <div className="section-divider"></div>

          {/* Section 17 */}
          <div className="legal-section">
            <h2>17. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any applicable program agreements, constitute the entire agreement between you and Bsocio and supersede any prior agreements or understandings related to the Services.
            </p>
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
