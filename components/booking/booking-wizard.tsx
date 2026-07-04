"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createAppointment, type BookingFormState } from "@/app/book/actions";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import type { Branch, Service } from "@/lib/types";
import { Check, Droplet, Sparkles, Brush, Smile, Stethoscope, BookOpen, Baby, Briefcase } from "lucide-react";

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  Cosmetic: Sparkles,
  Preventive: Brush,
  General: Stethoscope,
  Pediatric: Baby,
  Corporate: Briefcase,
};

const initialState: BookingFormState = {};

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
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(defaultServiceId ?? "");
  const [branchId, setBranchId] = useState(defaultBranchId ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [state, formAction] = useFormState(createAppointment, initialState);

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const selectedBranch = useMemo(() => branches.find((b) => b.id === branchId), [branches, branchId]);

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "Branch & Time" },
    { n: 3, label: "Your Details" },
  ];

  return (
    <div>
      {/* Stepper */}
      <div className="mb-10 flex items-center justify-center gap-3">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                step >= s.n ? "bg-teal-darker text-white" : "bg-teal-darker/10 text-teal-darker/50"
              }`}
            >
              {step > s.n ? <Check className="h-4 w-4" /> : s.n}
            </div>
            <span className={`text-sm font-medium ${step >= s.n ? "text-ink" : "text-muted"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="h-px w-10 bg-teal-darker/15" />}
          </div>
        ))}
      </div>

      {/* STEP 1: Service */}
      {step === 1 && (
        <div>
          <h2 className="text-center font-serif text-2xl font-bold text-ink">Choose a service</h2>
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
                    <p className="mt-0.5 text-sm text-muted">{formatGHS(s.price_ghs)} · {s.duration_minutes} min</p>
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

      {/* STEP 2: Branch & Time */}
      {step === 2 && (
        <div>
          <h2 className="text-center font-serif text-2xl font-bold text-ink">Choose branch, date &amp; time</h2>

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
            <Button disabled={!branchId || !date || !time} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Details */}
      {step === 3 && (
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-serif text-2xl font-bold text-ink">Your details</h2>

          <Card className="mt-6 p-5">
            <p className="text-sm font-semibold text-ink">Booking Summary</p>
            <div className="mt-2 space-y-1 text-sm text-muted">
              <p>{selectedService?.name} · {formatGHS(selectedService?.price_ghs)}</p>
              <p>{selectedBranch?.name}</p>
              <p>{date} at {time}</p>
            </div>
          </Card>

          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="serviceId" value={serviceId} />
            <input type="hidden" name="branchId" value={branchId} />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="time" value={time} />

            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" placeholder="Ama Owusu" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" placeholder="+233 24 000 0000" required />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} placeholder="Anything we should know?" />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{state.error}</p>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <SubmitButton />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Confirming…" : "Confirm Booking"}
    </Button>
  );
}
