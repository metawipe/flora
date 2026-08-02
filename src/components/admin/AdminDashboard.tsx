"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { StoreOrder, StoreProduct } from "@/lib/store/types";

type Tab = "orders" | "products";

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<StoreProduct | null>(null);

  const load = useCallback(async () => {
    setError("");
    const [oRes, pRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/products"),
    ]);
    if (oRes.status === 401 || pRes.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!oRes.ok || !pRes.ok) {
      setError("Не удалось загрузить данные");
      return;
    }
    const oJson = (await oRes.json()) as { orders: StoreOrder[] };
    const pJson = (await pRes.json()) as { products: StoreProduct[] };
    setOrders(oJson.orders);
    setProducts(pJson.products);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const setStatus = async (id: string, status: StoreOrder["status"]) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    void load();
  };

  const toggleAvailable = async (p: StoreProduct) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !p.available }),
    });
    void load();
  };

  const removeProduct = async (id: string) => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    void load();
  };

  const saveProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      id: String(fd.get("id") || editing?.id || ""),
      name: String(fd.get("name") || ""),
      price: Number(fd.get("price") || 0),
      oldPrice: fd.get("oldPrice")
        ? Number(fd.get("oldPrice"))
        : undefined,
      category: String(fd.get("category") || "bouquets"),
      badge: String(fd.get("badge") || "") || undefined,
      images: String(fd.get("images") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      description: String(fd.get("description") || "") || undefined,
      available: fd.get("available") === "on",
    };
    if (editing) {
      await fetch(`/api/admin/products/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setEditing(null);
    e.currentTarget.reset();
    void load();
  };

  return (
    <div className="admin">
      <header className="admin__top">
        <div>
          <strong>Zamin Gullari</strong>
          <span>Админка</span>
        </div>
        <div className="admin__top-actions">
          <Link href="/" className="admin-link">
            На сайт
          </Link>
          <button type="button" className="admin-link" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <nav className="admin__tabs">
        <button
          type="button"
          className={tab === "orders" ? "is-active" : ""}
          onClick={() => setTab("orders")}
        >
          Заказы ({orders.length})
        </button>
        <button
          type="button"
          className={tab === "products" ? "is-active" : ""}
          onClick={() => setTab("products")}
        >
          Товары ({products.length})
        </button>
      </nav>

      {error ? <p className="admin__error">{error}</p> : null}

      {tab === "orders" ? (
        <section className="admin__panel">
          {orders.length === 0 ? (
            <p className="admin__empty">Заказов пока нет</p>
          ) : (
            <div className="admin-orders">
              {orders.map((o) => (
                <article key={o.id} className="admin-order">
                  <header>
                    <strong>{o.id}</strong>
                    <span>{new Date(o.createdAt).toLocaleString("ru-RU")}</span>
                  </header>
                  <p>
                    {o.name} · {o.phone}
                  </p>
                  <p>
                    {o.address} · {o.date} · {o.slot}
                  </p>
                  {o.recipient ? <p>Получатель: {o.recipient}</p> : null}
                  {o.cardText ? <p>Открытка: {o.cardText}</p> : null}
                  <ul>
                    {o.items.map((i) => (
                      <li key={i.id}>
                        {i.name} × {i.qty} — {i.price * i.qty}
                      </li>
                    ))}
                  </ul>
                  <div className="admin-order__foot">
                    <strong>{o.total.toLocaleString("ru-RU")} сум</strong>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        void setStatus(
                          o.id,
                          e.target.value as StoreOrder["status"],
                        )
                      }
                    >
                      <option value="new">Новый</option>
                      <option value="confirmed">Подтверждён</option>
                      <option value="delivering">Доставляется</option>
                      <option value="done">Выполнен</option>
                      <option value="cancelled">Отменён</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="admin__panel">
          <form className="admin-form" onSubmit={saveProduct} key={editing?.id || "new"}>
            <h2>{editing ? "Редактировать товар" : "Новый товар"}</h2>
            <div className="admin-form__grid">
              <label>
                ID
                <input
                  name="id"
                  defaultValue={editing?.id || ""}
                  placeholder="auto"
                  disabled={Boolean(editing)}
                />
              </label>
              <label>
                Название *
                <input name="name" required defaultValue={editing?.name || ""} />
              </label>
              <label>
                Цена *
                <input
                  name="price"
                  type="number"
                  required
                  defaultValue={editing?.price || ""}
                />
              </label>
              <label>
                Старая цена
                <input
                  name="oldPrice"
                  type="number"
                  defaultValue={editing?.oldPrice || ""}
                />
              </label>
              <label>
                Категория
                <select
                  name="category"
                  defaultValue={editing?.category || "bouquets"}
                >
                  <option value="bouquets">Букеты</option>
                  <option value="roses">Розы</option>
                  <option value="plants">Разные</option>
                  <option value="boxes">Коробки</option>
                  <option value="baskets">Корзины</option>
                </select>
              </label>
              <label>
                Бейдж
                <select name="badge" defaultValue={editing?.badge || ""}>
                  <option value="">—</option>
                  <option value="HIT">HIT</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                  <option value="VIP">VIP</option>
                </select>
              </label>
            </div>
            <label>
              Картинки (URL, по строке)
              <textarea
                name="images"
                rows={3}
                defaultValue={(editing?.images || []).join("\n")}
                placeholder="/hero/seasonal.jpg"
              />
            </label>
            <label>
              Описание
              <textarea
                name="description"
                rows={2}
                defaultValue={editing?.description || ""}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                name="available"
                defaultChecked={editing ? editing.available : true}
              />
              В наличии (показывать в магазине)
            </label>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn--primary">
                {editing ? "Сохранить" : "Добавить"}
              </button>
              {editing ? (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setEditing(null)}
                >
                  Отмена
                </button>
              ) : null}
            </div>
          </form>

          <div className="admin-products">
            {products.map((p) => (
              <article key={p.id} className="admin-product">
                <div>
                  <strong>{p.name}</strong>
                  <p>
                    {p.price.toLocaleString("ru-RU")} сум · {p.category} ·{" "}
                    {p.available ? "в наличии" : "нет"}
                  </p>
                </div>
                <div className="admin-product__actions">
                  <button type="button" onClick={() => setEditing(p)}>
                    Изменить
                  </button>
                  <button type="button" onClick={() => void toggleAvailable(p)}>
                    {p.available ? "Скрыть" : "В наличии"}
                  </button>
                  <button type="button" onClick={() => void removeProduct(p.id)}>
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
