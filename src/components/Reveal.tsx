"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Show right after preloader, without waiting for scroll */
  eager?: boolean;
  as?: "div" | "section" | "article" | "li";
};

function waitForAppReady(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.documentElement.classList.contains("app-ready")) {
    return Promise.resolve();
  }
  // No preloader / already past boot
  if (!document.documentElement.classList.contains("is-booting")) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("app-ready")) done();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const fallback = window.setTimeout(done, 4000);
  });
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  eager = false,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const show = () => {
      if (cancelled) return;
      window.setTimeout(() => {
        if (!cancelled) el.classList.add("is-in");
      }, delay);
    };

    void waitForAppReady().then(() => {
      if (cancelled) return;

      if (eager) {
        show();
        return;
      }

      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) {
        show();
        return;
      }

      if (!("IntersectionObserver" in window)) {
        show();
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              show();
              io?.disconnect();
              break;
            }
          }
        },
        // Any visible pixel is enough — tall sections must not wait for 12% height
        { rootMargin: "120px 0px 0px 0px", threshold: 0 },
      );
      io.observe(el);
    });

    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, [delay, eager]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
