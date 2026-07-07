"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCustomerNotes(formData: FormData) {
  const customerId = String(formData.get("id") || "");
  const notes = String(formData.get("notes") || "");
  if (!customerId) return;

  const supabase = createClient();
  await supabase.from("customers").update({ notes }).eq("id", customerId);
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function addReminder(formData: FormData) {
  const customerId = String(formData.get("customer_id") || "");
  const dueDate = String(formData.get("due_date") || "");
  const message = String(formData.get("message") || "");
  const type = String(formData.get("type") || "custom");
  if (!customerId) return;

  const supabase = createClient();
  await supabase.from("reminders").insert({
    customer_id: customerId,
    due_date: dueDate,
    message,
    type,
  });
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function toggleMembership(formData: FormData) {
  const customerId = String(formData.get("id") || "");
  const isMember = formData.get("is_member") === "true";
  if (!customerId) return;

  const supabase = createClient();
  await supabase
    .from("customers")
    .update({
      is_member: !isMember,
      membership_started_at: !isMember ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", customerId);

  revalidatePath(`/admin/customers/${customerId}`);
}

export async function addCustomer(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const preferredBranchId = String(formData.get("preferredBranchId") || "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const isMember = formData.get("isMember") === "on";

  if (!fullName || !phone) {
    throw new Error("Full name and phone number are required.");
  }

  const supabase = createClient();

  // Check if phone already exists
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    throw new Error("A customer with this phone number already exists.");
  }

  const { error } = await supabase.from("customers").insert({
    full_name: fullName,
    phone,
    email: email || null,
    preferred_branch_id: preferredBranchId || null,
    date_of_birth: dateOfBirth || null,
    notes: notes || null,
    is_member: isMember,
    membership_started_at: isMember ? new Date().toISOString().slice(0, 10) : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/customers");
}
