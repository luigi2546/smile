import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await getStaffProfile();
  const service = createServiceClient();
  let query = service
    .from("appointments")
    .select("id, created_at, total_sessions, amount_paid_ghs, customer:customers(full_name), service:services(name), branch:branches(name)")
    .eq("visit_type", "booking")
    .order("created_at", { ascending: false })
    .limit(12);

  if (staff?.role === "branch_manager" && staff.branch_id) {
    query = query.eq("branch_id", staff.branch_id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Unable to load notifications." }, { status: 500 });
  }

  const notifications = ((data as any[]) ?? []).map((appointment) => {
    const sessions = Number(appointment.total_sessions ?? 1);
    const amount = Number(appointment.amount_paid_ghs ?? 0);
    const customer = appointment.customer?.full_name ?? "A customer";
    const treatment = appointment.service?.name ?? "a treatment";
    const branch = appointment.branch?.name ? ` at ${appointment.branch.name}` : "";

    return {
      id: appointment.id,
      title: "New booking confirmed",
      desc: `${customer} booked ${treatment} (${sessions} session${sessions === 1 ? "" : "s"})${branch} and paid GHS ${amount.toFixed(2)}.`,
      createdAt: appointment.created_at,
      type: "booking" as const,
      href: `/admin/appointments/${appointment.id}`,
    };
  });

  return NextResponse.json(
    { notifications },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
