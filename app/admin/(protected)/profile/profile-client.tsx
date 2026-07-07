"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/primitives";
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

type Props = {
  staffId: string;
  initialFullName: string;
  email: string;
  role: string;
};

export function ProfileClient({ staffId, initialFullName, email, role }: Props) {
  // — Name form state
  const [fullName, setFullName] = useState(initialFullName);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // — Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;
    setNameLoading(true);
    setNameMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("staff_profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", staffId);

      if (error) throw error;
      setNameMsg({ type: "success", text: "Display name updated successfully." });
    } catch (err: any) {
      setNameMsg({ type: "error", text: err?.message ?? "Failed to update name." });
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setPwLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwMsg({ type: "error", text: err?.message ?? "Failed to update password." });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Personal information ─────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal/10">
            <User className="h-4 w-4 text-teal-darker" />
          </div>
          <div>
            <h3 className="font-semibold text-ink">Personal Information</h3>
            <p className="text-xs text-muted">Update your display name</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="full_name">Display Name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email_display">Email Address</Label>
              <Input
                id="email_display"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-muted">
                Email is managed by your administrator.
              </p>
            </div>
          </div>

          <div>
            <Label>Role</Label>
            <div className="flex items-center gap-2 rounded-2xl border border-surface-strong bg-surface px-4 py-3">
              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  role === "admin"
                    ? "bg-amber-100 text-amber-700"
                    : role === "branch_manager"
                    ? "bg-teal/10 text-teal-darker"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {role === "admin"
                  ? "Administrator"
                  : role === "branch_manager"
                  ? "Branch Manager"
                  : "Staff"}
              </span>
              <span className="text-xs text-muted">
                Contact your admin to change your role.
              </span>
            </div>
          </div>

          {nameMsg && (
            <div
              className={[
                "flex items-start gap-2.5 rounded-2xl p-4 text-sm",
                nameMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              {nameMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              {nameMsg.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={nameLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-darker px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-deeper disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {nameLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Change Password ───────────────────────────────── */}
      <section className="rounded-[1.75rem] border border-teal/20 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-ink">Change Password</h3>
            <p className="text-xs text-muted">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showCurrent ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[8, 12, 16].map((len) => (
                  <div
                    key={len}
                    className={[
                      "h-1 flex-1 rounded-full transition-all",
                      newPassword.length >= len
                        ? newPassword.length >= 16
                          ? "bg-emerald-500"
                          : newPassword.length >= 12
                          ? "bg-amber-400"
                          : "bg-red-400"
                        : "bg-slate-200",
                    ].join(" ")}
                  />
                ))}
              </div>
              <p className="text-xs text-muted">
                {newPassword.length < 8
                  ? "Too short"
                  : newPassword.length < 12
                  ? "Fair — try making it longer"
                  : newPassword.length < 16
                  ? "Good password"
                  : "Strong password ✓"}
              </p>
            </div>
          )}

          {pwMsg && (
            <div
              className={[
                "flex items-start gap-2.5 rounded-2xl p-4 text-sm",
                pwMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              {pwMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              {pwMsg.text}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={pwLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-darker px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-deeper disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
