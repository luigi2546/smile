import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { Card, Badge } from "@/components/ui/primitives";
import { formatDate, formatTime, formatGHS, statusLabel } from "@/lib/utils";
import { updateAppointmentStatus } from "@/app/admin/(protected)/appointments/actions";
import { StatusSelect } from "@/components/admin/status-select";
import { BookAppointmentModal } from "@/components/admin/book-appointment-modal";
import type { AppointmentWithRelations, AppointmentStatus } from "@/lib/types";

const STATUS_OPTIONS: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const serviceSupabase = createServiceClient();
  const staff = await getStaffProfile();

  let query = serviceSupabase
    .from("appointments")
    .select("*, customer:customers(id, full_name, phone, email), service:services(id, name, price_ghs, duration_minutes), branch:branches(id, name)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }

  if (staff?.role === "branch_manager" && staff.branch_id) {
    query = query.eq("branch_id", staff.branch_id);
  }

  const [{ data: appointments }, { data: branches }, { data: services }, { data: customers }] = await Promise.all([
    query,
    serviceSupabase.from("branches").select("id, name").eq("is_active", true).order("name"),
    serviceSupabase.from("services").select("id, name, price_ghs").eq("is_active", true).order("name"),
    serviceSupabase.from("customers").select("id, full_name, phone").order("full_name"),
  ]);

  const list = (appointments as unknown as AppointmentWithRelations[]) ?? [];
  const branchList = (branches as any[]) ?? [];
  const serviceList = (services as any[]) ?? [];
  const customerList = (customers as any[]) ?? [];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Operations</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Appointments</h1>
          <p className="mt-1 text-sm text-muted">{list.length} appointments</p>
        </div>
        <BookAppointmentModal
          customers={customerList}
          services={serviceList}
          branches={branchList}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterLink label="All" status={undefined} active={!searchParams.status} />
        {STATUS_OPTIONS.map((s) => (
          <FilterLink key={s} label={statusLabel(s)} status={s} active={searchParams.status === s} />
        ))}
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Date &amp; Time</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Service</th>
              <th className="px-5 py-3 font-semibold">Branch</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              return (
                <tr key={a.id} className="border-t border-teal-darker/5">
                  <td className="px-5 py-3.5 text-muted">
                    {formatDate(a.appointment_date)}<br />
                    <span className="text-xs">{formatTime(a.appointment_time)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{a.customer?.full_name}</p>
                    <p className="text-xs text-muted">{a.customer?.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{a.service?.name}</td>
                  <td className="px-5 py-3.5 text-muted">{a.branch?.name}</td>
                  <td className="px-5 py-3.5 text-muted">{formatGHS(a.price_ghs)}</td>
                  <td className="px-5 py-3.5">
                    <StatusSelect action={updateAppointmentStatus} appointmentId={a.id} defaultValue={a.status} options={STATUS_OPTIONS} />
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function FilterLink({ label, status, active }: { label: string; status?: string; active: boolean }) {
  const href = status ? `/admin/appointments?status=${status}` : "/admin/appointments";
  return (
    <a
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-teal-darker text-white" : "bg-teal-darker/5 text-teal-darker hover:bg-teal-darker/10"
      }`}
    >
      {label}
    </a>
  );
}
