"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBranch(formData: FormData) {
  const name = String(formData.get("name") || "");
  const address = String(formData.get("address") || "");
  const phone = String(formData.get("phone") || "");
  const supabase = createClient();
  await supabase.from("branches").insert({ name, address, phone: phone || null });
  revalidatePath("/admin/branches");
}

export async function toggleBranchActive(branchId: string, isActive: boolean) {
  const supabase = createClient();
  await supabase.from("branches").update({ is_active: !isActive }).eq("id", branchId);
  revalidatePath("/admin/branches");
}
