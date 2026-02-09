/**
 * UI Components Index
 * Central export for all UI components
 */

// Core shadcn components
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Container, containerVariants } from "./container";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { Badge } from "./badge";

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
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export { Toaster } from "./sonner";

// Custom design system components
export * from "./brand-icons";
export { StepCard } from "./step-card";
export { QuoteBox, TorchStatement } from "./quote-box";
export { BulletList } from "./bullet-list";

// Types
export type { InputProps } from "./input";
