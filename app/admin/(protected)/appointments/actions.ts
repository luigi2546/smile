"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(formData: FormData) {
  const appointmentId = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!appointmentId) return;

  const supabase = createClient();
  await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  revalidatePath("/admin/appointments");
}

export async function bookAppointmentManual(formData: FormData) {
  const isNew = formData.get("isNewCustomer") === "true";
  const serviceId = String(formData.get("serviceId") || "");
  const branchId = String(formData.get("branchId") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const notes = String(formData.get("notes") || "");

  if (!serviceId || !branchId || !date || !time) {
    throw new Error("Missing required fields");
  }

  const supabase = createClient();

  let customerId = "";

  if (isNew) {
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");

    if (!fullName || !phone) {
      throw new Error("New customer name and phone are required");
    }

    // Check if customer phone already exists
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existing) {
      customerId = existing.id;
    } else {
      const { data: newCust, error: custErr } = await supabase
        .from("customers")
        .insert({
          full_name: fullName,
          phone,
          email: email || null,
          preferred_branch_id: branchId,
        })
        .select("id")
        .single();

      if (custErr || !newCust) {
        throw new Error(custErr?.message || "Failed to create new customer profile");
      }
      customerId = newCust.id;
    }
  } else {
    customerId = String(formData.get("customerId") || "");
    if (!customerId) {
      throw new Error("Please select an existing customer");
    }
  }

  // Fetch service price
  const { data: service } = await supabase
    .from("services")
    .select("price_ghs")
    .eq("id", serviceId)
    .single();

  const price = service?.price_ghs ?? null;

  // Insert confirmed appointment
  const { error: apptErr } = await supabase.from("appointments").insert({
    customer_id: customerId,
    service_id: serviceId,
    branch_id: branchId,
    appointment_date: date,
    appointment_time: time,
    status: "confirmed", // default to confirmed for manual staff bookings
    price_ghs: price,
    notes: notes || null,
  });

  if (apptErr) {
    throw new Error(apptErr.message);
  }

  revalidatePath("/admin/appointments");
}
