"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Mount once in the tree — initialises Lenis and pipes it through GSAP's
 *  own ticker so there is exactly ONE RAF loop for both. */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    // Named so we can remove the exact same reference on cleanup
    const onTick = (time: number) => lenis.raf(time * 1000);

    // Pipe Lenis through GSAP's ticker — one RAF loop, not two
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return null;
}
