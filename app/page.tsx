import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button, Card, Badge } from "@/components/ui/primitives";
import { createServiceClient } from "@/lib/supabase/service";
import { formatGHS } from "@/lib/utils";
import type { Service } from "@/lib/types";
import Link from "next/link";
import { Droplet, Sparkles, Brush, Smile, MapPin, ShieldCheck, Gift, Star, Instagram, Facebook, MessageSquare, Youtube, Globe } from "lucide-react";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Teeth Whitening": Droplet,
  "Dental Cleaning": Sparkles,
  "Scaling & Polishing": Brush,
  "Smile Makeover": Smile,
};

const whiteningHighlights = [
  { label: "Transparent pricing", value: "GHS 60", detail: "per whitening session" },
  { label: "Session packages", value: "1-10", detail: "sessions booked upfront" },
  { label: "Treatment tracking", value: "Before & after", detail: "shade and photo records" },
];

const benefits = [
  {
    title: "Built around whitening",
    description: "Book single sessions or packages without confusing dental extras.",
    icon: Sparkles,
  },
  {
    title: "Clear amount due",
    description: "The amount follows the selected number of whitening sessions.",
    icon: ShieldCheck,
  },
  {
    title: "Visible progress",
    description: "Track shades, photos, visits, and follow-ups in one customer record.",
    icon: Gift,
  },
];

const bookingSteps = [
  { label: "Choose sessions", description: "Pick how many whitening sessions the customer wants." },
  { label: "Confirm amount", description: "Pricing updates from the selected session count." },
  { label: "Track results", description: "Save shade notes, before photos, after photos, and follow-up dates." },
];

const packagePerks = ["Session-based pricing", "Before & after records", "Customer history", "Follow-up dates"];

