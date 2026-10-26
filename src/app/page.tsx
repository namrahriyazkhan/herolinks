"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/lib/store/app-context";
import { AuthModal } from "@/components/modals/AuthModal";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";
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
} from "lucide-react";

export default function HomePage() {
  const { stats, charities, activeJackpot, latestPublishedDraw } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("signup");
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  // Interactive Calculator State
  const [calcTier, setCalcTier] = useState<"monthly" | "yearly">("monthly");
  const [calcCharityPercent, setCalcCharityPercent] = useState<number>(20);

  const calculatedMonthlyFee = calcTier === "yearly" ? 12.5 : 15.0;
  const calculatedCharityAnnual = (calculatedMonthlyFee * (calcCharityPercent / 100) * 12).toFixed(2);
  const calculatedPrizeAnnual = (calculatedMonthlyFee * 0.5 * 12).toFixed(2);

  const featuredCharities = charities.filter((c) => c.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar
        onOpenAuth={(tab) => {
          setAuthDefaultTab(tab);
          setAuthModalOpen(true);
        }}
        onOpenDonate={() => setDonateModalOpen(true)}
      />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION: Editorial High-Concept Narrative (§ 10 & § 12) */}
        {/* ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-[#E8DEC0]/80">
          <div className="max-w-7xl mx-auto">
            {/* Top metadata badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143A2F]/10 text-[#143A2F] text-xs font-semibold tracking-wide border border-[#143A2F]/20">
                <span className="w-2 h-2 rounded-full bg-[#C88D34] animate-pulse"></span>
                The 2026 Golf Charity Initiative
              </span>
              <span className="text-xs text-[#748780] font-mono">
                PRD Edition 2026 · digitalheroes.co.in
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Provocative Editorial Manifesto */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="font-serif italic text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#0D261E] leading-[1.08]">
                  Your swing. <br />
                  <span className="font-sans font-black not-italic text-[#143A2F]">
                    Their future.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-[#485953] max-w-xl font-normal leading-relaxed">
                  A modern golf performance platform transforming your regular Stableford
                  scores into monthly transparent prize draws while funding vetted youth, medical,
                  and environmental charities.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setAuthDefaultTab("signup");
                      setAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-7 py-4 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-2xl text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Subscribe & Nominate Cause</span>
                    <ArrowRight className="w-4 h-4 text-[#E8C28A]" />
                  </button>

                  <Link
                    href="/charities"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-[#F3ECE2] text-[#0D261E] font-semibold rounded-2xl text-base border border-[#E8DEC0] shadow-sm transition-all"
                  >
                    <Heart className="w-4 h-4 text-[#C88D34]" />
                    <span>Explore Vetted Charities</span>
                  </Link>
                </div>

                {/* Live Platform Proof Counters (§ 11.05) */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DEC0]/80">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#748780] block">
                      Charity Impact
                    </span>
                    <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#143A2F]">
                      £{stats.total_raised_charity.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#2E6E59] font-medium">100% audited pass-through</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#748780] block">
                      Active Jackpot
                    </span>
                    <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#C88D34]">
                      £{activeJackpot.toLocaleString("en-GB")}
                    </div>
                    <span className="text-[11px] text-[#C88D34] font-medium">5-match rollover ready</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#748780] block">
                      Active Golfers
                    </span>
                    <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#0D261E]">
                      {stats.active_subscribers.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#748780]">Submitting 5 scores</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC0] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#C88D34] text-[#0D261E] font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    PRD § 06 & § 07 Active
                  </div>

                  <span className="text-xs font-mono uppercase tracking-wider text-[#748780] block mb-2 font-semibold">
                    March Major Draw Spotlight
                  </span>

                  <h3 className="font-serif italic text-2xl font-bold text-[#0D261E] mb-4">
                    {latestPublishedDraw?.title || "Spring Equinox Draw"}
                  </h3>

                  {/* Lottery Balls Display */}
                  <div className="flex gap-2.5 my-4">
                    {(latestPublishedDraw?.winning_numbers || [29, 34, 36, 38, 41]).map((num) => (
                      <div
                        key={num}
                        className="w-12 h-12 rounded-full bg-[#143A2F] text-white flex items-center justify-center font-serif text-xl font-black shadow-md border border-[#C88D34]"
                      >
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Pool breakdown summary */}
                  <div className="space-y-2.5 pt-4 border-t border-[#E8DEC0] text-xs">
                    <div className="flex justify-between items-center text-[#485953]">
                      <span>40% Tier 1 (5-Match):</span>
                      <strong className="text-[#0D261E] font-serif text-sm">
                        £{latestPublishedDraw?.tier1_pool_share.toLocaleString("en-GB") || "7,980"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[#485953]">
                      <span>35% Tier 2 (4-Match):</span>
                      <strong className="text-[#0D261E] font-serif text-sm">
                        £{latestPublishedDraw?.tier2_pool_share.toLocaleString("en-GB") || "3,727"}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[#485953]">
                      <span>25% Tier 3 (3-Match):</span>
                      <strong className="text-[#0D261E] font-serif text-sm">
                        £{latestPublishedDraw?.tier3_pool_share.toLocaleString("en-GB") || "2,662"}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8DEC0]">
                    <Link
                      href="/dashboard"
                      className="w-full py-3 bg-[#FAF7F2] hover:bg-[#F3ECE2] text-[#143A2F] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-[#E8DEC0] transition-colors"
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
        {/* HOW IT WORKS: 4-Step Narrative Flow (§ 01.1 & § 02) */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C88D34] font-semibold">
              § 01.1 · The Mechanics
            </span>
            <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-[#0D261E]">
              Simple to play. Profound in impact.
            </h2>
            <p className="text-sm sm:text-base text-[#485953]">
              Four clear steps unite every swing with measurable social progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#143A2F]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#143A2F] text-white flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#0D261E]">
                Subscribe & Nominate
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Join on a monthly or discounted annual plan. Choose which certified cause receives
                at least 10% (up to 50%) of your membership fee.
              </p>
              <div className="text-[11px] font-mono text-[#C88D34]">PRD § 04 & § 08.1</div>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#143A2F]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#143A2F] text-white flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#0D261E]">
                Log Rolling 5 Scores
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Input your latest Stableford points (range 1–45) with competition dates. Our rolling
                queue automatically maintains your five most recent rounds.
              </p>
              <div className="text-[11px] font-mono text-[#C88D34]">PRD § 05 Rolling Logic</div>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#143A2F]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#143A2F] text-white flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#0D261E]">
                The Monthly Draw
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                5 numbers are drawn monthly using certified algorithmic or random logic. Match 3, 4,
                or 5 numbers to share the 25%, 35%, or 40% prize pool tiers.
              </p>
              <div className="text-[11px] font-mono text-[#C88D34]">PRD § 06 & § 07 Distribution</div>
            </div>

            <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#143A2F]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#143A2F] text-white flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#0D261E]">
                Verify & Disburse
              </h3>
              <p className="text-xs text-[#485953] leading-relaxed">
                Winners upload scorecard proof from HowDidiDo, GHIN, or club software. Audited
                payouts are sent directly while partner charities receive their funds.
              </p>
              <div className="text-[11px] font-mono text-[#C88D34]">PRD § 09 Winner Verification</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PRIZE POOL ARCHITECTURE & ROLLOVER EXPLANATION (§ 07) */}
        {/* ========================================================================= */}
        <section id="draw-mechanics" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D261E] text-white">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E8C28A]">
                  § 07 · Strict Mathematical Logic
                </span>
                <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-[#FAF7F2]">
                  The 40 / 35 / 25 Prize Architecture
                </h2>
                <p className="text-sm text-[#BDE3D5]/80 max-w-xl">
                  Enforced automatically. A fixed 50% share of every subscription fee directly
                  funds the monthly prize pool, complemented by rollover accumulation.
                </p>
              </div>

              <div className="bg-[#143A2F] border border-[#215444] rounded-2xl p-4 text-xs font-mono text-white/90">
                Rollover Guarantee: Unclaimed Tier 1 Jackpots Carry Forward
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="bg-[#143A2F]/90 border border-[#C88D34] rounded-2xl p-8 space-y-4 relative">
                <div className="text-xs font-mono uppercase tracking-wider text-[#E8C28A]">
                  Tier 01 · 5-Number Match
                </div>
                <div className="font-serif italic text-4xl sm:text-5xl font-bold text-[#FAF7F2]">
                  40%
                </div>
                <div className="text-sm text-[#E8C28A] font-semibold">
                  + Rollover Jackpot Accumulation
                </div>
                <p className="text-xs text-[#BDE3D5]/80 leading-relaxed">
                  If no subscriber matches all 5 numbers in a given month, this entire 40% pool
                  carries forward into next month’s major jackpot.
                </p>
              </div>

              {/* Tier 2 */}
              <div className="bg-[#143A2F]/90 border border-[#215444] rounded-2xl p-8 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#BDE3D5]">
                  Tier 02 · 4-Number Match
                </div>
                <div className="font-serif italic text-4xl sm:text-5xl font-bold text-[#FAF7F2]">
                  35%
                </div>
                <div className="text-sm text-white/70 font-semibold">
                  Split equally among all 4-match winners
                </div>
                <p className="text-xs text-[#BDE3D5]/80 leading-relaxed">
                  Consistently rewards sharp play. Disbursed equally to every golfer matching
                  four of the five drawn Stableford numbers.
                </p>
              </div>

              {/* Tier 3 */}
              <div className="bg-[#143A2F]/90 border border-[#215444] rounded-2xl p-8 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#BDE3D5]">
                  Tier 03 · 3-Number Match
                </div>
                <div className="font-serif italic text-4xl sm:text-5xl font-bold text-[#FAF7F2]">
                  25%
                </div>
                <div className="text-sm text-white/70 font-semibold">
                  Broad community distribution
                </div>
                <p className="text-xs text-[#BDE3D5]/80 leading-relaxed">
                  Accessible odds ensuring a wide segment of subscribers receive winnings every
                  monthly cadence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHARITY SPOTLIGHT (§ 08.2 Homepage Spotlight) */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C88D34] font-semibold">
                § 08.2 · Homepage Charity Spotlight
              </span>
              <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-[#0D261E]">
                Featured Partner Causes
              </h2>
              <p className="text-sm text-[#485953] max-w-xl">
                Every subscription actively powers youth access, medical rehabilitation, and
                environmental links preservation.
              </p>
            </div>

            <Link
              href="/charities"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#143A2F] hover:text-[#0D261E] pb-1 border-b border-[#143A2F]"
            >
              <span>View Full Directory of Causes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCharities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white border border-[#E8DEC0] rounded-2xl overflow-hidden shadow-sm flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#0D261E]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={charity.hero_image_url}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[#0D261E] text-[10px] font-bold">
                    {charity.category}
                  </span>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-serif italic text-xl font-bold leading-tight">
                      {charity.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#485953] leading-relaxed line-clamp-3">
                    {charity.description}
                  </p>

                  <div className="pt-2 border-t border-[#E8DEC0] flex items-center justify-between text-xs">
                    <span className="text-[#C88D34] font-bold">
                      £{charity.total_raised.toLocaleString("en-GB")} Raised
                    </span>
                    <button
                      onClick={() => setDonateModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3ECE2] text-[#143A2F] font-semibold border border-[#E8DEC0]"
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
        {/* INTERACTIVE SUBSCRIPTION & CHARITY CALCULATOR */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3ECE2] border-t border-b border-[#E8DEC0]">
          <div className="max-w-4xl mx-auto bg-white border border-[#E8DEC0] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                Transparent Subscription Calculator
              </span>
              <h2 className="font-serif italic text-3xl font-bold text-[#0D261E]">
                See Where Every Pound Goes
              </h2>
              <p className="text-xs text-[#748780] max-w-md mx-auto">
                No hidden cuts. 50% directly empowers the prize pool, while you dictate your charity contribution percentage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {/* Plan Toggle */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-2">
                    Select Plan Cadence
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCalcTier("monthly")}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        calcTier === "monthly"
                          ? "bg-[#143A2F] text-white border-[#0D261E]"
                          : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                      }`}
                    >
                      Monthly (£15 / mo)
                    </button>
                    <button
                      onClick={() => setCalcTier("yearly")}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                        calcTier === "yearly"
                          ? "bg-[#143A2F] text-white border-[#0D261E]"
                          : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                      }`}
                    >
                      Yearly (£150 / yr)
                    </button>
                  </div>
                </div>

                {/* Charity Percentage Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#485953]">
                      Your Charity Pledge
                    </label>
                    <span className="font-serif text-lg font-bold text-[#143A2F]">
                      {calcCharityPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={calcCharityPercent}
                    onChange={(e) => setCalcCharityPercent(Number(e.target.value))}
                    className="w-full accent-[#143A2F]"
                  />
                  <div className="flex justify-between text-[10px] text-[#748780] mt-1">
                    <span>10% (PRD Minimum)</span>
                    <span>50% (Hero Pledge)</span>
                  </div>
                </div>
              </div>

              {/* Calculated Breakdown Card */}
              <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#748780] block">
                  Annual Impact Breakdown:
                </span>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#485953]">To Your Nominated Charity:</span>
                    <strong className="font-serif text-xl text-[#143A2F]">
                      £{calculatedCharityAnnual} / yr
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#485953]">To Draw Prize Pools:</span>
                    <strong className="font-serif text-xl text-[#C88D34]">
                      £{calculatedPrizeAnnual} / yr
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#748780] pt-2 border-t border-[#E8DEC0]">
                    <span>Eligible Monthly Draws:</span>
                    <span className="font-bold text-[#0D261E]">12 Major Draws</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAuthDefaultTab("signup");
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-3 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-xl text-xs transition-all shadow-md mt-4"
                >
                  Join with This Allocation
                </button>
              </div>
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
