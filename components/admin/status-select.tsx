"use client";

import { statusLabel } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/types";

export function StatusSelect({
  action,
  appointmentId,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => Promise<void> | void;
  appointmentId: string;
  defaultValue: AppointmentStatus;
  options: AppointmentStatus[];
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={appointmentId} />
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-teal-darker/15 bg-white px-2 py-1.5 text-xs font-medium text-ink focus-ring"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s)}
          </option>
        ))}
      </select>
    </form>
  );
}
