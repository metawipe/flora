/**
 * Offline backup of shop tables (products, orders, profiles) + auth users list.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run backup:supabase
 *
 * Writes backups/supabase-YYYY-MM-DDTHH-mm-ss.json
 * Keep copies off this machine (Drive / another PC).
 */
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "backups");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchAll(table) {
  const { data, error } = await sb.from(table).select("*");
  if (error) throw new Error(`${table}: ${error.message}`);
  return data ?? [];
}

async function fetchAuthUsers() {
  const users = [];
  let page = 1;
  for (;;) {
    const { data, error } = await sb.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    users.push(...(data?.users ?? []));
    if (!data?.users?.length || data.users.length < 200) break;
    page += 1;
  }
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    user_metadata: u.user_metadata,
    // passwords are never exported — restore via seed / reset
  }));
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
mkdirSync(outDir, { recursive: true });

const payload = {
  exportedAt: new Date().toISOString(),
  projectUrl: url,
  products: await fetchAll("products"),
  orders: await fetchAll("orders"),
  profiles: await fetchAll("profiles"),
  authUsers: await fetchAuthUsers(),
};

const file = join(outDir, `supabase-${stamp}.json`);
writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");

console.log(`Backup written: ${file}`);
console.log(
  `products=${payload.products.length} orders=${payload.orders.length} profiles=${payload.profiles.length} users=${payload.authUsers.length}`,
);
console.log("Copy this file to Google Drive / another disk.");
