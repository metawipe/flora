"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  allProducts,
  formatPrice,
  localizeProductName,
  type Product,
} from "@/data/products";
import type { Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const LAT_TO_CYR: Record<string, string> = {
  a: "а",
  b: "б",
  v: "в",
  g: "г",
  d: "д",
  e: "е",
  yo: "ё",
  zh: "ж",
  z: "з",
  i: "и",
  y: "й",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  f: "ф",
  h: "х",
  kh: "х",
  c: "ц",
  ch: "ч",
  sh: "ш",
  sch: "щ",
  yu: "ю",
  ya: "я",
  w: "в",
  x: "кс",
  j: "дж",
};

function translitToCyrillic(input: string): string {
  let out = "";
  const s = input.toLowerCase();
  for (let i = 0; i < s.length; ) {
    const three = s.slice(i, i + 3);
    const two = s.slice(i, i + 2);
    if (LAT_TO_CYR[three]) {
      out += LAT_TO_CYR[three];
      i += 3;
    } else if (LAT_TO_CYR[two]) {
      out += LAT_TO_CYR[two];
      i += 2;
    } else if (LAT_TO_CYR[s[i]]) {
      out += LAT_TO_CYR[s[i]];
      i += 1;
    } else {
      out += s[i];
      i += 1;
    }
  }
  return out;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/ё/g, "е").trim();
}

function productMatches(
  product: Product,
  query: string,
  locale: Locale,
): boolean {
  const q = normalize(query);
  if (!q) return false;
  const localized = normalize(localizeProductName(product, locale));
  const fallback = normalize(product.name);
  const cyr = normalize(translitToCyrillic(query));
  return (
    localized.includes(q) ||
    fallback.includes(q) ||
    (cyr !== q && (localized.includes(cyr) || fallback.includes(cyr)))
  );
}

function highlightName(name: string, query: string) {
  const qRaw = query.trim();
  if (!qRaw) return <>{name}</>;

  const variants = Array.from(
    new Set(
      [qRaw, translitToCyrillic(qRaw)].map((v) => v.trim()).filter(Boolean),
    ),
  );

  const lower = name.toLowerCase().replace(/ё/g, "е");
  let matchIndex = -1;
  let matchLen = 0;

  for (const variant of variants) {
    const needle = variant.toLowerCase().replace(/ё/g, "е");
    const idx = lower.indexOf(needle);
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx;
      matchLen = variant.length;
    }
  }

  if (matchIndex === -1) return <>{name}</>;

  const before = name.slice(0, matchIndex);
  const match = name.slice(matchIndex, matchIndex + matchLen);
  const after = name.slice(matchIndex + matchLen);

  return (
    <>
      {before}
      <strong>{match}</strong>
      {after}
    </>
  );
}

function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<Product[]>(allProducts);
  const { locale, t } = useLocale();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    void fetch("/api/products")
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (Array.isArray(data.products) && data.products.length) {
          setCatalog(data.products);
        }
      })
      .catch(() => {
        /* keep mock fallback */
      });
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 1) return [];
    return catalog
      .filter((p) => productMatches(p, q, locale))
      .slice(0, 40);
  }, [query, locale, catalog]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-label={t("search.aria")}>
      <div className="search-panel">
        <div className="search-box">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              className="search-box__clear"
              aria-label={t("search.clear")}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              ×
            </button>
          )}
          <button
            type="button"
            className="search-box__close"
            aria-label={t("common.close")}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {query.trim().length > 0 && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-results__empty">{t("search.empty")}</p>
            ) : (
              <ul className="search-results__list">
                {results.map((product) => {
                  const discount = discountPercent(
                    product.price,
                    product.oldPrice,
                  );
                  const name = localizeProductName(product, locale);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.id}`}
                        className="search-hit"
                        onClick={onClose}
                      >
                        <span className="search-hit__img">
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="56px"
                            className="search-hit__photo"
                          />
                        </span>
                        <span className="search-hit__body">
                          <span className="search-hit__name">
                            {highlightName(name, query)}
                          </span>
                          <span className="search-hit__price">
                            <span>{formatPrice(product.price, locale)}</span>
                            {product.oldPrice != null && (
                              <s>{formatPrice(product.oldPrice, locale)}</s>
                            )}
                            {discount != null && (
                              <em className="search-hit__sale">-{discount}%</em>
                            )}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
