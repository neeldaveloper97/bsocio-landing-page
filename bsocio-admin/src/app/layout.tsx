import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

/**
 * ============================================
 * MOBILE PERFORMANCE OPTIMIZATIONS (Next.js 16)
 * ============================================
 * - Single font (Inter only) - saves 50KB+
 * - WebVitals in Client Component (ssr:false not allowed in Server)
 * - Direct ClientProviders import (better tree-shaking)
 * - Minimal critical CSS inline
 * ============================================
 */

// Single optimized font - Inter variable with minimal weights
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Only needed weights
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Bsocio Admin Dashboard",
  description: "Admin panel for Bsocio platform management",
  robots: "noindex, nofollow", // Admin should not be indexed
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1F6AE1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* API preconnect for faster data fetching */}
        {process.env.NEXT_PUBLIC_API_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientProviders>
          {/* Skip to main content - Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
