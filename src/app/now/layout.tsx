// src/app/now/layout.tsx
import type { ReactNode } from "react";
import { BootSequence } from "@/components/now/BootSequence";
import "./now.css";

export const metadata = {
  title: "now :: akash.varma",
  description:
    "Live broadcasts from akash's desk. transmissions append here as they happen.",
};

export default function NowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="now-root">
      <BootSequence />
      {children}
    </div>
  );
}
