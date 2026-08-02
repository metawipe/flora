"use client";

import Link from "next/link";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useT } from "@/i18n/LocaleProvider";

export default function OrdersPage() {
  const t = useT();

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("account.title"), href: "/account" },
            { label: t("orders.title") },
          ]}
        />
        <h1 className="page-title">{t("orders.title")}</h1>
        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            <div className="empty-state empty-state--compact">
              <p className="empty-state__title">{t("orders.empty")}</p>
              <p className="empty-state__desc">{t("orders.emptyHint")}</p>
              <Link href="/catalog/bouquets" className="btn btn--primary">
                {t("common.seeBouquets")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
