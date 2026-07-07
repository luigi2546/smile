"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { z } from "zod";
import { redirect } from "next/navigation";

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  branchId: z.string().uuid(),
  date: z.string().min(1),
  time: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type BookingFormState = {
  error?: string;
};

export async function createAppointment(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const parsed = bookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    branchId: formData.get("branchId"),
    date: formData.get("date"),
    time: formData.get("time"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: "Please check that every field is filled in correctly." };
  }

  const { serviceId, branchId, date, time, fullName, phone, email, notes } = parsed.data;
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  // 1. Find or create the customer by phone number.
  const { data: existingCustomer } = await serviceSupabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  let customerId = existingCustomer?.id as string | undefined;

  if (!customerId) {
    const { data: newCustomer, error: customerError } = await serviceSupabase
      .from("customers")
      .insert({
        full_name: fullName,
        phone,
        email: email || null,
        preferred_branch_id: branchId,
      })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return { error: "We couldn't save your details. Please try again." };
    }
    customerId = newCustomer.id;
  }

  // 2. Look up the service price to snapshot it on the appointment.
  const { data: service } = await serviceSupabase
    .from("services")
    .select("price_ghs")
    .eq("id", serviceId)
    .single();

  // 3. Create the appointment.
  const { data: appointment, error: appointmentError } = await serviceSupabase
    .from("appointments")
    .insert({
      customer_id: customerId,
      service_id: serviceId,
      branch_id: branchId,
      appointment_date: date,
      appointment_time: time,
      status: "pending",
      price_ghs: service?.price_ghs ?? null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (appointmentError || !appointment) {
    return { error: "We couldn't create your booking. Please try again." };
  }

  redirect(`/book/success?ref=${appointment.id.slice(0, 8)}`);
}
