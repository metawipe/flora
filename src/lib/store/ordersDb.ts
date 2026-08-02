import fs from "fs";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  fromStoreOrder,
  toStoreOrder,
  type DbOrder,
} from "@/lib/supabase/mappers";
import { ORDERS_FILE, STORE_DIR } from "./paths";
import type { OrdersFile, StoreOrder, StoreOrderStatus } from "./types";

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

function readOrdersFs(): OrdersFile {
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

function writeOrdersFs(orders: StoreOrder[]) {
  ensureDir();
  const file: OrdersFile = {
    orders,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(file, null, 2), "utf8");
  return file;
}

function useSupabase() {
  return isSupabaseConfigured() && hasServiceRole();
}

export async function listOrders() {
  if (useSupabase()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data as DbOrder[]).map(toStoreOrder);
  }
  return readOrdersFs().orders;
}

export async function createOrder(
  order: Omit<StoreOrder, "id" | "createdAt" | "status"> & {
    status?: StoreOrderStatus;
  },
  userId?: string | null,
) {
  const full: StoreOrder = {
    ...order,
    id: `ZG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: order.status ?? "new",
  };

  if (useSupabase()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("orders")
      .insert(fromStoreOrder(full, userId))
      .select("*")
      .single();
    if (error) throw error;
    return toStoreOrder(data as DbOrder);
  }

  const file = readOrdersFs();
  const next = [full, ...file.orders].slice(0, 200);
  writeOrdersFs(next);
  return full;
}

export async function updateOrderStatus(id: string, status: StoreOrderStatus) {
  if (useSupabase()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? toStoreOrder(data as DbOrder) : null;
  }
  const file = readOrdersFs();
  const idx = file.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  file.orders[idx] = { ...file.orders[idx], status };
  writeOrdersFs(file.orders);
  return file.orders[idx];
}
