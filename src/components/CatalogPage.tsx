"use client";

import Image from "next/image";
import Link from "next/link";
import {
  collections,
  getCategory,
  getCategoryLocalized,
} from "@/data/products";
import { tCategoryByHref } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumbs } from "./Breadcrumbs";
import { ChevronRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

const SHOP_SLUGS = new Set(["shop", "catalog"]);

export function CatalogPage({ slug }: { slug: string }) {
  const { locale, t } = useLocale();
  const isShop = SHOP_SLUGS.has(slug);
  const category = isShop ? null : getCategory(slug);
  const localized = isShop ? null : getCategoryLocalized(slug, locale);

  if (!isShop && !category) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">{t("catalog.notFound")}</h1>
        </div>
      </main>
    );
  }

  if (isShop) {
    return (
      <main className="page-main page-main--catalog">
        <div className="container catalog-app">
          <header className="catalog-app__head">
            <p className="catalog-app__eyebrow">{t("bottomNav.catalog")}</p>
            <h1 className="catalog-app__title">{t("catalog.shopTitle")}</h1>
            <p className="catalog-app__meta">
              {t("catalog.sections", { n: collections.length })}
            </p>
          </header>

          <nav className="catalog-list" aria-label={t("catalogBar.aria")}>
            {collections.map((item) => {
              const name = tCategoryByHref(locale, item.href, item.name);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="catalog-list__row"
                >
                  <span className="catalog-list__thumb">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="catalog-list__img"
                      sizes="72px"
                    />
                  </span>
                  <span className="catalog-list__body">
                    <span className="catalog-list__name">{name}</span>
                  </span>
                  <span className="catalog-list__chevron" aria-hidden>
                    <ChevronRightIcon />
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("common.shop"), href: "/catalog/shop" },
            { label: localized!.title },
          ]}
        />
        <h1 className="page-title">{localized!.title}</h1>
        <div className="product-grid catalog-grid">
          {category!.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
