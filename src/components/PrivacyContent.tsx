"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";

export function PrivacyContent() {
  const t = useT();

  return (
    <main className="page-main">
      <div className="container legal">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("privacy.title") },
          ]}
        />
        <h1 className="page-title">{t("privacy.title")}</h1>
        <p className="legal__lead">
          {t("privacy.intro", { name: site.name })}
        </p>

        <section className="legal__section">
          <h2>{t("privacy.hWhat")}</h2>
          <p>{t("privacy.pWhat1")}</p>
          <p>{t("privacy.pWhat2")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("privacy.hWhy")}</h2>
          <ul>
            <li>{t("privacy.why1")}</li>
            <li>{t("privacy.why2")}</li>
            <li>{t("privacy.why3")}</li>
            <li>{t("privacy.why4")}</li>
            <li>{t("privacy.why5")}</li>
          </ul>
        </section>

        <section className="legal__section">
          <h2>{t("privacy.hShare")}</h2>
          <p>{t("privacy.pShare")}</p>
        </section>

        <section className="legal__section">
          <h2>{t("privacy.hRights")}</h2>
          <p>
            {t("privacy.pRights", { email: site.email, phone: site.phone })}
          </p>
        </section>
      </div>
    </main>
  );
}
