export type OrderLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

export type StoredOrder = {
  id: string;
  createdAt: string;
  status?: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  slot: string;
  pay: string;
  comment: string;
  recipient?: string;
  cardText?: string;
  promoCode: string | null;
  discount: number;
  total: number;
  items: OrderLine[];
};

export const ORDERS_KEY = "zamin-orders";

export function loadOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as StoredOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: StoredOrder[]) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
