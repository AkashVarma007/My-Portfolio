// src/app/now/layout.tsx
import type { ReactNode } from "react";
import { HuntProvider } from "@/context/HuntContext";
import { Navigation } from "@/components/Navigation";
import { CustomCursor } from "@/components/CustomCursor";
import { RouteReveal } from "@/components/RouteReveal";
import "./now.css";

export const metadata = {
  title: "now :: akash varma",
  description: "what i'm building, reading, and learning — updated when it changes.",
};

export default function NowLayout({ children }: { children: ReactNode }) {
  return (
    <HuntProvider>
      <CustomCursor />
      <RouteReveal>
        <Navigation />
        <div className="now-root">{children}</div>
      </RouteReveal>
    </HuntProvider>
  );
}
