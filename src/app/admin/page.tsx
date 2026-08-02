import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect(isSupabaseConfigured() ? "/account" : "/admin/login");
  }
  return <AdminDashboard />;
}
