"use client";

import { site } from "@/data/products";
import { tTickerItems } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";

export function Ticker() {
  const { locale } = useLocale();
  const items = tTickerItems(locale, site.phone);
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="ticker__item">
            {text} /
          </span>
        ))}
      </div>
    </div>
  );
}
