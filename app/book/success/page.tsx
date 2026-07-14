import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { CheckCircle2, CalendarCheck, Home, Receipt } from "lucide-react";
import { PaymentReceipt } from "@/components/receipt/payment-receipt";
import { createServiceClient } from "@/lib/supabase/service";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { appointmentId?: string; ref?: string; pref?: string; paid?: string };
}) {
  const paidFull = searchParams.paid === "full";
  const supabase = createServiceClient();
  const { data: appointment } = searchParams.appointmentId
    ? await supabase
        .from("appointments")
        .select("id, created_at, status, amount_paid_ghs, customer:customers(full_name, phone), service:services(name), branch:branches(name)")
        .eq("id", searchParams.appointmentId)
        .maybeSingle()
    : { data: null };
  const payment = appointment as any;

  return (
    <>
      <section className="receipt-screen-only relative bg-[#000a54] px-6 pb-28 pt-0 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto mt-20 max-w-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-400/20 ring-2 ring-emerald-400/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            Appointment Confirmed!
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/60">
            {paidFull
              ? "Your full payment has been received. Your appointment is secured."
              : "Your GHS 30 booking fee has been received. Your slot is secured — pay the remaining service fee at the clinic."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {searchParams.ref && (
              <div className="inline-block rounded-2xl border border-amber-400/30 bg-amber-400/10 px-6 py-3">
                <p className="text-xs uppercase tracking-widest text-amber-300">
                  Booking Ref
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-white">
                  #{searchParams.ref.toUpperCase()}
                </p>
              </div>
            )}
            {searchParams.pref && (
              <div className="inline-block rounded-2xl border border-white/10 bg-white/5 px-6 py-3">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Payment Ref
                </p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-white/80">
                  {searchParams.pref}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="receipt-screen-only relative -mt-10 px-6 pb-16">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-slate-900/5">
            <h2 className="font-serif text-xl font-bold text-[#000a54]">
              What happens next?
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                "Our team will confirm your appointment via phone or WhatsApp.",
                "You'll receive a reminder the day before your visit.",
                paidFull
                  ? "Arrive a few minutes early and check in at reception."
                  : "Arrive a few minutes early and pay the remaining service fee at reception.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-darker/10 text-xs font-bold text-[#000a54]">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4">
              <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-700">
                {paidFull ? (
                  <>
                    <span className="font-semibold">Full treatment amount paid.</span>{" "}
                    No booking fee will be charged separately.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">GHS 30 booking fee paid.</span>{" "}
                    This secures your slot. The remaining service amount is paid at
                    the clinic.
                  </>
                )}
              </p>
            </div>

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

      {payment && (
        <section className="px-6 pb-24">
          <PaymentReceipt
            receiptNumber={`SC-SES-${payment.id.slice(0, 8).toUpperCase()}`}
            customerName={payment.customer?.full_name ?? "Customer"}
            customerPhone={payment.customer?.phone}
            description={payment.service?.name ?? "Treatment session"}
            paymentType={paidFull ? "Full treatment payment" : "Booking fee"}
            amount={Number(payment.amount_paid_ghs ?? 0)}
            date={payment.created_at}
            reference={searchParams.pref}
            status="Paid"
            branch={payment.branch?.name}
          />
        </section>
      )}

      <div className="receipt-screen-only"><Footer /></div>
    </>
  );
}
