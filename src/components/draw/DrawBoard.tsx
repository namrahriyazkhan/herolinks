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
  const existingVerif = verifications.find(
    (v) => v.draw_id === latestPublishedDraw.id && v.user_id === currentUser.id
  );

  return (
    <div className="space-y-8">
      {/* Draw Header */}
      <div className="bg-[#0D261E] text-white rounded-3xl p-6 sm:p-10 border border-[#143A2F] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88D34]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143A2F] text-[#E8C28A] text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#C88D34]" />
              Official Published Monthly Draw (§ 06)
            </span>
            <span className="text-xs font-mono text-white/70">
              Cadence: Monthly • Mode: {latestPublishedDraw.draw_logic === "algorithmic" ? "Score-Weighted Algorithm" : "Lottery Random"}
            </span>
          </div>

          <div className="max-w-2xl">
            <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FAF7F2]">
              {latestPublishedDraw.title}
            </h2>
            <p className="text-sm text-[#BDE3D5]/80 mt-2">
              Drawn on {new Date(latestPublishedDraw.draw_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} • {latestPublishedDraw.total_subscribers.toLocaleString()} Active Golf Subscribers
            </p>
          </div>

          {/* Winning 5 Balls */}
          <div className="py-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E8C28A] block mb-3 font-semibold">
              Winning Stableford Numbers:
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {latestPublishedDraw.winning_numbers.map((num) => (
                <div
                  key={num}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF7F2] text-[#0D261E] flex flex-col items-center justify-center font-serif text-2xl sm:text-3xl font-black shadow-lg border-2 border-[#C88D34] animate-gold-pulse"
                >
                  <span>{num}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User's Ticket Evaluation Card */}
          <div className="bg-[#143A2F]/80 border border-[#215444] rounded-2xl p-5 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8C28A]">
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
                                  ? "bg-[#C88D34] text-[#0D261E] ring-2 ring-white"
                                  : "bg-[#0D261E] text-white/60"
                              }`}
                            >
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-white/60 text-xs">
                      You currently have {userScores.length}/5 scores logged. Log all 5 to match draws!
                    </span>
                  )}
                </div>
              </div>

              {/* Match Result & Action */}
              <div className="sm:text-right">
                {wonTier ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-[#E8C28A]">
                      🎉 You matched {matchCount} numbers! (Tier {wonTier} Winner)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-white">
                      Prize: £{wonPrize.toLocaleString("en-GB")}
                    </div>
                    {existingVerif ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                        <Check className="w-4 h-4" />
                        Proof Status: {existingVerif.status.toUpperCase()} ({existingVerif.payment_status.toUpperCase()})
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedProofEntry({
                            drawEntryId: `entry-${currentUser.id}-${latestPublishedDraw.id}`,
                            drawId: latestPublishedDraw.id,
                            drawTitle: latestPublishedDraw.title,
                            prizeAmount: wonPrize,
                            tier: wonTier!,
                            matchesCount: matchCount,
                            matchingNumbers: uniqueMatches,
                          })
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#C88D34] hover:bg-[#E09F45] text-[#0D261E] font-bold text-xs rounded-xl transition-all shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Upload Scorecard Proof (§ 09)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-white/60">
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
              § 07 · Prize Pool Architecture
            </span>
            <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
              Pre-Defined 40 / 35 / 25 Distribution
            </h3>
          </div>
          <div className="text-xs text-[#748780] bg-white border border-[#E8DEC0] px-3.5 py-1.5 rounded-lg">
            Total Prize Fund:{" "}
            <strong className="text-[#0D261E]">
              £{latestPublishedDraw.total_prize_pool.toLocaleString("en-GB")}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 (40% + Rollover Jackpot) */}
          <div className="bg-[#FAF7F2] border-2 border-[#C88D34] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#C88D34] text-white px-2 py-0.5 rounded-full uppercase">
              Jackpot Rollover
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#915E12] block mb-1">
              5-Number Match (40% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#0D261E] mb-2">
              £{latestPublishedDraw.tier1_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#485953] space-y-1">
              <div>
                Base 40%: £{(latestPublishedDraw.total_prize_pool * 0.4).toFixed(0)}
              </div>
              {latestPublishedDraw.rollover_jackpot_in > 0 && (
                <div className="text-[#C88D34] font-semibold">
                  + £{latestPublishedDraw.rollover_jackpot_in.toLocaleString()} Rollover from Feb
                </div>
              )}
              <div className="pt-2 border-t border-[#E8DEC0] flex justify-between font-medium">
                <span>Winners: {latestPublishedDraw.tier1_winners_count}</span>
                <span>
                  Payout: £{latestPublishedDraw.tier1_payout_per_winner.toLocaleString("en-GB")} ea
                </span>
              </div>
            </div>
          </div>

          {/* Tier 2 (35%) */}
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-[#748780] block mb-1">
              4-Number Match (35% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#143A2F] mb-2">
              £{latestPublishedDraw.tier2_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#485953] space-y-1">
              <div>Rollover: No (Split equally)</div>
              <div className="pt-4 border-t border-[#E8DEC0] flex justify-between font-medium">
                <span>Winners: {latestPublishedDraw.tier2_winners_count}</span>
                <span>
                  Payout: £{latestPublishedDraw.tier2_payout_per_winner.toLocaleString("en-GB")} ea
                </span>
              </div>
            </div>
          </div>

          {/* Tier 3 (25%) */}
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-[#748780] block mb-1">
              3-Number Match (25% Pool)
            </span>
            <div className="font-serif italic text-3xl font-black text-[#143A2F] mb-2">
              £{latestPublishedDraw.tier3_pool_share.toLocaleString("en-GB")}
            </div>
            <div className="text-xs text-[#485953] space-y-1">
              <div>Rollover: No (Split equally)</div>
              <div className="pt-4 border-t border-[#E8DEC0] flex justify-between font-medium">
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
