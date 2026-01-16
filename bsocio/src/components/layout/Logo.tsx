import Link from "next/link";

export function Logo({ variant = "header" }: { variant?: "header" | "footer" }) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      className="group relative inline-block text-xl font-bold leading-none sm:text-2xl"
    >
      <span className={isFooter ? "text-white" : "text-text-dark"}>
        <span className="text-brand-blue">B</span>socio
      </span>
      <span
        className="absolute -right-3 bottom-0.5 h-2 w-2 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-125"
      />
    </Link>
  );
}
