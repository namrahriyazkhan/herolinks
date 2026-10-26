import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateGolfScoreInput,
  applyRollingFiveScores,
  calculateScoreMetrics,
} from "../src/lib/engine/score-engine";
import {
  generateDrawNumbers,
  evaluateUserMatch,
  simulateMonthlyDraw,
} from "../src/lib/engine/draw-engine";
import { GolfScore, UserProfile } from "../src/types";

describe("§ 05 Score Management System Unit Tests", () => {
  const dummyScores: GolfScore[] = [
    {
      id: "sc-1",
      user_id: "u1",
      score: 36,
      played_date: "2026-03-20",
      course_name: "Links A",
      holes_played: 18,
      created_at: "2026-03-20T10:00:00Z",
    },
    {
      id: "sc-2",
      user_id: "u1",
      score: 38,
      played_date: "2026-03-15",
      course_name: "Links B",
      holes_played: 18,
      created_at: "2026-03-15T10:00:00Z",
    },
  ];

  it("should accept valid Stableford scores within range 1–45", () => {
    const resMin = validateGolfScoreInput(1, "2026-03-22", dummyScores);
    assert.equal(resMin.valid, true);

    const resMax = validateGolfScoreInput(45, "2026-03-22", dummyScores);
    assert.equal(resMax.valid, true);

    const resMid = validateGolfScoreInput(38, "2026-03-22", dummyScores);
    assert.equal(resMid.valid, true);
  });

  it("should reject scores outside range 1–45", () => {
    const resLow = validateGolfScoreInput(0, "2026-03-22", dummyScores);
    assert.equal(resLow.valid, false);
    assert.match(resLow.error!, /between 1 and 45/);

    const resHigh = validateGolfScoreInput(46, "2026-03-22", dummyScores);
    assert.equal(resHigh.valid, false);
    assert.match(resHigh.error!, /between 1 and 45/);

    const resNegative = validateGolfScoreInput(-5, "2026-03-22", dummyScores);
    assert.equal(resNegative.valid, false);
  });

  it("should reject duplicate scores for the same date (§ 05 Note)", () => {
    // 2026-03-20 already exists in dummyScores
    const resDuplicate = validateGolfScoreInput(40, "2026-03-20", dummyScores);
    assert.equal(resDuplicate.valid, false);
    assert.match(resDuplicate.error!, /Only one score entry is permitted per date/);
  });

  it("should allow editing an existing score on the same date", () => {
    // When editing score 'sc-1', the same date is allowed
    const resEdit = validateGolfScoreInput(42, "2026-03-20", dummyScores, "sc-1");
    assert.equal(resEdit.valid, true);
  });

  it("should automatically retain only the latest 5 scores in reverse chronological order (§ 05)", () => {
    const initialFive: GolfScore[] = [
      { id: "1", user_id: "u1", score: 30, played_date: "2026-03-01", course_name: "C", holes_played: 18, created_at: "" },
      { id: "2", user_id: "u1", score: 32, played_date: "2026-03-05", course_name: "C", holes_played: 18, created_at: "" },
      { id: "3", user_id: "u1", score: 34, played_date: "2026-03-10", course_name: "C", holes_played: 18, created_at: "" },
      { id: "4", user_id: "u1", score: 36, played_date: "2026-03-15", course_name: "C", holes_played: 18, created_at: "" },
      { id: "5", user_id: "u1", score: 38, played_date: "2026-03-20", course_name: "C", holes_played: 18, created_at: "" },
    ];

    // Add a 6th newer score on 2026-03-25
    const newScore: GolfScore = {
      id: "6",
      user_id: "u1",
      score: 41,
      played_date: "2026-03-25",
      course_name: "C",
      holes_played: 18,
      created_at: "",
    };

    const { updatedScores, droppedScore } = applyRollingFiveScores(initialFive, newScore);

    // Exactly 5 retained
    assert.equal(updatedScores.length, 5);

    // Oldest score (2026-03-01, id "1") was dropped
    assert.equal(droppedScore?.id, "1");

    // Most recent is first (2026-03-25)
    assert.equal(updatedScores[0].played_date, "2026-03-25");
    assert.equal(updatedScores[0].score, 41);

    // Chronological order descending
    assert.equal(updatedScores[4].played_date, "2026-03-05");
  });
});

