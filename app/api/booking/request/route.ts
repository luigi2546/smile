import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, serviceId, branchId, date, time } = await request.json();

    if (!fullName?.trim() || !phone?.trim() || !serviceId || !branchId || !date || !time) {
      return NextResponse.json({ error: "Please complete your name, phone, service, date, and time." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone.trim())
      .maybeSingle();

    let customerId = existingCustomer?.id;
    if (!customerId) {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({ full_name: fullName.trim(), phone: phone.trim(), preferred_branch_id: branchId })
        .select("id")
        .single();

      if (customerError || !customer) {
        console.error("[booking/request] customer insert error:", customerError);
        return NextResponse.json({ error: "We could not save your details. Please try again." }, { status: 500 });
      }
      customerId = customer.id;
    }

    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        customer_id: customerId,
        service_id: serviceId,
        branch_id: branchId,
        appointment_date: date,
        appointment_time: time,
        status: "pending",
        visit_type: "booking",
        total_sessions: 1,
        session_number: 1,
        notes: "Requested online without payment",
      })
      .select("id")
      .single();

    if (appointmentError || !appointment) {
      console.error("[booking/request] appointment insert error:", appointmentError);
      return NextResponse.json({ error: "We could not create your appointment request. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ appointmentId: appointment.id });
  } catch (error) {
    console.error("[booking/request] unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
