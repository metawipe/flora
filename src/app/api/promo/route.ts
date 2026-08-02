import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-only promo table — not shipped in the client bundle. */
const PROMO_CODES: Record<string, { percent: number; labelKey: string }> = {
  LOVE10: { percent: 10, labelKey: "cart.promoLove10" },
  FLOWERS: { percent: 5, labelKey: "cart.promoFlowers" },
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { code?: string } | null;
  const code = String(body?.code ?? "")
    .trim()
    .toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    code,
    percent: promo.percent,
    labelKey: promo.labelKey,
  });
}

export function promoPercentFor(code: string | null): number {
  if (!code) return 0;
  return PROMO_CODES[code.toUpperCase()]?.percent ?? 0;
}
