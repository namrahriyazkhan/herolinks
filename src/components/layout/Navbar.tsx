"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store/app-context";
import {
  Trophy,
  Heart,
  User,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface NavbarProps {
  onOpenAuth?: (tab: "login" | "signup") => void;
  onOpenDonate?: () => void;
}

export function Navbar({ onOpenAuth, onOpenDonate }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, activeJackpot } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "The Draw", href: "/#draw-mechanics" },
    { label: "Charities", href: "/charities" },
    { label: "Golfer Dashboard", href: "/dashboard" },
    { label: "Admin Console", href: "/admin", adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC0]/60 transition-all">
      {/* Top micro ticker for draw jackpot & system status */}
      <div className="bg-[#0D261E] text-[#FAF7F2] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#1A4235]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C88D34]/20 text-[#E8C28A] font-medium border border-[#C88D34]/30">
            <Sparkles className="w-3 h-3 text-[#E8C28A]" />
            Monthly Jackpot
          </span>
          <span className="font-semibold text-white tracking-wide">
            £{activeJackpot.toLocaleString("en-GB")} Available
          </span>
          <span className="hidden sm:inline text-white/50">•</span>
          <span className="hidden sm:inline text-white/70">
            100% transparent 40/35/25 distribution
          </span>
        </div>

        {/* Live Member / Session indicator */}
        <div className="flex items-center gap-3 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-white/60 hidden sm:inline">Signed in as:</span>
              <span className="text-[#E8C28A] font-bold">{currentUser.full_name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-white font-mono uppercase">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-white/60">Demo Evaluation:</span>
              <Link
                href="/login"
                className="text-[#E8C28A] hover:underline flex items-center gap-1"
              >
                <span>Test Credentials</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-baseline gap-1.5 group">
          <span className="font-sans font-extrabold text-xl tracking-tight text-[#0D261E]">
            digital<span className="text-[#C88D34]">.</span>
          </span>
          <span className="font-serif italic font-semibold text-2xl tracking-normal text-[#143A2F] group-hover:text-[#C88D34] transition-colors">
            HEROES
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-[#748780] border border-[#E8DEC0] rounded px-1.5 py-0.5">
            2026 PRD
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            if (link.adminOnly && currentUser?.role !== "admin") return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#0D261E] font-semibold border-b-2 border-[#143A2F] pb-1"
                    : "text-[#485953] hover:text-[#0D261E]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth & Portal Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenDonate && (
            <button
              onClick={onOpenDonate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143A2F] bg-[#FAF7F2] hover:bg-[#F3ECE2] border border-[#143A2F]/20 px-3 py-2 rounded-xl transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-[#C88D34]" />
              Direct Gift
            </button>
          )}

          {currentUser ? (
            /* Logged in state */
            <div className="flex items-center gap-2">
              {currentUser.role === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0D261E] hover:bg-[#143A2F] px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#E8C28A]" />
                  Admin Center
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#143A2F] hover:bg-[#0D261E] px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <User className="w-3.5 h-3.5 text-[#E8C28A]" />
                  Golfer Portal
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-[#748780] hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-[#E8DEC0]"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Logged out state */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-[#0D261E] hover:text-[#143A2F] hover:bg-[#F3ECE2] rounded-xl transition-all border border-[#E8DEC0]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#143A2F] hover:bg-[#0D261E] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>Subscribe (§ 04)</span>
                <ArrowRight className="w-3 h-3 text-[#E8C28A]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#143A2F] hover:bg-[#F3ECE2]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF7F2] border-b border-[#E8DEC0] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#143A2F] py-2 border-b border-[#E8DEC0]/40"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2.5 bg-[#143A2F] text-white rounded-lg text-sm font-semibold"
                >
                  My Dashboard ({currentUser.full_name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center w-full py-2 text-xs text-red-700 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2.5 bg-white border border-[#E8DEC0] text-[#0D261E] rounded-lg text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2.5 bg-[#143A2F] text-white rounded-lg text-sm font-semibold"
                >
                  Subscribe & Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
