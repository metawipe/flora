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

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function giftKind(product: Product): string {
  if (/торт|конфет|шоколад|киндер|raffaello|ferrero|merci|коркунов/i.test(product.name)) {
    return "sweet";
  }
  if (/шар/i.test(product.name)) return "balloon";
  if (/мишка|зайк|кот|toys|игруш/i.test(product.name)) return "toy";
  return "other";
}

function relatedBucket(product: Product): string {
  return isFlowerProduct(product)
    ? `flower:${product.category || "bouquets"}`
    : `gift:${giftKind(product)}`;
}

/** Score how well `candidate` pairs with `base` for “bought together”. */
function scoreRelatedPair(base: Product, candidate: Product): number {
  if (candidate.id === base.id) return Number.NEGATIVE_INFINITY;

  const ratio = candidate.price / Math.max(base.price, 1);
  const priceCloseness = Math.max(0, 28 - Math.abs(Math.log(ratio || 1)) * 18);
  let score = 0;

  if (isFlowerProduct(base)) {
    if (!isFlowerProduct(candidate)) {
      // Cross-sell gifts: prefer affordable add-ons, not another VIP bouquet
      score += 48;
      if (ratio >= 0.04 && ratio <= 0.5) score += 36;
      else if (ratio <= 0.85) score += 18;
      else score += 4;

      const kinds = ["sweet", "balloon", "toy", "other"] as const;
      const prefer = kinds[hashSeed(base.id) % kinds.length];
      const kind = giftKind(candidate);
      if (kind === prefer) score += 22;
      else if (kind !== "other") score += 10;
    } else {
      // Similar flowers: same category + close price
      score += 18;
      if (candidate.category === base.category) score += 28;
      else if (
        (base.category === "bouquets" && candidate.category === "boxes") ||
        (base.category === "boxes" && candidate.category === "bouquets") ||
        (base.category === "roses" && candidate.category === "bouquets")
      ) {
        score += 16;
      }
      score += priceCloseness;
      if (candidate.badge === "HIT") score += 6;
      if (candidate.oldPrice) score += 4;
    }
  } else {
    if (!isFlowerProduct(candidate)) {
      score += 30;
      if (giftKind(candidate) === giftKind(base)) score += 34;
      else score += 12;
      score += priceCloseness;
    } else {
      // Pair gift with a bouquet in a sensible price band
      score += 40;
      if (candidate.category === "bouquets" || candidate.category === "boxes") {
        score += 14;
      }
      if (ratio >= 1.1 && ratio <= 5) score += 28;
      else if (ratio >= 0.7) score += 12;
      if (candidate.badge === "HIT") score += 6;
    }
  }

  // Stable per-product jitter so rankings differ across PDPs
  score += (hashSeed(`${base.id}::${candidate.id}`) % 1000) / 1000 * 14;
  return score;
}

export function getRelated(product: Product, limit = 4): Product[] {
  const ranked = allProducts
    .map((candidate) => ({
      candidate,
      score: scoreRelatedPair(product, candidate),
    }))
    .filter((row) => Number.isFinite(row.score))
    .sort((a, b) => b.score - a.score);

  const picked: Product[] = [];
  const seenBuckets = new Set<string>();

  // Pass 1: diversify buckets (sweet / balloon / toy / flower category…)
  for (const { candidate } of ranked) {
    if (picked.length >= limit) break;
    const bucket = relatedBucket(candidate);
    if (seenBuckets.has(bucket) && seenBuckets.size < Math.min(3, limit)) {
      continue;
    }
    picked.push(candidate);
    seenBuckets.add(bucket);
  }

  // Pass 2: fill remaining slots by score
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
          : `${product.name} — подарок от Zamin Gullari с доставкой по Ташкенту.`),
      notice: null as string | null,
    };
  }

  return {
    isFlower: true as const,
    description:
      product.description ||
      `${product.name} — свежая композиция от Zamin Gullari. Собираем в день заказа.`,
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