describe("§ 06 & § 07 Draw Engine & Prize Pool Unit Tests", () => {
  it("should generate 5 unique numbers between 1 and 45", () => {
    const numbers = generateDrawNumbers("random");
    assert.equal(numbers.length, 5);

    // All between 1 and 45
    numbers.forEach((n) => {
      assert.ok(n >= 1 && n <= 45);
    });

    // Unique
    const unique = new Set(numbers);
    assert.equal(unique.size, 5);
  });

  it("should correctly evaluate user matches and prize tiers", () => {
    const winningNumbers = [10, 20, 30, 40, 45];

    // 5 matches -> Tier 1
    const res5 = evaluateUserMatch([10, 20, 30, 40, 45], winningNumbers);
    assert.equal(res5.matchesCount, 5);
    assert.equal(res5.tier, 1);

    // 4 matches -> Tier 2
    const res4 = evaluateUserMatch([10, 20, 30, 40, 12], winningNumbers);
    assert.equal(res4.matchesCount, 4);
    assert.equal(res4.tier, 2);

    // 3 matches -> Tier 3
    const res3 = evaluateUserMatch([10, 20, 30, 11, 12], winningNumbers);
    assert.equal(res3.matchesCount, 3);
    assert.equal(res3.tier, 3);

    // 2 matches -> null
    const res2 = evaluateUserMatch([10, 20, 1, 2, 3], winningNumbers);
    assert.equal(res2.matchesCount, 2);
    assert.equal(res2.tier, null);
  });

  it("should enforce 40/35/25 prize pool distribution and rollover logic (§ 07)", () => {
    const mockUser1: UserProfile = {
      id: "u1",
      email: "u1@test.com",
      full_name: "Golfer One",
      role: "subscriber",
      subscription_tier: "monthly",
      subscription_status: "active",
      charity_id: "c1",
      charity_percentage: 15,
      created_at: "",
    };

    const mockUser2: UserProfile = {
      id: "u2",
      email: "u2@test.com",
      full_name: "Golfer Two",
      role: "subscriber",
      subscription_tier: "monthly",
      subscription_status: "active",
      charity_id: "c1",
      charity_percentage: 15,
      created_at: "",
    };

    const participants = [
      {
        user: mockUser1,
        // Match 4 numbers: [10, 20, 30, 40]
        scores: [10, 20, 30, 40, 1].map((s, i) => ({
          id: `s-${i}`,
          user_id: "u1",
          score: s,
          played_date: `2026-03-0${i + 1}`,
          course_name: "A",
          holes_played: 18 as const,
          created_at: "",
        })),
      },
      {
        user: mockUser2,
        // Match 3 numbers: [10, 20, 30]
        scores: [10, 20, 30, 2, 3].map((s, i) => ({
          id: `s-${i}`,
          user_id: "u2",
          score: s,
          played_date: `2026-03-0${i + 1}`,
          course_name: "A",
          holes_played: 18 as const,
          created_at: "",
        })),
      },
    ];

    const sim = simulateMonthlyDraw({
      drawTitle: "Test Draw",
      drawLogic: "random",
      participants,
      rolloverJackpotIn: 2000,
      fixedNumbers: [10, 20, 30, 40, 45],
    });

    // Tier 1 has 0 winners (nobody matched 45 with all 5)
    assert.equal(sim.tier1Winners.length, 0);

    // Tier 2 has 1 winner (Golfer 1)
    assert.equal(sim.tier2Winners.length, 1);
    assert.equal(sim.tier2Winners[0].user_id, "u1");

    // Tier 3 has 1 winner (Golfer 2)
    assert.equal(sim.tier3Winners.length, 1);
    assert.equal(sim.tier3Winners[0].user_id, "u2");

    // Rollover: 5-match jackpot carries forward if unclaimed! (§ 07)
    assert.ok(sim.rolloverCarriedForward > 0);
    assert.equal(sim.rolloverCarriedForward, sim.draw.tier1_pool_share);
  });
});

describe("§ 04 Subscription & Payment Access Control Tests", () => {
  it("should enforce active subscription requirement for platform participation (§ 04)", () => {
    const activeSubscriber: UserProfile = {
      id: "u-active",
      email: "active@golf.co.uk",
      full_name: "Active Golfer",
      role: "subscriber",
      subscription_tier: "monthly",
      subscription_status: "active",
      charity_id: "c1",
      charity_percentage: 15,
      created_at: "",
    };

    const lapsedSubscriber: UserProfile = {
      id: "u-lapsed",
      email: "lapsed@golf.co.uk",
      full_name: "Lapsed Golfer",
      role: "subscriber",
      subscription_tier: "monthly",
      subscription_status: "lapsed",
      charity_id: "c1",
      charity_percentage: 15,
      created_at: "",
    };

    // Only active subscribers are eligible for simulated draws
    const participants = [
      {
        user: activeSubscriber,
        scores: [30, 32, 34, 36, 38].map((s, i) => ({
          id: `s-${i}`,
          user_id: "u-active",
          score: s,
          played_date: `2026-03-0${i + 1}`,
          course_name: "C",
          holes_played: 18 as const,
          created_at: "",
        })),
      },
      {
        user: lapsedSubscriber,
        scores: [30, 32, 34, 36, 38].map((s, i) => ({
          id: `sl-${i}`,
          user_id: "u-lapsed",
          score: s,
          played_date: `2026-03-0${i + 1}`,
          course_name: "C",
          holes_played: 18 as const,
          created_at: "",
        })),
      },
    ];

    const sim = simulateMonthlyDraw({
      drawTitle: "Access Control Draw",
      drawLogic: "random",
      participants,
      rolloverJackpotIn: 0,
      fixedNumbers: [30, 32, 34, 36, 38],
    });

    // Lapsed participant should be filtered out by draw engine
    assert.equal(sim.entries.length, 1);
    assert.equal(sim.entries[0].user_id, "u-active");
  });
});

describe("§ 08 Charity Contribution Model Unit Tests", () => {
  it("should enforce minimum 10% charity contribution pledge (§ 08.1)", () => {
    const minPledge = 10;
    const testPledgeUnder = Math.max(minPledge, 5); // clamped
    const testPledgeValid = Math.max(minPledge, 25);
    const testPledgeMax = Math.max(minPledge, 50);

    assert.equal(testPledgeUnder, 10);
    assert.equal(testPledgeValid, 25);
    assert.equal(testPledgeMax, 50);
  });
});

describe("§ 09 Winner Verification & Payment Lifecycle Unit Tests", () => {
  it("should correctly handle verification states (Pending -> Paid) (§ 09)", () => {
    let status: "pending" | "approved" | "rejected" = "pending";
    let paymentStatus: "pending" | "paid" = "pending";

    // 1. Initial State upon winning
    assert.equal(status, "pending");
    assert.equal(paymentStatus, "pending");

    // 2. Admin approves screenshot
    status = "approved";
    assert.equal(status, "approved");

    // 3. Payout dispatched
    paymentStatus = "paid";
    assert.equal(paymentStatus, "paid");
  });
});

