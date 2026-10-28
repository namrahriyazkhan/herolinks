"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store/app-context";
import { generateDrawNumbers, evaluateUserMatch } from "@/lib/engine/draw-engine";
import { Trophy, Sparkles, Play, RotateCcw, ShieldCheck, Flame } from "lucide-react";
import confetti from "canvas-confetti";

export function DrawMachine() {
  const { userScores, activeJackpot, latestPublishedDraw } = useApp();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawnBalls, setCurrentDrawnBalls] = useState<number[]>(
    latestPublishedDraw?.winning_numbers || [29, 34, 36, 38, 41]
  );
  const [drawMode, setDrawMode] = useState<"algorithmic" | "random">("algorithmic");
  const [drawnCount, setDrawnCount] = useState(5);

  const userNumbers = userScores.map((s) => s.score);
  const matchResult = evaluateUserMatch(userNumbers, currentDrawnBalls);

  const handleTriggerDraw = () => {
    setIsDrawing(true);
    setDrawnCount(0);
    setCurrentDrawnBalls([]);

    // Pre-calculate target numbers
    const targetNumbers = generateDrawNumbers(
      drawMode,
      userScores.map((s) => s.score)
    );

    // Stagger reveal of balls 1 to 5 with mechanical click intervals
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDrawnCount(count);
      setCurrentDrawnBalls((prev) => [...prev, targetNumbers[count - 1]]);

      if (count === 5) {
        clearInterval(interval);
        setIsDrawing(false);

        // Check if user has 3+ matches
        const evalCheck = evaluateUserMatch(userNumbers, targetNumbers);
        if (evalCheck.matchesCount >= 3) {
          try {
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#C88D34", "#072847", "#FFF2BA"],
            });
          } catch {
            // ignore
          }
        }
      }
    }, 450);
  };

  return (
    <div className="bg-[#051C33] text-white rounded-3xl p-6 sm:p-10 border border-[#0D3B66] shadow-2xl relative overflow-hidden">
      {/* Background ambient gold & blue aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0D3B66]/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2BA]/20 text-[#FFF2BA] text-xs font-mono font-bold border border-[#FFF2BA]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#F3DEB2]" />
                PRD § 06 & § 07 Draw Engine
              </span>
              <span className="text-xs text-[#C1DBE8] font-mono hidden sm:inline">
                5-Number Stableford Match (1–45)
              </span>
            </div>
            <h3 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#FFFDF7]">
              The Interactive Draw Tumbler
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#072847] p-1 rounded-xl border border-[#0D3B66] text-xs">
            <button
              onClick={() => setDrawMode("algorithmic")}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                drawMode === "algorithmic"
                  ? "bg-[#FFF2BA] text-[#072847] font-bold shadow-sm"
                  : "text-[#C1DBE8] hover:text-white"
              }`}
            >
              Algorithmic (Score-Weighted)
            </button>
            <button
              onClick={() => setDrawMode("random")}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                drawMode === "random"
                  ? "bg-[#FFF2BA] text-[#072847] font-bold shadow-sm"
                  : "text-[#C1DBE8] hover:text-white"
              }`}
            >
              Standard Random
            </button>
          </div>
        </div>

        {/* Tumbler Glass Stage with 5 Ball Chambers */}
        <div className="bg-[#072847] border-2 border-[#0D3B66] rounded-3xl p-6 sm:p-10 text-center space-y-8 shadow-[inset_0_2px_16px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA] font-bold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDrawing ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
              {isDrawing ? "Drawing balls in real-time sequence..." : "Official Verified Draw Combination"}
            </span>
            <span className="text-[11px] font-mono text-[#C1DBE8]">
              PRD § 06 (1–45 Range)
            </span>
          </div>

          {/* 5 3D Ball Holders */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 py-4">
            {[0, 1, 2, 3, 4].map((slotIndex) => {
              const ballNumber = currentDrawnBalls[slotIndex];
              const isFilled = ballNumber !== undefined;
              const isUserMatch = isFilled && userNumbers.includes(ballNumber);

              return (
                <div key={slotIndex} className="relative group">
                  <div
                    className={`w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center transition-all duration-500 transform ${
                      isFilled
                        ? "lottery-ball-3d bg-gradient-to-br from-[#FFFDF7] via-[#FFF2BA] to-[#FAF0CA] text-[#072847] scale-100 border-4 border-[#C88D34]"
                        : "bg-[#041220] border-2 border-dashed border-white/20 text-white/30 scale-95"
                    } ${isUserMatch ? "ring-4 ring-[#FFF2BA] animate-gold-pulse" : ""}`}
                  >
                    {isFilled ? (
                      <>
                        <span className="font-serif italic text-3xl sm:text-4xl font-black leading-none tracking-tight text-[#072847]">
                          {ballNumber}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#915E12] mt-0.5 font-bold">
                          PTS
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-xs opacity-40 font-bold">#{slotIndex + 1}</span>
                    )}
                  </div>

                  {isUserMatch && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFF2BA] text-[#072847] text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-[#0D3B66] whitespace-nowrap animate-bounce">
                      ★ Matched!
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleTriggerDraw}
              disabled={isDrawing}
              className={`px-8 py-4 rounded-2xl font-serif italic text-lg font-bold shadow-2xl flex items-center gap-3 transition-all ${
                isDrawing
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C88D34] via-[#DBA149] to-[#FFF2BA] hover:brightness-110 text-[#072847] transform hover:scale-[1.03] shadow-[0_10px_25px_rgba(200,141,52,0.4)]"
              }`}
            >
              <Play className={`w-5 h-5 ${isDrawing ? "animate-spin" : ""}`} />
              <span>{isDrawing ? "Rolling Mechanical Tumbler..." : "Spin New Draw Simulation"}</span>
            </button>

            <span className="text-xs font-mono text-[#C1DBE8]">
              {drawMode === "algorithmic"
                ? "Weighted by score frequency in active rounds"
                : "Uniform pseudo-random 1–45 distribution"}
            </span>
          </div>

          {/* Guaranteed 40/35/25 Prize Distribution Visualizer (§ 07) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-left">
            <div className="bg-white/5 rounded-2xl p-4 border border-[#FFF2BA]/30">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFF2BA] block font-bold">
                Tier 1 (5 Matches) · 40% Share
              </span>
              <div className="font-serif italic text-xl font-bold text-white mt-1">
                £{latestPublishedDraw?.tier1_pool_share.toLocaleString("en-GB") || "7,980"}
              </div>
              <span className="text-[11px] text-[#FFF2BA]/90 font-sans mt-0.5 block">
                Includes £3,720 rollover jackpot carryover
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C1DBE8] block font-bold">
                Tier 2 (4 Matches) · 35% Share
              </span>
              <div className="font-serif italic text-xl font-bold text-white mt-1">
                £{latestPublishedDraw?.tier2_pool_share.toLocaleString("en-GB") || "1,863.75"}
              </div>
              <span className="text-[11px] text-white/60 font-sans mt-0.5 block">
                Split equally among all 4-match tickets
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C1DBE8] block font-bold">
                Tier 3 (3 Matches) · 25% Share
              </span>
              <div className="font-serif italic text-xl font-bold text-white mt-1">
                £{latestPublishedDraw?.tier3_pool_share.toLocaleString("en-GB") || "1,331.25"}
              </div>
              <span className="text-[11px] text-white/60 font-sans mt-0.5 block">
                Split equally among all 3-match tickets
              </span>
            </div>
          </div>
        </div>

        {/* Live Golfer Ticket Match Analysis */}
        <div className="bg-[#0D3B66]/80 border border-[#FFF2BA]/25 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA] font-bold block">
              Golfer Active Tickets Matching Engine
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/80">Your 5 Active Scores:</span>
              {userNumbers.length > 0 ? (
                userNumbers.map((num, i) => {
                  const isMatch = currentDrawnBalls.includes(num);
                  return (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                        isMatch
                          ? "bg-[#FFF2BA] text-[#072847] ring-2 ring-white shadow-sm"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {num} pts {isMatch && "★"}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-white/50 italic">No scores logged yet</span>
              )}
            </div>
            <div className="text-xs text-[#C1DBE8]">
              Matches Count: <strong className="text-[#FFF2BA] font-bold text-sm">{matchResult.matchesCount}</strong> of 5 required
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            {matchResult.tier ? (
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#FFF2BA] text-[#072847] shadow-md">
                  <Trophy className="w-4 h-4 fill-current" />
                  Tier {matchResult.tier} Winner ({matchResult.matchesCount} Matches)
                </span>
                <div className="font-serif italic text-2xl sm:text-3xl font-black text-white">
                  {matchResult.tier === 1
                    ? `Jackpot: £${activeJackpot.toLocaleString("en-GB")}`
                    : matchResult.tier === 2
                    ? "Tier 2 Payout: £1,863.75"
                    : "Tier 3 Payout: £1,331.25"}
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/60 bg-black/20 p-3 rounded-xl border border-white/10 max-w-xs">
                {matchResult.matchesCount > 0
                  ? `You matched ${matchResult.matchesCount} number(s). You need 3+ matches to unlock prize pool tier rewards.`
                  : "No matches in this combination. Log next weekend's rounds to refresh your active 5 tickets!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
