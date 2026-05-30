"use client";

import { useEffect } from "react";
import { Events, track } from "@/lib/analytics/events";

export function NowLogViewLogger({
  slug,
  priority,
}: {
  slug: string;
  priority: "CLASSIFIED" | "HIGH" | "NORMAL";
}) {
  useEffect(() => {
    track(Events.NowLogViewed, {
      slug,
      priority: priority === "CLASSIFIED" ? "classified" : "normal",
    });
  }, [slug, priority]);

  return null;
}
