// src/components/now/blocks/AsciiBlock.tsx
export function AsciiBlock({ art }: { art: string }) {
  return (
    <pre
      aria-hidden="true"
      className="font-[var(--font-mono)] text-[10px] md:text-xs leading-tight text-[color:var(--now-accent)] my-6 whitespace-pre"
      style={{ textShadow: "0 0 6px rgba(98,232,255,0.4)" }}
    >
      {art}
    </pre>
  );
}
