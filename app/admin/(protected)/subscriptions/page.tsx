import { createServiceClient } from "@/lib/supabase/service";
import { SubscriptionsClient } from "@/components/admin/subscriptions-client";
import { CreditCard } from "lucide-react";

export default async function SubscriptionsPage() {
  const supabase = createServiceClient();

  const [{ data: plans }, { data: subscriptions }, { data: customers }] =
    await Promise.all([
      supabase
        .from("subscription_plans")
        .select("*")
        .order("price_ghs"),
      supabase
        .from("subscriptions")
        .select("*, customer:customers(id, full_name, phone), plan:subscription_plans(id, name, price_ghs)")
        .order("created_at", { ascending: false }),
      supabase
        .from("customers")
        .select("id, full_name, phone")
        .order("full_name"),
    ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20">
          <CreditCard className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Smile Club Subscriptions
          </h1>
          <p className="text-sm text-muted">
            Manage monthly membership plans and customer subscriptions
          </p>
        </div>
      </div>

      <SubscriptionsClient
        plans={plans ?? []}
        subscriptions={(subscriptions ?? []) as any}
        customers={customers ?? []}
      />
    </div>
  );
}
