export type StoreProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  images: string[];
  category: string;
  description?: string;
  /** false = hidden from shop / out of stock */
  available: boolean;
};

export type StoreOrderStatus =
  | "new"
  | "confirmed"
  | "delivering"
  | "done"
  | "cancelled";

export type StoreOrderLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

export type StoreOrder = {
  id: string;
  createdAt: string;
  status: StoreOrderStatus;
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
  items: StoreOrderLine[];
};

export type CatalogFile = {
  products: StoreProduct[];
  updatedAt: string;
};

export type OrdersFile = {
  orders: StoreOrder[];
  updatedAt: string;
};
