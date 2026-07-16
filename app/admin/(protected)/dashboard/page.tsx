import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueTrendChart } from "@/components/admin/charts";
import { Badge, Card, Button } from "@/components/ui/primitives";
import { BookAppointmentModal } from "@/components/admin/book-appointment-modal";
import { formatDate, formatGHS, formatTime, statusLabel } from "@/lib/utils";
import type { Appointment, AppointmentStatus, Branch, Service } from "@/lib/types";
import { Printer } from "lucide-react";

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
  let appointmentsQuery = supabase
    .from("appointments")
    .select("*, service:services(id, name, price_ghs, category), customer:customers(id, full_name, phone), branch:branches(id, name)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (isManager) {
    appointmentsQuery = appointmentsQuery.eq("branch_id", staff.branch_id);
  }

  const [{ data: appointments }, { data: customers }, { data: services }, { data: reminders }, { data: subscriptions }] = await Promise.all([
    appointmentsQuery,
    supabase.from("customers").select("id, full_name, phone, created_at").order("full_name"),
    supabase.from("services").select("id, name, price_ghs, category, is_active").order("name"),
    supabase.from("reminders").select("id, due_date, is_sent").eq("is_sent", false),
    supabase
      .from("subscriptions")
      .select("id, created_at, amount_paid_ghs, payment_ref, sessions_total, customer:customers(full_name), plan:subscription_plans(name)")
      .gt("amount_paid_ghs", 0)
      .order("created_at", { ascending: false })
      .limit(8),
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
  const dashboardAppointments = [...allAppointments].sort((a, b) => {
    const aIsToday = a.appointment_date === today;
    const bIsToday = b.appointment_date === today;
    if (aIsToday !== bIsToday) return aIsToday ? -1 : 1;
    return `${b.appointment_date}T${b.appointment_time}`.localeCompare(
      `${a.appointment_date}T${a.appointment_time}`
    );
  });
  const completedThisMonth = thisMonthAppointments.filter((a) => a.status === "completed").length;
  const followUpsDue = ((reminders as { due_date: string; is_sent: boolean }[] | null) ?? []).filter(
    (reminder) => reminder.due_date <= today
  ).length;

  const recentPayments = [
    ...allAppointments
      .filter((appointment) => Number(appointment.amount_paid_ghs ?? 0) > 0)
      .map((appointment) => ({
        id: appointment.id,
        type: "session",
        customer: appointment.customer?.full_name ?? "Unknown customer",
        description: `${appointment.service?.name ?? "Treatment"} · ${appointment.total_sessions ?? 1} session${(appointment.total_sessions ?? 1) === 1 ? "" : "s"}`,
        amount: Number(appointment.amount_paid_ghs ?? 0),
        date: appointment.created_at,
      })),
    ...(((subscriptions as any[]) ?? []).map((subscription) => ({
      id: subscription.id,
      type: "package",
      customer: subscription.customer?.full_name ?? "Unknown customer",
      description: `${subscription.plan?.name ?? "Whitening package"} · ${subscription.sessions_total ?? 1} sessions`,
      amount: Number(subscription.amount_paid_ghs ?? 0),
      date: subscription.created_at,
    }))),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

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
          <p className="mt-1 text-sm text-muted">Manage customers, appointments, payments, and follow-ups.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/admin/transactions" variant="secondary">
            <Printer className="h-4 w-4" /> Receipts
          </Button>
          <BookAppointmentModal
            customers={((customers as any[]) ?? []).map(({ id, full_name, phone }) => ({ id, full_name, phone }))}
            services={activeServices.map(({ id, name, price_ghs }) => ({ id, name, price_ghs }))}
            defaultIsNewCustomer
            defaultServiceId={whiteningService?.id}
            triggerLabel="Add Customer & Session"
            title="Add Dental Customer & Session"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Appointments Today" value={String(todaysSessions.length)} delta={pendingAppointments > 0 ? `${pendingAppointments} pending` : undefined} />
        <StatCard label="Revenue This Month" value={formatGHS(revenueThisMonth)} />
        <StatCard label="New Customers This Month" value={String(newCustomersThisMonth)} />
        <StatCard label="Completed This Month" value={String(completedThisMonth)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-teal-darker/5 px-6 py-5">
            <div>
              <h2 className="font-semibold text-ink">All Appointments</h2>
              <p className="mt-1 text-sm text-muted">Today&apos;s appointments are highlighted and shown first.</p>
            </div>
            <Button href="/admin/appointments" variant="secondary" size="sm">View all</Button>
          </div>
          <div className="max-h-[34rem] overflow-y-auto overflow-x-hidden">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="sticky top-0 z-10 bg-teal-darker/5 text-xs uppercase tracking-wide text-muted backdrop-blur-sm">
                <tr>
                  <th className="w-28 px-2 py-3 font-semibold sm:w-40 sm:px-4">Schedule</th>
                  <th className="px-2 py-3 font-semibold sm:px-4">Customer</th>
                  <th className="hidden px-4 py-3 font-semibold lg:table-cell">Treatment</th>
                  <th className="hidden w-20 px-4 py-3 font-semibold 2xl:table-cell">Sessions</th>
                  <th className="w-24 px-2 py-3 font-semibold sm:w-28 sm:px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardAppointments.map((session) => {
                  const isToday = session.appointment_date === today;
                  return (
                  <tr
                    key={session.id}
                    className={`border-t transition-colors ${
                      isToday
                        ? "border-gold/30 bg-gold/15 hover:bg-gold/20"
                        : "border-teal-darker/5 hover:bg-teal-darker/[0.02]"
                    }`}
                  >
                    <td className="px-2 py-4 font-medium text-ink sm:px-4">
                      <span className="block">{formatDate(session.appointment_date)}</span>
                      <span className="mt-1 block text-xs tabular-nums text-muted">{formatTime(session.appointment_time)}</span>
                      {isToday && <span className="mt-1 inline-flex rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">Today</span>}
                    </td>
                    <td className="min-w-0 px-2 py-4 sm:px-4">
                      <p className="break-words font-medium text-ink">{session.customer?.full_name ?? "Unknown customer"}</p>
                      <p className="mt-0.5 break-words text-xs text-muted">{session.customer?.phone}</p>
                    </td>
                    <td className="hidden break-words px-4 py-4 text-muted lg:table-cell">{session.service?.name ?? "Treatment"}</td>
                    <td className="hidden px-4 py-4 text-muted 2xl:table-cell">{session.total_sessions ?? 1}</td>
                    <td className="px-2 py-4 sm:px-4"><SessionStatus status={session.status} /></td>
                  </tr>
                  );
                })}
                {dashboardAppointments.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">No appointments found.</td></tr>
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

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-teal-darker/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">Recent payments &amp; receipts</h2>
            <p className="mt-1 text-sm text-muted">Open and print receipts for the latest recorded payments.</p>
          </div>
          <Button href="/admin/transactions" variant="secondary" size="sm">View all receipts</Button>
        </div>
        <div>
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-6">Customer</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell sm:px-6">Payment</th>
                <th className="w-32 px-4 py-3 font-semibold sm:px-6">Amount</th>
                <th className="w-40 px-4 py-3 font-semibold sm:px-6">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={`${payment.type}-${payment.id}`} className="border-t border-teal-darker/5">
                  <td className="break-words px-4 py-4 font-medium text-ink sm:px-6">{payment.customer}</td>
                  <td className="hidden break-words px-4 py-4 text-muted md:table-cell sm:px-6">{payment.description}</td>
                  <td className="px-4 py-4 font-semibold tabular-nums text-ink sm:px-6">{formatGHS(payment.amount)}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <Button href={`/admin/transactions/${payment.type}/${payment.id}/receipt`} variant="ghost" size="sm" className="whitespace-nowrap">
                      <Printer className="h-4 w-4" /> Receipt
                    </Button>
                  </td>
                </tr>
              ))}
              {recentPayments.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-muted">No paid transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}

function SessionStatus({ status }: { status: AppointmentStatus }) {
  const tone = status === "completed" ? "success" : status === "confirmed" ? "gold" : "neutral";
  return <Badge tone={tone}>{statusLabel(status)}</Badge>;
}
