import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  className?: string;
}) {
  const positive = delta?.startsWith("+");

  return (
    <div className={cn("rounded-2xl border border-teal-darker/10 bg-white p-6", className)}>
      <p className="font-serif text-2xl font-bold text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
      {delta && (
        <p
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
            positive ? "text-teal-deep" : "text-red-600"
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {delta}
        </p>
      )}
    </div>
  );
}
