/**
 * Restore products / orders / profiles from a JSON backup.
 * Does NOT recreate auth passwords — re-run seed:supabase for zamin if needed.
 *
 * Usage:
 *   node --env-file=.env.local scripts/restore-supabase.mjs backups/supabase-....json
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/restore-supabase.mjs <backup.json>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const backup = JSON.parse(readFileSync(file, "utf8"));
const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function upsert(table, rows, onConflict = "id") {
  if (!rows?.length) {
    console.log(`${table}: nothing to restore`);
    return;
  }
  const { error } = await sb.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`${table}: upserted ${rows.length}`);
}

await upsert("products", backup.products);
await upsert("orders", backup.orders);
await upsert("profiles", backup.profiles);
console.log(
  "Done. Auth users are not recreated here — use Dashboard or npm run seed:supabase for zamin.",
);
