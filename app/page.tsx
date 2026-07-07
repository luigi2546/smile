import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button, Card, Badge } from "@/components/ui/primitives";
import { createServiceClient } from "@/lib/supabase/service";
import { formatGHS } from "@/lib/utils";
import type { Branch, Service } from "@/lib/types";
import Link from "next/link";
import { Droplet, Sparkles, Brush, Smile, MapPin, ShieldCheck, Gift, Star } from "lucide-react";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Teeth Whitening": Droplet,
  "Dental Cleaning": Sparkles,
  "Scaling & Polishing": Brush,
  "Smile Makeover": Smile,
};

// heroStats removed

const benefits = [
  {
    title: "Fast online booking",
    description: "Reserve your appointment in under 60 seconds.",
    icon: Sparkles,
  },
  {
    title: "Clear pricing",
    description: "Know your cost up front with no surprises.",
    icon: ShieldCheck,
  },
  {
    title: "Follow-up care",
    description: "Reminders and treatment support keep your smile healthy.",
    icon: Gift,
  },
];

const testimonialCards = [
  {
    quote: "The team made my whitening treatment easy and comfortable. I’ll definitely be back.",
    author: "Ama K., Accra",
  },
  {
    quote: "Booking was simple and the clinic was professional from start to finish.",
    author: "Kwame T., East Legon",
  },
];

export default async function HomePage() {
  const supabase = createServiceClient();
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).limit(4),
    supabase.from("branches").select("*").eq("is_active", true),
  ]);

  return (
    <>
      <section className="bg-teal-darker text-white">
        <Navbar />

        <div className="mx-auto max-w-6xl px-6 py-24 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge tone="gold" className="mb-5">Smile Center GH</Badge>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Trusted dental care with fast online booking.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Book cosmetic and preventive dentistry across Accra with transparent prices, friendly clinicians, and easy scheduling.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/book" variant="secondary" size="lg">
                Book appointment
              </Button>
              <Button href="/services" variant="ghost" size="lg" className="border-white/25 text-ink hover:bg-white/10 hover:text-white">
                View services
              </Button>
            </div>

            {/* hero stats removed */}
          </div>

          <div className="mt-14 lg:mt-0 lg:w-[38%]">
            <Card className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/10">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.32em] text-teal">Featured care</p>
                <h2 className="text-3xl font-bold text-white">Smile makeover package</h2>
                <p className="text-sm text-white/70">
                  A premium bundle for brighter, healthier teeth plus consultation support.
                </p>

                <div className="grid gap-3 rounded-3xl bg-white/5 p-5 text-white/75">
                  <div className="flex items-center justify-between text-sm">
                    <span>Consultation</span>
                    <span>GHS 100</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Whitening</span>
                    <span>GHS 450</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Aftercare support</span>
                    <span>Included</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Why choose Smile Center</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-ink">Modern care, clear pricing, and lasting results.</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="p-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-darker/10 text-teal-darker">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-ink">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Featured services</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Care tailored to your smile.</h2>
          </div>
          <Link href="/services" className="text-sm font-medium text-teal-darker hover:underline">
            View all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(services as Service[] | null)?.map((service) => {
            const Icon = serviceIcons[service.name] ?? Smile;
            return (
              <Card key={service.id} className="p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-darker/5 text-teal-darker">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 font-semibold text-ink">{service.name}</p>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
                <p className="mt-5 text-sm font-semibold text-teal-darker">{formatGHS(service.price_ghs)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(14,71,71,.08),_transparent_40%)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal">Booking made simple</p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Start your visit in three easy steps.</h2>
              <p className="mt-4 max-w-xl text-sm text-muted">
                Choose a service, book a branch, and confirm your appointment in minutes.
              </p>

              <div className="mt-8">
                <img src="/booking-illustration.svg" alt="Booking steps illustration" className="mx-auto w-full max-w-2xl rounded-lg shadow-sm" />
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Choose service", description: "Whitening, cleaning or a smile makeover." },
                { label: "Pick a location", description: "Book at the branch nearest you." },
                { label: "Confirm visit", description: "Get instant appointment confirmation." },
              ].map((item) => (
                <Card key={item.label} className="p-6">
                  <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm font-semibold text-ink">{item.label}</div>
                  <p className="mt-4 text-sm text-muted">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Branches</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Find a convenient location.</h2>
          </div>
          <Link href="/branches" className="text-sm font-medium text-teal-darker hover:underline">
            All branches →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {(branches as Branch[] | null)?.map((branch) => (
            <Card key={branch.id} className="p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-darker/5 text-teal-darker">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold text-ink">{branch.name}</p>
              <p className="mt-2 text-sm text-muted">{branch.address}</p>
              {branch.phone && <p className="mt-4 text-sm font-semibold text-teal-darker">{branch.phone}</p>}
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-teal-darker py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge tone="gold" className="mb-4">Smile Club</Badge>
              <h2 className="font-serif text-5xl font-bold text-white">Priority care for loyal smiles.</h2>
              <p className="mt-5 max-w-xl text-sm text-white/90">
                Sign up for membership to get priority booking, whitening savings, and regular follow-up reminders.
              </p>
              <Button href="/book" variant="secondary" size="lg" className="mt-8">
                Join Smile Club
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Priority booking", "Whitening savings", "Birthday rewards", "Follow-up reminders"].map((label) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/75">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Reviews</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-ink">What customers are saying</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonialCards.map((card) => (
              <Card key={card.author} className="p-8">
                <p className="text-lg text-ink/90">“{card.quote}”</p>
                <p className="mt-6 font-semibold text-ink">{card.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
