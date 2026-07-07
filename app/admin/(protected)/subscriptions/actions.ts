"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

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
    .select("renews_at")
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

  revalidatePath("/admin/subscriptions");
}
