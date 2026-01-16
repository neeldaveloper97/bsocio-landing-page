"use client";

import { useState } from "react";
import Link from "next/link";
import { useFAQs } from "@/hooks";
import "./page.css";

function CheckIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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
