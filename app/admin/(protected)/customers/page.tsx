import { createServiceClient } from "@/lib/supabase/service";
import { getStaffProfile } from "@/lib/supabase/staff-profile";
import { Card, Badge, Input } from "@/components/ui/primitives";
import { initials, formatDate } from "@/lib/utils";
import { AddCustomerModal } from "@/components/admin/add-customer-modal";
import type { Customer } from "@/lib/types";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createServiceClient();
  const staff = await getStaffProfile();

  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(`full_name.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`);
  }

  // Branch managers only see customers from their branch
  if (staff?.role === "branch_manager" && staff.branch_id) {
    query = query.eq("preferred_branch_id", staff.branch_id);
  }

  const [{ data: customers }, { data: branches }] = await Promise.all([
    query,
    supabase.from("branches").select("id, name").eq("is_active", true).order("name"),
  ]);

  const customerList = (customers as Customer[] | null) ?? [];
  const branchList = (branches as any[]) ?? [];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">CRM</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Customers</h1>
          <p className="mt-1 text-sm text-muted">
            {customerList.length} total customers
            {staff?.role === "branch_manager" ? " at your branch" : " across all branches"}.
          </p>
        </div>
        <AddCustomerModal branches={branchList} />
      </div>

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
              <th className="px-5 py-3 font-semibold">Referred</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((c) => (
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
                  {c.is_member ? (
                    <Badge tone="gold">Smile Club</Badge>
                  ) : (
                    <Badge tone="neutral">Regular</Badge>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {c.referred_by_customer_id ? (
                    <span
                      title="This customer was referred by another customer"
                      className="inline-flex items-center gap-1 rounded-full bg-teal-darker/5 px-2.5 py-1 text-xs font-medium text-teal-darker"
                    >
                      <UserPlus className="h-3 w-3" />
                      Referred
                    </span>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-muted">
                  {formatDate(c.created_at.slice(0, 10))}
                </td>
              </tr>
            ))}
            {customerList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
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
