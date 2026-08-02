"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";
import { useStore } from "@/context/StoreContext";
import {
  categoryLabel,
  categoryPath,
  formatPrice,
  getProductDetails,
  getRelated,
  isFlowerProduct,
  localizeProductName,
  nearestDeliveryText,
  packagingOptions,
  productCategories,
  type Product,
} from "@/data/products";
import type { Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

function getInfoSections(
  t: (key: string, vars?: Record<string, string | number>) => string,
  locale: Locale,
  now?: Date,
) {
  return [
    {
      id: "delivery",
      title: t("pdp.delivery"),
      blocks: [
        {
          title: t("pdp.regions"),
          items: [t("pdp.regions1"), t("pdp.regions2")],
        },
        {
          title: t("pdp.nearest"),
          items: [
            now ? nearestDeliveryText(now, locale) : t("pdp.nearestFallback"),
          ],
        },
        {
          title: t("pdp.terms"),
          items: [t("pdp.terms1"), t("pdp.terms2")],
        },
      ],
      more: { label: t("pdp.moreDelivery"), href: "/faq#delivery" },
    },
    {
      id: "payment",
      title: t("pdp.payment"),
      blocks: [
        {
          title: "",
          items: [t("pdp.pay1"), t("pdp.pay2"), t("pdp.pay3"), t("pdp.pay4")],
        },
      ],
      more: { label: t("pdp.morePayment"), href: "/faq#payment" },
    },
    {
      id: "bonuses",
      title: t("pdp.bonuses"),
      blocks: [
        {
          title: "",
          items: [
            t("pdp.bonus1"),
            t("pdp.bonus2"),
            t("pdp.bonus3"),
            t("pdp.bonus4"),
          ],
        },
      ],
    },
    {
      id: "return",
      title: t("pdp.returnTitle"),
      blocks: [
        {
          title: "",
          items: [t("pdp.returnBody")],
        },
      ],
    },
  ] as const;
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { locale, t } = useLocale();
  const flower = isFlowerProduct(product);
  const [packId, setPackId] = useState<string>("none");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("delivery");
  const [infoSections, setInfoSections] = useState(() =>
    getInfoSections(t, locale),
  );
  const albumRef = useRef<HTMLDivElement>(null);
  const name = localizeProductName(product, locale);
  const details = getProductDetails(product, locale);
  const related = getRelated(product);
  const categories = productCategories(product, locale);
  const packs = packagingOptions(locale);
  const packaging = packs.find((p) => p.id === packId) ?? packs[0];

  useEffect(() => {
    setInfoSections(getInfoSections(t, locale, new Date()));
  }, [t, locale]);

  const unitPrice = useMemo(
    () => product.price + (flower ? packaging.price : 0),
    [product.price, flower, packaging.price],
  );
  const totalPrice = unitPrice * qty;
  const favorited = isFavorite(product.id);
  const images = product.images.length ? product.images : [""];
  const gallery = images.length >= 2 ? images : [images[0], images[0]];
  const optionKey = flower ? packaging.label : "—";

  const onAdd = () => {
    addToCart({ ...product, price: unitPrice }, optionKey, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const onBuyOneClick = () => {
    addToCart({ ...product, price: unitPrice }, optionKey, qty);
    router.push("/checkout");
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
            { label: t("common.home"), href: "/" },
            { label: t("common.shop"), href: "/catalog/shop" },
            {
              label: categoryLabel(product.category, locale),
              href: categoryPath(product.category),
            },
            { label: name },
          ]}
        />

        <div className="pdp">
          <div className="pdp__gallery">
            <div className="pdp__album" ref={albumRef} onScroll={onAlbumScroll}>
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`pdp__shot${activeImg === i ? " is-active" : ""}`}
                  onClick={() => goToSlide(i)}
                >
                  <Image
                    src={src}
                    alt={`${name} ${i + 1}`}
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
                  aria-label={t("pdp.photoN", { n: i + 1 })}
                  onClick={() => goToSlide(i)}
                />
              ))}
            </div>
          </div>

          <aside className="pdp__panel">
            <div className="pdp__panel-inner">
              <div className="pdp__head">
                <h1 className="pdp__title">{name}</h1>
                <button
                  type="button"
                  className={`pdp__fav${favorited ? " is-active" : ""}`}
                  aria-label={favorited ? t("pdp.favorited") : t("pdp.favorite")}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <HeartIcon filled={favorited} />
                </button>
              </div>

              <div className="pdp__price-row">
                <p className="pdp__price">{formatPrice(totalPrice, locale)}</p>
                {product.oldPrice != null && (
                  <p className="pdp__old">
                    {formatPrice(product.oldPrice, locale)}
                  </p>
                )}
              </div>
              {flower && packaging.price > 0 && (
                <p className="pdp__price-note">
                  {t("pdp.priceNote", {
                    price: formatPrice(product.price, locale),
                    pack: formatPrice(packaging.price, locale),
                  })}
                  {qty > 1 ? ` × ${qty}` : ""}
                </p>
              )}

              {flower && (
                <>
                  <p className="pdp__label">{t("pdp.choosePack")}</p>
                  <div className="pdp__packs">
                    {packs.map((pack) => (
                      <label
                        key={pack.id}
                        className={`pdp__pack${packId === pack.id ? " is-active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="packaging"
                          checked={packId === pack.id}
                          onChange={() => setPackId(pack.id)}
                        />
                        <span>
                          {pack.label}
                          {pack.price > 0
                            ? ` (${formatPrice(pack.price, locale)})`
                            : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              <p className="pdp__label">{t("pdp.qty")}</p>
              <div className="pdp__qty">
                <button
                  type="button"
                  aria-label={t("pdp.less")}
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <button
                  type="button"
                  aria-label={t("pdp.more")}
                  onClick={() => setQty((v) => v + 1)}
                >
                  +
                </button>
              </div>

              <div className="pdp__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--wide"
                  onClick={onAdd}
                >
                  {added ? t("pdp.added") : t("pdp.add")}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--wide"
                  onClick={onBuyOneClick}
                >
                  {t("pdp.buyOneClick")}
                </button>
              </div>

              <p className="pdp__cats">
                {t("pdp.categories")}{" "}
                {categories.map((cat, i) => (
                  <span key={`${cat.href}-${cat.label}`}>
                    {i > 0 && ", "}
                    <Link href={cat.href}>{cat.label}</Link>
                  </span>
                ))}
              </p>

              <div className="pdp__desc">
                <h2>{t("pdp.description")}</h2>
                {details.notice && (
                  <p className="pdp__notice">{details.notice}</p>
                )}
                <p className="pdp__desc-text">{details.description}</p>
              </div>

              <div className="pdp__accordions">
                {infoSections.map((section) => {
                  const open = openSection === section.id;
                  return (
                    <div
                      key={section.id}
                      className={`pdp__acc${open ? " is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="pdp__acc-head"
                        onClick={() =>
                          setOpenSection(open ? null : section.id)
                        }
                      >
                        {section.title}
                        <span>{open ? "−" : "+"}</span>
                      </button>
                      <div className="pdp__acc-body">
                        <div className="pdp__acc-content">
                          {section.blocks.map((block) => (
                            <div key={block.title || section.id}>
                              {block.title ? <h3>{block.title}</h3> : null}
                              <ul>
                                {block.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {"more" in section && section.more ? (
                            <Link
                              href={section.more.href}
                              className="pdp__acc-more"
                            >
                              {section.more.label}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="section">
            <div className="section__head">
              <h2 className="section__title">{t("pdp.related")}</h2>
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
