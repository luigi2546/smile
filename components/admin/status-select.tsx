"use client";

import { statusLabel } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/types";

export function StatusSelect({
  action,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => void;
  defaultValue: AppointmentStatus;
  options: AppointmentStatus[];
}) {
  return (
    <form action={action}>
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
