/**
 * UI Components Index
 * Central export for all UI components
 */

// Core shadcn components
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Container, containerVariants } from "./container";
export { Section, HeroSection, CTASection, sectionVariants } from "./section";

// Form components
export { Input, inputVariants } from "./input";
export { Select, selectVariants } from "./select";

// Custom design system components
export { DynamicIcon, iconMap } from "./dynamic-icon";
export { FeatureCard, featureCardVariants } from "./feature-card";
export { ImpactCard, impactCardVariants } from "./impact-card";
export { InfoCard, infoCardVariants } from "./info-card";
export { BulletList, NumberedList, CheckList, bulletListVariants, numberedListVariants } from "./styled-list";
export { QuoteBlock, HighlightBox, StatHighlight, CalloutBox, quoteBlockVariants, highlightBoxVariants, calloutBoxVariants } from "./highlight";
export { StatItem, StatsGrid, statsGridVariants } from "./stats-grid";
export { CTAImpactSection } from "./cta-impact-section";

// Types
export type { InputProps } from "./input";
export type { SelectProps, SelectOption } from "./select";
export type { DynamicIconProps } from "./dynamic-icon";
export type { FeatureCardProps } from "./feature-card";
export type { ImpactCardProps } from "./impact-card";
export type { InfoCardProps } from "./info-card";
export type { BulletListProps, NumberedListProps, CheckListProps } from "./styled-list";
export type { QuoteBlockProps, HighlightBoxProps, StatHighlightProps, CalloutBoxProps } from "./highlight";
export type { StatItemData, StatItemProps, StatsGridProps } from "./stats-grid";
export type { CTAImpactSectionProps } from "./cta-impact-section";
