"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, type Product } from "@/data/products";
import { HeartIcon } from "./Icons";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useStore();
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images.length ? product.images : [""];
  const favorited = isFavorite(product.id);

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link href={`/product/${product.id}`} className="product-card__link">
          <Image
            src={images[imgIndex]}
            alt={product.name}
            fill
            className="product-card__img"
            sizes="(max-width: 700px) 50vw, 25vw"
          />
        </Link>

        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}

        <button
          type="button"
          className={`product-card__fav${favorited ? " is-active" : ""}`}
          aria-label={favorited ? "В избранном" : "В избранное"}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
        >
          <HeartIcon filled={favorited} />
        </button>

        {images.length > 1 && (
          <div className="product-card__dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`product-card__dot${i === imgIndex ? " is-active" : ""}`}
                aria-label={`Фото ${i + 1}`}
                onMouseEnter={() => setImgIndex(i)}
                onClick={() => setImgIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card__info">
        <Link href={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__price">
          {formatPrice(product.price)}
          {product.oldPrice != null && (
            <span className="product-card__old">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
