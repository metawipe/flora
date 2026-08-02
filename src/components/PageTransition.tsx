"use client";

import { usePathname } from "next/navigation";
import {
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type ReactNode,
} from "react";

function scrollToTopNow() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = prev;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const stackRef = useRef<string[]>([pathname]);
  const prevRef = useRef(pathname);
  const firstRef = useRef(true);
  const [dir, setDir] = useState<"forward" | "back" | null>(null);

  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      prevRef.current = pathname;
      return;
    }
    if (prevRef.current === pathname) return;

    const stack = stackRef.current;
    const existing = stack.lastIndexOf(pathname);
    let next: "forward" | "back" = "forward";

    if (existing >= 0 && existing < stack.length - 1) {
      next = "back";
      stackRef.current = stack.slice(0, existing + 1);
    } else if (stack[stack.length - 1] !== pathname) {
      stackRef.current = [...stack, pathname];
    }

    prevRef.current = pathname;
    scrollToTopNow();

    // Reset then re-apply on a microtask (no flushSync inside layout)
    setDir(null);
    queueMicrotask(() => setDir(next));
  }, [pathname]);

  const onAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setDir(null);
  };

  return (
    <div
      className={
        dir ? `page-transition page-transition--${dir}` : "page-transition"
      }
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
}
