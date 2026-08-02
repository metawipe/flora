/**
 * Reserved admin logins (cannot be registered by customers).
 * With Supabase, real admin power comes from profiles.role = 'admin'.
 *
 * Set NEXT_PUBLIC_ADMIN_LOGINS=alice,bob (comma-separated).
 * Built-in: zamin, admin
 */
const BUILTIN_ADMIN_LOGINS = ["zamin", "admin"];

function parseAllowlist(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_LOGINS ?? "";
  return [...BUILTIN_ADMIN_LOGINS, ...fromEnv.split(",")]
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function reservedAdminLogins() {
  return parseAllowlist();
}

export function isAdminLogin(login: string | null | undefined): boolean {
  if (!login) return false;
  const key = login.trim().toLowerCase();
  if (!key) return false;
  return parseAllowlist().includes(key);
}
