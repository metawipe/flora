import { cookies } from "next/headers";
import { isSupabaseAdmin } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const COOKIE = "zg_admin";

/** Legacy password gate (used when Supabase is not configured). */
export function adminPassword() {
  const fromEnv =
    process.env.ZAMIN_ADMIN_PASSWORD?.trim() ||
    process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== "production") return "zamin2026";
  return "";
}

export function adminToken() {
  const fromEnv = process.env.ADMIN_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const password = adminPassword();
  return password ? `zg_${password}` : "";
}

async function isLegacyAdminCookie() {
  const token = adminToken();
  if (!token) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token;
}

/** True if Supabase session is admin, or legacy admin cookie (local/FS mode). */
export async function isAdminAuthenticated() {
  if (isSupabaseConfigured()) {
    if (await isSupabaseAdmin()) return true;
    return false;
  }
  return isLegacyAdminCookie();
}

export function adminCookieHeader(token: string) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearAdminCookieHeader() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE as ADMIN_COOKIE };
