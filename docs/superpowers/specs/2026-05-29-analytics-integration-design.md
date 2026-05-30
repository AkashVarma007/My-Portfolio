# Analytics Integration — Design Spec

**Date:** 2026-05-29
**Status:** Draft — awaiting user review
**Author:** Akash + Claude (brainstorm session)

---

## 1. Concept

Add anonymous, cookieless web + product analytics and error tracking to the existing Next.js 16 portfolio. Two services: PostHog (page views, custom events, web vitals, aggregate heatmaps via autocapture) and Sentry (JS errors, performance traces, source-mapped stack traces). No consent banner, no privacy page, no session recordings, no persistent user identification. Designed to push tracking depth as far as is legally defensible under GDPR, UK GDPR, ePrivacy, and India's DPDP Act 2023 without requiring a notice surface.

## 2. Goals

- Page view tracking on all routes including App Router client transitions.
- Custom product events for arcade games, scavenger hunt, contact form, `/now` log views.
- Core Web Vitals (LCP, CLS, INP, FCP, TTFB) captured per page load.
- Full client + server + edge error tracking with source maps.
- Aggregate click/form interaction data via PostHog autocapture.
- Zero cookies, zero localStorage analytics keys, zero stored IPs.
- $0 hosting cost — both PostHog and Sentry free tiers.

## 3. Non-Goals

- Session replay / session recordings — captures interaction patterns, treated as personal data; legally requires notice.
- Persistent user identification (`posthog.identify()`) — would create personal data.
- Cross-session funnels — single-session only.
- Feature flags / A-B testing — out of scope, can be added later.
- Cookie consent banner — explicitly omitted by user direction.
- Privacy policy page — explicitly omitted by user direction.
- Server-side event ingestion via API routes — all events fire client-side.
- Analytics dashboards inside the portfolio app — viewed in PostHog/Sentry UIs.

## 4. Legal Posture

Anonymous-by-construction. No personal data is collected, so consent and notice obligations under GDPR Art. 6, ePrivacy Directive Art. 5(3), and DPDP §6 do not attach.

| Data class | Status |
|---|---|
| IP address | Discarded at PostHog ingestion (`ip: false`); Sentry `sendDefaultPii: false` strips IP. |
| Cookies | None set. |
| localStorage / sessionStorage analytics keys | None — PostHog `persistence: 'memory'`. |
| Persistent device ID | None — no `identify()` call. |
| Email / name / contact data | Stripped from event payloads in `beforeSend` filters. |
| URL query strings | Stripped from Sentry breadcrumbs (may contain tokens). |
| Aggregate geo (country) | Allowed — derived from IP at edge and dropped. |
| Browser / OS class | Allowed — not identifying alone. |
| Page path | Allowed. |
| Click targets (autocapture) | Allowed — element selectors only, no PII. |
| Form submit events | Allowed — event fires, field values NOT captured (form inputs tagged `data-ph-no-capture`; see §10). |

## 5. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Product analytics | `posthog-js` ^1.x + `posthog-js/react` | Cookieless config. Manual pageview via `usePathname` since App Router breaks autopageview. |
| Error + perf | `@sentry/nextjs` ^8.x | Native Next 16 support. Three configs (client/server/edge). Source map upload via `withSentryConfig`. |
| Web vitals | `web-vitals` ^4.x | Reported to PostHog as `web_vital` events. |
| Tunnel | Next API route `/api/monitoring` | Sentry tunnel — bypasses adblock, hides ingest hostname. |
| Hosting | Vercel (existing) | $0. PostHog free = 1M events/mo. Sentry free = 5k errors + 10k traces/mo. |

## 6. Architecture

```
Browser
  │
  ├─ <Providers> (app/providers.tsx, client)
  │    ├─ PostHogProvider (posthog-js/react)
  │    │    └─ usePathname watcher → posthog.capture('$pageview')
  │    └─ useReportWebVitals → posthog.capture('web_vital', {...})
  │
  ├─ Sentry browser SDK (sentry.client.config.ts)
  │    └─ window.onerror, unhandledrejection, performance traces
  │         → POST /api/monitoring (tunnel)
  │              → Sentry ingest
  │
  └─ posthog-js autocapture + manual track() calls
         → us.i.posthog.com (direct)

Next.js server
  │
  ├─ instrumentation.ts → register Sentry server + edge
  ├─ sentry.server.config.ts → Node runtime error capture
  └─ sentry.edge.config.ts → Edge runtime error capture

Build time
  └─ next.config.ts → withSentryConfig → upload source maps to Sentry
```

## 7. Components

### 7.1 `src/app/providers.tsx` (new, client component)

Wraps app children. Initializes PostHog once on mount. Tracks pageviews on `usePathname` change. Hooks `useReportWebVitals` and forwards vitals to PostHog.

Responsibilities:
- Call `posthog.init()` with cookieless config (exactly once).
- Watch `usePathname()` + `useSearchParams()` and emit `$pageview` with `path` and `referrer`.
- Wrap children in `PostHogProvider` so descendants can `usePostHog()`.
- Register `useReportWebVitals` callback that emits `web_vital` events.

