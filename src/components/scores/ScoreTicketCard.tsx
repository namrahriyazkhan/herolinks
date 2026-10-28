"use client";

import React from "react";
import { GolfScore } from "@/types";
import { Calendar, MapPin, Edit2, Trash2, Award, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

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
    <div className="relative bg-white border border-[#EFE4C4] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(7,40,71,0.04)] hover:shadow-[0_12px_32px_rgba(7,40,71,0.09)] hover:border-[#C88D34]/60 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden group">
      {/* Decorative left Yale Navy accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-[#041220] via-[#072847] to-[#0D3B66]"></div>

      {/* Main Ticket Info */}
      <div className="flex items-center gap-5 pl-2">
        {/* Luxury Gold & Yale Blue Score Stamp with 3D spherical depth */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#072847] to-[#0D3B66] text-white border-2 border-[#C88D34] flex flex-col items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:border-[#FFF2BA] transition-all duration-300">
          <span className="font-serif italic text-3xl font-black text-[#FFFDF7] leading-none tracking-tight">
            {score.score}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFF2BA] mt-1 font-bold">
            POINTS
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif italic font-bold text-lg sm:text-xl text-[#072847] tracking-tight">
              {score.course_name}
            </span>
            {isLatest && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0D3B66] text-[#FFF2BA] shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-[#FFF2BA]" />
                Lead Round
              </span>
            )}
            {isNextToDrop && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-[#915E12] border border-[#C88D34]/40">
                <AlertTriangle className="w-2.5 h-2.5 text-[#C88D34]" />
                Next to Drop (§ 05 Rolling Queue)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6786A3]">
            <span className="flex items-center gap-1.5 font-medium text-[#3E5A74]">
              <Calendar className="w-3.5 h-3.5 text-[#C88D34]" />
              {new Date(score.played_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-[#EFE4C4]">•</span>
            <span className="font-mono bg-[#FAF6EB] text-[#072847] px-2 py-0.5 rounded text-[11px] border border-[#EFE4C4]">
              {score.holes_played} Holes Stableford
            </span>
            <span className="text-[#EFE4C4]">•</span>
            <span className="text-[#0D3B66] font-semibold flex items-center gap-1 text-[11px] bg-[#FAF0CA]/60 px-2 py-0.5 rounded-full border border-[#C88D34]/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D3B66]" />
              Verified Unique Date
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Stamp & Actions */}
      <div className="flex items-center gap-4 self-end md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-[#EFE4C4] w-full md:w-auto justify-between md:justify-end">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6786A3] block">
            Draw Ticket Slot #{index + 1} of 5
          </span>
          <span className="text-xs font-mono font-bold text-[#0D3B66]">
            Eligible for 5-Number Pool
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(score)}
            className="px-3 py-2 text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF6EB] hover:border-[#0D3B66]/40 border border-[#EFE4C4] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
            title="Edit score entry"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#C88D34]" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(score.id)}
            className="p-2 text-[#6786A3] hover:text-red-700 hover:bg-red-50 hover:border-red-300 border border-[#EFE4C4] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
            title="Delete score entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
