"use client";

import React, { useActionState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdminAction, AuthActionResult } from "@/app/admin/actions/auth";
import { Sun, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

const initialState: AuthActionResult = {
  success: false,
};

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/admin";

  useEffect(() => {
    if (state.success) {
      router.push(returnTo);
      router.refresh();
    }
  }, [state.success, router, returnTo]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
          Admin Email
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            defaultValue="owner@example.com"
            placeholder="admin@noorsolaren.com"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] outline-none transition-colors"
          />
          <Mail className="w-4 h-4 text-[#5C605C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] outline-none transition-colors"
          />
          <Lock className="w-4 h-4 text-[#5C605C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all disabled:opacity-60 shadow-md mt-6"
      >
        {isPending ? (
          <span>Authenticating...</span>
        ) : (
          <>
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#E4E7E4] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-5 sm:p-8 md:p-10 rounded-[28px] sm:rounded-[36px] bg-white border border-[#DDE1DC] shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#CEF23E] flex items-center justify-center mx-auto mb-4 text-[#111311] shadow-sm">
            <Sun className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Admin Management
          </h1>
          <p className="text-xs text-[#5C605C] mt-1">
            Noor Solar Energy Portal
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-8 text-center text-xs font-mono text-[#5C605C]">
              Loading login portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <p className="text-center text-[11px] font-mono text-[#5C605C] mt-8 break-words leading-relaxed px-2">
          Authorized personnel only &bull; Protected by session auth
        </p>

      </div>
    </div>
  );
}
