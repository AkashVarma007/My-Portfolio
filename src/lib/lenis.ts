import type Lenis from "lenis";

/** Tiny registry so non-SmoothScroll consumers (e.g. RouteReveal) can drive
 *  Lenis programmatically without prop-drilling or window globals. */
let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
