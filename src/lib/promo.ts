/** Client-safe helpers. Code → percent is resolved via /api/promo or cached percent. */

export function promoDiscountFor(
  total: number,
  code: string | null,
  percent = 0,
): number {
  if (!code || percent <= 0) return 0;
  return Math.round((total * percent) / 100);
}

export async function validatePromoCode(
  code: string,
): Promise<{ code: string; percent: number; labelKey: string } | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  try {
    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: normalized }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      code?: string;
      percent?: number;
      labelKey?: string;
    };
    if (!data.ok || !data.code || !data.percent) return null;
    return {
      code: data.code,
      percent: data.percent,
      labelKey: data.labelKey || "cart.promo",
    };
  } catch {
    return null;
  }
}
