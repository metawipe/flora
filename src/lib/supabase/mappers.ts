import type { StoreOrder, StoreOrderLine, StoreProduct } from "@/lib/store/types";

export type DbProduct = {
  id: string;
  name: string;
  price: number | string;
  old_price: number | string | null;
  badge: string | null;
  images: unknown;
  category: string;
  description: string | null;
  available: boolean;
};

export type DbOrder = {
  id: string;
  created_at: string;
  status: StoreOrder["status"];
  user_id: string | null;
  name: string;
  phone: string;
  address: string;
  date: string;
  slot: string;
  pay: string;
  comment: string;
  recipient: string | null;
  card_text: string | null;
  promo_code: string | null;
  discount: number | string;
  total: number | string;
  items: unknown;
};

export function toStoreProduct(row: DbProduct): StoreProduct {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    badge: row.badge ?? undefined,
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    category: row.category,
    description: row.description ?? undefined,
    available: row.available !== false,
  };
}

export function fromStoreProduct(p: StoreProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    old_price: p.oldPrice ?? null,
    badge: p.badge ?? null,
    images: p.images,
    category: p.category,
    description: p.description ?? null,
    available: p.available !== false,
    updated_at: new Date().toISOString(),
  };
}

export function toStoreOrder(row: DbOrder): StoreOrder {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    name: row.name,
    phone: row.phone,
    address: row.address,
    date: row.date,
    slot: row.slot,
    pay: row.pay,
    comment: row.comment || "",
    recipient: row.recipient ?? undefined,
    cardText: row.card_text ?? undefined,
    promoCode: row.promo_code,
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    items: (Array.isArray(row.items) ? row.items : []) as StoreOrderLine[],
  };
}

export function fromStoreOrder(
  order: Omit<StoreOrder, "id" | "createdAt" | "status"> & {
    id: string;
    createdAt: string;
    status: StoreOrder["status"];
  },
  userId?: string | null,
) {
  return {
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    user_id: userId ?? null,
    name: order.name,
    phone: order.phone,
    address: order.address,
    date: order.date,
    slot: order.slot,
    pay: order.pay,
    comment: order.comment || "",
    recipient: order.recipient ?? null,
    card_text: order.cardText ?? null,
    promo_code: order.promoCode,
    discount: order.discount,
    total: order.total,
    items: order.items,
  };
}
