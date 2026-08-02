import fs from "fs";
import mock from "@/data/mock.json";
import { hasServiceRole, createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  fromStoreProduct,
  toStoreProduct,
  type DbProduct,
} from "@/lib/supabase/mappers";
import { PRODUCTS_FILE, STORE_DIR } from "./paths";
import type { CatalogFile, StoreProduct } from "./types";

function seedProducts(): StoreProduct[] {
  const buckets: Array<{ list: Array<Record<string, unknown>>; cat: string }> =
    [
      { list: mock.bouquets as Array<Record<string, unknown>>, cat: "bouquets" },
      { list: mock.plants as Array<Record<string, unknown>>, cat: "plants" },
      { list: mock.vip as Array<Record<string, unknown>>, cat: "roses" },
      { list: (mock.boxes ?? []) as Array<Record<string, unknown>>, cat: "boxes" },
      {
        list: (mock.baskets ?? []) as Array<Record<string, unknown>>,
        cat: "baskets",
      },
    ];

  const out: StoreProduct[] = [];
  for (const { list, cat } of buckets) {
    for (const raw of list) {
      out.push({
        id: String(raw.id),
        name: String(raw.name),
        price: Number(raw.price),
        oldPrice: raw.oldPrice != null ? Number(raw.oldPrice) : undefined,
        badge: raw.badge != null ? String(raw.badge) : undefined,
        images: Array.isArray(raw.images) ? raw.images.map(String) : [],
        category: String(raw.category || cat),
        description:
          raw.description != null ? String(raw.description) : undefined,
        available: raw.available === false ? false : true,
      });
    }
  }
  return out;
}

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

function readCatalogFs(): CatalogFile {
  ensureDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const seeded: CatalogFile = {
      products: seedProducts(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8")) as CatalogFile;
}

function writeCatalogFs(products: StoreProduct[]) {
  ensureDir();
  const file: CatalogFile = {
    products,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(file, null, 2), "utf8");
  return file;
}

function useSupabase() {
  return isSupabaseConfigured() && hasServiceRole();
}

export async function listProducts(opts?: { includeUnavailable?: boolean }) {
  if (useSupabase()) {
    const sb = createServiceClient();
    let q = sb.from("products").select("*").order("name");
    if (!opts?.includeUnavailable) q = q.eq("available", true);
    const { data, error } = await q;
    if (error) throw error;
    return (data as DbProduct[]).map(toStoreProduct);
  }
  const { products } = readCatalogFs();
  if (opts?.includeUnavailable) return products;
  return products.filter((p) => p.available !== false);
}

export async function getStoreProduct(id: string) {
  if (useSupabase()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? toStoreProduct(data as DbProduct) : null;
  }
  return readCatalogFs().products.find((p) => p.id === id) ?? null;
}

export async function upsertProduct(product: StoreProduct) {
  if (useSupabase()) {
    const sb = createServiceClient();
    const { error } = await sb
      .from("products")
      .upsert(fromStoreProduct(product), { onConflict: "id" });
    if (error) throw error;
    return product;
  }
  const file = readCatalogFs();
  const idx = file.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) file.products[idx] = product;
  else file.products.unshift(product);
  writeCatalogFs(file.products);
  return product;
}

export async function deleteProduct(id: string) {
  if (useSupabase()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("products")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
  const file = readCatalogFs();
  const next = file.products.filter((p) => p.id !== id);
  writeCatalogFs(next);
  return next.length < file.products.length;
}

export { seedProducts };
