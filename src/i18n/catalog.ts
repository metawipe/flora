import type { Locale } from "./config";
import { translate } from "./messages";
import { productName } from "./productNames";

const NAV_BY_HREF: Record<string, string> = {
  "/": "nav.home",
  "/catalog/popular": "nav.popular",
  "/catalog/roses": "nav.roses",
  "/catalog/tulips": "nav.tulips",
  "/catalog/bouquets": "nav.bouquets",
  "/catalog/mixed": "nav.mixed",
  "/catalog/boxes": "nav.boxes",
  "/catalog/baskets": "nav.baskets",
};

const CATEGORY_BY_HREF: Record<string, string> = {
  "/catalog/roses": "category.roses",
  "/catalog/tulips": "category.tulips",
  "/catalog/bouquets": "category.bouquets",
  "/catalog/mixed": "category.mixed",
  "/catalog/boxes": "category.boxes",
  "/catalog/baskets": "category.baskets",
  "/catalog/popular": "category.popular",
  "/catalog/sale": "category.sale",
  "/catalog/shop": "category.shop",
  "/catalog/occasion-birthday": "home.occasionBirthday",
  "/catalog/occasion-love": "home.occasionLove",
  "/catalog/occasion-sorry": "home.occasionSorry",
  "/catalog/occasion-date": "home.occasionDate",
  "/catalog/occasion-thanks": "home.occasionThanks",
  "/catalog/occasion-sale": "home.occasionSale",
};

const FOOTER_PAGE_BY_HREF: Record<string, string> = {
  "/faq#general": "footer.about",
  "/faq#delivery": "footer.deliveryPayment",
  "#contacts": "footer.contactsLink",
  "/faq": "footer.faq",
  "/offer": "footer.offer",
  "/privacy": "footer.privacy",
  "/account": "footer.account",
};

const HERO_BY_ID: Record<string, string> = {
  h1: "hero.h1",
  h2: "hero.h2",
  h3: "hero.h3",
  h4: "hero.h4",
};

const CATEGORY_SLUG_KEY: Record<string, string> = {
  bouquets: "category.bouquets",
  roses: "category.roses",
  tulips: "category.tulips",
  mixed: "category.mixed",
  plants: "category.plants",
  boxes: "category.boxes",
  baskets: "category.baskets",
  popular: "category.popular",
  sale: "category.sale",
  shop: "category.shop",
  catalog: "category.shop",
  "occasion-birthday": "home.occasionBirthday",
  "occasion-love": "home.occasionLove",
  "occasion-sorry": "home.occasionSorry",
  "occasion-date": "home.occasionDate",
  "occasion-thanks": "home.occasionThanks",
  "occasion-sale": "home.occasionSale",
};

export function tNavLabel(locale: Locale, href: string, fallback: string) {
  const key = NAV_BY_HREF[href];
  return key ? translate(locale, key) : fallback;
}

export function tCategoryByHref(
  locale: Locale,
  href: string,
  fallback: string,
) {
  const key = CATEGORY_BY_HREF[href];
  return key ? translate(locale, key) : fallback;
}

export function tFooterPage(locale: Locale, href: string, fallback: string) {
  const key = FOOTER_PAGE_BY_HREF[href];
  return key ? translate(locale, key) : fallback;
}

export function tHeroTitle(locale: Locale, id: string, fallback: string) {
  const key = HERO_BY_ID[id];
  return key ? translate(locale, key) : fallback;
}

export function tCategorySlug(locale: Locale, slug: string, fallback: string) {
  const key = CATEGORY_SLUG_KEY[slug];
  return key ? translate(locale, key) : fallback;
}

export function tCategoryLabel(
  locale: Locale,
  category: string | undefined,
  fallback: string,
) {
  if (!category) return translate(locale, "category.bouquets");
  return tCategorySlug(locale, category, fallback);
}

export function tProductName(
  locale: Locale,
  id: string,
  fallback: string,
): string {
  return productName(id, locale, fallback);
}

export function tPackLabel(locale: Locale, packId: string, fallback: string) {
  const key = `pack.${packId}`;
  const value = translate(locale, key);
  return value === key ? fallback : value;
}

/** Map stored Russian/English pack labels back to pack id for localization. */
const PACK_LABEL_TO_ID: Record<string, string> = {
  "Без упаковки": "none",
  "Атласная лента": "ribbon",
  Пленка: "film",
  Крафт: "kraft",
  Сетка: "net",
  "Пленка матовая": "matte",
  "No packaging": "none",
  "Satin ribbon": "ribbon",
  "Film wrap": "film",
  "Kraft paper": "kraft",
  Mesh: "net",
  "Matte film": "matte",
  Qadoqsiz: "none",
  "Atlas lenta": "ribbon",
  Plyonka: "film",
  Kraft: "kraft",
  "To'r": "net",
  "Mat plyonka": "matte",
  none: "none",
  ribbon: "ribbon",
  film: "film",
  kraft: "kraft",
  net: "net",
  matte: "matte",
};

export function localizePackSize(locale: Locale, size: string): string {
  if (!size || size === "—" || size === "M" || size === "S" || size === "L") {
    return size;
  }
  const id = PACK_LABEL_TO_ID[size];
  if (!id) return size;
  return tPackLabel(locale, id, size);
}

export function tTickerItems(locale: Locale, phone: string): string[] {
  return [
    translate(locale, "ticker.freeDelivery"),
    translate(locale, "ticker.open24"),
    translate(locale, "ticker.fresh"),
    phone,
  ];
}
