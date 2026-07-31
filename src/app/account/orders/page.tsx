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
            <div className="alert">У вас пока нет заказов</div>
          </div>
        </div>
      </div>
    </main>
  );
}
