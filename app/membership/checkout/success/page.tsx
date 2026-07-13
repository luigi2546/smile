import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { formatGHS } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/service";
import type { SubscriptionPlan } from "@/lib/types";
import { notFound } from "next/navigation";

type Props = {
  searchParams: {
    subscriptionId?: string;
    planId?: string;
  };
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const subscriptionId = searchParams.subscriptionId;
  const planId = searchParams.planId;

  if (!subscriptionId || !planId) {
    return notFound();
  }

  const supabase = createServiceClient();
  const [{ data: plan }, { data: subscription }] = await Promise.all([
    supabase.from("subscription_plans").select("*").eq("id", planId).maybeSingle(),
    supabase.from("subscriptions").select("*").eq("id", subscriptionId).maybeSingle(),
  ]);

  if (!plan || !subscription) {
    return notFound();
  }

  const subscriptionPlan = plan as SubscriptionPlan;

  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-28 pt-0 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-3xl mt-20">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 ring-1 ring-amber-400/30">
            <CheckCircle2 className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
            Whitening package activated!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Your whitening package is active. Your payment and available sessions have been recorded.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-slate-900/10 p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-slate-950/95 p-8 text-white shadow-lg shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Package confirmed</p>
                  <h2 className="mt-4 font-serif text-4xl font-bold">{subscriptionPlan.name}</h2>
                  <p className="mt-3 text-sm text-white/70">{subscriptionPlan.description}</p>
                  <div className="mt-8 flex items-center gap-3 text-white/80">
                    <ShieldCheck className="h-5 w-5" />
                    <p>{subscription?.status === "active" ? "Active package" : "Package recorded."}</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Package ID</p>
                  <p className="mt-2 font-mono text-slate-900">{subscriptionId}</p>
                  <p className="mt-4 text-sm text-slate-700">Your package can be managed from the Smile Center dashboard.</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next steps</p>
                <ul className="mt-5 space-y-4 text-sm text-slate-700">
                  <li>We will send confirmation via email and SMS.</li>
                  <li>Your first renewal date is shown in your subscription record.</li>
                  <li>Contact support if you need to update your details.</li>
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-[#000a54] px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
                    Back to home
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
