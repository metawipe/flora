"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { HeartIcon, TrashIcon } from "./Icons";

const PROMO_CODES: Record<string, { label: string; percent: number }> = {
  LOVE10: { label: "Скидка 10%", percent: 10 },
  FLOWERS: { label: "Скидка 5%", percent: 5 },
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
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  const promo = appliedCode ? PROMO_CODES[appliedCode] : null;
  const discount = useMemo(() => {
    if (!promo) return 0;
    return Math.round((cartTotal * promo.percent) / 100);
  }, [cartTotal, promo]);
  const payable = Math.max(0, cartTotal - discount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError("Введите промокод");
      return;
    }
    if (!PROMO_CODES[code]) {
      setAppliedCode(null);
      setPromoError("Промокод не найден. Попробуйте LOVE10");
      return;
    }
    setAppliedCode(code);
    setPromoError("");
  };

  if (cart.length === 0) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">Корзина</h1>
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
            <p className="empty-state__title">Ваша корзина пуста</p>
            <p className="empty-state__desc">
              <Link href="/catalog/bouquets">Смотреть букеты</Link> или{" "}
              <Link href="/">вернуться на главную</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container cart-page">
        <h1 className="page-title">Корзина</h1>

        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <article key={item.id} className="basket-card">
                <Link
                  href={`/product/${item.productId}`}
                  className="basket-card__img"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                  />
                </Link>

                <div className="basket-card__body">
                  <div className="basket-card__top">
                    <div>
                      <Link
                        href={`/product/${item.productId}`}
                        className="basket-card__name"
                      >
                        {item.name}
                      </Link>
                      {item.size &&
                        item.size !== "—" &&
                        item.size !== "Без упаковки" && (
                          <span className="basket-card__size">{item.size}</span>
                        )}
                    </div>
                    <div className="basket-card__actions">
                      <button
                        type="button"
                        aria-label="Удалить"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        type="button"
                        aria-label="В избранное"
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
                          aria-label="Меньше"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label="Больше"
                        >
                          +
                        </button>
                      </div>
                      <p className="basket-card__unit">
                        {formatPrice(item.price)}/шт
                      </p>
                    </div>
                    <p className="basket-card__sum">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__total">
                <span>Сумма</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              {promo && (
                <div className="cart-summary__line">
                  <span>{promo.label}</span>
                  <strong>−{formatPrice(discount)}</strong>
                </div>
              )}

              <div className="cart-summary__total">
                <span>Итого</span>
                <strong>{formatPrice(payable)}</strong>
              </div>

              <label className="promo-field">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  placeholder="Промокод"
                  aria-label="Промокод"
                />
                <button type="button" onClick={applyPromo}>
                  OK
                </button>
              </label>
              {promoError && <p className="form-error">{promoError}</p>}
              {promo && !promoError && (
                <p className="cart-promo-ok">
                  Применён {appliedCode}. Скидка учтена в итоге на сайте;
                  менеджер подтвердит при оформлении.
                </p>
              )}

              <Link href="/checkout" className="btn btn--primary btn--wide">
                Перейти к оформлению
              </Link>
            </div>

            <button type="button" className="cart-clear" onClick={clearCart}>
              Очистить корзину
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
