"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { allProducts, type Product } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";
import { AccountSidebar } from "./AccountSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./Skeleton";

export function FavoritesPage() {
  const { favorites, hydrated } = useStore();
  const t = useT();
  const [catalog, setCatalog] = useState<Product[]>(allProducts);

  useEffect(() => {
    void fetch("/api/products")
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (Array.isArray(data.products) && data.products.length) {
          setCatalog(data.products);
        }
      })
      .catch(() => {
        /* keep mock fallback */
      });
  }, []);

  const items = useMemo(
    () => catalog.filter((p) => favorites.has(p.id)),
    [catalog, favorites],
  );

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("account.title"), href: "/account" },
            { label: t("favorites.title") },
          ]}
        />
        <h1 className="page-title">{t("favorites.title")}</h1>

        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            {!hydrated ? (
              <ProductGridSkeleton count={4} />
            ) : items.length === 0 ? (
              <div className="empty-state empty-state--alive empty-state--compact">
                <div className="empty-state__icon" aria-hidden>
                  <HeartIcon />
                </div>
                <p className="empty-state__title">{t("favorites.empty")}</p>
                <p className="empty-state__desc">{t("favorites.emptyHint")}</p>
                <Link
                  href="/catalog/shop"
                  className="btn btn--primary empty-state__cta"
                >
                  {t("favorites.cta")}
                </Link>
              </div>
            ) : (
              <div className="product-grid product-grid--fav">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
