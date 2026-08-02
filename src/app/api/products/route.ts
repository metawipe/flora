import { NextResponse } from "next/server";
import { listProducts } from "@/lib/store/catalogDb";

export const runtime = "nodejs";

/** Public catalog — only available products */
export async function GET() {
  try {
    return NextResponse.json({
      products: listProducts({ includeUnavailable: false }),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
