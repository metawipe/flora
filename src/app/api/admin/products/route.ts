import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  listProducts,
  upsertProduct,
} from "@/lib/store/catalogDb";
import type { StoreProduct } from "@/lib/store/types";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ products: listProducts({ includeUnavailable: true }) });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Partial<StoreProduct>;
  if (!body.name || body.price == null) {
    return NextResponse.json({ error: "name and price required" }, { status: 400 });
  }
  const product: StoreProduct = {
    id: body.id?.trim() || `p-${Date.now().toString(36)}`,
    name: String(body.name).trim(),
    price: Number(body.price),
    oldPrice: body.oldPrice != null ? Number(body.oldPrice) : undefined,
    badge: body.badge || undefined,
    images:
      Array.isArray(body.images) && body.images.length
        ? body.images.map(String)
        : ["/hero/seasonal.jpg"],
    category: String(body.category || "bouquets"),
    description: body.description || undefined,
    available: body.available !== false,
  };
  upsertProduct(product);
  return NextResponse.json({ product });
}
