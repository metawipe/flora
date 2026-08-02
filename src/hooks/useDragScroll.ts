"use client";

import { useEffect, useRef } from "react";

const DRAG_THRESHOLD = 10;
const FRICTION = 0.94;
const MIN_VELOCITY = 0.08;

type DragScrollOptions = {
  /** Snap to full-width slides right after release (PDP album). */
  snapPages?: boolean;
};

/** Smooth mouse drag-to-scroll. Touch keeps native scrolling. */
export function useDragScroll<T extends HTMLElement>(
  options: DragScrollOptions = {},
) {
  const ref = useRef<T | null>(null);
  const snapPages = options.snapPages === true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = false;
    let dragged = false;
    let startX = 0;
    let originScroll = 0;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let moveRaf = 0;
    let animRaf = 0;
    let pendingX: number | null = null;

    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

    const applyScroll = (left: number) => {
      el.scrollLeft = Math.max(0, Math.min(maxScroll(), left));
    };

    const stopAnim = () => {
      if (animRaf) {
        cancelAnimationFrame(animRaf);
        animRaf = 0;
      }
    };

    const pageWidth = () => el.clientWidth || 1;

    const animateTo = (target: number) => {
      stopAnim();
      const from = el.scrollLeft;
      const dist = target - from;
      if (Math.abs(dist) < 0.5) {
        applyScroll(target);
        el.classList.remove("is-drag-scroll");
        return;
      }
      // Short ease — no CSS smooth (that feels like a delayed teleport)
      const duration = Math.min(200, Math.max(110, Math.abs(dist) * 0.35));
      const t0 = performance.now();
      el.classList.add("is-drag-scroll");
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const ease = 1 - (1 - t) ** 3;
        applyScroll(from + dist * ease);
        if (t < 1) {
          animRaf = requestAnimationFrame(step);
        } else {
          animRaf = 0;
          el.classList.remove("is-drag-scroll");
        }
      };
      animRaf = requestAnimationFrame(step);
    };

    const snapIndexAfterDrag = () => {
      const w = pageWidth();
      const startIndex = Math.round(originScroll / w);
      const delta = el.scrollLeft - originScroll;
      const maxIndex = Math.max(0, Math.round(maxScroll() / w));

      let index = startIndex;
      // Flick wins over distance
      if (velocity > 0.9) index = startIndex + 1;
      else if (velocity < -0.9) index = startIndex - 1;
      else if (delta > w * 0.22) index = startIndex + 1;
      else if (delta < -w * 0.22) index = startIndex - 1;

      return Math.max(0, Math.min(maxIndex, index));
    };

    const tickInertia = () => {
      velocity *= FRICTION;
      if (Math.abs(velocity) < MIN_VELOCITY) {
        animRaf = 0;
        el.classList.remove("is-drag-scroll");
        return;
      }
      applyScroll(el.scrollLeft + velocity);
      animRaf = requestAnimationFrame(tickInertia);
    };

    const beginDrag = (e: PointerEvent) => {
      if (dragged) return;
      dragged = true;
      el.classList.add("is-drag-scroll");
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const flushMove = (e?: PointerEvent) => {
      if (pendingX == null) return;
      const x = pendingX;
      pendingX = null;
      const dx = x - startX;
      if (!dragged) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        if (e) beginDrag(e);
        else {
          dragged = true;
          el.classList.add("is-drag-scroll");
        }
      }
      applyScroll(originScroll - dx);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;
      stopAnim();
      if (moveRaf) {
        cancelAnimationFrame(moveRaf);
        moveRaf = 0;
      }
      pendingX = null;
      active = true;
      dragged = false;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      originScroll = el.scrollLeft;
      velocity = 0;
      pointerId = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active || pointerId !== e.pointerId) return;
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const frameVx = ((e.clientX - lastX) / dt) * 16;
      velocity = velocity * 0.65 + -frameVx * 0.35;
      lastX = e.clientX;
      lastT = now;
      pendingX = e.clientX;

      if (!dragged && Math.abs(e.clientX - startX) >= DRAG_THRESHOLD) {
        beginDrag(e);
      }

      if (!moveRaf) {
        moveRaf = requestAnimationFrame(() => {
          moveRaf = 0;
          flushMove(e);
        });
      }
      if (dragged) e.preventDefault();
    };

    const end = (e: PointerEvent) => {
      if (!active || (pointerId != null && pointerId !== e.pointerId)) return;
      active = false;
      if (moveRaf) {
        cancelAnimationFrame(moveRaf);
        moveRaf = 0;
      }
      flushMove(e);
      const didDrag = dragged;

      if (pointerId != null && didDrag) {
        try {
          el.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }
      }
      pointerId = null;

      if (!didDrag) {
        el.classList.remove("is-drag-scroll");
        return;
      }

      el.dataset.dragBlockClick = "1";
      window.setTimeout(() => {
        delete el.dataset.dragBlockClick;
      }, 0);

      stopAnim();

      if (snapPages) {
        const w = pageWidth();
        const index = snapIndexAfterDrag();
        animateTo(index * w);
        return;
      }

      el.classList.add("is-drag-scroll");
      animRaf = requestAnimationFrame(tickInertia);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (el.dataset.dragBlockClick === "1") {
        e.preventDefault();
        e.stopPropagation();
        delete el.dataset.dragBlockClick;
      }
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove, { passive: false });
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end as EventListener);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart, true);

    return () => {
      stopAnim();
      if (moveRaf) cancelAnimationFrame(moveRaf);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("lostpointercapture", end as EventListener);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart, true);
      el.classList.remove("is-drag-scroll");
    };
  }, [snapPages]);

  return ref;
}
