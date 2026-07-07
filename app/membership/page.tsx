import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { createServiceClient } from "@/lib/supabase/service";
import { formatGHS } from "@/lib/utils";
import type { SubscriptionPlan } from "@/lib/types";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Crown,
  Star,
  Zap,
  Shield,
  Gift,
  Clock,
  PhoneCall,
  BadgeCheck,
} from "lucide-react";

/* ── Plan configuration ───────────────────────────────────── */
const PLAN_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    accent: string;
    badge?: string;
    highlight: boolean;
    gradient: string;
    iconBg: string;
    checkColor: string;
    btnClass: string;
    descColor: string;
    priceColor: string;
    perColor: string;
    featureColor: string;
  }
> = {
  Basic: {
    icon: <Star className="h-6 w-6 text-amber-400" />,
    accent: "",
    highlight: false,
    gradient: "from-white to-slate-50",
    iconBg: "bg-amber-50",
    checkColor: "text-teal-600",
    btnClass:
      "bg-teal-darker text-white hover:bg-teal-darker/90 shadow-lg shadow-teal-darker/20",
    descColor: "text-slate-500",
    priceColor: "text-teal-darker",
    perColor: "text-slate-400",
    featureColor: "text-slate-700",
  },
  Premium: {
    icon: <Crown className="h-6 w-6 text-amber-300" />,
    accent: "ring-2 ring-amber-400/50",
    badge: "Most Popular",
    highlight: true,
    gradient: "from-[#000a54] to-[#000840]",
    iconBg: "bg-amber-400/20",
    checkColor: "text-amber-400",
    btnClass:
      "bg-amber-400 text-[#000a54] hover:bg-amber-300 font-bold shadow-lg shadow-amber-400/30",
    descColor: "text-white/50",
    priceColor: "text-white",
    perColor: "text-white/40",
    featureColor: "text-white/80",
  },
};

const DEFAULT_CONFIG = PLAN_CONFIG["Basic"];

/* ── Highlights row above plans ──────────────────────────── */
const HIGHLIGHTS = [
  { icon: <Zap className="h-5 w-5" />, label: "Priority Booking" },
  { icon: <Shield className="h-5 w-5" />, label: "Guaranteed Care" },
  { icon: <Gift className="h-5 w-5" />, label: "Exclusive Discounts" },
  { icon: <Clock className="h-5 w-5" />, label: "Flexible Scheduling" },
  { icon: <PhoneCall className="h-5 w-5" />, label: "Dedicated Support" },
  { icon: <BadgeCheck className="h-5 w-5" />, label: "Cancel Anytime" },
];

