"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type StickyBarProps = {
  className?: string;
  children: ReactNode;
};

/** Renders fixed chrome on document.body so ancestor transforms can't trap it. */
export function StickyBar({ className, children }: StickyBarProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const bar = (
    <div className={["app-sticky-bar", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );

  if (portalRoot) {
    return createPortal(bar, portalRoot);
  }

  return bar;
}
