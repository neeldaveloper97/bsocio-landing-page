"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useNews } from "@/hooks";
import type { NewsArticle, NewsCategory } from "@/types";

// Category mapping for display
const categoryLabels: Record<NewsCategory, string> = {
  PRESS_RELEASE: "Press Release",
  MEDIA_COVERAGE: "Media Features",
  ANNOUNCEMENT: "Announcements",
  IMPACT_STORY: "Impact Stories",
  PARTNERSHIP: "Partnerships",
};

// Category to filter mapping
const categoryToFilter: Record<NewsCategory, string> = {
  PRESS_RELEASE: "press-release",
  MEDIA_COVERAGE: "media-feature",
  ANNOUNCEMENT: "announcement",
  IMPACT_STORY: "impact-story",
  PARTNERSHIP: "partnership",
};

type FilterType = "all" | "press-release" | "media-feature" | "announcement" | "impact-story" | "partnership";

// Map filter type to NewsCategory
const filterToCategory: Record<FilterType, NewsCategory | undefined> = {
  "all": undefined,
  "press-release": "PRESS_RELEASE",
  "media-feature": "MEDIA_COVERAGE",
  "announcement": "ANNOUNCEMENT",
  "impact-story": "IMPACT_STORY",
  "partnership": "PARTNERSHIP",
};

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Memoized filter button to prevent unnecessary re-renders
const FilterButton = memo(function FilterButton({
  filter,
  label,
  isActive,
  onClick,
}: {
  filter: FilterType;
  label: string;
  isActive: boolean;
  onClick: (filter: FilterType) => void;
}) {
  return (
    <button
      className={`filter-btn ${isActive ? "active" : ""}`}
      onClick={() => onClick(filter)}
      aria-pressed={isActive}
      type="button"
    >
      {label}
    </button>
  );
});

// Memoized news card for better list performance
const NewsCard = memo(function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="news-card" data-category={categoryToFilter[article.category]}>
      <div className="news-card-image img-aspect-16-9">
        {article.featuredImage ? (
          <img 
            src={article.featuredImage} 
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span aria-hidden="true">[Featured Image]</span>
        )}
      </div>
      <div className="news-card-content">
        <span className="news-category">{categoryLabels[article.category]}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt || article.content?.substring(0, 150) + '...'}</p>
        <div className="news-card-footer">
          <time className="news-date" dateTime={article.publicationDate || article.createdAt}>
            {formatDate(article.publicationDate || article.createdAt)}
          </time>
          <Link 
            href={`/news-media/${article.id}`} 
            className="news-link"
            aria-label={`Read more about ${article.title}`}
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
});

// Skeleton loader for news cards - prevents CLS
function NewsCardSkeleton() {
  return (
    <article className="news-card skeleton" aria-hidden="true">
      <div className="news-card-image img-aspect-16-9 skeleton"></div>
      <div className="news-card-content">
        <div className="skeleton" style={{ width: '80px', height: '20px', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '24px', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '48px', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '16px' }}></div>
      </div>
    </article>
  );
}

export default function NewsFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  // Use server-side filtering with category query parameter
  const category = filterToCategory[activeFilter];
  const { articles, isLoading, isError } = useNews({ 
    category: category 
  });

  const handleFilterClick = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  // Memoize filter buttons to prevent re-renders
  const filterButtons = useMemo(() => [
    { filter: "all" as FilterType, label: "All News" },
    { filter: "press-release" as FilterType, label: "Press Releases" },
    { filter: "media-feature" as FilterType, label: "Media Features" },
    { filter: "announcement" as FilterType, label: "Announcements" },
  ], []);

  return (
    <>
      {/* Filters */}
      <section className="news-filters" aria-label="News category filters">
        <div className="filters-container" role="group" aria-label="Filter by category">
          {filterButtons.map(({ filter, label }) => (
            <FilterButton
              key={filter}
              filter={filter}
              label={label}
              isActive={activeFilter === filter}
              onClick={handleFilterClick}
            />
          ))}
        </div>
      </section>

      {/* News Listing */}
      <section className="news-listing" aria-label="News articles">
        <div className="news-grid" role="feed" aria-busy={isLoading}>
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
            <div className="no-data-message" role="alert">
              <p>Failed to load news articles</p>
              <p>Please try again later</p>
            </div>
          ) : articles?.length > 0 ? (
            articles.map((article: NewsArticle) => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <div className="no-data-message" role="status">
              <p>No articles available in this category</p>
              <p>Try selecting a different filter</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
