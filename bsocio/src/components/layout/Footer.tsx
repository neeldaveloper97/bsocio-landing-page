import Link from "next/link";
import { Logo } from "./Logo";
import { Facebook, Twitter, Linkedin, Instagram, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// CONSTANTS
// ============================================

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

interface FooterSection {
  title: string;
  links: { href: string; label: string; disabled?: boolean }[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/festivals", label: "Festivals" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/news-media", label: "News & Media" },
      { href: "/faqs", label: "FAQs" },
      { href: "/our-structure", label: "Our Structure" },
      { href: "/leadership", label: "Leadership Team" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

function SocialLink({ icon: Icon, href, label }: SocialLink) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg",
        "bg-slate-700 text-gray-100",
        "transition-all duration-200",
        "hover:bg-primary hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-gray-100 sm:text-lg">
        {title}
      </h3>
      <ul className="space-y-3" role="list">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <li>
        <span
          className={cn(
            "text-sm text-gray-500 cursor-not-allowed"
          )}
          title="Coming Soon"
        >
          {children}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "text-sm text-gray-300 transition-colors duration-200",
          "hover:text-white",
          "focus:outline-none focus:text-primary"
        )}
      >
        {children}
      </Link>
    </li>
  );
}

// ============================================
// MAIN FOOTER COMPONENT
// ============================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-slate-900 text-gray-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-2 space-y-6 md:col-span-1">
            <Logo variant="footer" />
            {/* <nav className="flex flex-wrap gap-3 mt-2" aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
                <SocialLink key={social.label} {...social} />
              ))}
            </nav> */}
          </div>

          {/* Navigation Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <FooterColumn key={section.title} title={section.title}>
              {section.links.map((link) => (
                <FooterLink key={link.href} href={link.href} disabled={link.disabled}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-700">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} Bsocio – The Future of Humanity Initiative. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
