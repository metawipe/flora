"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback, type CSSProperties } from "react";
import {
  collections,
  formatPrice,
  getCategory,
  getCategoryLocalized,
  type Product,
} from "@/data/products";
import { tCategoryByHref } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { ChevronRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

const SHOP_SLUGS = new Set(["shop", "catalog"]);

type SortKey = "default" | "price-asc" | "price-desc";

function sortProducts(list: Product[], sort: SortKey): Product[] {
  if (sort === "default") return list;
  const next = [...list];
  next.sort((a, b) =>
    sort === "price-asc" ? a.price - b.price : b.price - a.price,
  );
  return next;
}

function parseSort(raw: string | null): SortKey {
  if (raw === "price-asc" || raw === "price-desc") return raw;
  return "default";
}

export function CatalogPage({
  slug,
  initialProducts = null,
  initialTitle = null,
}: {
  slug: string;
  initialProducts?: Product[] | null;
  initialTitle?: string | null;
}) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isShop = SHOP_SLUGS.has(slug);
  const fallback = isShop ? null : getCategory(slug);
  const category = isShop
    ? null
    : {
        title: initialTitle || fallback?.title || slug,
        products: initialProducts ?? fallback?.products ?? [],
      };
  const localized = isShop
    ? null
    : getCategoryLocalized(slug, locale) ?? {
        title: category?.title || slug,
        products: category?.products || [],
      };
  const sort = parseSort(searchParams.get("sort"));
  const maxPriceParam = searchParams.get("max");
  const maxPrice =
    maxPriceParam && Number.isFinite(Number(maxPriceParam))
      ? Number(maxPriceParam)
      : null;

  const writeParams = useCallback(
    (nextSort: SortKey, nextMax: number | null) => {
      const params = new URLSearchParams();
      if (nextSort !== "default") params.set("sort", nextSort);
      if (nextMax != null) params.set("max", String(nextMax));
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setSort = (next: SortKey) => writeParams(next, maxPrice);
  const setMaxPrice = (next: number | null) => writeParams(sort, next);

  const priceBounds = useMemo(() => {
    const products = category?.products ?? [];
    if (!products.length) return { min: 0, max: 0 };
    let min = products[0].price;
    let max = products[0].price;
    for (const p of products) {
      min = Math.min(min, p.price);
      max = Math.max(max, p.price);
    }
    return { min, max };
  }, [category]);

  const priceSpan = priceBounds.max - priceBounds.min;
  const canFilterPrice = priceSpan > 0;
  const sliderValue = maxPrice ?? priceBounds.max;
  const priceFiltered =
    canFilterPrice && maxPrice != null && maxPrice < priceBounds.max;
  const sliderPct = canFilterPrice
    ? ((sliderValue - priceBounds.min) / priceSpan) * 100
    : 100;
  const sliderStep = Math.max(
    1000,
    Math.round(priceSpan / 40) || 1000,
  );

  const filtered = useMemo(() => {
    if (!category) return [];
    let list = category.products;
    if (priceFiltered && maxPrice != null) {
      list = list.filter((p) => p.price <= maxPrice);
    }
    return sortProducts(list, sort);
  }, [category, sort, maxPrice, priceFiltered]);

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
    <main className="page-main page-main--catalog">
      <div className="container">
        <h1 className="catalog-section-title">{localized!.title}</h1>

        <div className="catalog-toolbar">
          <label className="catalog-toolbar__sort">
            <span>{t("catalog.sort")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="default">{t("catalog.sortDefault")}</option>
              <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
              <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
            </select>
          </label>

          {canFilterPrice ? (
            <div className="catalog-toolbar__price">
              <div className="catalog-toolbar__price-row">
                <span>
                  {t("catalog.priceTo")}{" "}
                  {priceFiltered
                    ? formatPrice(sliderValue, locale)
                    : t("catalog.priceAny")}
                </span>
                <button
                  type="button"
                  className={`catalog-toolbar__reset-link${priceFiltered ? " is-on" : ""}`}
                  tabIndex={priceFiltered ? 0 : -1}
                  aria-hidden={!priceFiltered}
                  onClick={() => setMaxPrice(null)}
                >
                  {t("catalog.resetFilter")}
                </button>
              </div>
              <div
                className="range-slider"
                style={{ "--range-pct": `${sliderPct}%` } as CSSProperties}
              >
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={sliderStep}
                  value={sliderValue}
                  aria-label={t("catalog.priceTo")}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setMaxPrice(next >= priceBounds.max ? null : next);
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state empty-state--compact">
            <p className="empty-state__title">{t("catalog.filterEmpty")}</p>
            <button
              type="button"
              className="btn btn--primary empty-state__cta"
              onClick={() => {
                setMaxPrice(null);
                setSort("default");
              }}
            >
              {t("catalog.resetFilter")}
            </button>
          </div>
        ) : (
          <div className="product-grid catalog-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
