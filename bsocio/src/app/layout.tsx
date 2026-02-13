import type { Metadata, Viewport } from "next";
import { dmSans, arimo } from "@/lib/fonts";

import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateMetadata as createMetadata,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import ClientProviders from "@/components/providers/ClientProviders";
import LayoutShell from "@/components/layout/LayoutShell";

// ============================================
// METADATA & VIEWPORT
// ============================================

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" },
  ],
};

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <JsonLd data={[generateOrganizationSchema(), generateWebsiteSchema()]} />
        {/* Performance: preconnect to image CDN */}
        <link rel="preconnect" href="https://bsocio-bucket.s3.us-east-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://bsocio-bucket.s3.us-east-1.amazonaws.com" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        )}
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Apple Touch Icon - uses favicon for now */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${dmSans.variable} ${arimo.variable} flex min-h-screen flex-col bg-background text-foreground antialiased font-sans m-0 p-0`} suppressHydrationWarning>
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        <ClientProviders>
          <LayoutShell>
            {children}
          </LayoutShell>
        </ClientProviders>
      </body>
    </html>
  );
}

