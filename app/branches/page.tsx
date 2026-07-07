import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createServiceClient } from "@/lib/supabase/service";
import { defaultBranches } from "@/lib/data/default-data";
import type { Branch } from "@/lib/types";
import Link from "next/link";
import { MapPin, Phone, ArrowRight, Building2, Clock } from "lucide-react";

export default async function BranchesPage() {
  const supabase = createServiceClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name");

  const activeBranches = (branches as Branch[] | null) ?? [];
  const displayedBranches =
    activeBranches.length > 0 ? activeBranches : defaultBranches;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-6xl mt-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
                <Building2 className="h-3.5 w-3.5" /> Our Locations
              </span>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
                Smile Center across{" "}
                <span className="text-amber-400">Accra.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
                {displayedBranches.length === 1
                  ? "One branch — perfectly placed in the heart of Accra."
                  : `${displayedBranches.length} branches across Accra — each fully equipped with modern dental technology and warm, expert care.`}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-[#000a54] shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
                >
                  Book at any branch <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View services
                </Link>
              </div>
            </div>

            {/* Branch count stat */}
            <div className="rounded-3xl border border-white/10 bg-white/5 px-10 py-8 text-center backdrop-blur-sm">
              <p className="font-serif text-5xl font-bold text-amber-400">
                {displayedBranches.length}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/50">
                {displayedBranches.length === 1 ? "Branch" : "Branches"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Branch Cards ────────────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedBranches.map((b, i) => (
              <div
                key={b.id}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-darker/20 hover:shadow-xl"
              >
                {/* Branch number badge */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000a54]/5">
                    <MapPin className="h-5 w-5 text-[#000a54]" />
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                    Branch {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#000a54] group-hover:text-teal-700 transition-colors">
                  {b.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {b.address}
                </p>

                {b.phone && (
                  <a
                    href={`tel:${b.phone}`}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-[#000a54] transition hover:text-teal-600"
                  >
                    <Phone className="h-4 w-4" />
                    {b.phone}
                  </a>
                )}

                {/* Hours hint */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Mon–Sat · 8:00 AM – 6:00 PM
                </div>

                <div className="mt-6 border-t border-gray-50 pt-5">
                  <Link
                    href={`/book?branch=${b.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#000a54] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
                  >
                    Book at {b.name} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
