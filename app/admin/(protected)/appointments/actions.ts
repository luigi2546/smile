"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(appointmentId: string, formData: FormData) {
  const status = String(formData.get("status") || "");
  const supabase = createClient();
  await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  revalidatePath("/admin/appointments");
}
