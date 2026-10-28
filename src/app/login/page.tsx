"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/app-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, allUsers } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginUser(email);
      if (ok) {
        const found = allUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (found?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError("Account not found. Please verify your email or sign up below.");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EB] text-[#072847]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-[#C88D34] uppercase tracking-widest font-semibold">
              § 03 · ACCESS GATEWAY
            </span>
            <h1 className="font-serif italic text-4xl font-normal text-[#072847]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#3E5A74]">
              Sign in to manage your Stableford scores, active draw tickets, and charity pledges.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#EFE4C4] rounded-3xl p-8 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6786A3] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="golfer@digitalheroes.co.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0D3B66]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#6786A3]">
                    (Any password accepted for testing)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6786A3] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-[#072847]/15 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#FFF2BA]" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#EFE4C4] text-center text-xs text-[#3E5A74]">
              Don&apos;t have an active subscription?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#0D3B66] hover:text-[#072847] hover:underline"
              >
                Subscribe & Join (§ 04)
              </Link>
            </div>
          </div>

          {/* Quick-Fill Credentials Card for Interview Reviewers */}
          <div className="bg-[#FAF0CA]/40 border border-[#EFE4C4] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C88D34]" />
                Reviewer Credentials (§ 15)
              </span>
              <span className="text-[10px] text-[#3E5A74] font-mono">1-Click Fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill("golfer@digitalheroes.co.in")}
                className="p-3 text-left bg-white border border-[#EFE4C4] hover:border-[#072847] rounded-xl transition-all group shadow-xs"
              >
                <div className="font-bold text-[#072847] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#0D3B66]" />
                  Golfer Account
                </div>
                <div className="text-[10px] text-[#3E5A74] mt-0.5 font-mono">
                  golfer@digitalheroes.co.in
                </div>
                <div className="text-[9px] text-[#C88D34] font-bold mt-1">
                  Marcus Vance (Handicap 11.4)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("admin@digitalheroes.co.in")}
                className="p-3 text-left bg-white border border-[#EFE4C4] hover:border-[#072847] rounded-xl transition-all group shadow-xs"
              >
                <div className="font-bold text-[#072847] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#C88D34]" />
                  Admin Account
                </div>
                <div className="text-[10px] text-[#3E5A74] mt-0.5 font-mono">
                  admin@digitalheroes.co.in
                </div>
                <div className="text-[9px] text-[#0D3B66] font-bold mt-1">
                  Eleanor Rostova (Director)
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
