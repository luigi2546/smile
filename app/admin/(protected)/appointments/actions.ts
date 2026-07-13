"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
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
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const notes = String(formData.get("notes") || "");
  const sessionNumber = Number(formData.get("sessionNumber") || 1);
  const totalSessions = Number(formData.get("totalSessions") || 1);
  const shadeBefore = String(formData.get("shadeBefore") || "").trim();
  const shadeAfter = String(formData.get("shadeAfter") || "").trim();
  const followUpDate = String(formData.get("followUpDate") || "").trim();
  const consentConfirmed = formData.get("consentConfirmed") === "on";

  if (!serviceId || !date || !time) {
    throw new Error("Missing required fields");
  }
  if (!Number.isInteger(sessionNumber) || !Number.isInteger(totalSessions) || sessionNumber < 1 || totalSessions < sessionNumber) {
    throw new Error("Session number must be between 1 and the package total");
  }

  const supabase = createClient();

  const { data: location, error: locationError } = await supabase
    .from("branches")
    .select("id")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (locationError || !location) {
    throw new Error("The Smile Center location is not configured");
  }
  const branchId = location.id;

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

  const unitPrice = service?.price_ghs ?? null;
  const price = unitPrice === null ? null : Number(unitPrice) * totalSessions;

  // Insert confirmed appointment
  const { error: apptErr } = await supabase.from("appointments").insert({
    customer_id: customerId,
    service_id: serviceId,
    branch_id: branchId,
    appointment_date: date,
    appointment_time: time,
    status: "confirmed", // default to confirmed for manual staff bookings
    price_ghs: price,
    amount_paid_ghs: price,
    session_number: sessionNumber,
    total_sessions: totalSessions,
    shade_before: shadeBefore || null,
    shade_after: shadeAfter || null,
    follow_up_date: followUpDate || null,
    consent_confirmed: consentConfirmed,
    notes: notes || null,
  });

  if (apptErr) {
    throw new Error(apptErr.message);
  }

  revalidatePath("/admin/appointments");
}

const SESSION_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;

export async function updateWhiteningSession(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const sessionNumber = Number(formData.get("sessionNumber") || 1);
  const totalSessions = Number(formData.get("totalSessions") || 1);
  const shadeBefore = String(formData.get("shadeBefore") || "").trim();
  const shadeAfter = String(formData.get("shadeAfter") || "").trim();
  const followUpDate = String(formData.get("followUpDate") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const consentConfirmed = formData.get("consentConfirmed") === "on";

  if (!id || !SESSION_STATUSES.includes(status as (typeof SESSION_STATUSES)[number])) {
    throw new Error("Invalid session");
  }
  if (!Number.isInteger(sessionNumber) || !Number.isInteger(totalSessions) || sessionNumber < 1 || totalSessions < sessionNumber) {
    throw new Error("Session number must be between 1 and the package total");
  }

  const supabase = createClient();
  const { data: previous } = await supabase
    .from("appointments")
    .select("status, customer_id")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("appointments")
    .update({
      status,
      session_number: sessionNumber,
      total_sessions: totalSessions,
      shade_before: shadeBefore || null,
      shade_after: shadeAfter || null,
      follow_up_date: followUpDate || null,
      consent_confirmed: consentConfirmed,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (previous && previous.status !== "completed" && status === "completed") {
    const { data: customerPackage } = await supabase
      .from("subscriptions")
      .select("id, sessions_used, sessions_total")
      .eq("customer_id", previous.customer_id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (customerPackage && customerPackage.sessions_used < customerPackage.sessions_total) {
      const sessionsUsed = customerPackage.sessions_used + 1;
      await supabase
        .from("subscriptions")
        .update({
          sessions_used: sessionsUsed,
          status: sessionsUsed >= customerPackage.sessions_total ? "expired" : "active",
        })
        .eq("id", customerPackage.id);
      revalidatePath("/admin/subscriptions");
    }
  }

  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
}

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export async function uploadWhiteningPhotos(formData: FormData) {
  const id = String(formData.get("id") || "");
  const beforePhoto = formData.get("beforePhoto");
  const afterPhoto = formData.get("afterPhoto");

  if (!id) throw new Error("Invalid session");

  const authClient = createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error("You must be signed in to upload treatment photos");

  const service = createServiceClient();
  const { data: session } = await service
    .from("appointments")
    .select("id, consent_confirmed")
    .eq("id", id)
    .maybeSingle();

  if (!session) throw new Error("Session not found");
  if (!session.consent_confirmed) {
    throw new Error("Confirm treatment consent before uploading customer photos");
  }

  const updates: Record<string, string> = {};
  for (const [field, value, prefix] of [
    ["before_photo_path", beforePhoto, "before"],
    ["after_photo_path", afterPhoto, "after"],
  ] as const) {
    if (!(value instanceof File) || value.size === 0) continue;
    if (!ALLOWED_PHOTO_TYPES.has(value.type)) throw new Error("Photos must be JPEG, PNG, or WebP");
    if (value.size > MAX_PHOTO_SIZE) throw new Error("Each photo must be 5 MB or smaller");

    const extension = value.type === "image/png" ? "png" : value.type === "image/webp" ? "webp" : "jpg";
    const path = `sessions/${id}/${prefix}-${Date.now()}.${extension}`;
    const bytes = await value.arrayBuffer();
    const { error: uploadError } = await service.storage
      .from("treatment-photos")
      .upload(path, bytes, { contentType: value.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    updates[field] = path;
  }

  if (Object.keys(updates).length === 0) throw new Error("Choose at least one photo to upload");

  const { error } = await service.from("appointments").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/appointments/${id}`);
}
