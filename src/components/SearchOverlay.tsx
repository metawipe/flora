"use client";

import { useEffect, useRef } from "react";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-label="Поиск">
      <div className="search-box">
        <input
          ref={inputRef}
          type="search"
          placeholder="Поиск по сайту"
          aria-label="Поиск по сайту"
        />
        <button
          type="button"
          className="search-box__close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
