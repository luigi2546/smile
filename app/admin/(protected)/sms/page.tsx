import { createClient } from "@/lib/supabase/server";
import { SmsForm } from "@/components/admin/sms-form";
import type { Customer } from "@/lib/types";

export default async function SmsPage() {
  const supabase = createClient();
  const { data: customers } = await supabase.from("customers").select("id, full_name, phone").order("full_name");
  const customerList = (customers as Customer[] | null) ?? [];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Communications</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Bulk SMS</h1>
        <p className="mt-1 text-sm text-muted">Send a message to one or more customers from the dashboard.</p>
      </div>

      <SmsForm customerList={customerList} />
    </div>
  );
}
