import { HomePage } from "@/components/HomePage";
import { getCatalogProductsAsync } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getCatalogProductsAsync();
  return <HomePage products={products} />;
}
