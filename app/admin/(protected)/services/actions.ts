"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

async function getClient() {
  try {
    return createServiceClient();
  } catch {
    return createClient();
  }
}

export async function addService(formData: FormData) {
  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const category = String(formData.get("category") || "General");
  const price_ghs = Number(formData.get("price_ghs") || 0);
  const duration_minutes = Number(formData.get("duration_minutes") || 30);

  try {
    const supabase = await getClient();
    const res = await supabase.from("services").insert({
      name,
      description: description || null,
      category,
      price_ghs,
      duration_minutes,
    });
    if (res.error) {
      console.error("addService supabase error:", res.error);
      throw res.error;
    }
    revalidatePath("/admin/services");
  } catch (err) {
    console.error("addService error:", err);
    throw err;
  }
}

export async function updateService(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const category = String(formData.get("category") || "General");
  const price_ghs = Number(formData.get("price_ghs") || 0);
  const duration_minutes = Number(formData.get("duration_minutes") || 30);
  const is_active = String(formData.get("is_active")) === "on";

  try {
    const supabase = await getClient();
    const res = await supabase
      .from("services")
      .update({
        name,
        description: description || null,
        category,
        price_ghs,
        duration_minutes,
        is_active,
      })
      .eq("id", id);
    if (res.error) {
      console.error("updateService supabase error:", res.error);
      throw res.error;
    }
    revalidatePath("/admin/services");
  } catch (err) {
    console.error("updateService error:", err);
    throw err;
  }
}

export async function deleteService(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  try {
    const supabase = await getClient();
    const res = await supabase.from("services").delete().eq("id", id);
    if (res.error) {
      console.error("deleteService supabase error:", res.error);
      throw res.error;
    }
    revalidatePath("/admin/services");
  } catch (err) {
    console.error("deleteService error:", err);
    throw err;
  }
}
