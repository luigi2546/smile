"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
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
  const router = useRouter();
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
  const [visitType, setVisitType] = useState<"booking" | "walk_in">("booking");
  const [paymentMode, setPaymentMode] = useState<"record" | "paystack" | "pay_later">("record");
  const [paymentChoice, setPaymentChoice] = useState<"full" | "booking_fee" | "custom">("full");
  const [customAmount, setCustomAmount] = useState("0");

  const paymentAmount = paymentMode === "pay_later"
    ? 0
    : paymentChoice === "booking_fee"
      ? Math.min(30, Number(amountPaid || 0))
      : paymentChoice === "custom"
        ? Number(customAmount || 0)
        : Number(amountPaid || 0);

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
      fd.set("visitType", visitType);
      fd.set("paymentMode", paymentMode);
      fd.set("paymentAmount", String(paymentAmount));
      const result = await bookAppointmentManual(fd);

      if (result.paymentMode === "paystack") {
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!publicKey || !window.PaystackPop) {
          throw new Error("Paystack is not ready. Check the public key and try again from the appointment record.");
        }
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: result.email,
          amount: Math.round(result.paymentAmount * 100),
          currency: "GHS",
          metadata: { appointmentId: result.appointmentId, source: "admin" },
          callback: (transaction: { reference: string }) => {
            setLoading(true);
            fetch("/api/admin/paystack/appointment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                appointmentId: result.appointmentId,
                expectedAmount: result.paymentAmount,
              }),
            })
              .then(async (response) => {
                const body = await response.json();
                if (!response.ok) throw new Error(body.error || "Could not verify payment.");
                setOpen(false);
                router.push(`/admin/transactions/session/${result.appointmentId}/receipt`);
                router.refresh();
              })
              .catch((paymentError) => setError(paymentError.message))
              .finally(() => setLoading(false));
          },
          onClose: () => {
            setLoading(false);
            setError("Payment was not completed. The session was saved as pending and can be paid later.");
          },
        });
        handler.openIframe();
        return;
      }

      setOpen(false);
      setIsNewCustomer(defaultIsNewCustomer);
      router.push(result.paymentMode === "record"
        ? `/admin/transactions/session/${result.appointmentId}/receipt`
        : `/admin/appointments/${result.appointmentId}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerType">Customer type</Label>
              <select
                id="customerType"
                value={isNewCustomer ? "new" : "existing"}
                onChange={(event) => setIsNewCustomer(event.target.value === "new")}
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="existing">Existing customer</option>
                <option value="new">New customer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="visitType">Visit type</Label>
              <select
                id="visitType"
                value={visitType}
                onChange={(event) => setVisitType(event.target.value as "booking" | "walk_in")}
                className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="booking">Scheduled booking</option>
                <option value="walk_in">Walk-in</option>
              </select>
            </div>
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

          <details className="group rounded-2xl border border-surface-strong bg-white">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink focus-ring">
              <span>More session details</span>
              <span className="text-lg text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-3 border-t border-surface-strong p-4">
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
            </div>
          </details>

          <fieldset className="space-y-4 rounded-2xl border border-teal/30 bg-teal/5 p-4">
            <legend className="px-1 text-sm font-semibold text-ink">Payment</legend>
            <div>
              <Label htmlFor="paymentMode">Payment action</Label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(event) => setPaymentMode(event.target.value as "record" | "paystack" | "pay_later")}
                className="w-full rounded-2xl border border-surface-strong bg-white px-4 py-3 text-sm font-semibold text-ink focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
              >
                <option value="record">Accept and record payment</option>
                <option value="paystack">Collect with Paystack</option>
                <option value="pay_later">Save without payment</option>
              </select>
            </div>

            {paymentMode !== "pay_later" && (
              <div>
                <Label htmlFor="paymentChoice">Amount to collect</Label>
                <select
                  id="paymentChoice"
                  value={paymentChoice}
                  onChange={(event) => setPaymentChoice(event.target.value as "full" | "booking_fee" | "custom")}
                  className="w-full rounded-2xl border border-surface-strong bg-white px-4 py-3 text-sm text-ink focus:border-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/15"
                >
                  <option value="full">Full treatment amount</option>
                  <option value="booking_fee">Booking fee — GHS 30</option>
                  <option value="custom">Custom amount</option>
                </select>
              </div>
            )}

            {paymentMode !== "pay_later" && paymentChoice === "custom" && (
              <div>
                <Label htmlFor="customPaymentAmount">Amount to receive (GHS)</Label>
                <Input id="customPaymentAmount" type="number" min="0.01" max={Number(amountPaid || 0)} step="0.01" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} required />
              </div>
            )}

            {paymentMode === "record" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="paymentMethod">Payment method</Label>
                  <select id="paymentMethod" name="paymentMethod" required className="w-full rounded-2xl border border-surface-strong bg-white px-4 py-3 text-sm text-ink">
                    <option value="">Choose method</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile money</option>
                    <option value="card">Card / POS</option>
                    <option value="bank_transfer">Bank transfer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="paymentReference">Reference (optional)</Label>
                  <Input id="paymentReference" name="paymentReference" placeholder="MoMo, POS, or bank reference" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span className="text-sm font-medium text-muted">Amount to receive now</span>
              <span className="font-mono text-lg font-bold text-ink">GHS {paymentAmount.toFixed(2)}</span>
            </div>
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
              {loading ? "Processing..." : paymentMode === "paystack" ? "Save & open Paystack" : paymentMode === "record" ? "Save, record & issue receipt" : "Save session"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
