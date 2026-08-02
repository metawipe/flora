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

/** Manual scroll restoration; route scroll is handled in PageTransition. */
export function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Keep pathname subscription so Next still treats this as route-aware chrome
  usePathname();

  return null;
}
