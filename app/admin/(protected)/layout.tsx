import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const staff = await getStaffProfile();
  const role = staff?.role ?? "staff";
  const fullName = staff?.full_name ?? user?.email ?? "Staff Member";

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar fullName={fullName} role={role} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
