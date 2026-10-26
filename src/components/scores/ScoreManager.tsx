"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { GolfScore } from "@/types";
import { calculateScoreMetrics } from "@/lib/engine/score-engine";
import {
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  Info,
} from "lucide-react";
import { ScoreTicketCard } from "@/components/scores/ScoreTicketCard";

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
  const [playedDate, setPlayedDate] = useState<string>("2026-03-24");
  const [maxDate, setMaxDate] = useState<string>("2026-03-24");
  const [courseName, setCourseName] = useState<string>("");
  const [holesPlayed, setHolesPlayed] = useState<9 | 18>(18);
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPlayedDate(today);
    setMaxDate(today);
  }, []);

  const metrics = calculateScoreMetrics(userScores);

  const isSubscriptionActive = currentUser?.subscription_status === "active";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const numericScore = parseInt(scoreInput, 10);

    if (editingScore) {
      const res = updateGolfScore({
        id: editingScore.id,
        score: numericScore,
        playedDate,
        courseName: courseName || "Championship Links Course",
        holesPlayed,
      });

      if (!res.success) {
        setFeedback({ type: "error", text: res.error || "Update failed." });
        return;
      }

      setFeedback({ type: "success", text: "Score updated successfully." });
      setEditingScore(null);
    } else {
      const res = addGolfScore({
        score: numericScore,
        playedDate,
        courseName: courseName || "Championship Links Course",
        holesPlayed,
      });

      if (!res.success) {
        setFeedback({ type: "error", text: res.error || "Submission failed." });
        return;
      }

      if (res.droppedOldest) {
        setFeedback({
          type: "success",
          text: "Score logged! Section § 05 Rolling Rule: Your oldest score was automatically replaced.",
        });
      } else {
        setFeedback({
          type: "success",
          text: `Score of ${numericScore} points logged! (${userScores.length + 1}/5 active)`,
        });
      }
    }

    // Reset fields
    setScoreInput("36");
    setCourseName("");
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
        <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
            Active Scores
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif italic text-3xl font-bold text-[#0D261E]">
              {userScores.length}
            </span>
            <span className="text-xs text-[#748780]">/ 5 required</span>
          </div>
          <span className="text-[11px] text-[#2E6E59] font-medium mt-1 block">
            {metrics.isDrawEligible ? "✓ Eligible for Draw" : "Log 5 to enter draw"}
          </span>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
            Stableford Average
          </span>
          <div className="font-serif italic text-3xl font-bold text-[#143A2F]">
            {metrics.average || "—"}
          </div>
          <span className="text-[11px] text-[#748780] mt-1 block">Points per round</span>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
            Highest Score
          </span>
          <div className="font-serif italic text-3xl font-bold text-[#C88D34]">
            {metrics.highest || "—"}
          </div>
          <span className="text-[11px] text-[#748780] mt-1 block">Best 18-hole form</span>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#748780] block mb-1">
            Rolling Logic
          </span>
          <div className="font-serif italic text-lg font-bold text-[#0D261E] truncate">
            Auto 5-Cap
          </div>
          <span className="text-[11px] text-[#748780] mt-1 block">PRD Section § 05</span>
        </div>
      </div>

      {/* Score Submission Form */}
      <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#E8DEC0]/60">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
              § 05 · Score Management Engine
            </span>
            <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
              {editingScore ? "Edit Stableford Score" : "Log Latest Golf Score"}
            </h3>
          </div>
          <div className="text-xs text-[#748780] flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E8DEC0]">
            <Info className="w-4 h-4 text-[#C88D34]" />
            Stableford Range: 1–45 • One entry per date
          </div>
        </div>

        {/* § 04 ACCESS CONTROL WARNING */}
        {!isSubscriptionActive && (
          <div className="p-4 rounded-xl mb-6 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <strong className="block font-semibold">
                  Subscription Status: {currentUser?.subscription_status?.toUpperCase() || "INACTIVE"}
                </strong>
                <span>
                  Under PRD Section § 04 (Access Control), an active membership is required to record rounds and qualify for prize pools.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => reactivateSubscription()}
              className="px-4 py-2 bg-[#143A2F] text-white rounded-xl font-bold text-xs hover:bg-[#0D261E] shrink-0 transition-all shadow-sm"
            >
              Reactivate via Stripe (§ 04)
            </button>
          </div>
        )}

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-2.5 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stableford Points Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1.5">
                Stableford Score (1–45)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-xl font-serif font-bold text-[#0D261E] focus:outline-none focus:ring-2 focus:ring-[#143A2F]"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#748780] font-medium">
                  pts
                </span>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1.5">
                Date Played
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={playedDate}
                  max={maxDate}
                  onChange={(e) => setPlayedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E] focus:outline-none focus:ring-2 focus:ring-[#143A2F]"
                />
              </div>
            </div>

            {/* Holes Played */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1.5">
                Holes Played
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHolesPlayed(18)}
                  className={`py-3 text-sm font-semibold rounded-xl border transition-all ${
                    holesPlayed === 18
                      ? "bg-[#143A2F] text-white border-[#0D261E]"
                      : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                  }`}
                >
                  18 Holes
                </button>
                <button
                  type="button"
                  onClick={() => setHolesPlayed(9)}
                  className={`py-3 text-sm font-semibold rounded-xl border transition-all ${
                    holesPlayed === 9
                      ? "bg-[#143A2F] text-white border-[#0D261E]"
                      : "bg-[#FAF7F2] text-[#0D261E] border-[#E8DEC0]"
                  }`}
                >
                  9 Holes
                </button>
              </div>
            </div>
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1.5">
              Golf Course / Competition Name
            </label>
            <input
              type="text"
              placeholder="e.g. Royal St George's Links, Sandwich"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E] focus:outline-none focus:ring-2 focus:ring-[#143A2F]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!isSubscriptionActive}
              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-sm shadow-md transition-all ${
                isSubscriptionActive
                  ? "bg-[#143A2F] hover:bg-[#0D261E] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {!isSubscriptionActive ? (
                <span>Reactivate Subscription to Log Scores (§ 04)</span>
              ) : editingScore ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#E8C28A]" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#E8C28A]" />
                  Log Score to Active Five
                </>
              )}
            </button>

            {editingScore && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-3 bg-[#F3ECE2] text-[#485953] hover:text-[#0D261E] rounded-xl text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Retained 5 Scores Display */}
      <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="font-serif italic text-xl font-bold text-[#0D261E]">
              Current Active 5 Scores
            </h4>
            <p className="text-xs text-[#748780]">
              Ordered reverse-chronologically (most recent first). Used automatically in monthly draws.
            </p>
          </div>
          <span className="text-xs font-mono text-[#143A2F] bg-[#143A2F]/10 px-3 py-1 rounded-full font-semibold">
            {userScores.length} of 5 Active Slots Filled
          </span>
        </div>

        {userScores.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-[#E8DEC0] rounded-xl">
            <p className="text-sm text-[#748780]">
              No scores recorded yet. Submit your first Stableford round above!
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
