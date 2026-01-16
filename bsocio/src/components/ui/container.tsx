import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  "mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      variant: {
        default: "max-w-[1200px]",
        narrow: "max-w-[800px]",
        wide: "max-w-[1536px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: React.ReactNode;
}

export function Container({
  variant,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { containerVariants };
