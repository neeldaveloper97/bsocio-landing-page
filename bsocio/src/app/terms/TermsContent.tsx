"use client";

import { useLegal } from "@/hooks";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { cn } from "@/lib/utils";

/* ==============================================
   LOADING SKELETON COMPONENT
   ============================================== */
function LegalSkeleton({ title }: { title: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-12 max-w-8xl mx-auto",
        "bg-(--section-bg-alt) py-32 pb-20 pl-80",
        "max-2xl:w-full max-2xl:pl-40",
        "max-xl:py-24 max-xl:pb-15 max-xl:pl-20",
        "max-lg:py-20 max-lg:px-10 max-lg:pb-15",
        "max-md:py-16 max-md:px-6 max-md:pb-10"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start pb-0.5 gap-6 w-4xl border-b-2 border-(--divider)",
          "max-lg:w-full max-lg:max-w-4xl"
        )}
      >
        <h1
          className={cn(
            "font-arimo font-bold text-4xl leading-10 text-(--heading-primary) m-0",
            "max-md:text-[28px] max-md:leading-9"
          )}
        >
          {title}
        </h1>
        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className={cn("flex flex-col gap-8 w-4xl", "max-lg:w-full max-lg:max-w-4xl")}>
        {/* Section 1 */}
        <div className="space-y-4">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <div className="h-7 w-52 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <div className="h-7 w-44 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-muted/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-4">
          <div className="h-7 w-56 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================
   ERROR STATE COMPONENT
   ============================================== */
function LegalError({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-6",
        "py-20"
      )}
    >
      <div className="text-center bg-white rounded-2xl p-10 shadow-lg border border-(--divider)">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-arimo font-bold text-2xl text-(--heading-primary) mb-3">
          Failed to load {title}
        </h1>
        
        <p className="font-arimo text-base text-(--text-secondary) mb-6 leading-relaxed">
          There was an error loading the document. This could mean the document doesn&apos;t exist yet or there&apos;s a connection issue.
        </p>

        <button
          onClick={onRetry}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "bg-primary text-white font-semibold text-base",
            "transition-all duration-200 hover:opacity-90",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retry Loading
        </button>
      </div>
    </div>
  );
}

/* ==============================================
   MAIN TERMS CONTENT COMPONENT
   ============================================== */
export default function TermsContent() {
  const { legalContent, isLoading, isError, refetch } = useLegal("TERMS_OF_USE");

  if (isLoading) {
    return <LegalSkeleton title="Terms of Use" />;
  }

  if (isError || !legalContent) {
    return (
      <LegalError
        title="Terms of Use"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {/* Legal Page Container */}
      <div
        className={cn(
          "flex flex-col items-start gap-12 max-w-8xl mx-auto",
          "bg-(--section-bg-alt) py-32 pb-20 pl-80",
          "max-2xl:w-full max-2xl:pl-40",
          "max-xl:py-24 max-xl:pb-15 max-xl:pl-20",
          "max-lg:py-20 max-lg:px-10 max-lg:pb-15",
          "max-md:py-16 max-md:px-6 max-md:pb-10"
        )}
      >
        {/* Legal Header */}
        <div
          className={cn(
            "flex flex-col items-start pb-0.5 gap-6 w-4xl border-b-2 border-(--divider)",
            "max-lg:w-full max-lg:max-w-4xl"
          )}
        >
          <h1
            className={cn(
              "font-arimo font-bold text-4xl leading-10 text-(--heading-primary) m-0",
              "max-md:text-[28px] max-md:leading-9"
            )}
          >
            {legalContent.title}
          </h1>
          <p className="font-arimo font-normal text-base leading-6 text-(--text-secondary) m-0">
            <strong>Effective Date</strong>:{" "}
            {new Date(legalContent.effectiveDate).toLocaleDateString()}
          </p>
        </div>

        {/* Legal Content */}
        <div
          className={cn(
            "flex flex-col gap-12 w-4xl",
            "max-lg:w-full max-lg:max-w-4xl",
            // Heading styles
            "[&_h1]:font-arimo [&_h1]:font-bold [&_h1]:text-[32px] [&_h1]:leading-10",
            "[&_h1]:text-(--heading-primary) [&_h1]:mt-8 [&_h1]:mb-4",
            "max-md:[&_h1]:text-[26px] max-md:[&_h1]:leading-8.5",
            "[&_h2]:font-arimo [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:leading-8",
            "[&_h2]:text-(--heading-primary) [&_h2]:mt-7 [&_h2]:mb-3",
            "max-md:[&_h2]:text-xl max-md:[&_h2]:leading-7",
            "[&_h3]:font-arimo [&_h3]:font-bold [&_h3]:text-xl [&_h3]:leading-7",
            "[&_h3]:text-(--heading-primary) [&_h3]:mt-6 [&_h3]:mb-2.5",
            "max-md:[&_h3]:text-lg max-md:[&_h3]:leading-6.5",
            "[&_h4]:font-arimo [&_h4]:font-bold [&_h4]:text-lg [&_h4]:leading-6.5",
            "[&_h4]:text-(--heading-primary) [&_h4]:mt-5 [&_h4]:mb-2",
            // Paragraph styles
            "[&_p]:font-arimo [&_p]:font-normal [&_p]:text-base [&_p]:leading-6.5",
            "[&_p]:text-(--text-body) [&_p]:m-0 [&_p]:mb-4",
            // Strong/Bold/Italic/Underline
            "[&_strong]:font-bold [&_strong]:text-(--heading-primary)",
            "[&_b]:font-bold [&_b]:text-(--heading-primary)",
            "[&_em]:italic [&_i]:italic",
            "[&_u]:underline",
            // List styles
            "[&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:m-0 [&_ul]:mb-4",
            "[&_ol]:pl-6 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:m-0 [&_ol]:mb-4",
            "[&_li]:font-arimo [&_li]:font-normal [&_li]:text-base [&_li]:leading-6.5",
            "[&_li]:text-(--text-body)",
            "[&_li_strong]:font-bold",
            // Link styles
            "[&_a]:text-primary [&_a]:no-underline [&_a]:hover:underline",
            // Blockquote
            "[&_blockquote]:border-l-4 [&_blockquote]:border-primary",
            "[&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic",
            "[&_blockquote]:text-(--text-secondary)",
            // Horizontal rule
            "[&_hr]:border-none [&_hr]:border-t [&_hr]:border-(--divider) [&_hr]:my-8",
            // Table styles
            "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4",
            "[&_th]:border [&_th]:border-(--divider) [&_th]:p-3 [&_th]:text-left",
            "[&_th]:font-arimo [&_th]:text-sm [&_th]:bg-(--section-bg-alt) [&_th]:font-bold",
            "[&_td]:border [&_td]:border-(--divider) [&_td]:p-3 [&_td]:text-left",
            "[&_td]:font-arimo [&_td]:text-sm"
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: legalContent.content }} />
        </div>
      </div>

      <CtaImpactSection />
    </>
  );
}
