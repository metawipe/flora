import { NextResponse } from "next/server";
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
    password?: string;
  } | null;

  const login = String(body?.login || "").trim();
  const password = String(body?.password || "");
  if (!login || !password) {
    return NextResponse.json({ error: "bad" }, { status: 401 });
  }

  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword({
    email: loginToEmail(login),
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: "bad" }, { status: 401 });
  }

  const { data: profile } = await sb
    .from("profiles")
    .select("login, phone, name, last_name, email, address, role")
    .eq("id", data.user.id)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    profile: {
      login: String(profile?.login || login.toLowerCase()),
      phone: String(profile?.phone || ""),
      name: profile?.name ?? undefined,
      lastName: profile?.last_name ?? undefined,
      email: profile?.email ?? undefined,
      address: profile?.address ?? undefined,
      role: profile?.role === "admin" ? "admin" : "customer",
    },
  });
}
