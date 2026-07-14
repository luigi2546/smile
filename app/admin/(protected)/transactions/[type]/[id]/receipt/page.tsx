import { PrintReceiptButton } from "@/components/admin/print-receipt-button";
import { createServiceClient } from "@/lib/supabase/service";
import { formatDate, formatGHS } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Receipt = {
  id: string;
  type: "Package" | "Session";
  customerName: string;
  customerPhone: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  status: string;
  branch?: string;
};

export default async function ReceiptPage({ params }: { params: { type: string; id: string } }) {
  const supabase = createServiceClient();
  let receipt: Receipt | null = null;

  if (params.type === "package") {
    const { data } = await supabase
      .from("subscriptions")
      .select("id, created_at, status, amount_paid_ghs, payment_ref, customer:customers(full_name, phone), plan:subscription_plans(name)")
      .eq("id", params.id)
      .maybeSingle();

    if (data) {
      const row = data as any;
      receipt = {
        id: row.id,
        type: "Package",
        customerName: row.customer?.full_name ?? "Unknown customer",
        customerPhone: row.customer?.phone ?? "—",
        description: row.plan?.name ?? "Package payment",
        amount: Number(row.amount_paid_ghs ?? 0),
        date: row.created_at,
        reference: row.payment_ref ?? "—",
        status: row.status,
      };
    }
  } else if (params.type === "session") {
    const { data } = await supabase
      .from("appointments")
      .select("id, created_at, status, amount_paid_ghs, notes, customer:customers(full_name, phone), service:services(name), branch:branches(name)")
      .eq("id", params.id)
      .maybeSingle();

    if (data) {
      const row = data as any;
      receipt = {
        id: row.id,
        type: "Session",
        customerName: row.customer?.full_name ?? "Unknown customer",
        customerPhone: row.customer?.phone ?? "—",
        description: row.service?.name ?? "Session payment",
        amount: Number(row.amount_paid_ghs ?? 0),
        date: row.created_at,
        reference: row.notes?.match(/(?:transaction|payment)\s+(\S+)/i)?.[1] ?? "—",
        status: row.status,
        branch: row.branch?.name,
      };
    }
  }

  if (!receipt) notFound();

  const receiptNumber = `SC-${receipt.type === "Package" ? "PKG" : "SES"}-${receipt.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="receipt-print-hidden mb-5 flex items-center justify-between gap-4">
        <Link href="/admin/transactions" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to transactions
        </Link>
        <PrintReceiptButton />
      </div>

      <article className="receipt-print-page rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-card sm:p-12">
        <header className="flex items-start justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Smile Center GH</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">Payment receipt</h1>
            <p className="mt-2 text-sm text-muted">Thank you for your payment.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Receipt no.</p>
            <p className="mt-1 font-mono text-sm font-bold text-ink">{receiptNumber}</p>
          </div>
        </header>

        <div className="grid gap-6 border-b border-slate-200 py-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Received from</p>
            <p className="mt-2 text-lg font-bold text-ink">{receipt.customerName}</p>
            <p className="text-sm text-muted">{receipt.customerPhone}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Payment date</p>
            <p className="mt-2 font-semibold text-ink">{formatDate(receipt.date)}</p>
            {receipt.branch && <p className="text-sm text-muted">{receipt.branch}</p>}
          </div>
        </div>

        <div className="py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-bold text-ink">{receipt.description}</p>
              <p className="mt-1 text-sm text-muted">{receipt.type} payment</p>
            </div>
            <p className="whitespace-nowrap text-xl font-bold text-ink">{formatGHS(receipt.amount)}</p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t-2 border-ink pt-4">
            <p className="font-bold text-ink">Total paid</p>
            <p className="text-2xl font-bold text-ink">{formatGHS(receipt.amount)}</p>
          </div>
        </div>

        <dl className="grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Payment reference</dt>
            <dd className="break-all text-right font-mono font-semibold text-ink">{receipt.reference}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Status</dt>
            <dd className="font-semibold capitalize text-ink">{receipt.status}</dd>
          </div>
        </dl>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-muted">
          <p>This receipt was generated electronically by Smile Center GH.</p>
        </footer>
      </article>
    </div>
  );
}
