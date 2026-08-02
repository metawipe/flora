"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";
import { useStore } from "@/context/StoreContext";
import {
  PACKAGING_OPTIONS,
  categoryLabel,
  categoryPath,
  formatPrice,
  getProductDetails,
  getRelated,
  isFlowerProduct,
  nearestDeliveryText,
  productCategories,
  type Product,
} from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

function getInfoSections(now?: Date) {
  return [
    {
      id: "delivery",
      title: "Доставка",
      blocks: [
        {
          title: "Регионы доставки",
          items: [
            "Адрес магазина: Доставка со склада в Ташкенте",
            "Доставка возможна по всем районам Ташкента: в любой район города.",
          ],
        },
        {
          title: "Ближайшее время доставки",
          items: [
            now
              ? nearestDeliveryText(now)
              : "сегодня в течение 2х-3х часов.",
          ],
        },
        {
          title: "Условия доставки",
          items: [
            "мы осуществляем доставку круглосуточно и без выходных,",
            "мы можем выполнить доставку в срочном порядке: время доставки – менее 1.5 часа.",
          ],
        },
      ],
      more: { label: "Подробнее о доставке", href: "/faq#delivery" },
    },
    {
      id: "payment",
      title: "Оплата",
      blocks: [
        {
          title: "",
          items: [
            "Карты Uzcard и Humo",
            "Visa и Mastercard",
            "Payme и Click",
            "Наличными курьеру при получении",
          ],
        },
      ],
      more: { label: "Подробнее об оплате", href: "/faq#payment" },
    },
    {
      id: "bonuses",
      title: "Бонусы",
      blocks: [
        {
          title: "",
          items: [
            "Бесплатное фото букета до отправки (по запросу)",
            "Бесплатное фото получателя (с согласия получателя)",
            "Бесплатная записка с букетом",
            "Возможность приложить открытку к заказу",
          ],
        },
      ],
    },
    {
      id: "return",
      title: "Правила возврата",
      blocks: [
        {
          title: "",
          items: [
            "Вы можете бесплатно отменить заказ до начала сборки букета. Деньги вернутся вам в полном размере. Для отмены заказа свяжитесь с менеджером по телефону или через WhatsApp.",
          ],
        },
      ],
    },
  ] as const;
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const flower = isFlowerProduct(product);
  const [packId, setPackId] = useState<string>("none");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("delivery");
  const [infoSections, setInfoSections] = useState(() => getInfoSections());
  const albumRef = useRef<HTMLDivElement>(null);
  const details = getProductDetails(product);
  const related = getRelated(product);
  const categories = productCategories(product);
  const packaging = PACKAGING_OPTIONS.find((p) => p.id === packId) ?? PACKAGING_OPTIONS[0];

  useEffect(() => {
    setInfoSections(getInfoSections(new Date()));
  }, []);

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
            { label: "Главная", href: "/" },
            { label: "Магазин", href: "/catalog/shop" },
            {
              label: categoryLabel(product.category),
              href: categoryPath(product.category),
            },
            { label: product.name },
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

              <div className="pdp__price-row">
                <p className="pdp__price">{formatPrice(totalPrice)}</p>
                {product.oldPrice != null && (
                  <p className="pdp__old">{formatPrice(product.oldPrice)}</p>
                )}
              </div>
              {flower && packaging.price > 0 && (
                <p className="pdp__price-note">
                  товар {formatPrice(product.price)} + упаковка{" "}
                  {formatPrice(packaging.price)}
                  {qty > 1 ? ` × ${qty}` : ""}
                </p>
              )}

              {flower && (
                <>
                  <p className="pdp__label">Выберите упаковку:</p>
                  <div className="pdp__packs">
                    {PACKAGING_OPTIONS.map((pack) => (
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
                          {pack.price > 0 ? ` (${formatPrice(pack.price)})` : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              <p className="pdp__label">Кол-во:</p>
              <div className="pdp__qty">
                <button
                  type="button"
                  aria-label="Меньше"
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
                  aria-label="Больше"
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
                  {added ? "Добавлено" : "В корзину"}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--wide"
                  onClick={onBuyOneClick}
                >
                  Купить в 1 клик
                </button>
              </div>

              <p className="pdp__cats">
                Категории:{" "}
                {categories.map((cat, i) => (
                  <span key={`${cat.href}-${cat.label}`}>
                    {i > 0 && ", "}
                    <Link href={cat.href}>{cat.label}</Link>
                  </span>
                ))}
              </p>

              <div className="pdp__desc">
                <h2>Описание / Состав</h2>
                {details.notice && <p className="pdp__notice">{details.notice}</p>}
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
                            <Link href={section.more.href} className="pdp__acc-more">
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
              <h2 className="section__title">С этим товаром покупают</h2>
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
