"use client";

import {
  bouquets,
  collections,
  plants,
  vipProducts,
} from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";
import { Collections } from "./Collections";
import { Hero } from "./Hero";
import { ProductSection } from "./ProductSection";
import { Reveal } from "./Reveal";

export function HomePage() {
  const t = useT();

  return (
    <main>
      <Hero />
      <Reveal eager delay={80}>
        <ProductSection
          title={t("home.bouquets")}
          href="/catalog/bouquets"
          products={bouquets}
        />
      </Reveal>
      <Reveal eager delay={160}>
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
        />
      </Reveal>
      <Reveal delay={60}>
        <ProductSection
          title={t("home.saleRoses")}
          href="/catalog/roses"
          products={vipProducts}
        />
      </Reveal>
    </main>
  );
}
