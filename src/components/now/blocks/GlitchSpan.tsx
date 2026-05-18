import type { ReactNode } from "react";

export function GlitchSpan({ children }: { children: ReactNode }) {
  return <span className="now-glitch">{children}</span>;
}
