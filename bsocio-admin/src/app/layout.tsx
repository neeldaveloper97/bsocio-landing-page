import type { Metadata, Viewport } from "next";
import { Inter, Arimo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional", // Use optional for better LCP
  preload: true,
  adjustFontFallback: true,
});

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional", // Use optional for better LCP
  preload: true,
  adjustFontFallback: true,
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
        {/* Critical resource hints for LCP optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
          </>
        )}
        {/* Inline critical CSS for faster LCP and reduced TBT */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical above-fold styles */
          .dashboard-intro{margin-bottom:2rem}
          .dashboard-intro h2{color:#1F6AE1;font-size:clamp(1.5rem,3vw,2rem);font-weight:600;margin-bottom:.5rem}
          .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;margin-top:1rem;contain:layout paint}
          .stat-card{background:#fff;border:1px solid #E5E7EB;border-radius:.5rem;padding:1.5rem;min-height:140px;contain:layout style}
          /* Sidebar critical styles */
          .sidebar{width:280px;background:#101828;min-height:100vh;position:fixed;left:0;top:0;contain:layout style}
          .main-wrapper{margin-left:280px;padding:24px;min-height:100vh;background:#F3F4F6}
          /* Performance hints */
          .content-section{contain:layout style}
          .data-table-container{content-visibility:auto;contain-intrinsic-size:auto 600px}
        `}} />
      </head>
      <body className={`${inter.variable} ${arimo.variable} font-sans`}>
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
