import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  deleteProduct,
  getStoreProduct,
  upsertProduct,
} from "@/lib/store/catalogDb";
import type { StoreProduct } from "@/lib/store/types";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await getStoreProduct(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await req.json()) as Partial<StoreProduct>;
  const next: StoreProduct = {
    ...existing,
    ...body,
    id: existing.id,
    price: body.price != null ? Number(body.price) : existing.price,
    oldPrice:
      body.oldPrice === null
        ? undefined
        : body.oldPrice != null
          ? Number(body.oldPrice)
          : existing.oldPrice,
    available:
      body.available != null ? Boolean(body.available) : existing.available,
    images: Array.isArray(body.images)
      ? body.images.map(String)
      : existing.images,
  };
  await upsertProduct(next);
  return NextResponse.json({ product: next });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
