/**
 * UI Components Index
 * Central export for all UI components
 */

// Core shadcn components
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Container, containerVariants } from "./container";
export { Section, HeroSection, CTASection, SectionHeader, sectionVariants } from "./section";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { Alert, AlertTitle, AlertDescription } from "./alert";
export { Badge } from "./badge";
export { Separator } from "./separator";

// shadcn Form components
export { Input, inputVariants } from "./input";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
export { Label } from "./label";
export { Checkbox } from "./checkbox";
export { RadioGroup, RadioGroupItem } from "./radio-group";
export { Switch } from "./switch";
export { Textarea } from "./textarea";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";

// shadcn Overlay components
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
export { Popover, PopoverContent, PopoverTrigger } from "./popover";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export { Toaster } from "./sonner";

// Custom design system components
export { DynamicIcon, iconMap } from "./dynamic-icon";
export * from "./brand-icons";
export { FeatureCard, featureCardVariants } from "./feature-card";
export { ImpactCard, impactCardVariants } from "./impact-card";
export { InfoCard, infoCardVariants } from "./info-card";
export { BulletList as StyledBulletList, NumberedList, CheckList, bulletListVariants, numberedListVariants } from "./styled-list";
export { QuoteBlock, HighlightBox, StatHighlight, CalloutBox, quoteBlockVariants, highlightBoxVariants, calloutBoxVariants } from "./highlight";
export { StatItem, StatsGrid, statsGridVariants } from "./stats-grid";
export { CTAImpactSection } from "./cta-impact-section";
export { StepCard } from "./step-card";
export { QuoteBox, TorchStatement } from "./quote-box";
export { BulletList } from "./bullet-list";
export { ValueCard, valueCardVariants } from "./value-card";
export { ContentCard, ImpactItemCard, WinCard, NumberedStep } from "./content-card";

// Types
export type { InputProps } from "./input";
export type { DynamicIconProps } from "./dynamic-icon";
export type { FeatureCardProps } from "./feature-card";
export type { ImpactCardProps } from "./impact-card";
export type { InfoCardProps } from "./info-card";
export type { BulletListProps, NumberedListProps, CheckListProps } from "./styled-list";
export type { QuoteBlockProps, HighlightBoxProps, StatHighlightProps, CalloutBoxProps } from "./highlight";
export type { StatItemData, StatItemProps, StatsGridProps } from "./stats-grid";
export type { CTAImpactSectionProps } from "./cta-impact-section";
