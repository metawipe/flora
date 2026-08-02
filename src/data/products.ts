import type { Locale } from "@/i18n/config";
import {
  tCategoryLabel,
  tCategorySlug,
  tPackLabel,
  tProductName,
} from "@/i18n/catalog";
import { translate } from "@/i18n/messages";
import mock from "./mock.json";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  images: string[];
  category?: string;
  description?: string;
  /** false = out of stock / hidden from shop */
  available?: boolean;
};

export type Collection = {
  id: string;
  name: string;
  image: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  image: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export const BOUQUET_SIZES = ["S", "M", "L"] as const;

export const site = mock.site;
export const nav: NavItem[] = mock.nav;
export const tickerItems: string[] = mock.ticker;
export const heroSlides: HeroSlide[] = mock.hero;

/** Seasonal full-bleed product shot — swap image/product when the season changes */
export const seasonalHero = {
  image: "/hero/seasonal.jpg",
  alt: "Букет «Кремовый шик»",
  productHref: "/product/lf-kremovyy-shik",
  line: "Букеты с доставкой по Ташкенту",
  note: "Бесплатная доставка по городу · 24/7",
  ctaLabel: "Смотреть букеты",
  ctaHref: "/catalog/bouquets",
};
export const collections: Collection[] = mock.categories;
export const bouquets: Product[] = mock.bouquets;
export const plants: Product[] = mock.plants;
export const vipProducts: Product[] = mock.vip;
export const flowerBoxes: Product[] = mock.boxes ?? [];
export const flowerBaskets: Product[] = mock.baskets ?? [];
export const footerLinks = mock.footer;

export const allProducts: Product[] = [
  ...bouquets,
  ...plants,
  ...vipProducts,
  ...flowerBoxes,
  ...flowerBaskets,
];

/** Live catalog from admin store on the server; falls back to mock on client. */
export function getCatalogProducts(opts?: {
  includeUnavailable?: boolean;
}): Product[] {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { listProducts } = require("@/lib/store/catalogDb") as typeof import("@/lib/store/catalogDb");
      return listProducts({
        includeUnavailable: opts?.includeUnavailable ?? false,
      });
    } catch {
      /* fall through */
    }
  }
  const list = allProducts;
  if (opts?.includeUnavailable) return list;
  return list.filter((p) => p.available !== false);
}

