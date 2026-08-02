import { HomePage } from "@/components/HomePage";
import { getCatalogProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export default function Page() {
  const products = getCatalogProducts();
  return <HomePage products={products} />;
}
