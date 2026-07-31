"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [done, setDone] = useState(false);

  if (cart.length === 0 && !done) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">Оформление заказа</h1>
          <div className="empty-state">
            <p className="empty-state__title">Корзина пуста</p>
            <p className="empty-state__desc">
              <Link href="/catalog/bukety">Перейти в каталог</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="page-main">
        <div className="container">
          <div className="empty-state">
            <p className="empty-state__title" style={{ color: "#000" }}>
              Заказ оформлен
            </p>
            <p className="empty-state__desc">
              Мы свяжемся с вами в ближайшее время.
            </p>
            <Link href="/" className="btn btn--primary" style={{ marginTop: 24 }}>
              На главную
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    clearCart();
    setDone(true);
    router.refresh();
  };

  return (
    <main className="page-main">
      <div className="container">
        <Link href="/cart" className="cart-back">
          ← Вернуться в корзину
        </Link>
        <h1 className="page-title">Оформление заказа</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={onSubmit}>
            <section className="form-block">
              <h2>Контакты</h2>
              <label className="field">
                <span>Имя *</span>
                <input name="name" required placeholder="Как к вам обращаться" />
              </label>
              <label className="field">
                <span>Телефон *</span>
                <input
                  name="phone"
                  required
                  placeholder="+998 __ ___ __ __"
                  defaultValue="+998 "
                />
              </label>
              <label className="field">
                <span>Комментарий</span>
                <textarea name="comment" rows={3} placeholder="Пожелания к заказу" />
              </label>
            </section>

            <section className="form-block">
              <h2>Доставка</h2>
              <label className="field">
                <span>Адрес *</span>
                <input name="address" required placeholder="Город, улица, дом" />
              </label>
              <label className="field">
                <span>Дата доставки</span>
                <div className="date-md">
                  <select name="day" required defaultValue="" aria-label="День">
                    <option value="" disabled>
                      День
                    </option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select name="month" required defaultValue="" aria-label="Месяц">
                    <option value="" disabled>
                      Месяц
                    </option>
                    {[
                      "Январь",
                      "Февраль",
                      "Март",
                      "Апрель",
                      "Май",
                      "Июнь",
                      "Июль",
                      "Август",
                      "Сентябрь",
                      "Октябрь",
                      "Ноябрь",
                      "Декабрь",
                    ].map((label, i) => (
                      <option key={label} value={i + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input type="hidden" name="year" value={new Date().getFullYear()} />
                </div>
              </label>
            </section>

            <section className="form-block">
              <h2>Оплата</h2>
              <div className="pay-options">
                <label className="pay-option">
                  <input type="radio" name="pay" defaultChecked />
                  <span>Онлайн (Uzcard / Humo / Visa)</span>
                </label>
                <label className="pay-option">
                  <input type="radio" name="pay" />
                  <span>Наличными курьеру</span>
                </label>
              </div>
            </section>

            <button type="submit" className="btn btn--primary btn--wide">
              Подтвердить заказ · {formatPrice(cartTotal)}
            </button>
          </form>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <h2 className="cart-summary__title">Ваш заказ</h2>
              {cart.map((item) => (
                <div key={item.id} className="cart-summary__row">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="cart-summary__total">
                <span>Итого</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
