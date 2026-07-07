"use client";

import { useState } from "react";
import {
  Bell,
  Globe,
  Palette,
  Building2,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type Branch = { id: string; name: string; is_active: boolean };

type Props = {
  isAdmin: boolean;
  staffRole: string;
  branches: Branch[];
};

type NotifSettings = {
  newBooking: boolean;
  appointmentReminders: boolean;
  cancellations: boolean;
  bulkSmsReports: boolean;
  dailySummary: boolean;
};

type ClinicSettings = {
  clinicName: string;
  contactEmail: string;
  contactPhone: string;
  openTime: string;
  closeTime: string;
  workingDays: string[];
  timezone: string;
  currency: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMEZONES = [
  "Africa/Accra",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Europe/London",
  "America/New_York",
];
const CURRENCIES = ["GHS", "USD", "GBP", "EUR"];

function SectionHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-surface-strong bg-surface px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        disabled={disabled}
        className="shrink-0 transition"
      >
        {checked ? (
          <ToggleRight className={`h-7 w-7 ${disabled ? "text-muted" : "text-teal-darker"}`} />
        ) : (
          <ToggleLeft className={`h-7 w-7 ${disabled ? "text-slate-300" : "text-muted"}`} />
        )}
      </button>
    </div>
  );
}

function SaveButton({
  loading,
  onClick,
  label = "Save",
}: {
  loading: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <div className="flex justify-end pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-2xl bg-teal-darker px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-deeper disabled:opacity-60"
      >
        {loading ? `${label}ing…` : label}
      </button>
    </div>
  );
}

function Toast({
  msg,
}: {
  msg: { type: "success" | "error"; text: string } | null;
}) {
  if (!msg) return null;
  return (
    <div
      className={[
        "flex items-start gap-2.5 rounded-2xl p-4 text-sm",
        msg.type === "success"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700",
      ].join(" ")}
    >
      {msg.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      )}
      {msg.text}
    </div>
  );
}

