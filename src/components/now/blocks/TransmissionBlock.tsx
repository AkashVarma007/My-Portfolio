// src/components/now/blocks/TransmissionBlock.tsx
export function TransmissionBlock({ body }: { body: string }) {
  return (
    <figure className="my-8 border border-[color:var(--now-line)] rounded p-5 md:p-6 bg-[rgba(8,12,22,0.6)]">
      <figcaption className="font-[var(--font-mono)] text-[11px] text-[color:var(--now-accent)] tracking-wider mb-3">
        &gt;&gt; INTERCEPTED &lt;&lt;
      </figcaption>
      <blockquote className="font-[var(--font-outfit)] text-base md:text-lg text-[color:var(--now-fg)]/90 leading-relaxed whitespace-pre-line">
        {body}
      </blockquote>
    </figure>
  );
}
