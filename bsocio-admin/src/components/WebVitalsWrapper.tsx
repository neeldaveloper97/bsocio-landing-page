"use client";

import dynamic from "next/dynamic";

/**
 * WebVitals wrapper component
 * Uses dynamic import with ssr: false (allowed in Client Components)
 * Only loads in development mode
 */
const WebVitals = dynamic(
  () => import("@/components/WebVitals").then((mod) => ({ default: mod.WebVitals })),
  { ssr: false }
);

export default function WebVitalsWrapper() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  
  return <WebVitals />;
}
