"use client";

import { useEffect } from "react";
import Link from "next/link";

// ============================================
// BSOCIO - GLOBAL ERROR BOUNDARY
// ============================================
// Catches unexpected runtime errors and shows a
// user-friendly fallback instead of a blank screen.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging (replace with a service like Sentry in production)
    console.error("[Bsocio Error Boundary]", error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-linear-to-b from-background to-muted/30 px-5">
      <div className="mx-auto w-full max-w-xl text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-500"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          An unexpected error occurred. Don&apos;t worry — you can try again or
          head back to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M1 4v6h6M23 20v-6h-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 font-semibold text-foreground transition-all hover:bg-muted"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
