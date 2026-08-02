"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore, type CartItem } from "@/context/StoreContext";
import {
  formatPrice,
  getProductById,
  localizeProductName,
} from "@/data/products";
import type { Locale } from "@/i18n/config";
import { localizePackSize } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { TrashIcon } from "./Icons";
import { CartSkeleton, Skeleton } from "./Skeleton";
import { StickyBar } from "./StickyBar";

export function CartPage() {
  const {
    cart,
    cartTotal,
    promoCode,
    promoDiscount,
    payableTotal,
    setQty,
    removeFromCart,
    clearCart,
    hydrated,
  } = useStore();
  const { locale, t } = useLocale();
  const nonePack = localizePackSize(locale, "none");

  const handleClearCart = () => {
    if (!window.confirm(t("cart.clearConfirm"))) return;
    clearCart();
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <main className="page-main page-main--cart">
        <div className="container cart-page">
          <div className="cart-panel cart-panel--empty">
            <h1 className="cart-panel__title">{t("cart.title")}</h1>
            <div className="empty-state empty-state--alive empty-state--compact">
              <p className="empty-state__title">{t("cart.empty")}</p>
              <p className="empty-state__desc">{t("cart.emptyHint")}</p>
              <Link
                href="/catalog/bouquets"
                className="btn btn--primary empty-state__cta"
              >
                {t("cart.cta")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main page-main--cart">
      <div className="container cart-page">
        <div className="cart-layout">
          <div className="cart-panel">
            <header className="cart-panel__head">
              <h1 className="cart-panel__title">{t("cart.title")}</h1>
              <button
                type="button"
                className="cart-panel__clear"
                onClick={handleClearCart}
              >
                <TrashIcon />
                <span>{t("cart.clear")}</span>
              </button>
            </header>

            <div className="cart-list">
              {cart.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  t={t}
                  nonePack={nonePack}
                  removeFromCart={removeFromCart}
                  setQty={setQty}
                />
              ))}
            </div>

            <Link
              href="/checkout"
              className="btn btn--primary btn--wide cart-panel__cta"
            >
              {t("cart.continue")}
            </Link>
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__row">
                <span>{t("cart.goods")}</span>
                <span>{formatPrice(cartTotal, locale)}</span>
              </div>
              <div className="cart-summary__row">
                <span>{t("cart.delivery")}</span>
                <span className="cart-summary__free">{t("cart.deliveryFree")}</span>
              </div>
              {promoCode ? (
                <div className="cart-summary__row">
                  <span>{promoCode}</span>
                  <span>−{formatPrice(promoDiscount, locale)}</span>
                </div>
              ) : null}
              <div className="cart-summary__total">
                <span>{t("cart.total")}</span>
                <strong>{formatPrice(payableTotal, locale)}</strong>
              </div>
              <p className="cart-summary__hint">{t("cart.promoLater")}</p>
            </div>
          </aside>
        </div>
      </div>

      <StickyBar className="cart-sticky">
        <div className="app-sticky-bar__meta">
          <span className="app-sticky-bar__label">{t("cart.total")}</span>
          <strong className="app-sticky-bar__price">
            {formatPrice(payableTotal, locale)}
          </strong>
        </div>
        <Link href="/checkout" className="btn btn--primary">
          {t("cart.continue")}
        </Link>
      </StickyBar>
    </main>
  );
}

function CartItemCard({
  item,
  locale,
  t,
  nonePack,
  removeFromCart,
  setQty,
}: {
  item: CartItem;
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  nonePack: string;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const product = getProductById(item.productId);
  const name = localizeProductName(
    { id: item.productId, name: item.name },
    locale,
  );
  const sizeLabel = localizePackSize(locale, item.size);
  const showSize =
    !!item.size &&
    item.size !== "—" &&
    item.size !== "Без упаковки" &&
    sizeLabel !== nonePack;
  const lineTotal = item.price * item.qty;
  const oldUnit = product?.oldPrice;
  const oldLine =
    oldUnit != null && oldUnit > item.price ? oldUnit * item.qty : null;

  return (
    <article className="basket-card">
      <Link href={`/product/${item.productId}`} className="basket-card__img">
        {!loaded && <Skeleton className="skel--fill skel--media" />}
        <Image
          src={item.image}
          alt={name}
          fill
          sizes="96px"
          className={`basket-card__photo${loaded ? " is-loaded" : ""}`}
          style={{ objectFit: "cover" }}
          onLoad={() => setLoaded(true)}
        />
      </Link>

      <div className="basket-card__body">
        <div className="basket-card__info">
          <Link
            href={`/product/${item.productId}`}
            className="basket-card__name"
          >
            {name}
          </Link>
          <span
            className={`basket-card__size${showSize ? "" : " is-empty"}`}
          >
            {showSize ? sizeLabel : "\u00a0"}
          </span>
        </div>

        <div className="basket-card__bottom">
          <div className="qty qty--cart">
            <button
              type="button"
              className="qty__trash"
              onClick={() =>
                item.qty <= 1
                  ? removeFromCart(item.id)
                  : setQty(item.id, item.qty - 1)
              }
              aria-label={
                item.qty <= 1 ? t("cart.remove") : t("cart.less")
              }
            >
              {item.qty <= 1 ? <TrashIcon /> : "−"}
            </button>
            <span>{item.qty}</span>
            <button
              type="button"
              onClick={() => setQty(item.id, item.qty + 1)}
              aria-label={t("cart.more")}
            >
              +
            </button>
          </div>

          <div className="basket-card__prices">
            <strong className="basket-card__sum">
              {formatPrice(lineTotal, locale)}
            </strong>
            <span
              className={`basket-card__old${oldLine == null ? " is-empty" : ""}`}
            >
              {oldLine != null ? formatPrice(oldLine, locale) : "\u00a0"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
