"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/LocaleProvider";
import { badgeCount } from "@/lib/badgeCount";
import {
  BagIcon,
  CatalogIcon,
  HeartIcon,
  HomeIcon,
  UserIcon,
} from "./Icons";

type BottomChromeProps = {
  cartCount?: number;
  favCount?: number;
};

export function BottomChrome({
  cartCount = 0,
  favCount = 0,
}: BottomChromeProps) {
  const pathname = usePathname();
  const t = useT();
  const onHome = pathname === "/";
  const onCatalog = pathname.startsWith("/catalog");
  const onFavorites = pathname.startsWith("/favorites");
  const onCart = pathname === "/cart" || pathname.startsWith("/cart/");
  const onAccount =
    pathname === "/account" || pathname.startsWith("/account/");
  const cartLabel = badgeCount(cartCount);
  const favLabel = badgeCount(favCount);

  return (
    <div className="bottom-chrome is-visible" aria-hidden={false}>
      <nav className="bottom-nav bottom-nav--5" aria-label={t("bottomNav.aria")}>
        <Link
          href="/"
          className={`bottom-nav__tab${onHome ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <HomeIcon />
          </span>
          <span className="bottom-nav__label">{t("bottomNav.home")}</span>
        </Link>

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
            {cartLabel && (
              <span className="bottom-nav__count">{cartLabel}</span>
            )}
          </span>
          <span className="bottom-nav__label">{t("bottomNav.cart")}</span>
        </Link>

        <Link
          href="/favorites"
          className={`bottom-nav__tab${onFavorites ? " is-active" : ""}`}
        >
          <span className="bottom-nav__icon">
            <HeartIcon />
            {favLabel && (
              <span className="bottom-nav__count">{favLabel}</span>
            )}
          </span>
          <span className="bottom-nav__label">{t("bottomNav.favorites")}</span>
        </Link>

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
