"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function scrollToTopInstant() {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  html.scrollTop = 0;
  document.body.scrollTop = 0;

  html.style.scrollBehavior = prevBehavior;
}

/** Resets scroll to top on every route change (and after paint). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    scrollToTopInstant();

    const raf = window.requestAnimationFrame(() => {
      scrollToTopInstant();
    });
    // Catch late layout after images / client content swap
    const t1 = window.setTimeout(scrollToTopInstant, 50);
    const t2 = window.setTimeout(scrollToTopInstant, 200);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
