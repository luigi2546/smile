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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) return null;

  const { data, error, status } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && status === 406) {
    const fallbackName =
      user.user_metadata?.full_name ??
      user.email?.split("@")[0] ??
      "Staff Member";

    const {
      data: insertedProfile,
      error: insertError,
    } = await supabase
      .from("staff_profiles")
      .insert({ id: user.id, full_name: fallbackName })
      .single();

    if (insertError) {
      throw insertError;
    }

    return insertedProfile as StaffProfile;
  }

  if (error) {
    throw error;
  }

  return (data as StaffProfile) ?? null;
}
