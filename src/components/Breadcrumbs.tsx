"use client";

import Link from "next/link";
import { useT } from "@/i18n/LocaleProvider";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useT();

  return (
    <nav className="breadcrumbs" aria-label={t("common.breadcrumb")}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="breadcrumbs__item">
            {i > 0 && <span className="breadcrumbs__sep">»</span>}
            {last || !item.href ? (
              <span className="breadcrumbs__current">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
