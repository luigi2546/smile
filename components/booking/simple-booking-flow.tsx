"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Phone, UserRound } from "lucide-react";
import { Button, Input, Label } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import type { Branch, Service } from "@/lib/types";

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

function upcomingDays() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: 14 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() + index);
    return {
      key: day.toISOString().slice(0, 10),
      weekday: index === 0 ? "Today" : day.toLocaleDateString("en-GB", { weekday: "short" }),
      date: day.toLocaleDateString("en-GB", { day: "numeric" }),
      month: day.toLocaleDateString("en-GB", { month: "short" }),
    };
  }).filter((day) => new Date(`${day.key}T12:00:00`).getDay() !== 0).slice(0, 7);
}

export function SimpleBookingFlow({ services, branches }: { services: Service[]; branches: Branch[] }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const days = useMemo(upcomingDays, []);
  const selectedService = services.find((service) => service.id === serviceId) ?? services[0];
  const selectedBranch = branches.find((branch) => branch.id === branchId) ?? branches[0];
  const selectedDay = days.find((day) => day.key === date);

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-serif text-3xl font-bold text-ink">You&apos;re all set, {fullName.split(" ")[0]}.</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your booking for {selectedDay?.weekday} {selectedDay?.date} {selectedDay?.month} at {time} has been received. Our team will contact you to confirm it.
        </p>
          <Button type="button" variant="ghost" className="mt-6" onClick={() => setSubmitted(false)}>
          Edit booking
        </Button>
      </div>
    );
  }

  const canContinue = step === 1 ? Boolean(fullName.trim() && phone.trim()) : Boolean(date && time);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center justify-between">
        {[{ number: 1, label: "Your details" }, { number: 2, label: "Choose a time" }, { number: 3, label: "Review" }].map((item) => (
          <div key={item.number} className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= item.number ? "bg-teal-darker text-white" : "bg-slate-100 text-slate-400"}`}>
              {step > item.number ? <Check className="h-4 w-4" /> : item.number}
            </span>
            <span className={`hidden text-xs font-semibold sm:block ${step >= item.number ? "text-ink" : "text-muted"}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">First things first</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Who are we booking for?</h2>
            <p className="mt-2 text-sm text-muted">Just your name and phone number. No account needed.</p>
          </div>
          <div className="space-y-5">
            <div>
              <Label htmlFor="simple-full-name">Full name</Label>
              <div className="relative">
                <UserRound className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
                <Input id="simple-full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Ama Owusu" className="pl-12" autoComplete="name" />
              </div>
            </div>
            <div>
              <Label htmlFor="simple-phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
                <Input id="simple-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="e.g. 024 000 0000" className="pl-12" inputMode="tel" autoComplete="tel" />
              </div>
            </div>
          </div>
          <Button type="button" className="mt-8 w-full" disabled={!canContinue} onClick={() => setStep(2)}>
            Choose day and time <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Your preferred visit</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">When works for you?</h2>
            <p className="mt-2 text-sm text-muted">Pick a day and an available time. Sundays are closed.</p>
          </div>
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink"><CalendarDays className="h-4 w-4 text-teal" /> Select a day</div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((day) => (
                <button key={day.key} type="button" aria-pressed={date === day.key} onClick={() => { setDate(day.key); setTime(""); }} className={`rounded-xl border px-2 py-3 text-center transition ${date === day.key ? "border-teal-darker bg-teal-darker text-white" : "border-slate-200 bg-white text-ink hover:border-teal"}`}>
                  <span className="block text-[11px] font-semibold uppercase opacity-70">{day.weekday}</span>
                  <span className="mt-1 block text-lg font-bold leading-none">{day.date}</span>
                  <span className="mt-1 block text-[11px] opacity-70">{day.month}</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Label htmlFor="simple-date">Choose another date</Label>
              <Input id="simple-date" type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(event) => { setDate(event.target.value); setTime(""); }} />
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink"><Clock className="h-4 w-4 text-teal" /> Select a time</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {timeSlots.map((slot) => <button key={slot} type="button" disabled={!date} onClick={() => setTime(slot)} className={`rounded-xl border py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${time === slot ? "border-teal-darker bg-teal-darker text-white" : "border-slate-200 bg-white text-ink hover:border-teal"}`}>{slot}</button>)}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4" /> Back</Button>
            <Button type="button" className="flex-1" disabled={!canContinue} onClick={() => setStep(3)}>Review booking <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Almost done</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Check your booking</h2>
            <p className="mt-2 text-sm text-muted">Confirm your details and book your appointment.</p>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Patient</p><p className="mt-1 font-semibold text-ink">{fullName}</p><p className="text-sm text-muted">{phone}</p></div>
            <div className="border-t border-slate-200 pt-4"><Label htmlFor="simple-service">Treatment</Label><select id="simple-service" value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="w-full rounded-2xl border border-surface-strong bg-white px-4 py-3 text-sm text-ink"><option value="">Choose a treatment</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name} · {formatGHS(service.price_ghs)}</option>)}</select></div>
            {branches.length > 1 && <div className="border-t border-slate-200 pt-4"><Label htmlFor="simple-branch">Location</Label><select id="simple-branch" value={branchId} onChange={(event) => setBranchId(event.target.value)} className="w-full rounded-2xl border border-surface-strong bg-white px-4 py-3 text-sm text-ink">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Date</p><p className="mt-1 font-semibold text-ink">{selectedDay?.weekday} {selectedDay?.date} {selectedDay?.month}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Time</p><p className="mt-1 font-semibold text-ink">{time}</p></div></div>
          </div>
          {submitError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
          <div className="mt-8 flex gap-3"><Button type="button" variant="ghost" onClick={() => setStep(2)}><ChevronLeft className="h-4 w-4" /> Back</Button><Button type="button" className="flex-1" disabled={submitting} onClick={async () => {
            setSubmitting(true);
            setSubmitError(null);
            try {
              const response = await fetch("/api/booking/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, phone, serviceId, branchId, date, time }) });
              const result = await response.json();
              if (!response.ok) throw new Error(result.error || "We could not create your appointment request.");
              setSubmitted(true);
            } catch (error) {
              setSubmitError(error instanceof Error ? error.message : "We could not create your appointment request.");
            } finally {
              setSubmitting(false);
            }
          }}>{submitting ? "Booking..." : "Book now"} <Check className="h-4 w-4" /></Button></div>
        </div>
      )}
    </div>
  );
}
