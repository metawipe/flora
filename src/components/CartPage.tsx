"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, localizeProductName } from "@/data/products";
import type { Locale } from "@/i18n/config";
import { localizePackSize } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { HeartIcon, TrashIcon } from "./Icons";
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
    applyPromoCode,
    toggleFavorite,
    isFavorite,
    hydrated,
  } = useStore();
  const { locale, t } = useLocale();
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoError, setPromoError] = useState("");
  const nonePack = localizePackSize(locale, "none");

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError(t("cart.promoEmpty"));
      return;
    }
    const ok = await applyPromoCode(code);
    if (!ok) {
      setPromoError(t("cart.promoInvalid"));
      return;
    }
    setPromoInput(code);
    setPromoError("");
  };

  const handleClearCart = () => {
    if (!window.confirm(t("cart.clearConfirm"))) return;
    clearCart();
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">{t("cart.title")}</h1>
          <div className="empty-state empty-state--alive">
            <div className="empty-state__icon" aria-hidden>
              <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
                <path
                  d="M8 16h56l-4 40H12L8 16z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M24 16V12a12 12 0 0124 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="empty-state__title">{t("cart.empty")}</p>
            <p className="empty-state__desc">{t("cart.emptyHint")}</p>
            <Link href="/catalog/shop" className="btn btn--primary empty-state__cta">
              {t("cart.cta")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main page-main--cart">
      <div className="container cart-page">
        <h1 className="page-title">{t("cart.title")}</h1>

        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                locale={locale}
                t={t}
                nonePack={nonePack}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                removeFromCart={removeFromCart}
                setQty={setQty}
              />
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__total">
                <span>{t("cart.subtotal")}</span>
                <strong>{formatPrice(cartTotal, locale)}</strong>
              </div>

              {promoCode ? (
                <div className="cart-summary__line">
                  <span>{promoCode}</span>
                  <strong>−{formatPrice(promoDiscount, locale)}</strong>
                </div>
              ) : null}

              <div className="cart-summary__total">
                <span>{t("cart.total")}</span>
                <strong>{formatPrice(payableTotal, locale)}</strong>
              </div>

              <label className="promo-field">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  placeholder={t("cart.promo")}
                  aria-label={t("cart.promo")}
                />
                <button type="button" onClick={applyPromo}>
                  {t("cart.promoApply")}
                </button>
              </label>
              {promoError && <p className="form-error">{promoError}</p>}
              {promoCode && !promoError ? (
                <p className="cart-promo-ok">
                  {t("cart.promoApplied", { code: promoCode })}
                </p>
              ) : null}

              <Link
                href="/checkout"
                className="btn btn--primary btn--wide cart-summary__cta"
              >
                {t("cart.checkout")}
              </Link>
            </div>

            <button type="button" className="cart-clear" onClick={handleClearCart}>
              {t("cart.clear")}
            </button>
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
          {t("cart.checkout")}
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
  isFavorite,
  toggleFavorite,
  removeFromCart,
  setQty,
}: {
  item: {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    size: string;
  };
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  nonePack: string;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
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

  return (
    <article className="basket-card">
      <Link href={`/product/${item.productId}`} className="basket-card__img">
        {!loaded && <Skeleton className="skel--fill skel--media" />}
        <Image
          src={item.image}
          alt={name}
          fill
          sizes="88px"
          className={`basket-card__photo${loaded ? " is-loaded" : ""}`}
          style={{ objectFit: "cover" }}
          onLoad={() => setLoaded(true)}
        />
      </Link>

      <div className="basket-card__body">
        <div className="basket-card__top">
          <div>
            <Link
              href={`/product/${item.productId}`}
              className="basket-card__name"
            >
              {name}
            </Link>
            {showSize && (
              <span className="basket-card__size">{sizeLabel}</span>
            )}
          </div>
          <div className="basket-card__actions">
            <button
              type="button"
              aria-label={t("cart.remove")}
              onClick={() => removeFromCart(item.id)}
            >
              <TrashIcon />
            </button>
            <button
              type="button"
              aria-label={t("cart.toFavorites")}
              className={isFavorite(item.productId) ? "is-active" : undefined}
              onClick={() => toggleFavorite(item.productId)}
            >
              <HeartIcon filled={isFavorite(item.productId)} />
            </button>
          </div>
        </div>

        <div className="basket-card__bottom">
          <div className="basket-card__meta">
            <div className="qty qty--round">
              <button
                type="button"
                onClick={() => setQty(item.id, item.qty - 1)}
                aria-label={t("cart.less")}
              >
                −
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
            <p className="basket-card__unit">
              {formatPrice(item.price, locale)}
              {t("cart.perItem")}
            </p>
          </div>
          <p className="basket-card__sum">
            {formatPrice(item.price * item.qty, locale)}
          </p>
        </div>
      </div>
    </article>
  );
}
