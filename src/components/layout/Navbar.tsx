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
    { label: "The Draw", href: "/draw" },
    { label: "Charities", href: "/charities" },
    { label: "Golfer Dashboard", href: "/dashboard" },
    { label: "Admin Console", href: "/admin", adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EB]/90 backdrop-blur-xl border-b border-[#EFE4C4]/80 shadow-[0_4px_24px_rgba(7,40,71,0.04)] transition-all">
      {/* Top micro ticker for draw jackpot & system status */}
      <div className="bg-[#072847] text-[#FAF6EB] text-xs px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#0D3B66]/70">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C88D34]/25 text-[#FFF2BA] font-semibold text-[11px] border border-[#C88D34]/40 shadow-sm animate-gold-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#F3DEB2]" />
            Monthly Jackpot Pool
          </span>
          <span className="font-serif italic font-bold text-white tracking-wide text-sm">
            £{activeJackpot.toLocaleString("en-GB")} Available
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C1DBE8] text-[11px] font-sans">
            Guaranteed 40 / 35 / 25 Tier Distribution + Jackpot Rollover
          </span>
        </div>

        {/* Live Member / Session indicator */}
        <div className="flex items-center gap-3 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white/70 hidden sm:inline text-[11px]">Logged in:</span>
              <span className="text-[#FFF2BA] font-semibold text-xs">{currentUser.full_name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/15 text-white font-mono uppercase tracking-wider font-semibold">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-white/60">PRD 2026 Evaluation:</span>
              <Link
                href="/login"
                className="text-[#FFF2BA] hover:text-white hover:underline flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Instant Sign-In</span>
                <ArrowRight className="w-3 h-3 text-[#C88D34]" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-baseline gap-1.5 group select-none">
          <span className="font-sans font-extrabold text-2xl tracking-tight text-[#072847]">
            digital<span className="text-[#C88D34] group-hover:scale-125 inline-block transition-transform">.</span>
          </span>
          <span className="font-serif italic font-semibold text-2xl tracking-normal text-[#0D3B66] group-hover:text-[#C88D34] transition-colors">
            HEROES
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-[#0D3B66] bg-[#FAF0CA] border border-[#EFE4C4] rounded-md px-2 py-0.5 shadow-2xs font-bold">
            Feel, Not Fairway
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            if (link.adminOnly && currentUser?.role !== "admin") return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#0D3B66] text-[#FFF2BA] shadow-sm border border-[#0D3B66]"
                    : "text-[#1C334A] hover:text-[#0D3B66] hover:bg-[#FFF2BA]/50"
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B66] bg-white hover:bg-[#FFF2BA]/50 border border-[#C88D34]/40 hover:border-[#C88D34] px-3.5 py-2.5 rounded-xl shadow-2xs hover:shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#C88D34] fill-[#C88D34]/20" />
              <span>Direct Gift</span>
            </button>
          )}

          {currentUser ? (
            /* Logged in state */
            <div className="flex items-center gap-2">
              {currentUser.role === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFF2BA] bg-[#072847] hover:bg-[#0D3B66] border border-[#C88D34]/40 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F3DEB2]" />
                  <span>Admin Console</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFF2BA] bg-[#0D3B66] hover:bg-[#072847] border border-white/20 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <User className="w-3.5 h-3.5 text-[#F3DEB2]" />
                  <span>Golfer Portal</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2.5 text-[#6786A3] hover:text-red-700 hover:bg-red-50 rounded-xl transition-all border border-[#EFE4C4]"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Logged out state */
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2.5 text-xs font-bold text-[#072847] hover:text-[#0D3B66] hover:bg-[#FFF2BA]/50 rounded-xl transition-all border border-[#EFE4C4]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0D3B66] hover:bg-[#072847] text-[#FFF2BA] text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Subscribe & Join</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C88D34]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#0D3B66] hover:bg-[#FFF2BA]/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF6EB] border-b border-[#EFE4C4] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#0D3B66] py-2 border-b border-[#EFE4C4]/60"
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
                  className="text-center w-full py-2.5 bg-[#0D3B66] text-[#FFF2BA] rounded-lg text-sm font-semibold"
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
                  className="text-center w-full py-2.5 bg-white border border-[#EFE4C4] text-[#072847] rounded-lg text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2.5 bg-[#0D3B66] text-[#FFF2BA] rounded-lg text-sm font-semibold"
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
