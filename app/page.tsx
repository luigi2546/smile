import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button, Card, Badge } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { formatGHS } from "@/lib/utils";
import type { Branch, Service } from "@/lib/types";
import Link from "next/link";
import {
  Droplet,
  Sparkles,
  Brush,
  Smile,
  MapPin,
  ShieldCheck,
  Gift,
  Star,
} from "lucide-react";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Teeth Whitening": Droplet,
  "Dental Cleaning": Sparkles,
  "Scaling & Polishing": Brush,
  "Smile Makeover": Smile,
};

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).limit(4),
    supabase.from("branches").select("*").eq("is_active", true),
  ]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-teal-darker">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-panel" />
        <div className="absolute right-40 bottom-0 h-72 w-72 translate-y-1/3 rounded-full bg-[#0E4747]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center">
          <div>
            <Badge tone="gold" className="mb-5">Ghana&apos;s Trusted Dental Care Brand</Badge>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
              Your Smile.
              <br />
              Our Passion.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Book teeth whitening, cleaning, and full smile makeovers at any of our 4
              branches across Accra — in under 60 seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/book" variant="secondary" size="lg">
                Book Appointment
              </Button>
              <Button href="/services" variant="ghost" size="lg" className="border-white/25 text-white hover:bg-white/10">
                View Services
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["13K+", "Instagram Followers"],
              ["4", "Branches in Accra"],
              ["1,000s", "Smiles Transformed"],
              ["4.9", "Average Rating"],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-serif text-3xl font-bold text-gold">{stat}</p>
                <p className="mt-1 text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Our Services</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">
              A full suite of cosmetic &amp; preventive care
            </h2>
          </div>
          <Link href="/services" className="hidden text-sm font-medium text-teal-darker hover:underline md:block">
            View all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {(services as Service[] | null)?.map((s) => {
            const Icon = serviceIcons[s.name] ?? Smile;
            return (
              <Card key={s.id} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-darker/5">
                  <Icon className="h-5 w-5 text-teal-darker" />
                </div>
                <p className="mt-4 font-semibold text-ink">{s.name}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-3 text-sm font-semibold text-teal-darker">{formatGHS(s.price_ghs)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* BRANCHES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Locations</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Find a branch near you</h2>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {(branches as Branch[] | null)?.map((b) => (
              <Card key={b.id} className="p-6">
                <MapPin className="h-5 w-5 text-teal-darker" />
                <p className="mt-3 font-semibold text-ink">{b.name}</p>
                <p className="mt-1 text-sm text-muted">{b.address}</p>
                {b.phone && <p className="mt-2 text-sm text-teal-darker">{b.phone}</p>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section id="membership" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 rounded-3xl bg-teal-darker p-10 md:grid-cols-2 md:p-14">
          <div>
            <Badge tone="gold" className="mb-4">Smile Club Membership</Badge>
            <h2 className="font-serif text-3xl font-bold text-white">
              Recurring care. Lifetime value.
            </h2>
            <p className="mt-4 text-white/70">
              Join Smile Club for GHS 99/month and get cleaning every 6 months, whitening
              discounts, priority booking, and family discounts.
            </p>
            <Button href="/book" variant="secondary" size="lg" className="mt-6">
              Join Smile Club
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              [ShieldCheck, "Priority booking"],
              [Gift, "Birthday rewards"],
              [Star, "Whitening discount"],
              [Sparkles, "Free consultation"],
            ].map(([Icon, label]) => {
              const IconComp = Icon as React.ComponentType<{ className?: string }>;
              return (
                <div key={label as string} className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <IconComp className="h-5 w-5 text-gold" />
                  <span className="text-sm text-white">{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
