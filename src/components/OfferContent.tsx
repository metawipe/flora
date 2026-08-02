"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";

export function OfferContent() {
  const t = useT();

  return (
    <main className="page-main">
      <div className="container legal">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("offer.title") },
          ]}
        />
        <h1 className="page-title">{t("offer.title")}</h1>
        <p className="legal__lead">{t("offer.intro", { name: site.name })}</p>

        <section className="legal__section">
          <h2>{t("offer.h1")}</h2>
          <p>{t("offer.s1p1")}</p>
          <p>
            {t("offer.s1p2", {
              phone: site.phone,
              email: site.email,
              hours: t("site.hours"),
            })}
          </p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h2")}</h2>
          <p>{t("offer.s2p1")}</p>
          <p>{t("offer.s2p2")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h3")}</h2>
          <ol>
            <li>{t("offer.s3li1")}</li>
            <li>{t("offer.s3li2")}</li>
            <li>{t("offer.s3li3")}</li>
            <li>{t("offer.s3li4")}</li>
          </ol>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h4")}</h2>
          <p>{t("offer.s4p1")}</p>
          <p>{t("offer.s4p2")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h5")}</h2>
          <p>{t("offer.s5p1")}</p>
          <p>{t("offer.s5p2")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h6")}</h2>
          <p>{t("offer.s6p1")}</p>
          <p>{t("offer.s6p2")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h7")}</h2>
          <p>{t("offer.s7p1")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h8")}</h2>
          <p>{t("offer.s8p1")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("offer.h9")}</h2>
          <p>
            {t("offer.s9p1", { phone: site.phone, email: site.email })}
          </p>
        </section>
      </div>
    </main>
  );
}
