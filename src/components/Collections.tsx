"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Collection } from "@/data/products";
import { tCategoryByHref } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowRightIcon } from "./Icons";
import { Skeleton } from "./Skeleton";

type CollectionsProps = {
  title: string;
  href: string;
  items: Collection[];
};

function CollectionCard({
  item,
  name,
}: {
  item: Collection;
  name: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={item.href} className="collection-card">
      <span className="collection-card__media">
        {!loaded && <Skeleton className="skel--fill skel--media" />}
        <Image
          src={item.image}
          alt={name}
          fill
          className={`collection-card__img${loaded ? " is-loaded" : ""}`}
          sizes="(max-width: 700px) 50vw, 20vw"
          onLoad={() => setLoaded(true)}
        />
      </span>
      <span className="collection-card__name">{name}</span>
    </Link>
  );
}

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
            return <CollectionCard key={item.id} item={item} name={name} />;
          })}
        </div>
      </div>
    </section>
  );
}
