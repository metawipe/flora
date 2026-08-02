"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { cartItemLabel, useStore, type PlaceOrderInput } from "@/context/StoreContext";
import { formatPrice, site } from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  formatUzPhone,
  isValidUzPhone,
  normalizeUzPhone,
} from "@/lib/phone";
import { loadUserProfile, saveUserProfile } from "@/lib/userProfile";
import type { StoredOrder } from "@/lib/orders";
import { ChevronLeftIcon } from "./Icons";
import { scrollToTopInstant } from "./ScrollToTop";
import { StickyBar } from "./StickyBar";

const SLOTS = ["slotMorning", "slotDay", "slotEvening"] as const;

type TFn = (key: string, vars?: Record<string, string | number>) => string;

function shareT(
  t: TFn,
  key: string,
  vars: Record<string, string | number> | undefined,
  fallback: string,
) {
  const value = t(key, vars);
  return value === key ? fallback : value;
}

function orderShareText(order: StoredOrder, t: TFn, locale: string) {
  const slotLabel = t(`checkout.${order.slot}`);
  const payLabel =
    order.pay === "cash"
      ? shareT(t, "checkout.payCash", undefined, "Наличными курьеру")
      : order.pay === "card"
        ? shareT(t, "checkout.payCard", undefined, "Картой курьеру")
        : order.pay;

  return [
    shareT(t, "checkout.shareTitle", { id: order.id }, `Заказ ${order.id}`),
    shareT(
      t,
      "checkout.shareContacts",
      { name: order.name, phone: order.phone },
      `${order.name} · ${order.phone}`,
    ),
    shareT(
      t,
      "checkout.shareAddress",
      { address: order.address },
      order.address,
    ),
    shareT(
      t,
      "checkout.shareDelivery",
      { date: order.date, slot: slotLabel },
      `${order.date} · ${slotLabel}`,
    ),
    order.recipient
      ? shareT(
          t,
          "checkout.shareRecipient",
          { name: order.recipient },
          `Получатель: ${order.recipient}`,
        )
      : "",
    order.cardText
      ? shareT(
          t,
          "checkout.shareCard",
          { text: order.cardText },
          `Открытка: ${order.cardText}`,
        )
      : "",
    order.promoCode
      ? shareT(
          t,
          "checkout.sharePromo",
          { code: order.promoCode },
          `Промокод: ${order.promoCode}`,
        )
      : "",
    shareT(t, "checkout.sharePay", { pay: payLabel }, `Оплата: ${payLabel}`),
    shareT(t, "checkout.shareItems", undefined, "Товары:"),
    ...order.items.map((i) =>
      shareT(
        t,
        "checkout.shareItem",
        { name: i.name, qty: i.qty },
        `• ${i.name} × ${i.qty}`,
      ),
    ),
    shareT(
      t,
      "checkout.shareTotal",
      { total: order.total.toLocaleString(locale) },
      `Итого: ${order.total.toLocaleString(locale)} сум`,
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

function socialHref(name: string) {
  return site.socials.find((s) => s.name.toLowerCase().includes(name))?.href;
}

export function CheckoutPage() {
  const {
    cart,
    cartTotal,
    promoCode,
    promoDiscount,
    payableTotal,
    placeOrder,
    setQty,
    removeFromCart,
  } = useStore();
  const { locale, t } = useLocale();
  const router = useRouter();
  const [doneOrder, setDoneOrder] = useState<StoredOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const tg = socialHref("telegram");
  const wa = socialHref("whatsapp");

  useEffect(() => {
    const user = loadUserProfile();
    if (!user) return;
    if (user.name) setName(user.name);
    if (user.phone) setPhone(formatUzPhone(user.phone));
    if (user.address) setAddress(user.address);
  }, []);

  useEffect(() => {
    if (doneOrder) scrollToTopInstant();
  }, [doneOrder]);

  if (cart.length === 0 && !doneOrder) {
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

  if (doneOrder) {
    const share = encodeURIComponent(orderShareText(doneOrder, t, locale));
    const waHref = wa
      ? wa.includes("?")
        ? `${wa}&text=${share}`
        : `${wa}?text=${share}`
      : null;
    const tgHref = tg
      ? `https://t.me/share/url?url=${encodeURIComponent(site.phoneHref)}&text=${share}`
      : null;

    return (
      <main className="page-main">
        <div className="container">
          <div className="empty-state empty-state--alive">
            <p className="empty-state__title" style={{ color: "#000" }}>
              {t("checkout.successTitle")}
            </p>
            <p className="empty-state__desc">
              {t("checkout.successBody")}
              <br />
              {t("checkout.orderId", { id: doneOrder.id })}
            </p>
            <div className="empty-state__actions">
              {waHref ? (
                <a href={waHref} className="btn btn--primary" target="_blank" rel="noreferrer">
                  {t("checkout.sendWhatsapp")}
                </a>
              ) : null}
              {tgHref ? (
                <a href={tgHref} className="btn btn--ghost" target="_blank" rel="noreferrer">
                  {t("checkout.sendTelegram")}
                </a>
              ) : null}
              <Link href="/account/orders" className="btn btn--ghost">
                {t("checkout.toOrders")}
              </Link>
              <Link href="/" className="btn btn--ghost">
                {t("checkout.toHome")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhoneError("");
    if (!isValidUzPhone(phone)) {
      setPhoneError(t("checkout.phoneInvalid"));
      return;
    }
    const data = new FormData(e.currentTarget);
    const normalizedPhone = normalizeUzPhone(phone);
    const payload: PlaceOrderInput = {
      name: String(data.get("name") || "").trim(),
      phone: normalizedPhone,
      address: String(data.get("address") || "").trim(),
      date: String(data.get("date") || ""),
      slot: String(data.get("slot") || "slotDay"),
      pay: String(data.get("pay") || "cash"),
      comment: String(data.get("comment") || "").trim(),
      recipient: String(data.get("recipient") || "").trim() || undefined,
      cardText: String(data.get("cardText") || "").trim() || undefined,
    };

    setSubmitting(true);
    const order = await placeOrder(payload);
    setSubmitting(false);

    const existing = loadUserProfile();
    if (existing) {
      saveUserProfile({
        ...existing,
        name: order.name || existing.name,
        phone: normalizedPhone,
        address: order.address,
      });
    } else {
      saveUserProfile({
        login: normalizedPhone,
        phone: normalizedPhone,
        name: order.name,
        address: order.address,
      });
    }

    setDoneOrder(order);
    scrollToTopInstant();
    router.refresh();
  };

  return (
    <main className="page-main page-main--checkout">
      <div className="container">
        <Link href="/cart" className="cart-back">
          <ChevronLeftIcon />
          {t("checkout.backToCart")}
        </Link>
        <h1 className="page-title">{t("checkout.title")}</h1>

        <div className="checkout-layout">
          <form
            id="checkout-form"
            className="checkout-form"
            onSubmit={onSubmit}
          >
            <section className="form-block">
              <h2>{t("checkout.contacts")}</h2>
              <label className="field">
                <span>{t("checkout.name")}</span>
                <input
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("checkout.namePh")}
                  autoComplete="name"
                />
              </label>
              <label className="field">
                <span>{t("checkout.phone")}</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(formatUzPhone(e.target.value))}
                  placeholder="+998 __ ___ __ __"
                />
              </label>
              {phoneError ? <p className="form-error">{phoneError}</p> : null}
              <label className="field">
                <span>{t("checkout.recipient")}</span>
                <input
                  name="recipient"
                  placeholder={t("checkout.recipientPh")}
                />
              </label>
              <label className="field">
                <span>{t("checkout.cardText")}</span>
                <textarea
                  name="cardText"
                  rows={2}
                  placeholder={t("checkout.cardTextPh")}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("checkout.addressPh")}
                  autoComplete="street-address"
                />
              </label>
              <label className="field">
                <span>{t("checkout.date")}</span>
                <input
                  type="date"
                  name="date"
                  required
                  min={minDate}
                  defaultValue={minDate}
                />
              </label>
              <fieldset className="slot-options">
                <legend>{t("checkout.slot")}</legend>
                {SLOTS.map((slot, i) => (
                  <label key={slot} className="pay-option">
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      defaultChecked={i === 1}
                    />
                    <span>{t(`checkout.${slot}`)}</span>
                  </label>
                ))}
              </fieldset>
            </section>

            <section className="form-block">
              <h2>{t("checkout.payment")}</h2>
              <div className="pay-options">
                <label className="pay-option">
                  <input
                    type="radio"
                    name="pay"
                    value="cash"
                    defaultChecked
                  />
                  <span>{t("checkout.payCash")}</span>
                </label>
                <label className="pay-option">
                  <input type="radio" name="pay" value="card" />
                  <span>
                    {t("checkout.payCard")}
                    <small className="pay-option__hint">{t("checkout.payHint")}</small>
                  </span>
                </label>
              </div>
            </section>

            <button
              type="submit"
              className="btn btn--primary btn--wide checkout-form__cta"
            >
              {t("checkout.submit", {
                price: formatPrice(payableTotal, locale),
              })}
            </button>
          </form>

          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__head">
                <h2 className="cart-summary__title">{t("checkout.yourOrder")}</h2>
                <Link href="/cart" className="cart-summary__edit">
                  {t("checkout.editCart")}
                </Link>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="checkout-line">
                  <div className="checkout-line__meta">
                    <span>
                      {cartItemLabel(item, locale)} × {item.qty}
                    </span>
                    <strong>
                      {formatPrice(item.price * item.qty, locale)}
                    </strong>
                  </div>
                  <div className="checkout-line__tools">
                    <div className="qty qty--round qty--sm">
                      <button
                        type="button"
                        aria-label={t("cart.less")}
                        onClick={() => setQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label={t("cart.more")}
                        onClick={() => setQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="link-quiet"
                      onClick={() => removeFromCart(item.id)}
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-summary__row">
                <span>{t("cart.subtotal")}</span>
                <span>{formatPrice(cartTotal, locale)}</span>
              </div>
              {promoCode ? (
                <div className="cart-summary__row">
                  <span>{promoCode}</span>
                  <span>−{formatPrice(promoDiscount, locale)}</span>
                </div>
              ) : null}
              <div className="cart-summary__total">
                <span>{t("checkout.total")}</span>
                <strong>{formatPrice(payableTotal, locale)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <StickyBar className="checkout-sticky">
        <button
          type="submit"
          form="checkout-form"
          className="btn btn--primary btn--wide"
          disabled={submitting}
        >
          {t("checkout.submit", {
            price: formatPrice(payableTotal, locale),
          })}
        </button>
      </StickyBar>
    </main>
  );
}
