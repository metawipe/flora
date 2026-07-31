import { getCategory } from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductCard } from "./ProductCard";

export function CatalogPage({ slug }: { slug: string }) {
  const category = getCategory(slug);

  if (!category) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">Категория не найдена</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog/bukety" },
            { label: category.title },
          ]}
        />
        <h1 className="page-title">{category.title}</h1>
        <div className="product-grid catalog-grid">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
