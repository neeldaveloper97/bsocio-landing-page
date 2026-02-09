"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useEvent } from "@/hooks";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getEventStateLabel = (state: string): { label: string; color: string } => {
  switch (state) {
    case "UPCOMING":
      return { label: "Upcoming", color: "bg-blue-500" };
    case "ONGOING":
      return { label: "Happening Now", color: "bg-green-500" };
    case "COMPLETED":
      return { label: "Completed", color: "bg-gray-500" };
    case "CANCELLED":
      return { label: "Cancelled", color: "bg-red-500" };
    default:
      return { label: state, color: "bg-primary" };
  }
};

// ============================================
// SKELETON COMPONENT
// ============================================

function EventDetailSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative h-[300px] w-full bg-muted sm:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8">
            <div className="mb-4 h-8 w-32 animate-pulse rounded-full bg-white/20" />
            <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-white/20" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8 space-y-4">
                <div className="h-6 w-full animate-pulse rounded bg-muted" />
                <div className="h-6 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-6 w-4/6 animate-pulse rounded bg-muted" />
              </div>
            </div>
            {/* Sidebar */}
            <div>
              <div className="h-64 animate-pulse rounded-xl bg-muted" />
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

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { event, isLoading, isError, error } = useEvent(id);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (isError || !event) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Event Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            {error?.message || "The event you're looking for doesn't exist or has been removed."}
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

  const { label: stateLabel, color: stateColor } = getEventStateLabel(event.state);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden sm:h-[400px]">
        {event.imageUrl ? (
          <ImageWithSkeleton
            src={event.imageUrl}
            alt={event.title}
            containerClassName="absolute inset-0"
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #1F6AE1 0%, #009689 100%)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8">
            <span className={cn("mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white", stateColor)}>
              {stateLabel}
            </span>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="bg-background px-5 pt-6 sm:px-8">
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

      {/* Content Section */}
      <section className="bg-background py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-foreground">About This Event</h2>
              {event.description ? (
                <div
                  className={cn(
                    "prose prose-lg max-w-none",
                    "[&_p]:text-muted-foreground [&_p]:leading-relaxed",
                    "[&_h2]:text-foreground [&_h3]:text-foreground",
                    "[&_ul]:text-muted-foreground [&_ol]:text-muted-foreground",
                    "[&_a]:text-primary [&_a]:hover:underline"
                  )}
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              ) : (
                <p className="text-muted-foreground">
                  More details about this event will be announced soon. Stay tuned for updates!
                </p>
              )}
            </div>

            {/* Sidebar - Event Details */}
            <div>
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-bold text-foreground">Event Details</h3>
                <div className="space-y-5">
                  {/* Date */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p className="font-semibold text-foreground">
                        {formatEventDate(event.eventDate)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  {event.eventTime && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                        <p className="font-semibold text-foreground">{event.eventTime}</p>
                      </div>
                    </div>
                  )}

                  {/* Venue */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Venue</p>
                      <p className="font-semibold text-foreground">{event.venue}</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  {event.maxAttendees && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">
                          {event.currentAttendees.toLocaleString()} / {event.maxAttendees.toLocaleString()} attendees
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                {event.state === "UPCOMING" && (
                  <button className="mt-8 w-full rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90">
                    Register for Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
