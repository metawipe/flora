"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { collections } from "@/data/products";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useT } from "@/i18n/LocaleProvider";
import { Skeleton } from "./Skeleton";

type Occasion = {
  id: string;
  labelKey: string;
  href: string;
  image: string;
};

function pickImage(hrefIncludes: string, fallback: string) {
  return (
    collections.find((c) => c.href.includes(hrefIncludes))?.image || fallback
  );
}

const OCCASIONS: Occasion[] = [
  {
    id: "birthday",
    labelKey: "home.occasionBirthday",
    href: "/catalog/occasion-birthday",
    image: pickImage("bouquets", "/hero/seasonal.jpg"),
  },
  {
    id: "love",
    labelKey: "home.occasionLove",
    href: "/catalog/occasion-love",
    image: pickImage("roses", "/hero/seasonal.jpg"),
  },
  {
    id: "sorry",
    labelKey: "home.occasionSorry",
    href: "/catalog/occasion-sorry",
    image: pickImage("tulips", "/hero/seasonal.jpg"),
  },
  {
    id: "date",
    labelKey: "home.occasionDate",
    href: "/catalog/occasion-date",
    image: pickImage("boxes", "/hero/seasonal.jpg"),
  },
  {
    id: "thanks",
    labelKey: "home.occasionThanks",
    href: "/catalog/occasion-thanks",
    image: pickImage("baskets", "/hero/seasonal.jpg"),
  },
  {
    id: "sale",
    labelKey: "home.occasionSale",
    href: "/catalog/occasion-sale",
    image: pickImage("popular", "/hero/seasonal.jpg"),
  },
];

function OccasionTile({ item, label }: { item: Occasion; label: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={item.href} className="home-occasion" draggable={false}>
      <span className="home-occasion__ring">
        {!loaded && <Skeleton className="skel--fill skel--media" />}
        <Image
          src={item.image}
          alt=""
          fill
          sizes="88px"
          draggable={false}
          className={`home-occasion__img${loaded ? " is-loaded" : ""}`}
          onLoad={() => setLoaded(true)}
        />
      </span>
      <span className="home-occasion__label">{label}</span>
    </Link>
  );
}

/** Emotional entry — not flower types (those are in CatalogBar). */
export function HomeOccasions() {
  const t = useT();
  const rowRef = useDragScroll<HTMLDivElement>();

  return (
    <section className="home-occasions" aria-label={t("home.occasionsAria")}>
      <div className="container">
        <div className="section__head home-occasions__head">
          <h2 className="section__title">{t("home.occasionsTitle")}</h2>
        </div>
        <div className="home-occasions__row drag-scroll" ref={rowRef}>
          {OCCASIONS.map((item) => (
            <OccasionTile
              key={item.id}
              item={item}
              label={t(item.labelKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
