"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  Stethoscope,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers (CRM)", icon: Users },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/services", label: "Services", icon: Stethoscope },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-teal-darker">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gold">
          <ToothMark />
        </span>
        <span className="font-serif text-base font-bold text-white">Smile Center GH</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </form>
    </aside>
  );
}

function ToothMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8 2 5 4.5 5 8c0 2 .5 3 1 5.5.5 2.5.5 6 1.8 7.8.6.8 1.5 1 2 .2.7-1.1.7-3.5 1.2-4.5.3-.7 1.6-.7 2 0 .5 1 .5 3.4 1.2 4.5.5.8 1.4.6 2-.2C17.5 19.5 17.5 16 18 13.5c.5-2.5 1-3.5 1-5.5 0-3.5-3-6-7-6z" />
    </svg>
  );
}
