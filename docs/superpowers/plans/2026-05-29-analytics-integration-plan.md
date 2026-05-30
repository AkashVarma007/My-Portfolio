# Analytics Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate cookieless PostHog (page views, custom events, web vitals, aggregate autocapture) and Sentry (errors, performance, source-mapped traces) into the Next.js 16 portfolio without any consent banner, privacy page, or session recordings.

**Architecture:** PostHog client SDK initialized in a `Providers` client component at the root layout, manual pageview tracking via `usePathname`, typed `track()` helper for custom events, web vitals forwarded via `useReportWebVitals`. Sentry wired via `@sentry/nextjs` with three runtime configs, source-map upload at build time, tunneled through `/api/monitoring` to bypass adblock. All PII filtered at SDK boundary.

**Tech Stack:** `posthog-js`, `posthog-js/react`, `@sentry/nextjs`, `web-vitals`, Next.js 16 instrumentation hook, vitest for unit tests on pure logic.

**Spec reference:** `docs/superpowers/specs/2026-05-29-analytics-integration-design.md`

---

## File Structure

**New files:**
- `src/lib/analytics/posthog.ts` — PostHog cookieless config + init function
- `src/lib/analytics/events.ts` — typed event name constants + `track()` helper
- `src/lib/analytics/web-vitals.ts` — `web-vitals` → PostHog forwarder
- `src/lib/sentry/filters.ts` — `beforeSend` + `beforeBreadcrumb` PII strippers
- `src/app/providers.tsx` — client `<Providers>` wrapping PostHog + pageview tracker
- `src/app/api/monitoring/route.ts` — Sentry tunnel forward endpoint
- `sentry.client.config.ts` — browser Sentry init
- `sentry.server.config.ts` — Node Sentry init
- `sentry.edge.config.ts` — edge Sentry init
- `instrumentation.ts` — Next.js 16 instrumentation hook
- `tests/lib/analytics/events.test.ts` — type contract + dispatch test
- `tests/lib/sentry/filters.test.ts` — PII strip behavior

**Modified files:**
- `package.json` — add `posthog-js`, `@sentry/nextjs`, `web-vitals`
- `.env.local.example` — append PostHog + Sentry block
- `next.config.ts` — wrap export with `withSentryConfig`
- `src/app/layout.tsx` — wrap children in `<Providers>`
- `src/context/HuntContext.tsx` — emit `hunt_clue_unlocked` + `hunt_completed`
- `src/components/ArcadeCurtain.tsx` — emit `arcade_curtain_triggered`
- `src/components/games/SnakeGame.tsx` — emit start + score
- `src/components/games/BreakoutGame.tsx` — emit start + score
- `src/components/games/PongGame.tsx` — emit start + score
- `src/components/games/InvadersGame.tsx` — emit start + score
- `src/components/games/SecretGame.tsx` — emit start + score
- `src/components/Contact.tsx` — emit submit + `data-ph-no-capture` on fields
- `src/components/Projects.tsx` — emit `project_card_clicked`
- `src/app/now/[slug]/page.tsx` (or its client child) — emit `now_log_viewed`
- `src/components/now/DecryptShell.tsx` — emit `now_decrypt_pressed`

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (auto via npm)

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
npm install posthog-js @sentry/nextjs web-vitals
```

Expected: `package.json` updated. `posthog-js`, `@sentry/nextjs`, `web-vitals` appear in `dependencies`. No errors.

- [ ] **Step 2: Verify install**

Run:
```bash
npm ls posthog-js @sentry/nextjs web-vitals
```

Expected: Three entries listed with versions, no `(empty)` markers.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add posthog-js, @sentry/nextjs, web-vitals deps"
```

---

## Task 2: Add env var stubs

**Files:**
- Modify: `.env.local.example`

- [ ] **Step 1: Append PostHog + Sentry block to `.env.local.example`**

Open `.env.local.example` and append exactly:

