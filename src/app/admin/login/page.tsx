"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsPending(false);
        return;
      }

      // Full navigation guarantees cookie state is immediately active
      window.location.href = returnTo;
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Network or server connection error. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#EDEDED] border border-transparent focus:border-[#111311] focus:bg-white text-xs sm:text-sm text-[#111311] outline-none transition-colors"
          />
          <Lock className="w-4 h-4 text-[#5C605C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-xs tracking-tight transition-all disabled:opacity-60 shadow-md mt-6 cursor-pointer"
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
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-5 sm:p-8 md:p-10 rounded-[28px] sm:rounded-[36px] bg-white border border-[#DCE4E0] shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 group">
            <Image
              src="/brand/logo-default.png"
              alt="Noor Solar Energy"
              width={180}
              height={45}
              className="h-10 w-auto mx-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#074031] tracking-tight">
            Admin Management
          </h1>
          <p className="text-xs text-[#62706A] mt-1">
            Noor Solar Energy Portal
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-8 text-center text-xs font-mono text-[#62706A]">
              Loading login portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <p className="text-center text-[11px] font-mono text-[#62706A] mt-8 break-words leading-relaxed px-2">
          Authorized personnel only &bull; Protected by session auth
        </p>

      </div>
    </div>
  );
}