function uniqueProducts(list: Product[]): Product[] {
  const seen = new Set<string>();
  return list.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

function buildCategoryMap(
  products: Product[],
): Record<string, { title: string; products: Product[] }> {
  const byCat = (cat: string) =>
    products.filter((p) => (p.category || "bouquets") === cat);
  const tulips = products.filter((p) =>
    /тюльпан|tulip|lola/i.test(p.name),
  );
  const mixed = products.filter(
    (p) =>
      (p.category === "plants" || p.category === "mixed") &&
      !/тюльпан|tulip|lola/i.test(p.name),
  );
  const bouquets = byCat("bouquets");
  const roses = byCat("roses");
  const boxes = byCat("boxes");
  const baskets = byCat("baskets");
  const plants = byCat("plants");
  const hits = products.filter((p) => p.badge === "HIT" || p.badge === "VIP");
  const saleItems = products.filter((p) => p.oldPrice || p.badge === "SALE");

  return {
    bouquets: { title: "Букеты", products: bouquets },
    roses: { title: "Розы", products: roses },
    tulips: { title: "Тюльпаны", products: tulips },
    mixed: {
      title: "Цветы разные",
      products: mixed.length ? mixed : plants,
    },
    plants: { title: "Растения", products: plants },
    boxes: { title: "Цветы в коробке", products: boxes },
    baskets: { title: "Корзины с цветами", products: baskets },
    popular: {
      title: "Популярное",
      products: uniqueProducts([
        ...bouquets.slice(0, 6),
        ...roses.slice(0, 4),
        ...baskets.slice(0, 4),
        ...boxes.slice(0, 4),
      ]),
    },
    sale: {
      title: "Акции",
      products: saleItems,
    },
    /** Occasion catalogs — curated mixes, not aliases of flower types */
    "occasion-birthday": {
      title: "День рождения",
      products: uniqueProducts([
        ...hits,
        ...bouquets.slice(0, 8),
        ...boxes.slice(0, 4),
        ...baskets.slice(0, 3),
      ]),
    },
    "occasion-love": {
      title: "Любимой",
      products: uniqueProducts([
        ...roses,
        ...boxes.slice(0, 5),
        ...bouquets.filter((_, i) => i % 2 === 0).slice(0, 6),
      ]),
    },
    "occasion-sorry": {
      title: "Извинения",
      products: uniqueProducts([
        ...tulips,
        ...mixed.slice(0, 6),
        ...bouquets.slice(2, 8),
        ...plants.slice(0, 4),
      ]),
    },
    "occasion-date": {
      title: "Свидание",
      products: uniqueProducts([
        ...boxes,
        ...roses.slice(0, 6),
        ...bouquets.slice(0, 5),
      ]),
    },
    "occasion-thanks": {
      title: "Спасибо",
      products: uniqueProducts([
        ...baskets,
        ...plants.slice(0, 6),
        ...boxes.slice(0, 4),
        ...bouquets.slice(4, 10),
      ]),
    },
    "occasion-sale": {
      title: "Акции",
      products: saleItems.length
        ? saleItems
        : uniqueProducts([...hits, ...roses.slice(0, 4), ...bouquets.slice(0, 4)]),
    },
    shop: { title: "Магазин", products },
    catalog: { title: "Магазин", products },
  };
}

export function getCategory(slug: string) {
  const map = buildCategoryMap(getCatalogProducts());
  return map[slug] ?? null;
}

export function getCategoryLocalized(slug: string, locale: Locale) {
  const cat = getCategory(slug);
  if (!cat) return null;
  return {
    ...cat,
    title: tCategorySlug(locale, slug, cat.title),
  };
}

export function localizeProductName(
  product: Pick<Product, "id" | "name">,
  locale: Locale,
): string {
  return tProductName(locale, product.id, product.name);
}

export function getProductById(id: string): Product | undefined {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getStoreProduct } = require("@/lib/store/catalogDb") as typeof import("@/lib/store/catalogDb");
      const live = getStoreProduct(id);
      if (live) return live;
    } catch {
      /* fall through */
    }
  }
  return allProducts.find((p) => p.id === id);
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function relatedBucket(product: Product): string {
  return `flower:${product.category || "bouquets"}`;
}

/** Score how well `candidate` pairs with `base` for “bought together”. */
function scoreRelatedPair(base: Product, candidate: Product): number {
  if (candidate.id === base.id) return Number.NEGATIVE_INFINITY;

  const ratio = candidate.price / Math.max(base.price, 1);
  const priceCloseness = Math.max(0, 28 - Math.abs(Math.log(ratio || 1)) * 18);
  let score = 18;

  if (candidate.category === base.category) score += 28;
  else if (
    (base.category === "bouquets" && candidate.category === "boxes") ||
    (base.category === "boxes" && candidate.category === "bouquets") ||
    (base.category === "roses" && candidate.category === "bouquets") ||
    (base.category === "baskets" && candidate.category === "bouquets")
  ) {
    score += 16;
  }
  score += priceCloseness;
  if (candidate.badge === "HIT") score += 6;
  if (candidate.oldPrice) score += 4;

  // Stable per-product jitter so rankings differ across PDPs
  score += (hashSeed(`${base.id}::${candidate.id}`) % 1000) / 1000 * 14;
  return score;
}

