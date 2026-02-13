import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Component to render JSON-LD structured data for SEO.
 * Use this in page layouts to add schema.org structured data.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

/**
 * Generate breadcrumb structured data for navigation.
 */
export function BreadcrumbJsonLd({
  items,
  baseUrl = "https://bsocio.org",
}: BreadcrumbJsonLdProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return <JsonLd data={breadcrumbData} />;
}
