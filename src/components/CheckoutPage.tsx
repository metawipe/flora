"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { cartItemLabel, useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";
import { ChevronLeftIcon } from "./Icons";
import { scrollToTopInstant } from "./ScrollToTop";

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const { locale, t } = useLocale();
  const router = useRouter();
  const [done, setDone] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    t(`checkout.month${i + 1}`),
  );

  useEffect(() => {
    if (done) scrollToTopInstant();
  }, [done]);

  if (cart.length === 0 && !done) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">{t("checkout.title")}</h1>
          <div className="empty-state">
            <p className="empty-state__title">{t("checkout.empty")}</p>
            <p className="empty-state__desc">
              <Link href="/catalog/shop">{t("checkout.toCatalog")}</Link>
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
              {t("checkout.successTitle")}
            </p>
            <p className="empty-state__desc">{t("checkout.successBody")}</p>
            <Link href="/" className="btn btn--primary" style={{ marginTop: 24 }}>
              {t("checkout.toHome")}
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
    scrollToTopInstant();
    router.refresh();
  };

  return (
    <main className="page-main">
      <div className="container">
        <Link href="/cart" className="cart-back">
          <ChevronLeftIcon />
          {t("checkout.backToCart")}
        </Link>
        <h1 className="page-title">{t("checkout.title")}</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={onSubmit}>
            <section className="form-block">
              <h2>{t("checkout.contacts")}</h2>
              <label className="field">
                <span>{t("checkout.name")}</span>
                <input name="name" required placeholder={t("checkout.namePh")} />
              </label>
              <label className="field">
                <span>{t("checkout.phone")}</span>
                <input
                  name="phone"
                  required
                  placeholder="+998 __ ___ __ __"
                  defaultValue="+998 "
                />
              </label>
              <label className="field">
                <span>{t("checkout.comment")}</span>
                <textarea
                  name="comment"
                  rows={3}
                  placeholder={t("checkout.commentPh")}
                />
              </label>
            </section>

            <section className="form-block">
              <h2>{t("checkout.delivery")}</h2>
              <label className="field">
                <span>{t("checkout.address")}</span>
                <input
                  name="address"
                  required
                  placeholder={t("checkout.addressPh")}
                />
              </label>
              <label className="field">
                <span>{t("checkout.date")}</span>
                <div className="date-md">
                  <select
                    name="day"
                    required
                    defaultValue=""
                    aria-label={t("checkout.day")}
                  >
                    <option value="" disabled>
                      {t("checkout.day")}
                    </option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="month"
                    required
                    defaultValue=""
                    aria-label={t("checkout.month")}
                  >
                    <option value="" disabled>
                      {t("checkout.month")}
                    </option>
                    {months.map((label, i) => (
                      <option key={label} value={i + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="hidden"
                    name="year"
                    value={new Date().getFullYear()}
                  />
                </div>
              </label>
            </section>

            <section className="form-block">
              <h2>{t("checkout.payment")}</h2>
              <div className="pay-options">
                <label className="pay-option">
                  <input type="radio" name="pay" defaultChecked />
                  <span>{t("checkout.payOnline")}</span>
                </label>
                <label className="pay-option">
                  <input type="radio" name="pay" />
                  <span>{t("checkout.payCash")}</span>
                </label>
              </div>
            </section>

            <button type="submit" className="btn btn--primary btn--wide">
              {t("checkout.submit", {
                price: formatPrice(cartTotal, locale),
              })}
            </button>
          </form>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <h2 className="cart-summary__title">{t("checkout.yourOrder")}</h2>
              {cart.map((item) => (
                <div key={item.id} className="cart-summary__row">
                  <span>
                    {cartItemLabel(item, locale)} × {item.qty}
                  </span>
                  <span>{formatPrice(item.price * item.qty, locale)}</span>
                </div>
              ))}
              <div className="cart-summary__total">
                <span>{t("checkout.total")}</span>
                <strong>{formatPrice(cartTotal, locale)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
