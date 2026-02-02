"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useNews } from "@/hooks";
import { cn } from "@/lib/utils";
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
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
      data-category={categoryToFilter[article.category]}
    >
      <div className="flex h-48 w-full items-center justify-center overflow-hidden bg-muted text-sm text-white/70">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">[Featured Image]</span>
        )}
      </div>
      <div className="p-5 sm:p-7">
        <span className="mb-3 inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          {categoryLabels[article.category]}
        </span>
        <h3 className="mb-3 text-lg font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
          {article.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {article.excerpt || article.content?.substring(0, 150) + '...'}
        </p>
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <time
            className="text-xs text-muted-foreground sm:text-sm"
            dateTime={article.publicationDate || article.createdAt}
          >
            {formatDate(article.publicationDate || article.createdAt)}
          </time>
          <Link
            href={`/news-media/${article.id}`}
            className="inline-flex min-h-11 items-center py-2 font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
    <article className="overflow-hidden rounded-xl border border-border bg-card" aria-hidden="true">
      <div className="h-48 w-full animate-pulse bg-muted" />
      <div className="p-5 sm:p-7">
        <div className="mb-2 h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-6 w-full animate-pulse rounded bg-muted" />
        <div className="mb-4 h-12 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </div>
    </article>
  );
}

export default function NewsFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  const category = filterToCategory[activeFilter];
  const { articles, isLoading, isError } = useNews({ category });

  const handleFilterClick = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
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
        className="flex justify-center border-b border-border bg-muted/30 px-4 py-6"
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
      </section>
    </>
  );
}
