import Image from "next/image";
import Link from "next/link";
import { seasonalHero, site } from "@/data/products";

export function Hero() {
  return (
    <section className="hero hero-enter">
      <div className="hero__media">
        <Image
          src={seasonalHero.image}
          alt={seasonalHero.alt}
          fill
          priority
          loading="eager"
          quality={90}
          className="hero__image"
          sizes="100vw"
        />
        <div className="hero__shade" aria-hidden />
      </div>

      <div className="hero__promo">
        <div className="hero__brand hero-rise hero-rise--1">
          <Image
            src="/logo-flower-v3.png"
            alt=""
            width={84}
            height={64}
            className="hero__mark"
            priority
          />
          <div className="hero__brand-text">
            <p className="hero__name">Zamin</p>
            <p className="hero__script">Gullari</p>
          </div>
        </div>

        <h1 className="hero__title hero-rise hero-rise--2">
          {seasonalHero.line}
        </h1>
        <a
          href={site.phoneHref}
          className="hero__phone hero-rise hero-rise--3"
        >
          {site.phone}
        </a>
        <p className="hero__sub hero-rise hero-rise--3">
          {seasonalHero.note}
        </p>
        <div className="hero__actions hero-rise hero-rise--3">
          <Link href={seasonalHero.ctaHref} className="btn btn--brand">
            {seasonalHero.ctaLabel}
          </Link>
          <Link href={seasonalHero.productHref} className="btn btn--ghost-light">
            Этот букет
          </Link>
        </div>
      </div>
    </section>
  );
}
