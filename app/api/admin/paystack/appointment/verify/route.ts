import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const auth = createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Staff sign-in required." }, { status: 401 });

  const { reference, appointmentId, expectedAmount } = await request.json();
  if (!reference || !appointmentId || !Number.isFinite(Number(expectedAmount))) {
    return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
  }
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured." }, { status: 500 });
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.status || result.data?.status !== "success") {
    return NextResponse.json({ error: result.message || "Paystack payment was not successful." }, { status: 400 });
  }

  const paid = Number(result.data.amount) / 100;
  if (Math.abs(paid - Number(expectedAmount)) > 0.001) {
    return NextResponse.json({ error: "The paid amount does not match the requested amount." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, price_ghs, amount_paid_ghs, notes")
    .eq("id", appointmentId)
    .maybeSingle();
  if (!appointment) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  if (paid <= 0 || paid > Number(appointment.price_ghs ?? 0)) {
    return NextResponse.json({ error: "Invalid payment amount for this appointment." }, { status: 400 });
  }

  const { error } = await supabase.from("appointments").update({
    amount_paid_ghs: paid,
    status: "confirmed",
    notes: [`Payment ${result.data.reference} via Paystack`, appointment.notes]
      .filter(Boolean)
      .join(". ")
      .replace(/\. Paystack payment pending/g, ""),
  }).eq("id", appointmentId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, appointmentId });
}
