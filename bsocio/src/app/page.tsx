"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { montserrat, openSans } from "@/lib/fonts";
import HomeView from "@/components/home/HomeView";

// Lazy load LeadershipView (President/Team) to reduce initial bundle size
const LeadershipView = dynamic(() => import("@/components/home/LeadershipView"), {
  ssr: true, // We want it to be SEO friendly eventually, but for now lazy loading main JS is key. 
  // Actually, for "Coming Soon" page, SEO for these tabs might be less critical than "Home", 
  // but let's keep SSR true for now or false if we want pure client loading. 
  // Given the user flow, clicked tabs should probably be client-side.
  loading: () => <div className="h-screen flex items-center justify-center bg-white"><div className="animate-pulse h-12 w-12 rounded-full bg-gray-200"></div></div>,
});

/* =============================================================
   Bsocio Humanity Fund – Coming Soon page
   Refactored for Performance (Lighthouse)
   ============================================================= */

// ─── Tab type ────────────────────────────────────────────────
type Page = "home" | "president" | "team";

// =============================================================
// MAIN COMPONENT
// =============================================================
export default function HumanityFundPage() {
  const [page, setPage] = useState<Page>("home");

  const navigate = useCallback(
    (p: Page) => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  // ─────────────────────────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────────────────────────
  if (page === "home") {
    return <HomeView onNavigate={navigate} />;
  }

  // ─────────────────────────────────────────────────────────────
  // LEADERSHIP PAGE (President + Team Tabs)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={`${montserrat.variable} ${openSans.variable}`}>
      <LeadershipView page={page} onNavigate={navigate} setPage={setPage} />
    </div>
  );
}
