import Link from "next/link";

// ============================================
// BSOCIO - 404 NOT FOUND PAGE
// ============================================
// Shown when a user navigates to a non-existent route,
// or when a resource (article, event, nominee, etc.)
// has been removed from the admin panel.

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-linear-to-b from-background to-muted/30 px-5">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Decorative 404 */}
        <div className="relative mb-8 select-none" aria-hidden="true">
          <span className="text-[10rem] font-bold leading-none tracking-tighter text-primary/10 sm:text-[14rem]">
            404
          </span>
          {/* Floating icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 8v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
          been removed. It might have been moved, renamed, or is no longer
          available.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M3 12L12 4l9 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go to Homepage
          </Link>

          <Link
            href="/news-media"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 font-semibold text-foreground transition-all hover:bg-muted"
          >
            Browse News
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Or explore these sections:
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/festivals"
              className="text-primary underline-offset-4 hover:underline"
            >
              Festivals &amp; Awards
            </Link>
            <Link
              href="/about"
              className="text-primary underline-offset-4 hover:underline"
            >
              About Us
            </Link>
            <Link
              href="/how-it-works"
              className="text-primary underline-offset-4 hover:underline"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-primary underline-offset-4 hover:underline"
            >
              Contact
            </Link>
            <Link
              href="/faqs"
              className="text-primary underline-offset-4 hover:underline"
            >
              FAQs
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
