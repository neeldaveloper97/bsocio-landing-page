"use client";

import { useLegal } from "@/hooks";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

export default function PrivacyContent() {
  const { legalContent, isLoading, isError } = useLegal("PRIVACY_POLICY");

  if (isLoading) {
    return (
      <div className="legal-page">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !legalContent) {
    return (
      <div className="legal-page">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Unable to load privacy policy. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="legal-page">
        <div className="legal-header">
          <h1>{legalContent.title}</h1>
          <p><strong>Effective Date</strong>: {new Date(legalContent.effectiveDate).toLocaleDateString()}</p>
        </div>

        <div className="legal-content">
          <div dangerouslySetInnerHTML={{ __html: legalContent.content }} />
        </div>
      </div>

      <CtaImpactSection />
    </>
  );
}