"use client";

// Removed Lenis — it breaks Framer Motion's IntersectionObserver.
// CSS scroll-behavior: smooth handles smooth scrolling natively.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
