/**
 * Dynamic Icon Component
 * Renders Lucide icons based on icon name string
 */

import * as React from "react";
import {
  Target,
  Eye,
  Heart,
  DollarSign,
  CheckCircle,
  Sun,
  Globe,
  Users,
  Book,
  Lightbulb,
  TrendingUp,
  Shield,
  Star,
  Award,
  Zap,
  LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/theme";
import { cn } from "@/lib/utils";

const iconMap: Record<IconName, LucideIcon> = {
  target: Target,
  eye: Eye,
  heart: Heart,
  "dollar-sign": DollarSign,
  "check-circle": CheckCircle,
  sun: Sun,
  globe: Globe,
  users: Users,
  book: Book,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  shield: Shield,
  star: Star,
  award: Award,
  zap: Zap,
};

export interface DynamicIconProps {
  name: IconName;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

export function DynamicIcon({ name, className, size = "md" }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent className={cn(sizeClasses[size], className)} />;
}

export { iconMap };
