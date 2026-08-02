import { NextResponse } from "next/server";
import { createOrder } from "@/lib/store/ordersDb";
import type { StoreOrderLine } from "@/lib/store/types";
import { notifyOrderTelegram } from "@/lib/telegram";

export const runtime = "nodejs";

type Body = {
  name: string;
  phone: string;
  address: string;
  date: string;
  slot: string;
  pay: string;
  comment?: string;
  recipient?: string;
  cardText?: string;
  promoCode?: string | null;
  discount?: number;
  total: number;
  items: StoreOrderLine[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (
      !body?.name ||
      !body?.phone ||
      !body?.address ||
      !body?.date ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const order = createOrder({
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      address: String(body.address).trim(),
      date: String(body.date),
      slot: String(body.slot || "slotDay"),
      pay: String(body.pay || "online"),
      comment: String(body.comment || ""),
      recipient: body.recipient ? String(body.recipient) : undefined,
      cardText: body.cardText ? String(body.cardText) : undefined,
      promoCode: body.promoCode ?? null,
      discount: Number(body.discount || 0),
      total: Number(body.total || 0),
      items: body.items,
    });

    const notify = await notifyOrderTelegram(order).catch(() => ({
      ok: false,
      skipped: true,
    }));

    return NextResponse.json({ order, notify });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
