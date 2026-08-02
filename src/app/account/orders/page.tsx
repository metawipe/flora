"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cartItemLabel, useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";
import type { StoredOrder } from "@/lib/orders";

export default function OrdersPage() {
  const { orders, hydrated, restoreCartItem, clearCart } = useStore();
  const { locale, t } = useLocale();
  const router = useRouter();

  const repeatOrder = (order: StoredOrder) => {
    clearCart();
    for (const item of order.items) {
      restoreCartItem({ ...item });
    }
    router.push("/cart");
  };

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("account.title"), href: "/account" },
            { label: t("orders.title") },
          ]}
        />
        <h1 className="page-title">{t("orders.title")}</h1>
        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            {!hydrated ? null : orders.length === 0 ? (
              <div className="empty-state empty-state--alive empty-state--compact">
                <div className="empty-state__icon" aria-hidden>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect
                      x="12"
                      y="10"
                      width="40"
                      height="48"
                      rx="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M22 24h20M22 34h14M22 44h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="empty-state__title">{t("orders.empty")}</p>
                <p className="empty-state__desc">{t("orders.emptyHint")}</p>
                <Link
                  href="/catalog/shop"
                  className="btn btn--primary empty-state__cta"
                >
                  {t("orders.cta")}
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <article key={order.id} className="order-card">
                    <header className="order-card__head">
                      <div>
                        <p className="order-card__id">{order.id}</p>
                        <p className="order-card__date">
                          {new Date(order.createdAt).toLocaleString(locale, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <strong className="order-card__total">
                        {formatPrice(order.total, locale)}
                      </strong>
                    </header>
                    <p className="order-card__meta">
                      {order.date} · {t(`checkout.${order.slot}`)} ·{" "}
                      {order.address}
                    </p>
                    <ul className="order-card__items">
                      {order.items.map((item) => (
                        <li key={item.id} className="order-card__item">
                          <span className="order-card__thumb">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              sizes="40px"
                            />
                          </span>
                          <span>
                            {cartItemLabel(item, locale)} × {item.qty}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="order-card__status">{t("orders.statusNew")}</p>
                    <button
                      type="button"
                      className="btn btn--ghost btn--wide"
                      onClick={() => repeatOrder(order)}
                    >
                      {t("orders.repeat")}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
