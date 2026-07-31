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

export type PaymentMethod = {
  name: string;
  src: string;
};

export const BOUQUET_SIZES = ["S", "M", "L"] as const;

export const site = mock.site;
export const payments: PaymentMethod[] = mock.payments;
export const nav: NavItem[] = mock.nav;
export const tickerItems: string[] = mock.ticker;
export const heroSlides: HeroSlide[] = mock.hero;
export const collections: Collection[] = mock.categories;
export const bouquets: Product[] = mock.bouquets;
export const gifts: Product[] = mock.gifts;
export const plants: Product[] = mock.plants;
export const vipProducts: Product[] = mock.vip;
export const footerLinks = mock.footer;

export const allProducts: Product[] = [
  ...bouquets,
  ...gifts,
  ...plants,
  ...vipProducts,
];

const CATEGORY_MAP: Record<string, { title: string; products: Product[] }> = {
  bukety: { title: "Букеты", products: bouquets },
  podarki: { title: "Подарки", products: gifts },
  rasteniya: { title: "Комнатные растения", products: plants },
  vip: { title: "VIP букеты", products: vipProducts },
  kompozicii: { title: "Композиции", products: bouquets.slice(0, 4) },
  shary: { title: "Воздушные шары", products: gifts.slice(0, 4) },
  "k-buketu": { title: "К букету", products: gifts.slice(4) },
  "8-marta": { title: "8 марта", products: bouquets },
  "14-fevralya": { title: "14 февраля", products: bouquets.slice(0, 6) },
  sezonnye: { title: "Сезонные", products: vipProducts.slice(0, 4) },
  sale: {
    title: "SALE",
    products: allProducts.filter((p) => p.oldPrice || p.badge === "LAST ONE"),
  },
  catalog: { title: "Каталог", products: allProducts },
};

export function getCategory(slug: string) {
  return CATEGORY_MAP[slug] ?? null;
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return allProducts
    .filter(
      (p) => p.id !== product.id && p.category === product.category,
    )
    .slice(0, limit);
}

export function getProductDetails(product: Product) {
  const categoryLabel =
    product.category === "vip"
      ? "VIP букет"
      : product.category === "rasteniya"
        ? "Комнатное растение"
        : product.category === "podarki"
          ? "Подарочный набор"
          : "Букет";

  return {
    description:
      product.description ||
      `${product.name} — свежая композиция от Uzflora с доставкой по Ташкенту. Собираем в день заказа, сохраняем свежесть и аккуратную упаковку.`,
    specs: [
      { label: "Тип", value: categoryLabel },
      { label: "Доставка", value: "По Ташкенту в день заказа" },
      { label: "Упаковка", value: "Фирменная упаковка Uzflora" },
      { label: "Уход", value: "Подрезать стебли, менять воду ежедневно" },
      { label: "Состав", value: "Сезонные цветы премиум-качества" },
    ],
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " UZS";
}

export function sizePrice(base: number, size: string): number {
  if (size === "S") return Math.round(base * 0.85);
  if (size === "L") return Math.round(base * 1.25);
  return base;
}
