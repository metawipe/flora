import fs from "fs";
import mock from "@/data/mock.json";
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
        oldPrice:
          raw.oldPrice != null ? Number(raw.oldPrice) : undefined,
        badge: raw.badge != null ? String(raw.badge) : undefined,
        images: Array.isArray(raw.images)
          ? raw.images.map(String)
          : [],
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

export function readCatalog(): CatalogFile {
  ensureDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const seeded: CatalogFile = {
      products: seedProducts(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
  const raw = fs.readFileSync(PRODUCTS_FILE, "utf8");
  return JSON.parse(raw) as CatalogFile;
}

export function writeCatalog(products: StoreProduct[]) {
  ensureDir();
  const file: CatalogFile = {
    products,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(file, null, 2), "utf8");
  return file;
}

export function listProducts(opts?: { includeUnavailable?: boolean }) {
  const { products } = readCatalog();
  if (opts?.includeUnavailable) return products;
  return products.filter((p) => p.available !== false);
}

export function getStoreProduct(id: string) {
  return readCatalog().products.find((p) => p.id === id) ?? null;
}

export function upsertProduct(product: StoreProduct) {
  const file = readCatalog();
  const idx = file.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) file.products[idx] = product;
  else file.products.unshift(product);
  return writeCatalog(file.products);
}

export function deleteProduct(id: string) {
  const file = readCatalog();
  const next = file.products.filter((p) => p.id !== id);
  writeCatalog(next);
  return next.length < file.products.length;
}

export function setProductAvailable(id: string, available: boolean) {
  const p = getStoreProduct(id);
  if (!p) return null;
  const next = { ...p, available };
  upsertProduct(next);
  return next;
}
