"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "./Header";

// Lazy load Footer - not needed for initial render
const Footer = dynamic(() => import("./Footer"), {
    loading: () => <footer className="w-full bg-slate-900 h-64" aria-hidden="true" />,
});

// Routes that use their own header/footer (hide the global ones)
const STANDALONE_ROUTES = ["/", "/landingpage"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStandalone = STANDALONE_ROUTES.includes(pathname);

    if (isStandalone) {
        return (
            <main id="main-content" className="flex-1" role="main">
                {children}
            </main>
        );
    }

    return (
        <>
            <Header />
            <main id="main-content" className="flex-1" role="main">
                {children}
            </main>
            <Footer />
        </>
    );
}
