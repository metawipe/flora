"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/data/products";

type CatalogBarProps = {
  className?: string;
};

export function CatalogBar({ className = "" }: CatalogBarProps) {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>(".catalog-bar__link.is-active");
    if (!active) return;
    const left =
      active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [pathname]);

  return (
    <nav
      className={`catalog-bar${className ? ` ${className}` : ""}`}
      aria-label="Каталог"
    >
      <div className="catalog-bar__scroller" ref={scrollerRef}>
        <div className="catalog-bar__inner">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`catalog-bar__link${active ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
