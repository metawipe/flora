"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type UIEvent } from "react";
import { useStore } from "@/context/StoreContext";
import {
  BOUQUET_SIZES,
  formatPrice,
  getProductDetails,
  getRelated,
  sizePrice,
  type Product,
} from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [size, setSize] = useState<string>("M");
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const albumRef = useRef<HTMLDivElement>(null);
  const details = getProductDetails(product);
  const related = getRelated(product);
  const price = useMemo(
    () => sizePrice(product.price, size),
    [product.price, size],
  );
  const favorited = isFavorite(product.id);
  const images = product.images.length ? product.images : [""];
  const gallery = images.length >= 2 ? images : [images[0], images[0]];

  const onAdd = () => {
    addToCart({ ...product, price }, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const onAlbumScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    if (index !== activeImg) setActiveImg(index);
  };

  const goToSlide = (index: number) => {
    setActiveImg(index);
    const el = albumRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog/bukety" },
            {
              label:
                product.category === "vip"
                  ? "VIP"
                  : product.category === "rasteniya"
                    ? "Комнатные"
                    : product.category === "podarki"
                      ? "Подарки"
                      : "Букеты",
              href: `/catalog/${product.category || "bukety"}`,
            },
            { label: product.name },
          ]}
        />

        <div className="pdp">
          <div className="pdp__gallery">
            <div
              className="pdp__album"
              ref={albumRef}
              onScroll={onAlbumScroll}
            >
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`pdp__shot${activeImg === i ? " is-active" : ""}`}
                  onClick={() => goToSlide(i)}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="pdp__img"
                    sizes="(max-width: 900px) 100vw, 55vw"
                    priority={i === 0}
                  />
                </button>
              ))}
            </div>
            <div className="pdp__album-dots" aria-hidden={gallery.length < 2}>
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdp__album-dot${activeImg === i ? " is-active" : ""}`}
                  aria-label={`Фото ${i + 1}`}
                  onClick={() => goToSlide(i)}
                />
              ))}
            </div>
          </div>

          <aside className="pdp__panel">
            <div className="pdp__panel-inner">
              <div className="pdp__head">
                <h1 className="pdp__title">{product.name}</h1>
                <button
                  type="button"
                  className={`pdp__fav${favorited ? " is-active" : ""}`}
                  aria-label="В избранное"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <HeartIcon filled={favorited} />
                </button>
              </div>

              <p className="pdp__price">{formatPrice(price)}</p>
              {product.oldPrice != null && (
                <p className="pdp__old">{formatPrice(product.oldPrice)}</p>
              )}

              <p className="pdp__label">Размер букета</p>
              <div className="pdp__sizes">
                {BOUQUET_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pdp__size${size === s ? " is-active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn btn--primary btn--wide"
                onClick={onAdd}
              >
                {added ? "Добавлено" : "В корзину"}
              </button>

              <p className="pdp__avail">Доставка сегодня · поддержка 24/7</p>

              <div className="pdp__paybox">
                <div>
                  <p>по {formatPrice(Math.round(price / 4))} × 4 платежа</p>
                  <span>с партнёрами Uzflora</span>
                </div>
                <span className="pdp__paybox-btn">Подробнее</span>
              </div>

              <dl className="pdp__specs">
                <div>
                  <dt>Описание</dt>
                  <dd>{details.description}</dd>
                </div>
                {details.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="section">
            <div className="section__head">
              <h2 className="section__title">Вам также может понравиться</h2>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
