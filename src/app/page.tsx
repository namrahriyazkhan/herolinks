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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#121F1A]">
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
        <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[#E8DEC0]/80">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Magazine Edition Header Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#E8DEC0] pb-3 text-xs font-mono text-[#748780] gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0D261E]">§ 00 · DIGITAL HEROES</span>
                <span>•</span>
                <span>LEVEL 1 SPECIFICATION</span>
                <span>•</span>
                <span className="text-[#C88D34] font-semibold">EDITION 2026</span>
              </div>
              <div className="flex items-center gap-4">
                <span>DIGITALHEROES.CO.IN</span>
                <span className="hidden sm:inline">VERSION 1.0</span>
              </div>
            </div>

            {/* Hero Main Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#143A2F]/10 border border-[#143A2F]/20 text-[#143A2F] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C88D34] animate-pulse"></span>
                  <span>March Major Charity Draw Open · Closes in 4 Days</span>
                </div>

                <h1 className="font-serif italic text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#0D261E] leading-[1.02]">
                  Your swing. <br />
                  <span className="font-sans font-black not-italic text-[#143A2F]">
                    Their future.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-[#485953] max-w-xl font-normal leading-relaxed">
                  A golf performance and charity draw platform uniting golfers through monthly
                  lottery-style prize pools, rolling Stableford scores, and direct community giving.
                </p>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setAuthDefaultTab("signup");
                      setAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Subscribe & Nominate Cause</span>
                    <ArrowRight className="w-4 h-4 text-[#E8C28A]" />
                  </button>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-[#F3ECE2] text-[#0D261E] font-semibold rounded-2xl text-base border border-[#E8DEC0] shadow-sm transition-all"
                  >
                    <Trophy className="w-4 h-4 text-[#C88D34]" />
                    <span>Golfer Portal (§ 10)</span>
                  </Link>
                </div>

                {/* Live Impact Counters (§ 11.05) */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8DEC0]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#748780] block">
                      Charity Raised
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-bold text-[#143A2F]">
                      £{stats.total_raised_charity.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#2E6E59] font-medium">100% verified</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#748780] block">
                      Active Jackpot
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-bold text-[#C88D34]">
                      £{activeJackpot.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#C88D34] font-medium">+ Rollover in Tier 1</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#748780] block">
                      Active Golfers
                    </span>
                    <div className="font-serif italic text-2xl sm:text-4xl font-bold text-[#0D261E]">
                      {stats.active_subscribers.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#748780]">5 scores logged</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Mascot Homage & Ticket Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#0D261E] text-white rounded-3xl p-8 border border-[#143A2F] shadow-2xl relative overflow-hidden space-y-6">
                  {/* Decorative gold background circle */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C88D34]/15 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      {/* Mascot Icon */}
                      <div className="w-10 h-10 rounded-xl bg-[#143A2F] border border-[#C88D34]/40 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#E8C28A]" />
                      </div>
                      <div>
                        <div className="font-serif italic font-bold text-lg text-[#FAF7F2]">
                          Digital Heroes
                        </div>
                        <div className="text-[10px] font-mono text-[#E8C28A]">
                          SAMPLE ASSIGNMENT · 2026
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/50 border border-white/10 px-2 py-0.5 rounded">
                      01 / 14
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E8C28A]">
                      Published Winning Combination:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {(latestPublishedDraw?.winning_numbers || [29, 34, 36, 38, 41]).map((num) => (
                        <div
                          key={num}
                          className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#0D261E] flex items-center justify-center font-serif text-xl font-black shadow-md border-2 border-[#C88D34]"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#143A2F] border border-[#215444] space-y-2 text-xs">
                    <div className="flex justify-between items-center text-white/80">
                      <span>March Major Prize Pool:</span>
                      <strong className="text-white font-serif text-sm">
                        £{latestPublishedDraw?.total_prize_pool.toLocaleString("en-GB") || "14,370"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span>5-Match Tier 1 Jackpot:</span>
                      <strong className="text-[#E8C28A] font-serif text-sm">
                        £{latestPublishedDraw?.tier1_pool_share.toLocaleString("en-GB") || "7,980"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-white/60 text-[11px] pt-1 border-t border-white/10">
                      <span>4-Match Payout: £1,863.75</span>
                      <span>3-Match Payout: £1,331.25</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="w-full py-3 bg-[#C88D34] hover:bg-[#E09F45] text-[#071712] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Check Your Active 5 Scores</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="border-b border-[#E8DEC0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#C88D34] uppercase tracking-wider font-semibold">
                § 02 · CORE OBJECTIVES
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#0D261E]">
                Six core objectives. One owned platform.
              </h2>
            </div>
            <p className="text-xs text-[#748780] font-mono max-w-xs">
              Direct implementation of Section § 02 evaluation criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#748780]">
                ENGINE · 01
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Subscription System
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Build a robust subscription and payment system supporting monthly (£15) and
                discounted annual (£150) tiers with real-time entitlement checks (§ 04).
              </p>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#748780]">
                EXPERIENCE · 02
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Score Entry & Rolling 5
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Simple, engaging score-entry flow. Stableford range 1–45, strict duplicate date
                prevention, and automatic rolling queue replacing the oldest round (§ 05).
              </p>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#748780]">
                ENGINE · 03
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Custom Draw Engine
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Algorithm-powered or random monthly draws with automated 40/35/25 tier shares,
                equal winner splits, and jackpot rollover carryover (§ 06 & § 07).
              </p>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#748780]">
                INTEGRATION · 04
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Charity Integration
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Seamless charity contribution logic. Minimum 10% pledge, voluntary percentage
                slider up to 50%, and independent direct gifts not tied to gameplay (§ 08).
              </p>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#748780]">
                CONTROL · 05
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Admin Dashboard & Audit
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Comprehensive admin dashboard covering User Management, Draw Simulations, Charity
                Directory, and Winner Verification proof approvals (§ 09 & § 11).
              </p>
            </div>

            <div className="bg-[#0D261E] text-white rounded-2xl p-6 shadow-sm space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#E8C28A]">
                DESIGN · 06
              </div>
              <h3 className="font-serif italic text-2xl font-bold text-[#FAF7F2]">
                Outstanding UI/UX
              </h3>
              <p className="text-xs text-[#BDE3D5]/80 leading-relaxed">
                A look that stands out in the golf industry. Editorial elegance, warm ivory,
                heritage green, meaningful animations, and zero generic SaaS clichés (§ 12).
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE DRAW MACHINE TUMBLER (§ 06) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <DrawMachine />
        </section>

        {/* ========================================================================= */}
        {/* PRIZE POOL ARCHITECTURE & SCALE SIMULATOR (§ 07) */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F3ECE2] border-t border-b border-[#E8DEC0]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C88D34] font-semibold">
                § 07 · Mathematical Transparency
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#0D261E]">
                The 40 / 35 / 25 Prize & Charity Calculator
              </h2>
              <p className="text-sm text-[#485953]">
                Interact with the subscriber base slider to watch prize pools, tier payouts, and
                charity disbursements scale dynamically.
              </p>
            </div>

            {/* Interactive Scale Controls */}
            <div className="bg-white border border-[#E8DEC0] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#485953] mb-2">
                    Active Subscriber Count:
                  </label>
                  <div className="font-serif text-3xl font-bold text-[#0D261E] mb-2">
                    {simulatedSubscribers.toLocaleString()} Golfers
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="10000"
                    step="50"
                    value={simulatedSubscribers}
                    onChange={(e) => setSimulatedSubscribers(Number(e.target.value))}
                    className="w-full accent-[#143A2F]"
                  />
                  <div className="flex justify-between text-[10px] text-[#748780] mt-1 font-mono">
                    <span>250</span>
                    <span>5,000</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#485953] mb-2">
                    Charity Contribution Pledge:
                  </label>
                  <div className="font-serif text-3xl font-bold text-[#143A2F] mb-2">
                    {simulatedCharityPercent}% of Fee
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={simulatedCharityPercent}
                    onChange={(e) => setSimulatedCharityPercent(Number(e.target.value))}
                    className="w-full accent-[#143A2F]"
                  />
                  <div className="flex justify-between text-[10px] text-[#748780] mt-1 font-mono">
                    <span>10% (Min)</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#485953] mb-2">
                    Membership Plan:
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setSimulatedPlan("monthly")}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        simulatedPlan === "monthly"
                          ? "bg-[#143A2F] text-white border-[#0D261E]"
                          : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                      }`}
                    >
                      Monthly (£15)
                    </button>
                    <button
                      onClick={() => setSimulatedPlan("yearly")}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        simulatedPlan === "yearly"
                          ? "bg-[#143A2F] text-white border-[#0D261E]"
                          : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                      }`}
                    >
                      Annual (£150)
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-[#E8DEC0]">
                <div className="p-4 bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#748780] block mb-1">
                    Monthly Charity Fund
                  </span>
                  <div className="font-serif italic text-2xl sm:text-3xl font-black text-[#143A2F]">
                    £{monthlyCharityFund.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#2E6E59] font-medium">To vetted causes</span>
                </div>

                <div className="p-4 bg-[#FAF7F2] border-2 border-[#C88D34] rounded-2xl relative">
                  <span className="text-[10px] font-mono uppercase text-[#915E12] block mb-1">
                    Tier 1 (40% + Rollover)
                  </span>
                  <div className="font-serif italic text-2xl sm:text-3xl font-black text-[#0D261E]">
                    £{tier1Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#C88D34] font-bold">5-match jackpot</span>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#748780] block mb-1">
                    Tier 2 (35% Pool)
                  </span>
                  <div className="font-serif italic text-2xl sm:text-3xl font-black text-[#0D261E]">
                    £{tier2Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#748780]">4-match winners</span>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#748780] block mb-1">
                    Tier 3 (25% Pool)
                  </span>
                  <div className="font-serif italic text-2xl sm:text-3xl font-black text-[#0D261E]">
                    £{tier3Total.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] text-[#748780]">3-match winners</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHARITY SPOTLIGHT DOSSIERS (§ 08.2) */}
        {/* ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8DEC0] pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C88D34] font-semibold">
                § 08.2 · PARTNER DOSSIERS
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#0D261E]">
                Where your subscription lands
              </h2>
            </div>
            <Link
              href="/charities"
              className="text-xs font-bold text-[#143A2F] hover:text-[#0D261E] pb-1 border-b border-[#143A2F] flex items-center gap-1.5"
            >
              <span>Explore All Vetted Causes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCharities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white border border-[#E8DEC0] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#0D261E]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={charity.hero_image_url}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[#0D261E] text-[10px] font-bold">
                    {charity.category}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif italic text-2xl font-bold leading-tight">
                      {charity.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#485953] leading-relaxed line-clamp-3">
                    {charity.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF7F2] rounded-xl text-center border border-[#E8DEC0]/60">
                    {charity.impact_metrics.slice(0, 2).map((m, i) => (
                      <div key={i}>
                        <div className="font-serif font-bold text-sm text-[#0D261E]">{m.value}</div>
                        <div className="text-[10px] text-[#748780]">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E8DEC0] flex items-center justify-between text-xs">
                    <span className="text-[#C88D34] font-bold font-mono">
                      £{charity.total_raised.toLocaleString("en-GB")} Raised
                    </span>
                    <button
                      onClick={() => setDonateModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold transition-all shadow-sm"
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
          <div className="bg-[#0D261E] text-white rounded-3xl p-8 sm:p-16 border border-[#143A2F] shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143A2F] text-[#E8C28A] text-xs font-mono font-bold border border-white/10 mx-auto">
              <ShieldCheck className="w-4 h-4 text-[#C88D34]" />
              Edition 2026 Guaranteed Selection
            </div>

            <h2 className="font-serif italic text-4xl sm:text-6xl font-normal max-w-3xl mx-auto leading-tight">
              “Every shot has purpose. Every draw changes a life.”
            </h2>

            <p className="text-sm sm:text-base text-[#BDE3D5]/80 max-w-xl mx-auto">
              Join the new generation of golfers combining personal performance tracking with
              transparent, measurable social philanthropy.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setAuthDefaultTab("signup");
                  setAuthModalOpen(true);
                }}
                className="px-8 py-4 bg-[#C88D34] hover:bg-[#E09F45] text-[#071712] font-serif italic text-lg font-bold rounded-2xl shadow-xl transition-all transform hover:scale-[1.02]"
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
