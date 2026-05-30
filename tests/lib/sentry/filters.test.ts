import { describe, it, expect } from "vitest";
import { stripPII, stripBreadcrumbPII, isNoiseEvent } from "@/lib/sentry/filters";
import type { ErrorEvent, Breadcrumb } from "@sentry/nextjs";

describe("stripPII", () => {
  it("removes cookies, headers, query strings from request", () => {
    const event: ErrorEvent = {
      type: undefined,
      request: {
        url: "https://example.com/path?token=abc&id=42",
        cookies: { session: "secret" },
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
