import { Draw, DrawEntry, DrawLogicType, GolfScore, UserProfile } from "@/types";

export const POOL_PORTION_PERCENTAGE = 0.50; // 50% of subscription fee to prize pool
export const MONTHLY_SUBSCRIPTION_FEE = 15.00; // £15.00 or $15.00 base
export const TIER1_PERCENTAGE = 0.40; // 40% 5-match
export const TIER2_PERCENTAGE = 0.35; // 35% 4-match
export const TIER3_PERCENTAGE = 0.25; // 25% 3-match

/**
 * Generate 5 unique numbers between 1 and 45.
 * Mode "random": True uniform random selection without replacement.
 * Mode "algorithmic": Weighted by frequency of submitted scores across the golfer community.
 */
export function generateDrawNumbers(
  logic: DrawLogicType,
  allSubmittedScores: number[] = []
): number[] {
  const TOTAL_NUMBERS = 45;
  const NUMBERS_TO_DRAW = 5;

  if (logic === "algorithmic" && allSubmittedScores.length >= 15) {
    // Build frequency distribution
    const frequencyMap = new Map<number, number>();
    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
      frequencyMap.set(i, 1); // laplace smoothing
    }
    for (const score of allSubmittedScores) {
      if (score >= 1 && score <= 45) {
        frequencyMap.set(score, (frequencyMap.get(score) || 1) + 2);
      }
    }

    const drawn = new Set<number>();
    while (drawn.size < NUMBERS_TO_DRAW) {
      // Roulette wheel selection
      let totalWeight = 0;
      for (let i = 1; i <= TOTAL_NUMBERS; i++) {
        if (!drawn.has(i)) {
          totalWeight += frequencyMap.get(i) || 1;
        }
      }

      let randomWeight = Math.random() * totalWeight;
      for (let i = 1; i <= TOTAL_NUMBERS; i++) {
        if (drawn.has(i)) continue;
        const weight = frequencyMap.get(i) || 1;
        if (randomWeight <= weight) {
          drawn.add(i);
          break;
        }
        randomWeight -= weight;
      }
    }
    return Array.from(drawn).sort((a, b) => a - b);
  }

  // Pure random standard lottery style
  const pool = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
  const selected: number[] = [];

  for (let i = 0; i < NUMBERS_TO_DRAW; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    selected.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }

  return selected.sort((a, b) => a - b);
}

/**
 * Calculates number of matches between user's 5 scores and winning 5 numbers.
 */
export function evaluateUserMatch(userScores: number[], winningNumbers: number[]) {
  const winSet = new Set(winningNumbers);
  const matching = userScores.filter((score) => winSet.has(score));
  const uniqueMatches = Array.from(new Set(matching)).sort((a, b) => a - b);
  const matchCount = uniqueMatches.length;

  let tier: 1 | 2 | 3 | null = null;
  if (matchCount >= 5) {
    tier = 1;
  } else if (matchCount === 4) {
    tier = 2;
  } else if (matchCount === 3) {
    tier = 3;
  }

  return {
    matchesCount: matchCount,
    matchingNumbers: uniqueMatches,
    tier,
  };
}

export interface SimulationParticipant {
  user: UserProfile;
  scores: GolfScore[];
}

export interface SimulationResult {
  draw: Draw;
  entries: DrawEntry[];
  tier1Winners: DrawEntry[];
  tier2Winners: DrawEntry[];
  tier3Winners: DrawEntry[];
  rolloverCarriedForward: number;
}

/**
 * Runs a full simulation of the draw according to § 06 & § 07:
 * - Calculates active subscriber base and prize pool
 * - Calculates 40/35/25 tier shares
 * - Incorporates rollover jackpot into Tier 1
 * - Evaluates all active participants
 * - Splits tier shares equally among tier winners
 * - Rolls over Tier 1 share to next month if 0 winners in Tier 1
 */
