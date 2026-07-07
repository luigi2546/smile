"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, LogOut, User, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { initials } from "@/lib/utils";
import { logout } from "@/app/admin/actions";
import Link from "next/link";

type TopbarProps = {
  fullName: string;
  role: string;
};

type ClinicNotification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "booking" | "sms" | "alert";
  read: boolean;
};

const MOCK_NOTIFICATIONS: ClinicNotification[] = [
  {
    id: "1",
    title: "New Booking Request",
    desc: "Ama Owusu booked Teeth Whitening at Dome Branch.",
    time: "2 min ago",
    type: "booking",
    read: false,
  },
  {
    id: "2",
    title: "Bulk SMS Sent",
    desc: "Campaign successfully delivered to 14 patients.",
    time: "45 min ago",
    type: "sms",
    read: false,
  },
  {
    id: "3",
    title: "Low Inventory Alert",
    desc: "Dome Branch reporting low stock on Whitening kits.",
    time: "3 hrs ago",
    type: "alert",
    read: true,
  },
];

export function Topbar({ fullName, role }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<ClinicNotification[]>(MOCK_NOTIFICATIONS);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "booking":
        return <Sparkles className="h-4 w-4 text-teal" />;
      case "sms":
        return <MessageSquare className="h-4 w-4 text-amber-600" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-teal/10 bg-white/80 px-8 backdrop-blur-md">
      <div className="flex items-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal">
          Staff Console
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors duration-200"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5 text-ink/75" />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-teal/10 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-semibold text-sm text-ink">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-teal-darker hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 rounded-xl p-2.5 text-xs transition-colors hover:bg-slate-50 ${
                      !n.read ? "bg-teal/5" : ""
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="font-semibold text-ink">{n.title}</p>
                      <p className="text-muted leading-relaxed">{n.desc}</p>
                      <p className="text-[10px] text-muted">{n.time}</p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative border-l border-slate-100 pl-4" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-light font-semibold text-teal-darker text-sm shadow-sm">
              {initials(fullName)}
            </span>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-ink leading-tight">{fullName}</p>
              <p className="text-[10px] text-muted capitalize leading-none mt-0.5">{role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted shrink-0" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-teal/10 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-fade-in">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-ink">{fullName}</p>
                <p className="text-[10px] text-muted capitalize mt-0.5">{role}</p>
              </div>

              <div className="mt-1.5 space-y-0.5">
                <Link
                  href="/admin/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-ink hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-muted" />
                  My Profile
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-ink hover:bg-slate-50 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-muted" />
                  Settings
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
