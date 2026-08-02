"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/products";
import { useT } from "@/i18n/LocaleProvider";

const TAB_IDS = ["general", "delivery", "payment", "return"] as const;

export default function FaqPage() {
  const t = useT();
  const [tab, setTab] = useState<(typeof TAB_IDS)[number]>("general");
  const [open, setOpen] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      {
        id: "general" as const,
        label: t("faq.tabGeneral"),
        items: [
          { q: t("faq.g1q"), a: t("faq.g1a") },
          { q: t("faq.g2q"), a: t("faq.g2a") },
          { q: t("faq.g3q"), a: t("faq.g3a") },
          {
            q: t("faq.g4q"),
            a: t("faq.g4a", { phone: site.phone, email: site.email }),
          },
        ],
      },
      {
        id: "delivery" as const,
        label: t("faq.tabDelivery"),
        items: [
          { q: t("faq.d1q"), a: t("faq.d1a") },
          {
            q: t("faq.d2q"),
            a: t("faq.d2a", { phone: site.phone }),
          },
          { q: t("faq.d3q"), a: t("faq.d3a") },
          { q: t("faq.d4q"), a: t("faq.d4a") },
        ],
      },
      {
        id: "payment" as const,
        label: t("faq.tabPayment"),
        items: [
          { q: t("faq.p1q"), a: t("faq.p1a") },
          { q: t("faq.p2q"), a: t("faq.p2a") },
        ],
      },
      {
        id: "return" as const,
        label: t("faq.tabReturn"),
        items: [
          { q: t("faq.r1q"), a: t("faq.r1a") },
          { q: t("faq.r2q"), a: t("faq.r2a") },
        ],
      },
    ],
    [t],
  );

  const current = tabs.find((item) => item.id === tab) || tabs[0];

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "contacts") {
      setTab("general");
      return;
    }
    if ((TAB_IDS as readonly string[]).includes(hash)) {
      setTab(hash as (typeof TAB_IDS)[number]);
    }
  }, []);

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("faq.title") },
          ]}
        />
        <h1 className="page-title">{t("faq.title")}</h1>

        <div className="faq-tabs">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`faq-tabs__btn${tab === item.id ? " is-active" : ""}`}
              onClick={() => {
                setTab(item.id);
                setOpen(null);
              }}
            >
              {item.label}
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
