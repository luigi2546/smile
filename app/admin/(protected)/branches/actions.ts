"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  try {
    return createServiceClient();
  } catch {
    return createClient();
  }
}

export async function addBranch(formData: FormData) {
  const name = String(formData.get("name") || "");
  const address = String(formData.get("address") || "");
  const phone = String(formData.get("phone") || "");
  try {
    const supabase = await getSupabase();
    const res = await supabase.from("branches").insert({ name, address, phone: phone || null });
    if (res.error) throw res.error;
    revalidatePath("/admin/branches");
  } catch (err) {
    console.error("addBranch error:", err);
    throw err;
  }
}

export async function editBranch(branchId: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const address = String(formData.get("address") || "");
  const phone = String(formData.get("phone") || "");
  try {
    const supabase = await getSupabase();
    const res = await supabase.from("branches").update({ name, address, phone: phone || null }).eq("id", branchId);
    if (res.error) throw res.error;
    revalidatePath("/admin/branches");
  } catch (err) {
    console.error("editBranch error:", err);
    throw err;
  }
}

export async function deleteBranch(branchId: string) {
  try {
    const supabase = await getSupabase();
    const res = await supabase.from("branches").delete().eq("id", branchId);
    if (res.error) throw res.error;
    revalidatePath("/admin/branches");
  } catch (err) {
    console.error("deleteBranch error:", err);
    throw err;
  }
}

export async function toggleBranchActive(branchId: string, isActive: boolean) {
  try {
    const supabase = await getSupabase();
    const res = await supabase.from("branches").update({ is_active: !isActive }).eq("id", branchId);
    if (res.error) throw res.error;
    revalidatePath("/admin/branches");
  } catch (err) {
    console.error("toggleBranchActive error:", err);
    throw err;
  }
}
