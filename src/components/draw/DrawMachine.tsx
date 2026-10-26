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
              colors: ["#C88D34", "#143A2F", "#E8C28A"],
            });
          } catch {
            // ignore
          }
        }
      }
    }, 450);
  };

  return (
    <div className="bg-[#071712] text-white rounded-3xl p-6 sm:p-10 border border-[#143A2F] shadow-2xl relative overflow-hidden">
      {/* Background ambient gold aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C88D34]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C88D34]/20 text-[#E8C28A] text-xs font-mono font-bold border border-[#C88D34]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#C88D34]" />
                PRD § 06 & § 07 Draw Engine
              </span>
              <span className="text-xs text-white/50 font-mono hidden sm:inline">
                5-Number Stableford Match (1–45)
              </span>
            </div>
            <h3 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#FAF7F2]">
              The Interactive Draw Tumbler
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#143A2F]/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setDrawMode("algorithmic")}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                drawMode === "algorithmic"
                  ? "bg-[#C88D34] text-[#071712] font-bold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Algorithmic (Score-Weighted)
            </button>
            <button
              onClick={() => setDrawMode("random")}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                drawMode === "random"
                  ? "bg-[#C88D34] text-[#071712] font-bold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Standard Random
            </button>
          </div>
        </div>

        {/* Tumbler Glass Stage with 5 Ball Chambers */}
        <div className="bg-[#0D261E]/90 border-2 border-[#143A2F] rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-inner">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E8C28A]">
            {isDrawing ? "Drawing balls in real-time..." : "Current Drawn Combination"}
          </span>

          {/* 5 Ball Holders */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4">
            {[0, 1, 2, 3, 4].map((slotIndex) => {
              const ballNumber = currentDrawnBalls[slotIndex];
              const isFilled = ballNumber !== undefined;
              const isUserMatch =
                isFilled && userNumbers.includes(ballNumber);

              return (
                <div key={slotIndex} className="relative group">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-500 transform ${
                      isFilled
                        ? "bg-[#FAF7F2] text-[#071712] scale-100 shadow-2xl border-4 border-[#C88D34]"
                        : "bg-[#071712] border-2 border-dashed border-white/20 text-white/30 scale-95"
                    } ${isUserMatch ? "ring-4 ring-[#E8C28A] animate-pulse" : ""}`}
                  >
                    {isFilled ? (
                      <>
                        <span className="font-serif text-2xl sm:text-3xl font-black leading-none">
                          {ballNumber}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[#748780] mt-0.5">
                          pts
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-xs opacity-40">#{slotIndex + 1}</span>
                    )}
                  </div>

                  {isUserMatch && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#C88D34] text-[#071712] text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Your Match!
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
                  : "bg-[#C88D34] hover:bg-[#E09F45] text-[#071712] transform hover:scale-[1.02]"
              }`}
            >
              <Play className={`w-5 h-5 ${isDrawing ? "animate-spin" : ""}`} />
              <span>{isDrawing ? "Rolling Tumbler..." : "Spin New Draw Simulation"}</span>
            </button>

            <span className="text-xs font-mono text-white/50">
              {drawMode === "algorithmic"
                ? "Weighted by submitted UK/IRE competition scores"
                : "Uniform 1–45 fair lottery distribution"}
            </span>
          </div>
        </div>

        {/* Live Golfer Ticket Match Analysis */}
        <div className="bg-[#143A2F]/60 border border-[#215444] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#E8C28A]">
              Live Golfer Match Outcome
            </span>
            <div className="text-sm text-white/90">
              Your Active 5 Scores:{" "}
              <strong className="text-white">[{userNumbers.join(", ") || "No scores logged"}]</strong>
            </div>
            <div className="text-xs text-[#BDE3D5]/80">
              Matches Count: <strong className="text-[#E8C28A]">{matchResult.matchesCount}</strong> of 5
            </div>
          </div>

          <div className="text-left sm:text-right">
            {matchResult.tier ? (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C88D34] text-[#071712]">
                  <Trophy className="w-3.5 h-3.5" />
                  Tier {matchResult.tier} Winner ({matchResult.matchesCount} Matches)
                </span>
                <div className="font-serif italic text-2xl font-black text-white">
                  {matchResult.tier === 1
                    ? `Jackpot Share: £${activeJackpot.toLocaleString("en-GB")}`
                    : matchResult.tier === 2
                    ? "Tier 2 Share: 35% Pool"
                    : "Tier 3 Share: 25% Pool"}
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/50">
                {matchResult.matchesCount > 0
                  ? `Matched ${matchResult.matchesCount} numbers. Need 3+ for prize distribution.`
                  : "No matches in this combination. Log updated rounds!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
