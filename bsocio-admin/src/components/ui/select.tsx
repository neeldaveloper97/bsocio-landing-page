"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Select - Simple wrapper around Radix Select
 * Uses item-aligned position by default to prevent scroll lock displacement
 */
const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "select-trigger flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#101828] transition-all placeholder:text-[#9CA3AF] hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      "max-sm:px-3 max-sm:py-2.5 max-sm:text-xs max-sm:gap-1.5",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 max-sm:h-3 max-sm:w-3" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  // Effect to prevent Radix scroll lock from causing displacement
  React.useLayoutEffect(() => {
    // Store original styles
    const originalHtmlStyle = document.documentElement.style.cssText
    const originalBodyStyle = document.body.style.cssText
    
    // Create a MutationObserver to catch and immediately revert scroll lock changes
    const observer = new MutationObserver(() => {
      // Remove any padding-right/margin-right that Radix adds for scrollbar compensation
      if (document.documentElement.style.paddingRight) {
        document.documentElement.style.paddingRight = ''
      }
      if (document.body.style.paddingRight) {
        document.body.style.paddingRight = ''
      }
      if (document.documentElement.style.marginRight) {
        document.documentElement.style.marginRight = ''
      }
      if (document.body.style.marginRight) {
        document.body.style.marginRight = ''
      }
      // Don't lock overflow for Select - keep page scrollable
      if (document.documentElement.style.overflow === 'hidden' && !document.body.classList.contains('modal-open')) {
        document.documentElement.style.overflow = ''
      }
      if (document.body.style.overflow === 'hidden' && !document.body.classList.contains('modal-open')) {
        document.body.style.overflow = ''
      }
    })

    // Observe both html and body for style and attribute changes
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['style', 'data-scroll-locked'] 
    })
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'data-scroll-locked'] 
    })

    return () => {
      observer.disconnect()
      // Restore original styles if needed (only if no modal is open)
      if (!document.body.classList.contains('modal-open')) {
        document.documentElement.style.cssText = originalHtmlStyle
        document.body.style.cssText = originalBodyStyle
      }
    }
  }, [])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-[99999] max-h-[280px] min-w-[var(--radix-select-trigger-width)] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 bg-white text-gray-700 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        sideOffset={4}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-gray-500", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-sm font-medium outline-none transition-all duration-150 focus:bg-blue-50 focus:text-blue-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-blue-50 hover:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700 mb-1",
      "max-sm:py-2 max-sm:pl-2.5 max-sm:pr-6 max-sm:text-xs max-sm:rounded-md",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center max-sm:right-1.5 max-sm:h-3 max-sm:w-3">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-blue-600 max-sm:h-3 max-sm:w-3" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
