"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { useState } from "react";
import { useNewsArticle, useRelatedArticles } from "@/hooks/useNews";
import { useSubscribe } from "@/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ============================================
// HELPER FUNCTIONS
// ============================================

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

function formatCategory(category: string): string {
  return category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function getAuthorInitials(author: string): string {
  const words = author.split(' ');
  const initials = words.map((word) => word[0] || '').join('');
  return initials.toUpperCase().slice(0, 2);
}

// ============================================
// SVG ICONS
// ============================================

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
      <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor"/>
      <path d="M10 12.5C5.85786 12.5 2.5 15.8579 2.5 20H17.5C17.5 15.8579 14.1421 12.5 10 12.5Z" fill="currentColor"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3.33334" width="15" height="13.3333" rx="1.67" stroke="currentColor" strokeWidth="1.67"/>
      <path d="M13.3334 1.66667V5.00001" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round"/>
      <path d="M6.66666 1.66667V5.00001" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round"/>
      <path d="M2.5 8.33334H17.5" stroke="currentColor" strokeWidth="1.67"/>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3.33334L13.3333 6.66667L16.6667 3.33334L13.3333 0L10 3.33334Z" fill="currentColor"/>
      <path d="M3.33333 10L6.66667 13.3333L3.33333 16.6667L0 13.3333L3.33333 10Z" fill="currentColor"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 6.66667C16.3807 6.66667 17.5 5.54738 17.5 4.16667C17.5 2.78595 16.3807 1.66667 15 1.66667C13.6193 1.66667 12.5 2.78595 12.5 4.16667C12.5 5.54738 13.6193 6.66667 15 6.66667Z" stroke="currentColor" strokeWidth="1.67"/>
      <path d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z" stroke="currentColor" strokeWidth="1.67"/>
      <path d="M15 18.3333C16.3807 18.3333 17.5 17.214 17.5 15.8333C17.5 14.4526 16.3807 13.3333 15 13.3333C13.6193 13.3333 12.5 14.4526 12.5 15.8333C12.5 17.214 13.6193 18.3333 15 18.3333Z" stroke="currentColor" strokeWidth="1.67"/>
      <path d="M7.15833 11.175L12.85 14.6583" stroke="currentColor" strokeWidth="1.67"/>
      <path d="M12.8417 5.34167L7.15833 8.825" stroke="currentColor" strokeWidth="1.67"/>
    </svg>
  );
}

// ============================================
// SHARE BUTTONS COMPONENT
// ============================================

interface ShareButtonProps {
  type: "facebook" | "twitter" | "linkedin" | "copy";
  onClick: () => void;
}

