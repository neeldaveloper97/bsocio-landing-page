"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "default" | "white";
}

export function Logo({ className, variant = "white" }: LogoProps) {
    return (
        <Link
            href="/dashboard"
            className={cn(
                "group relative inline-flex items-center text-xl font-bold leading-none sm:text-2xl gap-0.5",
                className
            )}
            aria-label="Bsocio Admin - Dashboard"
        >
            <span className={variant === "white" ? "text-white" : "text-gray-900"}>
                <span className="text-brand-blue">B</span>socio
            </span>
            <span
                className="h-2 w-2 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-125 mb-1"
                aria-hidden="true"
            />
        </Link>
    );
}
