import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createServiceClient } from "@/lib/supabase/service";
import type { Branch } from "@/lib/types";
import { defaultBranches } from "@/lib/data/default-data";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  HeadphonesIcon,
} from "lucide-react";

const CONTACT_CHANNELS = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    value: "+233 24 000 0000",
    sub: "Mon – Sat · 8AM – 6PM",
    href: "tel:+233240000000",
    cta: "Call now",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    value: "smilecentergh@hotmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:smilecentergh@hotmail.com",
    cta: "Send email",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "WhatsApp",
    value: "+233 24 000 0000",
    sub: "Quickest way to reach us",
    href: "https://wa.me/233240000000",
    cta: "Chat on WhatsApp",
  },
];

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "You can book online in under 2 minutes at our Book page. Select a service, choose a branch and time, fill in your details and you're done.",
  },
  {
    q: "What are your opening hours?",
    a: "All branches are open Monday to Saturday, 8:00 AM – 6:00 PM. Emergency appointments may be available outside these hours — call us to confirm.",
  },
  {
    q: "How does the Smile Club membership work?",
    a: "Smile Club is a monthly subscription giving you priority bookings, discounts, and regular cleanings. Contact us or visit the Membership page to learn more.",
  },
  {
    q: "Do you accept walk-ins?",
    a: "We welcome walk-ins where capacity allows, but we strongly recommend booking online to avoid waiting.",
  },
  {
    q: "Can I reschedule or cancel my appointment?",
    a: "Yes — call or WhatsApp us at least 24 hours before your appointment and we'll reschedule at no charge.",
  },
];

export default async function ContactPage() {
  const supabase = createServiceClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name");

  const displayedBranches =
    ((branches as Branch[] | null) ?? []).length > 0
      ? (branches as Branch[])
      : defaultBranches;

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
            <HeadphonesIcon className="h-3.5 w-3.5" /> Contact Us
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
            We&apos;d love to{" "}
            <span className="text-amber-400">hear from you.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
            Have a question, need to reschedule, or just want to know more?
            Reach out through any of the channels below — our team is always
            happy to help.
          </p>
        </div>
      </section>

      {/* ── Contact Channels ───────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {CONTACT_CHANNELS.map((ch) => (
              <div
                key={ch.title}
                className="flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-slate-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000a54]/5 text-[#000a54]">
                  {ch.icon}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {ch.title}
                </p>
                <p className="mt-1.5 font-semibold text-[#000a54]">{ch.value}</p>
                <p className="mt-1 text-xs text-slate-400">{ch.sub}</p>
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-2xl bg-[#000a54] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
                >
                  {ch.cta} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form + Branches ────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-2">

          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#000a54]">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Fill in the form and we'll get back to you within 24 hours.
            </p>
            <form className="mt-6 space-y-4" action="mailto:smilecentergh@hotmail.com" method="get" encType="text/plain">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Ama Asante"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Phone / WhatsApp
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+233 24 000 0000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Subject
                </label>
                <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600" name="subject">
                  <option>General Enquiry</option>
                  <option>Appointment Question</option>
                  <option>Membership / Smile Club</option>
                  <option>Billing / Payment</option>
                  <option>Feedback or Complaint</option>
                  <option>Corporate / Group Enquiry</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Message
                </label>
                <textarea
                  name="body"
                  rows={5}
                  required
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#000a54] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
              >
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Branch listings */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#000a54]">
              Our Branches
            </h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              Walk in or call ahead — we're always ready for you.
            </p>
            <div className="space-y-4">
              {displayedBranches.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#000a54]/5">
                      <MapPin className="h-5 w-5 text-[#000a54]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#000a54]">{b.name}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{b.address}</p>
                      {b.phone && (
                        <a
                          href={`tel:${b.phone}`}
                          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" /> {b.phone}
                        </a>
                      )}
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> Mon–Sat · 8AM – 6PM
                      </p>
                    </div>
                    <Link
                      href={`/book?branch=${b.id}`}
                      className="shrink-0 rounded-xl bg-[#000a54] px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="bg-[#000a54]/[0.03] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">FAQ</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#000a54]">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="font-semibold text-[#000a54]">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Still have questions?{" "}
              <a
                href="mailto:smilecentergh@hotmail.com"
                className="font-semibold text-[#000a54] hover:underline"
              >
                Email us directly
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
