import {
  bouquets,
  collections,
  gifts,
  plants,
  vipProducts,
} from "@/data/products";
import { Collections } from "./Collections";
import { Hero } from "./Hero";
import { Partners } from "./Partners";
import { ProductSection } from "./ProductSection";

export function HomePage() {
  return (
    <main>
      <Hero />
      <ProductSection
        title="Букеты"
        href="/catalog/bouquets"
        products={bouquets}
      />
      <Collections title="Магазин" href="/catalog/shop" items={collections} />
      <ProductSection
        title="Подарки"
        href="/catalog/gifts"
        products={gifts}
      />
      <ProductSection
        title="Тюльпаны и орхидеи"
        href="/catalog/tulips"
        products={plants}
      />
      <ProductSection
        title="Розы и акции"
        href="/catalog/roses"
        products={vipProducts}
      />
      <Partners />
    </main>
  );
}
