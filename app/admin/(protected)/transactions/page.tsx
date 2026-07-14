import { createServiceClient } from "@/lib/supabase/service";
import { Button, Card, Input, Label } from "@/components/ui/primitives";
import { formatGHS, formatDate } from "@/lib/utils";
import { CreditCard, Printer } from "lucide-react";

export default async function TransactionsPage({ searchParams }: { searchParams: { q?: string; type?: string; startDate?: string; endDate?: string } }) {
  const supabase = createServiceClient();

  const [{ data: subscriptions }, { data: appointments }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, customer:customers(id, full_name, phone), plan:subscription_plans(id, name, price_ghs)")
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("*, customer:customers(id, full_name, phone), service:services(id, name, category), branch:branches(id, name)")
      .order("created_at", { ascending: false }),
  ]);

  const subscriptionTransactions = (subscriptions ?? []) as any[];
  const appointmentTransactions = (appointments ?? []) as any[];

  const search = searchParams.q ?? "";
  const typeFilter = searchParams.type ?? "all";
  const startDate = searchParams.startDate ?? "";
  const endDate = searchParams.endDate ?? "";

  const transactions = [
    ...subscriptionTransactions.map((sub) => ({
      id: sub.id,
      type: "Package",
      customer: sub.customer,
      amount: sub.amount_paid_ghs ?? 0,
      date: sub.created_at,
      status: sub.status,
      reference: sub.payment_ref,
      description: sub.plan?.name ?? "Package payment",
    })),
    ...appointmentTransactions.map((appt) => ({
      id: appt.id,
      type: "Session",
      customer: appt.customer,
      amount: appt.amount_paid_ghs ?? 0,
      date: appt.created_at,
      status: appt.status,
      reference: appt.payment_ref ?? appt.notes?.match(/(?:transaction|payment)\s+(\S+)/i)?.[1] ?? "—",
      description: appt.service?.name ?? "Session payment",
    })),
  ]
    .filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (search && ![
        tx.customer?.full_name,
        tx.customer?.phone,
        tx.description,
        tx.reference,
      ].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (startDate && tx.date.slice(0, 10) < startDate) return false;
      if (endDate && tx.date.slice(0, 10) > endDate) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20">
            <CreditCard className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-ink">Transactions</h1>
            <p className="text-sm text-muted">Review package and treatment-session payments actually received.</p>
          </div>
        </div>
        <div className="flex items-start sm:items-end">
          <Button href={`/admin/transactions/export?q=${encodeURIComponent(search)}&type=${encodeURIComponent(typeFilter)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`} variant="secondary" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      <form id="transactions-filter" className="mb-8 grid gap-5" method="get">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div>
            <Label htmlFor="q">Search</Label>
            <Input id="q" name="q" defaultValue={search} placeholder="Customer, reference, description" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue={typeFilter}
              className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink focus:border-teal focus-visible:ring-2 focus-visible:ring-teal/15 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <option value="all">All</option>
              <option value="Package">Package</option>
              <option value="Session">Session</option>
            </select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="startDate">Start</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={startDate} />
            </div>
            <div>
              <Label htmlFor="endDate">End</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={endDate} />
            </div>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="h-12 w-full sm:w-auto" form="transactions-filter">
              Apply
            </Button>
          </div>
        </div>
      </form>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Description</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-teal-darker/5 hover:bg-teal-darker/[0.02]">
                <td className="px-5 py-3.5 font-medium text-ink">{tx.type}</td>
                <td className="px-5 py-3.5 text-muted">{tx.customer?.full_name ?? "Unknown"}</td>
                <td className="px-5 py-3.5 text-ink">{tx.description}</td>
                <td className="px-5 py-3.5 text-ink">{formatGHS(tx.amount)}</td>
                <td className="px-5 py-3.5 text-muted">{formatDate(tx.date.slice(0, 10))}</td>
                <td className="px-5 py-3.5 text-muted capitalize">{tx.status}</td>
                <td className="px-5 py-3.5 text-mono text-xs text-ink">{tx.reference ?? "—"}</td>
                <td className="px-5 py-3.5 text-right">
                  <Button
                    href={`/admin/transactions/${tx.type.toLowerCase()}/${tx.id}/receipt`}
                    variant="ghost"
                    size="sm"
                    aria-label={`Print receipt for ${tx.customer?.full_name ?? "transaction"}`}
                  >
                    <Printer className="h-4 w-4" />
                    Receipt
                  </Button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
