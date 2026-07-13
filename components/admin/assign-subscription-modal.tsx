"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/components/ui/primitives";
import { assignSubscription } from "@/app/admin/(protected)/subscriptions/actions";
import type { Customer, SubscriptionPlan } from "@/lib/types";
import { X, UserCheck } from "lucide-react";

type Props = {
  customers: Pick<Customer, "id" | "full_name" | "phone">[];
  plans: Pick<SubscriptionPlan, "id" | "name" | "price_ghs">[];
  defaultCustomerId?: string;
  onClose: () => void;
};

export function AssignSubscriptionModal({
  customers,
  plans,
  defaultCustomerId,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await assignSubscription(fd);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-teal-darker" />
            <h2 className="font-serif text-lg font-bold text-ink">
              Assign Whitening Package
            </h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="assign-customer">Customer</Label>
            <select
              id="assign-customer"
              name="customer_id"
              required
              defaultValue={defaultCustomerId ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-ink focus:border-teal-darker focus:outline-none focus:ring-1 focus:ring-teal-darker"
            >
              <option value="" disabled>
                Select a customer…
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} — {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="assign-plan">Whitening Package</Label>
            <select
              id="assign-plan"
              name="plan_id"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-ink focus:border-teal-darker focus:outline-none focus:ring-1 focus:ring-teal-darker"
            >
              <option value="" disabled>
                Select a plan…
              </option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — GHS {Number(p.price_ghs).toFixed(2)}/mo
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="assign-start">Start Date</Label>
            <Input
              id="assign-start"
              name="started_at"
              type="date"
              defaultValue={today}
              required
            />
          </div>

          <div>
            <Label htmlFor="assign-ref">
              Payment Reference{" "}
              <span className="text-xs text-muted">(MTN MoMo, cash, etc.)</span>
            </Label>
            <Input
              id="assign-ref"
              name="payment_ref"
              placeholder="e.g. MTN-2024-XK9L"
            />
          </div>

          <div>
            <Label htmlFor="assign-notes">Notes</Label>
            <Input
              id="assign-notes"
              name="notes"
              placeholder="Optional notes"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Assigning…" : "Assign Subscription"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
