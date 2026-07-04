import { createClient } from "@/lib/supabase/server";
import { Card, Badge, Textarea, Button, Input, Label } from "@/components/ui/primitives";
import { initials, formatDate, formatTime, formatGHS, statusLabel } from "@/lib/utils";
import { updateCustomerNotes, addReminder } from "@/app/admin/(protected)/customers/actions";
import type { AppointmentWithRelations, Customer, Reminder } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!customer) notFound();

  const [{ data: appointments }, { data: reminders }] = await Promise.all([
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
  ]);

  const c = customer as Customer;
  const visits = (appointments as unknown as AppointmentWithRelations[]) ?? [];
  const lifetimeValue = visits
    .filter((v) => v.status === "completed")
    .reduce((sum, v) => sum + (v.price_ghs ?? 0), 0);

  const updateNotesWithId = updateCustomerNotes.bind(null, c.id);
  const addReminderWithId = addReminder.bind(null, c.id);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-lg font-bold text-teal-darker">
            {initials(c.full_name)}
          </span>
          <div>
            <h1 className="font-serif text-2xl font-bold text-ink">{c.full_name}</h1>
            <p className="text-sm text-muted">{c.phone} {c.email ? `· ${c.email}` : ""}</p>
          </div>
        </div>
        {c.is_member ? <Badge tone="gold">Smile Club Member</Badge> : <Badge tone="neutral">Regular Customer</Badge>}
      </div>

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
          <p className="mt-1 font-serif text-xl font-bold text-ink">{formatDate(c.created_at.slice(0, 10))}</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
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
            <form action={updateNotesWithId} className="space-y-3">
              <Textarea name="notes" rows={4} defaultValue={c.notes ?? ""} placeholder="Add notes about this customer's preferences…" />
              <Button type="submit" size="sm">Save Notes</Button>
            </form>
          </Card>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-ink">Reminders</h2>
          <Card className="mt-3 p-5">
            <div className="space-y-3">
              {(reminders as Reminder[] | null)?.map((r) => (
                <div key={r.id} className="rounded-lg border border-teal-darker/10 p-3">
                  <p className="text-xs font-semibold uppercase text-teal-darker">{statusLabel(r.type)}</p>
                  <p className="mt-1 text-sm text-ink">{r.message}</p>
                  <p className="mt-1 text-xs text-muted">Due {formatDate(r.due_date)}</p>
                </div>
              ))}
              {reminders?.length === 0 && <p className="text-sm text-muted">No reminders set.</p>}
            </div>

            <form action={addReminderWithId} className="mt-5 space-y-3 border-t border-teal-darker/10 pt-5">
              <div>
                <Label htmlFor="due_date">Due date</Label>
                <Input id="due_date" name="due_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={2} placeholder="e.g. 6-month cleaning due" required />
              </div>
              <input type="hidden" name="type" value="follow_up" />
              <Button type="submit" size="sm" variant="secondary">Add Reminder</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
