import posthog, { type PostHogConfig } from "posthog-js";

let initialized = false;

export function initPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null;
  if (initialized) return posthog;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!key) return null;

  const config: Partial<PostHogConfig> = {
    api_host: host,
    persistence: "memory",
    disable_persistence: true,
    disable_session_recording: true,
    disable_surveys: true,
    ip: false,
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    mask_all_text: false,
    mask_all_element_attributes: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  };

  posthog.init(key, config);
  initialized = true;
  return posthog;
}
