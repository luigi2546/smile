import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type RequestBody = {
  reference: string;
};

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { reference } = body;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured." }, { status: 500 });
  }

  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    return NextResponse.json({ error: data.message || "Paystack verification failed." }, { status: 502 });
  }

  if (data.data.status !== "success") {
    return NextResponse.json({ error: "Payment was not successful." }, { status: 400 });
  }

  const metadata = data.data.metadata || {};
  const planId = metadata.planId as string | undefined;
  const email = data.data.customer?.email as string | undefined;
  const fullName = metadata.fullName as string | undefined;
  const phone = metadata.phone as string | undefined;

  if (!planId || !email || !phone || !fullName) {
    return NextResponse.json({ error: "Payment metadata is incomplete." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Find or create customer
  const customerResult = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let customerId: string | null = (customerResult.data as any)?.id ?? null;

  if (!customerId) {
    const insertCustomer = await supabase
      .from("customers")
      .insert({ full_name: fullName, email, phone })
      .select("id")
      .single();

    if (insertCustomer.error || !insertCustomer.data) {
      return NextResponse.json({ error: "Unable to create customer record." }, { status: 500 });
    }

    customerId = insertCustomer.data.id;
  }

  const planResult = await supabase
    .from("subscription_plans")
    .select("id, price_ghs, name")
    .eq("id", planId)
    .maybeSingle();

  if (!planResult.data) {
    return NextResponse.json({ error: "Subscription plan not found." }, { status: 404 });
  }

  const renewsAt = new Date();
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const startedAt = new Date().toISOString().slice(0, 10);
  const insertSubscription = await supabase
    .from("subscriptions")
    .insert({
      customer_id: customerId,
      plan_id: planId,
      status: "active",
      started_at: startedAt,
      renews_at: renewsAt.toISOString().slice(0, 10),
      payment_ref: data.data.reference,
      notes: `Paystack transaction ${data.data.reference}`,
    })
    .select("id")
    .single();

  if (insertSubscription.error || !insertSubscription.data) {
    return NextResponse.json({ error: "Unable to record subscription." }, { status: 500 });
  }

  const updateCustomer = await supabase
    .from("customers")
    .update({ is_member: true, membership_started_at: startedAt })
    .eq("id", customerId);

  if (updateCustomer.error) {
    return NextResponse.json({ error: "Unable to update customer membership status." }, { status: 500 });
  }

  const customerBranchResult = await supabase
    .from("customers")
    .select("preferred_branch_id")
    .eq("id", customerId)
    .single();

  const preferredBranchId = (customerBranchResult.data as any)?.preferred_branch_id ?? null;

  let branchId = preferredBranchId;
  if (!branchId) {
    const branchResult = await supabase
      .from("branches")
      .select("id")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    branchId = (branchResult.data as any)?.id ?? null;
  }

  if (!branchId) {
    return NextResponse.json(
      { error: "Unable to determine a branch for the membership appointment." },
      { status: 500 }
    );
  }

  const membershipServiceName = "Smile Club Membership";
  const existingService = await supabase
    .from("services")
    .select("id")
    .eq("name", membershipServiceName)
    .maybeSingle();

  let membershipServiceId = (existingService.data as any)?.id ?? null;
  if (!membershipServiceId) {
    const createdService = await supabase
      .from("services")
      .insert({
        name: membershipServiceName,
        description: `Membership activation for ${planResult.data.name}`,
        category: "Membership",
        price_ghs: planResult.data.price_ghs,
        duration_minutes: 0,
        is_active: true,
      })
      .select("id")
      .single();

    if (createdService.error || !createdService.data) {
      return NextResponse.json({ error: "Unable to create membership service record." }, { status: 500 });
    }

    membershipServiceId = createdService.data.id;
  }

  const appointmentTime = new Date().toTimeString().slice(0, 8);
  const { error: appointmentError } = await supabase.from("appointments").insert({
    customer_id: customerId,
    service_id: membershipServiceId,
    branch_id: branchId,
    appointment_date: startedAt,
    appointment_time: appointmentTime,
    status: "confirmed",
    price_ghs: planResult.data.price_ghs,
    notes: `Membership payment ${data.data.reference}`,
  });

  if (appointmentError) {
    return NextResponse.json({ error: "Unable to record membership appointment." }, { status: 500 });
  }

  return NextResponse.json({ success: true, subscriptionId: insertSubscription.data.id });
}
