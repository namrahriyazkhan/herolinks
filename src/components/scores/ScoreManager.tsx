"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store/app-context";
import { GolfScore } from "@/types";
import { ScoreTicketCard } from "./ScoreTicketCard";
import {
  Calendar,
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

export function ScoreManager() {
  const {
    userScores,
    addGolfScore,
    updateGolfScore,
    deleteGolfScore,
    currentUser,
    reactivateSubscription,
  } = useApp();

  const [scoreInput, setScoreInput] = useState<string>("36");
  const [playedDate, setPlayedDate] = useState<string>("2026-10-28");
  const [maxDate, setMaxDate] = useState<string>("2026-10-28");
  const [courseName, setCourseName] = useState<string>("");
  const [holesPlayed, setHolesPlayed] = useState<9 | 18>(18);
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPlayedDate(today);
    setMaxDate(today);
  }, []);

  // Form feedback state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isSubscriptionActive = currentUser?.subscription_status === "active";

  // Score statistics
  const metrics = React.useMemo(() => {
    if (userScores.length === 0) {
      return { average: 0, highest: 0, lowest: 0, isDrawEligible: false };
    }
    const scores = userScores.map((s) => s.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      average: Number((sum / scores.length).toFixed(1)),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      isDrawEligible: userScores.length === 5,
    };
  }, [userScores]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const numericScore = parseInt(scoreInput, 10);

    if (isNaN(numericScore) || numericScore < 1 || numericScore > 45) {
      setFeedback({
        type: "error",
        text: "Stableford score must be between 1 and 45 points per PRD Section § 05.",
      });
      return;
    }

    if (!courseName.trim()) {
      setFeedback({
        type: "error",
        text: "Please enter the golf club or course name for verification.",
      });
      return;
    }

    if (editingScore) {
      const res = updateGolfScore({
        id: editingScore.id,
        score: numericScore,
        playedDate,
        courseName,
        holesPlayed,
      });
      if (res.success) {
        setFeedback({
          type: "success",
          text: "Score updated successfully in your rolling 5 queue.",
        });
        setEditingScore(null);
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Failed to update score.",
        });
      }
    } else {
      const res = addGolfScore({
        score: numericScore,
        playedDate,
        courseName,
        holesPlayed,
      });
      if (res.success) {
        setFeedback({
          type: "success",
          text: `Score of ${numericScore} added! Your latest 5 scores are kept rolling automatically.`,
        });
        setScoreInput("36");
        setCourseName("");
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Failed to record score.",
        });
      }
    }
  };

  const startEdit = (score: GolfScore) => {
    setEditingScore(score);
    setScoreInput(score.score.toString());
    setPlayedDate(score.played_date);
    setCourseName(score.course_name);
    setHolesPlayed(score.holes_played);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingScore(null);
    setScoreInput("36");
    setPlayedDate(maxDate);
    setCourseName("");
  };

  return (
    <div className="space-y-8">
      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1">
            Active Scores
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif italic text-3xl font-bold text-[#072847]">
              {userScores.length}
            </span>
            <span className="text-xs text-[#6786A3]">/ 5 required</span>
          </div>
          <span className="text-[11px] text-[#0D3B66] font-semibold mt-1 block">
            {metrics.isDrawEligible ? "✓ Eligible for Draw" : "Log 5 to enter draw"}
          </span>
        </div>

        <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1">
            Stableford Average
          </span>
          <div className="font-serif italic text-3xl font-bold text-[#072847]">
            {metrics.average || "—"}
          </div>
          <span className="text-[11px] text-[#6786A3] mt-1 block">Points per round</span>
        </div>

        <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1">
            Highest Score
          </span>
          <div className="font-serif italic text-3xl font-bold text-[#C88D34]">
            {metrics.highest || "—"}
          </div>
          <span className="text-[11px] text-[#6786A3] mt-1 block">Best 18-hole form</span>
        </div>

        <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6786A3] block mb-1">
            Rolling Logic
          </span>
          <div className="font-serif italic text-lg font-bold text-[#072847] truncate">
            Auto 5-Cap
          </div>
          <span className="text-[11px] text-[#6786A3] mt-1 block">PRD Section § 05</span>
        </div>
      </div>

      {/* Visual 5-Slot Rolling Queue Status Bar (§ 05) */}
      <div className="bg-gradient-to-r from-[#041220] via-[#072847] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#0D3B66]/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C88D34] animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA] font-semibold">
                § 05 · Rolling 5-Score Queue Mechanics
              </span>
            </div>
            <h3 className="font-serif italic text-2xl font-bold text-white tracking-tight">
              Active Draw Ticket Allocation ({userScores.length} of 5 Filled)
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/10 text-[#FFF2BA] border border-white/15 self-start sm:self-auto font-bold">
            {userScores.length === 5 ? "★ 100% Draw Qualified" : `Need ${5 - userScores.length} more round(s)`}
          </span>
        </div>

        {/* 5 Physical Slot Cards */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const scoreItem = userScores[slotIdx];
            const isFilled = !!scoreItem;
            const isLead = slotIdx === 0 && isFilled;
            const isWillDrop = slotIdx === 4 && isFilled;

            return (
              <div
                key={slotIdx}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isLead
                    ? "bg-[#0D3B66] border-[#C88D34] shadow-md ring-1 ring-[#C88D34]"
                    : isWillDrop
                    ? "bg-amber-950/40 border-amber-500/50"
                    : isFilled
                    ? "bg-white/10 border-white/20"
                    : "bg-black/20 border-white/10 border-dashed"
                }`}
              >
                <span className="text-[10px] font-mono uppercase block text-white/60 mb-1">
                  Slot #{slotIdx + 1}
                </span>
                {isFilled ? (
                  <>
                    <span className="font-serif italic text-xl sm:text-2xl font-black text-[#FFFDF7] block leading-none">
                      {scoreItem.score}
                    </span>
                    <span className="text-[9px] font-mono tracking-tight text-[#FFF2BA] block mt-1 truncate font-semibold">
                      {isLead ? "★ Lead" : isWillDrop ? "⚠ Drops" : "Active"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-serif italic text-white/30 block leading-none">—</span>
                    <span className="text-[9px] font-mono text-white/40 block mt-1">Empty</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[#C1DBE8] leading-relaxed pt-1">
          <strong className="text-white">How rolling scores work:</strong> Digital Heroes retains strictly your 5 most recent Stableford rounds in reverse chronological order. When you log a 6th round, your oldest score automatically drops off the queue, ensuring your lottery tickets always reflect your current playing form.
        </p>
      </div>

      {/* Score Submission Form */}
      <div className="bg-white border border-[#EFE4C4] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(7,40,71,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#EFE4C4]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-bold">
              Stableford Score Entry
            </span>
            <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
              {editingScore ? "Edit Selected Golf Round" : "Record New Stableford Round"}
            </h3>
          </div>
          <div className="text-xs text-[#3E5A74] flex items-center gap-2 bg-[#FAF6EB] px-3.5 py-2 rounded-xl border border-[#EFE4C4]">
            <Info className="w-4 h-4 text-[#C88D34]" />
            <span>Valid: 1–45 points • Strictly 1 entry per date</span>
          </div>
        </div>

        {/* § 04 ACCESS CONTROL WARNING */}
        {!isSubscriptionActive && (
          <div className="p-5 rounded-2xl mb-6 bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-[#915E12] shrink-0" />
              <div>
                <strong className="block font-bold text-sm text-[#915E12]">
                  Subscription Status: {currentUser?.subscription_status?.toUpperCase() || "INACTIVE"}
                </strong>
                <span className="text-amber-800">
                  Under PRD Section § 04 (Access Control), an active membership is required to record rounds and qualify for monthly prize draws.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => reactivateSubscription()}
              className="px-5 py-2.5 bg-[#072847] hover:bg-[#0D3B66] text-white rounded-xl font-bold text-xs shrink-0 transition-all shadow-md"
            >
              Reactivate Plan (§ 04)
            </button>
          </div>
        )}

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-3 ${
              feedback.type === "success"
                ? "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/40"
                : "bg-red-50 text-red-950 border border-red-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#0D3B66] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Score Chips Preset */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74] mb-2">
              Quick Preset Stableford Scores
            </label>
            <div className="flex flex-wrap gap-2">
              {[28, 30, 32, 34, 36, 38, 40, 42, 44].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setScoreInput(pts.toString())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    parseInt(scoreInput, 10) === pts
                      ? "bg-[#072847] text-white shadow-sm ring-2 ring-[#C88D34]"
                      : "bg-[#FAF6EB] text-[#3E5A74] hover:bg-[#FAF0CA] border border-[#EFE4C4]"
                  }`}
                >
                  {pts} pts
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Stableford Points Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74] mb-1.5">
                Exact Stableford Points (1–45)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full pl-4 pr-14 py-3 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-2xl font-serif font-black text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#C88D34] shadow-inner"
                />
                <span className="absolute right-4 top-4 text-xs font-mono font-bold text-[#6786A3] uppercase">
                  pts
                </span>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74] mb-1.5">
                Date Round Played
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={playedDate}
                  max={maxDate}
                  onChange={(e) => setPlayedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847] font-medium focus:outline-none focus:ring-2 focus:ring-[#C88D34] shadow-inner"
                />
              </div>
            </div>

            {/* Holes Played */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74] mb-1.5">
                Competition Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHolesPlayed(18)}
                  className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                    holesPlayed === 18
                      ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                      : "bg-[#FAF6EB] text-[#072847] border-[#EFE4C4] hover:bg-[#FAF0CA]"
                  }`}
                >
                  18 Holes Full
                </button>
                <button
                  type="button"
                  onClick={() => setHolesPlayed(9)}
                  className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                    holesPlayed === 9
                      ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                      : "bg-[#FAF6EB] text-[#072847] border-[#EFE4C4] hover:bg-[#FAF0CA]"
                  }`}
                >
                  9 Holes Front/Back
                </button>
              </div>
            </div>
          </div>

          {/* Course Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5A74]">
                Golf Club / Course Name
              </label>
              <span className="text-[11px] text-[#6786A3] font-sans">
                e.g. Royal St George&apos;s, Wentworth, Sunningdale
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Royal St George's Links, Sandwich"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#C88D34] shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isSubscriptionActive}
              className={`inline-flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isSubscriptionActive
                  ? "bg-[#072847] hover:bg-[#0D3B66] text-white border border-[#C88D34]/40"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {!isSubscriptionActive ? (
                <span>Reactivate Subscription to Log Scores (§ 04)</span>
              ) : editingScore ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#FFF2BA]" />
                  <span>Update Verified Score</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#FFF2BA]" />
                  <span>Add to Active Five Queue</span>
                </>
              )}
            </button>

            {editingScore && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-3.5 bg-[#FAF0CA] text-[#072847] hover:bg-[#FFF2BA] rounded-xl text-xs font-bold transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Retained 5 Scores Display */}
      <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE4C4]">
          <div>
            <h4 className="font-serif italic text-2xl font-bold text-[#072847] tracking-tight">
              Current Active 5 Scores
            </h4>
            <p className="text-xs text-[#6786A3]">
              Ordered reverse-chronologically (most recent first). Used automatically in monthly draws.
            </p>
          </div>
          <span className="text-xs font-mono text-[#0D3B66] bg-[#0D3B66]/10 px-3 py-1.5 rounded-full font-bold self-start sm:self-auto border border-[#0D3B66]/20">
            {userScores.length} of 5 Active Slots Filled
          </span>
        </div>

        {userScores.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-[#EFE4C4] rounded-2xl space-y-2">
            <p className="font-serif italic text-lg text-[#072847]">
              No scores recorded yet in your active queue.
            </p>
            <p className="text-xs text-[#6786A3]">
              Submit your first Stableford round above to begin participating in monthly charity draws!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userScores.map((score, index) => (
              <ScoreTicketCard
                key={score.id}
                score={score}
                index={index}
                totalScores={userScores.length}
                onEdit={startEdit}
                onDelete={deleteGolfScore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
