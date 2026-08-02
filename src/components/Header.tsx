"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, site } from "@/data/products";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";
import { ToastStack } from "./ToastStack";

type HeaderProps = {
  onSearch: () => void;
  cartCount?: number;
  favCount?: number;
};

export function Header({ onSearch, cartCount = 0, favCount = 0 }: HeaderProps) {
  const { cart, cartTotal, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  const showMini = hydrated && cartCount > 0;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMiniOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <button
            className={`burger${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Закрыть меню" : "Меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/" className="logo">
            {site.name}
          </Link>

          <div className="header__actions">
            <a
              href={site.phoneHref}
              className="header__phone"
              aria-label={site.phone}
            >
              {site.phone}
            </a>
            <button className="icon-btn" aria-label="Поиск" onClick={onSearch}>
              <SearchIcon />
            </button>
            <Link
              href="/account"
              className="icon-btn header__account"
              aria-label="Войти"
            >
              <UserIcon />
            </Link>
            <Link href="/favorites" className="icon-btn" aria-label="Избранное">
              <HeartIcon />
              {favCount > 0 && (
                <span className="icon-btn__count">{favCount}</span>
              )}
            </Link>

            <div className="header__cart-wrap">
              <div
                className={`header__cart-hover${miniOpen && showMini ? " is-open" : ""}`}
                onMouseEnter={() => {
                  if (showMini) setMiniOpen(true);
                }}
                onMouseLeave={() => setMiniOpen(false)}
              >
                <Link
                  href="/cart"
                  className="icon-btn header__cart"
                  aria-label="Корзина"
                  aria-expanded={miniOpen && showMini}
                >
                  <BagIcon />
                  {cartCount > 0 && (
                    <span className="icon-btn__count">{cartCount}</span>
                  )}
                </Link>

                {showMini && (
                  <div className="mini-cart" role="dialog" aria-label="Мини-корзина">
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
                              {formatPrice(item.price * item.qty)}
                            </p>
                            <Link
                              href={`/product/${item.productId}`}
                              className="mini-cart__name"
                            >
                              {item.name}
                              {item.size &&
                              item.size !== "—" &&
                              item.size !== "Без упаковки"
                                ? ` - ${item.size}`
                                : ""}
                              {item.qty > 1 ? ` × ${item.qty}` : ""}
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mini-cart__total">
                      <span>Итого</span>
                      <strong>{formatPrice(cartTotal)}</strong>
                    </div>
                    <Link href="/cart" className="btn btn--primary btn--wide">
                      Перейти в корзину
                    </Link>
                  </div>
                )}
              </div>

              <ToastStack />
            </div>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu-backdrop${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <div
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
      >
        <div className="mobile-menu__top">
          <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
            {site.name}
          </Link>
          <button
            className="mobile-menu__close"
            aria-label="Закрыть"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="mobile-menu__contacts">
          <h2 className="mobile-menu__contacts-title">Наши контакты</h2>
          <dl className="mobile-menu__contacts-list">
            <div>
              <dt>Адрес</dt>
              <dd>{site.address}</dd>
            </div>
            <div>
              <dt>Телефоны</dt>
              <dd>
                <a href={site.phoneHref}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>Режим работы</dt>
              <dd>
                {site.hours === "круглосуточно" ? "Круглосуточно" : site.hours}
              </dd>
            </div>
          </dl>

          <div className="mobile-menu__contacts-actions">
            {site.socials.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="btn btn--ghost"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
