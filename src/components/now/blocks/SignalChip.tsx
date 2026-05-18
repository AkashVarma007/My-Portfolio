import type { ReactNode } from "react";

export function SignalChip({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <span className="now-chip">
      {label ? `${label}: ` : ""}
      {children}
    </span>
  );
}
