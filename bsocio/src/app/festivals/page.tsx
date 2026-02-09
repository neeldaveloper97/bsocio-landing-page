"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { useEvents } from "@/hooks";
import { useAwardCategories, useApprovedNominees, useActiveGuests } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from "@/components/ui/modal";
import type { Event, AwardCategory, Nominee, SpecialGuest } from "@/types";

type TabType = "awards" | "events" | "guests";

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const isMainEvent = (event: Event): boolean => {
  const eventDate = new Date(event.eventDate);
  return (
    eventDate.getMonth() >= 9 ||
    (typeof event.maxAttendees === "number" && event.maxAttendees > 3000)
  );
};

// ============================================
// REUSABLE COMPONENTS
// ============================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer border-b-4 border-transparent bg-transparent py-4 text-base font-bold leading-6 transition-all duration-300",
        "hover:text-primary",
        active ? "border-b-primary text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface CategoryCardProps {
  category: AwardCategory;
  onClick?: () => void;
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-border bg-gradient-to-br from-white to-slate-50 p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl sm:p-8">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
        {category.icon || "🏆"}
      </div>
      <h3 className="mb-3 text-lg font-bold leading-tight text-foreground sm:text-xl">
        {category.name}
      </h3>
      <div
        className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3"
        dangerouslySetInnerHTML={{
          __html: category.description || "Recognizing excellence and impact in this category."
        }}
      />
      <button
        onClick={onClick}
        className="mt-auto rounded-lg border-2 border-accent bg-transparent px-6 py-2.5 text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white"
      >
        Explore →
      </button>
    </div>
  );
}

interface NomineeCardProps {
  nominee: Nominee;
  showCategory?: boolean;
  onViewProfile?: () => void;
}

function NomineeCard({ nominee, showCategory, onViewProfile }: NomineeCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
        {nominee.imageUrl ? (
          <Image
            src={nominee.imageUrl}
            alt={nominee.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
              {nominee.name.charAt(0)}
            </div>
          </div>
        )}
        {nominee.isWinner && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
            🏆 Winner
          </div>
        )}
      </div>
      <div className="p-6">
        <h4 className="mb-2 text-xl font-bold leading-7 text-foreground">{nominee.name}</h4>
        {nominee.title && (
          <p className="mb-2 text-sm leading-5 text-primary">{nominee.title}</p>
        )}
        {nominee.organization && (
          <p className="mb-3 text-sm leading-5 text-muted-foreground">{nominee.organization}</p>
        )}
        {showCategory && nominee.category && (
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {nominee.category.name}
          </span>
        )}
        {nominee.about && (
          <div
            className="mb-4 leading-relaxed text-foreground line-clamp-3"
            dangerouslySetInnerHTML={{ __html: nominee.about }}
          />
        )}
        <button
          onClick={onViewProfile}
          className="block w-full cursor-pointer rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-center font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  description: string;
  mainEvent: boolean;
  onViewDetails?: () => void;
}

function EventCard({ id, title, date, location, venue, description, mainEvent, onViewDetails }: EventCardProps) {
  return (
    <div className="relative rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
      <span
        className={cn(
          "mb-3 inline-block rounded-full px-3 py-1 text-sm font-bold text-white",
          mainEvent ? "bg-secondary" : "bg-primary"
        )}
      >
        {mainEvent ? "Main Event" : "Featured"}
      </span>
      <h3 className="mb-4 text-xl font-bold leading-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <div className="mb-4 space-y-2">
        <p className="leading-6 text-foreground">
          <strong>Date:</strong> {date}
        </p>
        <p className="leading-6 text-foreground">
          <strong>Location:</strong> {location}
        </p>
        <p className="leading-6 text-foreground">
          <strong>Time:</strong> {venue}
        </p>
      </div>
      <div
        className="mb-4 leading-relaxed text-muted-foreground line-clamp-3"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <button
        onClick={onViewDetails}
        className="block w-full cursor-pointer rounded-lg bg-primary px-6 py-3 text-center font-bold text-white transition-all duration-300 hover:bg-primary/90"
      >
        View Event Details
      </button>
    </div>
  );
}

interface GuestCardProps {
  guest: SpecialGuest;
  onViewProfile?: () => void;
}

