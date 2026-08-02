"use client";

import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/data/products";
import { tCategoryByHref } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowRightIcon } from "./Icons";

type CollectionsProps = {
  title: string;
  href: string;
  items: Collection[];
};

export function Collections({ title, href, items }: CollectionsProps) {
  const { locale } = useLocale();

  return (
    <section className="section">
      <div className="container">
        <Link href={href} className="section__head">
          <h2 className="section__title">{title}</h2>
          <span className="section__arrow" aria-hidden>
            <ArrowRightIcon />
          </span>
        </Link>

        <div className="collections-grid">
          {items.map((item) => {
            const name = tCategoryByHref(locale, item.href, item.name);
            return (
              <Link key={item.id} href={item.href} className="collection-card">
                <Image
                  src={item.image}
                  alt={name}
                  fill
                  className="collection-card__img"
                  sizes="(max-width: 700px) 50vw, 20vw"
                />
                <div className="collection-card__shade" />
                <span className="collection-card__name">{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
