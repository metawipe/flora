import { cookies } from "next/headers";

const COOKIE = "zg_admin";

/** No hardcoded production default — set ADMIN_PASSWORD in env. */
export function adminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  // Local/dev only fallback so `next dev` still works
  if (process.env.NODE_ENV !== "production") return "zamin2026";
  return "";
}

export function adminToken() {
  const fromEnv = process.env.ADMIN_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const password = adminPassword();
  return password ? `zg_${password}` : "";
}

export async function isAdminAuthenticated() {
  const token = adminToken();
  if (!token) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token;
}

export function adminCookieHeader(token: string) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearAdminCookieHeader() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE as ADMIN_COOKIE };
