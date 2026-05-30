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
