/**
 * Select Component
 * A styled select component using design system tokens
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  [
    "flex w-full rounded-lg border bg-white text-text-dark transition-colors duration-200",
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
      selectSize: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      selectSize: "default",
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant, 
    selectSize, 
    label, 
    error, 
    helperText, 
    placeholder,
    options,
    id, 
    ...props 
  }, ref) => {
    const selectId = id || props.name;
    const actualVariant = error ? "error" : variant;

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={selectId} 
            className="text-sm font-medium text-text-darker"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(selectVariants({ variant: actualVariant, selectSize }), className)}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";

export { Select, selectVariants };
