import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, category, price_ghs, duration_minutes, is_active } = body;
    if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

    const supabase = createServiceClient();
    const res = await supabase
      .from("services")
      .update({
        name,
        description: description || null,
        category,
        price_ghs,
        duration_minutes,
        is_active,
      })
      .eq("id", id);

    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
