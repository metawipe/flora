import { CatalogPage } from "@/components/CatalogPage";

export function generateStaticParams() {
  return [
    "bukety",
    "podarki",
    "rasteniya",
    "vip",
    "kompozicii",
    "shary",
    "k-buketu",
    "8-marta",
    "14-fevralya",
    "sezonnye",
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
