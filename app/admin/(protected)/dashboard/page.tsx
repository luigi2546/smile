import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueTrendChart, BranchDistributionChart } from "@/components/admin/charts";
import { Card, Button } from "@/components/ui/primitives";
import { SmsPanel } from "@/components/admin/sms-panel";
import { formatGHS } from "@/lib/utils";
import type { Appointment, Branch, Service } from "@/lib/types";

type AppointmentWithService = Appointment & {
  service?: Pick<Service, "id" | "category" | "price_ghs"> | null;
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
    .select("*, service:services(id, price_ghs, category)")
    .gte("appointment_date", sixMonthsAgo.toISOString().slice(0, 10));

  if (isManager) {
    appointmentsQuery = appointmentsQuery.eq("branch_id", staff.branch_id);
  }

  const [{ data: appointments }, { data: branches }, { data: customers }, { data: services }] = await Promise.all([
    appointmentsQuery,
    supabase.from("branches").select("*"),
    supabase.from("customers").select("id, created_at"),
    supabase.from("services").select("id, category, is_active"),
  ]);

  const allAppointments = (appointments as AppointmentWithService[]) ?? [];
  const allBranches = (branches as Branch[]) ?? [];
  const totalServices = (services as Service[] | null) ?? [];
  
  const activeServices = totalServices.filter((s) => s.is_active);
  const serviceCount = activeServices.length;
  const serviceCategories = Array.from(new Set(totalServices.map((s) => s.category)));
  const inactiveServices = totalServices.filter((s) => !s.is_active).length;

  const activeBranches = allBranches.filter((b) => b.is_active);
  const activeBranchCount = isManager
    ? activeBranches.filter((b) => b.id === staff.branch_id).length
    : activeBranches.length;

  const pendingAppointments = allAppointments.filter((a) => a.status === "pending").length;
  const customerCount = (customers as any[] | null)?.length ?? 0;
  const monthStart = startOfMonth(now).toISOString().slice(0, 10);

  const thisMonthAppointments = allAppointments.filter((a) => a.appointment_date >= monthStart);
  const revenueThisMonth = thisMonthAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + (a.price_ghs ?? 0), 0);

  const membershipRevenueThisMonth = thisMonthAppointments
    .filter((a) => a.service?.category === "Membership" && (a.status === "completed" || a.status === "confirmed"))
    .reduce((sum, a) => sum + (a.price_ghs ?? 0), 0);

  const newCustomersThisMonth =
    (customers as { id: string; created_at: string }[] | null)?.filter(
      (c) => c.created_at >= startOfMonth(now).toISOString()
    ).length ?? 0;

  const activeMemberships = allAppointments.filter(
    (a) => a.service?.category === "Membership" && a.status === "confirmed"
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
      if (label in revenueByMonth) revenueByMonth[label] += a.price_ghs ?? 0;
    });
  const revenueTrend = monthLabels.map((m) => ({ month: m, revenue: Math.round(revenueByMonth[m]) }));

  // Appointments by branch
  const branchCounts: Record<string, number> = {};
  thisMonthAppointments.forEach((a) => {
    branchCounts[a.branch_id] = (branchCounts[a.branch_id] ?? 0) + 1;
  });
  const branchDistribution = allBranches
    .map((b) => ({ name: b.name, value: branchCounts[b.id] ?? 0 }))
    .filter((b) => b.value > 0);

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Branch Management</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Monitor performance across all branches.</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-4">
        <StatCard label="Appointments This Month" value={String(thisMonthAppointments.length)} delta={pendingAppointments > 0 ? `+${pendingAppointments} pending` : undefined} />
        <StatCard label="Revenue This Month" value={formatGHS(revenueThisMonth)} />
        <StatCard label="Membership Revenue" value={formatGHS(membershipRevenueThisMonth)} />
        <StatCard label="New Customers This Month" value={String(newCustomersThisMonth)} />
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <span className="rounded-full bg-teal-darker/5 px-4 py-2 text-sm font-medium text-teal-darker">{activeBranchCount} active branches</span>
        <span className="rounded-full bg-teal-darker/5 px-4 py-2 text-sm font-medium text-teal-darker">{serviceCategories.length} service categories</span>
        <span className="rounded-full bg-teal-darker/5 px-4 py-2 text-sm font-medium text-teal-darker">{customerCount} customers</span>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Customer CRM</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{customerCount}</p>
          <p className="mt-2 text-sm text-muted">View customer details, search profiles, and manage contacts.</p>
          <Button href="/admin/customers" variant="secondary" size="sm" className="mt-5">
            View customers
          </Button>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Branch operations</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{activeBranchCount}</p>
          <p className="mt-2 text-sm text-muted">Manage branch locations and update opening details.</p>
          <Button href="/admin/branches" variant="secondary" size="sm" className="mt-5">
            Manage branches
          </Button>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Services</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{serviceCount}</p>
          <p className="mt-2 text-sm text-muted">Update service offerings, pricing, and availability.</p>
          <Button href="/admin/services" variant="secondary" size="sm" className="mt-5">
            Manage services
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Revenue Trend</p>
          <div className="mt-4">
            <RevenueTrendChart data={revenueTrend} />
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Appointments by Branch (This Month)</p>
          <div className="mt-4">
            {branchDistribution.length > 0 ? (
              <BranchDistributionChart data={branchDistribution} />
            ) : (
              <p className="py-16 text-center text-sm text-muted">No appointments yet this month.</p>
            )}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Membership Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{formatGHS(membershipRevenueThisMonth)}</p>
          <p className="mt-2 text-sm text-muted">Revenue from membership activations and renewals this month.</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Membership Appointments</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{String(activeMemberships)}</p>
          <p className="mt-2 text-sm text-muted">Confirmed membership-related appointments created from subscription payments.</p>
        </Card>
      </div>

      <div className="mt-6">
        <SmsPanel />
      </div>
    </div>
  );
}
