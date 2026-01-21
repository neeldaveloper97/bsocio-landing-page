"use client";

import ReactMarkdown from "react-markdown";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

// ============================================
// LEGAL PAGE LAYOUT COMPONENT
// Shared layout for Privacy Policy and Terms of Use
// ============================================

interface LegalPageLayoutProps {
  title: string;
  effectiveDate?: string;
  content?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export function LegalPageLayout({
  title,
  effectiveDate,
  content,
  isLoading,
  isError,
}: LegalPageLayoutProps) {
  return (
    <>
      {/* Header Section */}
      <section
        className={cn(
          "w-full px-4 py-12 sm:py-16",
          "bg-gradient-to-br from-blue-50 via-orange-50/30 to-green-50",
          "dark:from-primary/10 dark:via-background dark:to-secondary/10"
        )}
      >
        <Container variant="narrow" className="text-center">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {effectiveDate && (
            <p className="mt-4 text-muted-foreground">
              <strong className="text-foreground">Effective Date</strong>: {effectiveDate}
            </p>
          )}
          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          )}
          {isError && (
            <p className="mt-4 text-destructive">
              Unable to load content. Please try again later.
            </p>
          )}
        </Container>
      </section>

      {/* Content Section */}
      {content && !isLoading && !isError && (
        <section className="w-full bg-background py-12 dark:bg-background sm:py-16">
          <Container variant="narrow">
            <article className="legal-content prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-8 border-b border-border pb-2 text-xl font-bold text-foreground first:mt-0 sm:text-2xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-6 text-lg font-semibold text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  hr: () => (
                    <hr className="my-8 border-border" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary underline underline-offset-4 hover:text-primary/80"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </Container>
        </section>
      )}

      <CtaImpactSection />
    </>
  );
}
