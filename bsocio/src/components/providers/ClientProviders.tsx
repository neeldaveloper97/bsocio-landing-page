"use client";

import { ReactNode, lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";

// Lazy load Toaster - not critical for initial render
const Toaster = lazy(() =>
  import("../ui/sonner").then((mod) => ({
    default: mod.Toaster,
  }))
);

// Lazy load DevTools - only in development
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

interface Props {
  children?: ReactNode;
}

/**
 * Combined client providers with lazy loading for non-critical dependencies
 */
export default function ClientProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <Toaster richColors position="top-right" />
        </Suspense>
        {process.env.NODE_ENV === "development" && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
