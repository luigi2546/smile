import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SimpleBookingFlow } from "@/components/booking/simple-booking-flow";
import { createServiceClient } from "@/lib/supabase/service";
import { defaultBranches, defaultServices } from "@/lib/data/default-data";
import type { Branch, Service } from "@/lib/types";
import { CalendarCheck } from "lucide-react";

export default async function SimpleBookPage() {
  const supabase = createServiceClient();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("category"),
    supabase.from("branches").select("*").eq("is_active", true).order("name"),
  ]);
  const activeServices = (services as Service[] | null)?.length ? (services as Service[]) : defaultServices;
  const activeBranches = (branches as Branch[] | null)?.length ? (branches as Branch[]) : defaultBranches;

  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0">
        <Navbar />
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <CalendarCheck className="h-3.5 w-3.5" /> Simple booking preview
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Book in three easy steps
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
            Tell us who you are, choose a convenient time, then review everything before requesting your appointment.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10">
          <SimpleBookingFlow services={activeServices} branches={activeBranches} />
        </div>
      </section>
      <Footer />
    </>
  );
}