### 7.2 `src/lib/analytics/posthog.ts` (new)

Exports a single `initPostHog()` function and the typed event helper. Centralizes the cookieless config object so it is not duplicated.

Config object:
```ts
{
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  persistence: 'memory',
  disable_persistence: true,
  disable_session_recording: true,
  disable_surveys: true,
  ip: false,
  autocapture: true,
  capture_pageview: false,
  capture_pageleave: true,
  mask_all_text: false,
  mask_all_element_attributes: false,
  loaded: (ph) => { if (process.env.NODE_ENV === 'development') ph.debug(); },
}
```

Note: `mask_all_text` is `false` because autocapture text values are needed for click target identification (button labels), but PII-bearing inputs are excluded via the `data-ph-no-capture` attribute on form fields (see §10).

### 7.3 `src/lib/analytics/events.ts` (new)

Typed event constants and `track(event, props)` helper. Single source of truth for event names. Each event name is a const string, each event has a typed payload interface.

```ts
export const Events = {
  ArcadeCurtainTriggered: 'arcade_curtain_triggered',
  ArcadeGameStarted: 'arcade_game_started',
  ArcadeGameScore: 'arcade_game_score',
  HuntClueUnlocked: 'hunt_clue_unlocked',
  HuntCompleted: 'hunt_completed',
  ContactFormSubmitted: 'contact_form_submitted',
  ProjectCardClicked: 'project_card_clicked',
  NowLogViewed: 'now_log_viewed',
  NowDecryptPressed: 'now_decrypt_pressed',
  WebVital: 'web_vital',
} as const;

type EventPayloads = {
  arcade_game_started: { game: 'snake' | 'breakout' | 'pong' | 'invaders' | 'secret' };
  arcade_game_score:   { game: string; score: number };
  hunt_clue_unlocked:  { clue_id: string; tier: number };
  hunt_completed:      { total_clues: number; duration_ms: number };
  contact_form_submitted: { success: boolean };
  project_card_clicked: { project_id: string };
  now_log_viewed:      { slug: string; priority: 'classified' | 'normal' };
  now_decrypt_pressed: { slug: string };
  web_vital:           { name: 'LCP'|'CLS'|'INP'|'FCP'|'TTFB'; value: number; rating: string };
  arcade_curtain_triggered: { device: 'desktop' | 'mobile' };
};

export function track<E extends keyof EventPayloads>(event: E, props: EventPayloads[E]): void;
```

### 7.4 `src/lib/analytics/web-vitals.ts` (new)

Receives a `Metric` from `useReportWebVitals` and forwards to PostHog. Only essential fields (`name`, `value`, `rating`).

### 7.5 Sentry config files (new, repo root)

Three files per Sentry Next.js convention:

- `sentry.client.config.ts` — `Sentry.init({ dsn, sendDefaultPii: false, tracesSampleRate: 0.1, beforeSend: stripPII, beforeBreadcrumb: stripBreadcrumbPII })`
- `sentry.server.config.ts` — same DSN, server runtime.
- `sentry.edge.config.ts` — same DSN, edge runtime.

### 7.6 `src/lib/sentry/filters.ts` (new)

Exports `stripPII(event)` and `stripBreadcrumbPII(crumb)`:

- Drop `request.cookies`, `request.headers`, `request.query_string`.
- Replace `request.url` query strings with `?[stripped]`.
- Drop `user` object entirely.
- Drop breadcrumb `data.url` query strings.
- Skip events whose exception value matches noise patterns: `ResizeObserver loop`, `Non-Error promise rejection captured`, network errors from extension origins.

### 7.7 `instrumentation.ts` (new, repo root)

