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
  const expected = adminPassword();
  const token = adminToken();
  const password = String(body?.password ?? "").trim();
  if (!expected || !token || !password || password !== expected) {
    return NextResponse.json(
      {
        error: expected
          ? "Wrong password"
          : "ADMIN_PASSWORD is not configured on the server",
      },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", adminCookieHeader(token));
  return res;
}
