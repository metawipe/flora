"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type StickyBarProps = {
  className?: string;
  children: ReactNode;
};

/** Renders fixed chrome on document.body so ancestor transforms can't trap it. */
export function StickyBar({ className, children }: StickyBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={["app-sticky-bar", className].filter(Boolean).join(" ")}>
      {children}
    </div>,
    document.body,
  );
}
