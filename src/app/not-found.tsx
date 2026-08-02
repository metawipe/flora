import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <div className="container">
        <div className="empty-state empty-state--alive">
          <p className="empty-state__title">404</p>
          <p className="empty-state__desc">
            Страница не найдена. Возможно, букет уже разобрали — загляните в
            каталог.
          </p>
          <div className="empty-state__actions">
            <Link href="/catalog/shop" className="btn btn--primary">
              В каталог
            </Link>
            <Link href="/" className="btn btn--ghost">
              На главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
