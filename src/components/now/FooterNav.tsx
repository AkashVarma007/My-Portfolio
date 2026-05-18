// src/components/now/FooterNav.tsx
import Link from "next/link";
import type { LogNeighbor } from "@/lib/sanity/types";

function paddedId(id: number): string {
  return `LOG-${String(id).padStart(3, "0")}`;
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

type Props = { prev: LogNeighbor; next: LogNeighbor };

export function FooterNav({ prev, next }: Props) {
  return (
    <footer className="font-[var(--font-mono)] text-xs md:text-sm">
      <div className="border-t border-[color:var(--now-line)] my-10" />
      <div className="text-center text-[color:var(--now-dim)]">
        END OF TRANSMISSION
      </div>
      <div className="border-t border-[color:var(--now-line)] my-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {prev ? (
            <Link href={`/now/${prev.slug}`} className="block group">
              <div className="text-[color:var(--now-accent)] group-hover:underline">
                &lt; PREV LOG
              </div>
              <div className="text-[color:var(--now-fg)] mt-1">
                {paddedId(prev.id)}
              </div>
              <div className="text-[color:var(--now-dim)] mt-1 italic">
                &quot;{truncate(prev.title, 28)}&quot;
              </div>
            </Link>
          ) : (
            <div className="text-[color:var(--now-dim)]/60">&lt; START OF LOG</div>
          )}
        </div>

        <div className="md:text-right">
          {next ? (
            <Link href={`/now/${next.slug}`} className="block group">
              <div className="text-[color:var(--now-accent)] group-hover:underline">
                NEXT LOG &gt;
              </div>
              <div className="text-[color:var(--now-fg)] mt-1">
                {paddedId(next.id)}
              </div>
              <div className="text-[color:var(--now-dim)] mt-1 italic">
                &quot;{truncate(next.title, 28)}&quot;
              </div>
            </Link>
          ) : (
            <div className="text-[color:var(--now-dim)]/60">END OF LOG &gt;</div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/now"
          className="text-[color:var(--now-accent)] hover:underline"
        >
          # RETURN TO CHANNEL
        </Link>
      </div>
    </footer>
  );
}
