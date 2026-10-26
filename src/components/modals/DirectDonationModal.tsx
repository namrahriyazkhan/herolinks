"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { X, Heart, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface DirectDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCharityId?: string;
}

export function DirectDonationModal({
  isOpen,
  onClose,
  defaultCharityId,
}: DirectDonationModalProps) {
  const { charities, makeDirectDonation } = useApp();
  const [selectedCharityId, setSelectedCharityId] = useState(
    defaultCharityId || charities[0]?.id || "charity-youth-on-course"
  );
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("Marcus Vance");
  const [donorEmail, setDonorEmail] = useState("marcus.vance@links.co.uk");
  const [message, setMessage] = useState("Proud to support junior golf access!");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [25, 50, 100, 250];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    makeDirectDonation({
      charityId: selectedCharityId,
      amount: finalAmount,
      donorName,
      donorEmail,
      message,
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#143A2F", "#C88D34", "#215444", "#FAF7F2"],
      });
    } catch {
      // ignore
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const selectedCharity = charities.find((c) => c.id === selectedCharityId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#485953] hover:text-[#0D261E] rounded-full hover:bg-[#F3ECE2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#143A2F] text-[#FAF7F2] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 text-[#E8C28A]" />
            </div>
            <h3 className="font-serif italic font-semibold text-2xl text-[#0D261E]">
              Thank You for Giving Back
            </h3>
            <p className="text-sm text-[#485953] max-w-xs mx-auto">
              Your gift of £{customAmount || amount} to {selectedCharity?.name} has been processed with 0% platform fee deduction.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143A2F]/10 text-[#143A2F] text-xs font-semibold mb-2">
                <Heart className="w-3.5 h-3.5 text-[#C88D34]" />
                PRD Section § 08.1
              </span>
              <h3 className="font-serif italic text-2xl text-[#0D261E] font-semibold">
                Direct Independent Gift
              </h3>
              <p className="text-xs text-[#748780] mt-1">
                Donate directly to any certified partner charity outside the monthly draw engine.
              </p>
            </div>

            {/* Select Charity */}
            <div>
              <label className="block text-xs font-semibold text-[#485953] mb-1.5">
                Recipient Charity
              </label>
              <select
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC0] bg-white text-sm text-[#0D261E]"
              >
                {charities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount pills */}
            <div>
              <label className="block text-xs font-semibold text-[#485953] mb-1.5">
                Donation Amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setAmount(q);
                      setCustomAmount("");
                    }}
                    className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                      amount === q && !customAmount
                        ? "bg-[#143A2F] text-white border-[#0D261E]"
                        : "bg-white text-[#0D261E] border-[#E8DEC0]"
                    }`}
                  >
                    £{q}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount in £"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white text-[#0D261E]"
              />
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#485953] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#485953] mb-1">
                  Email for Gift Receipt
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#485953] mb-1">
                Dedication Note (Optional)
              </label>
              <input
                type="text"
                placeholder="In honour of..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#C88D34]" />
              Confirm Gift of £{customAmount || amount}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
