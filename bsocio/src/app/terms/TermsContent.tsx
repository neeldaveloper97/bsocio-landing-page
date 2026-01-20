"use client";

import ReactMarkdown from "react-markdown";
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
          <ReactMarkdown
  components={{
    h2: ({ children }) => (
      <div className="legal-section">
        <h2>{children}</h2>
      </div>
    ),

    h3: ({ children }) => (
      <div className="subsection">
        <h3>{children}</h3>
      </div>
    ),

    p: ({ children }) => <p>{children}</p>,

    ul: ({ children }) => <ul>{children}</ul>,

    li: ({ children }) => <li>{children}</li>,

    hr: () => <div className="section-divider" />,
  }}
>
  {legalContent.content}
</ReactMarkdown>
        </div>
      </div>

      <CtaImpactSection />
    </>
  );
}