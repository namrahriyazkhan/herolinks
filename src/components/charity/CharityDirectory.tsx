"use client";

import React, { useState } from "react";
import { Charity, CharityCategory } from "@/types";
import { useApp } from "@/lib/store/app-context";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";
import {
  Heart,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Users,
  Award,
} from "lucide-react";

export function CharityDirectory() {
  const { charities, currentUser, updateSubscriptionSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCharityForDonation, setSelectedCharityForDonation] = useState<string | null>(null);
  const [activeCharityDrawer, setActiveCharityDrawer] = useState<Charity | null>(null);

  const categories: string[] = [
    "All",
    "Grassroots Youth Golf",
    "Disabled & Adaptive Golf",
    "Veterans Rehabilitation",
    "Urban Outreach & Diversity",
    "Environmental Conservation",
  ];

  const filteredCharities = charities.filter((charity) => {
    const matchesCategory =
      selectedCategory === "All" || charity.category === selectedCategory;
    const matchesSearch =
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (charity.impact_summary?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const handleSelectMyCharity = (charityId: string) => {
    updateSubscriptionSettings({ charityId });
  };

  return (
    <div className="space-y-10">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-[#EFE4C4] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(7,40,71,0.04)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-bold">
              PRD § 08 · Verified Charitable Partners
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#072847] tracking-tight">
              Empowering Community Impact Through Golf
            </h2>
            <p className="text-sm text-[#3E5A74] max-w-xl leading-relaxed">
              Every subscriber directs at least 10% (up to 50%) of their monthly subscription to their chosen cause. Explore verified impact metrics, direct giving options, and upcoming golf charity days.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6786A3] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search causes, regions, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847] font-medium focus:outline-none focus:ring-2 focus:ring-[#C88D34] shadow-inner"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#EFE4C4]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#072847] text-white shadow-sm ring-1 ring-[#0D3B66]"
                  : "bg-[#FAF6EB] text-[#3E5A74] hover:text-[#072847] hover:bg-[#FAF0CA] border border-[#EFE4C4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredCharities.map((charity) => {
          const isUserNominated = currentUser?.charity_id === charity.id;

          return (
            <div
              key={charity.id}
              className="bg-white border border-[#EFE4C4] rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(7,40,71,0.05)] hover:shadow-[0_16px_40px_rgba(7,40,71,0.1)] hover:border-[#C88D34]/50 transition-all duration-300 flex flex-col group"
            >
              {/* Hero Image */}
              <div className="relative h-56 w-full overflow-hidden bg-[#041220]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={charity.hero_image_url}
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 text-[#072847] text-[11px] font-bold backdrop-blur-md shadow-sm">
                    {charity.category}
                  </span>
                  {charity.featured && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#C88D34] to-[#DBA149] text-[#041220] text-[11px] font-black shadow-md border border-white/20">
                      ★ Featured Cause
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="font-serif italic text-2xl sm:text-3xl font-bold leading-tight">
                    {charity.name}
                  </h3>
                  <div className="text-xs text-[#FFF2BA] font-semibold mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C88D34] animate-pulse"></span>
                    <span>£{charity.total_raised.toLocaleString("en-GB")} Raised via Digital Heroes</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-xs sm:text-sm text-[#3E5A74] leading-relaxed line-clamp-3">
                  {charity.description}
                </p>

                {/* Impact Metrics (§ 08.2) */}
                <div className="grid grid-cols-3 gap-2 py-3.5 bg-[#FAF6EB] rounded-2xl px-4 border border-[#EFE4C4] text-center">
                  {charity.impact_metrics.map((m, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="font-serif italic font-bold text-base sm:text-lg text-[#072847]">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-[#6786A3] leading-tight font-medium">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Golf Events (§ 08.2) */}
                {charity.upcoming_events.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-[#6786A3] uppercase tracking-wider block">
                      Upcoming Golf Tournament:
                    </span>
                    {charity.upcoming_events.slice(0, 1).map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-xl bg-[#0D3B66]/5 border border-[#0D3B66]/15 text-xs text-[#072847]"
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span className="font-serif text-sm">{evt.title}</span>
                          <span className="text-[11px] text-[#C88D34] font-mono font-bold">
                            {new Date(evt.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#3E5A74] flex items-center gap-1.5 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C88D34]" />
                          <span>{evt.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE4C4]">
                  <div className="flex items-center gap-2">
                    {isUserNominated ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF0CA] text-[#072847] text-xs font-bold border border-[#C88D34]/40 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#0D3B66]" />
                        <span>Your Nominated Cause</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelectMyCharity(charity.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF6EB] hover:bg-[#FAF0CA] text-[#072847] text-xs font-bold border border-[#EFE4C4] transition-colors"
                      >
                        Nominate Cause
                      </button>
                    )}

                    <button
                      onClick={() => setActiveCharityDrawer(charity)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6EB] text-[#3E5A74] hover:text-[#072847] text-xs font-semibold border border-[#EFE4C4] transition-colors"
                    >
                      Dossier
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCharityForDonation(charity.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#072847] hover:bg-[#0D3B66] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#FFF2BA] fill-[#FFF2BA]/30" />
                    <span>Direct Gift (§ 08.1)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL: Charity Profile Dossier Modal (§ 08.2) */}
      {activeCharityDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF6EB] border border-[#EFE4C4] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setActiveCharityDrawer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-[#072847] shadow-sm transition-colors z-10"
            >
              ✕
            </button>

            {/* Header Hero */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-[#041220] border border-[#EFE4C4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCharityDrawer.hero_image_url}
                alt={activeCharityDrawer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 text-[#072847] text-xs font-bold backdrop-blur-sm">
                  {activeCharityDrawer.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#C88D34] text-white text-xs font-bold shadow-sm">
                  Verified 501(c)(3) / Registered Charity
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif italic text-3xl font-bold">
                  {activeCharityDrawer.name}
                </h3>
                <p className="text-xs text-[#FFF2BA] font-mono mt-1">
                  £{activeCharityDrawer.total_raised.toLocaleString("en-GB")} Raised Through Digital Heroes
                </p>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 08.2 · Official Mission Dossier
              </span>
              <p className="text-sm text-[#072847] leading-relaxed">
                {activeCharityDrawer.description}
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-[#EFE4C4]">
              {activeCharityDrawer.impact_metrics.map((m, i) => (
                <div key={i} className="text-center p-2">
                  <div className="font-serif text-2xl font-bold text-[#072847]">
                    {m.value}
                  </div>
                  <div className="text-[11px] text-[#6786A3] font-medium">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Charity Golf Days (§ 08.2) */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#3E5A74] font-semibold block">
                Upcoming Charity Golf Days & Invitationals:
              </span>
              {activeCharityDrawer.upcoming_events.length > 0 ? (
                <div className="space-y-2">
                  {activeCharityDrawer.upcoming_events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-xl bg-white border border-[#EFE4C4] space-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-[#072847]">
                          {evt.title}
                        </span>
                        <span className="font-mono text-xs text-[#C88D34] font-bold">
                          {new Date(evt.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-[#072847] font-medium">
                        📍 {evt.location}
                      </div>
                      <p className="text-xs text-[#6786A3] leading-relaxed pt-1">
                        {evt.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6786A3] italic">
                  Annual golf tournament schedule being finalized with host links courses.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EFE4C4] flex flex-wrap items-center justify-between gap-3">
              <a
                href={activeCharityDrawer.website_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#0D3B66] hover:underline flex items-center gap-1"
              >
                Visit Official Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSelectMyCharity(activeCharityDrawer.id);
                    setActiveCharityDrawer(null);
                  }}
                  className="px-4 py-2.5 bg-[#FAF6EB] hover:bg-[#FAF0CA] text-[#072847] rounded-xl text-xs font-semibold border border-[#EFE4C4]"
                >
                  Set as My Nominated Cause
                </button>

                <button
                  onClick={() => {
                    const id = activeCharityDrawer.id;
                    setActiveCharityDrawer(null);
                    setSelectedCharityForDonation(id);
                  }}
                  className="px-5 py-2.5 bg-[#072847] hover:bg-[#0D3B66] text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#FFF2BA]" />
                  Direct Gift (§ 08.1)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
