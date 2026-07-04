import { createClient } from "@/lib/supabase/server";
import { Card, Badge, Input, Label, Button } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import { addService } from "@/app/admin/(protected)/services/actions";
import type { Service } from "@/lib/types";

export default async function ServicesAdminPage() {
  const supabase = createClient();
  const { data: services } = await supabase.from("services").select("*").order("category");

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">Operations</p>
      <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Services</h1>
      <p className="mt-1 text-sm text-muted">{services?.length ?? 0} services offered</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {(services as Service[] | null)?.map((s) => (
                  <tr key={s.id} className="border-t border-teal-darker/5">
                    <td className="px-5 py-3.5 font-medium text-ink">{s.name}</td>
                    <td className="px-5 py-3.5 text-muted">{s.category}</td>
                    <td className="px-5 py-3.5 text-muted">{formatGHS(s.price_ghs)}</td>
                    <td className="px-5 py-3.5 text-muted">{s.duration_minutes} min</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={s.is_active ? "success" : "danger"}>
                        {s.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card className="p-6 h-fit">
          <p className="font-serif text-lg font-bold text-ink">Add Service</p>
          <form action={addService} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Service name</Label>
              <Input id="name" name="name" required placeholder="e.g. Invisalign Consultation" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required placeholder="Cosmetic, Preventive, General…" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Short description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price_ghs">Price (GHS)</Label>
                <Input id="price_ghs" name="price_ghs" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="duration_minutes">Duration (min)</Label>
                <Input id="duration_minutes" name="duration_minutes" type="number" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Add Service</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
