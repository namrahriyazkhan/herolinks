"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    currentUser,
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
    deleteGolfScore,
    adminUpdateUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "users" | "draws" | "charities" | "winners" | "analytics"
  >("draws");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#072847] text-white flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-8 h-8 text-[#C88D34]" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#C88D34] uppercase tracking-wider font-semibold">
            § 03 · RESTRICTED SURFACE
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-normal text-[#072847]">
            Administrator Access Required
          </h2>
          <p className="text-sm text-[#3E5A74] leading-relaxed">
            The Admin Center is restricted to platform tournament directors and auditors. Please sign in with an administrator credential.
          </p>
        </div>
        <div>
          <Link
            href="/login"
            className="px-6 py-3 bg-[#072847] text-white rounded-xl text-sm font-semibold hover:bg-[#0D3B66] transition-all inline-flex items-center gap-2 shadow-md"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="bg-gradient-to-r from-[#041220] via-[#072847] to-[#0D3B66] text-white rounded-3xl p-6 sm:p-8 border border-[#0D3B66]/60 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C88D34]/20 text-[#FFF2BA] text-xs font-semibold border border-[#C88D34]/30">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C88D34]" />
              Platform Administrator Surface (§ 11)
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#FFFDF7]">
              Administrative Operations Console
            </h1>
            <p className="text-xs text-[#C1DBE8] max-w-xl">
              Full control over User Management, Draw Simulations & Publishing, Charity Directory,
              Winner Verification Audits, and Live Analytics.
            </p>
          </div>

          <div className="bg-[#041220]/70 border border-white/15 rounded-2xl p-4 text-xs space-y-1">
            <div className="text-white/60 font-mono">Logged in as:</div>
            <div className="font-bold text-white font-serif text-base">Eleanor Rostova</div>
            <div className="text-[#FFF2BA]">Platform Director</div>
          </div>
        </div>

        {/* 5 Surface Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-8 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab("users")}
            className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "users"
                ? "bg-[#FFF2BA] text-[#072847] font-black shadow-lg ring-2 ring-white/60"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>01 User Mgmt</span>
          </button>

          <button
            onClick={() => setActiveTab("draws")}
            className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "draws"
                ? "bg-[#FFF2BA] text-[#072847] font-black shadow-lg ring-2 ring-white/60"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>02 Draw Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("charities")}
            className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "charities"
                ? "bg-[#FFF2BA] text-[#072847] font-black shadow-lg ring-2 ring-white/60"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>03 Charities</span>
          </button>

          <button
            onClick={() => setActiveTab("winners")}
            className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "winners"
                ? "bg-[#FFF2BA] text-[#072847] font-black shadow-lg ring-2 ring-white/60"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>04 Winners & Proof</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "analytics"
                ? "bg-[#FFF2BA] text-[#072847] font-black shadow-lg ring-2 ring-white/60"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>05 Analytics</span>
          </button>
        </div>
      </div>

      {/* SURFACE 01: USER MANAGEMENT (§ 11.01) */}
      {activeTab === "users" && (
        <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.01 · Subscriber Controls
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#072847]">
                Registered Users & Golf Scores
              </h2>
            </div>
            <div className="text-xs text-[#3E5A74] bg-[#FAF6EB] px-3.5 py-1.5 rounded-lg border border-[#EFE4C4]">
              Total Subscribers: {allUsers.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EB] text-[#3E5A74] uppercase font-mono border-b border-[#EFE4C4]">
                <tr>
                  <th className="p-3">Golfer Name / Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Pledged Charity</th>
                  <th className="p-3">Scores Count</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE4C4]/60">
                {allUsers.map((user) => {
                  const userScoreList = allScores.filter((s) => s.user_id === user.id);
                  const charity = charities.find((c) => c.id === user.charity_id);

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF6EB]/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#072847]">{user.full_name}</div>
                        <div className="text-[11px] text-[#6786A3]">{user.email}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/30"
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
                        <div className="truncate max-w-[140px] font-medium text-[#072847]">
                          {charity?.name}
                        </div>
                        <div className="text-[10px] text-[#C88D34] font-semibold">
                          {user.charity_percentage}% pledge
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[#072847]">
                        {userScoreList.length} / 5 Logged
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedUserForEdit(user);
                            setSelectedUserScores(userScoreList);
                          }}
                          className="px-2.5 py-1 bg-[#072847] text-white rounded-lg text-[11px] font-semibold hover:bg-[#0D3B66]"
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

          {/* User Profile, Subscription & Score Inspector Drawer (§ 11.01) */}
          {selectedUserForEdit && (
            <div className="p-6 bg-[#FAF6EB] border-2 border-[#0D3B66] rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE4C4]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-bold">
                    § 11.01 · Subscriber Control Center
                  </span>
                  <h4 className="font-serif italic font-bold text-2xl text-[#072847]">
                    Managing: {selectedUserForEdit.full_name}
                  </h4>
                  <p className="text-xs text-[#6786A3]">
                    Full operational control over user profile fields, subscription lifecycle, and golf score stamps.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 bg-white border border-[#EFE4C4] rounded-xl text-xs font-semibold hover:bg-[#FAF0CA] transition-colors"
                >
                  Close Editor
                </button>
              </div>

              {/* Section A: Profile & Subscription Management */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-[#EFE4C4]">
                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] uppercase mb-1">
                    Subscription Status
                  </label>
                  <select
                    value={selectedUserForEdit.subscription_status}
                    onChange={(e) => {
                      const newStatus = e.target.value as UserProfile["subscription_status"];
                      adminUpdateUserProfile(selectedUserForEdit.id, { subscription_status: newStatus });
                      setSelectedUserForEdit({ ...selectedUserForEdit, subscription_status: newStatus });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#EFE4C4] bg-[#FAF6EB] text-[#072847]"
                  >
                    <option value="active">Active (Entitled)</option>
                    <option value="lapsed">Lapsed (Payment Retry)</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] uppercase mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={selectedUserForEdit.subscription_tier}
                    onChange={(e) => {
                      const newTier = e.target.value as UserProfile["subscription_tier"];
                      adminUpdateUserProfile(selectedUserForEdit.id, { subscription_tier: newTier });
                      setSelectedUserForEdit({ ...selectedUserForEdit, subscription_tier: newTier });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#EFE4C4] bg-[#FAF6EB] text-[#072847]"
                  >
                    <option value="monthly">Monthly (£15.00/mo)</option>
                    <option value="yearly">Yearly (£150.00/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] uppercase mb-1">
                    Pledged Charity
                  </label>
                  <select
                    value={selectedUserForEdit.charity_id}
                    onChange={(e) => {
                      const newCharity = e.target.value;
                      adminUpdateUserProfile(selectedUserForEdit.id, { charity_id: newCharity });
                      setSelectedUserForEdit({ ...selectedUserForEdit, charity_id: newCharity });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#EFE4C4] bg-[#FAF6EB] text-[#072847]"
                  >
                    {charities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section B: Golf Scores Management (§ 11.01: "Edit golf scores") */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif italic font-bold text-lg text-[#072847]">
                    Current Rolling Five Scores ({selectedUserScores.length}/5)
                  </h5>
                  <span className="text-xs text-[#6786A3]">
                    Only latest 5 are retained in reverse chronological order
                  </span>
                </div>

                {selectedUserScores.length === 0 ? (
                  <p className="text-xs text-[#6786A3] italic">No scores recorded for this user.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {selectedUserScores.map((sc, i) => (
                      <div
                        key={sc.id}
                        className="p-3 bg-white border border-[#EFE4C4] rounded-xl text-center space-y-2 shadow-sm"
                      >
                        <div className="text-[10px] font-mono text-[#6786A3]">Round #{i + 1}</div>
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="45"
                            value={sc.score}
                            onChange={(e) => {
                              const newScoreVal = parseInt(e.target.value, 10);
                              if (newScoreVal >= 1 && newScoreVal <= 45) {
                                updateGolfScore({
                                  id: sc.id,
                                  score: newScoreVal,
                                  playedDate: sc.played_date,
                                  courseName: sc.course_name,
                                  holesPlayed: sc.holes_played,
                                });
                                setSelectedUserScores((prev) =>
                                  prev.map((item) => (item.id === sc.id ? { ...item, score: newScoreVal } : item))
                                );
                              }
                            }}
                            className="w-16 px-2 py-1 text-center font-serif italic text-xl font-bold text-[#072847] border border-[#EFE4C4] rounded-lg"
                          />
                          <span className="text-xs font-semibold text-[#6786A3]">pts</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#6786A3]">{sc.played_date}</div>
                        <div className="text-[10px] text-[#072847] truncate">{sc.course_name}</div>
                        <button
                          type="button"
                          onClick={() => {
                            deleteGolfScore(sc.id);
                            setSelectedUserScores((prev) => prev.filter((item) => item.id !== sc.id));
                          }}
                          className="text-[10px] text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove Round
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SURFACE 02: DRAW MANAGEMENT & SIMULATIONS (§ 11.02) */}
      {activeTab === "draws" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.02 · Draw Engine & Pre-Publish Simulation
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#072847]">
                Configure, Simulate & Publish Monthly Draws
              </h2>
              <p className="text-xs text-[#6786A3] mt-1">
                The PRD requires full simulation before publishing results with automated 40/35/25 tier calculations and rollover logic.
              </p>
            </div>

            <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1">
                  Draw Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  value={drawTitle}
                  onChange={(e) => setDrawTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1">
                  Draw Engine Logic (§ 06)
                </label>
                <select
                  value={drawLogic}
                  onChange={(e) => setDrawLogic(e.target.value as DrawLogicType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847]"
                >
                  <option value="algorithmic">
                    Algorithmic — Weighted by Golfer Score Frequency
                  </option>
                  <option value="random">Random — Standard Fair Lottery Style</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1">
                  Rollover Jackpot from Prior Draw (£)
                </label>
                <input
                  type="number"
                  value={rolloverIn}
                  onChange={(e) => setRolloverIn(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1">
                  Optional Fixed Winning Numbers (e.g. 29, 34, 36, 38, 41) for Testing
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generated draw balls"
                  value={customNumbersInput}
                  onChange={(e) => setCustomNumbersInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EFE4C4] bg-[#FAF6EB] text-sm text-[#072847]"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
                >
                  <Play className="w-4 h-4 text-[#FFF2BA]" />
                  Execute Full Community Simulation (§ 11.02)
                </button>
              </div>
            </form>

            {/* Simulation Preview Card */}
            {simulationResult && (
              <div className="p-6 bg-[#FAF6EB] border-2 border-[#C88D34] rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE4C4]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-bold">
                      Simulation Complete (Draft Mode)
                    </span>
                    <h3 className="font-serif italic text-2xl font-bold text-[#072847]">
                      {simulationResult.draw.title}
                    </h3>
                  </div>

                  <button
                    onClick={handlePublishDraw}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C88D34] hover:bg-[#915E12] text-white font-bold rounded-xl text-sm shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Publish Results to All Subscribers (§ 11.02)
                  </button>
                </div>

                {/* Simulated Numbers */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6786A3] block mb-2">
                    Simulated Winning Balls:
                  </span>
                  <div className="flex gap-2">
                    {simulationResult.draw.winning_numbers.map((num) => (
                      <span
                        key={num}
                        className="w-12 h-12 rounded-full bg-[#072847] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md border-2 border-[#C88D34]"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 40 / 35 / 25 Tier Breakdown (§ 07) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#EFE4C4]">
                    <div className="text-xs text-[#6786A3] uppercase font-mono">
                      Tier 1: 5-Match (40% + Rollover)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#072847]">
                      £{simulationResult.draw.tier1_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#0D3B66] font-medium mt-1">
                      {simulationResult.tier1Winners.length} Winners • £
                      {simulationResult.draw.tier1_payout_per_winner.toLocaleString("en-GB")} each
                    </div>
                    {simulationResult.tier1Winners.length === 0 && (
                      <div className="text-[11px] text-[#C88D34] font-bold mt-1">
                        Unclaimed! £{simulationResult.rolloverCarriedForward.toLocaleString()} carries forward.
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#EFE4C4]">
                    <div className="text-xs text-[#6786A3] uppercase font-mono">
                      Tier 2: 4-Match (35%)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#072847]">
                      £{simulationResult.draw.tier2_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#0D3B66] font-medium mt-1">
                      {simulationResult.tier2Winners.length} Winners • £
                      {simulationResult.draw.tier2_payout_per_winner.toLocaleString("en-GB")} each
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#EFE4C4]">
                    <div className="text-xs text-[#6786A3] uppercase font-mono">
                      Tier 3: 3-Match (25%)
                    </div>
                    <div className="font-serif italic text-2xl font-bold text-[#072847]">
                      £{simulationResult.draw.tier3_pool_share.toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-[#0D3B66] font-medium mt-1">
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
        <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.03 · Cause Ecosystem
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#072847]">
                Add, Edit & Audit Charity Listings
              </h2>
            </div>
            <button
              onClick={() => setIsAddingCharity(!isAddingCharity)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#072847] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3B66]"
            >
              <Plus className="w-4 h-4" />
              {isAddingCharity ? "Cancel Form" : "Add New Partner Charity"}
            </button>
          </div>

          {isAddingCharity && (
            <form
              onSubmit={handleAddCharity}
              className="p-6 bg-[#FAF6EB] border border-[#EFE4C4] rounded-xl space-y-4"
            >
              <h4 className="font-serif italic font-bold text-lg text-[#072847]">
                Register New Charity Organization
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                    Charity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCharityName}
                    onChange={(e) => setNewCharityName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
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
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
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
                <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={newCharityTagline}
                  onChange={(e) => setNewCharityTagline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                  Full Mission Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newCharityDesc}
                  onChange={(e) => setNewCharityDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#072847] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3B66]"
              >
                Save Charity to Directory
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map((charity) => (
              <div
                key={charity.id}
                className="p-4 border border-[#EFE4C4] rounded-xl flex items-center justify-between gap-4 bg-[#FAF6EB]"
              >
                <div>
                  <div className="font-bold text-sm text-[#072847]">{charity.name}</div>
                  <div className="text-xs text-[#6786A3]">{charity.category}</div>
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
        <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
                § 11.04 · Winner Audit & Payout Processing
              </span>
              <h2 className="font-serif italic text-2xl font-bold text-[#072847]">
                Scorecard Proof Submissions
              </h2>
            </div>
            <div className="text-xs text-[#3E5A74] bg-[#FAF6EB] px-3.5 py-1.5 rounded-lg border border-[#EFE4C4]">
              Total Winner Records: {verifications.length}
            </div>
          </div>

          <div className="space-y-4">
            {verifications.map((verif) => (
              <div
                key={verif.id}
                className="p-6 rounded-2xl border border-[#EFE4C4] bg-[#FAF6EB] space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#072847]">
                        {verif.user_name}
                      </span>
                      <span className="text-xs text-[#6786A3]">({verif.user_email})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF2BA] text-[#072847] border border-[#C88D34]/40">
                        Tier {verif.tier} Winner
                      </span>
                    </div>
                    <div className="text-xs text-[#3E5A74]">
                      Draw: <strong>{verif.draw_title}</strong> • Matched: [
                      {verif.matching_numbers.join(", ")}]
                    </div>
                    <div className="text-xs text-[#6786A3]">
                      Platform: <strong>{verif.golf_platform_name}</strong> • Prize:{" "}
                      <strong className="text-[#072847]">
                        £{verif.prize_amount.toLocaleString("en-GB")}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        verif.status === "approved"
                          ? "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/30"
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
                          ? "bg-[#FAF0CA] text-[#072847] border border-[#C88D34]/30"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Payout: {verif.payment_status}
                    </span>
                  </div>
                </div>

                {/* Scorecard Screenshot Preview (§ 09) */}
                <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-[#EFE4C4]">
                  {verif.proof_image_url && (
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[#EFE4C4] bg-white relative shrink-0">
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
                    <div className="text-xs text-[#6786A3]">
                      Admin Feedback Notes:{" "}
                      <span className="text-[#072847] italic">
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
                            className="px-3 py-1.5 bg-[#072847] hover:bg-[#0D3B66] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFF2BA]" />
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
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
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
                          className="px-4 py-1.5 bg-[#C88D34] hover:bg-[#915E12] text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Mark Payout as Completed (§ 11.04)
                        </button>
                      )}

                      {verif.payment_status === "paid" && (
                        <span className="text-xs text-[#0D3B66] font-mono font-bold bg-[#FAF0CA] px-2.5 py-1 rounded-md border border-[#C88D34]/30">
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
        <div className="bg-white border border-[#EFE4C4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C88D34] font-semibold">
              § 11.05 · Operational Metrics
            </span>
            <h2 className="font-serif italic text-2xl font-bold text-[#072847]">
              Platform Growth & Impact Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4]">
              <span className="text-[10px] uppercase font-mono text-[#6786A3] block">
                Total Subscribers
              </span>
              <div className="font-serif italic text-3xl font-black text-[#072847]">
                {stats.active_subscribers.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4]">
              <span className="text-[10px] uppercase font-mono text-[#6786A3] block">
                Charity Raised
              </span>
              <div className="font-serif italic text-3xl font-black text-[#072847]">
                £{stats.total_raised_charity.toLocaleString("en-GB")}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4]">
              <span className="text-[10px] uppercase font-mono text-[#6786A3] block">
                Prizes Distributed
              </span>
              <div className="font-serif italic text-3xl font-black text-[#C88D34]">
                £{stats.total_prize_pool_distributed.toLocaleString("en-GB")}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6EB] border border-[#EFE4C4]">
              <span className="text-[10px] uppercase font-mono text-[#6786A3] block">
                Draws Completed
              </span>
              <div className="font-serif italic text-3xl font-black text-[#072847]">
                {stats.draws_completed}
              </div>
            </div>
          </div>

          {/* Historical Draw Performance Table */}
          <div className="pt-4">
            <h4 className="font-serif italic text-lg font-bold text-[#072847] mb-3">
              Historical Monthly Draw Performance
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6EB] text-[#3E5A74] uppercase font-mono border-b border-[#EFE4C4]">
                  <tr>
                    <th className="p-3">Draw Title</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Winning Balls</th>
                    <th className="p-3">Prize Pool</th>
                    <th className="p-3">Winners (T1 / T2 / T3)</th>
                    <th className="p-3">Rollover Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE4C4]/60">
                  {draws.map((d) => (
                    <tr key={d.id}>
                      <td className="p-3 font-bold text-[#072847]">{d.title}</td>
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
