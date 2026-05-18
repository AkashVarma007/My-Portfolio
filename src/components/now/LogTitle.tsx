// src/components/now/LogTitle.tsx
export function LogTitle({ title }: { title: string }) {
  return (
    <h1 className="text-3xl md:text-5xl font-[var(--font-bricolage)] text-[color:var(--now-fg)]">
      <span
        aria-hidden="true"
        className="font-[var(--font-mono)] text-[color:var(--now-accent)] mr-3"
      >
        ───
      </span>
      {title}
      <span
        aria-hidden="true"
        className="font-[var(--font-mono)] text-[color:var(--now-accent)] ml-3"
      >
        ───
      </span>
    </h1>
  );
}
