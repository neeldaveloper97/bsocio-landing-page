"use client";

import { useState, useMemo } from "react";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import { useEvents, useEventStatistics } from "@/hooks";
import { useAwardCategories, useApprovedNominees, useActiveGuests } from "@/hooks";
import { cn } from "@/lib/utils";
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
        "border-b-4 border-transparent bg-transparent py-4 text-base font-bold leading-6 transition-all duration-300",
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
}

function NomineeCard({ nominee, showCategory }: NomineeCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-64 items-center justify-center bg-muted text-sm font-medium text-primary">
        {nominee.imageUrl ? (
          <img
            src={nominee.imageUrl}
            alt={nominee.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
            {nominee.name.charAt(0)}
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
        <button className="w-full rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-center font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
          View Profile
        </button>
      </div>
    </div>
  );
}

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  venue: string;
  description: string;
  mainEvent: boolean;
}

function EventCard({ title, date, location, venue, description, mainEvent }: EventCardProps) {
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
        className="mb-4 leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <button className="w-full rounded-lg bg-primary px-6 py-3 text-center font-bold text-white transition-all duration-300 hover:bg-primary/90">
        View Event Details
      </button>
    </div>
  );
}

interface GuestCardProps {
  guest: SpecialGuest;
}

function GuestCard({ guest }: GuestCardProps) {
  return (
    <div className="flex min-h-[500px] w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:min-h-[530px]">
      <div className="relative flex h-64 shrink-0 items-center justify-center bg-muted text-sm font-medium text-primary sm:h-72 md:h-80">
        {guest.imageUrl ? (
          <img
            src={guest.imageUrl}
            alt={guest.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
            {guest.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex min-h-[180px] flex-1 flex-col justify-between p-5 sm:min-h-[200px] sm:p-6">
        <div>
          <h4 className="mb-2 text-lg font-bold leading-7 text-foreground sm:text-xl">
            {guest.name}
          </h4>
          {guest.title && (
            <p className="mb-2 min-h-[40px] text-sm leading-5 text-muted-foreground">
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
        <button className="mt-auto w-full shrink-0 rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-center font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white">
          View Profile
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function FestivalsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("awards");
  
  // Events API data
  const { events: apiEvents, isLoading: eventsLoading, isError: eventsError } = useEvents({
    status: 'PUBLISHED',
    sortBy: 'eventDate',
    sortOrder: 'asc',
  });
  const { statistics } = useEventStatistics();

  // Awards API data - Load all nominees at once
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useAwardCategories('ACTIVE');
  const { nominees, isLoading: nomineesLoading, isError: nomineesError } = useApprovedNominees();
  const { guests, isLoading: guestsLoading, isError: guestsError } = useActiveGuests();

  const events = useMemo(() => {
    if (!apiEvents) return [];
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
    if (!nominees || !categories) return {};
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
        className="relative flex h-[420px] w-full items-center justify-center bg-cover bg-center sm:h-[500px] md:h-[600px]"
        style={{ background: "linear-gradient(135deg, #1F6AE1 0%, #009689 100%)" }}
      >
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
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : categoriesError ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Unable to load categories. Please try again later.</p>
              </div>
            ) : categories && categories.length > 0 ? (
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
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : nomineesError ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Unable to load nominees. Please try again later.</p>
            </div>
          ) : categories && categories.length > 0 ? (
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
                        <NomineeCard key={nominee.id} nominee={nominee} showCategory={false} />
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
            {statistics && (
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-8">
                <span><strong>{statistics.upcomingEvents}</strong> Upcoming Events</span>
                <span><strong>{statistics.pastEvents}</strong> Past Events</span>
                <span><strong>{statistics.totalAttendees.toLocaleString()}</strong> Total Attendees</span>
              </div>
            )}
          </div>

          {eventsLoading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading events...</p>
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
                <EventCard key={event.id} {...event} />
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
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : guestsError ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Unable to load guests. Please try again later.</p>
            </div>
          ) : guests && guests.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {guests.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
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
    </>
  );
}
