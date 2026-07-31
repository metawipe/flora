"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/products";
import { BagIcon, BoltIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";

type HeaderProps = {
  onSearch: () => void;
  cartCount?: number;
  favCount?: number;
};

export function Header({ onSearch, cartCount = 0, favCount = 0 }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
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

          <nav className="nav">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav__link">
                {item.label}
              </Link>
            ))}
            <Link href="/catalog/sale" className="sale-badge">
              <BoltIcon />
              SALE
            </Link>
          </nav>

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
            <Link href="/cart" className="icon-btn" aria-label="Корзина">
              <BagIcon />
              {cartCount > 0 && (
                <span className="icon-btn__count">{cartCount}</span>
              )}
            </Link>
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
        <nav className="mobile-menu__nav">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : "0ms" }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalog/sale"
            className="sale-badge"
            style={{
              width: "fit-content",
              transitionDelay: menuOpen ? "280ms" : "0ms",
            }}
            onClick={() => setMenuOpen(false)}
          >
            <BoltIcon />
            SALE
          </Link>
          <a
            href={site.phoneHref}
            className="mobile-menu__phone"
            style={{ transitionDelay: menuOpen ? "320ms" : "0ms" }}
          >
            {site.phone}
            <span>{site.supportNote}</span>
          </a>
        </nav>
      </div>
    </>
  );
}
