import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/primitives";
import { createServiceClient } from "@/lib/supabase/service";
import { formatGHS } from "@/lib/utils";
import type { SubscriptionPlan } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { PaystackCheckoutClient } from "@/components/membership/paystack-checkout-client";

type Props = {
  searchParams: {
    planId?: string;
  };
};

export default async function MembershipCheckoutPage({ searchParams }: Props) {
  const planId = searchParams.planId;
  if (!planId) {
    return notFound();
  }

  const supabase = createServiceClient();
  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .maybeSingle();

  if (error || !plan) {
    return notFound();
  }

  const subscriptionPlan = plan as SubscriptionPlan;
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-[#000a54] px-6 py-20 text-center text-white">
        <Navbar />
        <div className="mx-auto mt-20 max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-12 backdrop-blur-lg">
          <h1 className="text-3xl font-bold">Checkout configuration required</h1>
          <p className="mt-4 text-sm text-white/70">
            Please set <code className="rounded bg-slate-950/80 px-2 py-1 text-xs text-amber-300">NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> in your environment.
          </p>
        </div>
      </div>
    );
  }

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
            <Sparkles className="h-10 w-10 text-amber-400" />
          </div>
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            Checkout
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
            Confirm your Smile Club membership
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            You selected the {subscriptionPlan.name} plan. Pay the first month securely to unlock priority care, discounts, and dedicated support.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-slate-900/10">
            <div className="grid gap-8 p-10 md:grid-cols-[1.3fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-slate-950/95 p-8 text-white shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Selected plan</p>
                  <h2 className="mt-4 font-serif text-4xl font-bold">{subscriptionPlan.name}</h2>
                  <p className="mt-2 text-sm text-white/70">{subscriptionPlan.description}</p>
                  <div className="mt-8 flex items-end gap-3">
                    <span className="text-5xl font-extrabold">{formatGHS(subscriptionPlan.price_ghs)}</span>
                    <span className="mb-1 text-sm text-white/50">/ month</span>
                  </div>
                </div>

                <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    What's included
                  </p>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {(subscriptionPlan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ShieldCheck className="mt-1 h-4 w-4 text-teal-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6 rounded-[1.5rem] border border-slate-200 bg-white p-8">
                <div className="rounded-3xl bg-slate-950/95 p-6 text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Ready to pay</p>
                  <p className="mt-4 text-2xl font-semibold">Secure checkout</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Complete your membership purchase and our team will activate your plan immediately.
                  </p>
                </div>

                <Button
                  href="#payment"
                  className="w-full bg-amber-400 text-[#000a54] hover:bg-amber-300"
                >
                  Proceed to payment
                </Button>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Next step</p>
                  <p className="mt-2">
                    After you pay, an SMS and email confirmation will be sent and your Smile Club membership will be activated.
                  </p>
                </div>
              </div>
            </div>

            <div id="payment" className="border-t border-slate-200 p-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900">Payment details</h2>
              <p className="mt-3 text-sm text-slate-600">
                Complete your membership checkout below to pay for your first month and activate your Smile Club plan.
              </p>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <PaystackCheckoutClient plan={subscriptionPlan} publicKey={publicKey} />
                </div>
                <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-100 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pay later</p>
                    <p className="mt-3 text-sm text-slate-700">
                      If you prefer, contact us to complete payment via WhatsApp or phone.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Need help?</p>
                    <p className="mt-3 text-sm text-slate-700">
                      Call or WhatsApp +233 24 000 0000 for immediate support with your membership payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/membership" variant="ghost" className="w-full sm:w-auto">
              Back to membership
            </Button>
            <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-2xl bg-[#000a54] px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 sm:w-auto">
              Contact support <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
