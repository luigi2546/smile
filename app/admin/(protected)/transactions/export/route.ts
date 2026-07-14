import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function escapeCsvCell(value: string | number | null | undefined) {
  if (value == null) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function matchesFilter(tx: any, q: string, type: string, startDate: string | null, endDate: string | null) {
  if (type && type !== "all" && tx.type.toLowerCase() !== type.toLowerCase()) {
    return false;
  }

  if (q) {
    const haystack = [tx.customer?.full_name, tx.customer?.phone, tx.description, tx.reference]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q.toLowerCase())) {
      return false;
    }
  }

  const date = tx.date.slice(0, 10);
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;

  return true;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const type = url.searchParams.get("type") ?? "all";
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const supabase = createServiceClient();

  const [{ data: subscriptions, error: subsError }, { data: appointments, error: apptsError }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, customer:customers(id, full_name, phone), plan:subscription_plans(id, name, price_ghs)")
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("*, customer:customers(id, full_name, phone), service:services(id, name, category)")
      .order("created_at", { ascending: false }),
  ]);

  if (subsError || apptsError) {
    return NextResponse.json({ error: subsError?.message || apptsError?.message || "Unable to generate CSV." }, { status: 500 });
  }

  const subscriptionTransactions = (subscriptions ?? []) as any[];
  const appointmentTransactions = (appointments ?? []) as any[];

  const transactions = [
    ...subscriptionTransactions.map((sub) => ({
      type: "Membership",
      customer: sub.customer,
      amount: sub.plan?.price_ghs ?? 0,
      date: sub.created_at,
      status: sub.status,
      reference: sub.payment_ref ?? "",
      description: sub.plan?.name ?? "Membership payment",
    })),
    ...appointmentTransactions.map((appt) => ({
      type: appt.service?.category === "Membership" ? "Membership" : "Appointment",
      customer: appt.customer,
      amount: appt.price_ghs ?? 0,
      date: appt.created_at,
      status: appt.status,
      reference: appt.payment_ref ?? appt.notes?.match(/(?:transaction|payment)\s+(\S+)/i)?.[1] ?? "",
      description: appt.service?.name ?? "Appointment payment",
    })),
  ]
    .filter((tx) => matchesFilter(tx, q, type, startDate, endDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rows = [
    ["Type", "Customer", "Phone", "Description", "Amount", "Date", "Status", "Reference"],
    ...transactions.map((tx) => [
      tx.type,
      tx.customer?.full_name ?? "",
      tx.customer?.phone ?? "",
      tx.description,
      tx.amount,
      tx.date,
      tx.status,
      tx.reference,
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=transactions.csv",
    },
  });
}
