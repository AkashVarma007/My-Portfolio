import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reduces webpack memory usage in dev (slight compile-time tradeoff)
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
