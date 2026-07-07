import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import {
  Users,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

const VALUES = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Patient-First Care",
    desc: "Every decision we make starts with the patient. We listen, we understand, and we deliver care that truly fits each individual.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Clinical Excellence",
    desc: "Our dentists hold international qualifications and commit to continuous professional development to bring you the latest techniques.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Modern Technology",
    desc: "From digital X-rays to same-day restorations, we invest in technology that makes treatments faster, safer, and more comfortable.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Roots",
    desc: "Born and built in Accra, we understand the communities we serve. Smile Center GH is more than a clinic — it's a neighbourhood partner.",
  },
];

const MILESTONES = [
  { year: "2015", title: "Founded", desc: "Opened our first clinic in East Legon with a team of 4." },
  { year: "2018", title: "Expansion", desc: "Grew to 3 branches, introducing cosmetic and pediatric services." },
  { year: "2021", title: "Digital Booking", desc: "Launched online appointment booking, reducing wait times by 60%." },
  { year: "2024", title: "Smile Club", desc: "Introduced monthly membership plans, making dental care accessible to more families." },
];

const STATS = [
  { value: "4+", label: "Branches in Accra" },
  { value: "15k+", label: "Patients treated" },
  { value: "9 yrs", label: "Serving Accra" },
  { value: "4.9★", label: "Average rating" },
];

const TEAM = [
  { name: "Dr. Ama Asante", role: "Founder & Chief Dental Officer", specialty: "Cosmetic Dentistry" },
  { name: "Dr. Kwame Boateng", role: "Senior Dentist", specialty: "Oral Surgery & Implants" },
  { name: "Dr. Efua Mensah", role: "Pediatric Specialist", specialty: "Children's Dentistry" },
  { name: "Dr. Kofi Darko", role: "Branch Director — Tema", specialty: "Preventive & Corporate" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-6xl mt-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
                <Users className="h-3.5 w-3.5" /> About Us
              </span>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
                We believe everyone deserves a{" "}
                <span className="text-amber-400">healthy smile.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                Smile Center GH was founded in Accra with one mission — to make
                premium dental care accessible, affordable, and stress-free for
                every Ghanaian family.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-[#000a54] shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
                >
                  Book a visit <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Get in touch
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-white/10 bg-white/5 px-7 py-6 text-center backdrop-blur-sm"
                >
                  <p className="font-serif text-3xl font-bold text-amber-400">{s.value}</p>
                  <p className="mt-1.5 text-xs uppercase tracking-widest text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-slate-900/5">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  Our Mission
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-[#000a54]">
                  Delivering smiles that last a lifetime.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  We exist to transform dental health across Ghana — one patient at
                  a time. Our clinics combine world-class expertise with a warm,
                  welcoming environment so every visit feels comfortable, not clinical.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Transparent, upfront pricing — no surprises",
                    "Online booking with instant confirmation",
                    "Smile Club membership for ongoing care",
                    "Multilingual staff speaking Twi, Ga & Ewe",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {VALUES.map((v) => (
                  <div key={v.title} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#000a54]/5 text-[#000a54]">
                      {v.icon}
                    </div>
                    <h3 className="mt-3 font-semibold text-[#000a54]">{v.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#000a54]/[0.03] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Our Journey</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#000a54]">
              A decade of growing smiles
            </h2>
          </div>
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-400 to-teal-700/30" />
            <div className="space-y-10">
              {MILESTONES.map((m) => (
                <div key={m.year} className="relative flex items-start gap-6">
                  <div className="absolute -left-5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-[#000a54] shadow">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex-1">
                    <span className="font-mono text-xs font-bold text-amber-500">{m.year}</span>
                    <h3 className="mt-1 font-serif text-lg font-bold text-[#000a54]">{m.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">The Team</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#000a54]">
              Meet the people behind your smile
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => {
              const initials = member.name
                .split(" ")
                .filter((_, idx) => idx > 0)
                .map((n) => n[0])
                .join("");
              return (
                <div
                  key={member.name}
                  className="group rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#000a54] text-xl font-bold text-white">
                    {initials}
                  </div>
                  <h3 className="mt-4 font-serif text-base font-bold text-[#000a54]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-amber-500">{member.role}</p>
                  <p className="mt-2 text-xs text-slate-400">{member.specialty}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────── */}
      <section className="bg-[#000a54] px-6 py-16 text-center">
        <p className="font-serif text-3xl font-bold text-white">
          Ready to experience the difference?
        </p>
        <p className="mt-3 text-white/60">
          Book your first appointment in under 2 minutes.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 text-sm font-bold text-[#000a54] shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
        >
          Book an appointment <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <Footer />
    </>
  );
}
