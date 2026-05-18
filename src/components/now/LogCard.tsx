// src/components/now/LogCard.tsx
import Link from "next/link";
import type { LogSummary } from "@/lib/sanity/types";

const TAG_COLORS: Record<string, string> = {
  BUILD: "text-[color:var(--now-accent)]",
  LEARN: "text-emerald-300",
  READ: "text-amber-300",
  LIFE: "text-pink-300",
  SHIP: "text-[color:var(--now-accent-warm)]",
  DRIFT: "text-violet-300",
  SIGNAL: "text-sky-300",
};

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function paddedId(id: number): string {
  return `LOG-${String(id).padStart(3, "0")}`;
}

export function LogCard({ log }: { log: LogSummary }) {
  const classified = log.priority === "CLASSIFIED";
  const high = log.priority === "HIGH";

  return (
    <Link
      href={`/now/${log.slug}`}
      aria-label={`Open transmission ${paddedId(log.id)}`}
      className="block"
    >
      <article
        className={`now-scan-card p-6 md:p-7 transition-colors ${
          high ? "shadow-[0_0_24px_rgba(255,138,61,0.18)]" : ""
        } ${classified ? "shadow-[0_0_24px_rgba(255,59,92,0.22)]" : ""}`}
      >
        <header className="flex items-center justify-between font-[var(--font-mono)] text-[11px] md:text-xs text-[color:var(--now-dim)] uppercase tracking-wider">
          <span>
            {paddedId(log.id)} &nbsp;//&nbsp; {formatDate(log.publishedAt)}
            {log.location ? ` // ${log.location}` : ""}
          </span>
          {log.pinned ? (
            <span className="text-[color:var(--now-accent)]">PIN</span>
          ) : null}
        </header>

        <div className="mt-3 border-t border-[color:var(--now-line)]" />

        <h3 className="mt-5 text-2xl md:text-3xl font-[var(--font-bricolage)] text-[color:var(--now-fg)]">
          {classified ? (
            <span className="inline-block bg-black text-transparent select-none">
              [ ████████████████ ]
            </span>
          ) : (
            log.title
          )}
        </h3>

        <p className="mt-4 text-sm md:text-base text-[color:var(--now-fg)]/75 leading-relaxed">
          {classified ? (
            <span className="inline-block bg-black text-transparent select-none">
              ████████████████████████████████████████████████
            </span>
          ) : (
            log.excerpt
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[10px] md:text-xs uppercase tracking-wider">
          {log.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 border border-[color:var(--now-line)] ${
                TAG_COLORS[tag] ?? "text-[color:var(--now-fg)]"
              }`}
            >
              [{tag}]
            </span>
          ))}
          <span
            className={`ml-auto ${
              classified
                ? "now-priority-classified"
                : high
                ? "now-priority-high"
                : "text-[color:var(--now-dim)]"
            }`}
          >
            PRIO: {log.priority}
          </span>
        </div>

        <div className="mt-5 border-t border-[color:var(--now-line)]" />

        <div className="mt-4 text-right font-[var(--font-mono)] text-xs text-[color:var(--now-accent)]">
          OPEN TRANSMISSION →
        </div>
      </article>
    </Link>
  );
}
