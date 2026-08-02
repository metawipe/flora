import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { UserProfile } from "@/lib/userProfile";

export type SessionProfile = UserProfile & {
  id: string;
  role: "customer" | "admin";
};

export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { data: profile } = await sb
      .from("profiles")
      .select("login, phone, name, last_name, email, address, role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) return null;
    return {
      id: user.id,
      login: String(profile.login),
      phone: String(profile.phone || ""),
      name: profile.name ?? undefined,
      lastName: profile.last_name ?? undefined,
      email: profile.email ?? undefined,
      address: profile.address ?? undefined,
      role: profile.role === "admin" ? "admin" : "customer",
    };
  } catch {
    return null;
  }
}

export async function isSupabaseAdmin(): Promise<boolean> {
  const profile = await getSessionProfile();
  return profile?.role === "admin";
}
