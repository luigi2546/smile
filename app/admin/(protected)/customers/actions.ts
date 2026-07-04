"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCustomerNotes(customerId: string, formData: FormData) {
  const notes = String(formData.get("notes") || "");
  const supabase = createClient();
  await supabase.from("customers").update({ notes }).eq("id", customerId);
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function addReminder(customerId: string, formData: FormData) {
  const dueDate = String(formData.get("due_date") || "");
  const message = String(formData.get("message") || "");
  const type = String(formData.get("type") || "custom");
  const supabase = createClient();
  await supabase.from("reminders").insert({
    customer_id: customerId,
    due_date: dueDate,
    message,
    type,
  });
  revalidatePath(`/admin/customers/${customerId}`);
}
