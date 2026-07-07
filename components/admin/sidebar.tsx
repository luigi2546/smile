"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  Stethoscope,
  MessageSquareText,
  CreditCard,
  DollarSign,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers (CRM)", icon: Users },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/services", label: "Services", icon: Stethoscope },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/transactions", label: "Transactions", icon: DollarSign },
  { href: "/admin/sms", label: "Bulk SMS", icon: MessageSquareText },
];

const bottomNav = [
  { href: "/admin/profile", label: "My Profile", icon: UserCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-teal-darker">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-md shadow-black/20">
          <Image
            src="/logo.svg"
            alt="Smile Center GH"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <span className="font-serif text-sm font-bold text-white leading-tight block">
            Smile Center GH
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            Staff Console
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Main
        </p>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-amber-400" : ""
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav — Profile & Settings */}
      <div className="border-t border-white/10 px-3 py-3 space-y-0.5">
        <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Account
        </p>
        {bottomNav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-amber-400" : ""
                )}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Sign Out */}
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
