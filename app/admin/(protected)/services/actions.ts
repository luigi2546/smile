"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addService(formData: FormData) {
  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const category = String(formData.get("category") || "General");
  const price_ghs = Number(formData.get("price_ghs") || 0);
  const duration_minutes = Number(formData.get("duration_minutes") || 30);

  const supabase = createClient();
  await supabase.from("services").insert({
    name,
    description: description || null,
    category,
    price_ghs,
    duration_minutes,
  });
  revalidatePath("/admin/services");
}
