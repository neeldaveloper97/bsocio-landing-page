"use client";

import { useState, useCallback, useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// INLINE SVG ICONS - Avoid lucide-react bundle
// ============================================

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ============================================
// NAVIGATION CONFIG
// ============================================

const NAV_ITEMS = [
  { label: "About", href: "/about"},
  { label: "How it works", href: "/how-it-works"},
  { label: "News & Media", href: "/news-media"},
  { label: "Festivals", href: "/festivals"},
  { label: "FAQs", href: "/faqs"},
] as const;

// ============================================
// NAV LINK COMPONENT - Memoized to prevent re-renders
// ============================================

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
  disabled?: boolean;
}

const NavLink = memo(function NavLink({ href, label, isActive, onClick, variant = "desktop", disabled = false }: NavLinkProps) {
  // Pre-computed class strings to avoid cn() calls on every render
  const className = variant === "desktop"
    ? `font-medium transition-colors duration-200 rounded-lg px-4 py-2 text-sm ${
        disabled
          ? "text-muted-foreground/50 cursor-not-allowed"
          : isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-primary/10 hover:text-primary"
      }`
    : `font-medium transition-colors duration-200 rounded-lg px-4 py-3 text-base ${
        disabled
          ? "text-muted-foreground/50 cursor-not-allowed"
          : isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-primary/10 hover:text-primary"
      }`;

  if (disabled) {
    return (
      <span className={className} title="Coming Soon">
        {label}
      </span>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  );
});

// ============================================
// MOBILE MENU OVERLAY
// ============================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - positioned below header */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown Panel from Top - fixed below header */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed left-0 right-0 top-16 lg:hidden",
          "transform transition-all duration-300 ease-in-out",
          "bg-background shadow-2xl border-b border-border",
          "max-h-[calc(100vh-4rem)] overflow-y-auto",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible -translate-y-4"
        )}
      >
        <nav
          className="flex flex-col"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {/* Navigation Links */}
          <div className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
                onClick={onClose}
                variant="mobile"
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
    {/* Spacer to prevent content jump when header becomes fixed */}
    {isMenuOpen && <div className="h-16 lg:hidden" />}
    <header
      className={cn(
        "top-0 z-50 w-full",
        isMenuOpen ? "fixed" : "sticky",
        "border-b border-border",
        "bg-background/[0.97]",
        "md:bg-background/95 md:backdrop-blur-md",
        "md:supports-[backdrop-filter]:bg-background/80",
        "shadow-sm dark:shadow-none dark:border-border/50"
      )}
      role="banner"
    >
      <div className="mx-auto max-w-[1200px] w-full px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button asChild size="lg">
              <Link href="/signup/verify">Accept Your Free $250 Gift</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-primary/10 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Inside header */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        pathname={pathname}
      />
    </header>
    </>
  );
}
