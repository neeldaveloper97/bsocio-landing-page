import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

// Lazy load client components for better FCP
const NewsFilters = dynamic(() => import("./NewsFilters"), {
  loading: () => (
    <section className="flex justify-center border-b border-border bg-muted/30 px-4 py-6" aria-label="Loading filters">
      <div className="flex flex-wrap justify-center gap-3">
        <div className="h-11 w-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-11 w-32 animate-pulse rounded-xl bg-muted" />
        <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" />
      </div>
    </section>
  ),
});

const CtaImpactSection = dynamic(
  () => import("@/components/layout/CtaImpactSection"),
  { loading: () => <section className="w-full bg-primary/5 py-12 sm:py-16 md:py-20 lg:py-24" /> }
);

export const metadata: Metadata = generateSeoMetadata({
  title: "News & Media",
  description:
    "Stay informed on Bsocio milestones, recognitions, and global impact stories. Official updates, announcements, and media coverage.",
  pathname: "/news-media",
});

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
      {/* Hero Section */}
      <section
        className="flex justify-center border-b border-border bg-muted/30 px-5 py-16 sm:px-20 md:py-20"
        aria-labelledby="news-hero-title"
      >
        <div className="max-w-4xl text-center">
          <h1
            id="news-hero-title"
            className="mb-6 text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl"
          >
            News & Media
          </h1>
          <p className="mb-2 text-lg text-foreground sm:text-xl">
            Official updates, announcements, and media coverage
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            Stay informed on milestones, recognitions, and global impact stories
          </p>
        </div>
      </section>

      {/* Client Island - Interactive filters and news grid */}
      <NewsFilters />

      {/* Featured Coverage */}
      <section
        className="border-t border-border bg-muted/30 px-4 py-12 sm:px-8 md:py-16"
        aria-labelledby="featured-coverage-title"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="featured-coverage-title"
            className="mb-8 text-center text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl"
          >
            Featured Coverage
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <article
                key={index}
                className="rounded-lg border border-border bg-card p-6 sm:p-8"
              >
                <div className="mb-4 text-xs font-bold uppercase tracking-wide text-secondary sm:text-sm">
                  {article.source}
                </div>
                <h3 className="mb-4 text-lg font-bold leading-snug text-foreground sm:text-xl">
                  {article.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-foreground sm:text-base">
                  {article.excerpt}
                </p>
                <a
                  href={article.link}
                  className="inline-flex min-h-11 items-center font-bold text-primary hover:underline"
                  aria-label={`Read full article from ${article.source}: ${article.title}`}
                >
                  Read Full Article →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaImpactSection />
    </>
  );
}
