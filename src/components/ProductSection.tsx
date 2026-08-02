"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  title: string;
  href?: string;
  products: Product[];
  bottomPad?: boolean;
  /** Horizontal snap shelf on mobile (app-style) */
  shelf?: boolean;
};

export function ProductSection({
  title,
  href,
  products,
  bottomPad,
  shelf = false,
}: ProductSectionProps) {
  const { t } = useLocale();
  const list = shelf ? products.slice(0, 12) : products;
  const shelfRef = useDragScroll<HTMLDivElement>();

  const scrollShelf = (direction: -1 | 1) => {
    const el = shelfRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section
      className={`section${bottomPad ? " section--bottom" : ""}${shelf ? " section--shelf" : ""}`}
    >
      <div className="container">
        {href ? (
          <Link href={href} className="section__head">
            <h2 className="section__title">{title}</h2>
            <span className="section__arrow" aria-hidden>
              <ArrowRightIcon />
            </span>
          </Link>
        ) : (
          <div className="section__head">
            <h2 className="section__title">{title}</h2>
          </div>
        )}

        {shelf ? (
          <div className="section__shelf-wrap">
            <button
              type="button"
              className="section__shelf-btn section__shelf-btn--prev"
              aria-label={t("common.prev")}
              onClick={() => scrollShelf(-1)}
            >
              <ChevronLeftIcon />
            </button>
            <div ref={shelfRef} className="product-shelf drag-scroll">
              {list.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
            <button
              type="button"
              className="section__shelf-btn section__shelf-btn--next"
              aria-label={t("common.next")}
              onClick={() => scrollShelf(1)}
            >
              <ChevronRightIcon />
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
