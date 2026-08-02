import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "supabase_required" }, { status: 503 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null;

  const patch: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };
  if (body?.name != null) patch.name = String(body.name);
  if (body?.lastName != null) patch.last_name = String(body.lastName);
  if (body?.email != null) patch.email = String(body.email);
  if (body?.phone != null) patch.phone = String(body.phone);
  if (body?.address != null) patch.address = String(body.address);

  const { data, error } = await sb
    .from("profiles")
    .update(patch)
    .eq("id", user.id)
    .select("login, phone, name, last_name, email, address, role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    profile: {
      login: String(data.login),
      phone: String(data.phone || ""),
      name: data.name ?? undefined,
      lastName: data.last_name ?? undefined,
      email: data.email ?? undefined,
      address: data.address ?? undefined,
      role: data.role === "admin" ? "admin" : "customer",
    },
  });
}
