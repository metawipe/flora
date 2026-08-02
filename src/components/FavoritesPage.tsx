"use client";

import { useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { allProducts } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";
import { AccountSidebar } from "./AccountSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductCard } from "./ProductCard";

export function FavoritesPage() {
  const { favorites } = useStore();
  const t = useT();
  const items = useMemo(
    () => allProducts.filter((p) => favorites.has(p.id)),
    [favorites],
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
            {items.length === 0 ? (
              <div className="alert">{t("favorites.empty")}</div>
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
