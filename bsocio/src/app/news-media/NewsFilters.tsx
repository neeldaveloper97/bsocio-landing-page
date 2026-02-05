"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useNews } from "@/hooks";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsArticle, NewsCategory } from "@/types";

const categoryLabels: Record<NewsCategory, string> = {
  PRESS_RELEASE: "Press Release",
  MEDIA_COVERAGE: "Media Features",
  ANNOUNCEMENT: "Announcements",
  IMPACT_STORY: "Impact Stories",
  PARTNERSHIP: "Partnerships",
};

const categoryToFilter: Record<NewsCategory, string> = {
  PRESS_RELEASE: "press-release",
  MEDIA_COVERAGE: "media-feature",
  ANNOUNCEMENT: "announcement",
  IMPACT_STORY: "impact-story",
  PARTNERSHIP: "partnership",
};

type FilterType = "all" | "press-release" | "media-feature" | "announcement" | "impact-story" | "partnership";

const filterToCategory: Record<FilterType, NewsCategory | undefined> = {
  "all": undefined,
  "press-release": "PRESS_RELEASE",
  "media-feature": "MEDIA_COVERAGE",
  "announcement": "ANNOUNCEMENT",
  "impact-story": "IMPACT_STORY",
  "partnership": "PARTNERSHIP",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FilterButton = memo(function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "min-h-11 min-w-11 rounded-lg px-6 py-2 text-sm font-bold leading-6 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-base",
        isActive
          ? "border-0 bg-primary text-white"
          : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
      )}
      onClick={onClick}
      aria-pressed={isActive}
      type="button"
    >
      {label}
    </button>
  );
});

const NewsCard = memo(function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
      data-category={categoryToFilter[article.category]}
    >
      {article.featuredImage ? (
        <ImageWithSkeleton
          src={article.featuredImage}
          alt={article.title}
          containerClassName="aspect-[16/10] w-full flex-shrink-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          objectPosition="center"
        />
      ) : (
        <div className="flex aspect-[16/10] w-full flex-shrink-0 items-center justify-center bg-muted text-sm text-muted-foreground">
          <span aria-hidden="true">[Featured Image]</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <span className="mb-3 inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          {categoryLabels[article.category]}
        </span>
        <h3 className="mb-3 text-lg font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
          {article.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {article.excerpt || article.content?.substring(0, 150)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
          <time
            className="text-xs text-muted-foreground sm:text-sm"
            dateTime={article.publicationDate || article.createdAt}
          >
            {formatDate(article.publicationDate || article.createdAt)}
          </time>
          <Link
            href={`/news-media/${article.id}`}
            className="inline-flex items-center font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Read more about ${article.title}`}
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
});

function NewsCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card" aria-hidden="true">
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <div className="mb-3 h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="mb-3 h-6 w-full animate-pulse rounded bg-muted" />
        <div className="mb-5 h-16 w-full animate-pulse rounded bg-muted" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </article>
  );
}

export default function NewsFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const category = filterToCategory[activeFilter];
  const { articles, isLoading, isError, pagination } = useNews({ 
    category,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const handleFilterClick = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of news section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filterButtons = useMemo(() => [
    { filter: "all" as FilterType, label: "All News" },
    { filter: "press-release" as FilterType, label: "Press Releases" },
    { filter: "media-feature" as FilterType, label: "Media Features" },
    { filter: "announcement" as FilterType, label: "Announcements" },
  ], []);

  return (
    <>
      {/* Filters */}
      <section
        className="sticky top-16 z-30 flex justify-center border-b border-border bg-background px-4 py-6 shadow-sm"
        aria-label="News category filters"
      >
        <div
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center"
          role="group"
          aria-label="Filter by category"
        >
          {filterButtons.map(({ filter, label }) => (
            <FilterButton
              key={filter}
              label={label}
              isActive={activeFilter === filter}
              onClick={() => handleFilterClick(filter)}
            />
          ))}
        </div>
      </section>

      {/* News Listing */}
      <section className="bg-background px-4 py-12 sm:px-8 md:py-16" aria-label="News articles">
        <div
          className="mx-auto grid max-w-7xl gap-6 sm:gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            contain: "layout paint",
          }}
          role="feed"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </>
          ) : isError ? (
            <div className="col-span-full py-12 text-center" role="alert">
              <p className="font-semibold text-muted-foreground">Failed to load news articles</p>
              <p className="mt-2 text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : articles?.length > 0 ? (
            articles.map((article: NewsArticle) => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center" role="status">
              <p className="font-semibold text-muted-foreground">No articles available in this category</p>
              <p className="mt-2 text-sm text-muted-foreground">Try selecting a different filter</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && pagination.totalPages > 1 && (
          <nav
            className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-3"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 font-medium transition-colors",
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-primary hover:bg-primary/10 hover:text-primary"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Generate page buttons */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (page === 2 && currentPage > 4) {
                  return (
                    <span key="ellipsis-start" className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }

                if (page === pagination.totalPages - 1 && currentPage < pagination.totalPages - 3) {
                  return (
                    <span key="ellipsis-end" className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                      page === currentPage
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary hover:bg-primary/10 hover:text-primary"
                    )}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className={cn(
                "flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 font-medium transition-colors",
                currentPage === pagination.totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-primary hover:bg-primary/10 hover:text-primary"
              )}
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}

        {/* Page info */}
        {!isLoading && !isError && pagination.total > 0 && (
          <p className="mx-auto mt-4 max-w-7xl text-center text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} articles
          </p>
        )}
      </section>
    </>
  );
}
