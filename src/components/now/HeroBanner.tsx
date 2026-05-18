// src/components/now/HeroBanner.tsx
type HeroBannerProps = {
  logCount: number;
  lastPublishedAt: string | null;
};

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const FULL_ART = `
  ███╗   ██╗ ██████╗ ██╗    ██╗
  ████╗  ██║██╔═══██╗██║    ██║
  ██╔██╗ ██║██║   ██║██║ █╗ ██║
  ██║╚██╗██║██║   ██║██║███╗██║
  ██║ ╚████║╚██████╔╝╚███╔███╔╝
  ╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝
`.trim();

const SHORT_ART = `
  ███╗ ██╗ ██████╗ ██╗    ██╗
  ██╔████║██║   ██║██║ █╗ ██║
  ██║╚██╔╝╚██████╔╝╚███╔███╔╝
  ╚═╝ ╚═╝  ╚═════╝  ╚══╝╚══╝
`.trim();

export function HeroBanner({ logCount, lastPublishedAt }: HeroBannerProps) {
  const padded = String(logCount).padStart(3, "0");
  return (
    <header className="px-6 md:px-12 pt-24 md:pt-32 max-w-5xl mx-auto">
      <div className="font-[var(--font-mono)] text-[12px] md:text-sm text-[color:var(--now-accent)]">
        <span>&gt; NOW.akash // channel open // signal stable</span>
        <span className="now-cursor" aria-hidden="true" />
      </div>

      <pre
        aria-hidden="true"
        className="hidden md:block mt-6 text-[10px] leading-tight text-[color:var(--now-fg)] whitespace-pre font-[var(--font-mono)]"
      >
        {FULL_ART}
      </pre>
      <pre
        aria-hidden="true"
        className="block md:hidden mt-6 text-[8px] leading-tight text-[color:var(--now-fg)] whitespace-pre font-[var(--font-mono)]"
      >
        {SHORT_ART}
      </pre>

      <h1 className="sr-only">NOW.akash</h1>

      <div className="mt-6 font-[var(--font-mono)] text-xs md:text-sm text-[color:var(--now-dim)]">
        LOGS: {padded} &nbsp;&nbsp;//&nbsp;&nbsp; LAST TRANSMISSION:{" "}
        {relativeTime(lastPublishedAt)}
      </div>

      <p className="mt-6 max-w-xl text-base md:text-lg text-[color:var(--now-fg)]/85 leading-relaxed">
        live broadcasts from akash&apos;s desk. transmissions append here as they
        happen.
      </p>
    </header>
  );
}
