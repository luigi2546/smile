"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { addCustomer } from "@/app/admin/(protected)/customers/actions";

type BranchOption = {
  id: string;
  name: string;
};

export function AddCustomerModal({ branches }: { branches: BranchOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    try {
      await addCustomer(fd);
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Customer
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New Customer">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required placeholder="Ama Owusu" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" required placeholder="e.g. 0244123456" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="preferredBranchId">Preferred Branch</Label>
              <select
                id="preferredBranchId"
                name="preferredBranchId"
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm transition focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="">-- Optional --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isMember"
              name="isMember"
              className="h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal"
            />
            <Label htmlFor="isMember" className="mb-0 font-medium">
              Enroll in Smile Club (Membership)
            </Label>
          </div>

          <div>
            <Label htmlFor="notes">Internal Notes & Preferences</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Allergies, family relations, referral details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
