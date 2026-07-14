import { PrintReceiptButton } from "@/components/admin/print-receipt-button";
import { formatDate, formatGHS } from "@/lib/utils";

type PaymentReceiptProps = {
  receiptNumber: string;
  customerName: string;
  customerPhone?: string | null;
  description: string;
  paymentType: string;
  amount: number;
  date: string;
  reference?: string | null;
  status?: string | null;
  branch?: string | null;
};

export function PaymentReceipt({
  receiptNumber,
  customerName,
  customerPhone,
  description,
  paymentType,
  amount,
  date,
  reference,
  status = "Paid",
  branch,
}: PaymentReceiptProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="receipt-print-hidden mb-5 flex justify-end">
        <PrintReceiptButton />
      </div>

      <article className="receipt-print-page rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-card sm:p-10">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Smile Center GH</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Payment receipt</h2>
            <p className="mt-2 text-sm text-muted">Thank you for your payment.</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Receipt no.</p>
            <p className="mt-1 break-all font-mono text-sm font-bold text-ink">{receiptNumber}</p>
          </div>
        </header>

        <div className="grid gap-6 border-b border-slate-200 py-7 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Received from</p>
            <p className="mt-2 text-lg font-bold text-ink">{customerName}</p>
            {customerPhone && <p className="text-sm text-muted">{customerPhone}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Payment date</p>
            <p className="mt-2 font-semibold text-ink">{formatDate(date)}</p>
            {branch && <p className="text-sm text-muted">{branch}</p>}
          </div>
        </div>

        <div className="py-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-bold text-ink">{description}</p>
              <p className="mt-1 text-sm text-muted">{paymentType}</p>
            </div>
            <p className="whitespace-nowrap font-mono text-xl font-bold text-ink">{formatGHS(amount)}</p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t-2 border-ink pt-4">
            <p className="font-bold text-ink">Total paid</p>
            <p className="font-mono text-2xl font-bold text-ink">{formatGHS(amount)}</p>
          </div>
        </div>

        <dl className="grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Payment reference</dt>
            <dd className="break-all text-right font-mono font-semibold text-ink">{reference || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Status</dt>
            <dd className="font-semibold capitalize text-ink">{status}</dd>
          </div>
        </dl>

        <footer className="mt-9 border-t border-slate-200 pt-6 text-center text-xs text-muted">
          <p>This receipt was generated electronically by Smile Center GH.</p>
        </footer>
      </article>
    </div>
  );
}
