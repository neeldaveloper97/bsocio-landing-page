"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { useSpecialGuestById } from "@/hooks";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

// ============================================
// SKELETON COMPONENT
// ============================================

function GuestProfileSkeleton() {
  return (
    <>
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Image Skeleton */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-muted" />
            </div>
            {/* Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="mb-4 h-8 w-32 animate-pulse rounded-full bg-muted" />
              <div className="mb-2 h-10 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mb-8 h-6 w-1/2 animate-pulse rounded bg-muted" />
              <div className="space-y-4">
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                <div className="h-5 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-5 w-4/6 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function GuestProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { guest, isLoading, isError, error } = useSpecialGuestById(id);

  if (isLoading) {
    return <GuestProfileSkeleton />;
  }

  if (isError || !guest) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Profile Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            {error?.message || "The profile you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/festivals"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Festivals
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex h-[200px] w-full items-center justify-center sm:h-[250px]"
        style={{ background: "linear-gradient(135deg, #1F6AE1 0%, #009689 100%)" }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Special Guest</h1>
        </div>
      </section>

      {/* Back Button */}
      <div className="bg-muted/30 px-5 pt-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/festivals"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Festivals
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <section className="bg-muted/30 py-8 pb-16 md:py-12 md:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border shadow-lg">
                  {guest.imageUrl ? (
                    <ImageWithSkeleton
                      src={guest.imageUrl}
                      alt={guest.name}
                      containerClassName="absolute inset-0"
                      objectPosition="top"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-8xl font-bold text-primary/30">
                        {guest.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              {/* Badge */}
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
                ⭐ Special Guest
              </span>

              {/* Name & Title */}
              <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
                {guest.name}
              </h2>
              {guest.title && (
                <p className="mb-8 text-xl text-primary">{guest.title}</p>
              )}

              {/* Bio */}
              {guest.bio && (
                <div className="mb-8">
                  <h3 className="mb-4 text-xl font-bold text-foreground">Biography</h3>
                  <div
                    className={cn(
                      "prose prose-lg max-w-none",
                      "[&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4",
                      "[&_h2]:text-foreground [&_h3]:text-foreground",
                      "[&_ul]:text-muted-foreground [&_ol]:text-muted-foreground",
                      "[&_a]:text-primary [&_a]:hover:underline",
                      "[&_strong]:text-foreground"
                    )}
                    dangerouslySetInnerHTML={{ __html: guest.bio }}
                  />
                </div>
              )}

              {/* Placeholder for when no bio */}
              {!guest.bio && (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    More information about this guest will be available soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