function GuestCard({ guest, onViewProfile }: GuestCardProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden bg-muted">
        {guest.imageUrl ? (
          <Image
            src={guest.imageUrl}
            alt={guest.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
              {guest.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h4 className="mb-2 text-lg font-bold leading-7 text-foreground sm:text-xl">
            {guest.name}
          </h4>
          {guest.title && (
            <p className="mb-2 text-sm leading-5 text-muted-foreground line-clamp-2">
              {guest.title}
            </p>
          )}
          {guest.bio && (
            <div
              className="mb-4 text-sm leading-5 text-foreground line-clamp-3"
              dangerouslySetInnerHTML={{ __html: guest.bio }}
            />
          )}
        </div>
        <button
          onClick={onViewProfile}
          className="mt-auto block w-full shrink-0 cursor-pointer rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-center font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// ============================================
// SKELETON COMPONENTS
// ============================================

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-gradient-to-br from-white to-slate-50 p-6 shadow-md sm:p-8 animate-pulse">
      <div className="mb-4 h-16 w-16 rounded-full bg-muted" />
      <div className="mb-3 h-6 w-32 rounded bg-muted" />
      <div className="mb-6 space-y-2 w-full">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 mx-auto rounded bg-muted" />
      </div>
      <div className="mt-auto h-10 w-28 rounded-lg bg-muted" />
    </div>
  );
}

function NomineeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card animate-pulse">
      <div className="aspect-3/4 w-full bg-muted" />
      <div className="p-6">
        <div className="mb-2 h-7 w-3/4 rounded bg-muted" />
        <div className="mb-2 h-5 w-1/2 rounded bg-muted" />
        <div className="mb-3 h-4 w-2/3 rounded bg-muted" />
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
        <div className="h-11 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-8 animate-pulse">
      <div className="mb-3 h-7 w-24 rounded-full bg-muted" />
      <div className="mb-4 h-8 w-3/4 rounded bg-muted" />
      <div className="mb-4 space-y-2">
        <div className="h-5 w-1/2 rounded bg-muted" />
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="h-5 w-1/3 rounded bg-muted" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
      <div className="h-12 w-full rounded-lg bg-muted" />
    </div>
  );
}

function GuestCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card animate-pulse">
      <div className="aspect-3/4 w-full shrink-0 bg-muted" />
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-2 h-7 w-3/4 rounded bg-muted" />
          <div className="mb-2 h-10 w-full rounded bg-muted" />
          <div className="mb-4 space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-auto h-11 w-full shrink-0 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

// Type for modal data
type ModalData = 
  | { type: 'event'; data: { id: string; title: string; date: string; location: string; venue: string; description: string; mainEvent: boolean } }
  | { type: 'nominee'; data: Nominee }
  | { type: 'guest'; data: SpecialGuest }
  | null;

export default function FestivalsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("awards");
  const [modalData, setModalData] = useState<ModalData>(null);

  // Track which tabs have been visited to lazy-load data
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set(['awards']));

  useEffect(() => {
    setVisitedTabs(prev => {
      if (prev.has(activeTab)) return prev;
      return new Set(prev).add(activeTab);
    });
  }, [activeTab]);

  // Awards API data - always loaded (default tab)
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useAwardCategories('ACTIVE');
  const { nominees, isLoading: nomineesLoading, isError: nomineesError } = useApprovedNominees();

  // Events API data - lazy loaded only when Events tab is visited
  const { events: apiEvents, isLoading: eventsLoading, isError: eventsError } = useEvents(
    visitedTabs.has('events') ? { status: 'PUBLISHED', sortBy: 'eventDate', sortOrder: 'asc' } : undefined
  );

  // Guests API data - lazy loaded only when Guests tab is visited
  const { guests, isLoading: guestsLoading, isError: guestsError } = useActiveGuests(visitedTabs.has('guests'));

  const events = useMemo(() => {
    if (!apiEvents || !Array.isArray(apiEvents)) return [];
    return apiEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: formatEventDate(event.eventDate),
      location: event.venue,
      venue: event.eventTime ? `${event.eventTime}` : 'Time TBA',
      description: event.description || 'Join us for this exciting event.',
      featured: !isMainEvent(event),
      mainEvent: isMainEvent(event),
    }));
  }, [apiEvents]);

  // Group nominees by category
  const nomineesByCategory = useMemo(() => {
    if (!nominees || !categories || !Array.isArray(nominees) || !Array.isArray(categories)) return {};
    const grouped: Record<string, Nominee[]> = {};
    categories.forEach(cat => {
      grouped[cat.id] = nominees.filter(n => n.categoryId === cat.id);
    });
    return grouped;
  }, [nominees, categories]);

  const handleCategoryClick = (categoryId: string) => {
    // Smooth scroll to category section
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex h-[420px] w-full items-center justify-center overflow-hidden sm:h-[500px] md:h-[600px]"
      >
        {/* Background Image */}
        <Image
          src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/festivalbackground.png"
          alt="Bsocio Hero Festivals Background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-[642px] px-5 text-center sm:px-6">
          <h1 className="mb-4 text-3xl font-bold leading-none text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Bsocio Hero Festivals
          </h1>
          <p className="text-lg text-white/90 sm:text-xl md:text-2xl lg:text-3xl">
            Where impact is celebrated and legacy is honored.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-50 border-b border-border bg-background shadow-sm">
        <div className="mx-auto flex max-w-[1232px] gap-4 px-5 sm:gap-8 sm:px-16 md:px-20 lg:px-32">
          <TabButton active={activeTab === "awards"} onClick={() => setActiveTab("awards")}>
            Awards
          </TabButton>
          <TabButton active={activeTab === "events"} onClick={() => setActiveTab("events")}>
            Events
          </TabButton>
          <TabButton active={activeTab === "guests"} onClick={() => setActiveTab("guests")}>
            Special Guests
          </TabButton>
        </div>
      </div>

      {/* Awards Section */}
      <section
        className={cn("bg-muted/30 py-12 md:py-16", activeTab !== "awards" && "hidden")}
        id="awards-section"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-16 lg:px-20">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
              Honoring Extraordinary Impact
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Our Hero Awards spotlight individuals whose work embodies service, leadership, innovation, and social responsibility. Each category reflects a commitment to creating lasting, positive change.
            </p>
          </div>

          {/* Award Categories */}
          <div className="mb-12">
            <h3 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
              Award Categories
            </h3>
            {categoriesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                <CategoryCardSkeleton />
                <CategoryCardSkeleton />
                <CategoryCardSkeleton />
                <CategoryCardSkeleton />
                <CategoryCardSkeleton />
                <CategoryCardSkeleton />
              </div>
            ) : categoriesError ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Unable to load categories. Please try again later.</p>
              </div>
            ) : Array.isArray(categories) && categories.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Award categories will be announced soon.</p>
              </div>
            )}
          </div>

          {/* Nominees Section - Display all categories with their nominees */}
          {nomineesLoading ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <NomineeCardSkeleton />
              <NomineeCardSkeleton />
              <NomineeCardSkeleton />
              <NomineeCardSkeleton />
              <NomineeCardSkeleton />
              <NomineeCardSkeleton />
            </div>
          ) : nomineesError ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Unable to load nominees. Please try again later.</p>
            </div>
          ) : Array.isArray(categories) && categories.length > 0 ? (
            <div className="space-y-20">
              {categories.map((category) => {
                const categoryNominees = nomineesByCategory[category.id] || [];
                if (categoryNominees.length === 0) return null;

                return (
                  <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                    <h3 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                      {category.name} Awards
                    </h3>
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {categoryNominees.map((nominee) => (
                        <NomineeCard
                          key={nominee.id}
                          nominee={nominee}
                          showCategory={false}
                          onViewProfile={() => setModalData({ type: 'nominee', data: nominee })}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nominees will be announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section
        className={cn("bg-muted/30 py-12 md:py-16", activeTab !== "events" && "hidden")}
        id="events-section"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-16 lg:px-20">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
              Moments That Inspire Action
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              From award ceremonies to thought-leadership gatherings, Bsocio events are designed to connect purpose-driven leaders and celebrate shared values that shape a better future.
            </p>
          </div>

          {eventsLoading ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : eventsError ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No events available at this time. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onViewDetails={() => setModalData({ type: 'event', data: event })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Guests Section */}
      <section
        className={cn("bg-muted/30 py-12 md:py-16", activeTab !== "guests" && "hidden")}
        id="guests-section"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-16 lg:px-20">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
              Voices That Lead and Inspire
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Our festivals feature distinguished guests whose journeys, ideas, and contributions continue to influence global progress and community transformation.
            </p>
          </div>

          {guestsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              <GuestCardSkeleton />
              <GuestCardSkeleton />
              <GuestCardSkeleton />
              <GuestCardSkeleton />
            </div>
          ) : guestsError ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Unable to load guests. Please try again later.</p>
            </div>
          ) : Array.isArray(guests) && guests.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {guests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onViewProfile={() => setModalData({ type: 'guest', data: guest })}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Special guests will be announced closer to the event.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />

      {/* Details Modal */}
      <Modal open={modalData !== null} onOpenChange={(open) => !open && setModalData(null)}>
        <ModalContent className="max-w-2xl">
          {modalData?.type === 'event' && (
            <>
              <ModalHeader className="space-y-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 w-fit rounded-full px-4 py-1.5 text-sm font-bold text-white",
                    modalData.data.mainEvent ? "bg-secondary" : "bg-[#7CB342]"
                  )}
                >
                  {modalData.data.mainEvent ? "🎉 Main Event" : "✨ Featured"}
                </span>
                <ModalTitle className="text-2xl sm:text-3xl font-bold">{modalData.data.title}</ModalTitle>
              </ModalHeader>
              <ModalBody className="space-y-5">
                {/* Event Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Date</p>
                      <p className="text-sm font-semibold text-foreground">{modalData.data.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Location</p>
                      <p className="text-sm font-semibold text-foreground">{modalData.data.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Venue</p>
                      <p className="text-sm font-semibold text-foreground">{modalData.data.venue}</p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                {modalData.data.description && (
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-3">About This Event</h4>
                    <div
                      className="prose prose-sm max-w-none leading-relaxed text-muted-foreground [&_p]:text-muted-foreground [&_p]:mb-3"
                      dangerouslySetInnerHTML={{ __html: modalData.data.description }}
                    />
                  </div>
                )}
              </ModalBody>
            </>
          )}

          {modalData?.type === 'nominee' && (
            <>
              <ModalHeader className="space-y-0 pb-0">
                {modalData.data.imageUrl && (
                  <div className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] overflow-hidden bg-muted">
                    <Image
                      src={modalData.data.imageUrl}
                      alt={modalData.data.name}
                      width={672}
                      height={896}
                      sizes="(max-width: 640px) 100vw, 672px"
                      className="h-auto w-full"
                      priority
                      quality={85}
                    />
                  </div>
                )}
                <ModalTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                  {modalData.data.name}
                </ModalTitle>
                {modalData.data.title && (
                  <p className="text-lg text-primary font-medium mt-1">
                    {modalData.data.title}
                  </p>
                )}
              </ModalHeader>
              <ModalBody className="space-y-5 pt-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {modalData.data.isWinner && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold text-white">
                      🏆 Winner
                    </span>
                  )}
                  {modalData.data.category && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 px-3 py-1.5 text-sm font-medium">
                      ⭐ {modalData.data.category.name}
                    </span>
                  )}
                </div>

                {/* Organization/Location */}
                {modalData.data.organization && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-red-500">📍</span>
                    {modalData.data.organization}
                  </p>
                )}

                {/* About section */}
                {modalData.data.about && (
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-3">About</h4>
                    <div
                      className="prose prose-sm max-w-none leading-relaxed text-muted-foreground [&_p]:text-muted-foreground [&_p]:mb-3"
                      dangerouslySetInnerHTML={{ __html: modalData.data.about }}
                    />
                  </div>
                )}

                {/* Key Achievements */}
                {modalData.data.keyAchievements && modalData.data.keyAchievements.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-3">Key Achievements</h4>
                    <ul className="space-y-3">
                      {modalData.data.keyAchievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impact Story */}
                {modalData.data.impactStory && (
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-3">Impact Story</h4>
                    <div
                      className="prose prose-sm max-w-none leading-relaxed text-muted-foreground [&_p]:text-muted-foreground [&_p]:mb-3"
                      dangerouslySetInnerHTML={{ __html: modalData.data.impactStory }}
                    />
                  </div>
                )}

                {/* Quote */}
                {modalData.data.quote && (
                  <div className="pt-2 p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                    <p className="text-foreground italic leading-relaxed">
                      &ldquo;{modalData.data.quote}&rdquo;
                    </p>
                  </div>
                )}
              </ModalBody>
            </>
          )}

          {modalData?.type === 'guest' && (
            <>
              <ModalHeader className="space-y-0 pb-0">
                {modalData.data.imageUrl && (
                  <div className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] overflow-hidden bg-muted">
                    <Image
                      src={modalData.data.imageUrl}
                      alt={modalData.data.name}
                      width={672}
                      height={896}
                      sizes="(max-width: 640px) 100vw, 672px"
                      className="h-auto w-full"
                      priority
                      quality={85}
                    />
                  </div>
                )}
                <ModalTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                  {modalData.data.name}
                </ModalTitle>
                {modalData.data.title && (
                  <p className="text-lg text-primary font-medium mt-1">
                    {modalData.data.title}
                  </p>
                )}
              </ModalHeader>
              <ModalBody className="space-y-5 pt-4">
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-medium">
                    <span>⭐</span> Special Guest
                  </span>
                </div>

                {/* Bio section */}
                {modalData.data.bio && (
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-3">Biography</h4>
                    <div
                      className="prose prose-sm max-w-none leading-relaxed text-muted-foreground [&_p]:text-muted-foreground [&_p]:mb-3"
                      dangerouslySetInnerHTML={{ __html: modalData.data.bio }}
                    />
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