Next.js 16 instrumentation hook. Loads Sentry server or edge config based on runtime.

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
export const onRequestError = Sentry.captureRequestError;
```

### 7.8 `src/app/api/monitoring/route.ts` (new)

Sentry tunnel route. Receives envelope POSTs from the browser SDK, forwards to Sentry ingest at the DSN's project endpoint. Validates that the envelope DSN matches our project DSN to prevent abuse.

### 7.9 `next.config.ts` (modified)

Wrap default export with `withSentryConfig(nextConfig, { org, project, authToken, silent: true, tunnelRoute: '/api/monitoring', hideSourceMaps: true })`.

## 8. Data Flow

### Pageview

1. User navigates to `/arcade`.
2. `usePathname()` in `Providers` returns `/arcade`.
3. Effect fires → `posthog.capture('$pageview', { $current_url, $referrer })`.
4. PostHog client batches and POSTs to `us.i.posthog.com`.
5. IP stripped at ingest. Country derived, IP discarded.

### Custom event

1. User clicks Snake card on `/arcade`.
2. Handler calls `track(Events.ArcadeGameStarted, { game: 'snake' })`.
3. `track()` invokes `posthog.capture('arcade_game_started', { game: 'snake' })`.
4. Sent in next batch flush.

### Error

1. Component throws.
2. Sentry browser SDK catches via `window.onerror`.
3. SDK builds envelope with stack trace + scrubbed context.
4. POST to `/api/monitoring` (Next route).
5. Route forwards envelope to Sentry ingest.
6. At build time, source maps already uploaded → readable stack in Sentry UI.

### Web vital

1. Page loads, browser fires `LCP` via Performance API.
2. `useReportWebVitals` callback receives `Metric`.
3. Callback calls `posthog.capture('web_vital', { name, value, rating })`.

## 9. Integration Touchpoints

| File | Change | Event(s) emitted |
|---|---|---|
| `src/app/layout.tsx` | Import + wrap children with `<Providers>`. | — |
| `src/app/providers.tsx` | New file. | `$pageview`, `web_vital` |
| `src/context/HuntContext.tsx` | Inside the unlock reducer/action, emit `hunt_clue_unlocked`. On completion (all 15 clues), emit `hunt_completed`. | `hunt_clue_unlocked`, `hunt_completed` |
| `src/components/arcade/ArcadeCurtain.tsx` | On trigger fired, emit event with device class. | `arcade_curtain_triggered` |
| Arcade game launch components (Snake / Breakout / Pong / Invaders / Secret) | On game start, emit start. On game over, emit score. | `arcade_game_started`, `arcade_game_score` |
| `src/components/Contact.tsx` | On submit response, emit success flag. Form fields tagged `data-ph-no-capture`. | `contact_form_submitted` |
| `src/components/sections/Projects*` (project card click) | On card click, emit project id. | `project_card_clicked` |
| `src/app/now/[slug]/page.tsx` | On mount in a client child, emit log view. | `now_log_viewed` |
| `src/components/now/DecryptShell.tsx` | On DECRYPT press, emit slug. | `now_decrypt_pressed` |
| `next.config.ts` | Wrap with `withSentryConfig`. | — |
| `instrumentation.ts` | New file. | — |
| `sentry.{client,server,edge}.config.ts` | New files. | — |
| `.env.local.example` | Append PostHog + Sentry block. | — |

## 10. PII Defense in Depth

1. **Network layer:** PostHog `ip: false` and Sentry `sendDefaultPii: false` drop IP at ingest.
2. **Storage layer:** PostHog `persistence: 'memory'` — no cookies, no localStorage analytics keys.
3. **Identity layer:** No `identify()`, no `alias()`, no user-provided properties ever passed to PostHog.
4. **Form fields:** Contact form name/email/message inputs receive `data-ph-no-capture` so autocapture never reads values.
5. **URL layer:** Sentry `beforeSend` and `beforeBreadcrumb` strip query strings.
6. **Header layer:** Sentry strips `request.cookies` and `request.headers`.
7. **Build layer:** Source maps uploaded but `hideSourceMaps: true` — not served to clients.

## 11. Error Handling

- PostHog init failure (network blocked, DSN invalid): SDK fails silently per its own design. App continues. No exception surface.
- Sentry init failure: same — SDK is fault-tolerant by design.
- Sentry tunnel route receives malformed envelope: respond 400. Do not crash.
- Missing env vars in production: PostHog `init()` no-ops if `NEXT_PUBLIC_POSTHOG_KEY` is empty; Sentry config no-ops if DSN is empty. Build succeeds. App functions without analytics.
- Dev environment: PostHog `debug()` enabled. Sentry traces sample = 1.0 in dev for visibility.

## 12. Env Vars

Append to `.env.local.example`:

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

`SENTRY_AUTH_TOKEN` is build-time only (source map upload). Not exposed to the browser.

## 13. Verification

Manual checks after implementation:

1. `npm run dev` — open browser DevTools → Network. Confirm POST to `us.i.posthog.com` on page load. Confirm no `Set-Cookie` headers from PostHog. Confirm no `posthog` keys in `localStorage` or `document.cookie`.
2. Navigate between routes — confirm one `$pageview` event per route change.
3. Trigger arcade game start — confirm `arcade_game_started` event in PostHog Live Events view.
4. Throw a test error from a component — confirm error appears in Sentry with readable source-mapped stack.
5. Submit contact form — confirm `contact_form_submitted` event fires; confirm field values do NOT appear in event properties.
6. `npm run build` — confirm source map upload step runs and succeeds.
7. Production deploy — confirm Sentry tunnel route `/api/monitoring` returns 200 for valid envelopes, 400 for invalid.
8. Run Lighthouse — confirm no Core Web Vitals regression (PostHog SDK is ~50KB gzipped, Sentry ~30KB gzipped, loaded async).

## 14. Out of Scope (future work)

- Session recordings + consent banner.
- Server-side event capture for higher-trust events (e.g., contact form server-side validation outcome).
- PostHog feature flags for gated experiments.
- Sentry alerting integration (Slack, email).
- Analytics dashboard embedded in `/now` or admin route.
- A/B testing of hero copy.
- Funnel analysis across sessions (requires identification).
