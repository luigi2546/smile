import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createServiceClient } from "@/lib/supabase/service";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { defaultBranches, defaultServices } from "@/lib/data/default-data";
import type { Branch, Service } from "@/lib/types";
import { CalendarCheck, ShieldCheck, Clock } from "lucide-react";

const TRUST_ITEMS = [
  { icon: <CalendarCheck className="h-4 w-4" />, text: "Instant confirmation" },
  { icon: <ShieldCheck className="h-4 w-4" />, text: "No card required" },
  { icon: <Clock className="h-4 w-4" />, text: "Free cancellation" },
];

export default async function BookPage({
  searchParams,
}: {
  searchParams: { service?: string; branch?: string };
}) {
  const supabase = createServiceClient();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("category"),
    supabase.from("branches").select("*").eq("is_active", true).order("name"),
  ]);

  const activeServices = (services as Service[] | null) ?? [];
  const activeBranches = (branches as Branch[] | null) ?? [];

  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-3xl mt-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <CalendarCheck className="h-3.5 w-3.5" /> Online Booking
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
            Book your{" "}
            <span className="text-amber-400">appointment</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
            Choose a service, pick a branch and time that suits you — we'll
            take care of the rest.
          </p>

          {/* Trust chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
              >
                <span className="text-amber-400">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Wizard ─────────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-slate-900/5">
            <BookingWizard
              services={activeServices.length > 0 ? activeServices : defaultServices}
              branches={activeBranches.length > 0 ? activeBranches : defaultBranches}
              defaultServiceId={searchParams.service}
              defaultBranchId={searchParams.branch}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
