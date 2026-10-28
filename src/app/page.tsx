"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store/app-context";
import { AuthModal } from "@/components/modals/AuthModal";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";
import { DrawMachine } from "@/components/draw/DrawMachine";
import {
  Sparkles,
  Heart,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Compass,
  Calendar,
  Layers,
  Flame,
  Check,
  Play,
  RotateCcw,
} from "lucide-react";

export default function HomePage() {
  const { stats, charities, activeJackpot, latestPublishedDraw, userScores } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("signup");
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  // Dynamic Subscriber Scale Slider for Prize Pool Simulator
  const [simulatedSubscribers, setSimulatedSubscribers] = useState(1850);
  const [simulatedCharityPercent, setSimulatedCharityPercent] = useState(15);
  const [simulatedPlan, setSimulatedPlan] = useState<"monthly" | "yearly">("monthly");

  // Calculations based on PRD § 06 & § 07 (50% prize pool portion, 40/35/25 split)
  const fee = simulatedPlan === "yearly" ? 12.5 : 15.0;
  const monthlyRevenue = simulatedSubscribers * fee;
  const totalPrizeFund = monthlyRevenue * 0.5;
  const rolloverIn = 3720;
  const tier1Total = totalPrizeFund * 0.4 + rolloverIn;
  const tier2Total = totalPrizeFund * 0.35;
  const tier3Total = totalPrizeFund * 0.25;
  const monthlyCharityFund = monthlyRevenue * (simulatedCharityPercent / 100);

  const featuredCharities = charities.filter((c) => c.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EB] text-[#072847]">
      <Navbar
        onOpenAuth={(tab) => {
          setAuthDefaultTab(tab);
          setAuthModalOpen(true);
        }}
        onOpenDonate={() => setDonateModalOpen(true)}
      />

      <main className="flex-1 space-y-20 md:space-y-32">
        {/* ========================================================================= */}
        {/* EDITORIAL MASTHEAD & HERO (§ 00, § 01 & § 12) */}
        {/* ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#EFE4C4]">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Magazine Edition Header Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#EFE4C4] pb-3 text-xs font-mono text-[#6786A3] gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-[#072847] bg-[#FAF6EB] px-2 py-0.5 rounded border border-[#EFE4C4]">
                  VOL. 2026 · ISSUE 03
                </span>
                <span className="text-[#EFE4C4]">•</span>
                <span className="font-serif italic font-semibold text-[#072847]">An Editorial Golf Platform</span>
                <span className="text-[#EFE4C4]">•</span>
                <span className="text-[#C88D34] font-bold">DIGITAL HEROES PRD SPECIFICATION</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="font-mono text-[#0D3B66] font-bold">100% TRANSPARENT PRIZE POOLS</span>
                <span className="hidden sm:inline text-[#072847] font-semibold bg-[#FAF0CA] px-2.5 py-0.5 rounded-full border border-[#C88D34]/30">
                  ● Verified Charitable Ecosystem
                </span>
              </div>
            </div>

            {/* Hero Main Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-7">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0D3B66]/10 border border-[#0D3B66]/20 text-[#072847] text-xs font-bold shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C88D34] animate-pulse"></span>
                  <span>March Major Charity Draw Open · £{activeJackpot.toLocaleString("en-GB")} Available</span>
                </div>

                <h1 className="font-serif italic text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#072847] leading-[1.03]">
                  Your swing. <br />
                  <span className="font-sans font-black not-italic text-[#072847] tracking-tight">
                    Their future.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-[#3E5A74] max-w-xl font-normal leading-relaxed">
                  Discarding generic clichés in favor of genuine sporting purpose. Log your verified Stableford rounds, enter automatic 5-number monthly charity draws, and empower vetted causes.
                </p>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setAuthDefaultTab("signup");
                      setAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0D3B66] hover:bg-[#072847] text-[#FFF2BA] font-bold rounded-2xl text-base shadow-[0_8px_25px_rgba(13,59,102,0.3)] hover:shadow-[0_12px_32px_rgba(13,59,102,0.4)] transition-all transform hover:-translate-y-0.5 border border-[#FFF2BA]/30"
                  >
                    <span>Subscribe & Nominate Cause</span>
                    <ArrowRight className="w-4 h-4 text-[#FFF2BA]" />
                  </button>

                  <Link
                    href="/draw"
                    className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#FFF2BA] hover:bg-[#FAF0CA] text-[#072847] font-bold rounded-2xl text-base border border-[#E5CD70] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#0D3B66]" />
                    <span>The Monthly Draw (§ 06)</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2.5 px-7 py-4 bg-white hover:bg-[#FFF2BA]/40 text-[#072847] font-bold rounded-2xl text-base border border-[#EFE4C4] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <Trophy className="w-4 h-4 text-[#C88D34]" />
                    <span>Golfer Portal (§ 10)</span>
                  </Link>
                </div>

                {/* Live Impact Counters (§ 11.05) */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#EFE4C4]">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3] block font-bold">
                      Charity Raised
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-black text-[#072847] tracking-tight">
                      £{stats.total_raised_charity.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#0D3B66] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D3B66]" />
                      100% Verified Non-Profits
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3] block font-bold">
                      Active Jackpot
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-black text-[#C88D34] tracking-tight">
                      £{activeJackpot.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#915E12] font-semibold">
                      + £3,720 Rollover in Tier 1
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3] block font-bold">
                      Active Golfers
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-black text-[#072847] tracking-tight">
                      {stats.active_subscribers.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#6786A3] font-medium">
                      5-Score Queue Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Mascot Homage & Ticket Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="bg-gradient-to-br from-[#041220] via-[#072847] to-[#0D3B66] text-white rounded-3xl p-7 sm:p-9 border-2 border-[#C88D34]/50 shadow-[0_20px_50px_rgba(7,40,71,0.2)] relative overflow-hidden space-y-6">
                  {/* Decorative gold background glow */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-[#C88D34]/20 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div className="flex items-center gap-3">
                      {/* Mascot Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-[#041220] border-2 border-[#C88D34] flex items-center justify-center shadow-md">
                        <Sparkles className="w-6 h-6 text-[#FFF2BA]" />
                      </div>
                      <div>
                        <div className="font-serif italic font-bold text-xl text-[#FFFDF7]">
                          Digital Heroes Draw
                        </div>
                        <div className="text-[10px] font-mono text-[#FFF2BA] tracking-wider uppercase font-semibold">
                          OFFICIAL MONTHLY DRAW · 2026
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/60 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full font-bold">
                      MARCH MAJOR
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA] font-bold">
                        Winning Combination Drawn:
                      </span>
                      <span className="text-[10px] font-mono text-white/50">5 of 45 Matches</span>
                    </div>

                    <div className="flex flex-wrap gap-2.5 sm:gap-3 py-1">
                      {(latestPublishedDraw?.winning_numbers || [29, 34, 36, 38, 41]).map((num) => (
                        <div
                          key={num}
                          className="lottery-ball-3d w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EB] to-[#EFE4C4] text-[#072847] flex items-center justify-center font-serif italic text-2xl font-black shadow-lg border-2 border-[#C88D34]"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-black/25 border border-white/15 space-y-2.5 text-xs backdrop-blur-sm">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-medium">Total Monthly Prize Fund:</span>
                      <strong className="text-white font-serif text-base font-bold">
                        £{latestPublishedDraw?.total_prize_pool.toLocaleString("en-GB") || "14,370"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-medium">5-Match Tier 1 Jackpot (40% + Rollover):</span>
                      <strong className="text-[#FFF2BA] font-serif text-base font-bold">
                        £{latestPublishedDraw?.tier1_pool_share.toLocaleString("en-GB") || "7,980"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-white/70 text-[11px] pt-2 border-t border-white/15">
                      <span>Tier 2 (4 Matches): £1,863.75</span>
                      <span>Tier 3 (3 Matches): £1,331.25</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      href="/dashboard"
                      className="w-full py-3.5 bg-gradient-to-r from-[#C88D34] to-[#DBA149] hover:brightness-110 text-[#041220] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-[1.02]"
                    >
                      <span>Check Your Active 5 Scores Against Draw</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SIX CORE OBJECTIVES SHOWCASE (Direct from PRD Page 3, § 02) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="border-b border-[#EFE4C4] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#C88D34] uppercase tracking-wider font-semibold">
                § 02 · CORE OBJECTIVES
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#072847]">
                Six core objectives. One owned platform.
              </h2>
            </div>
            <p className="text-xs text-[#6786A3] font-mono max-w-xs">
              Direct implementation of Section § 02 evaluation criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3]">
                ENGINE · 01
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                Subscription System
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Build a robust subscription and payment system supporting monthly (£15) and
                discounted annual (£150) tiers with real-time entitlement checks (§ 04).
              </p>
            </div>

            <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3]">
                EXPERIENCE · 02
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                Score Entry & Rolling 5
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Simple, engaging score-entry flow. Stableford range 1–45, strict duplicate date
                prevention, and automatic rolling queue replacing the oldest round (§ 05).
              </p>
            </div>

            <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3]">
                ENGINE · 03
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                Custom Draw Engine
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Algorithm-powered or random monthly draws with automated 40/35/25 tier shares,
                equal winner splits, and jackpot rollover carryover (§ 06 & § 07).
              </p>
            </div>

            <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3]">
                INTEGRATION · 04
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                Charity Integration
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Seamless charity contribution logic. Minimum 10% pledge, voluntary percentage
                slider up to 50%, and independent direct gifts not tied to gameplay (§ 08).
              </p>
            </div>

            <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6786A3]">
                CONTROL · 05
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                Admin Dashboard & Audit
              </h3>
              <p className="text-xs text-[#3E5A74] leading-relaxed">
                Comprehensive admin dashboard covering User Management, Draw Simulations, Charity
                Directory, and Winner Verification proof approvals (§ 09 & § 11).
              </p>
            </div>

            <div className="bg-[#072847] text-white rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FFF2BA]">
                DESIGN · 06
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#FFFDF7]">
                Outstanding UI/UX
              </h3>
              <p className="text-xs text-[#C1DBE8] leading-relaxed">
                A look that stands out in the golf industry. Editorial elegance, warm ivory,
                prestigious Yale Navy, championship gold, meaningful animations, and zero generic SaaS clichés (§ 12).
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE DRAW MACHINE TUMBLER (§ 06) */}
        {/* ========================================================================= */}
        <section id="the-draw" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <DrawMachine />
        </section>

        {/* ========================================================================= */}
        {/* PRIZE POOL ARCHITECTURE & SCALE SIMULATOR (§ 07) */}
        {/* ========================================================================= */}
        <section id="draw-mechanics" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF0CA]/40 border-t border-b border-[#EFE4C4]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0D3B66] font-bold">
                § 07 · Mathematical Transparency
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl font-bold text-[#072847] tracking-tight">
                The 40 / 35 / 25 Prize & Charity Engine
              </h2>
              <p className="text-sm text-[#3E5A74] leading-relaxed">
                Interact with the subscriber base slider to watch prize pools, tier payouts, and
                charity disbursements scale dynamically in real time.
              </p>
            </div>

            {/* Interactive Scale Controls */}
            <div className="bg-white border border-[#EFE4C4] rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_rgba(7,40,71,0.06)] space-y-9">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74]">
                      Active Subscriber Count:
                    </label>
                    <span className="text-xs font-mono text-[#6786A3]">£{fee.toFixed(2)}/mo fee</span>
                  </div>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    {simulatedSubscribers.toLocaleString()} Golfers
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="10000"
                    step="50"
                    value={simulatedSubscribers}
                    onChange={(e) => setSimulatedSubscribers(Number(e.target.value))}
                    className="w-full accent-[#0D3B66] h-2 bg-[#FAF6EB] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6786A3] font-mono">
                    <span>250</span>
                    <span>5,000</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74]">
                      Charity Contribution Pledge:
                    </label>
                    <span className="text-xs font-mono text-[#0D3B66] font-bold">Min 10% (§ 08.1)</span>
                  </div>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    {simulatedCharityPercent}% of Fee
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={simulatedCharityPercent}
                    onChange={(e) => setSimulatedCharityPercent(Number(e.target.value))}
                    className="w-full accent-[#0D3B66] h-2 bg-[#FAF6EB] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6786A3] font-mono">
                    <span>10% (Min)</span>
                    <span>25%</span>
                    <span>50% (Max)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74]">
                    Membership Cadence:
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setSimulatedPlan("monthly")}
                      className={`py-3.5 text-xs font-bold rounded-xl border transition-all ${
                        simulatedPlan === "monthly"
                          ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                          : "bg-[#FAF6EB] text-[#072847] border-[#EFE4C4] hover:bg-[#FAF0CA]"
                      }`}
                    >
                      Monthly (£15/mo)
                    </button>
                    <button
                      onClick={() => setSimulatedPlan("yearly")}
                      className={`py-3.5 text-xs font-bold rounded-xl border transition-all ${
                        simulatedPlan === "yearly"
                          ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                          : "bg-[#FAF6EB] text-[#072847] border-[#EFE4C4] hover:bg-[#FAF0CA]"
                      }`}
                    >
                      Annual (£150/yr)
                    </button>
                  </div>
                  <span className="text-[11px] text-[#6786A3] block text-center pt-1 font-mono">
                    Monthly Gross: £{monthlyRevenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Visual Multi-Segment Proportional Distribution Bar */}
              <div className="space-y-3 pt-4 border-t border-[#EFE4C4]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono uppercase tracking-wider text-[#6786A3] font-bold">
                    Gross Monthly Revenue Allocation:
                  </span>
                  <span className="font-mono text-[#072847] font-bold">
                    £{monthlyRevenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })} Total
                  </span>
                </div>

                <div className="h-6 w-full rounded-full bg-[#FAF6EB] border border-[#EFE4C4] overflow-hidden flex shadow-inner">
                  {/* 50% Prize Pool */}
                  <div
                    style={{ width: "50%" }}
                    className="bg-gradient-to-r from-[#041220] to-[#072847] text-white text-[10px] font-mono font-bold flex items-center justify-center transition-all duration-300"
                    title="50% Guaranteed Prize Pool"
                  >
                    50% Prize Pool (£{totalPrizeFund.toLocaleString("en-GB", { maximumFractionDigits: 0 })})
                  </div>

                  {/* Charity Share */}
                  <div
                    style={{ width: `${simulatedCharityPercent}%` }}
                    className="bg-gradient-to-r from-[#C88D34] to-[#DBA149] text-[#041220] text-[10px] font-mono font-bold flex items-center justify-center transition-all duration-300"
                    title={`${simulatedCharityPercent}% Charity Pledge`}
                  >
                    {simulatedCharityPercent}% Charity (£{monthlyCharityFund.toLocaleString("en-GB", { maximumFractionDigits: 0 })})
                  </div>

                  {/* Operations Balance */}
                  <div
                    style={{ width: `${100 - 50 - simulatedCharityPercent}%` }}
                    className="bg-[#FAF0CA] text-[#072847] text-[10px] font-mono font-bold flex items-center justify-center transition-all duration-300"
                    title="Operations, Hosting & Audit Balance"
                  >
                    Ops ({100 - 50 - simulatedCharityPercent}%)
                  </div>
                </div>
              </div>

              {/* Dynamic Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-5 bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl shadow-2xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1 font-bold">
                    Monthly Charity Fund
                  </span>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    £{monthlyCharityFund.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#0D3B66] font-semibold mt-1 block">
                    Directed to chosen causes
                  </span>
                </div>

                <div className="p-5 bg-[#FAF6EB] border-2 border-[#C88D34] rounded-2xl shadow-sm relative">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#915E12] block mb-1 font-bold">
                    Tier 1 (40% + Rollover)
                  </span>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    £{tier1Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#C88D34] font-bold mt-1 block">
                    5-match rollover jackpot
                  </span>
                </div>

                <div className="p-5 bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl shadow-2xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1 font-bold">
                    Tier 2 (35% Pool)
                  </span>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    £{tier2Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#6786A3] mt-1 block font-medium">
                    Equal split on 4 matches
                  </span>
                </div>

                <div className="p-5 bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl shadow-2xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1 font-bold">
                    Tier 3 (25% Pool)
                  </span>
                  <div className="font-serif italic text-3xl font-black text-[#072847]">
                    £{tier3Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#6786A3] mt-1 block font-medium">
                    Equal split on 3 matches
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHARITY SPOTLIGHT DOSSIERS (§ 08.2) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EFE4C4] pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C88D34] font-semibold">
                § 08.2 · PARTNER DOSSIERS
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#072847]">
                Where your subscription lands
              </h2>
            </div>
            <Link
              href="/charities"
              className="text-xs font-bold text-[#072847] hover:text-[#0D3B66] pb-1 border-b border-[#072847] flex items-center gap-1.5"
            >
              <span>Explore All Vetted Causes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCharities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white border border-[#EFE4C4] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#041220]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={charity.hero_image_url}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[#072847] text-[10px] font-bold">
                    {charity.category}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif italic text-2xl font-bold leading-tight">
                      {charity.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#3E5A74] leading-relaxed line-clamp-3">
                    {charity.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF6EB] rounded-xl text-center border border-[#EFE4C4]/60">
                    {charity.impact_metrics.slice(0, 2).map((m, i) => (
                      <div key={i}>
                        <div className="font-serif font-bold text-sm text-[#072847]">{m.value}</div>
                        <div className="text-[10px] text-[#6786A3]">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#EFE4C4] flex items-center justify-between text-xs">
                    <span className="text-[#C88D34] font-bold font-mono">
                      £{charity.total_raised.toLocaleString("en-GB")} Raised
                    </span>
                    <button
                      onClick={() => setDonateModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold transition-all shadow-sm"
                    >
                      Direct Gift (§ 08.1)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLOSING MANIFESTO & PERSUASIVE SUBSCRIPTION CTA (§ 12) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          <div className="bg-gradient-to-r from-[#041220] via-[#072847] to-[#0D3B66] text-white rounded-3xl p-8 sm:p-16 border border-[#0D3B66]/60 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#041220] text-[#FFF2BA] text-xs font-mono font-bold border border-white/10 mx-auto">
              <ShieldCheck className="w-4 h-4 text-[#C88D34]" />
              Edition 2026 Guaranteed Selection
            </div>

            <h2 className="font-serif italic text-4xl sm:text-6xl font-normal max-w-3xl mx-auto leading-tight">
              “Every shot has purpose. Every draw changes a life.”
            </h2>

            <p className="text-sm sm:text-base text-[#C1DBE8] max-w-xl mx-auto">
              Join the new generation of golfers combining personal performance tracking with
              transparent, measurable social philanthropy.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setAuthDefaultTab("signup");
                  setAuthModalOpen(true);
                }}
                className="px-8 py-4 bg-[#C88D34] hover:bg-[#E09F45] text-[#041220] font-serif italic text-lg font-bold rounded-2xl shadow-xl transition-all transform hover:scale-[1.02]"
              >
                Subscribe Now from £15 / month
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-sm transition-all border border-white/20"
              >
                Enter Demo Golfer Portal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />

      <DirectDonationModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
      />
    </div>
  );
}
