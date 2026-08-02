import {
  bouquets,
  collections,
  gifts,
  plants,
  vipProducts,
} from "@/data/products";
import { Collections } from "./Collections";
import { Hero } from "./Hero";
import { ProductSection } from "./ProductSection";
import { Reveal } from "./Reveal";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Reveal eager delay={80}>
        <ProductSection
          title="Букеты"
          href="/catalog/bouquets"
          products={bouquets}
        />
      </Reveal>
      <Reveal eager delay={160}>
        <Collections title="Магазин" href="/catalog/shop" items={collections} />
      </Reveal>
      <Reveal delay={40}>
        <ProductSection
          title="Подарки"
          href="/catalog/gifts"
          products={gifts}
        />
      </Reveal>
      <Reveal delay={60}>
        <ProductSection
          title="Тюльпаны, орхидеи и корзины"
          href="/catalog/plants"
          products={plants}
        />
      </Reveal>
      <Reveal delay={80}>
        <ProductSection
          title="Розы со скидкой"
          href="/catalog/roses"
          products={vipProducts}
        />
      </Reveal>
    </main>
  );
}
