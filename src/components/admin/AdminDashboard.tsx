"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { Charity, DrawLogicType, GolfScore, UserProfile } from "@/types";
import {
  ShieldAlert,
  Users,
  Trophy,
  Heart,
  BarChart3,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Calendar,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

export function AdminDashboard() {
  const {
    allUsers,
    allScores,
    charities,
    draws,
    verifications,
    stats,
    updateSubscriptionSettings,
    addCharity,
    updateCharity,
    deleteCharity,
    runSimulation,
    publishSimulatedDraw,
    reviewVerification,
    markPayoutCompleted,
    updateGolfScore,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "users" | "draws" | "charities" | "winners" | "analytics"
  >("draws");

  // Draw simulation state (§ 11.02)
  const [drawTitle, setDrawTitle] = useState(
    "April 2026 Spring Masters Charity Draw"
  );
  const [drawLogic, setDrawLogic] = useState<DrawLogicType>("algorithmic");
  const [rolloverIn, setRolloverIn] = useState<number>(3720);
  const [customNumbersInput, setCustomNumbersInput] = useState("");
  const [simulationResult, setSimulationResult] = useState<ReturnType<
    typeof runSimulation
  > | null>(null);

  // Charity management state (§ 11.03)
  const [newCharityName, setNewCharityName] = useState("");
  const [newCharityTagline, setNewCharityTagline] = useState("");
  const [newCharityDesc, setNewCharityDesc] = useState("");
  const [newCharityCategory, setNewCharityCategory] = useState<
    | "Youth & Access"
    | "Health & Medical"
    | "Veterans & Rehabilitation"
    | "Environmental & Links Care"
  >("Youth & Access");
  const [newCharityHero, setNewCharityHero] = useState(
    "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80"
  );
  const [newCharityWeb, setNewCharityWeb] = useState("https://example.org");
  const [isAddingCharity, setIsAddingCharity] = useState(false);

  // User management state (§ 11.01)
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserProfile | null>(null);
  const [selectedUserScores, setSelectedUserScores] = useState<GolfScore[]>([]);

  // Winner verification review notes (§ 11.04)
  const [reviewNotes, setReviewNotes] = useState("");
  const [payoutRef, setPayoutRef] = useState("PAY-REF-2026-");

  // Handler: Run Draw Simulation
  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();

    let fixedNumbers: number[] | undefined;
    if (customNumbersInput.trim()) {
      const parts = customNumbersInput
        .split(",")
        .map((p) => parseInt(p.trim(), 10))
        .filter((n) => !isNaN(n) && n >= 1 && n <= 45);
      if (parts.length === 5) {
        fixedNumbers = parts;
      }
    }

    const result = runSimulation({
      drawTitle,
      drawLogic,
      rolloverIn,
      fixedNumbers,
    });

    setSimulationResult(result);
  };

  // Handler: Publish Draw
  const handlePublishDraw = () => {
    if (!simulationResult) return;
    publishSimulatedDraw(simulationResult);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    alert(`Draw "${simulationResult.draw.title}" successfully published! Winner notifications and verification records generated.`);
    setSimulationResult(null);
  };

  // Handler: Add Charity
  const handleAddCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharityName) return;

    addCharity({
      name: newCharityName,
      slug: newCharityName.toLowerCase().replace(/\s+/g, "-"),
      tagline: newCharityTagline,
      description: newCharityDesc,
      category: newCharityCategory,
      hero_image_url: newCharityHero,
      featured: false,
      impact_metrics: [
        { label: "Community Rounds", value: "500+" },
        { label: "Impact Score", value: "98%" },
      ],
      upcoming_events: [],
      website_url: newCharityWeb,
    });

    setNewCharityName("");
    setNewCharityTagline("");
    setNewCharityDesc("");
    setIsAddingCharity(false);
  };

  return (
    <div className="space-y-8">
      {/* Admin Center Header (§ 11) */}
      <div className="bg-[#0D261E] text-white rounded-3xl p-6 sm:p-8 border border-[#143A2F] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C88D34]/20 text-[#E8C28A] text-xs font-semibold border border-[#C88D34]/30">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C88D34]" />
              Platform Administrator Surface (§ 11)
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#FAF7F2]">
              Administrative Operations Console
            </h1>
            <p className="text-xs text-[#BDE3D5]/80 max-w-xl">
              Full control over User Management, Draw Simulations & Publishing, Charity Directory,
              Winner Verification Audits, and Live Analytics.
            </p>
          </div>

          <div className="bg-[#143A2F] border border-[#215444] rounded-2xl p-4 text-xs space-y-1">
            <div className="text-white/60 font-mono">Logged in as:</div>
            <div className="font-bold text-white font-serif text-base">Eleanor Rostova</div>
            <div className="text-[#E8C28A]">Platform Director</div>
          </div>
        </div>

        {/* 5 Surface Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab("users")}
            className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "users"
                ? "bg-[#C88D34] text-[#0D261E] shadow-sm"
                : "bg-[#143A2F] text-white/80 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            01 User Mgmt
          </button>

          <button
            onClick={() => setActiveTab("draws")}
            className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "draws"
                ? "bg-[#C88D34] text-[#0D261E] shadow-sm"
                : "bg-[#143A2F] text-white/80 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            02 Draw Engine
          </button>

          <button
            onClick={() => setActiveTab("charities")}
            className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "charities"
                ? "bg-[#C88D34] text-[#0D261E] shadow-sm"
                : "bg-[#143A2F] text-white/80 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            03 Charities
          </button>

          <button
            onClick={() => setActiveTab("winners")}
            className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "winners"
                ? "bg-[#C88D34] text-[#0D261E] shadow-sm"
                : "bg-[#143A2F] text-white/80 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            04 Winners & Proof
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "analytics"
                ? "bg-[#C88D34] text-[#0D261E] shadow-sm"
                : "bg-[#143A2F] text-white/80 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            05 Analytics
          </button>
        </div>
      </div>

      {/* SURFACE 01: USER MANAGEMENT (§ 11.01) */}
      {activeTab === "users" && (
        <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.01 · Subscriber Controls
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Registered Users & Golf Scores
              </h2>
            </div>
            <div className="text-xs text-[#748780] bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#E8DEC0]">
              Total Subscribers: {allUsers.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#485953] uppercase font-mono border-b border-[#E8DEC0]">
                <tr>
                  <th className="p-3">Golfer Name / Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Pledged Charity</th>
                  <th className="p-3">Scores Count</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DEC0]/60">
                {allUsers.map((user) => {
                  const userScoreList = allScores.filter((s) => s.user_id === user.id);
                  const charity = charities.find((c) => c.id === user.charity_id);

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#0D261E]">{user.full_name}</div>
                        <div className="text-[11px] text-[#748780]">{user.email}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 capitalize">
                        <div>
                          {user.subscription_tier} ({user.subscription_status})
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="truncate max-w-[140px] font-medium text-[#143A2F]">
                          {charity?.name}
                        </div>
                        <div className="text-[10px] text-[#C88D34] font-semibold">
                          {user.charity_percentage}% pledge
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[#0D261E]">
                        {userScoreList.length} / 5 Logged
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedUserForEdit(user);
                            setSelectedUserScores(userScoreList);
                          }}
                          className="px-2.5 py-1 bg-[#143A2F] text-white rounded-lg text-[11px] font-semibold hover:bg-[#0D261E]"
                        >
                          Inspect / Edit Scores
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* User Score Inspector Drawer */}
          {selectedUserForEdit && (
            <div className="p-6 bg-[#FAF7F2] border border-[#E8DEC0] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif italic font-bold text-xl text-[#0D261E]">
                    Managing Scores for: {selectedUserForEdit.full_name}
                  </h4>
                  <p className="text-xs text-[#748780]">
                    Admin Override Surface (§ 11.01: "Edit golf scores")
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-3 py-1.5 bg-white border border-[#E8DEC0] rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {selectedUserScores.map((sc, i) => (
                  <div
                    key={sc.id}
                    className="p-3 bg-white border border-[#E8DEC0] rounded-xl text-center space-y-1"
                  >
                    <div className="text-[10px] text-[#748780]">Score #{i + 1}</div>
                    <div className="font-serif italic text-2xl font-bold text-[#143A2F]">
                      {sc.score} pts
                    </div>
                    <div className="text-[11px] font-mono text-[#748780]">{sc.played_date}</div>
                    <div className="text-[10px] text-[#0D261E] truncate">{sc.course_name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SURFACE 02: DRAW MANAGEMENT & SIMULATIONS (§ 11.02) */}
      {activeTab === "draws" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.02 · Draw Engine & Pre-Publish Simulation
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Configure, Simulate & Publish Monthly Draws
              </h2>
              <p className="text-xs text-[#748780] mt-1">
                The PRD requires full simulation before publishing results with automated 40/35/25 tier calculations and rollover logic.
              </p>
            </div>

            <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1">
                  Draw Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  value={drawTitle}
                  onChange={(e) => setDrawTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1">
                  Draw Engine Logic (§ 06)
                </label>
                <select
                  value={drawLogic}
                  onChange={(e) => setDrawLogic(e.target.value as DrawLogicType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E]"
                >
                  <option value="algorithmic">
                    Algorithmic — Weighted by Golfer Score Frequency
                  </option>
                  <option value="random">Random — Standard Fair Lottery Style</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1">
                  Rollover Jackpot from Prior Draw (£)
                </label>
                <input
                  type="number"
                  value={rolloverIn}
                  onChange={(e) => setRolloverIn(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#485953] mb-1">
                  Optional Fixed Winning Numbers (e.g. 29, 34, 36, 38, 41) for Testing
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generated draw balls"
                  value={customNumbersInput}
                  onChange={(e) => setCustomNumbersInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8DEC0] bg-[#FAF7F2] text-sm text-[#0D261E]"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#143A2F] hover:bg-[#0D261E] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
                >
                  <Play className="w-4 h-4 text-[#E8C28A]" />
                  Execute Full Community Simulation (§ 11.02)
                </button>
              </div>
            </form>

            {/* Simulation Preview Card */}
            {simulationResult && (
              <div className="p-6 bg-[#FAF7F2] border-2 border-[#C88D34] rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC0]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-bold">
                      Simulation Complete (Draft Mode)
                    </span>
                    <h3 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                      {simulationResult.draw.title}
                    </h3>
                  </div>

                  <button
                    onClick={handlePublishDraw}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C88D34] hover:bg-[#E09F45] text-[#0D261E] font-bold rounded-xl text-sm shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Publish Results to All Subscribers (§ 11.02)
                  </button>
                </div>

                {/* Simulated Numbers */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#748780] block mb-2">
                    Simulated Winning Balls:
                  </span>
                  <div className="flex gap-2">
                    {simulationResult.draw.winning_numbers.map((num) => (
                      <span
                        key={num}
                        className="w-12 h-12 rounded-full bg-[#143A2F] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 40 / 35 / 25 Tier Breakdown (§ 07) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#E8DEC0]">
                    <div className="text-xs text-[#748780] uppercase font-mono">
                      Tier 1: 5-Match (40% + Rollover)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
                      £{simulationResult.draw.tier1_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#2E6E59] font-medium mt-1">
                      {simulationResult.tier1Winners.length} Winners • £
                      {simulationResult.draw.tier1_payout_per_winner.toLocaleString("en-GB")} each
                    </div>
                    {simulationResult.tier1Winners.length === 0 && (
                      <div className="text-[11px] text-[#C88D34] font-bold mt-1">
                        Unclaimed! £{simulationResult.rolloverCarriedForward.toLocaleString()} carries forward.
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#E8DEC0]">
                    <div className="text-xs text-[#748780] uppercase font-mono">
                      Tier 2: 4-Match (35%)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
                      £{simulationResult.draw.tier2_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#2E6E59] font-medium mt-1">
                      {simulationResult.tier2Winners.length} Winners • £
                      {simulationResult.draw.tier2_payout_per_winner.toLocaleString("en-GB")} each
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#E8DEC0]">
                    <div className="text-xs text-[#748780] uppercase font-mono">
                      Tier 3: 3-Match (25%)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#0D261E]">
                      £{simulationResult.draw.tier3_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#2E6E59] font-medium mt-1">
                      {simulationResult.tier3Winners.length} Winners • £
                      {simulationResult.draw.tier3_payout_per_winner.toLocaleString("en-GB")} each
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SURFACE 03: CHARITY MANAGEMENT (§ 11.03) */}
      {activeTab === "charities" && (
        <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.03 · Cause Ecosystem
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Add, Edit & Audit Charity Listings
              </h2>
            </div>
            <button
              onClick={() => setIsAddingCharity(!isAddingCharity)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143A2F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D261E]"
            >
              <Plus className="w-4 h-4" />
              {isAddingCharity ? "Cancel Form" : "Add New Partner Charity"}
            </button>
          </div>

          {isAddingCharity && (
            <form
              onSubmit={handleAddCharity}
              className="p-6 bg-[#FAF7F2] border border-[#E8DEC0] rounded-xl space-y-4"
            >
              <h4 className="font-serif italic font-bold text-lg text-[#0D261E]">
                Register New Charity Organization
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#485953] mb-1">
                    Charity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCharityName}
                    onChange={(e) => setNewCharityName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#485953] mb-1">
                    Category
                  </label>
                  <select
                    value={newCharityCategory}
                    onChange={(e) =>
                      setNewCharityCategory(
                        e.target.value as
                          | "Youth & Access"
                          | "Health & Medical"
                          | "Veterans & Rehabilitation"
                          | "Environmental & Links Care"
                      )
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                  >
                    <option value="Youth & Access">Youth & Access</option>
                    <option value="Health & Medical">Health & Medical</option>
                    <option value="Veterans & Rehabilitation">
                      Veterans & Rehabilitation
                    </option>
                    <option value="Environmental & Links Care">
                      Environmental & Links Care
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#485953] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={newCharityTagline}
                  onChange={(e) => setNewCharityTagline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#485953] mb-1">
                  Full Mission Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newCharityDesc}
                  onChange={(e) => setNewCharityDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E8DEC0] bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#143A2F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D261E]"
              >
                Save Charity to Directory
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map((charity) => (
              <div
                key={charity.id}
                className="p-4 border border-[#E8DEC0] rounded-xl flex items-center justify-between gap-4 bg-[#FAF7F2]"
              >
                <div>
                  <div className="font-bold text-sm text-[#0D261E]">{charity.name}</div>
                  <div className="text-xs text-[#748780]">{charity.category}</div>
                  <div className="text-xs text-[#C88D34] font-semibold mt-1">
                    £{charity.total_raised.toLocaleString("en-GB")} Raised
                  </div>
                </div>

                <button
                  onClick={() => deleteCharity(charity.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove charity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURFACE 04: WINNERS & PROOF VERIFICATION (§ 11.04) */}
      {activeTab === "winners" && (
        <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.04 · Winner Audit & Payout Processing
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#0D261E]">
                Scorecard Proof Submissions
              </h2>
            </div>
            <div className="text-xs text-[#748780] bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#E8DEC0]">
              Total Winner Records: {verifications.length}
            </div>
          </div>

          <div className="space-y-4">
            {verifications.map((verif) => (
              <div
                key={verif.id}
                className="p-6 rounded-2xl border border-[#E8DEC0] bg-[#FAF7F2] space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#0D261E]">
                        {verif.user_name}
                      </span>
                      <span className="text-xs text-[#748780]">({verif.user_email})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C88D34] text-[#0D261E]">
                        Tier {verif.tier} Winner
                      </span>
                    </div>
                    <div className="text-xs text-[#485953]">
                      Draw: <strong>{verif.draw_title}</strong> • Matched: [
                      {verif.matching_numbers.join(", ")}]
                    </div>
                    <div className="text-xs text-[#748780]">
                      Platform: <strong>{verif.golf_platform_name}</strong> • Prize:{" "}
                      <strong className="text-[#143A2F]">
                        £{verif.prize_amount.toLocaleString("en-GB")}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        verif.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : verif.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Audit: {verif.status}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        verif.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Payout: {verif.payment_status}
                    </span>
                  </div>
                </div>

                {/* Scorecard Screenshot Preview (§ 09) */}
                <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-[#E8DEC0]">
                  {verif.proof_image_url && (
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[#E8DEC0] bg-white relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={verif.proof_image_url}
                        alt="Scorecard Proof"
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={verif.proof_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        Inspect Full Image
                      </a>
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    <div className="text-xs text-[#748780]">
                      Admin Feedback Notes:{" "}
                      <span className="text-[#0D261E] italic">
                        {verif.admin_notes || "No audit notes recorded yet."}
                      </span>
                    </div>

                    {/* Verification Controls (§ 11.04) */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {verif.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              reviewVerification(
                                verif.id,
                                "approved",
                                "Verified against WHS score registry."
                              )
                            }
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve Scorecard
                          </button>
                          <button
                            onClick={() =>
                              reviewVerification(
                                verif.id,
                                "rejected",
                                "Scorecard illegible or date does not match competition log."
                              )
                            }
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}

                      {verif.status === "approved" && verif.payment_status === "pending" && (
                        <button
                          onClick={() =>
                            markPayoutCompleted(
                              verif.id,
                              `TXN-GB-${Date.now().toString().slice(-6)}`
                            )
                          }
                          className="px-4 py-1.5 bg-[#C88D34] hover:bg-[#E09F45] text-[#0D261E] rounded-lg text-xs font-bold shadow-sm"
                        >
                          Mark Payout as Completed (§ 11.04)
                        </button>
                      )}

                      {verif.payment_status === "paid" && (
                        <span className="text-xs text-[#2E6E59] font-mono font-bold">
                          ✓ Dispatched Ref: {verif.payout_reference}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURFACE 05: REPORTS & ANALYTICS (§ 11.05) */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-[#E8DEC0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
              § 11.05 · Operational Metrics
            </span>
            <h2 className="font-serif italic text-2xl font-bold text-[#0D261E]">
              Platform Growth & Impact Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0]">
              <span className="text-[10px] uppercase font-mono text-[#748780] block">
                Total Subscribers
              </span>
              <div className="font-serif italic text-3xl font-black text-[#0D261E]">
                {stats.active_subscribers.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0]">
              <span className="text-[10px] uppercase font-mono text-[#748780] block">
                Charity Raised
              </span>
              <div className="font-serif italic text-3xl font-black text-[#143A2F]">
                £{stats.total_raised_charity.toLocaleString("en-GB")}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0]">
              <span className="text-[10px] uppercase font-mono text-[#748780] block">
                Prizes Distributed
              </span>
              <div className="font-serif italic text-3xl font-black text-[#C88D34]">
                £{stats.total_prize_pool_distributed.toLocaleString("en-GB")}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC0]">
              <span className="text-[10px] uppercase font-mono text-[#748780] block">
                Draws Completed
              </span>
              <div className="font-serif italic text-3xl font-black text-[#0D261E]">
                {stats.draws_completed}
              </div>
            </div>
          </div>

          {/* Historical Draw Performance Table */}
          <div className="pt-4">
            <h4 className="font-serif italic text-lg font-bold text-[#0D261E] mb-3">
              Historical Monthly Draw Performance
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#485953] uppercase font-mono border-b border-[#E8DEC0]">
                  <tr>
                    <th className="p-3">Draw Title</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Winning Balls</th>
                    <th className="p-3">Prize Pool</th>
                    <th className="p-3">Winners (T1 / T2 / T3)</th>
                    <th className="p-3">Rollover Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC0]/60">
                  {draws.map((d) => (
                    <tr key={d.id}>
                      <td className="p-3 font-bold text-[#0D261E]">{d.title}</td>
                      <td className="p-3 capitalize">{d.draw_logic}</td>
                      <td className="p-3">[{d.winning_numbers.join(", ")}]</td>
                      <td className="p-3 font-semibold">
                        £{d.total_prize_pool.toLocaleString("en-GB")}
                      </td>
                      <td className="p-3">
                        {d.tier1_winners_count} / {d.tier2_winners_count} / {d.tier3_winners_count}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#C88D34]">
                        £{d.rollover_jackpot_out.toLocaleString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
