import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  tunnelRoute: "/api/monitoring",
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map", ".next/server/**/*.map"],
  },
  disableLogger: true,
  widenClientFileUpload: true,
});
