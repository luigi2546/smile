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

type BookAppointmentModalProps = {
  customers: CustomerOption[];
  services: ServiceOption[];
  defaultIsNewCustomer?: boolean;
  defaultServiceId?: string;
  triggerLabel?: string;
  title?: string;
};

export function BookAppointmentModal({
  customers,
  services,
  defaultIsNewCustomer = false,
  defaultServiceId = "",
  triggerLabel = "Book Session",
  title = "Book Whitening Session",
}: BookAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(defaultIsNewCustomer);
  const [selectedServiceId, setSelectedServiceId] = useState(defaultServiceId);
  const [totalSessions, setTotalSessions] = useState(1);
  const [amountPaid, setAmountPaid] = useState(() => {
    const treatment = services.find((service) => service.id === defaultServiceId);
    return treatment ? String(treatment.price_ghs) : "0";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updatePackageAmount(serviceId: string, sessions: number) {
    const treatment = services.find((service) => service.id === serviceId);
    setAmountPaid(treatment ? String(Number((treatment.price_ghs * sessions).toFixed(2))) : "0");
  }

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
      setIsNewCustomer(defaultIsNewCustomer);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
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

          {/* Treatment */}
          <div>
              <Label htmlFor="serviceId">Treatment</Label>
              <select
                id="serviceId"
                name="serviceId"
                value={selectedServiceId}
                onChange={(event) => {
                  setSelectedServiceId(event.target.value);
                  updatePackageAmount(event.target.value, totalSessions);
                }}
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

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Session Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Time Slot</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>

          <fieldset className="space-y-3 rounded-2xl border border-surface-strong p-4">
            <legend className="px-1 text-sm font-semibold text-ink">Whitening session details</legend>
            <div>
                <Label htmlFor="totalSessions">Number of Sessions</Label>
                <Input
                  id="totalSessions"
                  name="totalSessions"
                  type="number"
                  min="1"
                  value={totalSessions}
                  onChange={(event) => {
                    const sessions = Math.max(1, Number(event.target.value) || 1);
                    setTotalSessions(sessions);
                    updatePackageAmount(selectedServiceId, sessions);
                  }}
                  required
                />
            </div>
            <input type="hidden" name="sessionNumber" value="1" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="shadeBefore">Shade before</Label>
                <Input id="shadeBefore" name="shadeBefore" placeholder="e.g. A3" />
              </div>
              <div>
                <Label htmlFor="shadeAfter">Shade after</Label>
                <Input id="shadeAfter" name="shadeAfter" placeholder="Complete after treatment" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amountPaid">Total amount (GHS)</Label>
                <Input
                  id="amountPaid"
                  name="amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountPaid}
                  readOnly
                  aria-readonly="true"
                  className="bg-teal-darker/5 font-semibold"
                  required
                />
                <p className="mt-1 text-xs text-muted">Treatment price × number of sessions.</p>
              </div>
              <div>
                <Label htmlFor="followUpDate">Follow-up date</Label>
                <Input id="followUpDate" name="followUpDate" type="date" />
              </div>
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-teal-darker/5 px-3 py-2 text-sm font-medium text-ink">
              <input name="consentConfirmed" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal" />
              Customer treatment consent confirmed
            </label>
          </fieldset>

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
              {loading ? "Booking..." : "Book Session"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
