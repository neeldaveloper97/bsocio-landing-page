"use client";

import React from "react";

// ─── Logo ────────────────────────────────────────────────────
export function BsocioLogo({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            className="group relative inline-block cursor-pointer border-none bg-transparent p-0 text-[2.2rem] font-bold tracking-[-0.8px] transition-transform duration-300"
            onClick={onClick}
            aria-label="Bsocio - Return to homepage"
        >
            <span className="text-[#2A5CBD] group-hover:text-[#1E429F]">B</span>
            <span className="text-[#1A1A1A]">socio</span>
            <span className="absolute bottom-[5px] right-[-15px] h-[10px] w-[10px] rounded-full bg-[#F65314] transition-all duration-300 group-hover:scale-120 group-hover:bg-[#D3450F]" aria-hidden="true" />
        </button>
    );
}

// ─── Inline SVG Icons (replaces Font Awesome) ────────────────
export function Icon({ name, className = "" }: { name: string; className?: string }) {
    const svgProps = { className: `inline-flex items-center justify-center shrink-0 align-middle ${className}`, width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const, focusable: false as const };
    switch (name) {
        case "minus-circle": return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>;
        case "bullseye": return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
        case "eye": return <svg {...svgProps}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>;
        case "heart": return <svg {...svgProps} fill="currentColor" stroke="none" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>;
        case "utensils": return <svg {...svgProps}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
        case "laptop-code": return <svg {...svgProps}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" /><path d="m9 10 2 2-2 2" /><path d="M13 14h2" /></svg>;
        case "heartbeat": return <svg {...svgProps}><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" /><path d="M3 12h4l2-4 4 8 2-4h6" /></svg>;
        case "leaf": return <svg {...svgProps}><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s.5 5.5-2.5 10.5A7 7 0 0 1 11 20z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>;
        case "people-arrows": return <svg {...svgProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
        case "balance-scale": return <svg {...svgProps}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>;
        case "handshake": return <svg {...svgProps}><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14h2" /><path d="m14 14-5-5q-2-2-5-1L3 9" /></svg>;
        case "chart-line": return <svg {...svgProps}><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></svg>;
        case "bullhorn": return <svg {...svgProps}><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>;
        case "expand-arrows-alt": return <svg {...svgProps}><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>;
        case "network-wired": return <svg {...svgProps}><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg>;
        case "trophy": return <svg {...svgProps}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>;
        case "award": return <svg {...svgProps}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>;
        case "microphone-alt": return <svg {...svgProps}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>;
        case "user": return <svg {...svgProps}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
        default: return <svg {...svgProps}><circle cx="12" cy="12" r="10" /></svg>;
    }
}

// ─── Section wrapper ─────────────────────────────────────────
export function Section({
    children,
    className = "",
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} className={`py-16 md:py-20 ${className}`}>
            <div className="mx-auto w-full max-w-[1200px] px-5">{children}</div>
        </section>
    );
}

export function SectionTitle({
    children,
    className = "",
    light = false,
}: {
    children: React.ReactNode;
    className?: string;
    light?: boolean;
}) {
    return (
        <div className={`mb-8 md:mb-12 text-center ${className}`}>
            <h2
                className={`relative inline-block pb-3 text-2xl font-bold md:text-[2.2rem] font-[Montserrat,sans-serif] ${light ? "text-white" : "text-[#202124]"}`}
            >
                {children}
                <span
                    className={`absolute bottom-0 left-1/2 h-1 w-[70px] -translate-x-1/2 ${light ? "bg-[#F65314]" : "bg-[#2A5CBD]"}`}
                />
            </h2>
        </div>
    );
}
