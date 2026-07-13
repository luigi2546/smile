import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueTrendChart } from "@/components/admin/charts";
import { Badge, Card, Button } from "@/components/ui/primitives";
import { BookAppointmentModal } from "@/components/admin/book-appointment-modal";
import { formatGHS, formatTime, statusLabel } from "@/lib/utils";
import type { Appointment, AppointmentStatus, Branch, Service } from "@/lib/types";

type AppointmentWithService = Appointment & {
  service?: Pick<Service, "id" | "name" | "category" | "price_ghs"> | null;
  customer?: { id: string; full_name: string; phone: string } | null;
  branch?: Pick<Branch, "id" | "name"> | null;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function DashboardPage() {
  const supabase = createServiceClient();
  const staff = await getStaffProfile();
  const isManager = staff?.role === "branch_manager" && staff.branch_id;

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  let appointmentsQuery = supabase
    .from("appointments")
    .select("*, service:services(id, name, price_ghs, category), customer:customers(id, full_name, phone), branch:branches(id, name)")
    .gte("appointment_date", sixMonthsAgo.toISOString().slice(0, 10));

  if (isManager) {
    appointmentsQuery = appointmentsQuery.eq("branch_id", staff.branch_id);
  }

  const [{ data: appointments }, { data: customers }, { data: services }, { data: reminders }] = await Promise.all([
    appointmentsQuery,
    supabase.from("customers").select("id, full_name, phone, created_at").order("full_name"),
    supabase.from("services").select("id, name, price_ghs, category, is_active").order("name"),
    supabase.from("reminders").select("id, due_date, is_sent").eq("is_sent", false),
  ]);

  const allAppointments = (appointments as AppointmentWithService[]) ?? [];
  const totalServices = (services as Service[] | null) ?? [];
  
  const activeServices = totalServices.filter((s) => s.is_active);
  const whiteningService = activeServices.find(
    (service) => service.name.trim().toLowerCase() === "teeth whitening"
  );

  const pendingAppointments = allAppointments.filter((a) => a.status === "pending").length;
  const customerCount = (customers as any[] | null)?.length ?? 0;
  const monthStart = startOfMonth(now).toISOString().slice(0, 10);

  const thisMonthAppointments = allAppointments.filter((a) => a.appointment_date >= monthStart);
  const revenueThisMonth = thisMonthAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + (a.amount_paid_ghs ?? 0), 0);

  const newCustomersThisMonth =
    (customers as { id: string; created_at: string }[] | null)?.filter(
      (c) => c.created_at >= startOfMonth(now).toISOString()
    ).length ?? 0;

  const today = now.toISOString().slice(0, 10);
  const todaysSessions = allAppointments
    .filter((appointment) => appointment.appointment_date === today)
    .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
  const completedThisMonth = thisMonthAppointments.filter((a) => a.status === "completed").length;
  const followUpsDue = ((reminders as { due_date: string; is_sent: boolean }[] | null) ?? []).filter(
    (reminder) => reminder.due_date <= today
  ).length;

  // Revenue trend — last 6 months
  const monthLabels: string[] = [];
  const revenueByMonth: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    monthLabels.push(label);
    revenueByMonth[label] = 0;
  }
  allAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .forEach((a) => {
      const d = new Date(a.appointment_date);
      const label = d.toLocaleDateString("en-GB", { month: "short" });
      if (label in revenueByMonth) revenueByMonth[label] += a.amount_paid_ghs ?? 0;
    });
  const revenueTrend = monthLabels.map((m) => ({ month: m, revenue: Math.round(revenueByMonth[m]) }));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Whitening Operations</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Smile Center Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Manage customers, whitening sessions, payments, and follow-ups.</p>
        </div>
        <BookAppointmentModal
          customers={((customers as any[]) ?? []).map(({ id, full_name, phone }) => ({ id, full_name, phone }))}
          services={activeServices.map(({ id, name, price_ghs }) => ({ id, name, price_ghs }))}
          defaultIsNewCustomer
          defaultServiceId={whiteningService?.id}
          triggerLabel="Add Customer & Session"
          title="Add Dental Customer & Session"
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sessions Today" value={String(todaysSessions.length)} delta={pendingAppointments > 0 ? `${pendingAppointments} pending` : undefined} />
        <StatCard label="Revenue This Month" value={formatGHS(revenueThisMonth)} />
        <StatCard label="New Customers This Month" value={String(newCustomersThisMonth)} />
        <StatCard label="Completed This Month" value={String(completedThisMonth)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-teal-darker/5 px-6 py-5">
            <div>
              <h2 className="font-semibold text-ink">Today&apos;s Sessions</h2>
              <p className="mt-1 text-sm text-muted">Whitening and smile-care appointments scheduled today.</p>
            </div>
            <Button href="/admin/appointments" variant="secondary" size="sm">View all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-6 py-3 font-semibold">Time</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Treatment</th>
                  <th className="px-6 py-3 font-semibold">Duration</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysSessions.map((session) => (
                  <tr key={session.id} className="border-t border-teal-darker/5 transition-colors hover:bg-teal-darker/[0.02]">
                    <td className="px-6 py-4 font-medium tabular-nums text-ink">{formatTime(session.appointment_time)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{session.customer?.full_name ?? "Unknown customer"}</p>
                      <p className="mt-0.5 text-xs text-muted">{session.customer?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{session.service?.name ?? "Treatment"}</td>
                    <td className="px-6 py-4 text-muted">{session.total_sessions ?? 1} × 5 min · {(session.total_sessions ?? 1) * 5} minutes</td>
                    <td className="px-6 py-4"><SessionStatus status={session.status} /></td>
                  </tr>
                ))}
                {todaysSessions.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">No sessions scheduled today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-6">
            <p className="text-sm font-semibold text-ink">Follow-ups Due</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-ink">{followUpsDue}</p>
            <p className="mt-2 text-sm text-muted">Customers waiting for a reminder or return visit.</p>
            <Button href="/admin/customers" variant="secondary" size="sm" className="mt-5">Review customers</Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold text-ink">Customer Records</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-ink">{customerCount}</p>
            <p className="mt-2 text-sm text-muted">Profiles with treatment history, notes, and contact details.</p>
            <Button href="/admin/customers" variant="secondary" size="sm" className="mt-5">Open customer CRM</Button>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Revenue Trend</p>
          <p className="mt-1 text-sm text-muted">Confirmed and completed treatment revenue over the last six months.</p>
          <div className="mt-4"><RevenueTrendChart data={revenueTrend} /></div>
        </Card>
      </div>

    </div>
  );
}

function SessionStatus({ status }: { status: AppointmentStatus }) {
  const tone = status === "completed" ? "success" : status === "confirmed" ? "gold" : "neutral";
  return <Badge tone={tone}>{statusLabel(status)}</Badge>;
}
