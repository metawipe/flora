"use client";

import { collections, type Product } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";
import { Collections } from "./Collections";
import { Hero } from "./Hero";
import { ProductSection } from "./ProductSection";
import { Reveal } from "./Reveal";

export function HomePage({ products }: { products: Product[] }) {
  const t = useT();
  const bouquets = products.filter((p) => p.category === "bouquets");
  const plants = products.filter((p) => p.category === "plants");
  const roses = products.filter((p) => p.category === "roses");

  return (
    <main className="home-app">
      <Hero />
      <Reveal eager delay={80}>
        <ProductSection
          title={t("home.bouquets")}
          href="/catalog/bouquets"
          products={bouquets}
          shelf
        />
      </Reveal>
      <Reveal eager delay={140}>
        <Collections
          title={t("home.shop")}
          href="/catalog/shop"
          items={collections}
        />
      </Reveal>
      <Reveal delay={40}>
        <ProductSection
          title={t("home.plants")}
          href="/catalog/plants"
          products={plants}
          shelf
        />
      </Reveal>
      <Reveal delay={60}>
        <ProductSection
          title={t("home.saleRoses")}
          href="/catalog/roses"
          products={roses}
          shelf
        />
      </Reveal>
    </main>
  );
}
