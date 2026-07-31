import Link from "next/link";
import type { Product } from "@/data/products";
import { ArrowRightIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  title: string;
  href?: string;
  products: Product[];
  bottomPad?: boolean;
};

export function ProductSection({
  title,
  href,
  products,
  bottomPad,
}: ProductSectionProps) {
  return (
    <section className={`section${bottomPad ? " section--bottom" : ""}`}>
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

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