function ShareButton({ type, onClick }: ShareButtonProps) {
  const colors = {
    facebook: "bg-[#1877F2]",
    twitter: "bg-[#1DA1F2]",
    linkedin: "bg-[#0A66C2]",
    copy: "border border-muted-foreground bg-transparent",
  };

  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="white"/>
      </svg>
    ),
    twitter: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6.2896 18.1406C13.8368 18.1406 17.9648 11.8462 17.9648 6.50779C17.9648 6.32779 17.9648 6.14859 17.9528 5.97019C18.7559 5.38748 19.4491 4.66148 20 3.83139C19.2511 4.16219 18.4566 4.38299 17.6432 4.48659C18.4998 3.9749 19.1409 3.16948 19.4472 2.22219C18.6417 2.69708 17.7605 3.03428 16.8416 3.21939C16.2229 2.55837 15.4047 2.11837 14.5135 1.96657C13.6223 1.81478 12.7078 1.95957 11.9116 2.37717C11.1154 2.79477 10.4819 3.46237 10.1083 4.27577C9.73463 5.08916 9.64123 6.00396 9.8416 6.87299C8.2057 6.79299 6.60564 6.36739 5.14978 5.62659C3.69393 4.88579 2.41655 3.84739 1.3952 2.57779C0.867274 3.49859 0.706209 4.59219 0.945729 5.63299C1.18525 6.67379 1.80636 7.58579 2.6816 8.18219C2.01849 8.16099 1.37062 7.97779 0.8 7.64779V7.69699C0.800259 8.63179 1.1284 9.53659 1.72894 10.2534C2.32948 10.9702 3.16368 11.4526 4.092 11.6166C3.4879 11.7582 2.85406 11.7838 2.23839 11.6918C2.50127 12.5022 3.01144 13.2094 3.69829 13.7134C4.38514 14.2174 5.21634 14.4934 6.0728 14.5062C4.6172 15.6478 2.83301 16.2686 1 16.2658C0.665735 16.2658 0.331729 16.2466 0 16.2086C1.87653 17.4098 4.05994 18.1406 6.2896 18.1382" fill="white"/>
      </svg>
    ),
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42188 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043Z" fill="white"/>
      </svg>
    ),
    copy: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="#6B7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33333C1.66667 2.89131 1.84226 2.46738 2.15482 2.15482C2.46738 1.84226 2.89131 1.66667 3.33333 1.66667H10.8333C11.2754 1.66667 11.6993 1.84226 12.0118 2.15482C12.3244 2.46738 12.5 2.89131 12.5 3.33333V4.16667" stroke="#6B7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <button
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg transition-opacity hover:opacity-80",
        colors[type]
      )}
      onClick={onClick}
    >
      {icons[type]}
    </button>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { article, isLoading, isError, error } = useNewsArticle(slug);
  const { articles: relatedArticles, isLoading: relatedLoading } = useRelatedArticles(
    article?.category || '',
    article?.id,
    3
  );
  const { subscribe, isLoading: isSubscribing } = useSubscribe();
  
  const [email, setEmail] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = (type: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = article?.title || "";
    const description = article?.excerpt || "";
    
    // Extract plain text from HTML content for better descriptions
    const contentPreview = article?.content 
      ? article.content.replace(/<[^>]*>/g, '').substring(0, 200) 
      : "";
    const shareDescription = description || contentPreview;

    if (type === "copy") {
      if (typeof navigator !== "undefined") {
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }
    } else if (type === "facebook") {
      // Facebook uses Open Graph tags from the page, but we can pass the URL
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, "_blank", "width=600,height=400");
    } else if (type === "twitter") {
      // Twitter supports url, text, hashtags, and via parameters
      const twitterText = `${title}\n\n${shareDescription.substring(0, 150)}...`;
      const hashtags = article?.tags?.slice(0, 3).join(',') || '';
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(twitterText)}${hashtags ? `&hashtags=${encodeURIComponent(hashtags)}` : ''}&via=Bsocio`;
      window.open(twitterUrl, "_blank", "width=600,height=400");
    } else if (type === "linkedin") {
      // LinkedIn sharing - uses the URL and pulls metadata from page
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, "_blank", "width=600,height=400");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await subscribe(trimmedEmail);
      toast.success("Thank you for subscribing!", {
        description: "You'll receive the latest articles in your inbox."
      });
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/news-media" className="inline-flex items-center gap-2 py-8 font-bold text-muted-foreground hover:text-primary">
            <BackArrowIcon />
            Back to News
          </Link>
        </div>
        <article className="mx-auto mb-20 max-w-4xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-24 rounded bg-muted" />
            <div className="h-12 w-full rounded bg-muted" />
            <div className="h-8 w-64 rounded bg-muted" />
            <div className="h-96 w-full rounded-xl bg-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
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
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/news-media" className="inline-flex items-center gap-2 py-8 font-bold text-muted-foreground hover:text-primary">
            <BackArrowIcon />
            Back to News
          </Link>
        </div>
        <article className="mx-auto mb-20 max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Article Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            {error?.message || "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/news-media"
            className="inline-flex rounded-lg bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90"
          >
            Browse All Articles
          </Link>
        </article>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="mx-auto max-w-6xl px-6">
        <Link href="/news-media" className="inline-flex items-center gap-2 py-8 font-bold text-muted-foreground hover:text-primary">
          <BackArrowIcon />
          Back to News
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto mb-20 max-w-4xl px-6">
        <span className="mb-4 inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white">
          {formatCategory(article.category)}
        </span>
        
        <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          {article.title}
        </h1>
        
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-muted-foreground sm:gap-6">
          <div className="flex items-center gap-2 font-bold">
            <AuthorIcon />
            {article.author}
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            {formatDate(article.publicationDate)}
          </div>
          <div className="text-muted-foreground/70">{calculateReadTime(article.content)}</div>
        </div>

        {article.featuredImage ? (
          <div className="mb-12 overflow-hidden rounded-xl relative aspect-[16/9] bg-muted">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              className="object-cover object-center"
              priority
              quality={85}
            />
          </div>
        ) : (
          <div className="mb-12 flex aspect-[16/9] items-center justify-center rounded-xl bg-muted text-muted-foreground">
            [Featured Image]
          </div>
        )}

        <div
          className="prose prose-lg max-w-none space-y-6 text-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 flex items-center gap-3 border-b border-border pb-6">
            <TagIcon />
            {article.tags.map((tag, index) => (
              <span key={index} className="rounded-full bg-muted px-4 py-1.5 text-sm font-bold text-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="relative flex items-center gap-4 py-8">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShareIcon />
            Share this article:
          </div>
          <div className="flex gap-3">
            <ShareButton type="facebook" onClick={() => handleShare("facebook")} />
            <ShareButton type="twitter" onClick={() => handleShare("twitter")} />
            <ShareButton type="linkedin" onClick={() => handleShare("linkedin")} />
            <ShareButton type="copy" onClick={() => handleShare("copy")} />
          </div>
          
          {/* Copy Success Toast */}
          {copySuccess && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-right-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
              ✓ Link copied to clipboard!
            </div>
          )}
        </div>

        {/* Author Box */}
        <div className="my-8 flex items-center gap-4 rounded-xl bg-muted/30 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {getAuthorInitials(article.author)}
          </div>
          <div>
            <h3 className="font-bold text-foreground">About {article.author}</h3>
            <p className="text-muted-foreground">Author at Bsocio</p>
          </div>
        </div>

        {/* Related Articles */}
        {!relatedLoading && relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/news-media/${relatedArticle.id}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {relatedArticle.featuredImage ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        className="object-cover object-center"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                      [Image]
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 text-xs font-bold uppercase text-primary">
                      {formatCategory(relatedArticle.category)}
                    </div>
                    <h3 className="mb-2 font-bold leading-snug text-foreground group-hover:text-primary">
                      {relatedArticle.title}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(relatedArticle.publicationDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Newsletter CTA */}
      <section className="bg-linear-to-r from-primary to-teal-600 px-5 py-12 text-center text-white sm:py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Stay Updated with Bsocio News</h2>
          <p className="mb-6 opacity-90">
            Get the latest stories, impact updates, and announcements delivered to your inbox.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row sm:justify-center" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="min-h-11 rounded-lg border-0 bg-white/10 px-4 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-72"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribing}
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className={cn(
                "min-h-11 rounded-lg bg-white px-6 font-semibold text-primary transition-all",
                isSubscribing
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:bg-white/90"
              )}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <CtaImpactSection />
    </>
  );
}
