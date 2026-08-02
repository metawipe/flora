import Link from "next/link";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function OrdersPage() {
  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Личный кабинет", href: "/account" },
            { label: "Заказы" },
          ]}
        />
        <h1 className="page-title">Заказы</h1>
        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            <div className="empty-state empty-state--compact">
              <p className="empty-state__title">Пока нет заказов</p>
              <p className="empty-state__desc">
                Оформите букет в корзине — менеджер подтвердит заказ по телефону
                или в мессенджере. История на сайте появится после подключения
                личного кабинета к системе заказов.
              </p>
              <Link href="/catalog/bouquets" className="btn btn--primary">
                Смотреть букеты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
