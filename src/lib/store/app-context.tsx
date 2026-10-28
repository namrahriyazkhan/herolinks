"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Charity,
  Donation,
  Draw,
  DrawEntry,
  GolfScore,
  PlatformStats,
  SubscriptionTier,
  UserProfile,
  UserRole,
  WinnerVerification,
} from "@/types";
import {
  DEMO_USERS,
  INITIAL_CHARITIES,
  INITIAL_DRAWS,
  INITIAL_PLATFORM_STATS,
  INITIAL_SCORES,
  INITIAL_VERIFICATIONS,
} from "@/lib/db/mock-data";
import {
  applyRollingFiveScores,
  validateGolfScoreInput,
} from "@/lib/engine/score-engine";
import {
  SimulationParticipant,
  simulateMonthlyDraw,
} from "@/lib/engine/draw-engine";

interface AppContextType {
  // Auth & Session
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  switchUserRole: (role: UserRole) => void;
  setCurrentUserById: (userId: string) => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  signupUser: (params: {
    fullName: string;
    email: string;
    role: UserRole;
    subscriptionTier: SubscriptionTier;
    charityId: string;
    charityPercentage: number;
    homeClub?: string;
    handicap?: number;
  }) => UserProfile;
  logout: () => void;

  // Scores (§ 05)
  userScores: GolfScore[];
  allScores: GolfScore[];
  addGolfScore: (params: {
    score: number;
    playedDate: string;
    courseName: string;
    holesPlayed?: 9 | 18;
    userId?: string;
  }) => { success: boolean; error?: string; droppedOldest?: boolean };
  updateGolfScore: (params: {
    id: string;
    score: number;
    playedDate: string;
    courseName: string;
    holesPlayed?: 9 | 18;
  }) => { success: boolean; error?: string };
  deleteGolfScore: (scoreId: string) => void;

  // Subscriptions & Giving (§ 04 & § 08)
  updateSubscriptionSettings: (params: {
    tier?: SubscriptionTier;
    charityId?: string;
    charityPercentage?: number;
    status?: "active" | "inactive" | "lapsed" | "cancelled";
  }) => void;
  reactivateSubscription: (tier?: SubscriptionTier) => void;
  adminUpdateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  makeDirectDonation: (params: {
    charityId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    message?: string;
  }) => void;

  // Charities (§ 08 & § 11.03)
  charities: Charity[];
  addCharity: (charity: Omit<Charity, "id" | "total_raised">) => void;
  updateCharity: (charity: Charity) => void;
  deleteCharity: (charityId: string) => void;

  // Draws & Reward Engine (§ 06, § 07, § 11.02)
  draws: Draw[];
  activeJackpot: number;
  latestPublishedDraw: Draw | null;
  runSimulation: (params: {
    drawTitle: string;
    drawLogic: "random" | "algorithmic";
    rolloverIn: number;
    fixedNumbers?: number[];
  }) => ReturnType<typeof simulateMonthlyDraw>;
  publishSimulatedDraw: (simResult: ReturnType<typeof simulateMonthlyDraw>) => void;

  // Winner Verification & Payouts (§ 09, § 10, § 11.04)
  verifications: WinnerVerification[];
  userVerifications: WinnerVerification[];
  submitWinnerProof: (params: {
    drawEntryId: string;
    drawId: string;
    drawTitle: string;
    prizeAmount: number;
    tier: 1 | 2 | 3;
    matchesCount: number;
    matchingNumbers: number[];
    golfPlatform: "HowDidiDo" | "GHIN" | "Golf Ireland" | "England Golf" | "Other Club App";
    proofImageUrl: string;
  }) => void;
  reviewVerification: (
    verificationId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => void;
  markPayoutCompleted: (verificationId: string, reference: string) => void;

  // Stats (§ 11.05)
  stats: PlatformStats;
  donations: Donation[];

  // Evaluator Helper
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "digital_heroes_app_state_v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Users
  const [allUsers, setAllUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // Default to Public Visitor (Requires Login/Signup)

  // Scores
  const [allScores, setAllScores] = useState<GolfScore[]>(INITIAL_SCORES);

  // Charities
  const [charities, setCharities] = useState<Charity[]>(INITIAL_CHARITIES);

  // Draws
  const [draws, setDraws] = useState<Draw[]>(INITIAL_DRAWS);

  // Verifications
  const [verifications, setVerifications] =
    useState<WinnerVerification[]>(INITIAL_VERIFICATIONS);

  // Direct donations
  const [donations, setDonations] = useState<Donation[]>([]);

  // Stats
  const [stats, setStats] = useState<PlatformStats>(INITIAL_PLATFORM_STATS);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.allUsers) setAllUsers(parsed.allUsers);
        if (parsed.currentUserId) {
          const user = parsed.allUsers?.find(
            (u: UserProfile) => u.id === parsed.currentUserId
          );
          if (user) setCurrentUser(user);
        }
        if (parsed.allScores) setAllScores(parsed.allScores);
        if (parsed.charities) setCharities(parsed.charities);
        if (parsed.draws) setDraws(parsed.draws);
        if (parsed.verifications) setVerifications(parsed.verifications);
        if (parsed.donations) setDonations(parsed.donations);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const payload = {
        allUsers,
        currentUserId: currentUser ? currentUser.id : null,
        allScores,
        charities,
        draws,
        verifications,
        donations,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [allUsers, currentUser, allScores, charities, draws, verifications, donations]);

  // Derived user scores (sorted reverse chronological)
  const userScores = currentUser
    ? allScores
        .filter((s) => s.user_id === currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.played_date).getTime() - new Date(a.played_date).getTime()
        )
    : [];

