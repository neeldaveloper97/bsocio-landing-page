import type { Metadata } from "next";

// ============================================
// SEO CONFIGURATION & UTILITIES
// ============================================

export const siteConfig = {
  name: "Bsocio",
  title: "Bsocio - The Future of Humanity Initiative",
  description:
    "Empowering humanity to make compassion a daily practice. Join the Bsocio Like Bill Gates Movement and receive $250 to celebrate your birthday with kindness.",
  url: "https://bsocio.org",
  ogImage: "/images/og-image.jpg",
  twitterHandle: "@bsocio",
  keywords: [
    "Bsocio",
    "philanthropy",
    "charity",
    "Bill Gates",
    "humanitarian",
    "birthday giving",
    "child hunger",
    "social impact",
    "donation",
    "kindness movement",
  ],
} as const;

// ============================================
// METADATA GENERATOR
// ============================================

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
  pathname = "",
}: GenerateMetadataProps = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = `${siteConfig.url}${pathname}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    sameAs: [
      "https://facebook.com/bsocio",
      "https://twitter.com/bsocio",
      "https://linkedin.com/company/bsocio",
      "https://instagram.com/bsocio",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  pathname: string;
}

export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = siteConfig.name,
  pathname,
}: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${pathname}`,
    },
  };
}

interface FAQSchemaProps {
  questions: Array<{ question: string; answer: string }>;
}

export function generateFAQSchema({ questions }: FAQSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  image?: string;
  pathname: string;
}

export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  venue,
  image,
  pathname,
}: EventSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: name,
    description: description,
    startDate: startDate,
    endDate: endDate || startDate,
    location: {
      "@type": "Place",
      name: venue || location,
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    },
    image: image || siteConfig.ogImage,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}${pathname}`,
  };
}
