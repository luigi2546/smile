"use client";

import { useState } from "react";
import { cancelSubscription, renewSubscription, togglePlanActive } from "@/app/admin/(protected)/subscriptions/actions";
import { SubscriptionPlanModal } from "@/components/admin/subscription-plan-modal";
import { AssignSubscriptionModal } from "@/components/admin/assign-subscription-modal";
import type { Customer, SubscriptionPlan, SubscriptionWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/primitives";
import { formatGHS } from "@/lib/utils";
import { Edit2, Power, UserPlus, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "gold" | "success" | "neutral" | "danger"> = {
    active: "success",
    paused: "gold",
    cancelled: "neutral",
    expired: "danger",
  };
  return <Badge tone={map[status] ?? "neutral"}>{status}</Badge>;
}

function daysUntil(dateStr: string) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / 86_400_000
  );
  return diff;
}

// ─── Plan Row ─────────────────────────────────────────────────────────────────

function PlanRow({
  plan,
  onEdit,
}: {
  plan: SubscriptionPlan;
  onEdit: (p: SubscriptionPlan) => void;
}) {
  const [toggling, setToggling] = useState(false);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50/60">
      <td className="px-5 py-3.5 font-semibold text-ink">{plan.name}</td>
      <td className="px-5 py-3.5 text-muted">{plan.description ?? "—"}</td>
      <td className="px-5 py-3.5 font-mono font-semibold text-teal-darker">
        {formatGHS(plan.price_ghs)}
      </td>
      <td className="px-5 py-3.5 text-muted">{plan.session_count} sessions</td>
      <td className="px-5 py-3.5">
        <Badge tone={plan.is_active ? "success" : "neutral"}>
          {plan.is_active ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(plan)}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-teal-darker hover:bg-teal-darker/10"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            disabled={toggling}
            onClick={async () => {
              setToggling(true);
              await togglePlanActive(plan.id);
              setToggling(false);
            }}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            <Power className="h-3.5 w-3.5" />
            {plan.is_active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Subscription Row ─────────────────────────────────────────────────────────

function SubRow({ sub }: { sub: SubscriptionWithRelations }) {
  const [cancelling, setCancelling] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const days = daysUntil(sub.renews_at);

  return (
    <>
      <tr className="border-t border-gray-100 hover:bg-gray-50/60">
        <td className="px-5 py-3.5 font-medium text-ink">
          {sub.customer?.full_name ?? "—"}
          <div className="text-xs text-muted">{sub.customer?.phone}</div>
        </td>
        <td className="px-5 py-3.5">{sub.plan?.name ?? "—"}</td>
        <td className="px-5 py-3.5">
          <StatusBadge status={sub.status} />
        </td>
        <td className="px-5 py-3.5 text-sm font-medium text-ink">
          {Math.max(0, sub.sessions_total - sub.sessions_used)} of {sub.sessions_total} remaining
        </td>
        <td className="px-5 py-3.5 text-sm text-muted">{formatGHS(sub.amount_paid_ghs)}</td>
        <td className="px-5 py-3.5 font-mono text-xs text-muted">
          {sub.payment_ref ?? "—"}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRenew(true)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-teal-darker hover:bg-teal-darker/10"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Add cycle
            </button>
            {sub.status !== "cancelled" && (
              <button
                disabled={cancelling}
                onClick={async () => {
                  if (!confirm("Cancel this customer package?")) return;
                  setCancelling(true);
                  await cancelSubscription(sub.id);
                  setCancelling(false);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancel
              </button>
            )}
          </div>
        </td>
      </tr>
      {showRenew && (
        <tr>
          <td colSpan={6} className="bg-teal-darker/5 px-5 py-3">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                fd.set("id", sub.id);
                await renewSubscription(fd);
                setShowRenew(false);
              }}
              className="flex items-center gap-3"
            >
              <input type="hidden" name="id" value={sub.id} />
              <input
                name="payment_ref"
                placeholder="New payment reference"
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-darker"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-teal-darker px-3 py-1.5 text-sm font-medium text-white"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm Package Cycle
              </button>
              <button
                type="button"
                onClick={() => setShowRenew(false)}
                className="text-sm text-muted hover:text-ink"
              >
                Cancel
              </button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Client Shell ────────────────────────────────────────────────────────

type Props = {
  plans: SubscriptionPlan[];
  subscriptions: SubscriptionWithRelations[];
  customers: Pick<Customer, "id" | "full_name" | "phone">[];
};

export function SubscriptionsClient({ plans, subscriptions, customers }: Props) {
  const [planModal, setPlanModal] = useState<SubscriptionPlan | null | "new">(null);
  const [assignModal, setAssignModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? subscriptions
      : subscriptions.filter((s) => s.status === statusFilter);

  const tabs = ["all", "active", "paused", "expired", "cancelled"];

  return (
    <>
      {/* ── Plan Management ─────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">Whitening Packages</h2>
          <button
            onClick={() => setPlanModal("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-darker px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-darker/90"
          >
            <span className="text-lg leading-none">+</span> Add Plan
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Sessions</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <PlanRow
                  key={p.id}
                  plan={p}
                  onEdit={(plan) => setPlanModal(plan)}
                />
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No packages yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Customer Subscriptions ──────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">
            Customer Packages
          </h2>
          <button
            onClick={() => setAssignModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-darker/30 bg-white px-4 py-2 text-sm font-semibold text-teal-darker hover:bg-teal-darker/5"
          >
            <UserPlus className="h-4 w-4" /> Assign Package
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="mb-3 flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setStatusFilter(t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                statusFilter === t
                  ? "bg-teal-darker text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Sessions Remaining</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold">Payment Ref</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <SubRow key={sub.id} sub={sub} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    No customer packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modals ──────────────────────────────────────── */}
      {planModal !== null && (
        <SubscriptionPlanModal
          plan={planModal === "new" ? undefined : planModal}
          onClose={() => setPlanModal(null)}
        />
      )}
      {assignModal && (
        <AssignSubscriptionModal
          customers={customers}
          plans={plans.filter((p) => p.is_active)}
          onClose={() => setAssignModal(false)}
        />
      )}
    </>
  );
}
