"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { changePasswordAction } from "@/app/admin/actions/auth";

export default function AdminChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = (formData.get("newPassword") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";

    if (newPassword.length < 12) {
      setError("New password must be at least 12 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await changePasswordAction(null, formData);
      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || "Failed to change password.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/settings"
          className="w-9 h-9 rounded-full bg-white border border-[#DDE1DC] flex items-center justify-center text-[#111311] hover:border-[#111311] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#111311]" />
            Change Admin Password
          </h1>
          <p className="text-xs text-[#5C605C]">
            Update your master credentials. Passwords must be at least 12 characters.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-[#CEF23E]/20 border border-[#CEF23E] flex items-start gap-3 text-xs text-[#111311]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#111311]" />
            <div>
              <span className="font-bold">Password updated successfully!</span>
              <p className="mt-0.5 text-[#5C605C]">Your new master password is active across all sessions.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              required
              autoComplete="current-password"
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono focus:ring-2 focus:ring-[#111311]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              New Password (minimum 12 characters)
            </label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={12}
              autoComplete="new-password"
              placeholder="Enter new password (min 12 chars)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono focus:ring-2 focus:ring-[#111311]"
            />
            <span className="text-[11px] text-[#5C605C] font-mono mt-1 block">
              Recommendation: Use a passphrase with numbers or symbols.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={12}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono focus:ring-2 focus:ring-[#111311]"
            />
          </div>

          <div className="pt-4 border-t border-[#EDEDED] flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>

            <Link
              href="/admin/settings"
              className="text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}