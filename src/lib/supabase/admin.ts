import { createClient } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  supabaseServiceKey,
  supabaseUrl,
} from "./env";

/** Service-role client — server only, bypasses RLS. */
export function createServiceClient() {
  const key = supabaseServiceKey();
  if (!isSupabaseConfigured() || !key) {
    throw new Error("Supabase service role is not configured");
  }
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasServiceRole() {
  return Boolean(isSupabaseConfigured() && supabaseServiceKey());
}
