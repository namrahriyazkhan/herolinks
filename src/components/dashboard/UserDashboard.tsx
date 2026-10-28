"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/app-context";
import { ScoreManager } from "@/components/scores/ScoreManager";
import { DrawBoard } from "@/components/draw/DrawBoard";
import { ProofUploadModal } from "@/components/modals/ProofUploadModal";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";
import {
  User,
  Heart,
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";

export function UserDashboard() {
  const {
    currentUser,
    charities,
    updateSubscriptionSettings,
    reactivateSubscription,
    userScores,
    latestPublishedDraw,
    userVerifications,
    draws,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "scores" | "draws" | "giving" | "winnings"
  >("scores");
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [proofModalEntry, setProofModalEntry] = useState<{
    drawEntryId: string;
    drawId: string;
    drawTitle: string;
    prizeAmount: number;
    tier: 1 | 2 | 3;
    matchesCount: number;
    matchingNumbers: number[];
  } | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#072847] text-white flex items-center justify-center mx-auto shadow-lg">
          <User className="w-8 h-8 text-[#FFF2BA]" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#C88D34] uppercase tracking-wider font-semibold">
            § 03 · SUBSCRIBER PORTAL
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#072847]">
            Sign In to Access Your Portal
          </h2>
          <p className="text-sm text-[#3E5A74] leading-relaxed">
            Please sign in to manage your Stableford rounds, active draw tickets, and nominated charity allocations.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-3 bg-[#072847] text-white rounded-xl text-sm font-semibold hover:bg-[#0D3B66] transition-all shadow-md"
          >
            Sign In to Account
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-white border border-[#EFE4C4] text-[#072847] rounded-xl text-sm font-semibold hover:bg-[#FAF0CA] transition-all shadow-sm"
          >
            Subscribe & Join (§ 04)
          </Link>
        </div>
      </div>
    );
  }

  const selectedCharity =
    charities.find((c) => c.id === currentUser.charity_id) || charities[0];

  // Calculate user total winnings
  const totalWon = userVerifications.reduce((sum, v) => sum + v.prize_amount, 0);

  // Calculate user estimated charity impact: (subscription fee * percentage * 3 months)
  const monthlyFee = currentUser.subscription_tier === "yearly" ? 12.5 : 15.0;
  const userCharityTotal = Math.round(
    monthlyFee * (currentUser.charity_percentage / 100) * 3
  );

  return (
    <div className="space-y-8">
      {/* Top Profile & Subscription Hero Card - Luxury Club Member Pass (§ 10) */}
      <div className="relative bg-gradient-to-br from-[#041220] via-[#072847] to-[#0D3B66] text-white border-2 border-[#C88D34]/50 rounded-3xl p-6 sm:p-9 shadow-[0_16px_40px_rgba(7,40,71,0.15)] overflow-hidden">
        {/* Subtle gold decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C88D34]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
          {/* User Bio */}
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#041220] text-[#FFF2BA] flex items-center justify-center font-serif italic text-3xl font-black border-2 border-[#C88D34] shadow-xl shrink-0">
              {currentUser.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif italic text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {currentUser.full_name}
                </h1>
                <span className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                  currentUser.subscription_status === "active"
                    ? "bg-[#FFF2BA]/20 text-[#FFF2BA] border-[#FFF2BA]/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}>
                  ● {currentUser.subscription_status}
                </span>
              </div>
              <div className="text-xs text-white/75 flex flex-wrap items-center gap-3 pt-0.5">
                <span className="text-[#FFF2BA] font-semibold">{currentUser.home_club || "Royal St George's"}</span>
                <span className="text-white/30">•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white">
                  WHS Index: {currentUser.handicap || "11.4"}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[#C1DBE8] font-mono">{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Subscription Summary Badge (§ 04 & § 10) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center gap-6 shadow-md">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFF2BA] block font-bold">
                Subscription Plan
              </span>
              <div className="font-serif italic font-bold text-xl text-white capitalize mt-0.5">
                {currentUser.subscription_tier} Tier (£
                {currentUser.subscription_tier === "yearly" ? "150/yr" : "15/mo"})
              </div>
              <span className="text-[11px] text-[#C1DBE8] font-medium flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#FFF2BA]" />
                Renews:{" "}
                {currentUser.subscription_renews_at
                  ? new Date(currentUser.subscription_renews_at).toLocaleDateString("en-GB")
                  : "Next billing cycle"}
              </span>
            </div>

            <div className="pl-6 border-l border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFF2BA] block font-bold">
                Pledged Charity
              </span>
              <div className="font-serif italic font-bold text-lg text-white truncate max-w-[150px] mt-0.5">
                {selectedCharity?.name}
              </div>
              <span className="text-[11px] text-[#FFF2BA] font-bold font-mono">
                {currentUser.charity_percentage}% of fee pledged
              </span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-[#041220]/80 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFF2BA] block mb-1 font-bold">
              Stableford Queue
            </span>
            <div className="font-serif italic text-3xl font-black text-white">
              {userScores.length} <span className="text-lg text-white/50 font-normal">/ 5</span>
            </div>
            <span className="text-[11px] text-[#C1DBE8] font-medium mt-1 block">
              {userScores.length === 5 ? "✓ Draw Qualified" : "Log 5 to enter"}
            </span>
          </div>

          <div className="bg-[#041220]/80 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFF2BA] block mb-1 font-bold">
              Draws Participated
            </span>
            <div className="font-serif italic text-3xl font-black text-white">
              {draws.filter((d) => d.status === "published").length}
            </div>
            <span className="text-[11px] text-white/60 mt-1 block">
              Cadence: Monthly
            </span>
          </div>

          <div className="bg-[#041220]/80 border border-[#C88D34]/40 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFF2BA] block mb-1 font-bold">
              Personal Winnings
            </span>
            <div className="font-serif italic text-3xl font-black text-[#FFF2BA]">
              £{totalWon.toLocaleString("en-GB")}
            </div>
            <span className="text-[11px] text-amber-300/80 mt-1 block">
              {userVerifications.length} verified win(s)
            </span>
          </div>

          <div className="bg-[#041220]/80 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFF2BA] block mb-1 font-bold">
              Your Charity Gift
            </span>
            <div className="font-serif italic text-3xl font-black text-white">
              £{userCharityTotal.toLocaleString("en-GB")}
            </div>
            <span className="text-[11px] text-[#C1DBE8] font-medium mt-1 block truncate">
              To {selectedCharity?.name.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Modern Pill Bar */}
      <div className="bg-white/80 backdrop-blur-md border border-[#EFE4C4] p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-sm">
        <button
          onClick={() => setActiveTab("scores")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "scores"
              ? "bg-[#072847] text-white shadow-sm"
              : "text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF0CA]/50"
          }`}
        >
          <span>1. Score Management (§ 05)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === "scores" ? "bg-white/20 text-white" : "bg-black/5 text-[#3E5A74]"
          }`}>
            {userScores.length}/5
          </span>
        </button>

        <button
          onClick={() => setActiveTab("draws")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "draws"
              ? "bg-[#072847] text-white shadow-sm"
              : "text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF0CA]/50"
          }`}
        >
          <span>2. Monthly Draws (§ 06 & § 07)</span>
        </button>

        <button
          onClick={() => setActiveTab("giving")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "giving"
              ? "bg-[#072847] text-white shadow-sm"
              : "text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF0CA]/50"
          }`}
        >
          <span>3. Charity & Subscription (§ 04 & § 08)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === "giving" ? "bg-white/20 text-white" : "bg-black/5 text-[#3E5A74]"
          }`}>
            {currentUser.charity_percentage}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab("winnings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "winnings"
              ? "bg-[#072847] text-white shadow-sm"
              : "text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF0CA]/50"
          }`}
        >
          <span>4. Winner Proof & Verification (§ 09)</span>
          {userVerifications.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              activeTab === "winnings" ? "bg-[#C88D34] text-[#041220]" : "bg-[#C88D34]/20 text-[#915E12]"
            }`}>
              £{totalWon.toLocaleString("en-GB")}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Score Management (§ 05) */}
      {activeTab === "scores" && <ScoreManager />}

      {/* Tab 2: Monthly Draws (§ 06 & § 07 & § 10) */}
      {activeTab === "draws" && (
        <div className="space-y-6">
          {/* Participation Summary Card (§ 10) */}
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE4C4] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                  § 10 · Participation Summary
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                  Draws Entered & Upcoming Cadence
                </h3>
              </div>
              <div className="text-xs text-[#3E5A74] bg-[#FAF6EB] px-3.5 py-1.5 rounded-lg border border-[#EFE4C4]">
                Monthly Schedule • Automatically Enters Your 5 Latest Scores
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Draw */}
              <div className="p-5 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#6786A3]">Next Upcoming Draw</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0D3B66] text-[#FFF2BA]">
                    Entries Open
                  </span>
                </div>
                <div className="font-serif italic text-2xl font-bold text-[#072847]">
                  April 2026 Spring Masters Draw
                </div>
                <div className="text-xs text-[#3E5A74] space-y-1">
                  <div>
                    Scheduled Date: <strong>30 April 2026 at 20:00 GMT</strong>
                  </div>
                  <div>
                    Estimated Prize Fund: <strong>£16,500+</strong> (including Tier 1 rollover)
                  </div>
                </div>
                <div className="pt-2 border-t border-[#EFE4C4] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0D3B66] shrink-0" />
                  <span className="font-medium text-[#072847]">
                    {userScores.length === 5
                      ? "Your 5 active scores are automatically entered into this draw."
                      : `Log ${5 - userScores.length} more score(s) in Score Management to qualify.`}
                  </span>
                </div>
              </div>

              {/* Draws Entered History */}
              <div className="p-5 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4] space-y-3">
                <span className="text-xs font-mono uppercase text-[#6786A3] block">
                  Draws Entered History ({draws.filter((d) => d.status === "published").length})
                </span>
                <div className="space-y-2">
                  {draws
                    .filter((d) => d.status === "published")
                    .map((d) => (
                      <div
                        key={d.id}
                        className="p-3 bg-white rounded-xl border border-[#EFE4C4] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <strong className="block text-[#072847]">{d.title}</strong>
                          <span className="text-[#6786A3] font-mono">
                            Drawn: {new Date(d.draw_date).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#072847]">
                            £{d.total_prize_pool.toLocaleString("en-GB")}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/30">
                            Audited
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Published Draw Board */}
          <DrawBoard />
        </div>
      )}

      {/* Tab 3: Charity & Subscription (§ 04 & § 08) */}
      {activeTab === "giving" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE4C4] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                  § 08 · Charity Contribution Model
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                  Nominated Charity & Giving Settings
                </h3>
              </div>
              <div className="text-xs text-[#3E5A74] bg-[#FAF6EB] px-3.5 py-1.5 rounded-lg border border-[#EFE4C4]">
                Strict PRD Rule: Minimum 10% Contribution Mandatory (§ 08.1)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Charity selection */}
              <div className="bg-[#FAF6EB] p-5 rounded-xl border border-[#EFE4C4] space-y-3">
                <label className="block text-xs font-semibold text-[#072847]">
                  Selected Beneficiary Charity Partner:
                </label>
                <select
                  value={currentUser.charity_id}
                  onChange={(e) =>
                    updateSubscriptionSettings({ charityId: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-[#EFE4C4] bg-white text-sm font-medium text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#C88D34]"
                >
                  {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.category}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#6786A3]">
                  {selectedCharity?.description}
                </p>
              </div>

              {/* Contribution percentage slider */}
              <div className="bg-[#FAF6EB] p-5 rounded-xl border border-[#EFE4C4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#072847]">
                    Charity Allocation Percentage:
                  </span>
                  <span className="text-lg font-serif font-bold text-[#072847]">
                    {currentUser.charity_percentage}% of fee
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={currentUser.charity_percentage}
                  onChange={(e) =>
                    updateSubscriptionSettings({
                      charityPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#0D3B66]"
                />
                <div className="flex justify-between text-[10px] text-[#6786A3]">
                  <span>10% Minimum</span>
                  <span>25%</span>
                  <span>50% Heroic Pledge</span>
                </div>
              </div>
            </div>

            {/* Plan Tier Controls */}
            <div className="pt-4 border-t border-[#EFE4C4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#3E5A74] block">
                  Current Billing Cadence:
                </span>
                <span className="text-sm font-bold text-[#072847]">
                  {currentUser.subscription_tier === "yearly"
                    ? "Annual Membership (£150.00/yr)"
                    : "Monthly Membership (£15.00/mo)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.subscription_tier === "monthly" ? (
                  <button
                    onClick={() => updateSubscriptionSettings({ tier: "yearly" })}
                    className="px-4 py-2 bg-[#072847] hover:bg-[#0D3B66] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                  >
                    Switch to Annual (Save 17%)
                  </button>
                ) : (
                  <button
                    onClick={() => updateSubscriptionSettings({ tier: "monthly" })}
                    className="px-4 py-2 bg-white border border-[#EFE4C4] text-[#072847] text-xs font-semibold rounded-xl hover:bg-[#FAF0CA] transition-all"
                  >
                    Switch to Monthly
                  </button>
                )}

                <button
                  onClick={() => setDonateModalOpen(true)}
                  className="px-4 py-2 bg-[#FAF6EB] border border-[#0D3B66]/20 text-[#072847] text-xs font-semibold rounded-xl hover:bg-[#FAF0CA] transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#C88D34]" />
                  Direct Gift (§ 08.1)
                </button>
              </div>
            </div>

            {/* PRD § 04: Subscription Lifecycle Management (Active, Lapsed, Cancelled, Renewal) */}
            <div className="pt-6 border-t border-[#EFE4C4] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                    § 04 · Subscription Lifecycle & Gateway Simulation
                  </span>
                  <h4 className="font-serif italic font-bold text-lg text-[#072847]">
                    Membership Status & Card Controls (Stripe PCI Gateway)
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    currentUser.subscription_status === "active"
                      ? "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/40"
                      : currentUser.subscription_status === "lapsed"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Status: {currentUser.subscription_status}
                </span>
              </div>

              <div className="p-4 bg-[#FAF6EB] rounded-xl border border-[#EFE4C4] text-xs space-y-2">
                <div className="flex justify-between items-center text-[#3E5A74]">
                  <span>Payment Gateway:</span>
                  <strong className="text-[#072847]">Stripe Connect (PCI-DSS Level 1 Compliant)</strong>
                </div>
                <div className="flex justify-between items-center text-[#3E5A74]">
                  <span>Payment Method on File:</span>
                  <strong className="text-[#072847] font-mono">Visa ending in •••• 4242</strong>
                </div>
                <div className="flex justify-between items-center text-[#3E5A74]">
                  <span>Scheduled Renewal:</span>
                  <strong className="text-[#072847]">
                    {currentUser.subscription_renews_at
                      ? new Date(currentUser.subscription_renews_at).toLocaleDateString("en-GB")
                      : "Automatic monthly roll"}
                  </strong>
                </div>
              </div>

              {/* Lifecycle Evaluator Sandbox */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-[#6786A3] mr-2">
                  Test Lifecycle (§ 04):
                </span>
                {currentUser.subscription_status !== "active" ? (
                  <button
                    type="button"
                    onClick={() => reactivateSubscription()}
                    className="px-3.5 py-1.5 bg-[#072847] hover:bg-[#0D3B66] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    ✓ Reactivate via Stripe (§ 04)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => updateSubscriptionSettings({ status: "lapsed" })}
                      className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      Simulate Payment Failure (Lapsed)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSubscriptionSettings({ status: "cancelled" })}
                      className="px-3 py-1.5 bg-red-50 border border-red-300 text-red-900 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      Simulate Cancellation
                    </button>
                  </>
                )}
                {currentUser.subscription_status === "cancelled" && (
                  <button
                    type="button"
                    onClick={() => reactivateSubscription()}
                    className="px-3.5 py-1.5 bg-[#072847] hover:bg-[#0D3B66] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    Undo Cancellation (Renew)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Winner Verifications (§ 09 & § 10) */}
      {activeTab === "winnings" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                  § 09 · Winner Verification & Payout States
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                  Your Historical Draws & Payout Pipeline
                </h3>
              </div>
              <div className="text-xs text-[#3E5A74] bg-[#FAF6EB] px-3.5 py-1.5 rounded-lg border border-[#EFE4C4]">
                Eligibility: Winners Only • Flow: Screenshot Proof → Admin Review → Paid
              </div>
            </div>

            {userVerifications.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF6EB] rounded-xl border border-dashed border-[#EFE4C4]">
                <Trophy className="w-8 h-8 text-[#C88D34] mx-auto mb-2 opacity-60" />
                <p className="text-sm text-[#6786A3]">
                  No winning draws recorded yet. Ensure your 5 Stableford scores are updated for the upcoming draw!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userVerifications.map((verif) => (
                  <div
                    key={verif.id}
                    className="p-5 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#072847]">
                          {verif.draw_title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF2BA] text-[#072847] border border-[#C88D34]/40">
                          Tier {verif.tier} ({verif.matches_count} Matches)
                        </span>
                      </div>
                      <div className="text-xs text-[#6786A3] flex items-center gap-3">
                        <span>Submitted Platform: {verif.golf_platform_name}</span>
                        <span>•</span>
                        <span>
                          Numbers: [{verif.matching_numbers.join(", ")}]
                        </span>
                      </div>
                      {verif.admin_notes && (
                        <div className="text-xs text-[#3E5A74] italic bg-white p-2 rounded-lg border border-[#EFE4C4]">
                          Admin Audit Note: “{verif.admin_notes}”
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-right">
                        <div className="font-serif italic text-2xl font-black text-[#072847]">
                          £{verif.prize_amount.toLocaleString("en-GB")}
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              verif.payment_status === "paid"
                                ? "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/30"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            Payment: {verif.payment_status}
                          </span>
                        </div>
                      </div>

                      {verif.proof_image_url && (
                        <a
                          href={verif.proof_image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-white border border-[#EFE4C4] text-[#072847] rounded-xl text-xs font-semibold hover:bg-[#FAF0CA] transition-colors"
                        >
                          View Proof
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct Donation Modal */}
      {donateModalOpen && (
        <DirectDonationModal
          isOpen={donateModalOpen}
          onClose={() => setDonateModalOpen(false)}
          defaultCharityId={currentUser.charity_id}
        />
      )}
    </div>
  );
}
