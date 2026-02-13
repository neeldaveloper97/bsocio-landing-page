"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Logo({ variant = "header" }: { variant?: "header" | "footer" }) {
  const isFooter = variant === "footer";
  const pathname = usePathname();

  // On the home landing page, logo goes to "/" (root);
  // everywhere else, logo goes to "/homelandingpage"
  const href = pathname === "/homelandingpage" ? "/" : "/homelandingpage";

  return (
    <Link
      href={href}
      className="group relative inline-block text-xl font-bold leading-none sm:text-2xl"
      aria-label="Bsocio - Home"
    >
      <span className={isFooter ? "text-white" : "text-text-dark"}>
        <span className="text-brand-blue">B</span>socio
      </span>
      <span
        className="absolute -right-3 bottom-0.5 h-2 w-2 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-125"
        aria-hidden="true"
      />
    </Link>
  );
}
