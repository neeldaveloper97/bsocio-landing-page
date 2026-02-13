"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

/* =============================================================
   Be Kind to Be Great Concert – Landing Page
   Exact recreation of the concert HTML design with all 9 sections,
   responsive design, mobile hamburger menu, smooth scrolling.
   ============================================================= */

// ─── Fonts: reuse DM Sans (body) + Arimo (headings) from layout ───

// ─── Lazy-loaded Signup Form ──────────────────────────────────
const SignupForm = dynamic(
    () => import("@/components/auth/SignupForm"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffc107] border-t-transparent" />
            </div>
        ),
    }
);

// ─── Icons ────────────────────────────────────────────────────
function HamburgerIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

// ─── Section Title ────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="relative mb-[50px] text-center font-[var(--font-arimo),serif] text-[1.8rem] font-bold leading-[1.2] text-[#212121] sm:text-[2rem] md:text-[2.5rem]">
            {children}
            <span className="absolute bottom-[-15px] left-1/2 h-[3px] w-[60px] -translate-x-1/2 bg-[#ffc107]" />
        </h2>
    );
}

// ─── Nav items ────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "About", href: "#about" },
    { label: "Why It Matters", href: "#why" },
    { label: "Activities", href: "#activities" },
    { label: "Honoree", href: "#honoree" },
    { label: "Request Invitation", href: "#cta" },
];

// ─── Activities data ──────────────────────────────────────────
const ACTIVITIES = [
    { icon: "🏆", title: "Hunger Games Arena", text: "Thrilling competitions raising awareness and mobilizing action against hunger.", borderColor: "border-t-[#c62828]" },
    { icon: "🎂", title: "Giant Cake Parade", text: "A symbolic and joyful global birthday celebration for Jon Batiste's 40th.", borderColor: "border-t-[#ffc107]" },
    { icon: "🎤", title: "Impact Stage", text: "Surprise guests, celebrities, and humanitarian icons sharing stories of impact.", borderColor: "border-t-[#1a237e]" },
    { icon: "👑", title: "Hunger Hero Crowning", text: "Medals, global recognition, and worldwide visibility for humanitarian champions.", borderColor: "border-t-[#2e7d32]" },
];

// ─── Attendee list ────────────────────────────────────────────
const ATTENDEES = [
    "Global Leaders",
    "Artists",
    "Humanitarian Champions",
    "Cultural Icons",
    "Change-makers",
    "Philanthropists",
    "Impact Investors",
    "Hunger Heroes",
];

