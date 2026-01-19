import Link from "next/link";

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function CtaImpactSection() {
  return (
    <section className="cta-impact-section">
      <div className="cta-impact-container">
        <div className="cta-impact-header">
          <h2>Bsocio means "Be Kind to Be Great — like Bill Gates."</h2>
        </div>
        
        <div className="cta-main-card">
          <div className="cta-legacy-section">
            <h3>A True Legacy Isn't Remembered</h3>
            <div className="legacy-boxes">
              <div className="legacy-box">
                <span>Its lived</span>
              </div>
              <div className="legacy-box">
                <span>Its Shared</span>
              </div>
              <div className="legacy-box">
                <span>It's Passed on</span>
              </div>
            </div>
          </div>

          <h3 className="cta-torch-heading">Ready to Carry The Torch?</h3>

          <ul className="cta-benefits-list">
            <li>
              <CheckIcon />
              <span>You get <strong>$250</strong> to celebrate your birthday with kindness</span>
            </li>
            <li>
              <CheckIcon />
              <span>Feed Hungry children in your name</span>
            </li>
            <li>
              <CheckIcon />
              <span>Be honored globally as a birthday Hero</span>
            </li>
            <li>
              <CheckIcon />
              <span>Zero cost out of pocket</span>
            </li>
          </ul>

          <Link href="/signup" className="btn-primary btn-large" style={{ display: 'block', textAlign: 'center', maxWidth: '400px', margin: '16px auto 0' }}>
            Accept Your Free $250 Gift
          </Link>
          
        </div>
      </div>
    </section>
  );
}
