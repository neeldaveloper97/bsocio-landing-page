"use client";

import { useState, useMemo } from "react";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import {
  FestivalsStarIcon as StarIcon,
  FestivalsHeartIcon as HeartIcon,
  FestivalsUsersIcon as UsersIcon,
} from "@/components/ui/brand-icons";
import { useEvents, useEventStatistics } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

type TabType = "awards" | "events" | "guests";

// ============================================
// DATA
// ============================================

const foundingHeroes = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Founder, Global Food Initiative",
    location: "Singapore",
    description: "Led nutrition programs reaching 2.5 million children across Southeast Asia.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "CEO, Hunger Relief Network",
    location: "United States",
    description: "Mobilized $50M in donations to combat child hunger in underserved communities.",
  },
  {
    id: 3,
    name: "Amara Okafor",
    role: "Director, Community Nutrition Programs",
    location: "Nigeria",
    description: "Established sustainable farming initiatives providing food security for 500K families.",
  },
];

const philanthropyHeroes = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Philanthropist & Social Entrepreneur",
    location: "Spain",
    description: "Funded educational programs for 100,000 children in underserved regions worldwide.",
  },
  {
    id: 2,
    name: "Dr. Raj Patel",
    role: "Global Health Advocate",
    location: "India",
    description: "Pioneered telemedicine nutrition consultations for rural communities across South Asia.",
  },
];

const changeMakers = [
  {
    id: 1,
    name: "Coming Soon",
    role: "Change Maker Honorees",
    location: "Global",
    description: "Recognizing individuals who are driving meaningful change in their communities.",
    disabled: true,
  },
];

const guests = [
  {
    id: 1,
    name: "Jon Batiste",
    role: "Grammy Award-Winning Artist",
    description: "Musical Performance & Keynote Speaker",
  },
  {
    id: 2,
    name: "David Beckham",
    role: "Global Humanitarian Icon",
    description: "Guest of Honor",
  },
  {
    id: 3,
    name: "Dr. Lawrence Haddad",
    role: "World Food Prize Laureate",
    description: "Keynote Speaker",
  },
  {
    id: 4,
    name: "Catherine Kamau",
    role: "Acclaimed Actress & Storyteller",
    description: "Host & Community Voice",
  },
];

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

interface NavCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onClick: () => void;
}

function NavCard({ icon, iconBg, title, description, onClick }: NavCardProps) {
  return (
    <div
      className="group flex cursor-pointer flex-col items-center rounded-2xl border border-border bg-linear-to-br from-white to-slate-50 p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl sm:p-8"
      onClick={onClick}
    >
      <div
        className={cn(
          "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
          iconBg
        )}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold leading-tight text-foreground sm:text-xl">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <span className="mt-auto inline-block rounded-lg border-2 border-accent bg-transparent px-6 py-3 text-base font-semibold text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
        Explore →
      </span>
    </div>
  );
}

interface AwardCardProps {
  name: string;
  role: string;
  location: string;
  description: string;
  disabled?: boolean;
}

function AwardCard({ name, role, location, description, disabled }: AwardCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-64 items-center justify-center bg-muted text-sm font-medium text-primary">
        [{name} Image]
      </div>
      <div className="p-6">
        <h4 className="mb-2 text-xl font-bold leading-7 text-foreground">{name}</h4>
        <p className="mb-2 text-sm leading-5 text-primary">{role}</p>
        <p className="mb-3 text-sm leading-5 text-muted-foreground">{location}</p>
        <p className="mb-4 leading-relaxed text-foreground">{description}</p>
        <button
          className={cn(
            "w-full rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-center font-bold text-primary transition-all duration-300",
            "hover:bg-primary hover:text-white",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {disabled ? "Coming Soon" : "View Profile"}
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
      <p className="mb-4 leading-relaxed text-muted-foreground">{description}</p>
      <button className="w-full rounded-lg bg-primary px-6 py-3 text-center font-bold text-white transition-all duration-300 hover:bg-primary/90">
        View Event Details
      </button>
    </div>
  );
}

interface GuestCardProps {
  name: string;
  role: string;
  description: string;
}

function GuestCard({ name, role, description }: GuestCardProps) {
  return (
    <div className="flex min-h-[500px] w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:min-h-[530px]">
      <div className="flex h-64 shrink-0 items-center justify-center bg-muted text-sm font-medium text-primary sm:h-72 md:h-80">
        [{name} Image]
      </div>
      <div className="flex min-h-[180px] flex-1 flex-col justify-between p-5 sm:min-h-[200px] sm:p-6">
        <div>
          <h4 className="mb-2 text-lg font-bold leading-7 text-foreground sm:text-xl">
            {name}
          </h4>
          <p className="mb-2 min-h-[40px] text-sm leading-5 text-muted-foreground">
            {role}
          </p>
          <p className="mb-4 text-sm leading-5 text-primary">{description}</p>
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
  
  const { events: apiEvents, isLoading: eventsLoading, isError: eventsError } = useEvents({
    status: 'PUBLISHED',
    sortBy: 'eventDate',
    sortOrder: 'asc',
  });

  const { statistics } = useEventStatistics();

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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

          {/* Awards Navigation Cards */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <NavCard
              icon={<StarIcon />}
              iconBg="bg-secondary/10"
              title="Founding Birthday Hero"
              description="Honoring the pioneers who sparked a global movement of generosity."
              onClick={() => scrollToSection("founding-heroes")}
            />
            <NavCard
              icon={<HeartIcon />}
              iconBg="bg-accent/10"
              title="Philanthropy Hero"
              description="Celebrating individuals whose generosity creates lasting impact at scale."
              onClick={() => scrollToSection("philanthropy-heroes")}
            />
            <NavCard
              icon={<UsersIcon />}
              iconBg="bg-primary/10"
              title="Change Makers"
              description="Recognizing bold action and innovation that drive meaningful change."
              onClick={() => scrollToSection("changemaker-heroes")}
            />
          </div>

          {/* Founding Birthday Hero Awards */}
          <div className="mb-12" id="founding-heroes">
            <h3 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
              Founding Birthday Hero Awards
            </h3>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {foundingHeroes.map((hero) => (
                <AwardCard key={hero.id} {...hero} />
              ))}
            </div>
          </div>

          {/* Philanthropy Hero Awards */}
          <div className="mb-12" id="philanthropy-heroes">
            <h3 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
              Philanthropy Hero Awards
            </h3>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {philanthropyHeroes.map((hero) => (
                <AwardCard key={hero.id} {...hero} />
              ))}
            </div>
          </div>

          {/* Change Makers Awards */}
          <div id="changemaker-heroes">
            <h3 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
              Change Makers Awards
            </h3>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {changeMakers.map((hero) => (
                <AwardCard key={hero.id} {...hero} disabled={hero.disabled} />
              ))}
            </div>
          </div>
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

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {guests.map((guest) => (
              <GuestCard key={guest.id} {...guest} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
