import Link from "next/link";
import { Logo } from "./Logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-background-footer text-footer-text">
      <div className="container-site py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Logo variant="footer" />
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-footer-links transition-colors hover:bg-brand-blue"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/how-it-works">How It Works</FooterLink>
            <FooterLink href="/festivals">Festivals</FooterLink>
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <FooterLink href="/news-media">News & Media</FooterLink>
            <FooterLink href="/faqs">FAQs</FooterLink>
            <FooterLink href="/our-structure">Our Structure</FooterLink>
            <FooterLink href="/leadership">Leadership Team</FooterLink>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal">
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Use</FooterLink>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="container-site py-6">
          <p className="text-center text-sm text-footer-text">
            © {new Date().getFullYear()} Bsocio – The Future of Humanity Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
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
      <h3 className="mb-4 text-base font-semibold text-footer-links sm:text-lg">
        {title}
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-footer-text transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
