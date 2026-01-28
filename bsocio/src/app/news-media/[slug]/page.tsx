"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "./page.css";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { useState } from "react";
import { useNewsArticle, useRelatedArticles } from "@/hooks/useNews";

// Format date helper
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Format category for display
function formatCategory(category: string): string {
  return category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Calculate read time from content
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Get author initials
function getAuthorInitials(author: string): string {
  return author
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// SVG Icons
function BackArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AuthorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#4A5565"/>
      <path d="M10 12.5C5.85786 12.5 2.5 15.8579 2.5 20H17.5C17.5 15.8579 14.1421 12.5 10 12.5Z" fill="#4A5565"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3.33334" width="15" height="13.3333" rx="1.67" stroke="#4A5565" strokeWidth="1.67"/>
      <path d="M13.3334 1.66667V5.00001" stroke="#4A5565" strokeWidth="1.67" strokeLinecap="round"/>
      <path d="M6.66666 1.66667V5.00001" stroke="#4A5565" strokeWidth="1.67" strokeLinecap="round"/>
      <path d="M2.5 8.33334H17.5" stroke="#4A5565" strokeWidth="1.67"/>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3.33334L13.3333 6.66667L16.6667 3.33334L13.3333 0L10 3.33334Z" fill="#4A5565"/>
      <path d="M3.33333 10L6.66667 13.3333L3.33333 16.6667L0 13.3333L3.33333 10Z" fill="#4A5565"/>
      <path d="M16.6667 10L20 13.3333L16.6667 16.6667L13.3333 13.3333L16.6667 10Z" fill="#4A5565"/>
      <path d="M10 16.6667L13.3333 20L16.6667 16.6667L13.3333 13.3333L10 16.6667Z" fill="#4A5565"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 6.66667C16.3807 6.66667 17.5 5.54738 17.5 4.16667C17.5 2.78595 16.3807 1.66667 15 1.66667C13.6193 1.66667 12.5 2.78595 12.5 4.16667C12.5 5.54738 13.6193 6.66667 15 6.66667Z" stroke="#101828" strokeWidth="1.67"/>
      <path d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z" stroke="#101828" strokeWidth="1.67"/>
      <path d="M15 18.3333C16.3807 18.3333 17.5 17.214 17.5 15.8333C17.5 14.4526 16.3807 13.3333 15 13.3333C13.6193 13.3333 12.5 14.4526 12.5 15.8333C12.5 17.214 13.6193 18.3333 15 18.3333Z" stroke="#101828" strokeWidth="1.67"/>
      <path d="M7.15833 11.175L12.85 14.6583" stroke="#101828" strokeWidth="1.67"/>
      <path d="M12.8417 5.34167L7.15833 8.825" stroke="#101828" strokeWidth="1.67"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="white"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6.2896 18.1406C13.8368 18.1406 17.9648 11.8462 17.9648 6.50779C17.9648 6.32779 17.9648 6.14859 17.9528 5.97019C18.7559 5.38748 19.4491 4.66148 20 3.83139C19.2511 4.16219 18.4566 4.38299 17.6432 4.48659C18.4998 3.9749 19.1409 3.16948 19.4472 2.22219C18.6417 2.69708 17.7605 3.03428 16.8416 3.21939C16.2229 2.55837 15.4047 2.11837 14.5135 1.96657C13.6223 1.81478 12.7078 1.95957 11.9116 2.37717C11.1154 2.79477 10.4819 3.46237 10.1083 4.27577C9.73463 5.08916 9.64123 6.00396 9.8416 6.87299C8.2057 6.79299 6.60564 6.36739 5.14978 5.62659C3.69393 4.88579 2.41655 3.84739 1.3952 2.57779C0.867274 3.49859 0.706209 4.59219 0.945729 5.63299C1.18525 6.67379 1.80636 7.58579 2.6816 8.18219C2.01849 8.16099 1.37062 7.97779 0.8 7.64779V7.69699C0.800259 8.63179 1.1284 9.53659 1.72894 10.2534C2.32948 10.9702 3.16368 11.4526 4.092 11.6166C3.4879 11.7582 2.85406 11.7838 2.23839 11.6918C2.50127 12.5022 3.01144 13.2094 3.69829 13.7134C4.38514 14.2174 5.21634 14.4934 6.0728 14.5062C4.6172 15.6478 2.83301 16.2686 1 16.2658C0.665735 16.2658 0.331729 16.2466 0 16.2086C1.87653 17.4098 4.05994 18.1406 6.2896 18.1382" fill="white"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42188 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043Z" fill="white"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="#6B7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33333C1.66667 2.89131 1.84226 2.46738 2.15482 2.15482C2.46738 1.84226 2.89131 1.66667 3.33333 1.66667H10.8333C11.2754 1.66667 11.6993 1.84226 12.0118 2.15482C12.3244 2.46738 12.5 2.89131 12.5 3.33333V4.16667" stroke="#6B7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { article, isLoading, isError, error } = useNewsArticle(slug);
  const { articles: relatedArticles, isLoading: relatedLoading } = useRelatedArticles(
    article?.category || '',
    article?.id,
    3
  );
  
  const [email, setEmail] = useState("");

  const handleShare = (type: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = article?.title || "";

    if (type === "copy") {
      if (typeof navigator !== "undefined") {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } else if (type === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    } else if (type === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank");
    } else if (type === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail("");
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="back-button-wrapper">
          <Link href="/news-media" className="back-button">
            <BackArrowIcon />
            Back to News
          </Link>
        </div>
        <article className="article-container">
          <div className="loading-skeleton">
            <div className="skeleton-category" />
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-paragraph" />
              <div className="skeleton-paragraph" />
              <div className="skeleton-paragraph" />
            </div>
          </div>
        </article>
      </>
    );
  }

  // Error state
  if (isError || !article) {
    return (
      <>
        <div className="back-button-wrapper">
          <Link href="/news-media" className="back-button">
            <BackArrowIcon />
            Back to News
          </Link>
        </div>
        <article className="article-container">
          <div className="error-state">
            <h2>Article Not Found</h2>
            <p>{error?.message || "The article you're looking for doesn't exist or has been removed."}</p>
            <Link href="/news-media" className="btn-primary">
              Browse All Articles
            </Link>
          </div>
        </article>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="back-button-wrapper">
        <Link href="/news-media" className="back-button">
          <BackArrowIcon />
          Back to News
        </Link>
      </div>

      {/* Article */}
      <article className="article-container">
        <span className="article-category">{formatCategory(article.category)}</span>
        
        <h1 className="article-title">{article.title}</h1>
        
        <div className="article-meta">
          <div className="meta-item">
            <AuthorIcon />
            {article.author}
          </div>
          <div className="meta-item date">
            <CalendarIcon />
            {formatDate(article.publicationDate)}
          </div>
          <div className="meta-item read-time">{calculateReadTime(article.content)}</div>
        </div>

        {article.featuredImage ? (
          <div className="article-image">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              loading="eager"
            />
          </div>
        ) : (
          <div className="article-image">[Featured Image]</div>
        )}

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            <TagIcon />
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="share-section">
          <div className="share-label">
            <ShareIcon />
            Share this article:
          </div>
          <div className="share-buttons">
            <button className="share-btn facebook" onClick={() => handleShare("facebook")}>
              <FacebookIcon />
            </button>
            <button className="share-btn twitter" onClick={() => handleShare("twitter")}>
              <TwitterIcon />
            </button>
            <button className="share-btn linkedin" onClick={() => handleShare("linkedin")}>
              <LinkedInIcon />
            </button>
            <button className="share-btn copy" onClick={() => handleShare("copy")}>
              <CopyIcon />
            </button>
          </div>
        </div>

        {/* Author Box */}
        <div className="author-box">
          <div className="author-avatar">{getAuthorInitials(article.author)}</div>
          <div className="author-info">
            <h3>About {article.author}</h3>
            <p>Author at Bsocio</p>
          </div>
        </div>

        {/* Related Articles */}
        {!relatedLoading && relatedArticles.length > 0 && (
          <div className="related-articles">
            <h2>Related Articles</h2>
            <div className="related-grid">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/news-media/${relatedArticle.id}`} className="related-card">
                  {relatedArticle.featuredImage ? (
                    <div className="related-card-image">
                      <img src={relatedArticle.featuredImage} alt={relatedArticle.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="related-card-image">[Image]</div>
                  )}
                  <div className="related-card-content">
                    <div className="related-card-category">{formatCategory(relatedArticle.category)}</div>
                    <h3>{relatedArticle.title}</h3>
                    <div className="related-card-date">{formatDate(relatedArticle.publicationDate)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* CTA Newsletter Section */}
      <section className="cta-newsletter">
        <div className="cta-newsletter-container">
          <h2>Stay Updated with Bsocio News</h2>
          <p>Get the latest stories, impact updates, and announcements delivered to your inbox.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
