import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createServiceClient } from "@/lib/supabase/service";
import { formatGHS } from "@/lib/utils";
import { defaultServices } from "@/lib/data/default-data";
import type { Service } from "@/lib/types";
import Link from "next/link";
import { Clock, ArrowRight, Stethoscope, Sparkles, ShieldCheck, Smile } from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { color: string; bg: string; dot: string }
> = {
  Cosmetic:   { color: "text-[#0039A6]", bg: "bg-[#EEF3FF]", dot: "bg-[#0039A6]" },
  Preventive: { color: "text-[#0F6A44]", bg: "bg-[#EBF7EF]", dot: "bg-[#0F6A44]" },
  General:    { color: "text-[#7A5B00]", bg: "bg-[#FFF9E5]", dot: "bg-[#7A5B00]" },
  Pediatric:  { color: "text-[#3F3D56]", bg: "bg-[#F0EFFF]", dot: "bg-[#3F3D56]" },
  Corporate:  { color: "text-[#114D4C]", bg: "bg-[#EEF8F8]", dot: "bg-[#114D4C]" },
};

const DEFAULT_CAT = { color: "text-teal-700", bg: "bg-teal-50", dot: "bg-teal-700" };

const CAT_ICONS: Record<string, React.ReactNode> = {
  Cosmetic:   <Sparkles className="h-5 w-5" />,
  Preventive: <ShieldCheck className="h-5 w-5" />,
  General:    <Stethoscope className="h-5 w-5" />,
  Pediatric:  <Smile className="h-5 w-5" />,
  Corporate:  <ShieldCheck className="h-5 w-5" />,
};

export default async function ServicesPage() {
  const supabase = createServiceClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const activeServices = (services as Service[] | null) ?? [];
  const displayedServices =
    activeServices.length > 0 ? activeServices : defaultServices;

  const categories = Array.from(
    new Set(displayedServices.map((s) => s.category))
  );

  const grouped = displayedServices.reduce<Record<string, Service[]>>(
    (acc, s) => {
      acc[s.category] = acc[s.category] ? [...acc[s.category], s] : [s];
      return acc;
    },
    {}
  );

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
                <Stethoscope className="h-3.5 w-3.5" /> Our Services
              </span>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
                Premium dental care,{" "}
                <span className="text-amber-400">made easy.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
                From cosmetic brightening to preventive hygiene — every service
                crafted for modern Accra patients with transparent pricing and
                fast online booking.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-[#000a54] shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
                >
                  Book appointment <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/branches"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Find a branch
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 lg:flex-col">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-center backdrop-blur-sm">
                <p className="font-serif text-4xl font-bold text-white">
                  {displayedServices.length}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  Services
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-center backdrop-blur-sm">
                <p className="font-serif text-4xl font-bold text-amber-400">
                  {categories.length}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  Categories
                </p>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat] ?? DEFAULT_CAT;
              return (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                >
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  {cat}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Service Grid ───────────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl space-y-12">
          {[["All services", displayedServices] as const].map(([category, items]) => {
            const cfg = CATEGORY_CONFIG[category] ?? DEFAULT_CAT;
            const CatIcon = CAT_ICONS[category] ?? <Stethoscope className="h-5 w-5" />;
            return (
              <div key={category}>
                {/* Category header */}
                <div className="mb-6 flex items-center pt-20 gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${cfg.bg} ${cfg.color}`}>
                    {CatIcon}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#000a54]">
                      {category}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {displayedServices.length} service{displayedServices.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Service cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-darker/20 hover:shadow-lg"
                    >
                      {/* Category tag */}
                      <span
                        className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                      >
                        {service.category}
                      </span>

                      <h3 className="mt-4 font-serif text-lg font-bold text-[#000a54] group-hover:text-teal-700 transition-colors">
                        {service.name}
                      </h3>

                      {service.description && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                          {service.description}
                        </p>
                      )}

                      {/* Price + Duration + Book */}
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-50 pt-4">
                        <div>
                          <p className="font-serif text-xl font-bold text-[#000a54]">
                            {formatGHS(service.price_ghs)}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {service.duration_minutes} min
                          </p>
                        </div>
                        <Link
                          href={`/book?service=${service.id}`}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-[#000a54] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700"
                        >
                          Book <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
