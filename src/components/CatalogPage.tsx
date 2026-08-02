import Image from "next/image";
import Link from "next/link";
import { collections, getCategory } from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductCard } from "./ProductCard";

const SHOP_SLUGS = new Set(["shop", "catalog"]);

export function CatalogPage({ slug }: { slug: string }) {
  const isShop = SHOP_SLUGS.has(slug);
  const category = isShop ? null : getCategory(slug);

  if (!isShop && !category) {
    return (
      <main className="page-main">
        <div className="container">
          <h1 className="page-title">Категория не найдена</h1>
        </div>
      </main>
    );
  }

  if (isShop) {
    return (
      <main className="page-main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Магазин" },
            ]}
          />
          <h1 className="page-title">Магазин в Ташкенте</h1>
          <div className="collections-grid shop-grid">
            {collections.map((item) => (
              <Link key={item.id} href={item.href} className="collection-card">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="collection-card__img"
                  sizes="(max-width: 700px) 50vw, 20vw"
                />
                <div className="collection-card__shade" />
                <span className="collection-card__name">{item.name}</span>
              </Link>
            ))}
          </div>
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
            { label: "Магазин", href: "/catalog/shop" },
            { label: category!.title },
          ]}
        />
        <h1 className="page-title">{category!.title}</h1>
        <div className="product-grid catalog-grid">
          {category!.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
