import { NextResponse } from "next/server";
import {
  adminCookieHeader,
  adminPassword,
  adminToken,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    password?: string;
  } | null;
  if (!body?.password || body.password !== adminPassword()) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", adminCookieHeader(adminToken()));
  return res;
}
