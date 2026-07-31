"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { HeartIcon, TrashIcon } from "./Icons";

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
  const [promo, setPromo] = useState("");

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
              <Link href="/">Нажмите здесь</Link>, чтобы продолжить покупки
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
                      <span className="basket-card__size">{item.size}</span>
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
                <span>Итого</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <label className="promo-field">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Есть промокод или сертификат?"
                />
                <button type="button" aria-label="Применить">
                  →
                </button>
              </label>

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
