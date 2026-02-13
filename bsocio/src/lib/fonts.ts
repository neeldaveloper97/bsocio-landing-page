import { DM_Sans, Arimo, Montserrat, Open_Sans } from "next/font/google";

export const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-dm-sans",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
    fallback: ["system-ui", "arial"],
});

export const arimo = Arimo({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-arimo",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
    fallback: ["system-ui", "arial"],
});

export const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-montserrat",
    display: "swap",
    fallback: ["system-ui", "sans-serif"],
});

export const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-open-sans",
    display: "swap",
    fallback: ["system-ui", "sans-serif"],
});
