import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reduces webpack memory usage in dev (slight compile-time tradeoff)
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
