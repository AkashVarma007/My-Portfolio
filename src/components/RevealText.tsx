"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className = "", delay = 0 }: Props) {
  return (
    <div className={`gsap-fade-up ${className}`} data-delay={delay}>
      {children}
    </div>
  );
}

export function FadeIn({ children, className = "", delay = 0 }: Props) {
  return (
    <div className={`gsap-fade-in ${className}`} data-delay={delay}>
      {children}
    </div>
  );
}
