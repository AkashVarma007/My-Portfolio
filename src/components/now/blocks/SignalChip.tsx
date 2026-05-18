// src/components/now/blocks/SignalChip.tsx
import type { ReactNode } from "react";

export function SignalChip({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <span className="inline-block px-2 py-1 mx-1 font-[var(--font-mono)] text-[10px] uppercase tracking-wider border border-[color:var(--now-accent)] text-[color:var(--now-accent)] rounded">
      [SIGNAL{label ? `: ${label}` : ""}] {children}
    </span>
  );
}
