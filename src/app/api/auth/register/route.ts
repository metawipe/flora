import { NextResponse } from "next/server";
import { isAdminLogin } from "@/lib/adminAccess";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, loginToEmail } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "supabase_required" },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    login?: string;
    phone?: string;
    password?: string;
    name?: string;
  } | null;

  const login = String(body?.login || "").trim();
  const phone = String(body?.phone || "").trim();
  const password = String(body?.password || "");
  const name = String(body?.name || login).trim();

  if (login.length < 3) {
    return NextResponse.json({ error: "login_min" }, { status: 400 });
  }
  if (isAdminLogin(login)) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "weak" }, { status: 400 });
  }
  if (!/^\+998\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
    return NextResponse.json({ error: "phone" }, { status: 400 });
  }

  const sb = await createClient();
  const email = loginToEmail(login);
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        login: login.toLowerCase(),
        phone: phone.replace(/[\s()-]/g, ""),
        name,
        role: "customer",
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json({ error: "failed" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    profile: {
      login: login.toLowerCase(),
      phone: phone.replace(/[\s()-]/g, ""),
      name,
      role: "customer",
    },
  });
}
