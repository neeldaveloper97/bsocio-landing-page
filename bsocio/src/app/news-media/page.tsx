import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./page.css";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

// Lazy load client components for better FCP
const NewsFilters = dynamic(() => import("./NewsFilters"), {
  loading: () => (
    <div className="news-filters" aria-label="Loading filters">
      <div className="filters-container">
        <div className="skeleton" style={{ width: '100px', height: '44px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '44px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ width: '130px', height: '44px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ width: '140px', height: '44px', borderRadius: '12px' }}></div>
      </div>
    </div>
  ),
});

// Lazy load below-the-fold section
const CtaImpactSection = dynamic(
  () => import("@/components/layout/CtaImpactSection"),
  { loading: () => <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-primary/5" /> }
);

// ============================================
// SEO METADATA
// ============================================

export const metadata: Metadata = generateSeoMetadata({
  title: "News & Media",
  description:
    "Stay informed on Bsocio milestones, recognitions, and global impact stories. Official updates, announcements, and media coverage.",
  pathname: "/news-media",
});

// Featured articles (static content for media coverage)
const featuredArticles = [
  {
    source: "Forbes",
    title: "The Future of Philanthropic Social Networks",
    excerpt: "Bsocio is pioneering a revolutionary model that combines social networking with meaningful giving...",
    link: "#",
  },
  {
    source: "TechCrunch",
    title: "How Bsocio Is Rewriting the Rules of Social Giving",
    excerpt: "With AI-powered personalization and zero-cost participation, Bsocio is making philanthropy accessible...",
    link: "#",
  },
  {
    source: "The Guardian",
    title: "Birthday Celebrations Become Global Movement for Change",
    excerpt: "What started as an inspired idea has quickly evolved into a worldwide phenomenon transforming lives...",
    link: "#",
  },
];

export default function NewsMediaPage() {
  return (
    <>
      {/* Hero Section - Static for fast LCP */}
      <section className="news-hero" aria-labelledby="news-hero-title">
        <div className="hero-container">
          <h1 id="news-hero-title">News & Media</h1>
          <p className="subtitle">Official updates, announcements, and media coverage</p>
          <p className="description">Stay informed on milestones, recognitions, and global impact stories</p>
        </div>
      </section>

      {/* Client Island - Interactive filters and news grid */}
      <NewsFilters />

      {/* Featured Coverage - Static content */}
      <section className="featured-coverage below-fold" aria-labelledby="featured-coverage-title">
        <div className="featured-container">
          <h2 id="featured-coverage-title">Featured Coverage</h2>
          <div className="featured-grid">
            {featuredArticles.map((article, index) => (
              <article key={index} className="featured-article">
                <div className="featured-source">{article.source}</div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <a 
                  href={article.link}
                  aria-label={`Read full article from ${article.source}: ${article.title}`}
                >
                  Read Full Article →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
