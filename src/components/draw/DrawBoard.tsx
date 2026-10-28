"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { Trophy, Sparkles, Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { ProofUploadModal } from "@/components/modals/ProofUploadModal";

export function DrawBoard() {
  const { latestPublishedDraw, userScores, currentUser, verifications } = useApp();
  const [selectedProofEntry, setSelectedProofEntry] = useState<{
    drawEntryId: string;
    drawId: string;
    drawTitle: string;
    prizeAmount: number;
    tier: 1 | 2 | 3;
    matchesCount: number;
    matchingNumbers: number[];
  } | null>(null);

  if (!latestPublishedDraw) return null;

  const winningSet = new Set(latestPublishedDraw.winning_numbers);
  const userScoreNumbers = userScores.map((s) => s.score);
  const matchingScores = userScoreNumbers.filter((num) => winningSet.has(num));
  const uniqueMatches = Array.from(new Set(matchingScores)).sort((a, b) => a - b);
  const matchCount = uniqueMatches.length;

  let wonTier: 1 | 2 | 3 | null = null;
  let wonPrize = 0;
  if (matchCount >= 5) {
    wonTier = 1;
    wonPrize = latestPublishedDraw.tier1_payout_per_winner;
  } else if (matchCount === 4) {
    wonTier = 2;
    wonPrize = latestPublishedDraw.tier2_payout_per_winner;
  } else if (matchCount === 3) {
    wonTier = 3;
    wonPrize = latestPublishedDraw.tier3_payout_per_winner;
  }

  // Check if already submitted verification
  const existingVerif = currentUser
    ? verifications.find(
        (v) => v.draw_id === latestPublishedDraw.id && v.user_id === currentUser.id
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Draw Header */}
      <div className="bg-[#072847] text-white rounded-3xl p-6 sm:p-10 border border-[#0D3B66] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D3B66]/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3B66] text-[#FFF2BA] text-xs font-semibold border border-[#FFF2BA]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#F3DEB2]" />
              Official Published Monthly Draw (§ 06)
            </span>
            <span className="text-xs font-mono text-[#C1DBE8]">
              Cadence: Monthly • Mode: {latestPublishedDraw.draw_logic === "algorithmic" ? "Score-Weighted Algorithm" : "Lottery Random"}
            </span>
          </div>

          <div className="max-w-2xl">
            <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FFFDF7]">
              {latestPublishedDraw.title}
            </h2>
            <p className="text-sm text-[#C1DBE8] mt-2">
              Drawn on {new Date(latestPublishedDraw.draw_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} • {latestPublishedDraw.total_subscribers.toLocaleString()} Active Golf Subscribers
            </p>
          </div>

          {/* Winning 5 Balls */}
          <div className="py-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA] block mb-3 font-semibold">
              Winning Stableford Numbers:
            </span>
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
              {latestPublishedDraw.winning_numbers.map((num) => (
                <div
                  key={num}
                  className="lottery-ball-3d w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#FFFDF7] via-[#FFF2BA] to-[#FAF0CA] text-[#072847] flex flex-col items-center justify-center font-serif italic text-2xl sm:text-3xl font-black shadow-xl border-4 border-[#C88D34] animate-gold-pulse"
                >
                  <span className="leading-none">{num}</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#915E12] mt-0.5 font-bold">
                    PTS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User's Ticket Evaluation Card */}
          <div className="bg-[#0D3B66]/80 border border-[#FFF2BA]/25 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FFF2BA]">
                  Your Ticket Match Checker
                </span>
                <div className="text-sm text-white/90">
                  {userScores.length === 5 ? (
                    <div className="flex items-center gap-2">
                      <span>Your Active Five:</span>
                      <div className="flex gap-1.5">
                        {userScoreNumbers.map((s, idx) => {
                          const isMatch = winningSet.has(s);
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                                isMatch
                                  ? "bg-[#FFF2BA] text-[#072847] ring-2 ring-white"
                                  : "bg-[#072847] text-white/60"
                              }`}
                            >
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#C1DBE8] text-xs">
                      You currently have {userScores.length}/5 scores logged. Log all 5 to match draws!
                    </span>
                  )}
                </div>
              </div>

              {/* Match Result & Action */}
              <div className="sm:text-right">
                {wonTier ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-[#FFF2BA]">
                      🎉 You matched {matchCount} numbers! (Tier {wonTier} Winner)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-white">
                      Prize: £{wonPrize.toLocaleString("en-GB")}
                    </div>
                    {existingVerif ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700">
                        <Check className="w-4 h-4" />
                        Proof Status: {existingVerif.status.toUpperCase()} ({existingVerif.payment_status.toUpperCase()})
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedProofEntry({
                            drawEntryId: `entry-${currentUser?.id || "guest"}-${latestPublishedDraw.id}`,
                            drawId: latestPublishedDraw.id,
                            drawTitle: latestPublishedDraw.title,
                            prizeAmount: wonPrize,
                            tier: wonTier!,
                            matchesCount: matchCount,
                            matchingNumbers: uniqueMatches,
                          })
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF2BA] hover:bg-[#FAF0CA] text-[#072847] font-bold text-xs rounded-xl transition-all shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Upload Scorecard Proof (§ 09)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#C1DBE8]">
                    {matchCount > 0
                      ? `Matched ${matchCount} numbers. (Need 3+ to share prize pool)`
                      : "No matches in this draw. Keep logging your rounds!"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Pool Distribution Breakdown (§ 07) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#0D3B66] font-semibold">
              § 07 · Prize Pool Architecture
            </span>
            <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
              Pre-Defined 40 / 35 / 25 Distribution
            </h3>
          </div>
          <div className="text-xs text-[#3E5A74] bg-white border border-[#EFE4C4] px-3.5 py-1.5 rounded-lg">
            Total Prize Fund:{" "}
            <strong className="text-[#072847]">
              £{latestPublishedDraw.total_prize_pool.toLocaleString("en-GB")}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 (40% + Rollover Jackpot) */}
          <div className="bg-[#FAF0CA]/50 border-2 border-[#C88D34] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#0D3B66] text-[#FFF2BA] px-2 py-0.5 rounded-full uppercase">
              Jackpot Rollover
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#0D3B66] block mb-1 font-bold">
              5-Number Match (40% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#072847] mb-2">
              £{latestPublishedDraw.tier1_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#3E5A74] space-y-1">
              <div>
                Base 40%: £{(latestPublishedDraw.total_prize_pool * 0.4).toFixed(0)}
              </div>
              {latestPublishedDraw.rollover_jackpot_in > 0 && (
                <div className="text-[#915E12] font-semibold">
                  + £{latestPublishedDraw.rollover_jackpot_in.toLocaleString()} Rollover from Feb
                </div>
              )}
              <div className="pt-2 border-t border-[#EFE4C4] flex justify-between font-medium">
                <span>Winners: {latestPublishedDraw.tier1_winners_count}</span>
                <span>
                  Payout: £{latestPublishedDraw.tier1_payout_per_winner.toLocaleString("en-GB")} ea
                </span>
              </div>
            </div>
          </div>

          {/* Tier 2 (35%) */}
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase tracking-wider text-[#3E5A74] block mb-1 font-bold">
              4-Number Match (35% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#072847] mb-2">
              £{latestPublishedDraw.tier2_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#3E5A74] space-y-1">
              <div>Split equally among all 4-match tickets</div>
              <div className="pt-2 border-t border-[#EFE4C4] flex justify-between font-medium">
                <span>Winners: {latestPublishedDraw.tier2_winners_count}</span>
                <span>
                  Payout: £{latestPublishedDraw.tier2_payout_per_winner.toLocaleString("en-GB")} ea
                </span>
              </div>
            </div>
          </div>

          {/* Tier 3 (25%) */}
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase tracking-wider text-[#3E5A74] block mb-1 font-bold">
              3-Number Match (25% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#072847] mb-2">
              £{latestPublishedDraw.tier3_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#3E5A74] space-y-1">
              <div>Split equally among all 3-match tickets</div>
              <div className="pt-2 border-t border-[#EFE4C4] flex justify-between font-medium">
                <span>Winners: {latestPublishedDraw.tier3_winners_count}</span>
                <span>
                  Payout: £{latestPublishedDraw.tier3_payout_per_winner.toLocaleString("en-GB")} ea
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Upload Modal */}
      {selectedProofEntry && (
        <ProofUploadModal
          isOpen={Boolean(selectedProofEntry)}
          onClose={() => setSelectedProofEntry(null)}
          {...selectedProofEntry}
        />
      )}
    </div>
  );
}
