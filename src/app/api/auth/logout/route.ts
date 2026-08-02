import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { clearAdminCookieHeader } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const sb = await createClient();
      await sb.auth.signOut();
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", clearAdminCookieHeader());
  return res;
}
