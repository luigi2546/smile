"use client";

import { Printer } from "lucide-react";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="receipt-print-hidden min-h-11 cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-3 font-semibold text-white shadow-soft transition hover:bg-teal-dark focus-ring"
    >
      <Printer className="h-4 w-4" />
      Print receipt
    </button>
  );
}
