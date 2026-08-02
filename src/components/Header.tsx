"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cartItemLabel, useStore } from "@/context/StoreContext";
import { formatPrice, site } from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ToastStack } from "./ToastStack";

type HeaderProps = {
  onSearch: () => void;
  cartCount?: number;
  favCount?: number;
};

export function Header({ onSearch, cartCount = 0, favCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const { cart, cartTotal, hydrated } = useStore();
  const { locale, t } = useLocale();
  const [miniOpen, setMiniOpen] = useState(false);
  const onCartPage = pathname === "/cart" || pathname.startsWith("/cart/");
  const showMini = hydrated && cartCount > 0 && !onCartPage;

  useEffect(() => {
    setMiniOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMiniOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo priority />

        <div className="header__actions">
          <LanguageSwitcher />
          <a
            href={site.phoneHref}
            className="header__phone"
            aria-label={site.phone}
          >
            {site.phone}
          </a>
          <button
            className="icon-btn"
            aria-label={t("header.search")}
            onClick={onSearch}
          >
            <SearchIcon />
          </button>
          <Link
            href="/account"
            className="icon-btn header__account"
            aria-label={t("header.login")}
          >
            <UserIcon />
          </Link>
          <Link
            href="/favorites"
            className="icon-btn"
            aria-label={t("header.favorites")}
          >
            <HeartIcon />
            {favCount > 0 && (
              <span className="icon-btn__count">{favCount}</span>
            )}
          </Link>

          <div className="header__cart-wrap">
            <div
              className={`header__cart-hover${miniOpen && showMini ? " is-open" : ""}`}
              onMouseEnter={() => {
                if (showMini && !onCartPage) setMiniOpen(true);
              }}
              onMouseLeave={() => setMiniOpen(false)}
            >
              <Link
                href="/cart"
                className="icon-btn header__cart"
                aria-label={t("header.cart")}
                aria-expanded={miniOpen && showMini}
              >
                <BagIcon />
                {cartCount > 0 && (
                  <span className="icon-btn__count">{cartCount}</span>
                )}
              </Link>

              {showMini && (
                <div
                  className="mini-cart"
                  role="dialog"
                  aria-label={t("header.miniCart")}
                >
                  <ul className="mini-cart__list">
                    {cart.map((item) => (
                      <li key={item.id} className="mini-cart__item">
                        <Link
                          href={`/product/${item.productId}`}
                          className="mini-cart__thumb"
                        >
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="64px"
                          />
                        </Link>
                        <div className="mini-cart__meta">
                          <p className="mini-cart__price">
                            {formatPrice(item.price * item.qty, locale)}
                          </p>
                          <Link
                            href={`/product/${item.productId}`}
                            className="mini-cart__name"
                          >
                            {cartItemLabel(item, locale)}
                            {item.qty > 1 ? ` × ${item.qty}` : ""}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mini-cart__total">
                    <span>{t("header.total")}</span>
                    <strong>{formatPrice(cartTotal, locale)}</strong>
                  </div>
                  <Link href="/cart" className="btn btn--primary btn--wide">
                    {t("header.goToCart")}
                  </Link>
                </div>
              )}
            </div>

            <ToastStack />
          </div>
        </div>
      </div>
    </header>
  );
}
