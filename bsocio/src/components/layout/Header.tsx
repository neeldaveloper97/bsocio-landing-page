"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "News & Media", href: "/news-media" },
  { label: "Festivals", href: "/festivals" },
  { label: "FAQs", href: "/faqs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-site">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-text-dark hover:bg-brand-blue/10 hover:text-brand-blue"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button size="lg">
              Accept Your Free $250 Gift
            </Button>
          </div>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-white shadow-lg lg:hidden animate-slide-down">
          <nav className="container-site flex flex-col py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-text-dark hover:bg-brand-blue/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-border">
              <Button className="w-full" size="lg">
                Accept Your Free $250 Gift
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
