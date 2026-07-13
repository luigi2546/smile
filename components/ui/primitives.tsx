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
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-teal text-white hover:bg-teal-dark shadow-soft",
    secondary: "bg-gold text-[#173B3F] hover:bg-gold-dark",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-soft",
    ghost: "border border-surface-strong bg-white text-ink hover:bg-surface2",
  };
  const sizes = {
    sm: "px-4 py-2",
    md: "px-5 py-3",
    lg: "px-6 py-3.5 text-base",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const { children, ...linkProps } = props;

    return (
      <Link
        href={href}
        prefetch
        className={classes}
        {...(linkProps as Omit<ComponentProps<typeof Link>, "href">)}
      >
        {children as React.ReactNode}
      </Link>
    );
  }

  return <button className={classes} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-teal/20 bg-teal/5 shadow-soft",
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
    neutral: "bg-surface-strong text-ink",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    gold: "bg-gold-light text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
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
        "w-full rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted shadow-sm transition focus:border-teal focus-visible:ring-2 focus-visible:ring-teal/15 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
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
        "w-full min-h-[108px] rounded-2xl border border-surface-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted shadow-sm transition focus:border-teal focus-visible:ring-2 focus-visible:ring-teal/15 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-2 block text-sm font-semibold text-ink", className)}
      {...props}
    />
  );
}
