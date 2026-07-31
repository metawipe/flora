"use client";

import { useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { allProducts } from "@/data/products";
import { AccountSidebar } from "./AccountSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductCard } from "./ProductCard";

export function FavoritesPage() {
  const { favorites } = useStore();
  const items = useMemo(
    () => allProducts.filter((p) => favorites.has(p.id)),
    [favorites],
  );

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Личный кабинет", href: "/account" },
            { label: "Избранные товары" },
          ]}
        />
        <h1 className="page-title">Избранные товары</h1>

        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            {items.length === 0 ? (
              <div className="alert">Список избранных элементов пуст</div>
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
