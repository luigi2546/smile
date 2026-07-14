import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { Badge, Button, Card, Input, Label, Textarea } from "@/components/ui/primitives";
import { formatDate, formatGHS, formatTime } from "@/lib/utils";
import { updateWhiteningSession, uploadWhiteningPhotos } from "../actions";
import type { AppointmentStatus } from "@/lib/types";

const statuses: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export default async function WhiteningSessionPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const { data: session } = await supabase
    .from("appointments")
    .select("*, customer:customers(id, full_name, phone, email), service:services(id, name, price_ghs)")
    .eq("id", params.id)
    .maybeSingle();

  if (!session) notFound();

  const [{ data: beforePhoto }, { data: afterPhoto }] = await Promise.all([
    session.before_photo_path
      ? supabase.storage.from("treatment-photos").createSignedUrl(session.before_photo_path, 3600)
      : Promise.resolve({ data: null }),
    session.after_photo_path
      ? supabase.storage.from("treatment-photos").createSignedUrl(session.after_photo_path, 3600)
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div>
      <Link href="/admin/appointments" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-darker hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to appointments
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Appointment</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">{session.customer?.full_name}</h1>
          <p className="mt-1 text-sm text-muted">
            {session.service?.name} · {formatDate(session.appointment_date)} at {formatTime(session.appointment_time)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {Number(session.amount_paid_ghs ?? 0) > 0 && (
            <Button href={`/admin/transactions/session/${session.id}/receipt`} variant="secondary" size="sm">
              <Printer className="h-4 w-4" /> Print receipt
            </Button>
          )}
          <Badge tone={session.status === "completed" ? "success" : session.status === "cancelled" ? "danger" : "gold"}>
            {String(session.status).replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Card className="p-5"><p className="text-sm text-muted">Amount paid</p><p className="mt-2 text-2xl font-semibold tabular-nums text-ink">{formatGHS(session.amount_paid_ghs)}</p></Card>
        <Card className="p-5"><p className="text-sm text-muted">Sessions</p><p className="mt-2 text-2xl font-semibold tabular-nums text-ink">{session.total_sessions ?? 1}</p></Card>
      </div>

      <Card className="mt-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Treatment record</h2>
          <p className="mt-1 text-sm text-muted">Update clinical progress and treatment details after the session.</p>
        </div>

        <form action={updateWhiteningSession} className="mt-6 space-y-5">
          <input type="hidden" name="id" value={session.id} />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="status">Session status</Label>
              <select id="status" name="status" defaultValue={session.status} className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15">
                {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
              </select>
            </div>
            <input type="hidden" name="sessionNumber" value="1" />
            <div><Label htmlFor="totalSessions">Number of sessions</Label><Input id="totalSessions" name="totalSessions" type="number" min="1" defaultValue={session.total_sessions ?? 1} required /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label htmlFor="shadeBefore">Shade before</Label><Input id="shadeBefore" name="shadeBefore" defaultValue={session.shade_before ?? ""} placeholder="e.g. A3" /></div>
            <div><Label htmlFor="shadeAfter">Shade after</Label><Input id="shadeAfter" name="shadeAfter" defaultValue={session.shade_after ?? ""} placeholder="e.g. A1" /></div>
            <div><Label>Total treatment amount</Label><div className="rounded-2xl border border-surface-strong bg-teal-darker/5 px-4 py-3 text-sm font-semibold text-ink">{formatGHS(session.price_ghs)}</div></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="followUpDate">Next follow-up</Label><Input id="followUpDate" name="followUpDate" type="date" defaultValue={session.follow_up_date ?? ""} /></div>
            <div>
              <Label>Customer contact</Label>
              <div className="rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink">
                {session.customer?.phone}{session.customer?.email ? ` · ${session.customer.email}` : ""}
              </div>
            </div>
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm font-medium text-ink">
            <input name="consentConfirmed" type="checkbox" defaultChecked={session.consent_confirmed} className="h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal" />
            Treatment consent confirmed
          </label>

          <div><Label htmlFor="notes">Treatment notes and aftercare</Label><Textarea id="notes" name="notes" defaultValue={session.notes ?? ""} placeholder="Products used, sensitivity, observations, and aftercare instructions..." /></div>

          <div className="flex justify-end"><Button type="submit">Save session record</Button></div>
        </form>
      </Card>

      <Card className="mt-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Before &amp; after photos</h2>
          <p className="mt-1 text-sm text-muted">Private treatment images are available to signed-in staff only. Consent must be confirmed first.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <PhotoPanel label="Before treatment" url={beforePhoto?.signedUrl} />
          <PhotoPanel label="After treatment" url={afterPhoto?.signedUrl} />
        </div>

        <form action={uploadWhiteningPhotos} className="mt-6 space-y-4" encType="multipart/form-data">
          <input type="hidden" name="id" value={session.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="beforePhoto">Before photo</Label>
              <Input id="beforePhoto" name="beforePhoto" type="file" accept="image/jpeg,image/png,image/webp" />
            </div>
            <div>
              <Label htmlFor="afterPhoto">After photo</Label>
              <Input id="afterPhoto" name="afterPhoto" type="file" accept="image/jpeg,image/png,image/webp" />
            </div>
          </div>
          <p className="text-xs text-muted">JPEG, PNG, or WebP. Maximum 5 MB per photo.</p>
          <div className="flex justify-end"><Button type="submit" disabled={!session.consent_confirmed}>Upload treatment photos</Button></div>
        </form>
      </Card>
    </div>
  );
}

function PhotoPanel({ label, url }: { label: string; url?: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-surface-strong bg-surface">
      <div className="aspect-[4/3] bg-teal-darker/5">
        {url ? (
          <img src={url} alt={`${label} for this whitening session`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">No {label.toLowerCase()} uploaded</div>
        )}
      </div>
      <figcaption className="border-t border-surface-strong px-4 py-3 text-sm font-semibold text-ink">{label}</figcaption>
    </figure>
  );
}
