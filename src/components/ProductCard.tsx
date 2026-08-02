"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type MouseEvent, type TouchEvent } from "react";
import { useStore } from "@/context/StoreContext";
import {
  formatPrice,
  isFlowerProduct,
  localizeProductName,
  packagingOptions,
  type Product,
} from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";
import { HeartIcon, PlusIcon } from "./Icons";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

function localizeBadge(badge: string, t: (key: string) => string): string {
  const key = `badge.${badge}`;
  const label = t(key);
  return label === key ? badge : label;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { isFavorite, toggleFavorite, addToCart } = useStore();
  const { locale, t } = useLocale();
  const [imgIndex, setImgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const touchX = useRef<number | null>(null);
  const images = product.images.length ? product.images : [""];
  const favorited = isFavorite(product.id);
  const name = localizeProductName(product, locale);
  const unavailable = product.available === false;

  const onQuickAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (unavailable) return;
    const flower = isFlowerProduct(product);
    const pack =
      packagingOptions(locale).find((p) => p.id === "none") ??
      packagingOptions(locale)[0];
    const size = flower ? pack.label : "—";
    addToCart(product, size, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null || images.length < 2) return;
    const x = e.changedTouches[0]?.clientX ?? touchX.current;
    const dx = x - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 36) return;
    setImgIndex((i) =>
      dx < 0
        ? Math.min(images.length - 1, i + 1)
        : Math.max(0, i - 1),
    );
    setLoaded(false);
  };

  return (
    <article
      className={`product-card product-card--motion${compact ? " product-card--compact" : ""}${unavailable ? " is-unavailable" : ""}`}
    >
      <div
        className="product-card__media"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!loaded && (
          <span className="skel skel--fill skel--media" aria-hidden />
        )}
        <Link
          href={`/product/${product.id}`}
          className="product-card__link"
          draggable={false}
        >
          <Image
            src={images[imgIndex]}
            alt={name}
            fill
            draggable={false}
            className={`product-card__img${loaded ? " is-loaded" : ""}`}
            sizes={compact ? "160px" : "(max-width: 700px) 50vw, 25vw"}
            onLoad={() => setLoaded(true)}
          />
        </Link>

        {unavailable && (
          <span className="product-card__stock">{t("badge.outOfStock")}</span>
        )}

        {product.badge && !unavailable && (
          <span className="product-card__badge">
            {localizeBadge(product.badge, t)}
          </span>
        )}

        <button
          type="button"
          className={`product-card__fav${favorited ? " is-active" : ""}`}
          aria-label={favorited ? t("pdp.favorited") : t("pdp.favorite")}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
        >
          <HeartIcon filled={favorited} />
        </button>

        {!unavailable && (
          <button
            type="button"
            className={`product-card__add${justAdded ? " is-added" : ""}`}
            aria-label={t("pdp.add")}
            onClick={onQuickAdd}
          >
            <PlusIcon />
          </button>
        )}

        {!compact && images.length > 1 && (
          <div className="product-card__dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`product-card__dot${i === imgIndex ? " is-active" : ""}`}
                aria-label={t("pdp.photoN", { n: i + 1 })}
                onClick={() => {
                  setImgIndex(i);
                  setLoaded(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card__info">
        <Link href={`/product/${product.id}`} className="product-card__name">
          {name}
        </Link>
        <div className="product-card__price">
          {formatPrice(product.price, locale)}
          {product.oldPrice != null && (
            <span className="product-card__old">
              {formatPrice(product.oldPrice, locale)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
