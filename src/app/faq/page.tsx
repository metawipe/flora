"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const TABS = [
  {
    id: "general",
    label: "Общие вопросы",
    items: [
      {
        q: "Как оформить заказ на сайте Uzflora?",
        a: "Выберите букет, размер и нажмите «В корзину». Затем перейдите к оформлению, укажите адрес в Ташкенте, телефон и удобное время доставки.",
      },
      {
        q: "Можно ли заказать букет без регистрации?",
        a: "Да. Для оформления достаточно имени и номера телефона. Регистрация нужна, чтобы сохранять избранное и историю заказов.",
      },
      {
        q: "Какие цветы вы доставляете?",
        a: "Розы, пионы, тюльпаны, хризантемы, гортензии, эустомы, комнатные растения, подарки и VIP-композиции — всё из актуального каталога.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Доставка",
    items: [
      {
        q: "Есть ли доставка в день заказа?",
        a: "Да, по Ташкенту доставляем в день заказа при наличии свободного окна. Заказы принимаем круглосуточно, поддержка 24/7.",
      },
      {
        q: "Доставляете ли вы по Узбекистану?",
        a: "Основная доставка — Ташкент. По другим городам уточняйте у менеджера: +998 (90) 808 34 37.",
      },
      {
        q: "Сколько стоит доставка?",
        a: "По Ташкенту доставка часто бесплатная. Точные условия покажем при оформлении заказа.",
      },
    ],
  },
  {
    id: "payment",
    label: "Оплата",
    items: [
      {
        q: "Какими картами можно оплатить?",
        a: "Принимаем Uzcard, Humo, Visa, Mastercard, Mir и PayPal. Также доступна оплата наличными курьеру.",
      },
      {
        q: "Можно ли оплатить частично?",
        a: "Да, доступна рассрочка/разделение платежа с партнёрами — детали на карточке товара и в корзине.",
      },
    ],
  },
  {
    id: "return",
    label: "Возврат",
    items: [
      {
        q: "Что делать, если букет пришёл несвежим?",
        a: "Напишите в поддержку в течение 2 часов после получения и пришлите фото. Мы заменим букет или вернём деньги.",
      },
      {
        q: "Можно ли отменить заказ?",
        a: "Да, если курьер ещё не выехал. Свяжитесь с нами по телефону или в Telegram как можно скорее.",
      },
    ],
  },
];

export default function FaqPage() {
  const [tab, setTab] = useState(TABS[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const current = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Помощь", href: "/faq" },
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
            const id = `${tab}-${item.q}`;
            const isOpen = open === id;
            return (
              <div key={id} className={`faq-item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__head"
                  onClick={() => setOpen(isOpen ? null : id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
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
