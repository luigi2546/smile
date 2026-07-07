"use client";

import { useState } from "react";
import { sendSms, type SmsActionState } from "@/app/admin/(protected)/dashboard/actions";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/primitives";

export function SmsPanel() {
  const [state, setState] = useState<SmsActionState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await sendSms({}, formData);
    setState(result);
    setPending(false);
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Send SMS</p>
          <p className="mt-2 text-sm text-muted">
            Reach customers directly for reminders, confirmations, or announcements.
          </p>
        </div>
        <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Nalo API
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" placeholder="233241000000" required />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Hello from Smile Center GH..."
            defaultValue="Hello from Smile Center GH. We look forward to seeing you soon."
            required
          />
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

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Sending…" : "Send SMS"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
