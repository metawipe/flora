import Image from "next/image";
import { partners } from "@/data/products";

export function Partners() {
  return (
    <section className="section partners">
      <div className="container">
        <div className="section__head partners__head">
          <h2 className="section__title">Наши клиенты и партнеры</h2>
        </div>
        <div className="partners__grid">
          {partners.map((partner) => (
            <div key={partner.name} className="partners__item" title={partner.name}>
              <Image
                src={partner.src}
                alt={partner.name}
                width={140}
                height={60}
                className="partners__img"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
