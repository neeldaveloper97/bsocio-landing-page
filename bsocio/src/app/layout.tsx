import type { Metadata, Viewport } from "next";
import { DM_Sans, Arimo } from "next/font/google";
import dynamic from "next/dynamic";

import "./globals.css";
import Header from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateMetadata as createMetadata,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";

// Lazy load Footer - not needed for initial render
const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => <footer className="w-full bg-slate-900 h-64" aria-hidden="true" />,
});

// Lazy load ClientProviders - heavy dependencies (Google OAuth, React Query)
const ClientProviders = dynamic(
  () => import("@/components/providers/ClientProviders"),
  { ssr: true }
);

// ============================================
// OPTIMIZED FONT LOADING
// ============================================

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
});

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-arimo",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
});

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
          <Header />

          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>

          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
