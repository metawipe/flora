"use client";

import { useEffect, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";

const MOBILE_MQ = "(max-width: 900px)";

/**
 * Mobile: bottom dock shows only after the top chrome has scrolled fully off-screen.
 * Desktop: never shows the dock.
 */
export function useMobileChrome(
  topRef: RefObject<HTMLElement | null>,
  menuOpen = false,
) {
  const pathname = usePathname();
  const [away, setAway] = useState(false);

  useEffect(() => {
    setAway(false);
  }, [pathname]);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;

    const isMobile = () => window.matchMedia(MOBILE_MQ).matches;

    const sync = (topVisible: boolean) => {
      if (!isMobile() || menuOpen) {
        setAway(false);
        return;
      }
      setAway(!topVisible);
    };

    // Immediate check (IO may not fire until scroll)
    const measure = () => {
      if (!isMobile() || menuOpen) {
        setAway(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      // Top chrome is gone once its bottom edge is at/above the viewport top
      sync(rect.bottom > 0);
    };

    measure();

    const io = new IntersectionObserver(
      ([entry]) => {
        sync(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    io.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [topRef, menuOpen, pathname]);

  useEffect(() => {
    const on = away && !menuOpen;
    document.documentElement.classList.toggle("dock-visible", on);
    return () => {
      document.documentElement.classList.remove("dock-visible");
    };
  }, [away, menuOpen]);

  return away && !menuOpen;
}