export function getRelated(product: Product, limit = 4): Product[] {
  const pool = getCatalogProducts().filter((p) => p.available !== false);
  const ranked = pool
    .map((candidate) => ({
      candidate,
      score: scoreRelatedPair(product, candidate),
    }))
    .filter((row) => Number.isFinite(row.score))
    .sort((a, b) => b.score - a.score);

  const picked: Product[] = [];
  const seenBuckets = new Set<string>();

  for (const { candidate } of ranked) {
    if (picked.length >= limit) break;
    const bucket = relatedBucket(candidate);
    if (seenBuckets.has(bucket) && seenBuckets.size < Math.min(3, limit)) {
      continue;
    }
    picked.push(candidate);
    seenBuckets.add(bucket);
  }

  if (picked.length < limit) {
    for (const { candidate } of ranked) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.id === candidate.id)) continue;
      picked.push(candidate);
    }
  }

  return picked;
}

export function categoryPath(category?: string): string {
  switch (category) {
    case "roses":
      return "/catalog/roses";
    case "plants":
      return "/catalog/mixed";
    case "boxes":
      return "/catalog/boxes";
    case "baskets":
      return "/catalog/baskets";
    case "bouquets":
    default:
      return "/catalog/bouquets";
  }
}

export function categoryLabel(category?: string, locale: Locale = "ru"): string {
  const fallback = (() => {
    switch (category) {
      case "roses":
        return "Розы";
      case "plants":
        return "Цветы разные";
      case "boxes":
        return "Цветы в коробке";
      case "baskets":
        return "Корзины с цветами";
      case "bouquets":
      default:
        return "Букеты";
    }
  })();
  return tCategoryLabel(locale, category, fallback);
}

export function isFlowerProduct(_product: Product): boolean {
  return true;
}

export const PACKAGING_OPTIONS = [
  { id: "none", label: "Без упаковки", price: 0 },
  { id: "ribbon", label: "Атласная лента", price: 10000 },
  { id: "film", label: "Пленка", price: 20000 },
  { id: "kraft", label: "Крафт", price: 30000 },
  { id: "net", label: "Сетка", price: 25000 },
  { id: "matte", label: "Пленка матовая", price: 20000 },
] as const;

export function packagingOptions(locale: Locale = "ru") {
  return PACKAGING_OPTIONS.map((opt) => ({
    ...opt,
    label: tPackLabel(locale, opt.id, opt.label),
  }));
}

export function productCategories(
  product: Product,
  locale: Locale = "ru",
): { label: string; href: string }[] {
  const cats: { label: string; href: string }[] = [];
  if (product.oldPrice || product.badge === "SALE") {
    cats.push({
      label: translate(locale, "category.sale"),
      href: "/catalog/sale",
    });
  }
  if (
    product.badge === "HIT" ||
    product.category === "roses" ||
    product.category === "bouquets"
  ) {
    cats.push({
      label: translate(locale, "category.popular"),
      href: "/catalog/popular",
    });
  }
  cats.push({
    label: categoryLabel(product.category, locale),
    href: categoryPath(product.category),
  });
  return cats;
}

export function getProductDetails(product: Product, locale: Locale = "ru") {
  const name = localizeProductName(product, locale);

  return {
    isFlower: true as const,
    description:
      product.description ||
      translate(locale, "product.flowerFallback", { name }),
    notice:
      product.category === "roses" || /51|101|vip/i.test(product.name)
        ? translate(locale, "product.vipNotice")
        : null,
  };
}

export function formatPrice(price: number, locale: Locale = "ru"): string {
  const numberLocale =
    locale === "en" ? "en-US" : locale === "uz" ? "uz-UZ" : "ru-RU";
  return (
    new Intl.NumberFormat(numberLocale).format(price) +
    " " +
    translate(locale, "price.suffix")
  );
}

export function sizePrice(base: number, size: string): number {
  if (size === "S") return Math.round(base * 0.85);
  if (size === "L") return Math.round(base * 1.25);
  return base;
}

export function nearestDeliveryText(
  date = new Date(),
  locale: Locale = "ru",
): string {
  const day = date.getDate();
  const month = translate(locale, `delivery.gen${date.getMonth() + 1}`);
  const year = date.getFullYear();
  return translate(locale, "delivery.nearest", { day, month, year });
}
