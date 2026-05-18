// src/components/now/blocks/TerminalBlock.tsx
export function TerminalBlock({ lines }: { lines: string }) {
  const rows = lines.split(/\r?\n/);
  return (
    <pre className="now-scan-card font-[var(--font-mono)] text-[12px] md:text-sm p-4 md:p-5 my-6 whitespace-pre-wrap text-[color:var(--now-fg)]">
      {rows.map((row, i) => (
        <span key={i} className="block">
          <span className="text-[color:var(--now-accent)] mr-2">$</span>
          {row}
        </span>
      ))}
    </pre>
  );
}
