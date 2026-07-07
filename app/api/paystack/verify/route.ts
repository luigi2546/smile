import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type RequestBody = {
  reference: string;
};

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { reference } = body;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured." }, { status: 500 });
  }

  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    return NextResponse.json({ error: data.message || "Paystack verification failed." }, { status: 502 });
  }

  if (data.data.status !== "success") {
    return NextResponse.json({ error: "Payment was not successful." }, { status: 400 });
  }

  const metadata = data.data.metadata || {};
  const planId = metadata.planId as string | undefined;
  const email = data.data.customer?.email as string | undefined;
  const fullName = metadata.fullName as string | undefined;
  const phone = metadata.phone as string | undefined;

  if (!planId || !email || !phone || !fullName) {
    return NextResponse.json({ error: "Payment metadata is incomplete." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Find or create customer
  const customerResult = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let customerId: string | null = (customerResult.data as any)?.id ?? null;

  if (!customerId) {
    const insertCustomer = await supabase
      .from("customers")
      .insert({ full_name: fullName, email, phone })
      .select("id")
      .single();

    if (insertCustomer.error || !insertCustomer.data) {
      return NextResponse.json({ error: "Unable to create customer record." }, { status: 500 });
    }

    customerId = insertCustomer.data.id;
  }

  const planResult = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("id", planId)
    .maybeSingle();

  if (!planResult.data) {
    return NextResponse.json({ error: "Subscription plan not found." }, { status: 404 });
  }

  const renewsAt = new Date();
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const insertSubscription = await supabase
    .from("subscriptions")
    .insert({
      customer_id: customerId,
      plan_id: planId,
      status: "active",
      started_at: new Date().toISOString().slice(0, 10),
      renews_at: renewsAt.toISOString().slice(0, 10),
      payment_ref: data.data.reference,
      notes: `Paystack transaction ${data.data.reference}`,
    })
    .select("id")
    .single();

  if (insertSubscription.error || !insertSubscription.data) {
    return NextResponse.json({ error: "Unable to record subscription." }, { status: 500 });
  }

  return NextResponse.json({ success: true, subscriptionId: insertSubscription.data.id });
}
