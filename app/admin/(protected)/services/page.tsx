import { createServiceClient } from "@/lib/supabase/service";
import { Card, Badge } from "@/components/ui/primitives";
import ServiceItem from "@/components/admin/service-item";
import { AddServiceModal } from "@/components/admin/add-service-modal";
import { formatGHS } from "@/lib/utils";
import type { Service } from "@/lib/types";

export default async function ServicesAdminPage() {
  const supabase = createServiceClient();
  const { data: services } = await supabase.from("services").select("*").order("category");
  const totalServices = (services as Service[] | null) ?? [];
  const activeServices = totalServices.filter((s) => s.is_active);
  const inactiveCount = totalServices.filter((s) => !s.is_active).length;
  const categoryCount = new Set(totalServices.map((s) => s.category)).size;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Operations</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Treatments</h1>
          <p className="mt-1 text-sm text-muted">{activeServices.length} active treatments available</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="gold">{totalServices.length} total</Badge>
            <Badge tone="neutral">{categoryCount} categories</Badge>
            <Badge tone={inactiveCount > 0 ? "warning" : "success"}>
              {inactiveCount} inactive
            </Badge>
          </div>
          <AddServiceModal />
        </div>
      </div>

      <div className="mt-8">
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-teal-darker/5 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Treatment</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-darker/10">
              {totalServices.map((s) => (
                <tr key={s.id} className="border-t border-teal-darker/5 hover:bg-teal-darker/[0.01]">
                  <td className="px-5 py-3.5 font-medium text-ink">
                    <div>{s.name}</div>
                    {s.description && (
                      <div className="text-xs text-muted font-normal mt-0.5 max-w-sm truncate" title={s.description}>
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{s.category}</td>
                  <td className="px-5 py-3.5 text-muted">{formatGHS(s.price_ghs)}</td>
                  <td className="px-5 py-3.5 text-muted">{s.duration_minutes} min</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={s.is_active ? "success" : "danger"}>
                      {s.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <ServiceItem service={s as Service} />
                  </td>
                </tr>
              ))}
              {totalServices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No treatments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
