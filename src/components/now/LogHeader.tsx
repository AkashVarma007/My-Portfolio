// src/components/now/LogHeader.tsx
import type { LogDetail } from "@/lib/sanity/types";
import { vanityHash } from "@/lib/sanity/hash";

function paddedId(id: number): string {
  return `LOG-${String(id).padStart(3, "0")}`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function priorityClass(p: LogDetail["priority"]): string {
  if (p === "CLASSIFIED") return "now-priority-classified";
  if (p === "HIGH") return "now-priority-high";
  return "text-[color:var(--now-fg)]";
}

export function LogHeader({ log }: { log: LogDetail }) {
  const hash = vanityHash(log.slug);

  return (
    <section
      aria-label="Log metadata"
      className="font-[var(--font-mono)] text-[12px] md:text-sm border border-[color:var(--now-line)] rounded p-5 md:p-6 bg-[rgba(8,12,22,0.7)]"
    >
      <header className="flex items-center justify-between">
        <span className="text-[color:var(--now-fg)] font-semibold">
          ▎ {paddedId(log.id)}
        </span>
        <span className="text-[color:var(--now-accent)]">
          ◉◉◉◉◌ SIGNAL <span className="now-cursor" aria-hidden="true" />
        </span>
      </header>

      <dl className="mt-4 grid grid-cols-[max-content_1fr] md:grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-[color:var(--now-dim)]">
        <dt>TIMESTAMP</dt>
        <dd className="text-[color:var(--now-fg)]">{formatTimestamp(log.publishedAt)}</dd>

        <dt>CHANNEL</dt>
        <dd className="text-[color:var(--now-fg)]">NOW.akash</dd>

        {log.location ? (
          <>
            <dt>ORIGIN</dt>
            <dd className="text-[color:var(--now-fg)]">{log.location}</dd>
          </>
        ) : null}

        <dt>PRIORITY</dt>
        <dd className={priorityClass(log.priority)}>{log.priority}</dd>

        <dt>TAGS</dt>
        <dd className="text-[color:var(--now-fg)]">
          {log.tags.map((t) => `[${t}]`).join(" ")}
        </dd>

        <dt>HASH</dt>
        <dd className="text-[color:var(--now-fg)]/80">{hash}</dd>
      </dl>
    </section>
  );
}
