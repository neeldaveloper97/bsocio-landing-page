import Link from "next/link";

// ============================================
// BSOCIO ADMIN - 404 NOT FOUND PAGE
// ============================================

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-5 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md text-center">
        {/* 404 Badge */}
        <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          404
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          The admin page you&apos;re looking for doesn&apos;t exist or you may
          not have access to it.
        </p>

        {/* Action */}
        <Link
          href="/dashboard"
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
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
