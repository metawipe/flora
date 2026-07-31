import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/data/products";
import { ArrowRightIcon } from "./Icons";

type CollectionsProps = {
  title: string;
  href: string;
  items: Collection[];
};

export function Collections({ title, href, items }: CollectionsProps) {
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
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="collection-card">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="collection-card__img"
                sizes="(max-width: 700px) 50vw, 20vw"
              />
              <div className="collection-card__shade" />
              <span className="collection-card__name">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
