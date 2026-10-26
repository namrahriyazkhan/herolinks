"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { Charity } from "@/types";
import {
  Heart,
  Search,
  Calendar,
  Sparkles,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Users,
} from "lucide-react";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";

export function CharityDirectory() {
  const { charities, currentUser, updateSubscriptionSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCharityForDonation, setSelectedCharityForDonation] = useState<
    string | null
  >(null);
  const [activeCharityDrawer, setActiveCharityDrawer] = useState<Charity | null>(
    null
  );

  const categories = [
    "All",
    "Youth & Access",
    "Health & Medical",
    "Veterans & Rehabilitation",
    "Environmental & Links Care",
  ];

  const filteredCharities = charities.filter((charity) => {
    const matchesCategory =
      selectedCategory === "All" || charity.category === selectedCategory;
    const matchesSearch =
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectMyCharity = (charityId: string) => {
    updateSubscriptionSettings({ charityId });
  };

  return (
    <div className="space-y-8">
      {/* Directory Search & Filter Header */}
      <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
              § 08 · Charity Ecosystem
            </span>
            <h2 className="font-serif italic text-3xl font-bold text-[#0D261E]">
              Vetted Impact Directory
            </h2>
            <p className="text-sm text-[#485953] max-w-xl">
              Every Digital Heroes subscriber directs at least 10% of their subscription to one of
              these vetted non-profits. Discover their work, impact metrics, and upcoming golf days.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#748780] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search causes or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E] focus:outline-none focus:ring-2 focus:ring-[#143A2F]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8DEC0]/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#143A2F] text-white shadow-sm"
                  : "bg-[#FAF7F2] text-[#485953] hover:text-[#0D261E] hover:bg-[#F3ECE2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCharities.map((charity) => {
          const isUserNominated = currentUser?.charity_id === charity.id;

          return (
            <div
              key={charity.id}
              className="bg-white border border-[#E8DEC0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Hero Image */}
              <div className="relative h-52 w-full overflow-hidden bg-[#0D261E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={charity.hero_image_url}
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#0D261E] text-[11px] font-bold backdrop-blur-sm">
                    {charity.category}
                  </span>
                  {charity.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-[#C88D34] text-white text-[11px] font-bold shadow-sm">
                      ★ Featured Spotlight
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif italic text-2xl font-bold leading-tight">
                    {charity.name}
                  </h3>
                  <div className="text-xs text-[#E8C28A] font-medium mt-1">
                    £{charity.total_raised.toLocaleString("en-GB")} Raised to Date
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#485953] leading-relaxed line-clamp-3">
                  {charity.description}
                </p>

                {/* Impact Metrics (§ 08.2) */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-[#FAF7F2] rounded-xl px-3 border border-[#E8DEC0]/60 text-center">
                  {charity.impact_metrics.map((m, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="font-serif font-bold text-sm text-[#0D261E]">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-[#748780] leading-tight">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Golf Events (§ 08.2) */}
                {charity.upcoming_events.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#748780] uppercase tracking-wider block">
                      Upcoming Charity Golf Day:
                    </span>
                    {charity.upcoming_events.slice(0, 1).map((evt) => (
                      <div
                        key={evt.id}
                        className="p-2.5 rounded-lg bg-[#143A2F]/5 border border-[#143A2F]/10 text-xs text-[#143A2F]"
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{evt.title}</span>
                          <span className="text-[11px] text-[#C88D34] font-mono">
                            {new Date(evt.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#485953] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#C88D34]" />
                          <span>{evt.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E8DEC0]/60">
                  {isUserNominated ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      My Nominated Cause
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectMyCharity(charity.id)}
                      className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE2] text-[#0D261E] text-xs font-semibold border border-[#E8DEC0] transition-colors"
                    >
                      Nominate My 10%+
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedCharityForDonation(charity.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#143A2F] hover:bg-[#0D261E] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#E8C28A]" />
                    Direct Gift (§ 08.1)
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Donation Modal */}
      {selectedCharityForDonation && (
        <DirectDonationModal
          isOpen={Boolean(selectedCharityForDonation)}
          onClose={() => setSelectedCharityForDonation(null)}
          defaultCharityId={selectedCharityForDonation}
        />
      )}
    </div>
  );
}
