/**
 * Bsocio Design System - Theme Types & Utilities
 * Centralized color variants, sizes, and style mappings
 */

// ============================================
// COLOR VARIANTS
// ============================================

export type ColorVariant = "blue" | "green" | "orange" | "teal" | "purple";

export type ColorConfig = {
  bg: string;
  bgLight: string;
  bgGradient: string;
  text: string;
  border: string;
  iconBg: string;
};

/**
 * Color variant style mappings using CSS variables
 * All styles reference design tokens from globals.css
 */
export const colorVariants: Record<ColorVariant, ColorConfig> = {
  blue: {
    bg: "bg-brand-blue",
    bgLight: "bg-blue-50",
    bgGradient: "bg-gradient-to-r from-blue-50 to-white",
    text: "text-brand-blue",
    border: "border-brand-blue",
    iconBg: "bg-brand-blue/15",
  },
  green: {
    bg: "bg-brand-green",
    bgLight: "bg-green-50",
    bgGradient: "bg-gradient-to-r from-green-50 to-white",
    text: "text-brand-green",
    border: "border-brand-green",
    iconBg: "bg-brand-green/15",
  },
  orange: {
    bg: "bg-brand-orange",
    bgLight: "bg-orange-50",
    bgGradient: "bg-gradient-to-r from-orange-50 to-white",
    text: "text-brand-orange",
    border: "border-brand-orange",
    iconBg: "bg-brand-orange/15",
  },
  teal: {
    bg: "bg-brand-teal",
    bgLight: "bg-teal-50",
    bgGradient: "bg-gradient-to-r from-teal-50 to-white",
    text: "text-brand-teal",
    border: "border-brand-teal",
    iconBg: "bg-brand-teal/15",
  },
  purple: {
    bg: "bg-purple-600",
    bgLight: "bg-purple-50",
    bgGradient: "bg-gradient-to-r from-purple-50 to-white",
    text: "text-purple-600",
    border: "border-purple-600",
    iconBg: "bg-purple-100",
  },
};

// ============================================
// SIZE VARIANTS
// ============================================

export type SizeVariant = "sm" | "md" | "lg" | "xl";

export type SizeConfig = {
  icon: string;
  iconContainer: string;
  padding: string;
  gap: string;
  text: string;
  heading: string;
};

export const sizeVariants: Record<SizeVariant, SizeConfig> = {
  sm: {
    icon: "h-5 w-5",
    iconContainer: "h-10 w-10",
    padding: "p-4",
    gap: "gap-3",
    text: "text-sm",
    heading: "text-base",
  },
  md: {
    icon: "h-6 w-6",
    iconContainer: "h-12 w-12",
    padding: "p-6",
    gap: "gap-4",
    text: "text-base",
    heading: "text-lg",
  },
  lg: {
    icon: "h-8 w-8",
    iconContainer: "h-16 w-16",
    padding: "p-8",
    gap: "gap-5",
    text: "text-lg",
    heading: "text-xl",
  },
  xl: {
    icon: "h-10 w-10",
    iconContainer: "h-20 w-20",
    padding: "p-10",
    gap: "gap-6",
    text: "text-xl",
    heading: "text-2xl",
  },
};

// ============================================
// SPACING VARIANTS
// ============================================

export type SpacingVariant = "tight" | "normal" | "relaxed" | "loose";

export const spacingVariants: Record<SpacingVariant, string> = {
  tight: "space-y-2",
  normal: "space-y-4",
  relaxed: "space-y-6",
  loose: "space-y-8",
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get color classes for a specific variant
 */
export function getColorClasses(variant: ColorVariant): ColorConfig {
  return colorVariants[variant];
}

/**
 * Get size classes for a specific variant
 */
export function getSizeClasses(size: SizeVariant): SizeConfig {
  return sizeVariants[size];
}

/**
 * Combine multiple class strings, filtering out undefined/null
 */
export function combineClasses(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================
// ICON TYPES (for dynamic icon rendering)
// ============================================

export type IconName =
  | "target"
  | "eye"
  | "heart"
  | "dollar-sign"
  | "check-circle"
  | "sun"
  | "globe"
  | "users"
  | "book"
  | "lightbulb"
  | "trending-up"
  | "shield"
  | "star"
  | "award"
  | "zap";

// ============================================
// SECTION VARIANTS
// ============================================

export type SectionVariant = "white" | "light" | "gradient" | "dark" | "cta";

export const sectionVariants: Record<SectionVariant, string> = {
  white: "bg-white",
  light: "bg-background-light",
  gradient: "bg-gradient-to-br from-blue-50 to-green-50",
  dark: "bg-footer-bg text-white",
  cta: "bg-gradient-to-br from-brand-blue via-brand-blue to-brand-teal text-white",
};

// ============================================
// CARD STYLE VARIANTS
// ============================================

export type CardStyleVariant = "default" | "elevated" | "outlined" | "colored" | "gradient";

export const cardStyleVariants: Record<CardStyleVariant, string> = {
  default: "bg-white border border-border",
  elevated: "bg-white shadow-lg border-none",
  outlined: "bg-white border-2",
  colored: "border-none",
  gradient: "border-none bg-gradient-to-br",
};
