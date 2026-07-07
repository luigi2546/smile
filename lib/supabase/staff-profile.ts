import { createClient } from "@/lib/supabase/server";
import type { StaffProfile } from "@/lib/types";

/**
 * Returns the StaffProfile for the currently authenticated user,
 * or null if the user has no profile (shouldn't happen in protected routes).
 */
export async function getStaffProfile(): Promise<StaffProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as StaffProfile) ?? null;
}
