import type { NextConfig } from "next";

/**
 * ============================================
 * BSOCIO ADMIN - Next.js 16.x Configuration
 * ============================================
 * Optimized for mobile LCP, TBT, and FCP
 * Updated for Next.js 16.0.7+
 * ============================================
 */

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // React Compiler for automatic memoization (reduces TBT)
  reactCompiler: true,

  // Next.js 16: cacheComponents replaces experimental.ppr
  // Enables Partial Prerendering and component caching
  cacheComponents: true,

  // Experimental features for Next.js 16
  experimental: {
    // Package tree-shaking for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-slot",
      "@radix-ui/react-select",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },

  // Image optimization for mobile
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    loader: 'default',
    unoptimized: false,
  },

  // Turbopack config for dev
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack optimizations for production
  // Webpack optimizations for production
  webpack: (config, { isServer, dev }) => {
    // Only apply if needed, but generally Next.js defaults are better
    if (!dev && !isServer) {
      // We are letting Next.js handle chunking automatically
      // as manual configuration can often conflict with new App Router behavior
      config.resolve.alias = {
        ...config.resolve.alias,
        'moment/locale': false,
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Aggressive caching for static assets
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