const socialLinks = [
  { label: "Instagram", Icon: Instagram, color: "from-pink-500 via-purple-500 to-orange-400", href: "https://instagram.com/SmileCenterGH" },
  { label: "Facebook", Icon: Facebook, color: "from-blue-600 to-blue-400", href: "https://facebook.com/SmileCenterGH" },
  { label: "WhatsApp", Icon: MessageSquare, color: "from-emerald-600 to-emerald-400", href: "https://wa.me/your-number" },
  { label: "TikTok", Icon: Globe, color: "from-slate-900 via-slate-700 to-black", href: "https://tiktok.com/@SmileCenterGH" },
  { label: "YouTube", Icon: Youtube, color: "from-red-600 to-red-400", href: "https://youtube.com/SmileCenterGH" },
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

const customerReviewCards = [
  {
    quote: "The whitening session was quick and comfortable. The team explained everything and the result looked clean without feeling overdone.",
    author: "Ama K., Accra",
    initials: "AK",
    treatment: "Teeth whitening",
  },
  {
    quote: "Booking was simple, the price was clear, and I liked seeing the before and after shade record after my visit.",
    author: "Kwame T., East Legon",
    initials: "KT",
    treatment: "Whitening package",
  },
  {
    quote: "Friendly staff, bright space, and no confusion about how many sessions I was paying for. I felt looked after from start to finish.",
    author: "Naa A., Osu",
    initials: "NA",
    treatment: "Smile care",
  },
  {
    quote: "I liked that the amount was clear before we started. Picking the number of sessions made the whole visit feel simple.",
    author: "Esi M., Cantonments",
    initials: "EM",
    treatment: "Single session",
  },
  {
    quote: "The team checked my shade, explained the process, and helped me plan my follow-up without pressure.",
    author: "Yaw B., Spintex",
    initials: "YB",
    treatment: "Shade tracking",
  },
  {
    quote: "The before and after view made the difference obvious. It felt organized and professional from booking to checkout.",
    author: "Adjoa S., Labone",
    initials: "AS",
    treatment: "Before & after",
  },
];

export default async function HomePage() {
  const supabase = createServiceClient();
  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).limit(4);

  return (
    <>
      <section className="home-hero overflow-hidden text-white min-h-[72vh] lg:min-h-[75vh]">
        <Navbar />
        <div className="home-hero__motion" aria-hidden="true">
          <span className="home-hero__beam home-hero__beam--one" />
          <span className="home-hero__beam home-hero__beam--two" />
          <span className="home-hero__spark home-hero__spark--one" />
          <span className="home-hero__spark home-hero__spark--two" />
          <span className="home-hero__spark home-hero__spark--three" />
        </div>

        <div className="home-hero__grid mx-auto max-w-6xl px-6 pb-20 pt-32 sm:pt-36 lg:flex lg:items-center lg:justify-between lg:pb-24 lg:pt-40">
          <div className="relative z-10 max-w-2xl">
            <Badge tone="gold" className="mb-5 border border-white/10 bg-white/90 text-teal-darker shadow-sm">Smile Center GH</Badge>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Trusted dental care with fast online booking.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
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

          <div className="relative z-10 mt-14 lg:mt-0 lg:w-[38%]">
            <div className="flex justify-center lg:justify-end mb-6">
              <div className="home-hero__teeth-stage">
                <img
                  src="/hero-teeth-3d.png"
                  alt="3D teeth whitening result"
                  className="home-hero__teeth-model home-hero__teeth-model--after"
                />
                <img
                  src="/hero-teeth-before.png"
                  alt=""
                  aria-hidden="true"
                  className="home-hero__teeth-model home-hero__teeth-model--before"
                />
                <span className="home-hero__whitening-sweep" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4faf9] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Stay connected</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Follow Smile Center on social media</h2>
            </div>
            <p className="max-w-xl text-sm text-muted">
              Discover promotions, smile tips, and clinic updates on your favorite channels.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            {[
              { label: "Instagram", Icon: Instagram, color: "from-pink-500 via-purple-500 to-orange-400", href: "https://instagram.com/SmileCenterGH" },
              { label: "Facebook", Icon: Facebook, color: "from-blue-600 to-blue-400", href: "https://facebook.com/SmileCenterGH" },
              { label: "WhatsApp", Icon: MessageSquare, color: "from-emerald-600 to-emerald-400", href: "https://wa.me/your-number" },
              { label: "TikTok", Icon: Globe, color: "from-slate-900 via-slate-700 to-black", href: "https://tiktok.com/@SmileCenterGH" },
              { label: "YouTube", Icon: Youtube, color: "from-red-600 to-red-400", href: "https://youtube.com/SmileCenterGH" },
            ].map((item, index) => (
              <a
                key={`${item.label}-${index}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-teal hover:bg-teal-50"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white`}>
                  <item.Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="truncate text-sm font-semibold text-ink">@SmileCenterGH</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Customer reviews</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-ink">Real feedback from brighter smiles.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted">
                Customers care about comfort, clear prices, and visible progress. The review section now reflects that whitening journey.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur md:grid-cols-3">
              {[
                { value: "5.0", label: "Average experience" },
                { value: "GHS 60", label: "Clear session price" },
                { value: "3-step", label: "Booking flow" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white px-5 py-4">
                  <p className="font-serif text-3xl font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="review-marquee mt-12" aria-label="Customer review carousel">
            <div className="review-marquee__track">
              {[...customerReviewCards, ...customerReviewCards].map((card, index) => (
                <Card key={`${card.author}-${index}`} className="review-card relative overflow-hidden p-7 shadow-sm">
                  <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-teal-darker/5" />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-darker text-sm font-bold text-white">
                        {card.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{card.author}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{card.treatment}</p>
                      </div>
                    </div>
                    <div className="flex text-gold" aria-label="5 star review">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="relative mt-7 text-base leading-7 text-ink/85">"{card.quote}"</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Why Smile Center</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-ink">A simpler whitening journey from booking to results.</h2>
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
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Whitening and smile care</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Pick the treatment, choose the sessions, see the amount.</h2>
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
              <h2 className="mt-3 font-serif text-4xl font-bold text-ink">Book whitening sessions without confusion.</h2>
              <p className="mt-4 max-w-xl text-sm text-muted">
                Pick the whitening service, choose the number of sessions, and confirm the amount before the visit starts.
              </p>

              <div className="booking-visual mt-8">
                <img src="/booking-calendar-illustration.png" alt="Calendar and phone booking illustration for whitening sessions" className="booking-visual__image" />
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Choose whitening", description: "Start with the teeth whitening service or package." },
                { label: "Pick sessions", description: "Select how many sessions the customer wants to do." },
                { label: "Confirm amount", description: "The total updates clearly from the selected session count." },
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

      <section className="overflow-hidden bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal">Customer reviews</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-ink">Real feedback from brighter smiles.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted">
                Customers care about comfort, clear prices, and visible progress. The review section now reflects that whitening journey.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur md:grid-cols-3">
              {[
                { value: "5.0", label: "Average experience" },
                { value: "GHS 60", label: "Clear session price" },
                { value: "3-step", label: "Booking flow" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white px-5 py-4">
                  <p className="font-serif text-3xl font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="review-marquee mt-12" aria-label="Customer review carousel">
            <div className="review-marquee__track">
              {[...customerReviewCards, ...customerReviewCards].map((card, index) => (
                <Card key={`${card.author}-${index}`} className="review-card relative overflow-hidden p-7 shadow-sm">
                  <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-teal-darker/5" />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-darker text-sm font-bold text-white">
                        {card.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{card.author}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{card.treatment}</p>
                      </div>
                    </div>
                    <div className="flex text-gold" aria-label="5 star review">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="relative mt-7 text-base leading-7 text-ink/85">"{card.quote}"</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hidden">
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
