"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { bookAppointmentManual } from "@/app/admin/(protected)/appointments/actions";

type CustomerOption = {
  id: string;
  full_name: string;
  phone: string;
};

type ServiceOption = {
  id: string;
  name: string;
  price_ghs: number;
};

type BranchOption = {
  id: string;
  name: string;
};

type BookAppointmentModalProps = {
  customers: CustomerOption[];
  services: ServiceOption[];
  branches: BranchOption[];
};

export function BookAppointmentModal({
  customers,
  services,
  branches,
}: BookAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    fd.set("isNewCustomer", String(isNewCustomer));

    try {
      await bookAppointmentManual(fd);
      setOpen(false);
      // Reset state
      setIsNewCustomer(false);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Book Appointment
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Book Appointment (Manual)">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          {/* Customer Selection Mode */}
          <div className="flex gap-4 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setIsNewCustomer(false)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-semibold border transition-all ${
                !isNewCustomer
                  ? "bg-teal/5 border-teal text-teal-darker"
                  : "bg-white border-slate-200 text-ink/70 hover:bg-slate-50"
              }`}
            >
              Existing Patient
            </button>
            <button
              type="button"
              onClick={() => setIsNewCustomer(true)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-semibold border transition-all ${
                isNewCustomer
                  ? "bg-teal/5 border-teal text-teal-darker"
                  : "bg-white border-slate-200 text-ink/70 hover:bg-slate-50"
              }`}
            >
              New Patient
            </button>
          </div>

          {/* Patient Details */}
          {!isNewCustomer ? (
            <div>
              <Label htmlFor="customerId">Select Patient</Label>
              <select
                id="customerId"
                name="customerId"
                required={!isNewCustomer}
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm transition focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="">-- Choose a patient --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Patient Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required={isNewCustomer}
                  placeholder="e.g. Kofi Mensah"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required={isNewCustomer}
                    placeholder="e.g. 0244123456"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. patient@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service & Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="serviceId">Service</Label>
              <select
                id="serviceId"
                name="serviceId"
                required
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm transition focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="">-- Choose --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (GHS {s.price_ghs})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="branchId">Branch</Label>
              <select
                id="branchId"
                name="branchId"
                required
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm transition focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="">-- Choose --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Appointment Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Time Slot</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes & Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Add patient requests, details of dental history..."
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
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