/* ── Page ───────────────────────────────────────────────── */
export default async function MembershipPage() {
  const supabase = createServiceClient();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_ghs");

  const activePlans = (plans as SubscriptionPlan[] | null) ?? [];

  return (
    <>
      <section className="relative bg-[#000a54] px-6 pb-32 pt-0 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <Navbar />

        <div className="relative mx-auto max-w-3xl mt-20">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 ring-1 ring-amber-400/30">
            <Sparkles className="h-9 w-9 text-amber-400" />
          </div>
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            Smile Club Membership
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
            Invest in your{" "}
            <span className="text-amber-400">brightest smile</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Monthly plans built around your dental health — with priority access,
            generous discounts, and dedicated care all year round.
          </p>
        </div>

        {/* Highlights bar */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm"
              >
                <span className="text-amber-400">{h.icon}</span>
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plan Cards ────────────────────────────────────── */}
      <section className="relative -mt-16 px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div
            className={`grid gap-6 ${
              activePlans.length === 1
                ? "max-w-sm mx-auto"
                : activePlans.length === 2
                ? "sm:grid-cols-2 max-w-3xl mx-auto"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {activePlans.map((plan) => {
              const cfg = PLAN_CONFIG[plan.name] ?? DEFAULT_CONFIG;
              const features = plan.features as string[];
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl bg-gradient-to-b p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${cfg.gradient} ${cfg.accent}`}
                >
                  {/* Badge */}
                  {cfg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#000a54] shadow-lg shadow-amber-400/40">
                      ★ {cfg.badge}
                    </div>
                  )}

                  {/* Plan icon + name */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl p-3 ${cfg.iconBg}`}
                    >
                      {cfg.icon}
                    </div>
                    <div>
                      <p
                        className={`font-serif text-2xl font-bold ${
                          cfg.highlight ? "text-white" : "text-[#000a54]"
                        }`}
                      >
                        {plan.name}
                      </p>
                      {plan.description && (
                        <p className={`text-xs leading-snug ${cfg.descColor}`}>
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-7">
                    <div className="flex items-end gap-1">
                      <span className={`font-serif text-5xl font-extrabold tracking-tight ${cfg.priceColor}`}>
                        {formatGHS(plan.price_ghs)}
                      </span>
                      <span className={`mb-1.5 text-sm font-medium ${cfg.perColor}`}>
                        / month
                      </span>
                    </div>
                    <p className={`mt-1 text-xs ${cfg.descColor}`}>
                      Billed monthly · Cancel any time
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className={`mb-6 h-px ${
                      cfg.highlight ? "bg-white/10" : "bg-slate-100"
                    }`}
                  />

                  {/* Features */}
                  <ul className="mb-8 flex-1 space-y-3.5">
                    {features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.checkColor}`}
                        />
                        <span className={`text-sm leading-relaxed ${cfg.featureColor}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={`/membership/checkout?planId=${plan.id}`}
                    className={`block w-full rounded-2xl px-6 py-3.5 text-center text-sm font-semibold transition-all duration-200 ${cfg.btnClass}`}
                  >
                    Subscribe now →
                  </Link>
                </div>
              );
            })}

            {activePlans.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-gray-200 py-16 text-center text-muted">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p>No membership plans available right now.</p>
                <p className="mt-1 text-sm">Please check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────── */}
      {activePlans.length >= 2 && (
        <section className="border-t border-gray-100 bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center font-serif text-3xl font-bold text-[#000a54]">
              Plan Comparison
            </h2>
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left font-semibold text-slate-500">
                      Feature
                    </th>
                    {activePlans.map((p) => {
                      const cfg = PLAN_CONFIG[p.name] ?? DEFAULT_CONFIG;
                      return (
                        <th
                          key={p.id}
                          className={`px-6 py-4 text-center font-bold ${
                            cfg.highlight
                              ? "bg-[#000a54] text-white"
                              : "text-[#000a54]"
                          }`}
                        >
                          {p.name}
                          <div
                            className={`mt-0.5 text-xs font-normal ${
                              cfg.highlight ? "text-white/50" : "text-slate-400"
                            }`}
                          >
                            {formatGHS(p.price_ghs)}/mo
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Gather unique features across all plans */}
                  {Array.from(
                    new Set(activePlans.flatMap((p) => p.features as string[]))
                  ).map((feature, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-3.5 font-medium text-slate-700">
                        {feature}
                      </td>
                      {activePlans.map((p) => {
                        const cfg = PLAN_CONFIG[p.name] ?? DEFAULT_CONFIG;
                        const has = (p.features as string[]).includes(feature);
                        return (
                          <td
                            key={p.id}
                            className={`px-6 py-3.5 text-center ${
                              cfg.highlight ? "bg-[#000a54]/5" : ""
                            }`}
                          >
                            {has ? (
                              <CheckCircle2 className="mx-auto h-5 w-5 text-teal-600" />
                            ) : (
                              <span className="text-slate-200">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Price row */}
                  <tr className="border-t-2 border-gray-100 bg-slate-50">
                    <td className="px-6 py-4 font-bold text-[#000a54]">
                      Monthly Price
                    </td>
                    {activePlans.map((p) => {
                      const cfg = PLAN_CONFIG[p.name] ?? DEFAULT_CONFIG;
                      return (
                        <td
                          key={p.id}
                          className={`px-6 py-4 text-center font-bold ${
                            cfg.highlight
                              ? "bg-[#000a54]/5 text-[#000a54]"
                              : "text-[#000a54]"
                          }`}
                        >
                          {formatGHS(p.price_ghs)}/mo
                        </td>
                      );
                    })}
                  </tr>
                  {/* CTA row */}
                  <tr>
                    <td className="px-6 py-4" />
                    {activePlans.map((p) => {
                      const cfg = PLAN_CONFIG[p.name] ?? DEFAULT_CONFIG;
                      return (
                        <td key={p.id} className="px-6 py-4 text-center">
                          <Link
                            href={`/membership/checkout?planId=${p.id}`}
                            className={`inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition ${cfg.btnClass}`}
                          >
                            Subscribe {p.name}
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ──────────────────────────────────── */}
      <section className="bg-[#000a54]/[0.03] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-[#000a54]">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Book an appointment",
                desc: "Book your first visit and let our team know you'd like to join the Smile Club.",
                icon: <Clock className="h-6 w-6 text-amber-400" />,
              },
              {
                step: "02",
                title: "Choose your plan",
                desc: "Our admin team will set up your monthly plan and record your first payment.",
                icon: <Sparkles className="h-6 w-6 text-amber-400" />,
              },
              {
                step: "03",
                title: "Enjoy the perks",
                desc: "Priority bookings, exclusive discounts, and dedicated care every single month.",
                icon: <Gift className="h-6 w-6 text-amber-400" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                  {item.icon}
                </div>
                <p className="mb-2 font-mono text-xs font-bold tracking-widest text-amber-400">
                  STEP {item.step}
                </p>
                <h3 className="mb-2 font-serif text-lg font-bold text-[#000a54]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
