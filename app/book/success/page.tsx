import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { CheckCircle2, CalendarCheck, ArrowRight, Home } from "lucide-react";

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-xl mt-20">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 ring-2 ring-amber-400/30">
            <CheckCircle2 className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            Booking Confirmed!
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/60">
            Thank you — we&apos;ve received your appointment request. It has been
            recorded in our system and our team will reach out shortly to
            verify the details.
          </p>
          {searchParams.ref && (
            <div className="mt-6 inline-block rounded-2xl border border-amber-400/30 bg-amber-400/10 px-6 py-3">
              <p className="text-xs uppercase tracking-widest text-amber-300">
                Reference
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-white">
                #{searchParams.ref}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Next steps card ────────────────────────────── */}
      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-slate-900/5">
            <h2 className="font-serif text-xl font-bold text-[#000a54]">
              What happens next?
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                "Our team will confirm your appointment via phone or WhatsApp.",
                "You'll receive a reminder the day before your visit.",
                "Arrive 5 minutes early — we'll take care of everything else.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-darker/10 text-xs font-bold text-[#000a54]">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#000a54] px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                <CalendarCheck className="h-4 w-4" /> Book another
              </Link>
              <Link
                href="/"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-gray-50"
              >
                <Home className="h-4 w-4" /> Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
