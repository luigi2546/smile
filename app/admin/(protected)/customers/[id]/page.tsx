import { createServiceClient } from "@/lib/supabase/service";
import { Card, Badge, Textarea, Button, Input, Label } from "@/components/ui/primitives";
import { initials, formatDate, formatTime, formatGHS, statusLabel } from "@/lib/utils";
import { updateCustomerNotes, addReminder, toggleMembership } from "@/app/admin/(protected)/customers/actions";
import type { AppointmentWithRelations, Customer, Reminder } from "@/lib/types";
import { notFound } from "next/navigation";

const REMINDER_TYPES: { value: string; label: string }[] = [
  { value: "follow_up", label: "Follow-up" },
  { value: "recall_cleaning", label: "Recall / Cleaning" },
  { value: "birthday", label: "Birthday" },
  { value: "membership_renewal", label: "Membership Renewal" },
  { value: "custom", label: "Custom" },
];

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!customer) notFound();

  const c = customer as Customer;

  const [{ data: appointments }, { data: reminders }, { data: referrerData }, { data: subscription }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("*, service:services(id, name, price_ghs, duration_minutes), branch:branches(id, name)")
        .eq("customer_id", params.id)
        .order("appointment_date", { ascending: false }),
      supabase
        .from("reminders")
        .select("*")
        .eq("customer_id", params.id)
        .order("due_date", { ascending: true }),
      // Fetch referrer details if this customer was referred
      c.referred_by_customer_id
        ? supabase
            .from("customers")
            .select("id, full_name, phone")
            .eq("id", c.referred_by_customer_id)
            .single()
        : Promise.resolve({ data: null }),
      // Active subscription
      supabase
        .from("subscriptions")
        .select("*, plan:subscription_plans(id, name, price_ghs)")
        .eq("customer_id", params.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const visits = (appointments as unknown as AppointmentWithRelations[]) ?? [];
  const lifetimeValue = visits
    .filter((v) => v.status === "completed")
    .reduce((sum, v) => sum + (v.price_ghs ?? 0), 0);

  const referrer = referrerData as { id: string; full_name: string; phone: string } | null;

  // Count how many customers this person has referred
  const { count: referralCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("referred_by_customer_id", params.id);

  return (
    <div>
      {/* Profile header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-lg font-bold text-teal-darker">
            {initials(c.full_name)}
          </span>
          <div>
            <h1 className="font-serif text-2xl font-bold text-ink">{c.full_name}</h1>
            <p className="text-sm text-muted">
              {c.phone} {c.email ? `· ${c.email}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {c.is_member ? (
            <Badge tone="gold">Smile Club Member</Badge>
          ) : (
            <Badge tone="neutral">Regular Customer</Badge>
          )}
          {/* Membership toggle */}
          <form action={toggleMembership}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="is_member" value={String(c.is_member)} />
            <Button type="submit" size="sm" variant={c.is_member ? "ghost" : "secondary"}>
              {c.is_member ? "Remove from Smile Club" : "Add to Smile Club"}
            </Button>
          </form>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Lifetime Value</p>
          <p className="mt-1 font-serif text-xl font-bold text-ink">{formatGHS(lifetimeValue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Total Visits</p>
          <p className="mt-1 font-serif text-xl font-bold text-ink">{visits.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Customer Since</p>
          <p className="mt-1 font-serif text-xl font-bold text-ink">
            {formatDate(c.created_at.slice(0, 10))}
          </p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: visit history + notes */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-lg font-bold text-ink">Visit History</h2>
          <Card className="mt-3 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Branch</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id} className="border-t border-teal-darker/5">
                    <td className="px-5 py-3.5 text-muted">
                      {formatDate(v.appointment_date)} · {formatTime(v.appointment_time)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-ink">{v.service?.name}</td>
                    <td className="px-5 py-3.5 text-muted">{v.branch?.name}</td>
                    <td className="px-5 py-3.5">
                      <Badge
                        tone={
                          v.status === "completed"
                            ? "success"
                            : v.status === "cancelled" || v.status === "no_show"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {statusLabel(v.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          <h2 className="mt-8 font-serif text-lg font-bold text-ink">Notes &amp; Preferences</h2>
          <Card className="mt-3 p-5">
            <form action={updateCustomerNotes} className="space-y-3">
              <input type="hidden" name="id" value={c.id} />
              <Textarea
                name="notes"
                rows={4}
                defaultValue={c.notes ?? ""}
                placeholder="Add notes about this customer's preferences…"
              />
              <Button type="submit" size="sm">Save Notes</Button>
            </form>
          </Card>
        </div>

        {/* Right: reminders + referral info */}
        <div className="space-y-6">
          {/* Referral section */}
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Referrals</h2>
            <Card className="mt-3 p-5 space-y-3">
              {referrer ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted mb-1">Referred by</p>
                  <p className="text-sm font-semibold text-ink">{referrer.full_name}</p>
                  <p className="text-xs text-muted">{referrer.phone}</p>
                  <a
                    href={`/admin/customers/${referrer.id}`}
                    className="mt-2 inline-block text-xs font-medium text-teal-darker hover:underline"
                  >
                    View profile →
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted">No referrer on record.</p>
              )}
              <div className="border-t border-teal-darker/10 pt-3">
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Customers referred</p>
                <p className="text-2xl font-bold text-ink">{referralCount ?? 0}</p>
              </div>
            </Card>
          </div>

          {/* Subscription section */}
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Subscription</h2>
            <Card className="mt-3 p-5">
              {subscription ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted mb-0.5">Current Plan</p>
                      <p className="font-semibold text-ink">{(subscription as any).plan?.name ?? "—"}</p>
                      <p className="text-xs text-muted font-mono">
                        {formatGHS((subscription as any).plan?.price_ghs ?? 0)}/mo
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-darker/10 px-2.5 py-1 text-xs font-semibold text-teal-darker capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  <div className="border-t border-teal-darker/10 pt-3">
                    <p className="text-xs uppercase tracking-wide text-muted mb-0.5">Renews</p>
                    <p className="text-sm font-semibold text-ink">{subscription.renews_at}</p>
                  </div>
                  {(subscription as any).payment_ref && (
                    <div className="border-t border-teal-darker/10 pt-3">
                      <p className="text-xs uppercase tracking-wide text-muted mb-0.5">Payment Ref</p>
                      <p className="font-mono text-xs text-ink">{(subscription as any).payment_ref}</p>
                    </div>
                  )}
                  <a
                    href="/admin/subscriptions"
                    className="mt-1 inline-block text-xs font-medium text-teal-darker hover:underline"
                  >
                    Manage subscriptions →
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted">No active subscription.</p>
                  <a
                    href="/admin/subscriptions"
                    className="mt-2 inline-block text-xs font-medium text-teal-darker hover:underline"
                  >
                    Assign a plan →
                  </a>
                </div>
              )}
            </Card>
          </div>

          {/* Reminders section */}
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Reminders</h2>
            <Card className="mt-3 p-5">
              <div className="space-y-3">
                {(reminders as Reminder[] | null)?.map((r) => (
                  <div key={r.id} className="rounded-lg border border-teal-darker/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase text-teal-darker">
                        {REMINDER_TYPES.find((t) => t.value === r.type)?.label ?? r.type}
                      </p>
                      {r.is_sent && (
                        <span className="text-xs font-medium text-emerald-600">Sent</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink">{r.message}</p>
                    <p className="mt-1 text-xs text-muted">Due {formatDate(r.due_date)}</p>
                  </div>
                ))}
                {reminders?.length === 0 && (
                  <p className="text-sm text-muted">No reminders set.</p>
                )}
              </div>

              <form action={addReminder} className="mt-5 space-y-3 border-t border-teal-darker/10 pt-5">
                <input type="hidden" name="customer_id" value={c.id} />
                <div>
                  <Label htmlFor="reminder_type">Type</Label>
                  <select
                    id="reminder_type"
                    name="type"
                    required
                    className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm transition focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
                  >
                    {REMINDER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="due_date">Due date</Label>
                  <Input id="due_date" name="due_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="reminder_message">Message</Label>
                  <Textarea
                    id="reminder_message"
                    name="message"
                    rows={2}
                    placeholder="e.g. 6-month cleaning due"
                    required
                  />
                </div>
                <Button type="submit" size="sm" variant="secondary">
                  Add Reminder
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
