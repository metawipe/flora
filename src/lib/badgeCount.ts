/** Cap badge labels so they stay readable on small icons. */
export function badgeCount(n: number): string {
  if (n <= 0) return "";
  return n > 99 ? "99+" : String(n);
}
