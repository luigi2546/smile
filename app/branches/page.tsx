import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Card, Button } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import type { Branch } from "@/lib/types";
import { MapPin, Phone } from "lucide-react";

export default async function BranchesPage() {
  const supabase = createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Locations</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">
          4 branches across Accra — and growing
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(branches as Branch[] | null)?.map((b) => (
            <Card key={b.id} className="p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-darker/5">
                <MapPin className="h-5 w-5 text-teal-darker" />
              </div>
              <p className="mt-4 font-serif text-lg font-bold text-ink">{b.name}</p>
              <p className="mt-1 text-sm text-muted">{b.address}</p>
              {b.phone && (
                <p className="mt-3 flex items-center gap-2 text-sm text-teal-darker">
                  <Phone className="h-4 w-4" /> {b.phone}
                </p>
              )}
              <Button href={`/book?branch=${b.id}`} size="sm" className="mt-5">
                Book at {b.name}
              </Button>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
