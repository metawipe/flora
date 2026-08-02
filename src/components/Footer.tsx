import Image from "next/image";
import Link from "next/link";
import { footerLinks, paymentsImage, site } from "@/data/products";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__label">Вопросы о заказах</p>
            <a
              href={site.socials[0]?.href}
              target="_blank"
              rel="noreferrer"
              className="footer__write"
            >
              Написать
            </a>
            <p className="footer__hours">{site.supportNote}</p>
            <a href={site.phoneHref} className="footer__mail">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="footer__mail">
              {site.email}
            </a>
            <p className="footer__about">{site.about}</p>
          </div>

          <div>
            <p className="footer__title">Категории</p>
            <div className="footer__links">
              {footerLinks.categories.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__title">Страницы</p>
            <div className="footer__links">
              {footerLinks.pages.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__title">Мы в соцсетях</p>
            <div className="footer__links">
              {site.socials.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__info">
          <div className="footer__methods">
            <p className="footer__title">Методы оплаты</p>
            <div className="footer__methods-img">
              <Image
                src={paymentsImage}
                alt="Методы оплаты"
                width={280}
                height={120}
                unoptimized
              />
            </div>
          </div>

          <div className="footer__contacts" id="contacts">
            <p className="footer__title">Наши контакты</p>
            <ul className="footer__contacts-list">
              <li>
                <span>Адрес:</span> {site.address}
              </li>
              <li>
                <span>Телефон:</span>{" "}
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <span>E-mail:</span>{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span>Время работы:</span> {site.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div>
            <p className="footer__legal">{site.name}</p>
            <p className="footer__legal">{site.tagline}</p>
            <p className="footer__copy">
              © {new Date().getFullYear()} Служба доставки цветов «Love Flowers»
              в Ташкенте, 2008–{new Date().getFullYear()}
            </p>
          </div>
          <div className="footer__socials">
            {site.socials.slice(0, 3).map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
