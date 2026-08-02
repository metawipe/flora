import fs from "fs";
import { ORDERS_FILE, STORE_DIR } from "./paths";
import type { OrdersFile, StoreOrder, StoreOrderStatus } from "./types";

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

export function readOrdersFile(): OrdersFile {
  ensureDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    const empty: OrdersFile = {
      orders: [],
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")) as OrdersFile;
}

export function writeOrdersFile(orders: StoreOrder[]) {
  ensureDir();
  const file: OrdersFile = {
    orders,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(file, null, 2), "utf8");
  return file;
}

export function listOrders() {
  return readOrdersFile().orders;
}

export function createOrder(
  order: Omit<StoreOrder, "id" | "createdAt" | "status"> & {
    status?: StoreOrderStatus;
  },
) {
  const file = readOrdersFile();
  const full: StoreOrder = {
    ...order,
    id: `ZG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: order.status ?? "new",
  };
  const next = [full, ...file.orders].slice(0, 200);
  writeOrdersFile(next);
  return full;
}

export function updateOrderStatus(id: string, status: StoreOrderStatus) {
  const file = readOrdersFile();
  const idx = file.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  file.orders[idx] = { ...file.orders[idx], status };
  writeOrdersFile(file.orders);
  return file.orders[idx];
}
