"use client";

import Image from "next/image";
import Link from "next/link";
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
import { sampleBottomLuma, toneFromLuma } from "@/lib/imageLuma";
import { AppBackBar } from "./AppBackBar";
import { ChevronLeftIcon, HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";
import { StickyBar } from "./StickyBar";

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
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { locale, t } = useLocale();
  const flower = isFlowerProduct(product);
  const [packId, setPackId] = useState<string>("none");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [dotTone, setDotTone] = useState<"light" | "dark">("light");
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
  const images = product.images.length ? product.images : [""];
  const gallery = images.length >= 2 ? images : [images[0], images[0]];

  useEffect(() => {
    setInfoSections(getInfoSections(t, locale, new Date()));
  }, [t, locale]);

  useEffect(() => {
    const album = albumRef.current;
    if (!album) return;

    let cancelled = false;
    const shot = album.children[activeImg] as HTMLElement | undefined;
    const img = shot?.querySelector("img");
    if (!img) return;

    const analyze = () => {
      if (cancelled || !img.naturalWidth) return;
      try {
        setDotTone(toneFromLuma(sampleBottomLuma(img)));
      } catch {
        // Tainted canvas / decode race — prefer dark dots on light pages
        if (!cancelled) setDotTone("light");
      }
    };

    if (img.complete) analyze();
    else img.addEventListener("load", analyze);

    return () => {
      cancelled = true;
      img.removeEventListener("load", analyze);
    };
  }, [activeImg, product.id, gallery]);

  const unavailable = product.available === false;
  const unitPrice = useMemo(
    () => product.price + (flower ? packaging.price : 0),
    [product.price, flower, packaging.price],
  );
  const totalPrice = unitPrice * qty;
  const favorited = isFavorite(product.id);
  const optionKey = flower ? packaging.label : "—";

  const onAdd = () => {
    if (unavailable) return;
    addToCart({ ...product, price: unitPrice }, optionKey, qty);
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

  const backHref = categoryPath(product.category);
  const backTitle = categoryLabel(product.category, locale);

  return (
    <main className="page-main page-main--pdp">
      <div className="container pdp-container">
        <div className="pdp-desk-back">
          <AppBackBar
            href={backHref}
            title={backTitle}
            backLabel={t("common.shop")}
          />
        </div>

        <div className="pdp">
          <div className="pdp-bleed">
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
                    <span className="img-skeleton pdp__skeleton" aria-hidden />
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
              <Link
                href={backHref}
                className="pdp-bleed__back"
                aria-label={backTitle}
              >
                <ChevronLeftIcon />
              </Link>
              <button
                type="button"
                className={`pdp-bleed__fav${favorited ? " is-active" : ""}`}
                aria-label={favorited ? t("pdp.favorited") : t("pdp.favorite")}
                onClick={() => toggleFavorite(product.id)}
              >
                <HeartIcon filled={favorited} />
              </button>
              <div
                className={`pdp__album-dots is-on-${dotTone}`}
                data-tone={dotTone}
                aria-hidden={gallery.length < 2}
              >
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
          </div>

          <aside className="pdp__panel">
            <div className="pdp__panel-inner">
              <div className="pdp__head">
                <h1 className="pdp__title">{name}</h1>
                <button
                  type="button"
                  className={`pdp__fav pdp__fav--desk${favorited ? " is-active" : ""}`}
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
              {unavailable && (
                <p className="pdp__notice">{t("badge.outOfStock")}</p>
              )}
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

              <div className="pdp__actions pdp__actions--inline">
                <button
                  type="button"
                  className="btn btn--primary btn--wide"
                  onClick={onAdd}
                  disabled={unavailable}
                >
                  {unavailable
                    ? t("badge.outOfStock")
                    : added
                      ? t("pdp.added")
                      : t("pdp.add")}
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

      <StickyBar className="pdp-sticky">
        <div className="app-sticky-bar__meta">
          <span className="app-sticky-bar__label">{t("header.total")}</span>
          <strong className="app-sticky-bar__price">
            {formatPrice(totalPrice, locale)}
          </strong>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onAdd}
          disabled={unavailable}
        >
          {unavailable
            ? t("badge.outOfStock")
            : added
              ? t("pdp.added")
              : t("pdp.add")}
        </button>
      </StickyBar>
    </main>
  );
}
