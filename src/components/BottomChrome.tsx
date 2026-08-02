"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/LocaleProvider";
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
  const t = useT();
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
      <nav className="bottom-nav" aria-label={t("bottomNav.aria")}>
        <Link
          href="/catalog/shop"
          className={`bottom-nav__tab${onCatalog ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <CatalogIcon />
          </span>
          <span className="bottom-nav__label">{t("bottomNav.catalog")}</span>
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
          <span className="bottom-nav__label">{t("bottomNav.cart")}</span>
        </Link>

        <button
          type="button"
          className="bottom-nav__tab"
          onClick={onSearch}
        >
          <span className="bottom-nav__icon">
            <SearchIcon />
          </span>
          <span className="bottom-nav__label">{t("bottomNav.search")}</span>
        </button>

        <Link
          href="/account"
          className={`bottom-nav__tab${onAccount ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <UserIcon />
          </span>
          <span className="bottom-nav__label">{t("bottomNav.profile")}</span>
        </Link>
      </nav>
    </div>
  );
}
