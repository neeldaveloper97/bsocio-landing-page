"use client";

import { useEffect } from "react";
import Link from "next/link";

// ============================================
// BSOCIO ADMIN - GLOBAL ERROR BOUNDARY
// ============================================

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Bsocio Admin Error]", error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-5 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-500"
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
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          An unexpected error occurred. Try again or go back to the dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
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
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
