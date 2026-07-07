import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type RequestBody = {
  planId: string;
  fullName: string;
  email: string;
  phone: string;
};

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { planId, fullName, email, phone } = body;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured." }, { status: 500 });
  }

  if (!planId || !email || !phone || !fullName) {
    return NextResponse.json({ error: "Missing required checkout fields." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .maybeSingle();

  if (error || !plan) {
    return NextResponse.json({ error: "Selected plan not found." }, { status: 404 });
  }

  const amount = Math.round(Number(plan.price_ghs) * 100);
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? ""}/membership/checkout?planId=${planId}`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      currency: "GHS",
      metadata: {
        planId,
        fullName,
        phone,
      },
      callback_url: callbackUrl,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    return NextResponse.json({ error: data.message || "Paystack initialization failed." }, { status: 502 });
  }

  return NextResponse.json({
    reference: data.data.reference,
    amount,
  });
}
