import { createClient } from "@/lib/supabase/server";
import { Card, Badge, Input } from "@/components/ui/primitives";
import { initials, formatDate } from "@/lib/utils";
import type { Customer } from "@/lib/types";
import Link from "next/link";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(`full_name.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`);
  }

  const { data: customers } = await query;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">CRM</p>
      <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Customers</h1>
      <p className="mt-1 text-sm text-muted">
        {customers?.length ?? 0} total customers across all branches.
      </p>

      <form className="mt-6 max-w-sm">
        <Input name="q" defaultValue={searchParams.q} placeholder="Search by name or phone…" />
      </form>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Member</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(customers as Customer[] | null)?.map((c) => (
              <tr key={c.id} className="border-t border-teal-darker/5 hover:bg-teal-darker/[0.02]">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-teal-darker">
                      {initials(c.full_name)}
                    </span>
                    <span className="font-medium text-ink hover:underline">{c.full_name}</span>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-muted">{c.phone}</td>
                <td className="px-5 py-3.5">
                  {c.is_member ? <Badge tone="gold">Smile Club</Badge> : <Badge tone="neutral">Regular</Badge>}
                </td>
                <td className="px-5 py-3.5 text-muted">{formatDate(c.created_at.slice(0, 10))}</td>
              </tr>
            ))}
            {customers?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