  // Derived user verifications
  const userVerifications = currentUser
    ? verifications.filter((v) => v.user_id === currentUser.id)
    : [];

  // Latest published draw
  const publishedDraws = draws
    .filter((d) => d.status === "published")
    .sort(
      (a, b) =>
        new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime()
    );
  const latestPublishedDraw = publishedDraws.length > 0 ? publishedDraws[0] : null;

  // Active rollover jackpot
  const activeJackpot = latestPublishedDraw
    ? latestPublishedDraw.rollover_jackpot_out > 0
      ? latestPublishedDraw.rollover_jackpot_out
      : latestPublishedDraw.active_jackpot
    : 12500;

  // 1. Role switcher & user selection
  const switchUserRole = (role: UserRole) => {
    if (role === "admin") {
      const adminUser =
        allUsers.find((u) => u.role === "admin") || DEMO_USERS[1];
      setCurrentUser(adminUser);
    } else {
      const golferUser =
        allUsers.find((u) => u.role === "subscriber") || DEMO_USERS[0];
      setCurrentUser(golferUser);
    }
  };

  const setCurrentUserById = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const loginUser = (email: string, role?: UserRole): boolean => {
    const user = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (!role || u.role === role)
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signupUser = (params: {
    fullName: string;
    email: string;
    role: UserRole;
    subscriptionTier: SubscriptionTier;
    charityId: string;
    charityPercentage: number;
    homeClub?: string;
    handicap?: number;
  }): UserProfile => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: params.email,
      full_name: params.fullName,
      role: params.role,
      subscription_tier: params.subscriptionTier,
      subscription_status: "active",
      subscription_renews_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      charity_id: params.charityId || "charity-youth-on-course",
      charity_percentage: Math.max(10, params.charityPercentage || 10),
      home_club: params.homeClub,
      handicap: params.handicap,
      created_at: new Date().toISOString(),
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Update stats
    setStats((prev) => ({
      ...prev,
      active_subscribers: prev.active_subscribers + 1,
    }));

    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // 2. Score Management (§ 05 & § 04 Access Control)
  const addGolfScore = (params: {
    score: number;
    playedDate: string;
    courseName: string;
    holesPlayed?: 9 | 18;
    userId?: string;
  }) => {
    const targetUserId = params.userId || currentUser?.id;
    if (!targetUserId) return { success: false, error: "Authentication required." };

    // § 04 ACCESS CONTROL & VALIDATION: Real-time check
    const targetUser = allUsers.find((u) => u.id === targetUserId);
    if (!targetUser || targetUser.subscription_status !== "active") {
      return {
        success: false,
        error:
          "Access Restricted (§ 04): An active subscription is required to record golf scores and enter monthly draws.",
      };
    }

    const targetUserScores = allScores.filter((s) => s.user_id === targetUserId);

    // Validation
    const validation = validateGolfScoreInput(
      params.score,
      params.playedDate,
      targetUserScores
    );

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const newScore: GolfScore = {
      id: `sc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: targetUserId,
      score: params.score,
      played_date: params.playedDate,
      course_name: params.courseName || "Links Championship Course",
      holes_played: params.holesPlayed || 18,
      created_at: new Date().toISOString(),
    };

    // Apply rolling 5 scores rule
    const { updatedScores, droppedScore } = applyRollingFiveScores(
      targetUserScores,
      newScore
    );

    // Replace scores in global score table for this user
    setAllScores((prev) => {
      const otherUsersScores = prev.filter((s) => s.user_id !== targetUserId);
      return [...otherUsersScores, ...updatedScores];
    });

    return {
      success: true,
      droppedOldest: Boolean(droppedScore),
    };
  };

  const updateGolfScore = (params: {
    id: string;
    score: number;
    playedDate: string;
    courseName: string;
    holesPlayed?: 9 | 18;
  }) => {
    const existing = allScores.find((s) => s.id === params.id);
    if (!existing) return { success: false, error: "Score not found." };

    const userExistingScores = allScores.filter(
      (s) => s.user_id === existing.user_id
    );

    const validation = validateGolfScoreInput(
      params.score,
      params.playedDate,
      userExistingScores,
      params.id
    );

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const updated: GolfScore = {
      ...existing,
      score: params.score,
      played_date: params.playedDate,
      course_name: params.courseName,
      holes_played: params.holesPlayed || 18,
    };

    setAllScores((prev) => prev.map((s) => (s.id === params.id ? updated : s)));
    return { success: true };
  };

  const deleteGolfScore = (scoreId: string) => {
    setAllScores((prev) => prev.filter((s) => s.id !== scoreId));
  };

  // 3. Subscription Lifecycle & Giving (§ 04, § 08, § 11.01)
  const updateSubscriptionSettings = (params: {
    tier?: SubscriptionTier;
    charityId?: string;
    charityPercentage?: number;
    status?: "active" | "inactive" | "lapsed" | "cancelled";
  }) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated: UserProfile = {
        ...prev,
        subscription_tier: params.tier ?? prev.subscription_tier,
        charity_id: params.charityId ?? prev.charity_id,
        charity_percentage: params.charityPercentage
          ? Math.max(10, params.charityPercentage)
          : prev.charity_percentage,
        subscription_status: params.status ?? prev.subscription_status,
      };

      setAllUsers((users) =>
        users.map((u) => (u.id === prev.id ? updated : u))
      );
      return updated;
    });
  };

  const reactivateSubscription = (tier?: SubscriptionTier) => {
    if (!currentUser) return;
    const renewDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const updatedTier = tier || currentUser.subscription_tier || "monthly";

    setCurrentUser((prev) => {
      const up: UserProfile = {
        ...prev,
        subscription_status: "active",
        subscription_tier: updatedTier,
        subscription_renews_at: renewDate,
      };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? up : u)));
      return up;
    });
  };

  const adminUpdateUserProfile = (
    userId: string,
    updates: Partial<UserProfile>
  ) => {
    setAllUsers((users) =>
      users.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const makeDirectDonation = (params: {
    charityId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    message?: string;
  }) => {
    const targetCharity = charities.find((c) => c.id === params.charityId);
    if (!targetCharity) return;

    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      user_id: currentUser.id,
      charity_id: params.charityId,
      charity_name: targetCharity.name,
      amount: params.amount,
      donation_type: "independent_gift",
      donor_name: params.donorName,
      donor_email: params.donorEmail,
      message: params.message,
      created_at: new Date().toISOString(),
    };

    setDonations((prev) => [newDonation, ...prev]);

    // Update charity total raised
    setCharities((prev) =>
      prev.map((c) =>
        c.id === params.charityId
          ? { ...c, total_raised: c.total_raised + params.amount }
          : c
      )
    );

    // Update global stats
    setStats((prev) => ({
      ...prev,
      total_raised_charity: prev.total_raised_charity + params.amount,
    }));
  };

  // 4. Charities Management (§ 11.03)
  const addCharity = (charityData: Omit<Charity, "id" | "total_raised">) => {
    const newCharity: Charity = {
      ...charityData,
      id: `charity-${Date.now()}`,
      total_raised: 0,
    };
    setCharities((prev) => [newCharity, ...prev]);
  };

  const updateCharity = (updatedCharity: Charity) => {
    setCharities((prev) =>
      prev.map((c) => (c.id === updatedCharity.id ? updatedCharity : c))
    );
  };

  const deleteCharity = (charityId: string) => {
    setCharities((prev) => prev.filter((c) => c.id !== charityId));
  };

  // 5. Draw Management & Simulation (§ 06, § 07, § 11.02)
  const runSimulation = (params: {
    drawTitle: string;
    drawLogic: "random" | "algorithmic";
    rolloverIn: number;
    fixedNumbers?: number[];
  }) => {
    // Build participants list from all active users and their scores
    const participants: SimulationParticipant[] = allUsers.map((user) => ({
      user,
      scores: allScores
        .filter((s) => s.user_id === user.id)
        .sort(
          (a, b) =>
            new Date(b.played_date).getTime() -
            new Date(a.played_date).getTime()
        )
        .slice(0, 5),
    }));

    return simulateMonthlyDraw({
      drawTitle: params.drawTitle,
      drawLogic: params.drawLogic,
      participants,
      rolloverJackpotIn: params.rolloverIn,
      fixedNumbers: params.fixedNumbers,
    });
  };

  const publishSimulatedDraw = (
    simResult: ReturnType<typeof simulateMonthlyDraw>
  ) => {
    const publishedDraw: Draw = {
      ...simResult.draw,
      status: "published",
      published_at: new Date().toISOString(),
    };

    setDraws((prev) => [publishedDraw, ...prev]);

    // Create winner verification records for all winners in tier 1, 2, and 3
    const allWinners = [
      ...simResult.tier1Winners,
      ...simResult.tier2Winners,
      ...simResult.tier3Winners,
    ];

    const newVerifications: WinnerVerification[] = allWinners.map((w, idx) => ({
      id: `verif-pub-${publishedDraw.id}-${idx}`,
      draw_entry_id: w.id,
      user_id: w.user_id,
      user_name: w.user_name,
      user_email: w.user_email,
      draw_id: publishedDraw.id,
      draw_title: publishedDraw.title,
      prize_amount: w.prize_amount,
      tier: w.tier as 1 | 2 | 3,
      matches_count: w.matches_count,
      matching_numbers: w.matching_numbers,
      golf_platform_name: "HowDidiDo",
      proof_image_url:
        "https://images.unsplash.com/photo-1593111774642-a14644a4fa85?auto=format&fit=crop&w=800&q=80",
      status: "pending",
      payment_status: "pending",
      submitted_at: new Date().toISOString(),
    }));

    setVerifications((prev) => [...newVerifications, ...prev]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      draws_completed: prev.draws_completed + 1,
      total_prize_pool_distributed:
        prev.total_prize_pool_distributed + publishedDraw.total_prize_pool,
      current_jackpot:
        publishedDraw.rollover_jackpot_out > 0
          ? publishedDraw.rollover_jackpot_out
          : 5000,
    }));
  };

  // 6. Winner Verification Pipeline (§ 09, § 11.04)
  const submitWinnerProof = (params: {
    drawEntryId: string;
    drawId: string;
    drawTitle: string;
    prizeAmount: number;
    tier: 1 | 2 | 3;
    matchesCount: number;
    matchingNumbers: number[];
    golfPlatform: "HowDidiDo" | "GHIN" | "Golf Ireland" | "England Golf" | "Other Club App";
    proofImageUrl: string;
  }) => {
    const existingIndex = verifications.findIndex(
      (v) => v.draw_entry_id === params.drawEntryId
    );

    if (existingIndex >= 0) {
      setVerifications((prev) => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          proof_image_url: params.proofImageUrl,
          golf_platform_name: params.golfPlatform,
          status: "pending",
        };
        return copy;
      });
    } else {
      const newVerif: WinnerVerification = {
        id: `verif-${Date.now()}`,
        draw_entry_id: params.drawEntryId,
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        user_email: currentUser.email,
        draw_id: params.drawId,
        draw_title: params.drawTitle,
        prize_amount: params.prizeAmount,
        tier: params.tier,
        matches_count: params.matchesCount,
        matching_numbers: params.matchingNumbers,
        golf_platform_name: params.golfPlatform,
        proof_image_url: params.proofImageUrl,
        status: "pending",
        payment_status: "pending",
        submitted_at: new Date().toISOString(),
      };
      setVerifications((prev) => [newVerif, ...prev]);
    }
  };

  const reviewVerification = (
    verificationId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? {
              ...v,
              status,
              admin_notes: notes || v.admin_notes,
              reviewed_at: new Date().toISOString(),
            }
          : v
      )
    );
  };

  const markPayoutCompleted = (verificationId: string, reference: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? {
              ...v,
              payment_status: "paid",
              payout_reference: reference,
              paid_at: new Date().toISOString(),
            }
          : v
      )
    );
  };

  const resetDemoState = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
    }
    setAllUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    setAllScores(INITIAL_SCORES);
    setCharities(INITIAL_CHARITIES);
    setDraws(INITIAL_DRAWS);
    setVerifications(INITIAL_VERIFICATIONS);
    setStats(INITIAL_PLATFORM_STATS);
    setDonations([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUserRole,
        setCurrentUserById,
        loginUser,
        signupUser,
        logout,
        userScores,
        allScores,
        addGolfScore,
        updateGolfScore,
        deleteGolfScore,
        updateSubscriptionSettings,
        reactivateSubscription,
        adminUpdateUserProfile,
        makeDirectDonation,
        charities,
        addCharity,
        updateCharity,
        deleteCharity,
        draws,
        activeJackpot,
        latestPublishedDraw,
        runSimulation,
        publishSimulatedDraw,
        verifications,
        userVerifications,
        submitWinnerProof,
        reviewVerification,
        markPayoutCompleted,
        stats,
        donations,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
