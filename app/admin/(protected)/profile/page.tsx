import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const staff = await getStaffProfile();
  const displayName = staff?.full_name ?? user?.email ?? "Staff Member";

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">
          Account
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left — Avatar + meta */}
        <div className="flex flex-col gap-6">
          {/* Avatar card */}
          <div className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-darker text-3xl font-bold text-white shadow-lg">
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <h2 className="mt-4 font-serif text-xl font-bold text-ink">
              {displayName}
            </h2>
            <p className="mt-1 text-sm capitalize text-muted">
              {(staff?.role ?? "staff").replace("_", " ")}
            </p>
            <span
              className={[
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                staff?.role === "admin"
                  ? "bg-amber-50 text-amber-700"
                  : staff?.role === "branch_manager"
                  ? "bg-teal/10 text-teal-darker"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {staff?.role === "admin"
                ? "Administrator"
                : staff?.role === "branch_manager"
                ? "Branch Manager"
                : "Staff"}
            </span>
          </div>

          {/* Account meta */}
          <div className="rounded-[1.75rem] border border-teal/20 bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-teal">
              Account Details
            </p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-muted">Email address</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink break-all">
                  {user?.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Account ID</dt>
                <dd className="mt-0.5 font-mono text-xs text-muted truncate">
                  {user?.id ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Member since</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">
                  {staff?.created_at
                    ? new Date(staff.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Last sign-in</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right — Edit forms (client component) */}
        <div className="lg:col-span-2">
          <ProfileClient
            staffId={staff?.id ?? ""}
            initialFullName={staff?.full_name ?? ""}
            email={user?.email ?? ""}
            role={staff?.role ?? "staff"}
          />
        </div>
      </div>
    </div>
  );
}
