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

export type Partner = {
  name: string;
  src: string;
};

export const BOUQUET_SIZES = ["S", "M", "L"] as const;

export const site = mock.site;
export const payments: PaymentMethod[] = mock.payments;
export const paymentsImage: string = mock.paymentsImage;
export const partners: Partner[] = mock.partners;
export const nav: NavItem[] = mock.nav;
export const tickerItems: string[] = mock.ticker;
export const heroSlides: HeroSlide[] = mock.hero;
export const collections: Collection[] = mock.categories;
export const bouquets: Product[] = mock.bouquets;
export const gifts: Product[] = mock.gifts;
export const plants: Product[] = mock.plants;
export const vipProducts: Product[] = mock.vip;
export const flowerBoxes: Product[] = mock.boxes ?? [];
export const flowerBaskets: Product[] = mock.baskets ?? [];
export const footerLinks = mock.footer;

export const allProducts: Product[] = [
  ...bouquets,
  ...gifts,
  ...plants,
  ...vipProducts,
  ...flowerBoxes,
  ...flowerBaskets,
];

const tulipProducts = [
  ...plants.filter((p) => p.name.toLowerCase().includes("тюльпан")),
  ...flowerBaskets.filter((p) => p.name.toLowerCase().includes("тюльпан")),
];

const CATEGORY_MAP: Record<string, { title: string; products: Product[] }> = {
  bouquets: { title: "Букеты", products: bouquets },
  gifts: { title: "Подарки", products: gifts },
  roses: { title: "Розы", products: vipProducts },
  tulips: { title: "Тюльпаны", products: tulipProducts },
  mixed: {
    title: "Цветы разные",
    products: [
      ...plants.filter((p) => !p.name.toLowerCase().includes("тюльпан")),
      ...bouquets.slice(4, 10),
    ],
  },
  plants: {
    title: "Цветы разные",
    products: plants,
  },
  boxes: { title: "Цветы в коробке", products: flowerBoxes },
  baskets: { title: "Корзины с цветами", products: flowerBaskets },
  balloons: {
    title: "Воздушные шары",
    products: gifts.filter((p) => p.name.toLowerCase().includes("шар")),
  },
  popular: {
    title: "Популярное",
    products: [
      ...bouquets.slice(0, 6),
      ...vipProducts.slice(0, 4),
      ...flowerBaskets.slice(0, 4),
      ...gifts.slice(0, 4),
    ],
  },
  sale: {
    title: "Акции",
    products: allProducts.filter((p) => p.oldPrice || p.badge === "SALE"),
  },
  shop: { title: "Магазин", products: allProducts },
  catalog: { title: "Магазин", products: allProducts },
};

export function getCategory(slug: string) {
  return CATEGORY_MAP[slug] ?? null;
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getRelated(product: Product, limit = 4): Product[] {
  // Like Love Flowers: flower PDPs cross-sell gifts; gifts stay in gifts.
  if (isFlowerProduct(product)) {
    return gifts.filter((p) => p.id !== product.id).slice(0, limit);
  }
  return gifts
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

export function categoryPath(category?: string): string {
  switch (category) {
    case "roses":
      return "/catalog/roses";
    case "plants":
      return "/catalog/mixed";
    case "gifts":
      return "/catalog/gifts";
    case "boxes":
      return "/catalog/boxes";
    case "baskets":
      return "/catalog/baskets";
    case "bouquets":
    default:
      return "/catalog/bouquets";
  }
}

export function categoryLabel(category?: string): string {
  switch (category) {
    case "roses":
      return "Розы";
    case "plants":
      return "Цветы разные";
    case "gifts":
      return "Подарки";
    case "boxes":
      return "Цветы в коробке";
    case "baskets":
      return "Корзины с цветами";
    case "bouquets":
    default:
      return "Букеты";
  }
}

export function isFlowerProduct(product: Product): boolean {
  return (
    product.category !== "gifts" &&
    !/торт|конфет|шоколад|киндер|мишка|зайк|кот|toys|шар/i.test(product.name)
  );
}

export const PACKAGING_OPTIONS = [
  { id: "none", label: "Без упаковки", price: 0 },
  { id: "ribbon", label: "Атласная лента", price: 10000 },
  { id: "film", label: "Пленка", price: 20000 },
  { id: "kraft", label: "Крафт", price: 30000 },
  { id: "net", label: "Сетка", price: 25000 },
  { id: "matte", label: "Пленка матовая", price: 20000 },
] as const;

export function productCategories(product: Product): { label: string; href: string }[] {
  if (product.category === "gifts") {
    const cats = [{ label: "Подарки", href: "/catalog/gifts" }];
    if (/торт|конфет|шоколад|киндер|raffaello|ferrero|merci|коркунов/i.test(product.name)) {
      cats.push({ label: "Сладкие подарки", href: "/catalog/gifts" });
    } else if (/шар/i.test(product.name)) {
      cats.push({ label: "Воздушные шары", href: "/catalog/balloons" });
    } else if (/мишка|зайк|кот|toys/i.test(product.name)) {
      cats.push({ label: "Мягкие игрушки", href: "/catalog/gifts" });
    }
    return cats;
  }

  const cats: { label: string; href: string }[] = [];
  if (product.oldPrice || product.badge === "SALE") {
    cats.push({ label: "Акции", href: "/catalog/sale" });
  }
  if (
    product.badge === "HIT" ||
    product.category === "roses" ||
    product.category === "bouquets"
  ) {
    cats.push({ label: "Популярное", href: "/catalog/popular" });
  }
  cats.push({
    label: categoryLabel(product.category),
    href: categoryPath(product.category),
  });
  return cats;
}

export function getProductDetails(product: Product) {
  const flower = isFlowerProduct(product);

  if (!flower) {
    const lines: string[] = [];
    const weight = product.name.match(/(\d+)\s*г/i);
    if (weight) lines.push(`Вес: ${weight[1]} г`);
    if (/raffaello|ferrero|merci|коркунов|киндер|шоколад|конфет/i.test(product.name)) {
      lines.push("Страна производитель: Россия");
    }
    if (/торт/i.test(product.name)) {
      lines.push("Свежая выпечка. Уточняйте наличие у менеджера.");
    }
    if (/шар/i.test(product.name)) {
      lines.push("Гелиевые шары. Количество и цвет можно согласовать при заказе.");
    }
    if (/мишка|зайк|кот|toys/i.test(product.name)) {
      lines.push("Мягкая игрушка. Отличный подарок к букету.");
    }

    return {
      isFlower: false as const,
      description:
        product.description ||
        (lines.length
          ? lines.join("\n")
          : `${product.name} — подарок от Love Flowers с доставкой по Ташкенту.`),
      notice: null as string | null,
    };
  }

  return {
    isFlower: true as const,
    description:
      product.description ||
      `${product.name} — свежая композиция от Love Flowers. Собираем в день заказа.`,
    notice:
      product.category === "roses" || /51|101|vip/i.test(product.name)
        ? "Внимание! На фотографии изображен VIP размер букета."
        : null,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " сум";
}

export function sizePrice(base: number, size: string): number {
  if (size === "S") return Math.round(base * 0.85);
  if (size === "L") return Math.round(base * 1.25);
  return base;
}

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

export function nearestDeliveryText(date = new Date()): string {
  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  const year = date.getFullYear();
  return `сегодня ${day} ${month} ${year} в течение 2х-3х часов.`;
}
