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
