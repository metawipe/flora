/**
 * Seed products + admin user `zamin` into Supabase.
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ZAMIN_ADMIN_PASSWORD (or ADMIN_PASSWORD)
 *
 * Usage: node --env-file=.env.local scripts/seed-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mock = JSON.parse(
  readFileSync(join(root, "src/data/mock.json"), "utf8"),
);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const adminPassword =
  process.env.ZAMIN_ADMIN_PASSWORD?.trim() ||
  process.env.ADMIN_PASSWORD?.trim() ||
  "zamin2026";

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function collectProducts() {
  const buckets = [
    { list: mock.bouquets, cat: "bouquets" },
    { list: mock.plants, cat: "plants" },
    { list: mock.vip, cat: "roses" },
    { list: mock.boxes ?? [], cat: "boxes" },
    { list: mock.baskets ?? [], cat: "baskets" },
  ];
  const out = [];
  for (const { list, cat } of buckets) {
    for (const raw of list) {
      out.push({
        id: String(raw.id),
        name: String(raw.name),
        price: Number(raw.price),
        old_price: raw.oldPrice != null ? Number(raw.oldPrice) : null,
        badge: raw.badge != null ? String(raw.badge) : null,
        images: Array.isArray(raw.images) ? raw.images.map(String) : [],
        category: String(raw.category || cat),
        description: raw.description != null ? String(raw.description) : null,
        available: raw.available === false ? false : true,
      });
    }
  }
  return out;
}

async function seedProducts() {
  const products = collectProducts();
  const { error } = await sb.from("products").upsert(products, {
    onConflict: "id",
  });
  if (error) throw error;
  console.log(`Upserted ${products.length} products`);
}

async function seedAdmin() {
  const email = "zamin@users.zaminguullari.local";
  const login = "zamin";

  const { data: listed } = await sb.auth.admin.listUsers({ perPage: 200 });
  const existing = listed?.users?.find(
    (u) => u.email === email || u.user_metadata?.login === login,
  );

  let userId = existing?.id;
  if (!userId) {
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        login,
        phone: "+998900000000",
        name: "Zamin Admin",
        role: "admin",
      },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Created auth user zamin");
  } else {
    const { error } = await sb.auth.admin.updateUserById(userId, {
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        login,
        phone: "+998900000000",
        name: "Zamin Admin",
        role: "admin",
      },
    });
    if (error) throw error;
    console.log("Updated auth user zamin password/metadata");
  }

  const { error: profileError } = await sb.from("profiles").upsert({
    id: userId,
    login,
    phone: "+998900000000",
    name: "Zamin Admin",
    role: "admin",
  });
  if (profileError) throw profileError;
  console.log("Upserted profiles.role=admin for zamin");
}

await seedProducts();
await seedAdmin();
console.log("Done.");
