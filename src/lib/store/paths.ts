import path from "path";

export const STORE_DIR = path.join(process.cwd(), "data", "store");
export const PRODUCTS_FILE = path.join(STORE_DIR, "products.json");
export const ORDERS_FILE = path.join(STORE_DIR, "orders.json");
