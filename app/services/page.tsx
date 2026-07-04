import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Card, Button } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { formatGHS } from "@/lib/utils";
import type { Service } from "@/lib/types";

export default async function ServicesPage() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const grouped = (services as Service[] | null)?.reduce<Record<string, Service[]>>((acc, s) => {
    acc[s.category] = acc[s.category] ? [...acc[s.category], s] : [s];
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Our Services</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">
          A full suite of cosmetic &amp; preventive care
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Every treatment plan is personalized. Prices below are starting estimates —
          your exact quote is confirmed at consultation.
        </p>

        <div className="mt-12 space-y-12">
          {grouped &&
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="font-serif text-xl font-bold text-teal-darker">{category}</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <Card key={s.id} className="p-6">
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="mt-1 text-sm text-muted">{s.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-teal-darker">
                          {formatGHS(s.price_ghs)}
                        </span>
                        <span className="text-xs text-muted">{s.duration_minutes} min</span>
                      </div>
                      <Button href={`/book?service=${s.id}`} size="sm" className="mt-4 w-full">
                        Book This Service
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
