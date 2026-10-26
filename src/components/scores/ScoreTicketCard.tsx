"use client";

import React from "react";
import { GolfScore } from "@/types";
import { Calendar, MapPin, Edit2, Trash2, Award, CheckCircle2 } from "lucide-react";

interface ScoreTicketCardProps {
  score: GolfScore;
  index: number;
  totalScores: number;
  onEdit: (score: GolfScore) => void;
  onDelete: (id: string) => void;
}

export function ScoreTicketCard({
  score,
  index,
  totalScores,
  onEdit,
  onDelete,
}: ScoreTicketCardProps) {
  const isLatest = index === 0;
  const isNextToDrop = index === totalScores - 1 && totalScores === 5;

  return (
    <div className="relative bg-white border border-[#E8DEC0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden group">
      {/* Decorative vertical perforated line style on left for ticket feel */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#143A2F]/80"></div>

      {/* Main Ticket Info */}
      <div className="flex items-center gap-5 pl-2">
        {/* Luxury Gold & Forest Score Stamp */}
        <div className="w-16 h-16 rounded-2xl bg-[#0D261E] text-white border-2 border-[#C88D34] flex flex-col items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
          <span className="font-serif italic text-2xl font-black text-[#FAF7F2] leading-none">
            {score.score}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#E8C28A] mt-0.5 font-bold">
            pts
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif italic font-bold text-lg text-[#0D261E]">
              {score.course_name}
            </span>
            {isLatest && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#143A2F] text-white">
                ★ Active Lead Round
              </span>
            )}
            {isNextToDrop && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C88D34]/20 text-[#915E12] border border-[#C88D34]/40">
                ⚠ Next to Drop (§ 05 Rolling)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#748780]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C88D34]" />
              {new Date(score.played_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="font-mono">{score.holes_played} Holes (Stableford)</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Date
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Stamp & Actions */}
      <div className="flex items-center gap-3 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-[#E8DEC0]/60 w-full md:w-auto justify-between md:justify-end">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono uppercase text-[#748780] block">
            Ticket Slot #{index + 1}
          </span>
          <span className="text-xs font-mono font-bold text-[#143A2F]">
            Eligible for 5-Match Draw
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(score)}
            className="p-2 text-[#485953] hover:text-[#143A2F] hover:bg-[#FAF7F2] border border-[#E8DEC0] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Edit score entry"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDelete(score.id)}
            className="p-2 text-[#748780] hover:text-red-700 hover:bg-red-50 border border-[#E8DEC0] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Delete score entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
