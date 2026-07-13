"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/components/ui/primitives";
import { addPlan, editPlan } from "@/app/admin/(protected)/subscriptions/actions";
import type { SubscriptionPlan } from "@/lib/types";
import { X, Plus, Sparkles } from "lucide-react";

type Props = {
  plan?: SubscriptionPlan;
  onClose: () => void;
};

export function SubscriptionPlanModal({ plan, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!plan;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      if (isEdit) {
        fd.set("id", plan.id);
        await editPlan(fd);
      } else {
        await addPlan(fd);
      }
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
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-bold text-ink">
              {isEdit ? "Edit Package" : "New Whitening Package"}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plan-name">Package Name</Label>
            <Input
              id="plan-name"
              name="name"
              required
              defaultValue={plan?.name}
              placeholder="e.g. Basic, Premium"
            />
          </div>

          <div>
            <Label htmlFor="plan-desc">Description</Label>
            <Input
              id="plan-desc"
              name="description"
              defaultValue={plan?.description ?? ""}
              placeholder="Short plan description"
            />
          </div>

          <div>
            <Label htmlFor="plan-price">Package Price (GHS)</Label>
            <Input
              id="plan-price"
              name="price_ghs"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={plan?.price_ghs}
              placeholder="e.g. 120.00"
            />
          </div>

          <div>
            <Label htmlFor="plan-sessions">Whitening Sessions</Label>
            <Input id="plan-sessions" name="session_count" type="number" min="1" required defaultValue={plan?.session_count ?? 1} />
          </div>

          <div>
            <Label htmlFor="plan-features">
              Features{" "}
              <span className="text-xs text-muted">(one per line)</span>
            </Label>
            <textarea
              id="plan-features"
              name="features"
              rows={5}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-teal-darker focus:outline-none focus:ring-1 focus:ring-teal-darker"
              defaultValue={plan?.features?.join("\n") ?? ""}
              placeholder={"1 cleaning per month\nPriority booking\n10% off services"}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Plan"}
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
