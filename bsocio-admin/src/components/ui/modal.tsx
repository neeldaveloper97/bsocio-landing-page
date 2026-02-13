"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
                "w-full max-w-lg max-h-[90vh] overflow-y-auto",
                "rounded-2xl border border-border bg-card shadow-2xl",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                className
            )}
            {...props}
        >
            <DialogPrimitive.Close className="sticky top-3 z-10 ml-auto mr-3 -mb-8 rounded-full w-8 h-8 flex items-center justify-center bg-red-500 text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg cursor-pointer">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            {children}
        </DialogPrimitive.Content>
    </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
        {...props}
    />
);

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-xl font-bold leading-tight text-foreground sm:text-2xl", className)}
        {...props}
    />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("px-6 pb-6", className)} {...props} />
);

export {
    Modal,
    ModalPortal,
    ModalOverlay,
    ModalTrigger,
    ModalClose,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
};