```
# PostHog (cookieless analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (error + perf tracking)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

- [ ] **Step 2: Mirror in local `.env.local` if you have one (manual)**

If `.env.local` exists locally, add the same five new lines with empty values. This is a developer task — no commit.

- [ ] **Step 3: Commit example file**

```bash
git add .env.local.example
git commit -m "chore: document PostHog + Sentry env vars in .env.local.example"
```

---

## Task 3: Create typed events module (TDD)

**Files:**
- Create: `src/lib/analytics/events.ts`
- Create: `tests/lib/analytics/events.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/analytics/events.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Events, track } from "@/lib/analytics/events";

const captureMock = vi.fn();

vi.mock("posthog-js", () => ({
  default: { capture: (...args: unknown[]) => captureMock(...args) },
}));

describe("Events catalog", () => {
  it("exposes stable event name constants", () => {
    expect(Events.ArcadeGameStarted).toBe("arcade_game_started");
    expect(Events.HuntClueUnlocked).toBe("hunt_clue_unlocked");
    expect(Events.WebVital).toBe("web_vital");
  });
});

describe("track()", () => {
  beforeEach(() => captureMock.mockReset());

  it("forwards event + props to posthog.capture", () => {
    track(Events.ArcadeGameStarted, { game: "snake" });
    expect(captureMock).toHaveBeenCalledWith("arcade_game_started", { game: "snake" });
  });

  it("is a no-op when posthog is not loaded (no throw)", () => {
    captureMock.mockImplementationOnce(() => {
      throw new Error("not loaded");
    });
    expect(() => track(Events.HuntCompleted, { total_clues: 15, duration_ms: 1 })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run:
```bash
npx vitest run tests/lib/analytics/events.test.ts
```

Expected: FAIL — cannot resolve `@/lib/analytics/events`.

- [ ] **Step 3: Implement `events.ts`**

Create `src/lib/analytics/events.ts`:

```ts
import posthog from "posthog-js";

export const Events = {
  ArcadeCurtainTriggered: "arcade_curtain_triggered",
  ArcadeGameStarted: "arcade_game_started",
  ArcadeGameScore: "arcade_game_score",
  HuntClueUnlocked: "hunt_clue_unlocked",
  HuntCompleted: "hunt_completed",
  ContactFormSubmitted: "contact_form_submitted",
  ProjectCardClicked: "project_card_clicked",
  NowLogViewed: "now_log_viewed",
  NowDecryptPressed: "now_decrypt_pressed",
  WebVital: "web_vital",
} as const;

export type GameKey = "snake" | "breakout" | "pong" | "invaders" | "secret";

export type EventPayloads = {
  arcade_curtain_triggered: { device: "desktop" | "mobile" };
  arcade_game_started: { game: GameKey };
  arcade_game_score: { game: GameKey; score: number };
  hunt_clue_unlocked: { clue_id: number; tier: number };
  hunt_completed: { total_clues: number; duration_ms: number };
  contact_form_submitted: { success: boolean };
  project_card_clicked: { project_id: string };
  now_log_viewed: { slug: string; priority: "classified" | "normal" };
  now_decrypt_pressed: { slug: string };
  web_vital: { name: "LCP" | "CLS" | "INP" | "FCP" | "TTFB"; value: number; rating: string };
};

type EventName = keyof EventPayloads;

export function track<E extends EventName>(event: E, props: EventPayloads[E]): void {
  try {
    posthog.capture(event, props as Record<string, unknown>);
  } catch {
    // PostHog not loaded yet, or blocked by adblock. Silent no-op.
  }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run:
```bash
npx vitest run tests/lib/analytics/events.test.ts
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics/events.ts tests/lib/analytics/events.test.ts
git commit -m "feat(analytics): typed event catalog + track() helper"
```

---

## Task 4: Create PostHog init module

**Files:**
- Create: `src/lib/analytics/posthog.ts`

No unit test — this module's behavior is verified at runtime in the browser. The `loaded` callback and config object are configuration data, not logic.

- [ ] **Step 1: Implement `posthog.ts`**

Create `src/lib/analytics/posthog.ts`:

```ts
import posthog, { type PostHog, type PostHogConfig } from "posthog-js";

let initialized = false;

export function initPostHog(): PostHog | null {
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
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors related to `src/lib/analytics/posthog.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics/posthog.ts
git commit -m "feat(analytics): cookieless PostHog init module"
```

---

## Task 5: Create web vitals reporter

**Files:**
- Create: `src/lib/analytics/web-vitals.ts`

- [ ] **Step 1: Implement `web-vitals.ts`**

Create `src/lib/analytics/web-vitals.ts`:

```ts
import type { Metric } from "web-vitals";
import { Events, track } from "@/lib/analytics/events";

const ALLOWED: ReadonlyArray<Metric["name"]> = ["LCP", "CLS", "INP", "FCP", "TTFB"];

export function reportWebVital(metric: Metric): void {
  if (!ALLOWED.includes(metric.name)) return;
  track(Events.WebVital, {
    name: metric.name as "LCP" | "CLS" | "INP" | "FCP" | "TTFB",
    value: Math.round(metric.value * 1000) / 1000,
    rating: metric.rating,
  });
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics/web-vitals.ts
git commit -m "feat(analytics): web vitals reporter to PostHog"
```

---

## Task 6: Create Sentry PII filters (TDD)

**Files:**
- Create: `src/lib/sentry/filters.ts`
- Create: `tests/lib/sentry/filters.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/sentry/filters.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { stripPII, stripBreadcrumbPII, isNoiseEvent } from "@/lib/sentry/filters";
import type { ErrorEvent, Breadcrumb } from "@sentry/nextjs";

describe("stripPII", () => {
  it("removes cookies, headers, query strings from request", () => {
    const event: ErrorEvent = {
      type: undefined,
      request: {
        url: "https://example.com/path?token=abc&id=42",
        cookies: { session: "secret" } as unknown as string,
        headers: { authorization: "Bearer x" },
        query_string: "token=abc",
      },
    };
    const result = stripPII(event);
    expect(result?.request?.cookies).toBeUndefined();
    expect(result?.request?.headers).toBeUndefined();
    expect(result?.request?.query_string).toBeUndefined();
    expect(result?.request?.url).toBe("https://example.com/path?[stripped]");
  });

  it("removes the user object entirely", () => {
    const event: ErrorEvent = {
      type: undefined,
      user: { id: "1", email: "a@b.com" },
    };
    const result = stripPII(event);
    expect(result?.user).toBeUndefined();
  });

  it("returns null for noise events", () => {
    const event: ErrorEvent = {
      type: undefined,
      exception: { values: [{ value: "ResizeObserver loop completed with undelivered notifications." }] },
    };
    expect(stripPII(event)).toBeNull();
  });
});

describe("stripBreadcrumbPII", () => {
  it("strips query strings from breadcrumb url data", () => {
    const crumb: Breadcrumb = { data: { url: "https://x/y?token=z" } };
    const result = stripBreadcrumbPII(crumb);
    expect(result?.data?.url).toBe("https://x/y?[stripped]");
  });

  it("passes through breadcrumbs without url data unchanged", () => {
    const crumb: Breadcrumb = { message: "clicked button" };
    expect(stripBreadcrumbPII(crumb)).toEqual(crumb);
  });
});

describe("isNoiseEvent", () => {
  it("flags ResizeObserver loop noise", () => {
    expect(isNoiseEvent("ResizeObserver loop limit exceeded")).toBe(true);
  });

  it("flags Non-Error promise rejection noise", () => {
    expect(isNoiseEvent("Non-Error promise rejection captured with value: undefined")).toBe(true);
  });

  it("does not flag real errors", () => {
    expect(isNoiseEvent("TypeError: cannot read property foo of undefined")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run:
```bash
npx vitest run tests/lib/sentry/filters.test.ts
```

Expected: FAIL — cannot resolve `@/lib/sentry/filters`.

- [ ] **Step 3: Implement `filters.ts`**

Create `src/lib/sentry/filters.ts`:

```ts
import type { ErrorEvent, Breadcrumb } from "@sentry/nextjs";

const NOISE_PATTERNS: ReadonlyArray<RegExp> = [
  /ResizeObserver loop/i,
  /Non-Error promise rejection captured/i,
  /Script error\.?$/i,
];

export function isNoiseEvent(message: string | undefined): boolean {
  if (!message) return false;
  return NOISE_PATTERNS.some((re) => re.test(message));
}

function stripUrlQuery(url: string | undefined): string | undefined {
  if (!url) return url;
  const q = url.indexOf("?");
  return q === -1 ? url : `${url.slice(0, q)}?[stripped]`;
}

export function stripPII(event: ErrorEvent): ErrorEvent | null {
  const firstExceptionValue = event.exception?.values?.[0]?.value;
  if (isNoiseEvent(firstExceptionValue)) return null;

  if (event.request) {
    const { cookies: _c, headers: _h, query_string: _q, ...rest } = event.request;
    event.request = { ...rest, url: stripUrlQuery(rest.url) };
  }
  if (event.user) {
    delete event.user;
  }
  return event;
}

export function stripBreadcrumbPII(crumb: Breadcrumb): Breadcrumb | null {
  if (crumb.data && typeof crumb.data.url === "string") {
    return { ...crumb, data: { ...crumb.data, url: stripUrlQuery(crumb.data.url) } };
  }
  return crumb;
}
```

- [ ] **Step 4: Run test, verify it passes**

Run:
```bash
npx vitest run tests/lib/sentry/filters.test.ts
```

Expected: PASS — all tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sentry/filters.ts tests/lib/sentry/filters.test.ts
git commit -m "feat(sentry): PII filters for events + breadcrumbs"
```

---

## Task 7: Create Sentry client config

**Files:**
- Create: `sentry.client.config.ts` (repo root)

- [ ] **Step 1: Implement `sentry.client.config.ts`**

Create `sentry.client.config.ts` at repo root:

```ts
import * as Sentry from "@sentry/nextjs";
import { stripPII, stripBreadcrumbPII } from "@/lib/sentry/filters";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    beforeSend: (event) => stripPII(event),
    beforeBreadcrumb: (crumb) => stripBreadcrumbPII(crumb),
  });
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add sentry.client.config.ts
git commit -m "feat(sentry): client config with PII filters + sampling"
```

---

## Task 8: Create Sentry server + edge configs

**Files:**
- Create: `sentry.server.config.ts`
- Create: `sentry.edge.config.ts`

- [ ] **Step 1: Implement `sentry.server.config.ts`**

Create `sentry.server.config.ts` at repo root:

```ts
import * as Sentry from "@sentry/nextjs";
import { stripPII } from "@/lib/sentry/filters";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    beforeSend: (event) => stripPII(event),
  });
}
```

- [ ] **Step 2: Implement `sentry.edge.config.ts`**

Create `sentry.edge.config.ts` at repo root:

```ts
import * as Sentry from "@sentry/nextjs";
import { stripPII } from "@/lib/sentry/filters";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    beforeSend: (event) => stripPII(event),
  });
}
```

- [ ] **Step 3: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add sentry.server.config.ts sentry.edge.config.ts
git commit -m "feat(sentry): server + edge runtime configs"
```

---

## Task 9: Create instrumentation hook

**Files:**
- Create: `instrumentation.ts` (repo root)

- [ ] **Step 1: Implement `instrumentation.ts`**

Create `instrumentation.ts` at repo root:

```ts
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add instrumentation.ts
git commit -m "feat(sentry): Next.js 16 instrumentation hook"
```

---

## Task 10: Create Sentry tunnel route

**Files:**
- Create: `src/app/api/monitoring/route.ts`

- [ ] **Step 1: Implement tunnel route**

Create `src/app/api/monitoring/route.ts`:

```ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function getDsnParts(dsn: string): { host: string; projectId: string; pathname: string } | null {
  try {
    const u = new URL(dsn);
    const projectId = u.pathname.replace(/^\//, "");
    if (!projectId) return null;
    return { host: u.host, projectId, pathname: u.pathname };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return new Response("no dsn", { status: 503 });

  const parts = getDsnParts(dsn);
  if (!parts) return new Response("bad dsn", { status: 500 });

  const envelope = await req.text();
  const firstLineEnd = envelope.indexOf("\n");
  if (firstLineEnd === -1) return new Response("bad envelope", { status: 400 });

  let header: { dsn?: string };
  try {
    header = JSON.parse(envelope.slice(0, firstLineEnd));
  } catch {
    return new Response("bad envelope header", { status: 400 });
  }

  const envelopeDsn = header.dsn;
  if (envelopeDsn && envelopeDsn !== dsn) {
    return new Response("dsn mismatch", { status: 400 });
  }

  const upstream = `https://${parts.host}/api/${parts.projectId}/envelope/`;
  const res = await fetch(upstream, {
    method: "POST",
    body: envelope,
    headers: { "Content-Type": "application/x-sentry-envelope" },
  });
  return new Response(null, { status: res.status });
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/monitoring/route.ts
git commit -m "feat(sentry): tunnel route to bypass adblock"
```

---

## Task 11: Wrap `next.config.ts` with `withSentryConfig`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts` contents**

Replace the entire file with:

```ts
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
  hideSourceMaps: true,
  disableLogger: true,
  widenClientFileUpload: true,
});
```

- [ ] **Step 2: Verify build does not fail when Sentry env vars are unset**

Run:
```bash
SENTRY_AUTH_TOKEN= SENTRY_ORG= SENTRY_PROJECT= NEXT_PUBLIC_SENTRY_DSN= npm run build
```

Expected: Build completes. May print Sentry warnings about missing auth token (source map upload skipped). No fatal errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(sentry): wrap next.config.ts with withSentryConfig + tunnel route"
```

---

## Task 12: Create `app/providers.tsx`

**Files:**
- Create: `src/app/providers.tsx`

- [ ] **Step 1: Implement `Providers`**

Create `src/app/providers.tsx`:

```tsx
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
```

Note: `useSearchParams()` must be inside a `<Suspense>` boundary per Next.js App Router rules.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/providers.tsx
git commit -m "feat(analytics): Providers with PostHog + pageview tracker + web vitals"
```

---

## Task 13: Wrap root layout with `<Providers>`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current `layout.tsx`**

Open `src/app/layout.tsx`. Identify the `<body>` element and the children render location.

- [ ] **Step 2: Add import**

At the top of the imports block, add:

```ts
import { Providers } from "@/app/providers";
```

- [ ] **Step 3: Wrap `{children}` with `<Providers>`**

Inside the JSX returned by the default export, replace whatever currently wraps `{children}` so it becomes:

```tsx
<Providers>{children}</Providers>
```

If `{children}` is currently nested inside other providers (e.g. `<HuntProvider>`, `<SmoothScroll>`, `<AnimationProvider>`), keep `<Providers>` as the OUTERMOST wrapper so PostHog/Sentry capture errors and pageviews from all descendants.

- [ ] **Step 4: Verify dev server boots without runtime error**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Expected: page renders. Open DevTools console. Expected: no red errors. If `NEXT_PUBLIC_POSTHOG_KEY` is set, expected: PostHog `[debug]` logs visible.

Stop the dev server (`Ctrl+C`).

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(analytics): wrap root layout with Providers"
```

---

## Task 14: Wire HuntContext events

**Files:**
- Modify: `src/context/HuntContext.tsx`

- [ ] **Step 1: Add import**

Near the top imports of `src/context/HuntContext.tsx`, add:

```ts
import { Events, track } from "@/lib/analytics/events";
import { CLUES } from "@/data/clues"; // if not already imported
```

(`CLUES` is already imported per existing file — only add the analytics import.)

- [ ] **Step 2: Locate `unlockClue` implementation**

Find the `unlockClue` callback inside the provider. It currently mutates state to add the clue id.

- [ ] **Step 3: Emit event when a new clue is unlocked**

Inside `unlockClue`, AFTER the state update commits a new clue (i.e., when the function would return `true` indicating a successful new unlock), add:

```ts
const clue = CLUES.find((c) => c.id === id);
const tier = clue?.tier ?? 0;
track(Events.HuntClueUnlocked, { clue_id: id, tier });
```

Place this immediately before the `return true` that signals a successful unlock. Do not emit when the clue was already found (i.e., the early-return path).

- [ ] **Step 4: Emit `hunt_completed` when all clues found**

Locate the existing logic that detects hunt completion (likely a `useEffect` watching `cluesFound.length` or `totalFound`). Add a `useRef`-backed flag so the event fires once per session:

```ts
const huntCompletedFiredRef = useRef(false);
const huntStartTsRef = useRef<number>(Date.now());

useEffect(() => {
  if (huntCompletedFiredRef.current) return;
  if (cluesFound.length >= TOTAL_CLUES) {
    huntCompletedFiredRef.current = true;
    track(Events.HuntCompleted, {
      total_clues: TOTAL_CLUES,
      duration_ms: Date.now() - huntStartTsRef.current,
    });
  }
}, [cluesFound.length]);
```

Add `useRef` to the React import line at the top of the file.

Note: `duration_ms` measures time-from-mount, not absolute hunt duration, because we deliberately do not persist a hunt-start timestamp (would require localStorage write outside the existing `akash_hunt` key, and we already track persisted clue progress separately).

- [ ] **Step 5: Type-check + dev smoke test**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

Then:
```bash
npm run dev
```

Open browser → trigger a clue unlock (e.g. via dev tools call to `unlockClue(1)` on the context, or actual UI). In PostHog Live Events, expected: `hunt_clue_unlocked` event with `clue_id` and `tier`. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/context/HuntContext.tsx
git commit -m "feat(analytics): wire hunt_clue_unlocked + hunt_completed events"
```

---

## Task 15: Wire ArcadeCurtain event

**Files:**
- Modify: `src/components/ArcadeCurtain.tsx`

- [ ] **Step 1: Add import**

At the top imports:

```ts
import { Events, track } from "@/lib/analytics/events";
```

- [ ] **Step 2: Emit event at curtain trigger**

Locate the function that fires once the sustained-scroll threshold is crossed and the curtain transition is committed (the point of no return, before route push). Insert:

```ts
const isTouchInput = typeof window !== "undefined" && "ontouchstart" in window;
track(Events.ArcadeCurtainTriggered, { device: isTouchInput ? "mobile" : "desktop" });
```

Place it BEFORE the route push so the event flushes even if the navigation interrupts the page lifecycle.

- [ ] **Step 3: Dev smoke test**

Run `npm run dev`. Scroll past footer with sustained momentum on desktop. Expected: `arcade_curtain_triggered` event in PostHog Live Events with `device: "desktop"`. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArcadeCurtain.tsx
git commit -m "feat(analytics): wire arcade_curtain_triggered event"
```

---

## Task 16: Wire arcade game start + score events

**Files:**
- Modify: `src/components/games/SnakeGame.tsx`
- Modify: `src/components/games/BreakoutGame.tsx`
- Modify: `src/components/games/PongGame.tsx`
- Modify: `src/components/games/InvadersGame.tsx`
- Modify: `src/components/games/SecretGame.tsx`

For each of the five game components, repeat steps 1–3 below with the corresponding game key.

| File | Game key |
|---|---|
| `SnakeGame.tsx` | `"snake"` |
| `BreakoutGame.tsx` | `"breakout"` |
| `PongGame.tsx` | `"pong"` |
| `InvadersGame.tsx` | `"invaders"` |
| `SecretGame.tsx` | `"secret"` |

- [ ] **Step 1: Add import (each file)**

```ts
import { Events, track } from "@/lib/analytics/events";
```

- [ ] **Step 2: Emit `arcade_game_started`**

Locate the game-start function (likely a `startGame` / `reset` handler that transitions from idle/menu to playing state). Insert at the top of that function body:

```ts
track(Events.ArcadeGameStarted, { game: "snake" }); // use the row's game key
```

If the component auto-starts on mount (no explicit start function), place the call inside the same `useEffect` that initializes the canvas/Phaser scene, gated to fire exactly once on mount.

- [ ] **Step 3: Emit `arcade_game_score`**

Locate the game-over handler (where the final score is computed and presented or persisted to `HuntContext.updateGameScore`). Insert immediately after the score is finalized:

```ts
track(Events.ArcadeGameScore, { game: "snake", score: finalScore }); // use the row's game key + actual variable name
```

If `updateGameScore` is already called there, place the `track` call right next to it for consistency.

- [ ] **Step 4: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Dev smoke test for one game**

Run `npm run dev`. Open `/arcade`. Start Snake. Lose deliberately. In PostHog Live Events, expected: `arcade_game_started { game: "snake" }` then `arcade_game_score { game: "snake", score: <n> }`. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/games/SnakeGame.tsx src/components/games/BreakoutGame.tsx src/components/games/PongGame.tsx src/components/games/InvadersGame.tsx src/components/games/SecretGame.tsx
git commit -m "feat(analytics): wire arcade game start + score events across all 5 games"
```

---

## Task 17: Wire Contact form event + mask fields

**Files:**
- Modify: `src/components/Contact.tsx`

- [ ] **Step 1: Add import**

```ts
import { Events, track } from "@/lib/analytics/events";
```

- [ ] **Step 2: Add `data-ph-no-capture` to every form field**

Locate every `<input>`, `<textarea>`, and `<select>` inside the contact form. On each, add the attribute:

```tsx
data-ph-no-capture
```

This prevents PostHog autocapture from reading values from these inputs even if they ever produce events that include text.

Do NOT add this attribute to the submit button — we want to capture clicks on it.

- [ ] **Step 3: Emit submission event**

Locate the form `onSubmit` handler that calls Web3Forms. After the fetch resolves (or rejects), call:

```ts
track(Events.ContactFormSubmitted, { success: responseOk });
```

Where `responseOk` is `true` if Web3Forms accepted the submission, `false` otherwise. Emit BOTH paths.

- [ ] **Step 4: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Dev smoke test**

Run `npm run dev`. Open the contact section. Submit a test message with valid values. In PostHog Live Events:
- Expected: `contact_form_submitted { success: true }` event present.
- Expected: NO event property containing the name/email/message values you entered.
- Expected: If autocapture fires `$autocapture` for the click, the `$elements` array should NOT include the input values (because of `data-ph-no-capture`).

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat(analytics): wire contact_form_submitted + mask form fields"
```

---

## Task 18: Wire project card click events

**Files:**
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Add import**

```ts
import { Events, track } from "@/lib/analytics/events";
```

- [ ] **Step 2: Identify project list and click target**

Locate the rendering of project cards (likely a `.map` over a `PROJECTS` array). Each card has a click target (the card itself or a link inside it).

- [ ] **Step 3: Emit event on click**

Attach an `onClick` handler to the clickable element (or extend the existing one). Inside:

```ts
track(Events.ProjectCardClicked, { project_id: project.id ?? project.slug ?? project.title });
```

Use whichever stable identifier exists on the project object. If multiple are present, prefer `id`. If none exists, use the title (slugify to lowercase, replace spaces with `-`).

If the click is on an `<a>` that navigates externally (`target="_blank"`), this still works — `track` is synchronous to the PostHog queue, and the page does not unmount.

- [ ] **Step 4: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Dev smoke test**

Run `npm run dev`. Click a project card. Expected in PostHog Live Events: `project_card_clicked { project_id: "..." }`. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat(analytics): wire project_card_clicked event"
```

---

## Task 19: Wire `/now` log view event

**Files:**
- Modify: `src/app/now/[slug]/page.tsx` (or its client child component if the page is server)

- [ ] **Step 1: Identify the client component for `/now/[slug]`**

`/now` routes are `force-static` (per CLAUDE.md). The slug page itself may be server-rendered. Find a client component rendered inside (likely `NowDetail` / `NowSlugClient` / similar) that has access to the post's `slug` and `priority`.

If no client component currently exists, create a thin one:

`src/app/now/[slug]/_PageviewLogger.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { Events, track } from "@/lib/analytics/events";

export function NowLogViewLogger({ slug, priority }: { slug: string; priority: "classified" | "normal" }) {
  useEffect(() => {
    track(Events.NowLogViewed, { slug, priority });
  }, [slug, priority]);
  return null;
}
```

Then render `<NowLogViewLogger slug={post.slug.current} priority={post.priority === "classified" ? "classified" : "normal"} />` somewhere in the server page's JSX.

- [ ] **Step 2: If a client component already exists, add the import + effect there**

```ts
import { useEffect } from "react";
import { Events, track } from "@/lib/analytics/events";
```

Inside the client component, add:

```ts
useEffect(() => {
  track(Events.NowLogViewed, {
    slug,
    priority: priority === "classified" ? "classified" : "normal",
  });
}, [slug, priority]);
```

- [ ] **Step 3: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Dev smoke test**

Run `npm run dev`. Navigate to `/now/<any-existing-slug>`. Expected in PostHog Live Events: `now_log_viewed { slug: "...", priority: "..." }`. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/app/now/
git commit -m "feat(analytics): wire now_log_viewed event"
```

---

## Task 20: Wire `/now` decrypt event

**Files:**
- Modify: `src/components/now/DecryptShell.tsx`

- [ ] **Step 1: Add import**

```ts
import { Events, track } from "@/lib/analytics/events";
```

- [ ] **Step 2: Emit event on DECRYPT press**

Locate the `onClick` handler attached to the DECRYPT button. The component receives the post's slug as a prop (or derives it from URL). Inside the handler, BEFORE the state flip and localStorage write:

```ts
track(Events.NowDecryptPressed, { slug });
```

If the slug is not currently passed as a prop, add it to the component's prop interface and pass it from the call site in `src/app/now/[slug]/page.tsx`.

- [ ] **Step 3: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Dev smoke test**

Run `npm run dev`. Visit a `classified`-priority `/now` log. Click DECRYPT. Expected in PostHog Live Events: `now_decrypt_pressed { slug: "..." }`. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/now/DecryptShell.tsx
git commit -m "feat(analytics): wire now_decrypt_pressed event"
```

---

## Task 21: End-to-end verification

**Files:** none modified.

- [ ] **Step 1: Run full test suite**

Run:
```bash
npx vitest run
```

Expected: All tests in `tests/lib/analytics/events.test.ts` and `tests/lib/sentry/filters.test.ts` pass.

- [ ] **Step 2: Run lint**

Run:
```bash
npm run lint
```

Expected: No errors. Warnings acceptable if not new.

- [ ] **Step 3: Production build with real env**

Set real values in `.env.local` for `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

Run:
```bash
npm run build
```

Expected: Build completes. Sentry CLI logs source map upload success. No fatal errors.

- [ ] **Step 4: Start production server + manual checks**

Run:
```bash
npm run start
```

Open `http://localhost:3000` in a fresh incognito window. Open DevTools.

Run each of these checks; each must pass:

1. **Network tab:** POST to `us.i.posthog.com` fires on page load. Status 200/204.
2. **Network tab:** Navigate to `/arcade` — second `$pageview` POST fires.
3. **Application → Cookies:** zero cookies under your origin from PostHog (`ph_*` keys absent).
4. **Application → Local Storage:** zero `posthog` or `ph_` keys.
5. **Console:** `posthog.has_opted_out_capturing()` returns `false` (you opted in cookielessly by default).
6. **Console:** `document.cookie` shows no PostHog cookies.
7. **Network tab:** POST to `/api/monitoring` fires on first navigation (Sentry session start envelope). Status 200.
8. **Trigger a test error:** in DevTools console run `throw new Error("verify-sentry-" + Date.now())`. Within 60s, error appears in Sentry UI with source-mapped stack.
9. **PostHog Live Events view:** `$pageview` events visible with `path` properties. `web_vital` events appear within ~15s (LCP/CLS/INP).
10. **Submit contact form** with test data. `contact_form_submitted` event appears. Field values absent from event properties.
11. **Lighthouse audit (Performance, mobile):** open Lighthouse panel, run on home route. Compare LCP/CLS/INP to a pre-deploy baseline. Expected delta: < 50ms LCP regression, no CLS regression, no INP regression. If regression > 100ms, consider lazy-loading PostHog with `defer` strategy (out of scope for this plan — document as follow-up).

- [ ] **Step 5: Final commit (verification notes)**

If any verification step revealed a needed config tweak, fix it. Otherwise, no commit needed for this task — the work is done.

```bash
# Only if any fix was applied during verification:
git add -A
git commit -m "fix(analytics): verification adjustments"
```

---

## Done

After Task 21 passes all checks: PostHog and Sentry are live in production, cookieless, fully PII-stripped, no banner, no privacy page. Event catalog covers every interaction listed in §9 of the spec. Source maps uploaded. Tunnel route bypasses adblock.
