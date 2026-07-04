import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueTrendChart, BranchDistributionChart } from "@/components/admin/charts";
import { Card } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import type { Appointment, Branch } from "@/lib/types";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function DashboardPage() {
  const supabase = createClient();

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [{ data: appointments }, { data: branches }, { data: customers }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", sixMonthsAgo.toISOString().slice(0, 10)),
    supabase.from("branches").select("*").eq("is_active", true),
    supabase.from("customers").select("id, created_at"),
  ]);

  const allAppointments = (appointments as Appointment[]) ?? [];
  const allBranches = (branches as Branch[]) ?? [];
  const monthStart = startOfMonth(now).toISOString().slice(0, 10);

  const thisMonthAppointments = allAppointments.filter((a) => a.appointment_date >= monthStart);
  const revenueThisMonth = thisMonthAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + (a.price_ghs ?? 0), 0);

  const newCustomersThisMonth =
    (customers as { id: string; created_at: string }[] | null)?.filter(
      (c) => c.created_at >= startOfMonth(now).toISOString()
    ).length ?? 0;

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

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Appointments This Month" value={String(thisMonthAppointments.length)} />
        <StatCard label="Revenue This Month" value={formatGHS(revenueThisMonth)} />
        <StatCard label="New Customers This Month" value={String(newCustomersThisMonth)} />
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
    </div>
  );
}
