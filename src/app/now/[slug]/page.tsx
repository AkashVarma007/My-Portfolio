import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchAllSlugs,
  fetchLogBySlug,
  fetchPrevNext,
} from "@/lib/sanity/queries";
import type { LogDetail, LogNeighbor } from "@/lib/sanity/types";
import { LogBody } from "@/components/now/LogBody";
import { DecryptShell } from "@/components/now/DecryptShell";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function renderTags(log: LogDetail): string {
  return log.tags.map((t) => t.toLowerCase()).join(" · ");
}

function FootCell({
  side,
  neighbor,
}: {
  side: "prev" | "next";
  neighbor: LogNeighbor;
}) {
  const label = side === "prev" ? "← previous" : "next →";
  const className = `now-foot__link${
    side === "next" ? " now-foot__cell--next" : ""
  }`;

  if (!neighbor) {
    return (
      <span className={className} aria-disabled="true">
        <span className="now-foot__label">{label}</span>
        <span className="now-foot__title">—</span>
      </span>
    );
  }

  return (
    <Link href={`/now/${neighbor.slug}`} className={className}>
      <span className="now-foot__label">{label}</span>
      <span className="now-foot__title">{neighbor.title}</span>
    </Link>
  );
}

export default async function NowDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const log = await fetchLogBySlug(slug);
  if (!log) notFound();

  const { prev, next } = await fetchPrevNext(log.publishedAt);

  const content = (
    <article className="now-detail">
      <Link href="/now" className="now-detail__crumb">
        <span aria-hidden="true">←</span> back to now
      </Link>

      <h1 className="now-detail__title">{log.title}</h1>

      <div className="now-detail__meta">
        <span className="now-mono">{formatLongDate(log.publishedAt)}</span>
        {log.tags.length > 0 ? (
          <span className="now-mono">{renderTags(log)}</span>
        ) : null}
        {log.location ? (
          <span className="now-mono">{log.location.toLowerCase()}</span>
        ) : null}
        {log.priority !== "NORMAL" ? (
          <span className="now-mono">{log.priority.toLowerCase()}</span>
        ) : null}
      </div>

      <div className="now-detail__rule" aria-hidden="true" />

      <div className="now-detail__body">
        <LogBody body={log.body ?? []} clueId={log.clueId} />
      </div>

      <nav className="now-foot" aria-label="other entries">
        <FootCell side="prev" neighbor={prev} />
        <FootCell side="next" neighbor={next} />
      </nav>
    </article>
  );

  if (log.priority === "CLASSIFIED") {
    return <DecryptShell logId={log.id}>{content}</DecryptShell>;
  }
  return content;
}
