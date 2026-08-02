import { CatalogPage } from "@/components/CatalogPage";

export function generateStaticParams() {
  return [
    "shop",
    "catalog",
    "popular",
    "bouquets",
    "gifts",
    "plants",
    "mixed",
    "roses",
    "tulips",
    "boxes",
    "baskets",
    "balloons",
    "sale",
  ].map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CatalogPage slug={slug} />;
}
