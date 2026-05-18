// src/components/now/EmptyState.tsx
export function EmptyState() {
  return (
    <section className="px-6 md:px-12 max-w-5xl mx-auto mt-12 mb-32">
      <div className="font-[var(--font-mono)] text-[12px] md:text-sm text-[color:var(--now-accent-warm)]">
        &gt; NOW.akash // channel open // signal cold
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-[var(--font-bricolage)] text-[color:var(--now-fg)]">
        NO TRANSMISSIONS YET
      </h2>
      <p className="mt-6 text-base text-[color:var(--now-fg)]/70">
        stand by. first broadcast incoming.
      </p>
    </section>
  );
}
