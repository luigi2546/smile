"use client";

import { useState } from "react";
import { sendBulkSms, type BulkSmsState } from "@/app/admin/(protected)/sms/actions";
import { Card, Button, Label, Textarea } from "@/components/ui/primitives";
import type { Customer } from "@/lib/types";

export function SmsForm({ customerList }: { customerList: Customer[] }) {
  const [state, setState] = useState<BulkSmsState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await sendBulkSms({}, formData);
    setState(result);
    setPending(false);
  }

  const recipientPreview = customerList
    .map((customer) => customer.phone)
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6">
        <p className="text-sm font-semibold text-ink">Compose message</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <Textarea id="recipients" name="recipients" rows={6} defaultValue={recipientPreview} placeholder="233241000000" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={6} defaultValue="Hello from Smile Center GH. We look forward to seeing you soon." />
          </div>
          {state?.error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
              {state.success}
            </p>
          )}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Sending…" : "Send SMS"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-semibold text-ink">Customer recipients</p>
        <p className="mt-2 text-sm text-muted">Contacts will be prefilled from your customer records.</p>
        <div className="mt-4 space-y-2">
          {customerList.length > 0 ? (
            customerList.map((customer) => (
              <div key={customer.id} className="rounded-2xl border border-surface-strong bg-white/70 px-3 py-2 text-sm">
                <p className="font-medium text-ink">{customer.full_name ?? "Unnamed customer"}</p>
                <p className="text-muted">{customer.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No customer contacts yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
