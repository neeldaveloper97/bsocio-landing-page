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
  variable: "--font-sans",
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
          *{box-sizing:border-box}
          .admin-dashboard{display:flex;min-height:100vh;background:#F3F4F6;width:100%;overflow-x:hidden}
          .admin-sidebar{position:fixed;width:280px;height:100vh;left:0;top:0;background:#101828;display:flex;flex-direction:column;z-index:50;flex-shrink:0}
          .admin-main{flex:1;display:flex;flex-direction:column;margin-left:280px;min-height:100vh;min-width:0;max-width:calc(100vw - 280px);width:100%}
          .admin-header{position:sticky;top:0;background:#fff;border-bottom:1px solid #E5E7EB;z-index:30;padding:0}
          .admin-header>div{padding:16px 32px}
          .admin-content{flex:1;padding:32px;overflow-x:auto;overflow-y:auto;max-width:100%;min-width:0;width:100%}
          /* Mobile responsive */
          @media(max-width:1024px){
            .admin-sidebar{transform:translateX(-100%);transition:transform 0.3s;max-width:85vw}
            .admin-sidebar.active{transform:translateX(0)}
            .admin-main{margin-left:0;padding-top:64px;max-width:100vw;width:100%}
            .admin-header{top:64px}
            .admin-header>div{padding:16px 20px}
            .admin-content{padding:24px 20px}
            .mobile-admin-navbar{display:flex!important}
          }
          @media(max-width:768px){
            .admin-header>div{padding:12px 16px}
            .admin-content{padding:20px 16px}
          }
          @media(max-width:640px){
            .admin-content{padding:16px 12px}
          }
          @media(max-width:480px){
            .admin-content{padding:12px 8px}
            .mobile-admin-navbar{padding:0 12px}
          }
          .mobile-admin-navbar{display:none;position:fixed;top:0;left:0;right:0;height:64px;background:#101828;z-index:50;padding:0 16px;align-items:center;justify-content:space-between}
          .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;opacity:0;visibility:hidden;transition:opacity 0.3s}
          .sidebar-overlay.active{opacity:1;visibility:visible}
          @media(max-width:1024px){.sidebar-overlay{display:block}}
          /* Performance hints */
          .content-section{contain:layout style}
          .page-content{display:flex;flex-direction:column;gap:32px;width:100%;min-width:0;max-width:100%}
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
