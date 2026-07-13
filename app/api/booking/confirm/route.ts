import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const BOOKING_FEE_GHS = 30;
type PaymentChoice = "full" | "booking_fee";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      reference,
      serviceId,
      branchId,
      date,
      time,
      fullName,
      phone,
      email,
      notes,
      paymentChoice = "booking_fee",
    } = body;

    // Basic validation
    if (!reference || !serviceId || !branchId || !date || !time || !fullName || !phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const selectedPaymentChoice: PaymentChoice =
      paymentChoice === "full" ? "full" : "booking_fee";

    const supabase = createServiceClient();

    // 1. Snapshot the service price at time of booking
    const { data: service } = await supabase
      .from("services")
      .select("price_ghs")
      .eq("id", serviceId)
      .single();

    const servicePriceGhs = Number(service?.price_ghs ?? 0);
    const expectedAmountGhs =
      selectedPaymentChoice === "full" ? servicePriceGhs : BOOKING_FEE_GHS;
    const expectedAmountPesewas = Math.round(expectedAmountGhs * 100);

    // 2. Verify the Paystack payment server-side
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Cache-Control": "no-store",
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment could not be verified. Please contact support." },
        { status: 400 }
      );
    }

    // Guard against tampered amounts
    if (Number(paystackData.data.amount) !== expectedAmountPesewas) {
      return NextResponse.json(
        { error: "Incorrect payment amount." },
        { status: 400 }
      );
    }

    // 3. Find or create customer record (matched by phone number)
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    let customerId = existingCustomer?.id as string | undefined;

    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          full_name: fullName,
          phone,
          email: email || null,
          preferred_branch_id: branchId,
        })
        .select("id")
        .single();

      if (customerError || !newCustomer) {
        console.error("[booking/confirm] customer insert error:", customerError);
        return NextResponse.json(
          { error: "Failed to save your details. Please contact us." },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
    }

    // 4. Create the appointment as confirmed (payment received)
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        customer_id: customerId,
        service_id: serviceId,
        branch_id: branchId,
        appointment_date: date,
        appointment_time: time,
        status: "confirmed",
        price_ghs: servicePriceGhs,
        amount_paid_ghs: expectedAmountGhs,
        payment_ref: reference,
        booking_fee_ghs: selectedPaymentChoice === "full" ? 0 : BOOKING_FEE_GHS,
        notes:
          [
            notes || null,
            selectedPaymentChoice === "full"
              ? `Full payment ${reference}`
              : `Booking fee payment ${reference}`,
          ]
            .filter(Boolean)
            .join("\n") || null,
      } as any)
      .select("id")
      .single();

    if (appointmentError || !appointment) {
      console.error("[booking/confirm] appointment insert error:", appointmentError);
      return NextResponse.json(
        {
          error:
            "Payment received but booking could not be saved. Please contact us with your reference: " +
            reference,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointmentId: appointment.id });
  } catch (err) {
    console.error("[booking/confirm] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
