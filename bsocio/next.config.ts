import type { NextConfig } from "next";

// Bundle analyzer (enabled with ANALYZE=true)
const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });

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
  {
    key: "Permissions-Policy",
    value: "geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true,
  
  // Output optimization
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Experimental optimizations for tree-shaking large packages
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "sonner",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
    ],
    // Optimize CSS
    optimizeCss: true,
  },
  
  // Turbopack configuration for Next.js 16 (replaces webpack)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bsocio-bucket.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
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
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
