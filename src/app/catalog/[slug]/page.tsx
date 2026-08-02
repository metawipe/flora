import { Suspense } from "react";
import { CatalogPage } from "@/components/CatalogPage";
import {
  getCategoryAsync,
  getCategoryLocalizedAsync,
} from "@/data/products";
import { DEFAULT_LOCALE } from "@/i18n/config";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    "shop",
    "catalog",
    "popular",
    "bouquets",
    "plants",
    "mixed",
    "roses",
    "tulips",
    "boxes",
    "baskets",
    "sale",
    "occasion-birthday",
    "occasion-love",
    "occasion-sorry",
    "occasion-date",
    "occasion-thanks",
    "occasion-sale",
  ].map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryAsync(slug);
  const localized = await getCategoryLocalizedAsync(slug, DEFAULT_LOCALE);

  return (
    <Suspense fallback={<main className="page-main" />}>
      <CatalogPage
        slug={slug}
        initialProducts={category?.products ?? null}
        initialTitle={localized?.title ?? category?.title ?? null}
      />
    </Suspense>
  );
}
