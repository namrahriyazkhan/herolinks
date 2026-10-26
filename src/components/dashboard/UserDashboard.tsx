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
        <div className="w-16 h-16 rounded-full bg-[#143A2F] text-white flex items-center justify-center mx-auto shadow-lg">
          <User className="w-8 h-8 text-[#E8C28A]" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#C88D34] uppercase tracking-wider font-semibold">
            § 03 · SUBSCRIBER PORTAL
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#0D261E]">
            Sign In to Access Your Portal
          </h2>
          <p className="text-sm text-[#485953] leading-relaxed">
            Please sign in to manage your Stableford rounds, active draw tickets, and nominated charity allocations.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-3 bg-[#143A2F] text-white rounded-xl text-sm font-semibold hover:bg-[#0D261E] transition-all"
          >
            Sign In to Account
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-white border border-[#E8DEC0] text-[#0D261E] rounded-xl text-sm font-semibold hover:bg-[#F3ECE2] transition-all"
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
      {/* Top Profile & Subscription Hero Card (§ 10) */}
      <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8DEC0]">
          {/* User Bio */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D261E] text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#C88D34] shadow-md shrink-0">
              {currentUser.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#0D261E]">
                  {currentUser.full_name}
                </h1>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                  {currentUser.subscription_status}
                </span>
              </div>
              <div className="text-xs text-[#748780] flex flex-wrap items-center gap-3 mt-1">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>{currentUser.home_club || "St Andrews Links"}</span>
                <span>•</span>
                <span>Handicap: {currentUser.handicap || "11.4"}</span>
              </div>
            </div>
          </div>

          {/* Quick Subscription Summary Badge (§ 04 & § 10) */}
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-4 flex items-center gap-6 shadow-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block">
                Subscription Plan
              </span>
              <div className="font-serif font-bold text-lg text-[#0D261E] capitalize">
                {currentUser.subscription_tier} (£
                {currentUser.subscription_tier === "yearly" ? "150/yr" : "15/mo"})
              </div>
              <span className="text-[11px] text-[#2E6E59] font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Renews:{" "}
                {currentUser.subscription_renews_at
                  ? new Date(currentUser.subscription_renews_at).toLocaleDateString("en-GB")
                  : "Next billing cycle"}
              </span>
            </div>

            <div className="pl-6 border-l border-[#E8DEC0]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block">
                Pledged Charity
              </span>
              <div className="font-serif font-bold text-lg text-[#143A2F] truncate max-w-[160px]">
                {selectedCharity?.name}
              </div>
              <span className="text-[11px] text-[#C88D34] font-bold">
                {currentUser.charity_percentage}% of fee
              </span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-white border border-[#E8DEC0] rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
              Stableford Scores
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
              {userScores.length} / 5 Active
            </div>
            <span className="text-[11px] text-[#2E6E59] font-medium">
              Rolling queue active
            </span>
          </div>

          <div className="bg-white border border-[#E8DEC0] rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
              Draws Entered
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#143A2F]">
              {draws.filter((d) => d.status === "published").length}
            </div>
            <span className="text-[11px] text-[#748780]">
              Next: March Equinox Draw
            </span>
          </div>

          <div className="bg-white border border-[#E8DEC0] rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
              Personal Winnings
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#C88D34]">
              £{totalWon.toLocaleString("en-GB")}
            </div>
            <span className="text-[11px] text-[#748780]">
              {userVerifications.length} verified wins
            </span>
          </div>

          <div className="bg-white border border-[#E8DEC0] rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
              Your Charity Giving
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
              £{userCharityTotal.toLocaleString("en-GB")}
            </div>
            <span className="text-[11px] text-[#2E6E59] font-medium">
              Directed to {selectedCharity?.name.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8DEC0]">
        <button
          onClick={() => setActiveTab("scores")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "scores"
              ? "border-[#143A2F] text-[#0D261E] font-bold"
              : "border-transparent text-[#748780] hover:text-[#0D261E]"
          }`}
        >
          1. Score Management (§ 05)
        </button>
        <button
          onClick={() => setActiveTab("draws")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "draws"
              ? "border-[#143A2F] text-[#0D261E] font-bold"
              : "border-transparent text-[#748780] hover:text-[#0D261E]"
          }`}
        >
          2. Monthly Draws (§ 06 & § 07)
        </button>
        <button
          onClick={() => setActiveTab("giving")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "giving"
              ? "border-[#143A2F] text-[#0D261E] font-bold"
              : "border-transparent text-[#748780] hover:text-[#0D261E]"
          }`}
        >
          3. Charity & Subscription (§ 04 & § 08)
        </button>
        <button
          onClick={() => setActiveTab("winnings")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "winnings"
              ? "border-[#143A2F] text-[#0D261E] font-bold"
              : "border-transparent text-[#748780] hover:text-[#0D261E]"
          }`}
        >
          4. Winner Verifications (§ 09)
        </button>
      </div>

      {/* Tab 1: Score Management (§ 05) */}
      {activeTab === "scores" && <ScoreManager />}

      {/* Tab 2: Monthly Draws (§ 06 & § 07 & § 10) */}
      {activeTab === "draws" && (
        <div className="space-y-6">
          {/* Participation Summary Card (§ 10) */}
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEC0] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                  § 10 · Participation Summary
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                  Draws Entered & Upcoming Cadence
                </h3>
              </div>
              <div className="text-xs text-[#748780] bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#E8DEC0]">
                Monthly Schedule • Automatically Enters Your 5 Latest Scores
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Draw */}
              <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#748780]">Next Upcoming Draw</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#143A2F] text-white">
                    Entries Open
                  </span>
                </div>
                <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
                  April 2026 Spring Masters Draw
                </div>
                <div className="text-xs text-[#485953] space-y-1">
                  <div>
                    Scheduled Date: <strong>30 April 2026 at 20:00 GMT</strong>
                  </div>
                  <div>
                    Estimated Prize Fund: <strong>£16,500+</strong> (including Tier 1 rollover)
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E8DEC0] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[#143A2F]">
                    {userScores.length === 5
                      ? "Your 5 active scores are automatically entered into this draw."
                      : `Log ${5 - userScores.length} more score(s) in Score Management to qualify.`}
                  </span>
                </div>
              </div>

              {/* Draws Entered History */}
              <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0] space-y-3">
                <span className="text-xs font-mono uppercase text-[#748780] block">
                  Draws Entered History ({draws.filter((d) => d.status === "published").length})
                </span>
                <div className="space-y-2">
                  {draws
                    .filter((d) => d.status === "published")
                    .map((d) => (
                      <div
                        key={d.id}
                        className="p-3 bg-white rounded-lg border border-[#E8DEC0] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#0D261E]">{d.title}</div>
                          <div className="text-[11px] text-[#748780]">
                            Drawn: {new Date(d.draw_date).toLocaleDateString("en-GB")}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Participated
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <DrawBoard />
        </div>
      )}

      {/* Tab 3: Charity & Subscription (§ 04 & § 08) */}
      {activeTab === "giving" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 04 & § 08 · Subscription & Contribution Controls
              </span>
              <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Manage Your Giving & Membership
              </h3>
            </div>

            {/* Change Charity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#485953] uppercase tracking-wider">
                  Select Nominated Charity
                </label>
                <select
                  value={currentUser.charity_id}
                  onChange={(e) =>
                    updateSubscriptionSettings({ charityId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E]"
                >
                  {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.category}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#748780]">
                  {selectedCharity?.description}
                </p>
              </div>

              {/* Contribution percentage slider */}
              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8DEC0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0D261E]">
                    Charity Allocation Percentage:
                  </span>
                  <span className="text-lg font-serif font-bold text-[#143A2F]">
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
                  className="w-full accent-[#143A2F]"
                />
                <div className="flex justify-between text-[10px] text-[#748780]">
                  <span>10% Minimum</span>
                  <span>25%</span>
                  <span>50% Heroic Pledge</span>
                </div>
              </div>
            </div>

            {/* Plan Tier Controls */}
            <div className="pt-4 border-t border-[#E8DEC0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#485953] block">
                  Current Billing Cadence:
                </span>
                <span className="text-sm font-bold text-[#0D261E]">
                  {currentUser.subscription_tier === "yearly"
                    ? "Annual Membership (£150.00/yr)"
                    : "Monthly Membership (£15.00/mo)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.subscription_tier === "monthly" ? (
                  <button
                    onClick={() => updateSubscriptionSettings({ tier: "yearly" })}
                    className="px-4 py-2 bg-[#143A2F] text-white text-xs font-semibold rounded-xl hover:bg-[#0D261E] transition-all"
                  >
                    Switch to Annual (Save 17%)
                  </button>
                ) : (
                  <button
                    onClick={() => updateSubscriptionSettings({ tier: "monthly" })}
                    className="px-4 py-2 bg-white border border-[#E8DEC0] text-[#0D261E] text-xs font-semibold rounded-xl hover:bg-[#F3ECE2] transition-all"
                  >
                    Switch to Monthly
                  </button>
                )}

                <button
                  onClick={() => setDonateModalOpen(true)}
                  className="px-4 py-2 bg-[#FAF7F2] border border-[#143A2F]/20 text-[#143A2F] text-xs font-semibold rounded-xl hover:bg-[#F3ECE2] transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#C88D34]" />
                  Direct Gift (§ 08.1)
                </button>
              </div>
            </div>

            {/* PRD § 04: Subscription Lifecycle Management (Active, Lapsed, Cancelled, Renewal) */}
            <div className="pt-6 border-t border-[#E8DEC0] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                    § 04 · Subscription Lifecycle & Gateway Simulation
                  </span>
                  <h4 className="font-serif italic font-bold text-lg text-[#0D261E]">
                    Membership Status & Card Controls (Stripe PCI Gateway)
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    currentUser.subscription_status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : currentUser.subscription_status === "lapsed"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Status: {currentUser.subscription_status}
                </span>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DEC0] text-xs space-y-2">
                <div className="flex justify-between items-center text-[#485953]">
                  <span>Payment Gateway:</span>
                  <strong className="text-[#0D261E]">Stripe Connect (PCI-DSS Level 1 Compliant)</strong>
                </div>
                <div className="flex justify-between items-center text-[#485953]">
                  <span>Payment Method on File:</span>
                  <strong className="text-[#0D261E] font-mono">Visa ending in •••• 4242</strong>
                </div>
                <div className="flex justify-between items-center text-[#485953]">
                  <span>Scheduled Renewal:</span>
                  <strong className="text-[#0D261E]">
                    {currentUser.subscription_renews_at
                      ? new Date(currentUser.subscription_renews_at).toLocaleDateString("en-GB")
                      : "Automatic monthly roll"}
                  </strong>
                </div>
              </div>

              {/* Lifecycle Evaluator Sandbox */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-[#748780] mr-2">
                  Test Lifecycle (§ 04):
                </span>
                {currentUser.subscription_status !== "active" ? (
                  <button
                    type="button"
                    onClick={() => reactivateSubscription()}
                    className="px-3.5 py-1.5 bg-[#143A2F] text-white rounded-lg text-xs font-bold hover:bg-[#0D261E] transition-colors"
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
                    className="px-3.5 py-1.5 bg-[#143A2F] text-white rounded-lg text-xs font-bold hover:bg-[#0D261E] transition-colors"
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
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                  § 09 · Winner Verification & Payout States
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                  Your Historical Draws & Payout Pipeline
                </h3>
              </div>
              <div className="text-xs text-[#748780] bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#E8DEC0]">
                Eligibility: Winners Only • Flow: Screenshot Proof → Admin Review → Paid
              </div>
            </div>

            {userVerifications.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DEC0]">
                <Trophy className="w-8 h-8 text-[#C88D34] mx-auto mb-2 opacity-60" />
                <p className="text-sm text-[#748780]">
                  No winning draws recorded yet. Ensure your 5 Stableford scores are updated for the upcoming draw!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userVerifications.map((verif) => (
                  <div
                    key={verif.id}
                    className="p-5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0D261E]">
                          {verif.draw_title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C88D34] text-[#0D261E]">
                          Tier {verif.tier} ({verif.matches_count} Matches)
                        </span>
                      </div>
                      <div className="text-xs text-[#748780] flex items-center gap-3">
                        <span>Submitted Platform: {verif.golf_platform_name}</span>
                        <span>•</span>
                        <span>
                          Numbers: [{verif.matching_numbers.join(", ")}]
                        </span>
                      </div>
                      {verif.admin_notes && (
                        <div className="text-xs text-[#485953] italic bg-white p-2 rounded-lg border border-[#E8DEC0]">
                          Admin Audit Note: “{verif.admin_notes}”
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-right">
                        <div className="font-serif italic text-2xl font-black text-[#143A2F]">
                          £{verif.prize_amount.toLocaleString("en-GB")}
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              verif.payment_status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
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
                          className="px-3 py-2 bg-white border border-[#E8DEC0] text-[#0D261E] rounded-xl text-xs font-semibold hover:bg-[#F3ECE2] transition-colors"
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
