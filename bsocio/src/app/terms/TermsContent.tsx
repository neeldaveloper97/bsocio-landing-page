"use client";

import { useLegal } from "@/hooks";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

export default function TermsContent() {
  const { legalContent, isLoading, isError } = useLegal("TERMS_OF_USE");

  if (isLoading) {
    return (
      <div className="legal-page">
        <div className="legal-header">
          <h1>Terms of Use</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !legalContent) {
    return (
      <div className="legal-page">
        <div className="legal-header">
          <h1>Terms of Use</h1>
          <p>Unable to load terms of use. Please try again later.</p>
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