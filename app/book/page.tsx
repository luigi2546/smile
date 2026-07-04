import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createClient } from "@/lib/supabase/server";
import { BookingWizard } from "@/components/booking/booking-wizard";
import type { Branch, Service } from "@/lib/types";

export default async function BookPage({
  searchParams,
}: {
  searchParams: { service?: string; branch?: string };
}) {
  const supabase = createClient();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("category"),
    supabase.from("branches").select("*").eq("is_active", true).order("name"),
  ]);

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <BookingWizard
          services={(services as Service[]) ?? []}
          branches={(branches as Branch[]) ?? []}
          defaultServiceId={searchParams.service}
          defaultBranchId={searchParams.branch}
        />
      </section>
      <Footer />
    </>
  );
}
