"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { X, Upload, Check, ShieldCheck, Image as ImageIcon } from "lucide-react";

interface ProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawEntryId: string;
  drawId: string;
  drawTitle: string;
  prizeAmount: number;
  tier: 1 | 2 | 3;
  matchesCount: number;
  matchingNumbers: number[];
}

export function ProofUploadModal({
  isOpen,
  onClose,
  drawEntryId,
  drawId,
  drawTitle,
  prizeAmount,
  tier,
  matchesCount,
  matchingNumbers,
}: ProofUploadModalProps) {
  const { submitWinnerProof } = useApp();

  const [platform, setPlatform] = useState<
    "HowDidiDo" | "GHIN" | "Golf Ireland" | "England Golf" | "Other Club App"
  >("HowDidiDo");
  const [proofUrl, setProofUrl] = useState(
    "https://images.unsplash.com/photo-1593111774642-a14644a4fa85?auto=format&fit=crop&w=800&q=80"
  );
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWinnerProof({
      drawEntryId,
      drawId,
      drawTitle,
      prizeAmount,
      tier,
      matchesCount,
      matchingNumbers,
      golfPlatform: platform,
      proofImageUrl: proofUrl,
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#485953] hover:text-[#0D261E] rounded-full hover:bg-[#F3ECE2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {uploadSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#143A2F] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 text-[#E8C28A]" />
            </div>
            <h3 className="font-serif italic font-semibold text-2xl text-[#0D261E]">
              Scorecard Proof Submitted!
            </h3>
            <p className="text-sm text-[#485953] max-w-sm mx-auto">
              Our audit committee is verifying your {platform} score record. Your payment status will update from <strong>Pending</strong> to <strong>Paid</strong> once validated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C88D34]/15 text-[#915E12] text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C88D34]" />
                PRD Section § 09 · Winner Verification
              </span>
              <h3 className="font-serif italic text-2xl text-[#0D261E] font-semibold">
                Submit Golf Platform Proof
              </h3>
              <p className="text-xs text-[#748780] mt-1">
                Upload a scorecard screenshot from your verified club handicap platform to claim your prize.
              </p>
            </div>

            {/* Win summary banner */}
            <div className="p-4 rounded-xl bg-[#143A2F] text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#E8C28A] uppercase font-mono tracking-wider">
                  Tier {tier} Winner ({matchesCount} Matches)
                </span>
                <span className="text-lg font-serif italic font-bold text-white">
                  £{prizeAmount.toLocaleString("en-GB")}
                </span>
              </div>
              <div className="text-xs text-white/80">
                Draw: <span className="text-white font-medium">{drawTitle}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <span>Matched Numbers:</span>
                <div className="flex gap-1">
                  {matchingNumbers.map((n) => (
                    <span
                      key={n}
                      className="px-1.5 py-0.5 rounded bg-[#C88D34] text-[#0D261E] font-bold text-[10px]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Select Golf Platform */}
            <div>
              <label className="block text-xs font-semibold text-[#485953] mb-1.5">
                Official Golf Platform
              </label>
              <select
                value={platform}
                onChange={(e) =>
                  setPlatform(
                    e.target.value as
                      | "HowDidiDo"
                      | "GHIN"
                      | "Golf Ireland"
                      | "England Golf"
                      | "Other Club App"
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC0] bg-white text-sm text-[#0D261E]"
              >
                <option value="HowDidiDo">HowDidiDo (UK & Ireland)</option>
                <option value="GHIN">USGA GHIN System</option>
                <option value="England Golf">England Golf WHS App</option>
                <option value="Golf Ireland">Golf Ireland WHS App</option>
                <option value="Other Club App">Official Club Scorecard / VPAR</option>
              </select>
            </div>

            {/* Screenshot upload / sample preview */}
            <div>
              <label className="block text-xs font-semibold text-[#485953] mb-1.5">
                Scorecard Screenshot URL / Upload
              </label>
              <input
                type="url"
                required
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DEC0] bg-white text-[#0D261E] mb-2"
                placeholder="https://... screenshot image url"
              />

              <div className="relative border-2 border-dashed border-[#E8DEC0] rounded-xl p-3 bg-white text-center">
                <div className="h-32 w-full relative overflow-hidden rounded-lg bg-[#FAF7F2] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofUrl}
                    alt="Proof Preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-xs font-semibold">
                    <ImageIcon className="w-4 h-4 mr-1.5" />
                    Preview: Official Platform Record
                  </div>
                </div>
                <p className="text-[11px] text-[#748780] mt-2">
                  Ensure the date, Stableford point tally, and player signature are clearly legible.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#E8C28A]" />
              Transmit Proof to Audit Board
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