export function simulateMonthlyDraw(params: {
  drawId?: string;
  drawTitle: string;
  drawDate?: string;
  drawLogic: DrawLogicType;
  participants: SimulationParticipant[];
  rolloverJackpotIn: number;
  fixedNumbers?: number[]; // optional manual override for testing
}): SimulationResult {
  const {
    drawId = `draw-${Date.now()}`,
    drawTitle,
    drawDate = new Date().toISOString(),
    drawLogic,
    participants,
    rolloverJackpotIn = 0,
    fixedNumbers,
  } = params;

  // Collect all eligible scores
  const allEligibleScores: number[] = [];
  participants.forEach((p) => {
    if (p.scores.length === 5) {
      p.scores.forEach((s) => allEligibleScores.push(s.score));
    }
  });

  const winningNumbers =
    fixedNumbers && fixedNumbers.length === 5
      ? [...fixedNumbers].sort((a, b) => a - b)
      : generateDrawNumbers(drawLogic, allEligibleScores);

  // Pool calculations
  const activeSubscribersCount = participants.filter(
    (p) => p.user.subscription_status === "active"
  ).length;

  // Minimum simulated base pool if small user count to keep excitement realistic
  const subscriberPool = Math.max(
    activeSubscribersCount * MONTHLY_SUBSCRIPTION_FEE * POOL_PORTION_PERCENTAGE,
    1500 // baseline seed pool
  );

  const baseTier1 = subscriberPool * TIER1_PERCENTAGE;
  const baseTier2 = subscriberPool * TIER2_PERCENTAGE;
  const baseTier3 = subscriberPool * TIER3_PERCENTAGE;

  // Tier 1 receives the rollover jackpot from previous draws
  const totalTier1Pool = baseTier1 + rolloverJackpotIn;
  const totalPrizePool = subscriberPool + rolloverJackpotIn;

  // Process all entries
  const entries: DrawEntry[] = [];
  const tier1Winners: DrawEntry[] = [];
  const tier2Winners: DrawEntry[] = [];
  const tier3Winners: DrawEntry[] = [];

  for (const p of participants) {
    if (p.user.subscription_status !== "active" || p.scores.length !== 5) {
      continue;
    }

    const scoreNumbers = p.scores.map((s) => s.score);
    const evalResult = evaluateUserMatch(scoreNumbers, winningNumbers);

    const entry: DrawEntry = {
      id: `entry-${p.user.id}-${Date.now()}`,
      draw_id: drawId,
      user_id: p.user.id,
      user_name: p.user.full_name,
      user_email: p.user.email,
      submitted_scores: scoreNumbers,
      matches_count: evalResult.matchesCount,
      matching_numbers: evalResult.matchingNumbers,
      tier: evalResult.tier,
      prize_amount: 0,
      created_at: new Date().toISOString(),
    };

    if (evalResult.tier === 1) {
      tier1Winners.push(entry);
    } else if (evalResult.tier === 2) {
      tier2Winners.push(entry);
    } else if (evalResult.tier === 3) {
      tier3Winners.push(entry);
    }

    entries.push(entry);
  }

  // Calculate payouts per tier (split equally)
  const tier1Payout =
    tier1Winners.length > 0
      ? Math.round((totalTier1Pool / tier1Winners.length) * 100) / 100
      : 0;

  const tier2Payout =
    tier2Winners.length > 0
      ? Math.round((baseTier2 / tier2Winners.length) * 100) / 100
      : 0;

  const tier3Payout =
    tier3Winners.length > 0
      ? Math.round((baseTier3 / tier3Winners.length) * 100) / 100
      : 0;

  tier1Winners.forEach((w) => (w.prize_amount = tier1Payout));
  tier2Winners.forEach((w) => (w.prize_amount = tier2Payout));
  tier3Winners.forEach((w) => (w.prize_amount = tier3Payout));

  // Jackpot rollover logic (§ 07):
  // "5-match jackpot carries forward if unclaimed"
  const rolloverCarriedForward =
    tier1Winners.length === 0 ? totalTier1Pool : 0;

  const draw: Draw = {
    id: drawId,
    title: drawTitle,
    draw_date: drawDate,
    status: "simulated",
    draw_logic: drawLogic,
    winning_numbers: winningNumbers,
    total_subscribers: activeSubscribersCount,
    active_jackpot: totalTier1Pool,
    subscription_fee_per_user: MONTHLY_SUBSCRIPTION_FEE,
    rollover_jackpot_in: rolloverJackpotIn,
    total_prize_pool: Math.round(totalPrizePool * 100) / 100,
    tier1_pool_share: Math.round(totalTier1Pool * 100) / 100,
    tier2_pool_share: Math.round(baseTier2 * 100) / 100,
    tier3_pool_share: Math.round(baseTier3 * 100) / 100,
    tier1_winners_count: tier1Winners.length,
    tier2_winners_count: tier2Winners.length,
    tier3_winners_count: tier3Winners.length,
    tier1_payout_per_winner: tier1Payout,
    tier2_payout_per_winner: tier2Payout,
    tier3_payout_per_winner: tier3Payout,
    rollover_jackpot_out: Math.round(rolloverCarriedForward * 100) / 100,
    created_at: new Date().toISOString(),
  };

  return {
    draw,
    entries,
    tier1Winners,
    tier2Winners,
    tier3Winners,
    rolloverCarriedForward: Math.round(rolloverCarriedForward * 100) / 100,
  };
}
