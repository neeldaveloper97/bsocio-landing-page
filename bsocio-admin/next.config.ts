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
      "@radix-ui/react-icons",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "recharts",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "date-fns",
      "@tiptap/core",
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
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
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Aggressive code splitting for mobile
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 10000, // 10KB min for mobile
          maxSize: 100000, // 100KB max chunks for faster parsing
          cacheGroups: {
            // React core - load first
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 50,
              reuseExistingChunk: true,
            },
            // React Query - lazy loadable
            query: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              name: 'query',
              priority: 40,
              reuseExistingChunk: true,
            },
            // TipTap editor - lazy load only when needed
            editor: {
              test: /[\\/]node_modules[\\/](@tiptap|prosemirror|y-prosemirror)[\\/]/,
              name: 'editor',
              priority: 35,
              reuseExistingChunk: true,
            },
            // UI components
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority)[\\/]/,
              name: 'ui',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Charts - lazy load
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3-|victory)[\\/]/,
              name: 'charts',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Other vendors
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
        // Minimize JavaScript
        minimize: true,
      };

      // Tree shake moment/date-fns locales
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
