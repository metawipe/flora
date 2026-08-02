"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, localizeProductName } from "@/data/products";
import { localizePackSize } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { HeartIcon, TrashIcon } from "./Icons";

const PROMO_CODES: Record<string, { labelKey: string; percent: number }> = {
  LOVE10: { labelKey: "cart.promoLove10", percent: 10 },
  FLOWERS: { labelKey: "cart.promoFlowers", percent: 5 },
};

export function CartPage() {
  const {
    cart,
    cartTotal,
    setQty,
    removeFromCart,
    clearCart,
    toggleFavorite,
    isFavorite,
  } = useStore();
  const { locale, t } = useLocale();
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const nonePack = localizePackSize(locale, "none");

  const promo = appliedCode ? PROMO_CODES[appliedCode] : null;
  const discount = useMemo(() => {
    if (!promo) return 0;
    return Math.round((cartTotal * promo.percent) / 100);
  }, [cartTotal, promo]);
  const payable = Math.max(0, cartTotal - discount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError(t("cart.promoEmpty"));
      return;
    }
    if (!PROMO_CODES[code]) {
      setAppliedCode(null);
      setPromoError(t("cart.promoInvalid"));
      return;
    }
    setAppliedCode(code);
    setPromoError("");
  };

  if (cart.length === 0) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">{t("cart.title")}</h1>
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden>
              <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
                <path
                  d="M8 16h56l-4 40H12L8 16z"
                  stroke="#bababa"
                  strokeWidth="2"
                />
                <path
                  d="M24 16V12a12 12 0 0124 0v4"
                  stroke="#bababa"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="empty-state__title">{t("cart.empty")}</p>
            <p className="empty-state__desc">
              <Link href="/catalog/bouquets">{t("common.seeBouquets")}</Link>
              {" · "}
              <Link href="/">{t("cart.backHome")}</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container cart-page">
        <h1 className="page-title">{t("cart.title")}</h1>

        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => {
              const name = localizeProductName(
                { id: item.productId, name: item.name },
                locale,
              );
              const sizeLabel = localizePackSize(locale, item.size);
              const showSize =
                item.size &&
                item.size !== "—" &&
                item.size !== "Без упаковки" &&
                sizeLabel !== nonePack;

              return (
                <article key={item.id} className="basket-card">
                  <Link
                    href={`/product/${item.productId}`}
                    className="basket-card__img"
                  >
                    <Image src={item.image} alt={name} fill sizes="96px" />
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
                          className={
                            isFavorite(item.productId) ? "is-active" : undefined
                          }
                          onClick={() => toggleFavorite(item.productId)}
                        >
                          <HeartIcon filled={isFavorite(item.productId)} />
                        </button>
                      </div>
                    </div>

                    <div className="basket-card__bottom">
                      <div>
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
            })}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__total">
                <span>{t("cart.subtotal")}</span>
                <strong>{formatPrice(cartTotal, locale)}</strong>
              </div>

              {promo && (
                <div className="cart-summary__line">
                  <span>{t(promo.labelKey)}</span>
                  <strong>−{formatPrice(discount, locale)}</strong>
                </div>
              )}

              <div className="cart-summary__total">
                <span>{t("cart.total")}</span>
                <strong>{formatPrice(payable, locale)}</strong>
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
                  OK
                </button>
              </label>
              {promoError && <p className="form-error">{promoError}</p>}
              {promo && !promoError && (
                <p className="cart-promo-ok">
                  {t("cart.promoOk", { code: appliedCode ?? "" })}
                </p>
              )}

              <Link href="/checkout" className="btn btn--primary btn--wide">
                {t("cart.checkout")}
              </Link>
            </div>

            <button type="button" className="cart-clear" onClick={clearCart}>
              {t("cart.clear")}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
