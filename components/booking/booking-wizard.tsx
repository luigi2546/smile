"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import type { Branch, Service } from "@/lib/types";
import {
  Check,
  Sparkles,
  Brush,
  Smile,
  Stethoscope,
  Baby,
  Briefcase,
  Shield,
  CreditCard,
  Smartphone,
  AlertCircle,
  Lock,
} from "lucide-react";

const BOOKING_FEE_GHS = 30;

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  Cosmetic: Sparkles,
  Preventive: Brush,
  General: Stethoscope,
  Pediatric: Baby,
  Corporate: Briefcase,
};

export function BookingWizard({
  services,
  branches,
  defaultServiceId,
  defaultBranchId,
}: {
  services: Service[];
  branches: Branch[];
  defaultServiceId?: string;
  defaultBranchId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [serviceId, setServiceId] = useState(defaultServiceId ?? "");
  // Step 2
  const [branchId, setBranchId] = useState(defaultBranchId ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // Step 3
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  // Step 4
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );
  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === branchId),
    [branches, branchId]
  );

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "Branch & Time" },
    { n: 3, label: "Your Details" },
    { n: 4, label: "Payment" },
  ];

  function handlePayment() {
    // Guard: Paystack script may not have loaded yet
    // @ts-ignore
    if (typeof window === "undefined" || !window.PaystackPop) {
      setPayError("Payment provider is still loading. Please wait a moment and try again.");
      return;
    }

    setPaying(true);
    setPayError(null);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string;
    // Use email if provided, otherwise build a placeholder so Paystack is happy
    const paystackEmail =
      email.trim() ||
      `${phone.replace(/\D/g, "")}@booking.smilecentergh.com`;

    try {
      // @ts-ignore — PaystackPop loaded via <Script>
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: paystackEmail,
        amount: BOOKING_FEE_GHS * 100, // pesewas
        currency: "GHS",
        ref: `scgh-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: "Smile Center GH — Booking Fee",
        metadata: {
          custom_fields: [
            {
              display_name: "Patient Name",
              variable_name: "patient_name",
              value: fullName,
            },
            {
              display_name: "Service",
              variable_name: "service",
              value: selectedService?.name ?? "",
            },
            {
              display_name: "Branch",
              variable_name: "branch",
              value: selectedBranch?.name ?? "",
            },
            {
              display_name: "Appointment",
              variable_name: "appt_date",
              value: `${date} at ${time}`,
            },
          ],
        },
        onSuccess: async (transaction: { reference: string }) => {
          try {
            const res = await fetch("/api/booking/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                serviceId,
                branchId,
                date,
                time,
                fullName,
                phone,
                email,
                notes,
              }),
            });

            const data = await res.json();

            if (!res.ok || !data.appointmentId) {
              setPayError(
                data.error ??
                  `Booking could not be saved. Please contact us quoting reference: ${transaction.reference}`
              );
              setPaying(false);
              return;
            }

            router.push(
              `/book/success?ref=${data.appointmentId.slice(0, 8)}&pref=${transaction.reference}`
            );
          } catch {
            setPayError(
              `Something went wrong saving your booking. Please contact us with your Paystack reference: ${transaction.reference}`
            );
            setPaying(false);
          }
        },
        onCancel: () => {
          setPaying(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setPayError(err?.message ?? "Failed to initialize payment. Please check your setup.");
      setPaying(false);
    }
  }

  return (
    <div>
      {/* Paystack inline SDK */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* ── Stepper ───────────────────────────────────── */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                step >= s.n
                  ? "bg-teal-darker text-white"
                  : "bg-teal-darker/10 text-teal-darker/50"
              }`}
            >
              {step > s.n ? <Check className="h-4 w-4" /> : s.n}
            </div>
            <span
              className={`text-sm font-medium ${
                step >= s.n ? "text-ink" : "text-muted"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="h-px w-8 bg-teal-darker/15" />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Choose service ─────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="text-center font-serif text-2xl font-bold text-ink">
            Choose a service
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((s) => {
              const Icon = iconFor[s.category] ?? Smile;
              const active = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`flex items-start gap-4 rounded-xl border p-5 text-left transition-colors ${
                    active
                      ? "border-teal-darker bg-teal-darker/5"
                      : "border-teal-darker/10 bg-white hover:border-teal-darker/30"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-darker/10">
                    <Icon className="h-5 w-5 text-teal-darker" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{s.name}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {formatGHS(s.price_ghs)} · {s.duration_minutes} min
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <Button disabled={!serviceId} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Branch, date & time ───────────────── */}
      {step === 2 && (
        <div>
          <h2 className="text-center font-serif text-2xl font-bold text-ink">
            Choose branch, date &amp; time
          </h2>

          <div className="mx-auto mt-8 max-w-xl space-y-6">
            <div>
              <Label>Branch</Label>
              <div className="grid grid-cols-2 gap-3">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBranchId(b.id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      branchId === b.id
                        ? "border-teal-darker bg-teal-darker/5 font-medium text-ink"
                        : "border-teal-darker/10 text-muted hover:border-teal-darker/30"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Time</Label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`rounded-lg border py-2 text-sm transition-colors ${
                      time === t
                        ? "border-teal-darker bg-teal-darker text-white"
                        : "border-teal-darker/10 text-muted hover:border-teal-darker/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              disabled={!branchId || !date || !time}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Your details ──────────────────────── */}
      {step === 3 && (
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-serif text-2xl font-bold text-ink">
            Your details
          </h2>

          <Card className="mt-6 p-5">
            <p className="text-sm font-semibold text-ink">Booking Summary</p>
            <div className="mt-2 space-y-1 text-sm text-muted">
              <p>
                {selectedService?.name} · {formatGHS(selectedService?.price_ghs)}
              </p>
              <p>{selectedBranch?.name}</p>
              <p>
                {date} at {time}
              </p>
            </div>
          </Card>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ama Owusu"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Anything we should know?"
              />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="button"
                disabled={!fullName.trim() || !phone.trim()}
                onClick={() => setStep(4)}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Payment ───────────────────────────── */}
      {step === 4 && (
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-serif text-2xl font-bold text-ink">
            Secure your slot
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            A small non-refundable booking fee confirms your appointment.
          </p>

          {/* Summary card */}
          <Card className="mt-6 divide-y divide-dashed divide-slate-200 overflow-hidden p-0">
            <div className="space-y-2 p-5">
              <p className="text-sm font-semibold text-ink">Booking Summary</p>
              {[
                { label: "Service", value: selectedService?.name },
                { label: "Branch", value: selectedBranch?.name },
                { label: "Date & Time", value: `${date} at ${time}` },
                { label: "Patient", value: fullName },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-ink">{value}</span>
                </div>
              ))}
            </div>

            {/* Fee row */}
            <div className="flex items-center justify-between bg-teal-darker/5 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Booking fee{" "}
                  <span className="font-normal text-muted">(non-refundable)</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Service fee of {formatGHS(selectedService?.price_ghs)} paid at
                  clinic
                </p>
              </div>
              <p className="text-xl font-bold text-teal-darker">GHS 30.00</p>
            </div>
          </Card>

          {/* Accepted payment methods */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-yellow-500" />
              MTN MoMo
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-red-500" />
              Vodafone Cash
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-blue-600" />
              AirtelTigo Money
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" />
              Visa / Mastercard
            </div>
          </div>

          {/* Error */}
          {payError && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{payError}</span>
            </div>
          )}

          {/* Pay button */}
          <div className="mt-6 space-y-3">
            <Button
              type="button"
              className="w-full"
              disabled={paying}
              onClick={handlePayment}
            >
              <Lock className="mr-2 h-4 w-4" />
              {paying ? "Opening payment…" : "Pay GHS 30 & Confirm Booking"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <Shield className="h-3.5 w-3.5" />
              Secured by Paystack · 256-bit encryption
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="text-sm text-muted transition hover:text-ink"
                onClick={() => {
                  setPaying(false);
                  setPayError(null);
                  setStep(3);
                }}
              >
                ← Back to details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
