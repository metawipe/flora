import Image from "next/image";
import { site } from "@/data/products";

const HERO_IMAGE = "/hero-banner.jpg";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__slide is-active">
        <Image
          src={HERO_IMAGE}
          alt="Доставка цветов в Ташкенте"
          fill
          priority
          loading="eager"
          quality={95}
          className="hero__image"
          sizes="100vw"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__promo">
        <h1 className="hero__title">Доставка цветов в Ташкенте</h1>
        <a href={site.phoneHref} className="hero__phone">
          {site.phone}
        </a>
        <p className="hero__sub">Бесплатная доставка по городу</p>
      </div>
    </section>
  );
}