export function SettingsClient({ isAdmin, staffRole, branches }: Props) {
  /* ── Notification prefs ─────────────────── */
  const [notif, setNotif] = useState<NotifSettings>({
    newBooking: true,
    appointmentReminders: true,
    cancellations: true,
    bulkSmsReports: false,
    dailySummary: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMsg, setNotifMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Clinic settings ───────────────────── */
  const [clinic, setClinic] = useState<ClinicSettings>({
    clinicName: "Smile Center GH",
    contactEmail: "smilecentergh@hotmail.com",
    contactPhone: "+233 24 000 0000",
    openTime: "08:00",
    closeTime: "18:00",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timezone: "Africa/Accra",
    currency: "GHS",
  });
  const [clinicLoading, setClinicLoading] = useState(false);
  const [clinicMsg, setClinicMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Appearance ────────────────────────── */
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [compactMode, setCompactMode] = useState(false);

  /* ── Security ──────────────────────────── */
  const [sessionTimeout, setSessionTimeout] = useState("8");
  const [twoFactor, setTwoFactor] = useState(false);
  const [secMsg, setSecMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [secLoading, setSecLoading] = useState(false);

  function toggleDay(day: string) {
    setClinic((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  }

  async function saveNotifications() {
    setNotifLoading(true);
    setNotifMsg(null);
    await new Promise((r) => setTimeout(r, 700));
    setNotifMsg({ type: "success", text: "Notification preferences saved." });
    setNotifLoading(false);
  }

  async function saveClinic() {
    if (!isAdmin) return;
    setClinicLoading(true);
    setClinicMsg(null);
    await new Promise((r) => setTimeout(r, 800));
    setClinicMsg({ type: "success", text: "Clinic settings saved successfully." });
    setClinicLoading(false);
  }

  async function saveSecurity() {
    setSecLoading(true);
    setSecMsg(null);
    await new Promise((r) => setTimeout(r, 600));
    setSecMsg({ type: "success", text: "Security preferences updated." });
    setSecLoading(false);
  }

  return (
    <>
      {/* ── Notifications ──────────────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <SectionHeader
          icon={Bell}
          iconBg="bg-teal/10"
          iconColor="text-teal-darker"
          title="Notifications"
          subtitle="Choose which events trigger alerts in your account"
        />
        <div className="space-y-3">
          <Toggle
            id="notif_booking"
            label="New booking requests"
            description="Get notified whenever a patient submits a new appointment."
            checked={notif.newBooking}
            onChange={(v) => setNotif((p) => ({ ...p, newBooking: v }))}
          />
          <Toggle
            id="notif_reminders"
            label="Appointment reminders"
            description="Receive reminders before upcoming appointments."
            checked={notif.appointmentReminders}
            onChange={(v) => setNotif((p) => ({ ...p, appointmentReminders: v }))}
          />
          <Toggle
            id="notif_cancel"
            label="Cancellations & no-shows"
            checked={notif.cancellations}
            onChange={(v) => setNotif((p) => ({ ...p, cancellations: v }))}
          />
          <Toggle
            id="notif_sms"
            label="Bulk SMS delivery reports"
            description="Summary after each bulk SMS campaign is delivered."
            checked={notif.bulkSmsReports}
            onChange={(v) => setNotif((p) => ({ ...p, bulkSmsReports: v }))}
          />
          <Toggle
            id="notif_daily"
            label="Daily summary email"
            description="End-of-day recap of appointments, revenue and messages."
            checked={notif.dailySummary}
            onChange={(v) => setNotif((p) => ({ ...p, dailySummary: v }))}
          />
        </div>
        <div className="mt-5">
          <Toast msg={notifMsg} />
          <SaveButton loading={notifLoading} onClick={saveNotifications} label="Save Preferences" />
        </div>
      </section>

      {/* ── Clinic Configuration ───────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <SectionHeader
          icon={Building2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          title="Clinic Configuration"
          subtitle={isAdmin ? "Edit your clinic details and operating hours" : "Read-only — admin access required to edit"}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Clinic Name
            </label>
            <input
              value={clinic.clinicName}
              onChange={(e) =>
                isAdmin && setClinic((p) => ({ ...p, clinicName: e.target.value }))
              }
              disabled={!isAdmin}
              className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Contact Email
            </label>
            <input
              value={clinic.contactEmail}
              onChange={(e) =>
                isAdmin && setClinic((p) => ({ ...p, contactEmail: e.target.value }))
              }
              disabled={!isAdmin}
              className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Contact Phone
            </label>
            <input
              value={clinic.contactPhone}
              onChange={(e) =>
                isAdmin && setClinic((p) => ({ ...p, contactPhone: e.target.value }))
              }
              disabled={!isAdmin}
              className="w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Currency
            </label>
            <div className="relative">
              <select
                value={clinic.currency}
                onChange={(e) =>
                  isAdmin && setClinic((p) => ({ ...p, currency: e.target.value }))
                }
                disabled={!isAdmin}
                className="w-full appearance-none rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-teal"
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>

        {/* Working hours */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Opening Time
            </label>
            <div className="relative flex items-center gap-2 rounded-2xl border border-surface-strong bg-surface px-4 py-3">
              <Clock className="h-4 w-4 text-muted shrink-0" />
              <input
                type="time"
                value={clinic.openTime}
                onChange={(e) =>
                  isAdmin && setClinic((p) => ({ ...p, openTime: e.target.value }))
                }
                disabled={!isAdmin}
                className="flex-1 bg-transparent text-sm text-ink focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Closing Time
            </label>
            <div className="relative flex items-center gap-2 rounded-2xl border border-surface-strong bg-surface px-4 py-3">
              <Clock className="h-4 w-4 text-muted shrink-0" />
              <input
                type="time"
                value={clinic.closeTime}
                onChange={(e) =>
                  isAdmin && setClinic((p) => ({ ...p, closeTime: e.target.value }))
                }
                disabled={!isAdmin}
                className="flex-1 bg-transparent text-sm text-ink focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Working days */}
        <div className="mt-5">
          <label className="mb-2.5 block text-xs font-semibold text-ink">
            Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = clinic.workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => isAdmin && toggleDay(day)}
                  disabled={!isAdmin}
                  className={[
                    "rounded-2xl border px-3.5 py-2 text-xs font-semibold transition",
                    active
                      ? "border-teal-darker bg-teal-darker text-white"
                      : "border-surface-strong bg-surface text-muted hover:border-teal/40",
                    !isAdmin && "opacity-60 cursor-not-allowed",
                  ].join(" ")}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timezone */}
        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-semibold text-ink">
            Timezone
          </label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <select
              value={clinic.timezone}
              onChange={(e) =>
                isAdmin && setClinic((p) => ({ ...p, timezone: e.target.value }))
              }
              disabled={!isAdmin}
              className="w-full appearance-none rounded-2xl border border-surface-strong bg-surface py-3 pl-10 pr-4 text-sm text-ink shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-teal"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        {isAdmin && (
          <div className="mt-5">
            <Toast msg={clinicMsg} />
            <SaveButton loading={clinicLoading} onClick={saveClinic} label="Save Clinic Settings" />
          </div>
        )}
      </section>

      {/* ── Appearance ─────────────────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <SectionHeader
          icon={Palette}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          title="Appearance"
          subtitle="Personalise how the dashboard looks"
        />

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-ink">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["system", "light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition",
                    theme === t
                      ? "border-teal-darker bg-teal-darker text-white"
                      : "border-surface-strong bg-surface text-muted hover:border-teal/40",
                  ].join(" ")}
                >
                  {t === "system" ? "🖥 System" : t === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            id="compact_mode"
            label="Compact mode"
            description="Use a denser layout to show more information on screen."
            checked={compactMode}
            onChange={setCompactMode}
          />
        </div>
      </section>

      {/* ── Security ───────────────────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <SectionHeader
          icon={Shield}
          iconBg="bg-red-50"
          iconColor="text-red-600"
          title="Security"
          subtitle="Session and authentication preferences"
        />

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Session Timeout
            </label>
            <div className="relative">
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:border-teal"
              >
                <option value="1">1 hour</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours (default)</option>
                <option value="24">24 hours</option>
                <option value="0">Never (not recommended)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              You will be automatically signed out after this period of inactivity.
            </p>
          </div>

          <Toggle
            id="two_factor"
            label="Two-factor authentication"
            description="Require a verification code on every sign-in (coming soon)."
            checked={twoFactor}
            onChange={setTwoFactor}
            disabled
          />
        </div>

        <div className="mt-5">
          <Toast msg={secMsg} />
          <SaveButton loading={secLoading} onClick={saveSecurity} label="Save Security" />
        </div>
      </section>

      {/* ── Branches quick view (read-only) ────────────────── */}
      {branches.length > 0 && (
        <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
          <SectionHeader
            icon={Building2}
            iconBg="bg-teal/10"
            iconColor="text-teal-darker"
            title="Branch Overview"
            subtitle="Status of all registered branches"
          />
          <div className="divide-y divide-surface-strong">
            {branches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-3.5"
              >
                <p className="text-sm font-medium text-ink">{b.name}</p>
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    b.is_active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600",
                  ].join(" ")}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {b.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
          {isAdmin && (
            <p className="mt-4 text-xs text-muted">
              Manage branches and their details on the{" "}
              <a href="/admin/branches" className="text-teal-darker underline">
                Branches page
              </a>
              .
            </p>
          )}
        </section>
      )}
    </>
  );
}
