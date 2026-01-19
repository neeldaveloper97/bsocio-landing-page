"use client";

import { useState } from "react";
import { useFAQs } from "@/hooks";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import "./page.css";

export default function FAQsPage() {
  const { faqs, isLoading, isError, error } = useFAQs();
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  const scrollToFaq = (id: string) => {
    setActiveId(id);
    const element = document.querySelector(`[data-faq="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Filter only published and active FAQs
  const displayedFAQs = faqs.filter(
    (faq) => faq.state === "PUBLISHED" && faq.status === "ACTIVE" && faq.visibility === "PUBLIC"
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="hero-container">
          <h1>Frequently Asked Questions</h1>
        </div>
      </section>

      {/* FAQ Main Content */}
      <section className="faq-main-content">
        <div className="faq-container">
          {/* Loading State */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>Loading FAQs...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p style={{ color: '#e53e3e' }}>
                {error?.message || "Failed to load FAQs. Please try again later."}
              </p>
            </div>
          )}

          {/* FAQ Content */}
          {!isLoading && !isError && displayedFAQs.length > 0 && (
            <>
              {/* Sidebar Navigation */}
              <aside className="faq-sidebar">
                <h3 className="sidebar-title">All Questions</h3>
                <nav className="faq-navigation">
                  {displayedFAQs.map((faq, index) => (
                    <button
                      key={faq.id}
                      className={`sidebar-nav-btn ${activeId === faq.id ? "active" : ""}`}
                      onClick={() => scrollToFaq(faq.id)}
                    >
                      {index + 1}. {faq.question}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Accordion Content */}
              <div className="faq-accordion">
                {displayedFAQs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`faq-item ${activeId === faq.id ? "active" : ""}`}
                    data-faq={faq.id}
                  >
                    <button
                      className="faq-button"
                      aria-expanded={activeId === faq.id}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="faq-header">
                        <span className="faq-number">{(index + 1).toString().padStart(2, "0")}</span>
                        <h3 className="faq-question">{faq.question}</h3>
                      </div>
                      <div className="faq-toggle-icon">
                        <span className="icon-plus"></span>
                      </div>
                    </button>
                    <div className="faq-answer-container">
                      <div 
                        className="faq-answer"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && displayedFAQs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>No FAQs available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
