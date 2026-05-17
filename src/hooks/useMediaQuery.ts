import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false,
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
