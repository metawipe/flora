"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/products";

const TABS = [
  {
    id: "general",
    label: "Общие вопросы",
    items: [
      {
        q: "Как оформить заказ на сайте Zamin Gullari?",
        a: "Выберите понравившийся букет и нажмите «В корзину». Затем перейдите к оформлению, укажите данные отправителя и получателя, адрес в Ташкенте и удобное время доставки.",
      },
      {
        q: "Можно ли заказать букет без регистрации?",
        a: "Да. Для оформления достаточно имени и номера телефона. Регистрация нужна, чтобы сохранять избранное и историю заказов.",
      },
      {
        q: "Какие цветы вы доставляете?",
        a: "Розы, тюльпаны, орхидеи, хризантемы, авторские букеты, корзины, коробки с цветами, шары и сладкие дополнения — всё из актуального каталога Zamin Gullari.",
      },
      {
        q: "Как связаться с Zamin Gullari?",
        a: `Телефон ${site.phone}, email ${site.email}. Также пишите в Telegram и WhatsApp — отвечаем круглосуточно.`,
      },
    ],
  },
  {
    id: "delivery",
    label: "Доставка",
    items: [
      {
        q: "Есть ли доставка в день заказа?",
        a: "Да. Работаем круглосуточно. Минимальный интервал доставки — около 2 часов. Точный диапазон можно согласовать с менеджером.",
      },
      {
        q: "Доставляете ли вы за пределы Ташкента?",
        a: `Основная доставка — Ташкент и Ташкентская область. По удалённым адресам уточняйте у менеджера: ${site.phone}.`,
      },
      {
        q: "Сколько стоит доставка?",
        a: "По городу Ташкент доставка бесплатная от 120 000 сум. В область стоимость зависит от удалённости — лучше уточнить при согласовании заказа.",
      },
      {
        q: "Можно ли доставить анонимно?",
        a: "Да. Получатель узнает имя отправителя только если вы укажете его в открытке.",
      },
    ],
  },
  {
    id: "payment",
    label: "Оплата",
    items: [
      {
        q: "Какими способами можно оплатить?",
        a: "Банковской картой Visa, Mastercard, Uzcard, Humo, а также Payme и Click. Для юр. лиц — безналичный расчёт через менеджера.",
      },
      {
        q: "Можно ли оплатить наличными?",
        a: "Да, доступна оплата наличными курьеру при получении.",
      },
    ],
  },
  {
    id: "return",
    label: "Возврат",
    items: [
      {
        q: "Что делать, если букет пришёл несвежим?",
        a: "Напишите в поддержку как можно скорее и пришлите фото. Мы заменим букет или вернём деньги.",
      },
      {
        q: "Можно ли отменить заказ?",
        a: "Да, если курьер ещё не выехал. Свяжитесь с нами по телефону, в Telegram или WhatsApp как можно скорее.",
      },
    ],
  },
];

export default function FaqPage() {
  const [tab, setTab] = useState(TABS[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const current = TABS.find((t) => t.id === tab) || TABS[0];

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "contacts") {
      setTab("general");
      return;
    }
    if (TABS.some((t) => t.id === hash)) {
      setTab(hash);
    }
  }, []);

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Вопросы и ответы" },
          ]}
        />
        <h1 className="page-title">Вопросы и ответы</h1>

        <div className="faq-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`faq-tabs__btn${tab === t.id ? " is-active" : ""}`}
              onClick={() => {
                setTab(t.id);
                setOpen(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {current.items.map((item) => {
            const id = `${current.id}-${item.q}`;
            const isOpen = open === id;
            return (
              <div key={id} className={`faq-item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__head"
                  onClick={() => setOpen(isOpen ? null : id)}
                >
                  {item.q}
                  <span className="faq-item__icon">{isOpen ? "−" : "+"}</span>
                </button>
                <div className="faq-item__body">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
