"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

async function createMembershipAppointment(
  supabase: ReturnType<typeof createServiceClient>,
  customer_id: string,
  plan_id: string,
  payment_ref: string | null,
  appointmentDate?: string,
  appointmentNotes?: string
) {
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("preferred_branch_id")
    .eq("id", customer_id)
    .single();

  if (customerError) throw new Error(customerError.message);

  let branchId = (customerData as any)?.preferred_branch_id ?? null;

  if (!branchId) {
    const { data: branchData, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (branchError) throw new Error(branchError.message);
    branchId = (branchData as any)?.id ?? null;
  }

  if (!branchId) {
    throw new Error("Unable to determine a branch for the membership appointment.");
  }

  const { data: planData, error: planError } = await supabase
    .from("subscription_plans")
    .select("name, price_ghs")
    .eq("id", plan_id)
    .single();

  if (planError || !planData) {
    throw new Error(planError?.message || "Subscription plan not found.");
  }

  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("name", "Smile Club Membership")
    .maybeSingle();

  let membershipServiceId = (serviceData as any)?.id ?? null;
  if (!membershipServiceId) {
    const { data: createdService, error: createServiceError } = await supabase
      .from("services")
      .insert({
        name: "Smile Club Membership",
        description: `Membership activation for ${planData.name}`,
        category: "Membership",
        price_ghs: planData.price_ghs,
        duration_minutes: 0,
        is_active: true,
      })
      .select("id")
      .single();

    if (createServiceError || !createdService) {
      throw new Error(createServiceError?.message || "Unable to create membership service record.");
    }

    membershipServiceId = createdService.id;
  }

  const appointment_date = appointmentDate ?? new Date().toISOString().slice(0, 10);
  const appointment_time = new Date().toTimeString().slice(0, 8);

  const { error: appointmentError } = await supabase.from("appointments").insert({
    customer_id,
    service_id: membershipServiceId,
    branch_id: branchId,
    appointment_date,
    appointment_time,
    status: "confirmed",
    price_ghs: planData.price_ghs,
    notes: appointmentNotes ?? (payment_ref ? `Membership payment ${payment_ref}` : "Membership payment"),
  });

  if (appointmentError) {
    throw new Error(appointmentError.message);
  }
}

// ─── Plan Management ─────────────────────────────────────────────────────────

export async function addPlan(formData: FormData) {
  const supabase = createServiceClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price_ghs = parseFloat(formData.get("price_ghs") as string);
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("subscription_plans").insert({
    name,
    description: description || null,
    price_ghs,
    features,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/subscriptions");
}

export async function editPlan(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price_ghs = parseFloat(formData.get("price_ghs") as string);
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("subscription_plans")
    .update({ name, description: description || null, price_ghs, features })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/subscriptions");
}

export async function togglePlanActive(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("is_active")
    .eq("id", id)
    .single();

  await supabase
    .from("subscription_plans")
    .update({ is_active: !data?.is_active })
    .eq("id", id);

  revalidatePath("/admin/subscriptions");
}

// ─── Customer Subscriptions ───────────────────────────────────────────────────

export async function assignSubscription(formData: FormData) {
  const supabase = createServiceClient();
  const customer_id = formData.get("customer_id") as string;
  const plan_id = formData.get("plan_id") as string;
  const started_at = formData.get("started_at") as string;
  const payment_ref = formData.get("payment_ref") as string;
  const notes = formData.get("notes") as string;

  // Compute renews_at = started_at + 1 month
  const start = new Date(started_at);
  start.setMonth(start.getMonth() + 1);
  const renews_at = start.toISOString().split("T")[0];

  // Cancel any existing active subscription for this customer first
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString().split("T")[0] })
    .eq("customer_id", customer_id)
    .eq("status", "active");

  const { error } = await supabase.from("subscriptions").insert({
    customer_id,
    plan_id,
    started_at,
    renews_at,
    payment_ref: payment_ref || null,
    notes: notes || null,
    status: "active",
  });

  if (error) throw new Error(error.message);

  // Also flip the customer's is_member flag
  await supabase
    .from("customers")
    .update({ is_member: true, membership_started_at: started_at })
    .eq("id", customer_id);

  await createMembershipAppointment(
    supabase,
    customer_id,
    plan_id,
    payment_ref || null,
    started_at,
    notes || `Membership payment ${payment_ref || "manual"}`
  );

  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/customers/${customer_id}`);
}

export async function cancelSubscription(id: string) {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("customer_id")
    .eq("id", id)
    .single();

  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: today })
    .eq("id", id);

  if (sub?.customer_id) {
    // Check if they have other active subscriptions
    const { data: others } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("customer_id", sub.customer_id)
      .eq("status", "active");

    if (!others || others.length === 0) {
      await supabase
        .from("customers")
        .update({ is_member: false })
        .eq("id", sub.customer_id);
    }

    revalidatePath(`/admin/customers/${sub.customer_id}`);
  }

  revalidatePath("/admin/subscriptions");
}

export async function renewSubscription(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const payment_ref = formData.get("payment_ref") as string;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("customer_id, plan_id, renews_at")
    .eq("id", id)
    .single();

  if (!sub) throw new Error("Subscription not found");

  const current = new Date(sub.renews_at);
  current.setMonth(current.getMonth() + 1);
  const new_renews_at = current.toISOString().split("T")[0];

  await supabase
    .from("subscriptions")
    .update({
      renews_at: new_renews_at,
      status: "active",
      payment_ref: payment_ref || null,
    })
    .eq("id", id);

  await createMembershipAppointment(
    supabase,
    sub.customer_id,
    sub.plan_id,
    payment_ref || null,
    new Date().toISOString().slice(0, 10),
    payment_ref ? `Membership renewal payment ${payment_ref}` : "Membership renewal payment"
  );

  revalidatePath("/admin/subscriptions");
}
