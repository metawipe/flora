import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ profile: null, mode: "local" });
  }
  const profile = await getSessionProfile();
  return NextResponse.json({
    profile,
    mode: "supabase",
  });
}
