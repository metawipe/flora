export const PROMO_CODES: Record<
  string,
  { labelKey: string; percent: number }
> = {
  LOVE10: { labelKey: "cart.promoLove10", percent: 10 },
  FLOWERS: { labelKey: "cart.promoFlowers", percent: 5 },
};

export function promoDiscountFor(total: number, code: string | null): number {
  if (!code) return 0;
  const promo = PROMO_CODES[code];
  if (!promo) return 0;
  return Math.round((total * promo.percent) / 100);
}
