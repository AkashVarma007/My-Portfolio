import Link from "next/link";

import type { LogSummary } from "@/lib/sanity/types";

type Props = {
  log: LogSummary;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function primaryTag(log: LogSummary): string {
  return (log.tags[0] ?? "signal").toLowerCase();
}

function maskText(text: string): string {
  return text.replace(/\S/g, "█");
}

export function LogRow({ log }: Props) {
  const isClassified = log.priority === "CLASSIFIED";
  const title = isClassified ? maskText(log.title) : log.title;
  const excerpt = isClassified ? maskText(log.excerpt) : log.excerpt;
  const date = formatDate(log.publishedAt);
  const tag = primaryTag(log);

  return (
    <Link
      href={`/now/${log.slug}`}
      className={`now-row${isClassified ? " now-row--classified" : ""}`}
    >
      <span className="now-row__date">{date}</span>

      <div className="now-row__body">
        <div className="now-row__top">
          {isClassified ? (
            <span className="now-row__title">
              <span className="now-redact-block">{title}</span>
            </span>
          ) : (
            <span className="now-row__title">{log.title}</span>
          )}
          <span className="now-row__tag">{tag}</span>
        </div>
        {log.excerpt ? (
          <p className="now-row__excerpt">
            {isClassified ? (
              <span className="now-redact-block">{excerpt}</span>
            ) : (
              log.excerpt
            )}
          </p>
        ) : null}
      </div>

      <span className="now-row__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
