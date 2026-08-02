import Link from "next/link";
import type { Product } from "@/data/products";
import { ArrowRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  title: string;
  href?: string;
  products: Product[];
  bottomPad?: boolean;
  /** Horizontal snap shelf on mobile (app-style) */
  shelf?: boolean;
};

export function ProductSection({
  title,
  href,
  products,
  bottomPad,
  shelf = false,
}: ProductSectionProps) {
  const list = shelf ? products.slice(0, 12) : products;

  return (
    <section
      className={`section${bottomPad ? " section--bottom" : ""}${shelf ? " section--shelf" : ""}`}
    >
      <div className="container">
        {href ? (
          <Link href={href} className="section__head">
            <h2 className="section__title">{title}</h2>
            <span className="section__arrow" aria-hidden>
              <ArrowRightIcon />
            </span>
          </Link>
        ) : (
          <div className="section__head">
            <h2 className="section__title">{title}</h2>
          </div>
        )}

        <div className={shelf ? "product-shelf" : "product-grid"}>
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact={shelf}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
