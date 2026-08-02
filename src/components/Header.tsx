"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, site } from "@/data/products";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";
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
                if (showMini && !onCartPage) setMiniOpen(true);
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
  );
}
