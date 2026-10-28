"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store/app-context";
import {
  Sparkles,
  User,
  ShieldAlert,
  Eye,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from "lucide-react";

export function EvaluatorBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUserRole, logout, resetDemoState } = useApp();
  const [minimized, setMinimized] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleRoleSelect = (role: "public" | "subscriber" | "admin") => {
    if (role === "public") {
      logout();
      router.push("/");
    } else {
      switchUserRole(role);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleReset = () => {
    resetDemoState();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const currentRole = !currentUser ? "public" : currentUser.role;

  return (
    <aside
      aria-label="PRD Evaluator Mode"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-5xl w-[94vw] transition-all duration-300"
    >
      <div className="bg-[#072847]/95 backdrop-blur-xl border border-[#FFF2BA]/35 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Evaluator Indicator */}
          <div className="flex items-center gap-2.5 pl-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C88D34] animate-ping" />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#FFF2BA] font-bold tracking-wider">EVALUATOR</span>
              <span className="hidden md:inline text-white/40">|</span>
              <span className="hidden md:inline text-[#C1DBE8] text-[11px]">Instant Persona Switcher</span>
            </div>
          </div>

          {!minimized && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1">
              {/* Persona 1: Public Visitor */}
              <button
                onClick={() => handleRoleSelect("public")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  currentRole === "public"
                    ? "bg-white text-[#072847] shadow-md ring-2 ring-[#FFF2BA]"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Public Visitor</span>
              </button>

              {/* Persona 2: Registered Golfer (Marcus Vance) */}
              <button
                onClick={() => handleRoleSelect("subscriber")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  currentRole === "subscriber"
                    ? "bg-[#0D3B66] text-[#FFF2BA] border border-[#FFF2BA] shadow-md ring-2 ring-[#FFF2BA]/50"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#FFF2BA]" />
                <span className="hidden sm:inline">Golfer:</span>
                <span>Marcus (5 Scores)</span>
              </button>

              {/* Persona 3: Platform Admin (Eleanor Rostova) */}
              <button
                onClick={() => handleRoleSelect("admin")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  currentRole === "admin"
                    ? "bg-[#FFF2BA] text-[#072847] font-bold shadow-md ring-2 ring-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#072847]" />
                <span className="hidden sm:inline">Admin:</span>
                <span>Director Eleanor</span>
              </button>

              {/* Reset Data Button */}
              <button
                onClick={handleReset}
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-950/60 text-white/60 hover:text-red-300 text-xs font-mono transition-colors shrink-0"
                title="Reset all scores, simulations, and state back to default mock data"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>
          )}

          {/* Quick Context & Collapse Toggle */}
          <div className="flex items-center gap-2 pr-1 shrink-0">
            {resetToast && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 animate-fade-in">
                Reset Clean
              </span>
            )}

            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              title={minimized ? "Expand evaluator bar" : "Minimize evaluator bar"}
              aria-label="Toggle evaluator toolbar visibility"
            >
              {minimized ? (
                <ChevronUp className="w-4 h-4 text-[#FFF2BA]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
