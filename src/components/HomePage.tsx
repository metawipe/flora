import {
  bouquets,
  collections,
  gifts,
  heroSlides,
  plants,
  vipProducts,
} from "@/data/products";
import { Collections } from "./Collections";
import { Hero } from "./Hero";
import { ProductSection } from "./ProductSection";

export function HomePage() {
  return (
    <main>
      <Hero slides={heroSlides} />
      <ProductSection
        title="Букеты"
        href="/catalog/bukety"
        products={bouquets}
      />
      <Collections title="Категории" href="/catalog/bukety" items={collections} />
      <ProductSection
        title="Подарки"
        href="/catalog/podarki"
        products={gifts}
      />
      <ProductSection
        title="Комнатные растения"
        href="/catalog/rasteniya"
        products={plants}
      />
      <ProductSection
        title="VIP букеты"
        href="/catalog/vip"
        products={vipProducts}
        bottomPad
      />
    </main>
  );
}
