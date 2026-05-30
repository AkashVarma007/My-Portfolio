"use client";

import { useEffect, ReactNode, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { initPostHog } from "@/lib/analytics/posthog";
import { reportWebVital } from "@/lib/analytics/web-vitals";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    try {
      posthog.capture("$pageview", {
        $current_url: typeof window !== "undefined" ? window.location.origin + url : url,
      });
    } catch {
      // PostHog not loaded — silent.
    }
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  useReportWebVitals(reportWebVital);

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
