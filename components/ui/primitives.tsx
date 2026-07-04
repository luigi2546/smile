import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-teal-darker text-white hover:bg-teal-panel",
    secondary: "bg-gold text-teal-darker hover:bg-gold-light",
    ghost: "bg-transparent text-teal-darker border border-teal-darker/20 hover:bg-teal-darker/5",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children as React.ReactNode}
      </Link>
    );
  }

  return <button className={classes} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-teal-darker/10 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & { tone?: "neutral" | "success" | "warning" | "danger" | "gold" }) {
  const tones = {
    neutral: "bg-teal-darker/5 text-teal-darker",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    gold: "bg-gold/15 text-teal-darker",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-teal-darker/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus-ring",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-teal-darker/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus-ring",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
      {...props}
    />
  );
}
