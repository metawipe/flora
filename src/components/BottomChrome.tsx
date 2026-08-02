"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CatalogBar } from "./CatalogBar";
import { BagIcon, CatalogIcon, SearchIcon, UserIcon } from "./Icons";

type BottomChromeProps = {
  visible: boolean;
  cartCount?: number;
  onSearch: () => void;
};

export function BottomChrome({
  visible,
  cartCount = 0,
  onSearch,
}: BottomChromeProps) {
  const pathname = usePathname();
  const onCatalog =
    pathname === "/catalog/shop" || pathname.startsWith("/catalog/shop/");
  const onCart = pathname === "/cart" || pathname.startsWith("/cart/");
  const onAccount =
    pathname === "/account" || pathname.startsWith("/account/");

  return (
    <div
      className={`bottom-chrome${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
      {...(!visible ? { inert: true } : {})}
    >
      <CatalogBar className="catalog-bar--dock" />
      <nav className="bottom-nav" aria-label="Быстрая навигация">
        <Link
          href="/catalog/shop"
          className={`bottom-nav__tab${onCatalog ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <CatalogIcon />
          </span>
          <span className="bottom-nav__label">Каталог</span>
        </Link>

        <Link
          href="/cart"
          className={`bottom-nav__tab${onCart ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <BagIcon />
            {cartCount > 0 && (
              <span className="bottom-nav__count">{cartCount}</span>
            )}
          </span>
          <span className="bottom-nav__label">Корзина</span>
        </Link>

        <button
          type="button"
          className="bottom-nav__tab"
          onClick={onSearch}
        >
          <span className="bottom-nav__icon">
            <SearchIcon />
          </span>
          <span className="bottom-nav__label">Поиск</span>
        </button>

        <Link
          href="/account"
          className={`bottom-nav__tab${onAccount ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <UserIcon />
          </span>
          <span className="bottom-nav__label">Профиль</span>
        </Link>
      </nav>
    </div>
  );
}
