"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DrawMachine } from "@/components/draw/DrawMachine";
import { DrawBoard } from "@/components/draw/DrawBoard";
import { useApp } from "@/lib/store/app-context";
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  Heart,
} from "lucide-react";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";
import { AuthModal } from "@/components/modals/AuthModal";

export default function DrawPage() {
  const { activeJackpot, latestPublishedDraw, userScores, currentUser } = useApp();
  const [donateOpen, setDonateOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; tab: "login" | "signup" }>({
    isOpen: false,
    tab: "signup",
  });

  return (
    <div className="min-h-screen bg-[#FAF6EB] text-[#0A1C2C] flex flex-col font-sans selection:bg-[#0D3B66] selection:text-[#FFF2BA]">
      <Navbar
        onOpenAuth={(tab) => setAuthModal({ isOpen: true, tab })}
        onOpenDonate={() => setDonateOpen(true)}
      />

      <main className="flex-1 space-y-16 pb-24">
        {/* ========================================================================= */}
        {/* HERO HEADER */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-[#072847] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#0D3B66]/60">
          {/* Ambient luminous glow circles in Yale Blue & Champagne Gold */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0D3B66]/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#C88D34]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF2BA]/15 text-[#FFF2BA] border border-[#FFF2BA]/30 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#F3DEB2]" />
                PRD § 06 & § 07 Official Monthly Major Draw
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#C1DBE8]">
                <Calendar className="w-4 h-4 text-[#C88D34]" />
                <span>Next Draw Execution: 1st of Next Month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="font-serif italic text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFDF7] leading-[1.05]">
                  The Monthly Draw
                </h1>
                <p className="text-base sm:text-xl text-[#C1DBE8] max-w-2xl font-light leading-relaxed">
                  Five Stableford scores entered from your authentic club rounds. Five lucky numbers drawn.
                  Guaranteed 40 / 35 / 25 tier distribution, rollover jackpot mechanics, and 10%+ pledged to grassroots golf.
                </p>
              </div>

              {/* Live Jackpot Callout Card */}
              <div className="lg:col-span-4 bg-[#0D3B66]/70 backdrop-blur-md border border-[#FFF2BA]/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#FFF2BA] font-bold">
                  Current Active Prize Pool
                </div>
                <div className="mt-2 font-serif italic text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  £{activeJackpot.toLocaleString("en-GB")}
                </div>
                <p className="mt-2 text-xs text-[#C1DBE8] leading-relaxed">
                  Includes cumulative rollover funds from previous draws. 50% of all gross subscriber fees flow directly into member winnings.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#FFF2BA] font-semibold">5 Numbers Drawn (1–45)</span>
                  <span className="text-white/60 font-mono">Stableford Pts</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE DRAW MACHINE SIMULATOR (§ 06) */}
        {/* ========================================================================= */}
        <section id="the-draw" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EFE4C4] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0D3B66] font-bold">
                Experience The Engine
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#072847]">
                Live Draw Tumbler Simulator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#3E5A74] max-w-md">
              Test how the monthly draw algorithm generates 5 unique balls between 1 and 45, and check if your active scores hit a prize tier!
            </p>
          </div>

          <DrawMachine />
        </section>

        {/* ========================================================================= */}
        {/* OFFICIAL PUBLISHED DRAW & AUDIT BOARD (§ 06, § 07, § 09) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EFE4C4] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0D3B66] font-bold">
                Audited & Published
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#072847]">
                Latest Official Draw Results
              </h2>
            </div>
            <div className="text-xs text-[#3E5A74] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full cryptographic audit trail & admin approved payouts</span>
            </div>
          </div>

          <DrawBoard />
        </section>

        {/* ========================================================================= */}
        {/* MATHEMATICAL RULES & PRIZE TIER BREAKDOWN (§ 07) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#FAF0CA]/50 border border-[#EFE4C4] rounded-3xl p-8 sm:p-12 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0D3B66] font-bold">
                § 07 · Strict Mathematical Integrity
              </span>
              <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#072847]">
                The 40 / 35 / 25 Prize Architecture
              </h2>
              <p className="text-sm sm:text-base text-[#1C334A] leading-relaxed">
                50% of all monthly subscriptions fund the prize pool. The pool is divided precisely into three tiers, with equal splits among winners in each tier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#EFE4C4] shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#0D3B66] text-[#FFF2BA] text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Major Jackpot
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#0D3B66]">MATCH 5 OF 5</div>
                  <h3 className="font-serif italic text-3xl font-bold text-[#072847]">Tier 1 · 40%</h3>
                </div>
                <p className="text-xs text-[#3E5A74] leading-relaxed">
                  40% of the entire prize pool plus any accumulated rollover from preceding months. If unclaimed by all participants, the entire tier rolls over directly into next month&apos;s draw!
                </p>
                <div className="pt-3 border-t border-[#EFE4C4] flex items-center justify-between text-xs text-[#0D3B66] font-semibold">
                  <span>Rollover Protection</span>
                  <span className="text-emerald-700">Guaranteed</span>
                </div>
              </div>

              {/* Tier 2 Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#EFE4C4] shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#FFF2BA] text-[#0D3B66] text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider border-b border-l border-[#EFE4C4]">
                  High Return
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#0D3B66]">MATCH 4 OF 5</div>
                  <h3 className="font-serif italic text-3xl font-bold text-[#072847]">Tier 2 · 35%</h3>
                </div>
                <p className="text-xs text-[#3E5A74] leading-relaxed">
                  35% of the prize pool allocated and split equally among all qualifying players with 4 exact number matches. Never rolls over; always distributed to rewarding performers.
                </p>
                <div className="pt-3 border-t border-[#EFE4C4] flex items-center justify-between text-xs text-[#0D3B66] font-semibold">
                  <span>Split Formula</span>
                  <span>Equal per winner</span>
                </div>
              </div>

              {/* Tier 3 Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#EFE4C4] shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#C1DBE8] text-[#072847] text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Community Tier
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-[#0D3B66]">MATCH 3 OF 5</div>
                  <h3 className="font-serif italic text-3xl font-bold text-[#072847]">Tier 3 · 25%</h3>
                </div>
                <p className="text-xs text-[#3E5A74] leading-relaxed">
                  25% of the pool divided evenly across everyday golfers matching 3 numbers. Designed to ensure frequent wins and sustainable community engagement.
                </p>
                <div className="pt-3 border-t border-[#EFE4C4] flex items-center justify-between text-xs text-[#0D3B66] font-semibold">
                  <span>Frequency</span>
                  <span className="text-[#0D3B66]">Highest hit rate</span>
                </div>
              </div>
            </div>

            {/* Charity & Verification Callout */}
            <div className="bg-[#0D3B66] text-[#FFFDF7] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#FFF2BA] text-xs font-mono font-bold uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-[#FFF2BA] fill-[#FFF2BA]" />
                  Minimum 10% Charity Contribution (§ 08)
                </div>
                <h4 className="font-serif italic text-2xl font-bold text-white">
                  Every Win Empowers Grassroots Golf
                </h4>
                <p className="text-xs text-[#C1DBE8] max-w-xl leading-relaxed">
                  When you win any tier, at least 10% (up to 50% voluntarily) is automatically gifted to your chosen charity partner, with admin-approved proof verification.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-xl bg-[#FFF2BA] text-[#072847] font-bold text-xs hover:bg-[#FAF0CA] transition-all shadow-sm"
                >
                  Manage My Scores & Charity
                </Link>
                <Link
                  href="/charities"
                  className="px-5 py-3 rounded-xl bg-[#072847] border border-[#FFF2BA]/30 text-white font-bold text-xs hover:bg-[#072847]/80 transition-all"
                >
                  Explore Charities
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW TO QUALIFY & ENTER IN 3 STEPS */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0D3B66] font-bold">
              Step-By-Step Participation
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#072847]">
              How to Enter the Monthly Draw
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[#EFE4C4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D3B66] text-[#FFF2BA] flex items-center justify-center font-serif italic text-2xl font-bold shadow-md">
                1
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                Subscribe & Activate Account
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Join Digital Heroes for £15/month or £150/year. Your active subscription qualifies you for every scheduled monthly major draw automatically.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#EFE4C4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D3B66] text-[#FFF2BA] flex items-center justify-center font-serif italic text-2xl font-bold shadow-md">
                2
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                Log 5 Stableford Scores (1–45)
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Enter your genuine Stableford points from recent rounds. Digital Heroes maintains your latest 5 rolling scores in reverse-chronological order.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#EFE4C4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D3B66] text-[#FFF2BA] flex items-center justify-center font-serif italic text-2xl font-bold shadow-md">
                3
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                Match & Claim Verified Winnings
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                If your scores match 3, 4, or 5 numbers in the draw, upload your handicap screenshot (HowDidiDo / GHIN) for admin approval and instant direct payout.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <DirectDonationModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <AuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ isOpen: false, tab: "signup" })}
      />
    </div>
  );
}