// =============================================================
// MAIN COMPONENT
// =============================================================
export default function ConcertLandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const targetScrollRef = useRef<string | null>(null);

    const performScroll = useCallback((id: string) => {
        const el = document.querySelector(id);
        if (el) {
            window.scrollTo({
                top: (el as HTMLElement).offsetTop - 70,
                behavior: "smooth",
            });
        }
    }, []);

    const scrollTo = useCallback((id: string) => {
        if (menuOpen || showSignupForm) {
            targetScrollRef.current = id;
            setMenuOpen(false);
            // If signup form is open, close it too (though specific requirement wasn't set, better UX)
            // But logic says setMenuOpen(false). 
            // If showSignupForm is true, we should probably close it too if we want to navigate?
            // The original logic `targetScrollRef.current = id; setMenuOpen(false);` only closed menu. 
            // If signup form was open, `locked` would still be true if we don't close signup form.
            // But `scrollTo` is called from Nav links. Signup form is just a modal. 
            // Let's stick to original behavior but make sure we scroll.
            // If signup form is open, we likely can't see nav links unless z-index allows.
            // Nav links are in header z-[1000]. Signup modal is z-[2000].
            // So if signup form is open, we can't click nav links? 
            // Wait, looking at code: `showSignupForm && ( ... z-[2000] ... )`.
            // Yes, signup form covers everything. So we don't need to worry about clicking nav links while signup form is open.

            // So only menuOpen matters for nav links (mobile).
        } else {
            performScroll(id);
        }
    }, [menuOpen, showSignupForm, performScroll]);

    useEffect(() => {
        const locked = menuOpen || showSignupForm;
        if (locked) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }

            if (targetScrollRef.current) {
                const targetId = targetScrollRef.current;
                setTimeout(() => {
                    performScroll(targetId);
                }, 50);
                targetScrollRef.current = null;
            }
        }
        return () => {
            // Cleanup if needed, but the main cleanup is ensuring state is restored when component unmounts?
            // The original return cleanup only handled restoring if locked.
            if (locked) {
                const scrollY = document.body.style.top;
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
                if (scrollY) window.scrollTo(0, parseInt(scrollY) * -1);
            }
        };
    }, [menuOpen, showSignupForm, performScroll]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowSignupForm(false);
        };
        if (showSignupForm) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [showSignupForm]);

    const handleCtaClick = useCallback(() => {
        setShowSignupForm(true);
    }, []);

    return (
        <div className="font-[var(--font-dm-sans),sans-serif] text-[#212121] leading-relaxed">
            {/* ── Header / Navigation ─────────────────────── */}
            <header className="fixed top-0 left-0 z-[1000] w-full bg-[#1a237e]/95 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-[15px]">
                    <a href="#" className="text-[1.5rem] font-extrabold text-white no-underline">
                        Be <span className="text-[#ffc107]">Kind</span> to Be <span className="text-[#ffc107]">Great</span>
                    </a>
                    {/* Mobile toggle */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white lg:hidden" aria-label="Toggle menu">
                        {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
                    </button>
                    {/* Desktop nav */}
                    <nav className="hidden lg:block">
                        <ul className="flex list-none items-center gap-0">
                            {NAV_LINKS.map((l) => (
                                <li key={l.href} className="ml-[30px]">
                                    <button
                                        onClick={() => scrollTo(l.href)}
                                        className="bg-transparent border-none text-[0.9rem] font-medium text-white transition-colors duration-300 hover:text-[#ffc107] cursor-pointer"
                                    >
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                {/* Mobile drawer */}
                <div className={`overflow-hidden transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[500px] border-t border-white/10" : "max-h-0"}`}>
                    <ul className="flex flex-col gap-1 px-5 py-4">
                        {NAV_LINKS.map((l) => (
                            <li key={l.href}>
                                <button
                                    onClick={() => scrollTo(l.href)}
                                    className="block w-full rounded-md px-4 py-3 text-left text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* ── Section 1: Hero ─────────────────────────── */}
            <section
                className="relative flex min-h-screen items-center justify-center px-4 pt-[70px] text-center text-white overflow-hidden"
            >
                <Image
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75"
                    alt="Concert stage with lights representing Be Kind to Be Great event"
                    fill
                    priority
                    fetchPriority="high"
                    className="object-cover object-center z-0"
                    sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-black/70 z-10" />
                <div className="mx-auto max-w-[800px] relative z-20">
                    <h1 className="mb-6 font-[var(--font-arimo),serif] text-[2rem] font-bold leading-[1.1] text-white sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem]">
                        Be Kind to Be Great Concert
                    </h1>
                    <div className="mb-8 font-[var(--font-arimo),serif] text-[1.2rem] font-light text-[#ffc107] sm:text-[1.5rem] md:text-[1.8rem]">
                        To Celebrate Culture in Service of Humanity
                    </div>
                    <div className="mb-12 text-[1rem] tracking-wider sm:text-[1.2rem] md:text-[1.5rem]">
                        <span className="mx-2.5 inline-block">📅 November 11, 2026</span>
                        <span className="mx-2.5 inline-block">📍 MetLife Stadium, New York</span>
                    </div>
                    <button
                        onClick={handleCtaClick}
                        className="inline-block rounded-[50px] bg-[#ffc107] px-8 py-4 text-[1rem] font-bold uppercase tracking-wider text-[#212121] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(255,193,7,0.4)] cursor-pointer border-none"
                    >
                        Request Invitation — It&apos;s Free
                    </button>
                </div>
                {/* Scroll indicator */}
                <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center text-[0.9rem] uppercase tracking-[2px] text-white animate-bounce z-20">
                    Scroll to Explore
                    <span className="mt-2.5 text-[1.2rem]">⌄</span>
                </div>
            </section>

            {/* ── Section 2: About the Event (What It Is) ── */}
            <section id="about" className="bg-[#f8f9fa] px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>What It Is</SectionTitle>
                    <div className="mx-auto max-w-[800px] text-center text-[1.2rem] leading-[1.8]">
                        <p className="mb-6">
                            A cultural celebration honoring <span className="font-bold text-[#1a237e]">Jon Batiste&apos;s 40th Birthday</span> and ushering in the <span className="font-bold text-[#1a237e]">Next Humanitarian Heroes</span>.
                        </p>
                        <p className="mb-6">
                            A world-class concert experience with a single mission: <span className="font-bold text-[#1a237e]">ensuring no child goes to school hungry — beyond 2045</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Why It Matters ───────────────── */}
            <section id="why" className="bg-gradient-to-br from-[rgba(26,35,126,0.05)] to-[rgba(106,27,154,0.05)] px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>Why This Event Matters</SectionTitle>
                    <div className="mx-auto max-w-[900px] text-center text-[1.3rem] leading-[1.8]">
                        <p className="mb-8">Jon Batiste has dedicated artistic excellence to impact, bringing culture to the center of philanthropy.</p>
                        <p className="mb-8">Hunger, equity, and dignity are not statistics — they are human realities demanding collective action.</p>
                    </div>
                </div>
            </section>

            {/* ── Section 4: How ──────────────────────────── */}
            <section id="how" className="bg-white px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>How</SectionTitle>
                    <div className="mx-auto flex max-w-[800px] flex-col items-center text-center">
                        <div className="mb-[30px] animate-[float_3s_ease-in-out_infinite] motion-safe:animate-[float_3s_ease-in-out_infinite] text-[4rem] text-[#6a1b9a]">
                            🏆
                        </div>
                        <h3 className="mb-5 font-[var(--font-arimo),serif] text-[1.8rem] font-bold text-[#6a1b9a]">
                            Culture in Service of Humanity Award 2026
                        </h3>
                        <p className="mb-[30px] text-[1.1rem] leading-[1.7]">
                            Honoring Jon Batiste&apos;s leadership in raising global awareness on hunger — including his journey with Bill Gates amplifying voices from affected communities.
                        </p>
                        <div className="mt-10 flex items-center justify-center text-[1.5rem] font-bold text-[#1a237e]">
                            <span className="mx-[15px]">Art</span>
                            <span className="text-[#1a237e]">→</span>
                            <span className="mx-[15px]">Awareness</span>
                            <span className="text-[#1a237e]">→</span>
                            <span className="mx-[15px]">Action</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Event Activities ─────────────── */}
            <section id="activities" className="bg-[#f8f9fa] px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>Event Activities</SectionTitle>
                    <div className="grid gap-[30px] sm:grid-cols-2">
                        {ACTIVITIES.map((a) => (
                            <div
                                key={a.title}
                                className={`rounded-[10px] border-t-[5px] bg-white p-[40px_30px] text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] ${a.borderColor}`}
                            >
                                <div className="mb-5 text-[3rem]">{a.icon}</div>
                                <h3 className="mb-[15px] font-[var(--font-arimo),serif] text-[1.5rem] font-bold">{a.title}</h3>
                                <p className="text-base">{a.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 6: Featured Honoree ─────────────── */}
            <section id="honoree" className="bg-white px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>Featured Honoree</SectionTitle>
                    <div className="grid items-center gap-[60px] md:grid-cols-2">
                        <div className="overflow-hidden rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                            <Image
                                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                alt="Jon Batiste performing on stage"
                                width={800}
                                height={533}
                                className="block h-auto w-full"
                            />
                        </div>
                        <div>
                            <h3 className="mb-2.5 font-[var(--font-arimo),serif] text-[2.5rem] font-bold text-[#1a237e]">
                                Jon Batiste
                            </h3>
                            <div className="mb-[30px] text-[1.5rem] font-semibold text-[#6a1b9a]">
                                Culture in Service of Humanity Award 2026
                            </div>
                            <p className="mb-[30px] text-[1.1rem] leading-[1.7]">
                                Awarded for artistic excellence in raising global awareness around hunger. Through his recent hunger-awareness journey alongside Bill Gates, Jon Batiste has amplified voices from affected communities—connecting lived experience to global platforms that drive understanding, funding, and action.
                            </p>
                            <p className="border-l-[3px] border-[#ffc107] pl-5 italic text-[#757575]">
                                Additional award nominees and honorees to be announced.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 7: Who Can Attend ───────────────── */}
            <section id="attend" className="bg-[#1a237e] px-5 py-16 text-white md:py-20">
                <div className="mx-auto max-w-[800px] text-center">
                    <h2 className="mb-5 font-[var(--font-arimo),serif] text-[2.5rem] font-bold">Who Can Attend</h2>
                    <div className="mb-10 text-[1.3rem] tracking-[2px] text-[#ffc107]">Invitation Only</div>
                    <ul className="flex flex-wrap justify-center gap-5 list-none md:flex-row flex-col items-center">
                        {ATTENDEES.map((a) => (
                            <li
                                key={a}
                                className="w-full max-w-[300px] rounded-[50px] bg-white/10 px-[25px] py-[15px] font-medium transition-all duration-300 hover:bg-white/20 hover:-translate-y-[5px] md:w-auto"
                            >
                                {a}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Section 8: Date & Venue ─────────────────── */}
            <section id="datevenue" className="bg-[#f8f9fa] px-5 py-16 md:py-20">
                <div className="mx-auto max-w-[1200px]">
                    <SectionTitle>When &amp; Where</SectionTitle>
                    <div className="grid items-center gap-[60px] md:grid-cols-2">
                        <div className="text-center">
                            <h3 className="mb-[15px] font-[var(--font-arimo),serif] text-[2.5rem] font-bold text-[#1a237e]">Date</h3>
                            <div className="mb-[30px] text-[1.5rem] font-medium">November 11, 2026</div>
                            <h3 className="mb-[15px] font-[var(--font-arimo),serif] text-[2.5rem] font-bold text-[#1a237e]">Venue</h3>
                            <div className="mb-[30px] text-[1.5rem] font-medium">MetLife Stadium, New York</div>
                        </div>
                        <div className="overflow-hidden rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                            <Image
                                src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                                alt="MetLife Stadium concert venue"
                                width={800}
                                height={533}
                                className="block h-auto w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 9: Final CTA ────────────────────── */}
            <section id="cta" className="bg-[#1a237e] px-5 py-[100px] text-center text-white">
                <div className="mx-auto max-w-[1200px]">
                    <h2 className="mb-[30px] font-[var(--font-arimo),serif] text-[2rem] font-bold text-[#ffc107] sm:text-[2.5rem] md:text-[3rem]">
                        Be Kind. Be Great. Serve Humanity.
                    </h2>
                    <div className="mb-10 text-[1.2rem] tracking-wider opacity-90">
                        Attendance is Free • Invitation Required
                    </div>

                    <button
                        onClick={handleCtaClick}
                        className="inline-block rounded-[50px] bg-[#ffc107] px-10 py-[18px] text-[1.1rem] font-bold uppercase tracking-wider text-[#212121] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(255,193,7,0.4)] cursor-pointer border-none"
                    >
                        Request Invitation
                    </button>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="bg-[#0d153a] px-5 pt-[60px] pb-[30px] text-white">
                <div className="mx-auto max-w-[1200px]">
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-[30px] md:flex-row flex-col text-center md:text-left">
                        <div>
                            <div className="mb-[15px] text-[1.8rem] font-extrabold">
                                Be <span className="text-[#ffc107]">Kind</span> to Be <span className="text-[#ffc107]">Great</span>
                            </div>
                            <div className="mb-5 text-[1.1rem] opacity-80">Culture in Service of Humanity</div>
                            <div className="flex justify-center gap-[15px] md:justify-start">
                                {[
                                    { icon: "facebook-f", href: "#", label: "Facebook" },
                                    { icon: "twitter", href: "#", label: "Twitter" },
                                    { icon: "instagram", href: "#", label: "Instagram" },
                                    { icon: "linkedin-in", href: "#", label: "LinkedIn" },
                                    { icon: "youtube", href: "#", label: "YouTube" },
                                ].map((s) => (
                                    <a
                                        key={s.icon}
                                        href={s.href}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#ffc107] hover:text-[#212121] hover:-translate-y-[3px]"
                                        aria-label={s.label}
                                    >
                                        <SocialIcon name={s.icon} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-[30px] md:justify-end">
                            {[
                                { label: "Privacy Policy", href: "/privacy" },
                                { label: "Terms of Use", href: "/terms" },
                                { label: "Contact", href: "/contact" },
                                { label: "FAQ", href: "/faqs" },
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-white/70 no-underline transition-colors duration-300 hover:text-[#ffc107]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-[30px] text-center text-[0.9rem] text-white/60">
                        <p>© 2026 Be Kind to Be Great Concert. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ── Signup Modal Overlay ────────────────────── */}
            {showSignupForm && (
                <div
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] overscroll-none touch-none"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowSignupForm(false); }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Request Invitation"
                >
                    <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 text-left shadow-2xl sm:p-8 animate-[slideUp_0.3s_ease-out]">
                        {/* Close button */}
                        <button
                            onClick={() => setShowSignupForm(false)}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 cursor-pointer border-none"
                            aria-label="Close"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>

                        <h3 className="mb-6 pr-8 text-center text-2xl font-bold text-gray-900">
                            Request Your Invitation
                        </h3>
                        <SignupForm
                            variant="inline"
                            title="Request Your Invitation"
                            onSuccess={() => setShowSignupForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Simple SVG Social Icons ──────────────────────────────────
function SocialIcon({ name }: { name: string }) {
    switch (name) {
        case "facebook-f":
            return (
                <svg width="16" height="16" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
            );
        case "twitter":
            return (
                <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </svg>
            );
        case "instagram":
            return (
                <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
            );
        case "linkedin-in":
            return (
                <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.83-48.3 93.97 0 111.31 61.9 111.31 142.3V448z" />
                </svg>
            );
        case "youtube":
            return (
                <svg width="16" height="16" viewBox="0 0 576 512" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
            );
        default:
            return null;
    }
}
