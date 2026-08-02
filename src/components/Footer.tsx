"use client";

import Link from "next/link";
import { footerLinks, site } from "@/data/products";
import { tCategoryByHref, tFooterPage } from "@/i18n/catalog";
import { useLocale } from "@/i18n/LocaleProvider";

export function Footer({ compact = false }: { compact?: boolean }) {
  const { locale, t } = useLocale();

  if (compact) {
    return (
      <footer className="footer footer--compact">
        <div className="container footer__compact">
          <a href={site.phoneHref} className="footer__compact-phone">
            {site.phone}
          </a>
          <p className="footer__copy">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="footer__compact-links">
            <Link href="/faq">{t("footer.faq")}</Link>
            <Link href="/offer">{t("footer.offer")}</Link>
            <Link href="/privacy">{t("footer.privacy")}</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__label">{t("footer.orderQuestions")}</p>
            <a
              href={site.socials[0]?.href}
              target="_blank"
              rel="noreferrer"
              className="footer__write"
            >
              {t("footer.write")}
            </a>
            <p className="footer__hours">{t("site.supportNote")}</p>
            <a href={site.phoneHref} className="footer__mail">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="footer__mail">
              {site.email}
            </a>
            <p className="footer__about">{t("site.about")}</p>
          </div>

          <div>
            <p className="footer__title">{t("footer.categories")}</p>
            <div className="footer__links">
              {footerLinks.categories.map((item) => (
                <Link key={item.href} href={item.href}>
                  {tCategoryByHref(locale, item.href, item.label)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__title">{t("footer.pages")}</p>
            <div className="footer__links">
              {footerLinks.pages.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href}>
                  {tFooterPage(locale, item.href, item.label)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__title">{t("footer.socials")}</p>
            <div className="footer__links">
              {site.socials.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name === "Карта" ||
                  item.name === "Map" ||
                  item.name === "Xarita"
                    ? t("site.map")
                    : item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__info">
          <div className="footer__contacts" id="contacts">
            <p className="footer__title">{t("footer.contacts")}</p>
            <ul className="footer__contacts-list">
              <li>
                <span>{t("footer.address")}</span>{" "}
                <a
                  href={site.addressMapHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.address}
                </a>
              </li>
              <li>
                <span>{t("footer.phone")}</span>{" "}
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <span>{t("footer.email")}</span>{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span>{t("footer.hours")}</span> {t("site.hours")}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div>
            <p className="footer__legal">{site.name}</p>
            <p className="footer__legal">{t("site.tagline")}</p>
            <p className="footer__copy">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
          <div className="footer__socials">
            {site.socials.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.name === "Карта" ||
                item.name === "Map" ||
                item.name === "Xarita"
                  ? t("site.map")
                  : item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
