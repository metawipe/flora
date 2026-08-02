"use client";

import type { ReactNode } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";

type DragScrollProps = {
  className?: string;
  children: ReactNode;
};

export function DragScroll({ className = "", children }: DragScrollProps) {
  const ref = useDragScroll<HTMLDivElement>();
  return (
    <div ref={ref} className={`drag-scroll${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
