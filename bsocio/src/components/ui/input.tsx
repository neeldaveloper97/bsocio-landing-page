/**
 * Input Component
 * A styled input component using design system tokens
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full rounded-lg border bg-white text-text-dark transition-colors duration-200",
    "placeholder:text-text-muted/50",
    "focus:outline-none focus:ring-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-border focus:border-brand-blue focus:ring-brand-blue",
        error: "border-destructive focus:border-destructive focus:ring-destructive",
        success: "border-brand-green focus:border-brand-green focus:ring-brand-green",
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;
    const actualVariant = error ? "error" : variant;

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-medium text-text-darker"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(inputVariants({ variant: actualVariant, inputSize }), className)}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
