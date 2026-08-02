import { cookies } from "next/headers";

const COOKIE = "zg_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "zamin2026";
}

export function adminToken() {
  return process.env.ADMIN_TOKEN || `zg_${adminPassword()}`;
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === adminToken();
}

export function adminCookieHeader(token: string) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearAdminCookieHeader() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE as ADMIN_COOKIE };
