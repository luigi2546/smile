import { createClient } from "@/lib/supabase/server";
import { Card, Badge, Input, Label, Button } from "@/components/ui/primitives";
import { addBranch } from "@/app/admin/(protected)/branches/actions";
import type { Branch } from "@/lib/types";

export default async function BranchesPage() {
  const supabase = createClient();
  const { data: branches } = await supabase.from("branches").select("*").order("name");

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">Operations</p>
      <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Branches</h1>
      <p className="mt-1 text-sm text-muted">{branches?.length ?? 0} branches</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {(branches as Branch[] | null)?.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-ink">{b.name}</p>
                <Badge tone={b.is_active ? "success" : "danger"}>
                  {b.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{b.address}</p>
              {b.phone && <p className="mt-2 text-sm text-teal-darker">{b.phone}</p>}
            </Card>
          ))}
        </div>

        <Card className="p-6 h-fit">
          <p className="font-serif text-lg font-bold text-ink">Add Branch</p>
          <form action={addBranch} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Branch name</Label>
              <Input id="name" name="name" required placeholder="e.g. Spintex" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required placeholder="Street, area, city" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+233 24 000 0000" />
            </div>
            <Button type="submit" className="w-full">Add Branch</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
