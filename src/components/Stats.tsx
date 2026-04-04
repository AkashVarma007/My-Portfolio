"use client";

import { FadeUp } from "./RevealText";

const stats = [
  { value: "3+", label: "Years" },
  { value: "10K+", label: "Devices" },
  { value: "8+", label: "Projects" },
  { value: "₹40L+", label: "Value Driven" },
];

export function Stats() {
  return (
    <div className="border-y border-border relative z-[1] py-10 md:py-14">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.08}>
              <div className="group">
                <div className="font-display text-[2.5rem] md:text-[3rem] font-extrabold tracking-[-2px] text-accent leading-none">
                  {stat.value}
                </div>
                <div className="text-[0.6rem] text-text-muted uppercase tracking-[4px] mt-1.5">
                  {stat.label}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
