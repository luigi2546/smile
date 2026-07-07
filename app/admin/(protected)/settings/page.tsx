import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { createServiceClient } from "@/lib/supabase/service";
import { SettingsClient } from "./settings-client";
import type { Branch } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const staff = await getStaffProfile();
  const isAdmin = staff?.role === "admin";

  const supabase = createServiceClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, is_active")
    .order("name");

  const allBranches = (branches as Pick<Branch, "id" | "name" | "is_active">[]) ?? [];

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">
          Configuration
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage system preferences, notifications, and clinic configuration.
        </p>
      </div>

      {/* Admin-only banner */}
      {!isAdmin && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-sm text-amber-800">
              Limited Access
            </p>
            <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
              Some settings below are read-only for your role. Contact an
              administrator to make changes.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6">
        <SettingsClient
          isAdmin={isAdmin}
          staffRole={staff?.role ?? "staff"}
          branches={allBranches}
        />
      </div>
    </div>
  );
}
